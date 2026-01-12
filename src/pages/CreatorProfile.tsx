import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Profile, detectPlatform } from "@/types/profile";
import { Share2, Radio, Loader2, Play } from "lucide-react";
import { motion } from "framer-motion";
import PlatformIcon from "@/components/profile/PlatformIcon";
import { useMemo, useEffect, useState } from "react";
import { toast } from "sonner";

// Cache helpers
const CACHE_PREFIX = "creator_profile_";
const getCachedProfile = (id: string): Profile | null => {
  try {
    const cached = localStorage.getItem(CACHE_PREFIX + id);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
};
const setCachedProfile = (id: string, profile: Profile) => {
  try {
    localStorage.setItem(CACHE_PREFIX + id, JSON.stringify(profile));
  } catch {
    // localStorage full or unavailable
  }
};

// API response type (matches your backend structure)
interface APIResponse {
  username: string;
  displayName: string;
  bio: string;
  avatar: string;
  theme: {
    backgroundColor: string;
    backgroundGradient?: string;
    backgroundImage?: string;
    buttonStyle: string;
    cardColor: string;
    cardTextColor: string;
    textColor: string;
    fontFamily: string;
    customFontUrl?: string;
  };
  links: Array<{
    id: string;
    title: string;
    url: string;
    thumbnail?: string;
    enabled: boolean;
    isFeatured?: boolean;
    badge?: string;
    customBadge?: {
      text: string;
      backgroundColor: string;
      textColor: string;
    };
    twStatus?: boolean; // Twitch live status from API
  }>;
  featuredVideo?: {
    url: string;
    title?: string;
    thumbnail?: string;
    platform?: string;
    type?: 1 | 2 | 3;
  };
}

// Transform API response to Profile type
const transformAPIResponse = (data: APIResponse): Profile => ({
  username: data.username,
  displayName: data.displayName,
  bio: data.bio,
  avatar: data.avatar,
  theme: {
    id: "custom",
    name: "Custom",
    backgroundColor: data.theme.backgroundColor,
    backgroundGradient: data.theme.backgroundGradient,
    backgroundImage: data.theme.backgroundImage,
    cardColor: data.theme.cardColor,
    cardTextColor: data.theme.cardTextColor,
    textColor: data.theme.textColor,
    buttonStyle: (data.theme.buttonStyle as "rounded" | "pill" | "square") || "rounded",
    fontFamily: data.theme.fontFamily || "system-ui",
    customFontUrl: data.theme.customFontUrl,
    isCustom: true,
  },
  links: data.links.map((link) => ({
    id: link.id,
    title: link.title,
    url: link.url,
    thumbnail: link.thumbnail,
    enabled: link.enabled,
    isFeatured: link.isFeatured,
    badge: link.badge as "NEW" | "HOT" | "SALE" | "CUSTOM" | null | undefined,
    customBadge: link.customBadge,
    twStatus: link.twStatus,
  })),
  featuredVideo:
    data.featuredVideo && data.featuredVideo.url
      ? {
          url: data.featuredVideo.url,
          title: data.featuredVideo.title,
          thumbnail: data.featuredVideo.thumbnail,
          platform: data.featuredVideo.platform as "youtube" | "twitch" | "tiktok",
          type: (data.featuredVideo as any).type as 1 | 2 | 3 | undefined,
        }
      : undefined,
});

// API fetch function
const fetchCreatorProfile = async (id: string): Promise<Profile> => {
  const response = await fetch(`https://api.crewmaster.net/v2/getCreatorLinks/${id}`);
  if (!response.ok) {
    throw new Error("Profile not found");
  }
  const data: APIResponse = await response.json();
  return transformAPIResponse(data);
};

const CreatorProfile = () => {
  const { id } = useParams<{ id: string }>();

  // Get cached profile for instant display
  const cachedProfile = useMemo(() => (id ? getCachedProfile(id) : null), [id]);

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["creator-profile", id],
    queryFn: () => fetchCreatorProfile(id!),
    enabled: !!id,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 min stale time
  });

  // Save fresh data to cache
  useEffect(() => {
    if (profile && id) {
      setCachedProfile(id, profile);
    }
  }, [profile, id]);

  // Use cached or fresh profile
  const displayProfile = profile || cachedProfile;

  // YouTube oEmbed for featured video missing title/thumbnail
  const [enrichedFeaturedVideo, setEnrichedFeaturedVideo] = useState(displayProfile?.featuredVideo);

  useEffect(() => {
    const fetchVideoInfo = async () => {
      const fv = displayProfile?.featuredVideo;
      if (!fv?.url) {
        setEnrichedFeaturedVideo(undefined);
        return;
      }

      const needsTitle = !fv.title;
      const needsThumbnail = !fv.thumbnail;

      if (!needsTitle && !needsThumbnail) {
        setEnrichedFeaturedVideo(fv);
        return;
      }

      let finalUrl = fv.url;

      // Follow redirects by fetching the URL and checking for YouTube pattern
      const ytMatch = fv.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);

      if (!ytMatch) {
        // URL might be a redirect - try to resolve it via oEmbed directly
        // YouTube oEmbed can handle various URL formats including redirects
        try {
          const oEmbedRes = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(fv.url)}&format=json`);
          if (oEmbedRes.ok) {
            const oEmbedData = await oEmbedRes.json();
            // Extract video ID from thumbnail URL in oEmbed response
            const thumbMatch = oEmbedData.thumbnail_url?.match(/\/vi\/([a-zA-Z0-9_-]{11})\//);
            if (thumbMatch) {
              const videoId = thumbMatch[1];
              setEnrichedFeaturedVideo({
                url: fv.url,
                title: needsTitle ? oEmbedData.title || "Video" : fv.title,
                thumbnail: needsThumbnail ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : fv.thumbnail,
                platform: fv.platform || "youtube",
              });
              return;
            }
          }
        } catch {
          // oEmbed failed, keep original
        }

        setEnrichedFeaturedVideo(fv);
        return;
      }

      const videoId = ytMatch[1];
      let title = fv.title;
      let thumbnail = fv.thumbnail;

      // Fetch title from oEmbed if needed
      if (needsTitle) {
        try {
          const res = await fetch(
            `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
          );
          if (res.ok) {
            const data = await res.json();
            title = data.title || title;
          }
        } catch {
          // Fallback: keep original
        }
      }

      // Generate thumbnail if needed
      if (needsThumbnail) {
        thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }

      setEnrichedFeaturedVideo({
        url: fv.url,
        title: title || "Video",
        thumbnail: thumbnail || "",
        platform: fv.platform || "youtube",
      });
    };

    fetchVideoInfo();
  }, [displayProfile?.featuredVideo]);

  // Inject custom font if provided
  useEffect(() => {
    if (displayProfile?.theme.customFontUrl) {
      const existingLink = document.getElementById("custom-profile-font");
      if (existingLink) {
        existingLink.remove();
      }

      const link = document.createElement("link");
      link.id = "custom-profile-font";
      link.rel = "stylesheet";
      link.href = displayProfile.theme.customFontUrl;
      document.head.appendChild(link);

      return () => {
        link.remove();
      };
    }
  }, [displayProfile?.theme.customFontUrl]);

  // Update document title and OG meta tags
  useEffect(() => {
    if (displayProfile) {
      const pageTitle = `${displayProfile.displayName} (@${displayProfile.username}) | LinkPulse`;
      const pageDescription = displayProfile.bio || `Scopri i link di ${displayProfile.displayName}`;
      const pageUrl = window.location.href;
      const pageImage = displayProfile.avatar || "https://lovable.dev/opengraph-image-p98pqg.png";

      // Update title
      document.title = pageTitle;

      // Helper to set or create meta tag
      const setMeta = (selector: string, attribute: string, content: string) => {
        let el = document.querySelector(selector) as HTMLMetaElement | null;
        if (!el) {
          el = document.createElement("meta");
          if (selector.includes("property=")) {
            el.setAttribute("property", selector.match(/property="([^"]+)"/)?.[1] || "");
          } else if (selector.includes("name=")) {
            el.setAttribute("name", selector.match(/name="([^"]+)"/)?.[1] || "");
          }
          document.head.appendChild(el);
        }
        el.setAttribute(attribute, content);
      };

      // Open Graph tags
      setMeta('meta[property="og:title"]', "content", pageTitle);
      setMeta('meta[property="og:description"]', "content", pageDescription);
      setMeta('meta[property="og:url"]', "content", pageUrl);
      setMeta('meta[property="og:image"]', "content", pageImage);
      setMeta('meta[property="og:type"]', "content", "profile");

      // Twitter Card tags
      setMeta('meta[name="twitter:title"]', "content", pageTitle);
      setMeta('meta[name="twitter:description"]', "content", pageDescription);
      setMeta('meta[name="twitter:image"]', "content", pageImage);
      setMeta('meta[name="twitter:card"]', "content", "summary_large_image");

      // Standard meta description
      setMeta('meta[name="description"]', "content", pageDescription);
    }

    return () => {
      document.title = "LinkPulse";
    };
  }, [displayProfile]);

  // Debug: verify which font is actually applied (will show in console)
  useEffect(() => {
    if (!displayProfile) return;

    const container = document.querySelector("[data-creator-profile-container]") as HTMLElement | null;

    const cssHeadingVar = container ? getComputedStyle(container).getPropertyValue("--font-heading") : null;

    const h1 = container?.querySelector("h1") as HTMLElement | null;
    const h1Font = h1 ? getComputedStyle(h1).fontFamily : null;

    console.log("[CreatorProfile fonts]", {
      apiFontFamily: displayProfile.theme.fontFamily,
      apiCustomFontUrl: displayProfile.theme.customFontUrl,
      resolvedCssHeadingVar: cssHeadingVar,
      resolvedH1Font: h1Font,
    });
  }, [displayProfile?.theme.fontFamily, displayProfile?.theme.customFontUrl]);

  // Show loading only if no cached data available
  if (isLoading && !displayProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show error only if no cached data available
  if ((error || !profile) && !displayProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="text-4xl font-bold text-foreground mb-4">Profile Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The creator you're looking for doesn't exist or the link is invalid.
          </p>
          <a
            href="https://crewmaster.net"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  const { theme, links } = displayProfile!;

  const getButtonRadius = () => {
    switch (theme.buttonStyle) {
      case "pill":
        return "9999px";
      case "square":
        return "4px";
      default:
        return "12px";
    }
  };

  // Build font family string
  // - If API sends a generic family keyword (e.g. "monospace"), don't quote it.
  // - If it's a named font with spaces (e.g. "Playfair Display"), quote it.
  const cleanFontFamily = theme.fontFamily ? theme.fontFamily.replace(/["']/g, "").split(",")[0].trim() : null;

  const GENERIC_FAMILIES = new Set([
    "serif",
    "sans-serif",
    "monospace",
    "cursive",
    "fantasy",
    "system-ui",
    "ui-sans-serif",
    "ui-serif",
    "ui-monospace",
    "ui-rounded",
    "emoji",
    "math",
    "fangsong",
  ]);

  const baseFont = cleanFontFamily
    ? GENERIC_FAMILIES.has(cleanFontFamily.toLowerCase())
      ? cleanFontFamily
      : cleanFontFamily.includes(" ")
        ? `"${cleanFontFamily}"`
        : cleanFontFamily
    : null;

  const fontFamilyStyle = baseFont ? `${baseFont}, system-ui, sans-serif` : "system-ui, sans-serif";

  const containerStyle: React.CSSProperties & Record<string, string> = {
    backgroundColor: theme.backgroundColor,
    backgroundImage: theme.backgroundImage ? `url(${theme.backgroundImage})` : theme.backgroundGradient || undefined,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    color: theme.textColor,

    // Set the font for normal text and also override global heading styles (h1..h6)
    fontFamily: fontFamilyStyle,
    "--font-heading": fontFamilyStyle,
    "--font-body": fontFamilyStyle,

    minHeight: "100vh",
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: theme.cardColor,
    color: theme.cardTextColor,
    borderRadius: getButtonRadius(),
    fontFamily: fontFamilyStyle,
  };

  const enabledLinks = links.filter((link) => link.enabled);

  const extractYouTubeThumbnail = (url: string): string => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (match) {
      return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
    }
    return "";
  };

  const getBadgeStyle = (link: (typeof links)[0]) => {
    if (link.badge === "CUSTOM" && link.customBadge) {
      return {
        backgroundColor: link.customBadge.backgroundColor,
        color: link.customBadge.textColor,
      };
    }

    switch (link.badge) {
      case "NEW":
        return { backgroundColor: "#22c55e", color: "#ffffff" };
      case "HOT":
        return { backgroundColor: "#f97316", color: "#ffffff" };
      case "SALE":
        return { backgroundColor: "#ef4444", color: "#ffffff" };
      default:
        return {};
    }
  };

  const getBadgeText = (link: (typeof links)[0]) => {
    if (link.badge === "CUSTOM" && link.customBadge) {
      return link.customBadge.text;
    }
    return link.badge;
  };

  // Check if a link has Twitch live status from API
  const isLinkTwitchLive = (link: (typeof links)[0]): boolean => {
    const platform = detectPlatform(link.url);
    return platform === "twitch" && link.twStatus === true;
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${displayProfile!.displayName} | LinkPulse`,
          text: displayProfile!.bio,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copiato negli appunti!");
      }
    } catch (err) {
      // User cancelled share or error occurred
      if ((err as Error).name !== "AbortError") {
        console.error("Share failed:", err);
        toast.error("Impossibile condividere");
      }
    }
  };

  return (
    <div data-creator-profile-container style={containerStyle} className="pb-12">
      {/* Header */}
      <div className="flex justify-between items-center p-4 max-w-lg mx-auto">
        <div className="w-10 h-10 flex items-center justify-center opacity-70">
          <a href="https://crewmaster.net">
            <div className = "w-10 h-10">
              
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1004.04 1004.04"><defs><style>.cls-1,.cls-2{fill:{theme.textColor};}.cls-2{opacity:0.7;}</style></defs><g id="Png"><path class="cls-1" d="M503.56,268.81q-96.58,0-193.19,0c-18.85,0-26.42-7.34-26.45-26.08q-.12-78.09,0-156.17c0-19.13,13.36-30.6,28.2-24.29,3.72,1.58,7,4.57,10,7.47,18.19,18,36.21,36.14,54.32,54.2,12.54,12.51,23.39,12.58,35.74.24q37.05-37,74.06-74c12.62-12.6,23-12.63,35.62,0q37.08,37,74.06,74c12.11,12.09,23,12.14,35.12.09,18.34-18.26,36.7-36.5,54.87-54.93,7.16-7.26,15-11.26,25-6.85,9.42,4.16,12.46,12,12.42,22-.19,53.57-.06,107.13-.11,160.7,0,16.28-7.38,23.66-23.77,23.68Q601.51,268.88,503.56,268.81Z"/><path class="cls-2" d="M249,362.22c-3.17,4-5,6.58-7,9-19.9,24-30.36,51.75-31.87,82.59-1.15,23.68-.73,47.44-.9,71.17-.33,43.31-.91,86.62-.77,129.92.14,39.7,1,79.39,1.78,119.07.23,11.3,1.4,22.58,2.18,34.42-3.13-.24-5-.07-6.61-.54C150.25,792,98.67,769.12,55.7,729c-26-24.28-39.54-53-39.55-88.4,0-61.94-.39-123.89-.14-185.84.2-47,28-79.88,75.63-89.42a189.69,189.69,0,0,1,34.87-3.53c36.7-.43,73.41-.17,110.12-.13C240.07,361.66,243.52,362,249,362.22Z"/><path class="cls-2" d="M770.9,364.42c33.44-.44,64.93-1.57,96.4-1,19.11.35,38.56,1.53,57.19,5.49,35.79,7.61,58.89,35,61.73,71.77,1.77,23,1.87,46.24,1.9,69.36.06,44.81-.87,89.62-.59,134.42.17,28.53-9.18,52.29-28.68,73.35C922,757.61,876.11,781.89,825.8,799.3c-8.2,2.84-16.5,5.38-26.13,8.5-.4-4.92-1-8.91-1-12.9.23-76.38.75-152.77.71-229.15,0-36.07.26-72.23-2.25-108.17-1.29-18.5-8-36.73-13-54.85C780.67,390.42,775.82,378.51,770.9,364.42Z"/><path class="cls-2" d="M170.14,41.66A124.38,124.38,0,0,1,230.69,56.4c4.94,2.61,6.9,5.33,5,11.37-1.7,5.3-1.65,11.28-1.66,17q-.17,80.31-.06,160.64c0,2.1-.05,4.22.11,6.31,1.11,14.72,1.13,14.72-12.67,20.59-73.67,31.34-155.14-12.39-166.94-90.9C42.73,103.47,102.87,40.92,170.14,41.66Z"/><path class="cls-2" d="M950.42,164.89c0,66.92-56.07,120.87-124.69,117.67a121.3,121.3,0,0,1-50-13.62c-4.37-2.24-6-4.59-5-9.79,1.19-5.81,1.16-11.94,1.17-17.93q.12-78,0-156c0-6-.05-12.28-1.91-17.81-2.44-7.31.54-10,6.41-13,55-27.95,123.35-9,155.79,43.44C944.54,117.67,951,139.22,950.42,164.89Z"/><path class="cls-1" d="M488.25,507.49a21.48,21.48,0,0,0,30.38,0L669.14,357c-20.8-7.12-42.4-7-63.84-7.22q-82.11-1-164.22-.6c-27,.17-54.19.49-81,3.52a111.36,111.36,0,0,0-21.93,4.74Z"/><path class="cls-1" d="M748.18,613.28h-.11c0-13.54.15-27.08,0-40.61-.53-40,1.29-80.17-2.44-119.85-2.51-26.75-12.16-49-28.52-66.12L519.59,584.19a21.47,21.47,0,0,1-30.37,0L291.88,386.84a106.42,106.42,0,0,0-28.13,63.91c-2.88,34.64-1.4,69.66-1.82,104.5-.63,52.27-1.47,104.54-1.68,156.81-.08,18.57-.32,37.42,2.56,55.65,7.66,48.41,35.22,84.78,73.73,113.38,39.24,29.14,82.1,52.15,126.2,73,22.89,10.82,46.15,12,70.07,4.47,69.27-21.85,127.76-60.46,176.91-113.67,25.15-27.22,38.6-58.93,38.49-96.25C748.07,703.52,748.18,658.4,748.18,613.28Z"/></g></svg>
            </div>
          </a>
        </div>

        <button
          onClick={handleShare}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <Share2 size={18} />
        </button>
      </div>

      {/* Profile Header */}
      <div className="flex flex-col items-center px-6 pb-8 max-w-lg mx-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-28 h-28 rounded-full overflow-hidden mb-5 ring-4 ring-white/20 shadow-2xl"
        >
          {displayProfile!.avatar ? (
            <img
              src={displayProfile!.avatar}
              alt={displayProfile!.displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-3xl font-bold"
              style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
            >
              {displayProfile!.displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </motion.div>

        <motion.h1
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-bold mb-2"
        >
          @{displayProfile!.username}
        </motion.h1>

        {displayProfile!.displayName && displayProfile!.displayName !== displayProfile!.username && (
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-lg opacity-90 mb-1"
          >
            {displayProfile!.displayName}
          </motion.p>
        )}

        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-base opacity-75 text-center max-w-sm leading-relaxed"
        >
          {displayProfile!.bio}
        </motion.p>
      </div>

      {/* Links Container */}
      <div className="px-4 max-w-lg mx-auto space-y-3">
        {/* Featured Video */}
        {enrichedFeaturedVideo &&
          (() => {
            const videoType = (enrichedFeaturedVideo as any).type || 1;
            const extractYouTubeVideoId = (url: string): string | null => {
              const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
              return match ? match[1] : null;
            };
            const videoId = extractYouTubeVideoId(enrichedFeaturedVideo.url);

            // For type 2 and 3, use rounded-xl instead of full rounded (pill)
            const getVideoRadius = () => {
              if (theme.buttonStyle === "pill") return "16px"; // Use large rounded instead of full
              if (theme.buttonStyle === "square") return "4px";
              return "12px";
            };

            const videoCardStyle: React.CSSProperties = {
              ...cardStyle,
              borderRadius: videoType === 2 || videoType === 3 ? getVideoRadius() : cardStyle.borderRadius,
              padding: 0,
            };

            // Type 3: YouTube Player embed
            if (videoType === 3 && videoId) {
              return (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="overflow-hidden shadow-xl transition-transform"
                  style={videoCardStyle}
                >
                  <div className="aspect-video w-full">
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title={enrichedFeaturedVideo.title || "Video"}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-sm truncate">{enrichedFeaturedVideo.title || "Video"}</p>
                  </div>
                </motion.div>
              );
            }

            // Type 2: Large cover above card
            if (videoType === 2) {
              return (
                <motion.a
                  href={enrichedFeaturedVideo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="block relative overflow-hidden shadow-xl transition-transform"
                  style={videoCardStyle}
                >
                  <div className="relative aspect-video w-full">
                    <img
                      src={enrichedFeaturedVideo.thumbnail || extractYouTubeThumbnail(enrichedFeaturedVideo.url)}
                      alt={enrichedFeaturedVideo.title || "Video"}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                        <Play size={28} className="ml-1" style={{ color: theme.cardColor }} />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-base truncate">{enrichedFeaturedVideo.title || "Video"}</p>
                    <div className="flex items-center gap-1.5 text-sm opacity-70 mt-1">
                      <PlatformIcon platform={enrichedFeaturedVideo.platform || "youtube"} size={14} />
                      <span className="capitalize">{enrichedFeaturedVideo.platform || "youtube"}</span>
                    </div>
                  </div>
                </motion.a>
              );
            }

            // Type 1 (default): Small thumbnail
            return (
              <motion.a
                href={enrichedFeaturedVideo.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="block relative overflow-hidden shadow-xl transition-transform"
                style={{ ...cardStyle, padding: 0 }}
              >
                <div className="flex items-center gap-4 p-4">
                  <div className="w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                    <img
                      src={enrichedFeaturedVideo.thumbnail || extractYouTubeThumbnail(enrichedFeaturedVideo.url)}
                      alt={enrichedFeaturedVideo.title || "Video"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-base truncate">{enrichedFeaturedVideo.title || "Video"}</p>
                    <div className="flex items-center gap-1.5 text-sm opacity-70 mt-1">
                      <PlatformIcon platform={enrichedFeaturedVideo.platform || "youtube"} size={14} />
                      <span className="capitalize">{enrichedFeaturedVideo.platform || "youtube"}</span>
                    </div>
                  </div>
                </div>
              </motion.a>
            );
          })()}

        {/* Regular Links */}
        {enabledLinks.map((link, index) => {
          const platform = detectPlatform(link.url);
          const isTwitchLive = isLinkTwitchLive(link);
          const isFeatured = link.isFeatured;

          return (
            <motion.a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                scale: isFeatured ? [1, 1.02, 1] : 1,
              }}
              transition={{
                delay: 0.3 + (index + 1) * 0.05,
                scale: isFeatured
                  ? {
                      repeat: Infinity,
                      duration: 2,
                      ease: "easeInOut",
                    }
                  : undefined,
              }}
              whileHover={{ scale: isFeatured ? 1.02 : 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`flex items-center gap-4 p-4 transition-all relative ${
                isFeatured ? "ring-2 ring-white/30 shadow-2xl" : "shadow-lg"
              }`}
              style={{
                ...cardStyle,
                boxShadow: isFeatured ? "0 0 30px rgba(255,255,255,0.2), 0 0 60px rgba(255,255,255,0.1)" : undefined,
              }}
            >
              {/* Platform Icon */}
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/10 backdrop-blur-sm">
                {link.thumbnail ? (
                  <img src={link.thumbnail} alt={link.title} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <PlatformIcon platform={platform} size={24} />
                )}
              </div>

              <span className="flex-1 text-center font-semibold text-base">{link.title}</span>

              {/* Twitch Live Indicator */}
              {isTwitchLive && (
                <div className="absolute -top-2 -left-2 flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full animate-pulse shadow-lg">
                  <Radio size={12} className="animate-pulse" />
                  LIVE
                </div>
              )}

              {/* Badge */}
              {link.badge && (
                <span
                  className="absolute -top-2 -right-2 text-xs font-bold px-2.5 py-1 rounded-full shadow-md"
                  style={getBadgeStyle(link)}
                >
                  {getBadgeText(link)}
                </span>
              )}

              {/* Featured Glow Effect */}
              {isFeatured && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
                    borderRadius: getButtonRadius(),
                  }}
                />
              )}

              {/* Spacer for balance (no more 3 dots) */}
              <div className="w-8" />
            </motion.a>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-12 flex flex-col items-center gap-6 px-4 max-w-lg mx-auto">
        <a
          href="https://crewmaster.net/@{displayProfile.username}"
          className="px-8 py-3 text-sm font-semibold border-2 rounded-full opacity-90 hover:opacity-100 transition-opacity backdrop-blur-sm bg-white/5"
          style={{ borderColor: theme.textColor }}
        >
          unisciti a {displayProfile.username} su CrewMaster
        </a>

        {/* LinkPulse Branding */}
        <div className="flex items-center gap-2 opacity-40">
          <img src="https://cdn.crewmaster.net/brand/Full-No-bg.svg" alt="CrewMaster" className="h-10 w-auto" />
        </div>
      </div>
    </div>
  );
};

export default CreatorProfile;

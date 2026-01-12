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
        <div className="w-10 h-10">
          <a href="https://crewmaster.net">
            <svg viewBox="0 0 1004.04 1004.04" className="w-10 h-10" style={{ color: theme.textColor }}>
              <path d="M500.85 370.85h-107c-10.44 0-14.63-4.06-14.65-14.44q-.06-43.24 0-86.49c0-10.6 7.4-17 15.62-13.45a18.83 18.83 0 015.52 4.14c10.08 9.95 20.06 20 30.09 30 6.94 6.93 12.95 7 19.79.14q20.52-20.5 41-41c7-7 12.74-7 19.73 0q20.53 20.49 41 41c6.71 6.69 12.75 6.72 19.45 0 10.16-10.12 20.32-20.22 30.38-30.42 4-4 8.32-6.24 13.86-3.8 5.22 2.3 6.9 6.63 6.88 12.17q-.11 29.67 0 59.33-.06 44.5 0 89c0 9-4.09 13.1-13.16 13.11q-55.24.04-109.48 0z" />

              <path d="M359.86 422.58c-1.76 2.24-2.8 3.64-3.91 5a75.7 75.7 0 00-17.64 45.74c-.64 13.12-.41 26.28-.5 39.42-.18 24-.51 48-.43 71.95.08 22 .54 44 1 65.94.12 6.26.78 12.51 1.21 19.07-30.74-8.78-59.3-21.45-83.1-43.68-14.4-13.45-21.9-29.35-21.91-49 0-34.31-.21-68.62-.07-102.92.11-26.06 15.52-44.24 41.88-49.53a105.12 105.12 0 0119.31-2c20.33-.24 40.66-.1 61-.08 3.05.01 4.96.18 7.98.09z" />

              <path d="M648.91 423.79c18.52-.24 36-.86 53.39-.55 10.58.19 21.35.84 31.67 3 19.82 4.21 32.62 19.36 34.19 39.75 1 12.76 1 25.6 1.05 38.41 0 24.82-.48 49.63-.33 74.45.1 15.8-5.08 29-15.88 40.62-20.4 22-45.82 35.49-73.69 45.13-4.54 1.57-9.13 3-14.47 4.71-.22-2.73-.57-4.94-.56-7.15.12-42.3.41-84.6.39-126.91 0-20 .15-40-1.24-59.9-.72-10.25-4.41-20.34-7.21-30.38 5.41-5.59 8.12-11.99-7.2-20.68z" />

              <path d="M316.2 245a68.91 68.91 0 0133.53 8.17c2.74 1.44 3.83 3 2.75 6.3-1 2.93-.92 6.24-.92 9.39q-.09 44.49 0 89c0 1.16 0 2.33.07 3.49.61 8.15.62 8.15-7 11.4-40.8 17.36-85.92-6.86-92.45-50.34C245.64 279.27 278.94 244.63 316.2 245z" />

              <path d="M748.33 313.29c0 37.06-31.05 66.94-69.05 65.17a67.21 67.21 0 01-27.68-7.55c-2.42-1.23-3.33-2.54-2.74-5.42a50.51 50.51 0 00.65-9.93q.06-43.21 0-86.42c0-3.31 0-6.8-1-9.87-1.36-4 .29-5.55 3.54-7.2 30.47-15.48 68.32-5 86.28 24.06a65.48 65.48 0 0110.01 37.16z" />
            </svg>
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

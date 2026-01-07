import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Profile, detectPlatform, extractTwitchUsername } from "@/types/profile";
import { Share2, MoreVertical, Radio, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import PlatformIcon from "@/components/profile/PlatformIcon";
import { useTwitchLive } from "@/hooks/useTwitchLive";
import { useMemo, useEffect } from "react";

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
  }>;
  featuredVideo?: {
    url: string;
    title: string;
    thumbnail: string;
    platform: string;
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
  })),
  featuredVideo:
    data.featuredVideo && data.featuredVideo.url
      ? {
          url: data.featuredVideo.url,
          title: data.featuredVideo.title,
          thumbnail: data.featuredVideo.thumbnail,
          platform: data.featuredVideo.platform as "youtube" | "twitch" | "tiktok",
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

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["creator-profile", id],
    queryFn: () => fetchCreatorProfile(id!),
    enabled: !!id,
    retry: 1,
  });

  // Extract Twitch usernames for live detection
  const twitchUsernames = useMemo(() => {
    if (!profile?.links) return [];
    return profile.links
      .filter((link) => link.enabled && detectPlatform(link.url) === "twitch")
      .map((link) => extractTwitchUsername(link.url))
      .filter((username): username is string => username !== null);
  }, [profile?.links]);

  const { liveStatus } = useTwitchLive(twitchUsernames);

  // Inject custom font if provided
  useEffect(() => {
    if (profile?.theme.customFontUrl) {
      const existingLink = document.getElementById("custom-profile-font");
      if (existingLink) {
        existingLink.remove();
      }

      const link = document.createElement("link");
      link.id = "custom-profile-font";
      link.rel = "stylesheet";
      link.href = profile.theme.customFontUrl;
      document.head.appendChild(link);

      return () => {
        link.remove();
      };
    }
  }, [profile?.theme.customFontUrl]);

  // Update document title
  useEffect(() => {
    if (profile) {
      document.title = `${profile.displayName} (@${profile.username}) | LinkPulse`;
    }
    return () => {
      document.title = "LinkPulse";
    };
  }, [profile]);

  // Debug: verify which font is actually applied (will show in console)
  useEffect(() => {
    if (!profile) return;

    const container = document.querySelector("[data-creator-profile-container]") as HTMLElement | null;

    const cssHeadingVar = container ? getComputedStyle(container).getPropertyValue("--font-heading") : null;

    const h1 = container?.querySelector("h1") as HTMLElement | null;
    const h1Font = h1 ? getComputedStyle(h1).fontFamily : null;

    console.log("[CreatorProfile fonts]", {
      apiFontFamily: profile.theme.fontFamily,
      apiCustomFontUrl: profile.theme.customFontUrl,
      resolvedCssHeadingVar: cssHeadingVar,
      resolvedH1Font: h1Font,
    });
  }, [profile?.theme.fontFamily, profile?.theme.customFontUrl]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="text-4xl font-bold text-foreground mb-4">Profile Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The creator you're looking for doesn't exist or the link is invalid.
          </p>
          <a
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  const { theme, links, featuredVideo } = profile;

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

  const isLinkTwitchLive = (url: string): boolean => {
    const username = extractTwitchUsername(url);
    return username ? liveStatus[username.toLowerCase()] === true : false;
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${profile.displayName} | LinkPulse`,
          text: profile.bio,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        // You could add a toast notification here
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  return (
    <div data-creator-profile-container style={containerStyle} className="pb-12">
      {/* Header */}
      <div className="flex justify-between items-center p-4 max-w-lg mx-auto">
        <div className="w-10 h-10 flex items-center justify-center opacity-70">
          <span className="text-xl">✦</span>
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
          {profile.avatar ? (
            <img src={profile.avatar} alt={profile.displayName} className="w-full h-full object-cover" />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-3xl font-bold"
              style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
            >
              {profile.displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </motion.div>

        <motion.h1
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-bold mb-2"
        >
          @{profile.username}
        </motion.h1>

        {profile.displayName && profile.displayName !== profile.username && (
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-lg opacity-90 mb-1"
          >
            {profile.displayName}
          </motion.p>
        )}

        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-base opacity-75 text-center max-w-sm leading-relaxed"
        >
          {profile.bio}
        </motion.p>
      </div>

      {/* Links Container */}
      <div className="px-4 max-w-lg mx-auto space-y-3">
        {/* Featured Video */}
        {featuredVideo && (
          <motion.a
            href={featuredVideo.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="block relative overflow-hidden shadow-xl hover:scale-[1.02] transition-transform"
            style={{ ...cardStyle, padding: 0 }}
          >
            <div className="flex items-center gap-4 p-4">
              <div className="w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                <img
                  src={featuredVideo.thumbnail || extractYouTubeThumbnail(featuredVideo.url)}
                  alt={featuredVideo.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-base truncate">{featuredVideo.title}</p>
                <div className="flex items-center gap-1.5 text-sm opacity-70 mt-1">
                  <PlatformIcon platform={featuredVideo.platform} size={14} />
                  <span className="capitalize">{featuredVideo.platform}</span>
                </div>
              </div>
              <div className="p-2 opacity-50">
                <MoreVertical size={18} />
              </div>
            </div>
          </motion.a>
        )}

        {/* Regular Links */}
        {enabledLinks.map((link, index) => {
          const platform = detectPlatform(link.url);
          const isTwitchLive = platform === "twitch" && isLinkTwitchLive(link.url);
          const isFeatured = link.isFeatured;

          return (
            <motion.a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ y: 20, opacity: 0 }}
              animate={{
                y: 0,
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
              className={`flex items-center gap-4 p-4 transition-all hover:scale-[1.02] relative ${
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

              <div className="p-2 opacity-50">
                <MoreVertical size={18} />
              </div>
            </motion.a>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-12 flex flex-col items-center gap-6 px-4 max-w-lg mx-auto">
        <a
          href="/"
          className="px-8 py-3 text-sm font-semibold border-2 rounded-full opacity-90 hover:opacity-100 transition-opacity backdrop-blur-sm bg-white/5"
          style={{ borderColor: theme.textColor }}
        >
          Crea la tua pagina su LinkPulse
        </a>

        <div className="flex items-center gap-4 text-xs opacity-50">
          <a href="/privacy" className="hover:opacity-80 transition-opacity">
            Privacy
          </a>
          <span>•</span>
          <a href="/terms" className="hover:opacity-80 transition-opacity">
            Termini
          </a>
          <span>•</span>
          <a href="/report" className="hover:opacity-80 transition-opacity">
            Segnala
          </a>
        </div>

        <div className="flex items-center gap-2 opacity-40">
          <img src="https://cdn.crewmaster.net/brand/Full-No-bg.svg" alt="CrewMaster" className="h-6 w-auto" />
        </div>
      </div>
    </div>
  );
};

export default CreatorProfile;

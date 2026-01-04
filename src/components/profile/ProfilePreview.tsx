import { Profile } from '@/types/profile';
import { Youtube, Share2, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProfilePreviewProps {
  profile: Profile;
  isMobileView?: boolean;
}

const ProfilePreview = ({ profile, isMobileView = true }: ProfilePreviewProps) => {
  const { theme, links, featuredVideo } = profile;

  const getButtonRadius = () => {
    switch (theme.buttonStyle) {
      case 'pill': return '9999px';
      case 'square': return '4px';
      default: return '12px';
    }
  };

  const containerStyle: React.CSSProperties = {
    backgroundColor: theme.backgroundColor,
    background: theme.backgroundGradient || theme.backgroundColor,
    backgroundImage: theme.backgroundImage ? `url(${theme.backgroundImage})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: theme.textColor,
    fontFamily: theme.fontFamily,
    minHeight: '100%',
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: theme.cardColor,
    color: theme.cardTextColor,
    borderRadius: getButtonRadius(),
  };

  const enabledLinks = links.filter(link => link.enabled);

  const extractYouTubeThumbnail = (url: string): string => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (match) {
      return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
    }
    return '';
  };

  return (
    <div 
      className={`relative ${isMobileView ? 'w-[375px] h-[750px] rounded-[40px] overflow-hidden border-4 border-muted shadow-2xl' : 'w-full min-h-screen'}`}
    >
      <div style={containerStyle} className="h-full overflow-y-auto pb-8">
        {/* Header */}
        <div className="flex justify-between items-center p-4">
          <div className="w-8 h-8 flex items-center justify-center opacity-70">
            <span className="text-lg">✦</span>
          </div>
          <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <Share2 size={16} />
          </button>
        </div>

        {/* Profile Header */}
        <div className="flex flex-col items-center px-6 pb-6">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 rounded-full overflow-hidden mb-4 ring-4 ring-primary/50 shadow-lg"
          >
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.displayName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-white">
                {profile.displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </motion.div>
          
          <motion.h1 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl font-bold mb-1"
          >
            @{profile.username}
          </motion.h1>
          
          <motion.p 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm opacity-80 text-center max-w-[280px]"
          >
            {profile.bio}
          </motion.p>
        </div>

        {/* Links */}
        <div className="px-4 space-y-3">
          {/* Featured Video */}
          {featuredVideo && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="relative overflow-hidden shadow-lg"
              style={{ ...cardStyle, padding: 0 }}
            >
              <div className="flex items-center gap-3 p-3">
                <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src={featuredVideo.thumbnail || extractYouTubeThumbnail(featuredVideo.url)} 
                    alt={featuredVideo.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{featuredVideo.title}</p>
                  <div className="flex items-center gap-1 text-xs opacity-70 mt-0.5">
                    <Youtube size={12} />
                    <span>YouTube</span>
                  </div>
                </div>
                <button className="p-1 opacity-50 hover:opacity-100">
                  <MoreVertical size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Regular Links */}
          {enabledLinks.map((link, index) => (
            <motion.a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 + (index + 1) * 0.05 }}
              className="flex items-center gap-3 p-3 transition-transform hover:scale-[1.02] relative"
              style={cardStyle}
            >
              {link.thumbnail && (
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={link.thumbnail} alt={link.title} className="w-full h-full object-cover" />
                </div>
              )}
              
              <span className="flex-1 text-center font-medium text-sm">
                {link.title}
              </span>

              {link.badge && (
                <span className={`absolute -top-1 -right-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  link.badge === 'NEW' ? 'bg-green-500 text-white' :
                  link.badge === 'HOT' ? 'bg-orange-500 text-white' :
                  'bg-red-500 text-white'
                }`}>
                  {link.badge}
                </span>
              )}

              <button className="p-1 opacity-50 hover:opacity-100">
                <MoreVertical size={16} />
              </button>
            </motion.a>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 flex flex-col items-center gap-4 px-4">
          <button 
            className="px-6 py-2 text-sm font-medium border rounded-full opacity-80 hover:opacity-100 transition-opacity"
            style={{ borderColor: theme.textColor }}
          >
            Unisciti a {profile.displayName} su LinkPulse
          </button>
          
          <div className="flex items-center gap-4 text-xs opacity-60">
            <span>Cookie Preferences</span>
            <span>•</span>
            <span>Report</span>
            <span>•</span>
            <span>Privacy</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePreview;

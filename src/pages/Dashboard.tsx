import { useState } from 'react';
import { Profile, ProfileTheme, ProfileLink, presetThemes } from '@/types/profile';
import ProfilePreview from '@/components/profile/ProfilePreview';
import ThemeSelector from '@/components/profile/ThemeSelector';
import LinkEditor from '@/components/profile/LinkEditor';
import FeaturedVideoEditor from '@/components/profile/FeaturedVideoEditor';
import ProfileInfoEditor from '@/components/profile/ProfileInfoEditor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Palette, 
  Link2, 
  Video, 
  Save, 
  Eye,
  ArrowLeft,
  Smartphone,
  Monitor
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const defaultProfile: Profile = {
  username: 'hemerald',
  displayName: 'Hemerald',
  bio: 'Tutti i miei social dove faccio schifo',
  avatar: '',
  theme: presetThemes[0],
  links: [
    { id: '1', title: 'Hemerald Gaming', url: 'https://youtube.com/@hemeraldgaming', thumbnail: '', enabled: true, badge: null },
    { id: '2', title: 'Twitch', url: 'https://twitch.tv/hemerald', thumbnail: '', enabled: true, badge: null },
    { id: '3', title: 'Instagram', url: 'https://instagram.com/hemerald', enabled: true, badge: null },
    { id: '4', title: 'TikTok', url: 'https://tiktok.com/@hemerald', enabled: true, badge: 'NEW' },
    { id: '5', title: 'Discord', url: 'https://discord.gg/hemerald', enabled: true, badge: null },
  ],
  featuredVideo: {
    url: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'CUPHEAD Ma se supero i 100 BATTITI il GIOCO si...',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    platform: 'youtube',
  },
};

const Dashboard = () => {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [showPreview, setShowPreview] = useState(false);
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');
  const [isSaving, setIsSaving] = useState(false);

  const updateProfile = (updates: Partial<Profile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const updateTheme = (theme: ProfileTheme) => {
    setProfile(prev => ({ ...prev, theme }));
  };

  const updateLinks = (links: ProfileLink[]) => {
    setProfile(prev => ({ ...prev, links }));
  };

  const updateFeaturedVideo = (featuredVideo: Profile['featuredVideo']) => {
    setProfile(prev => ({ ...prev, featuredVideo }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-bold font-heading">
              <span className="text-gradient">LinkPulse</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1 bg-muted rounded-lg p-1">
              <button
                onClick={() => setPreviewMode('mobile')}
                className={`p-2 rounded-md transition-colors ${
                  previewMode === 'mobile' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Smartphone size={18} />
              </button>
              <button
                onClick={() => setPreviewMode('desktop')}
                className={`p-2 rounded-md transition-colors ${
                  previewMode === 'desktop' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Monitor size={18} />
              </button>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="md:hidden"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye size={16} className="mr-1" />
              Anteprima
            </Button>

            <Button onClick={handleSave} disabled={isSaving} className="gap-2">
              <Save size={16} />
              {isSaving ? 'Salvando...' : 'Salva'}
            </Button>
          </div>
        </div>
      </header>

      <div className="container px-4 py-6">
        <div className="flex gap-8">
          {/* Editor Panel */}
          <div className="flex-1 max-w-2xl">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="profile" className="gap-2">
                  <User size={16} />
                  <span className="hidden sm:inline">Profilo</span>
                </TabsTrigger>
                <TabsTrigger value="links" className="gap-2">
                  <Link2 size={16} />
                  <span className="hidden sm:inline">Link</span>
                </TabsTrigger>
                <TabsTrigger value="video" className="gap-2">
                  <Video size={16} />
                  <span className="hidden sm:inline">Video</span>
                </TabsTrigger>
                <TabsTrigger value="theme" className="gap-2">
                  <Palette size={16} />
                  <span className="hidden sm:inline">Tema</span>
                </TabsTrigger>
              </TabsList>

              <div className="bg-card rounded-2xl border border-border p-6">
                <TabsContent value="profile" className="mt-0">
                  <ProfileInfoEditor 
                    profile={profile} 
                    onProfileChange={updateProfile} 
                  />
                </TabsContent>

                <TabsContent value="links" className="mt-0">
                  <LinkEditor 
                    links={profile.links} 
                    onLinksChange={updateLinks} 
                  />
                </TabsContent>

                <TabsContent value="video" className="mt-0">
                  <FeaturedVideoEditor 
                    featuredVideo={profile.featuredVideo}
                    onVideoChange={updateFeaturedVideo}
                  />
                </TabsContent>

                <TabsContent value="theme" className="mt-0">
                  <ThemeSelector 
                    currentTheme={profile.theme}
                    onThemeChange={updateTheme}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Preview Panel - Desktop */}
          <div className="hidden md:flex flex-col items-center sticky top-24 h-fit">
            <h2 className="text-sm font-medium text-muted-foreground mb-4">Anteprima Live</h2>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {previewMode === 'mobile' ? (
                <ProfilePreview profile={profile} isMobileView={true} />
              ) : (
                <div className="w-[600px] h-[700px] rounded-xl overflow-hidden border border-border shadow-xl">
                  <ProfilePreview profile={profile} isMobileView={false} />
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 md:hidden bg-background/95 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative"
            >
              <Button
                variant="outline"
                size="sm"
                className="absolute -top-12 right-0"
                onClick={() => setShowPreview(false)}
              >
                Chiudi
              </Button>
              <ProfilePreview profile={profile} isMobileView={true} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;

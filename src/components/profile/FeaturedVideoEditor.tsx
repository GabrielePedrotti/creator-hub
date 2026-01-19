import { useState } from 'react';
import { FeaturedVideo } from '@/types/profile';
import { Youtube, Trash2, Video, Play, Plus, GripVertical } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence, Reorder } from 'framer-motion';

interface FeaturedVideoEditorProps {
  featuredVideos: FeaturedVideo[] | undefined;
  onVideosChange: (videos: FeaturedVideo[] | undefined) => void;
}

const FeaturedVideoEditor = ({ featuredVideos = [], onVideosChange }: FeaturedVideoEditorProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  const extractYouTubeId = (url: string): string | null => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  const extractTwitchChannel = (url: string): string | null => {
    const match = url.match(/twitch\.tv\/([a-zA-Z0-9_]+)/);
    return match ? match[1] : null;
  };

  const extractTikTokVideo = (url: string): string | null => {
    const match = url.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/);
    return match ? match[1] : null;
  };

  const detectPlatform = (url: string): 'youtube' | 'twitch' | 'tiktok' | null => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('twitch.tv')) return 'twitch';
    if (url.includes('tiktok.com')) return 'tiktok';
    return null;
  };

  const getThumbnail = (url: string, platform: string): string => {
    if (platform === 'youtube') {
      const id = extractYouTubeId(url);
      return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : '';
    }
    return '';
  };

  const handleAddVideo = () => {
    const newVideo: FeaturedVideo = {
      id: crypto.randomUUID(),
      url: '',
      title: '',
      thumbnail: '',
      platform: 'youtube',
      type: 1,
    };
    onVideosChange([...featuredVideos, newVideo]);
    setEditingId(newVideo.id);
  };

  const handleUpdateVideo = (id: string, updates: Partial<FeaturedVideo>) => {
    const updatedVideos = featuredVideos.map(video => {
      if (video.id !== id) return video;
      
      const updated = { ...video, ...updates };
      
      // Auto-detect platform and thumbnail when URL changes
      if (updates.url !== undefined) {
        const platform = detectPlatform(updates.url);
        if (platform) {
          updated.platform = platform;
          updated.thumbnail = getThumbnail(updates.url, platform);
        }
      }
      
      return updated;
    });
    onVideosChange(updatedVideos);
  };

  const handleRemoveVideo = (id: string) => {
    const filtered = featuredVideos.filter(v => v.id !== id);
    onVideosChange(filtered.length > 0 ? filtered : undefined);
    if (editingId === id) setEditingId(null);
  };

  const handleReorder = (reorderedVideos: FeaturedVideo[]) => {
    onVideosChange(reorderedVideos);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Video size={20} className="text-primary" />
          Video in Evidenza
        </h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleAddVideo}
          className="gap-1"
        >
          <Plus size={14} />
          Aggiungi
        </Button>
      </div>

      {featuredVideos.length === 0 ? (
        <div className="border-2 border-dashed border-muted rounded-xl p-8 text-center">
          <Youtube size={32} className="mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Aggiungi video da YouTube, Twitch o TikTok
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Verranno mostrati in evidenza nella tua bio
          </p>
          <Button 
            variant="secondary" 
            size="sm" 
            className="mt-4 gap-1"
            onClick={handleAddVideo}
          >
            <Plus size={14} />
            Aggiungi il primo video
          </Button>
        </div>
      ) : (
        <Reorder.Group 
          axis="y" 
          values={featuredVideos} 
          onReorder={handleReorder}
          className="space-y-3"
        >
          <AnimatePresence mode="popLayout">
            {featuredVideos.map((video) => (
              <Reorder.Item
                key={video.id}
                value={video}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-card/50 border border-border/50 rounded-xl p-4"
              >
                <div className="flex items-start gap-3">
                  {/* Drag Handle */}
                  <div className="cursor-grab active:cursor-grabbing mt-2">
                    <GripVertical size={18} className="text-muted-foreground" />
                  </div>

                  {/* Thumbnail Preview */}
                  <div className="w-24 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                    {video.thumbnail ? (
                      <div className="relative w-full h-full">
                        <img 
                          src={video.thumbnail} 
                          alt={video.title || 'Video'}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <Play size={16} className="text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Youtube size={20} className="text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <Input
                      placeholder="https://youtube.com/watch?v=..."
                      value={video.url}
                      onChange={(e) => handleUpdateVideo(video.id, { url: e.target.value })}
                      className="text-sm"
                    />
                    <Input
                      placeholder="Titolo del video"
                      value={video.title}
                      onChange={(e) => handleUpdateVideo(video.id, { title: e.target.value })}
                      className="text-sm"
                    />
                  </div>

                  {/* Delete Button */}
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleRemoveVideo(video.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </Reorder.Item>
            ))}
          </AnimatePresence>
        </Reorder.Group>
      )}

      {featuredVideos.length > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          Trascina per riordinare i video
        </p>
      )}
    </div>
  );
};

export default FeaturedVideoEditor;
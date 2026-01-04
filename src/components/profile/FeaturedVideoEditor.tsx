import { useState, useEffect } from 'react';
import { Profile } from '@/types/profile';
import { Youtube, Trash2, Video, Play } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface FeaturedVideoEditorProps {
  featuredVideo: Profile['featuredVideo'];
  onVideoChange: (video: Profile['featuredVideo']) => void;
}

const FeaturedVideoEditor = ({ featuredVideo, onVideoChange }: FeaturedVideoEditorProps) => {
  const [videoUrl, setVideoUrl] = useState(featuredVideo?.url || '');
  const [videoTitle, setVideoTitle] = useState(featuredVideo?.title || '');

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
    // For other platforms, we'd need API access for thumbnails
    return '';
  };

  useEffect(() => {
    if (videoUrl) {
      const platform = detectPlatform(videoUrl);
      if (platform) {
        const thumbnail = getThumbnail(videoUrl, platform);
        onVideoChange({
          url: videoUrl,
          title: videoTitle || 'Video in evidenza',
          thumbnail,
          platform,
        });
      }
    }
  }, [videoUrl, videoTitle]);

  const handleRemove = () => {
    setVideoUrl('');
    setVideoTitle('');
    onVideoChange(undefined);
  };

  const currentThumbnail = featuredVideo?.thumbnail || (videoUrl ? getThumbnail(videoUrl, detectPlatform(videoUrl) || 'youtube') : '');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Video size={20} className="text-primary" />
          Video in Evidenza
        </h3>
        {featuredVideo && (
          <Button variant="ghost" size="sm" onClick={handleRemove} className="text-destructive">
            <Trash2 size={14} className="mr-1" />
            Rimuovi
          </Button>
        )}
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">URL Video (YouTube, Twitch, TikTok)</Label>
          <Input
            placeholder="https://youtube.com/watch?v=..."
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Titolo Video</Label>
          <Input
            placeholder="Titolo del tuo video"
            value={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
          />
        </div>

        {currentThumbnail && (
          <div className="relative rounded-xl overflow-hidden">
            <img 
              src={currentThumbnail} 
              alt="Video thumbnail"
              className="w-full h-40 object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                <Play size={20} className="text-black ml-0.5" />
              </div>
            </div>
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/70 text-white text-xs px-2 py-1 rounded">
              <Youtube size={14} />
              <span>YouTube</span>
            </div>
          </div>
        )}

        {!videoUrl && (
          <div className="border-2 border-dashed border-muted rounded-xl p-8 text-center">
            <Youtube size={32} className="mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Aggiungi un video da YouTube, Twitch o TikTok
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Verrà mostrato in evidenza nella tua bio
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedVideoEditor;

import { ProfileLink, detectPlatform } from '@/types/profile';
import { 
  GripVertical, 
  Trash2, 
  Plus, 
  ExternalLink, 
  Eye, 
  EyeOff,
  Image,
  Sparkles,
  Star,
  Radio
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { motion, Reorder } from 'framer-motion';
import PlatformIcon from './PlatformIcon';

interface LinkEditorProps {
  links: ProfileLink[];
  onLinksChange: (links: ProfileLink[]) => void;
}

const LinkEditor = ({ links, onLinksChange }: LinkEditorProps) => {
  const addLink = () => {
    const newLink: ProfileLink = {
      id: `link-${Date.now()}`,
      title: '',
      url: '',
      enabled: true,
      badge: null,
      isFeatured: false,
    };
    onLinksChange([...links, newLink]);
  };

  const updateLink = (id: string, field: keyof ProfileLink, value: any) => {
    onLinksChange(
      links.map(link => 
        link.id === id ? { ...link, [field]: value } : link
      )
    );
  };

  const updateCustomBadge = (id: string, field: string, value: string) => {
    onLinksChange(
      links.map(link => {
        if (link.id === id) {
          return {
            ...link,
            customBadge: {
              text: link.customBadge?.text || 'CUSTOM',
              backgroundColor: link.customBadge?.backgroundColor || '#8b5cf6',
              textColor: link.customBadge?.textColor || '#ffffff',
              [field]: value,
            }
          };
        }
        return link;
      })
    );
  };

  const deleteLink = (id: string) => {
    onLinksChange(links.filter(link => link.id !== id));
  };

  const handleReorder = (reorderedLinks: ProfileLink[]) => {
    onLinksChange(reorderedLinks);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">I tuoi Link</h3>
        <Button onClick={addLink} size="sm" className="gap-2">
          <Plus size={16} />
          Aggiungi Link
        </Button>
      </div>

      <Reorder.Group 
        axis="y" 
        values={links} 
        onReorder={handleReorder}
        className="space-y-3"
      >
        {links.map((link) => {
          const platform = detectPlatform(link.url);
          const isTwitch = platform === 'twitch';

          return (
            <Reorder.Item
              key={link.id}
              value={link}
              className="cursor-grab active:cursor-grabbing"
            >
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-4 rounded-xl border transition-all ${
                  link.enabled 
                    ? link.isFeatured 
                      ? 'bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30 ring-1 ring-primary/20' 
                      : 'bg-card/50 border-border/50' 
                    : 'bg-muted/30 border-muted/30 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Drag Handle & Controls */}
                  <div className="flex flex-col items-center gap-2 pt-2">
                    <GripVertical size={20} className="text-muted-foreground" />
                    
                    {/* Platform Icon */}
                    {platform && (
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                        <PlatformIcon platform={platform} size={16} className="text-muted-foreground" />
                      </div>
                    )}

                    {/* Twitch Live Indicator */}
                    {isTwitch && (
                      <div className="flex items-center gap-1 text-xs text-red-400">
                        <Radio size={12} />
                      </div>
                    )}
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Titolo</Label>
                        <Input
                          placeholder="Es. Instagram"
                          value={link.title}
                          onChange={(e) => updateLink(link.id, 'title', e.target.value)}
                          className="h-9 bg-background/50 border-border/50"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">URL</Label>
                        <div className="relative">
                          <Input
                            placeholder="https://..."
                            value={link.url}
                            onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                            className="h-9 pr-8 bg-background/50 border-border/50"
                          />
                          {link.url && (
                            <a 
                              href={link.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              <ExternalLink size={14} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground flex items-center gap-1">
                          <Image size={12} />
                          Thumbnail
                        </Label>
                        <Input
                          placeholder="URL immagine"
                          value={link.thumbnail || ''}
                          onChange={(e) => updateLink(link.id, 'thumbnail', e.target.value)}
                          className="h-9 text-xs bg-background/50 border-border/50"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground flex items-center gap-1">
                          <Sparkles size={12} />
                          Badge
                        </Label>
                        <Select
                          value={link.badge || 'none'}
                          onValueChange={(value) => updateLink(link.id, 'badge', value === 'none' ? null : value)}
                        >
                          <SelectTrigger className="h-9 bg-background/50 border-border/50">
                            <SelectValue placeholder="Nessuno" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Nessuno</SelectItem>
                            <SelectItem value="NEW">
                              <span className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500" />
                                NEW
                              </span>
                            </SelectItem>
                            <SelectItem value="HOT">
                              <span className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-orange-500" />
                                HOT
                              </span>
                            </SelectItem>
                            <SelectItem value="SALE">
                              <span className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500" />
                                SALE
                              </span>
                            </SelectItem>
                            <SelectItem value="CUSTOM">
                              <span className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-purple-500" />
                                Custom
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Custom Badge Editor */}
                      {link.badge === 'CUSTOM' && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="h-9 mt-auto">
                              Personalizza
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-64 p-3 space-y-3">
                            <div className="space-y-1.5">
                              <Label className="text-xs">Testo</Label>
                              <Input
                                value={link.customBadge?.text || 'CUSTOM'}
                                onChange={(e) => updateCustomBadge(link.id, 'text', e.target.value)}
                                className="h-8"
                                maxLength={10}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1.5">
                                <Label className="text-xs">Sfondo</Label>
                                <div className="flex gap-2">
                                  <input
                                    type="color"
                                    value={link.customBadge?.backgroundColor || '#8b5cf6'}
                                    onChange={(e) => updateCustomBadge(link.id, 'backgroundColor', e.target.value)}
                                    className="w-8 h-8 rounded cursor-pointer border-0"
                                  />
                                  <Input
                                    value={link.customBadge?.backgroundColor || '#8b5cf6'}
                                    onChange={(e) => updateCustomBadge(link.id, 'backgroundColor', e.target.value)}
                                    className="h-8 text-xs font-mono flex-1"
                                  />
                                </div>
                              </div>
                              <div className="space-y-1.5">
                                <Label className="text-xs">Testo</Label>
                                <div className="flex gap-2">
                                  <input
                                    type="color"
                                    value={link.customBadge?.textColor || '#ffffff'}
                                    onChange={(e) => updateCustomBadge(link.id, 'textColor', e.target.value)}
                                    className="w-8 h-8 rounded cursor-pointer border-0"
                                  />
                                  <Input
                                    value={link.customBadge?.textColor || '#ffffff'}
                                    onChange={(e) => updateCustomBadge(link.id, 'textColor', e.target.value)}
                                    className="h-8 text-xs font-mono flex-1"
                                  />
                                </div>
                              </div>
                            </div>
                            {/* Preview */}
                            <div className="pt-2 border-t flex justify-center">
                              <span 
                                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                style={{
                                  backgroundColor: link.customBadge?.backgroundColor || '#8b5cf6',
                                  color: link.customBadge?.textColor || '#ffffff',
                                }}
                              >
                                {link.customBadge?.text || 'CUSTOM'}
                              </span>
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                  </div>

                  {/* Right Controls */}
                  <div className="flex flex-col items-center gap-2">
                    {/* Featured Toggle */}
                    <button
                      onClick={() => updateLink(link.id, 'isFeatured', !link.isFeatured)}
                      className={`p-2 rounded-lg transition-all ${
                        link.isFeatured 
                          ? 'text-yellow-400 bg-yellow-400/10 shadow-lg shadow-yellow-400/20' 
                          : 'text-muted-foreground hover:text-yellow-400 hover:bg-yellow-400/5'
                      }`}
                      title="Featured - Attira l'attenzione"
                    >
                      <Star size={16} fill={link.isFeatured ? 'currentColor' : 'none'} />
                    </button>

                    {/* Enable/Disable Toggle */}
                    <button
                      onClick={() => updateLink(link.id, 'enabled', !link.enabled)}
                      className={`p-2 rounded-lg transition-colors ${
                        link.enabled 
                          ? 'text-primary bg-primary/10' 
                          : 'text-muted-foreground bg-muted/50'
                      }`}
                    >
                      {link.enabled ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => deleteLink(link.id)}
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>

      {links.length === 0 && (
        <div className="text-center py-12 text-muted-foreground border border-dashed border-border/50 rounded-xl bg-card/30">
          <ExternalLink size={32} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm">Nessun link ancora.</p>
          <p className="text-xs">Clicca "Aggiungi Link" per iniziare!</p>
        </div>
      )}
    </div>
  );
};

export default LinkEditor;

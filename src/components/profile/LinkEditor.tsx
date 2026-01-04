import { ProfileLink } from '@/types/profile';
import { 
  GripVertical, 
  Trash2, 
  Plus, 
  ExternalLink, 
  Eye, 
  EyeOff,
  Image,
  Sparkles
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, Reorder } from 'framer-motion';

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
        {links.map((link) => (
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
              className={`p-4 rounded-xl border ${
                link.enabled 
                  ? 'bg-card border-border' 
                  : 'bg-muted/50 border-muted'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex items-center gap-2 pt-2">
                  <GripVertical size={20} className="text-muted-foreground" />
                  <button
                    onClick={() => updateLink(link.id, 'enabled', !link.enabled)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      link.enabled 
                        ? 'text-primary bg-primary/10' 
                        : 'text-muted-foreground bg-muted'
                    }`}
                  >
                    {link.enabled ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>

                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Titolo</Label>
                      <Input
                        placeholder="Es. Instagram"
                        value={link.title}
                        onChange={(e) => updateLink(link.id, 'title', e.target.value)}
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">URL</Label>
                      <div className="relative">
                        <Input
                          placeholder="https://..."
                          value={link.url}
                          onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                          className="h-9 pr-8"
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

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground flex items-center gap-1">
                        <Image size={12} />
                        Thumbnail (opzionale)
                      </Label>
                      <Input
                        placeholder="URL immagine"
                        value={link.thumbnail || ''}
                        onChange={(e) => updateLink(link.id, 'thumbnail', e.target.value)}
                        className="h-9 text-xs"
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
                        <SelectTrigger className="h-9">
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
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => deleteLink(link.id)}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {links.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <ExternalLink size={32} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm">Nessun link ancora.</p>
          <p className="text-xs">Clicca "Aggiungi Link" per iniziare!</p>
        </div>
      )}
    </div>
  );
};

export default LinkEditor;

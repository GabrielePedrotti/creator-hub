import { ProfileTheme, presetThemes } from '@/types/profile';
import { Check, Palette, Image, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface ThemeSelectorProps {
  currentTheme: ProfileTheme;
  onThemeChange: (theme: ProfileTheme) => void;
}

const ThemeSelector = ({ currentTheme, onThemeChange }: ThemeSelectorProps) => {
  const handlePresetSelect = (theme: ProfileTheme) => {
    onThemeChange({ ...theme, isCustom: false });
  };

  const handleCustomChange = (field: keyof ProfileTheme, value: string) => {
    onThemeChange({
      ...currentTheme,
      [field]: value,
      isCustom: true,
      id: 'custom',
      name: 'Custom',
    });
  };

  const fontOptions = [
    { value: 'system-ui', label: 'System' },
    { value: 'Outfit', label: 'Outfit' },
    { value: 'serif', label: 'Serif' },
    { value: 'monospace', label: 'Mono' },
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="presets" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="presets" className="flex items-center gap-2">
            <Palette size={16} />
            Temi Preset
          </TabsTrigger>
          <TabsTrigger value="custom" className="flex items-center gap-2">
            <Plus size={16} />
            Personalizza
          </TabsTrigger>
        </TabsList>

        <TabsContent value="presets" className="mt-4">
          <div className="grid grid-cols-2 gap-3">
            {presetThemes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handlePresetSelect(theme)}
                className={`relative p-3 rounded-xl border-2 transition-all ${
                  currentTheme.id === theme.id 
                    ? 'border-primary ring-2 ring-primary/20' 
                    : 'border-border hover:border-muted-foreground'
                }`}
              >
                <div 
                  className="w-full h-16 rounded-lg mb-2 overflow-hidden"
                  style={{
                    background: theme.backgroundGradient || theme.backgroundColor,
                  }}
                >
                  <div className="flex flex-col items-center justify-center h-full gap-1">
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.cardColor }} />
                    <div className="w-12 h-2 rounded" style={{ backgroundColor: theme.cardColor }} />
                  </div>
                </div>
                <span className="text-xs font-medium">{theme.name}</span>
                {currentTheme.id === theme.id && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <Check size={12} className="text-primary-foreground" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="custom" className="mt-4 space-y-4">
          {/* Background */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Sfondo</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Colore</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={currentTheme.backgroundColor}
                    onChange={(e) => handleCustomChange('backgroundColor', e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border-0"
                  />
                  <Input
                    value={currentTheme.backgroundColor}
                    onChange={(e) => handleCustomChange('backgroundColor', e.target.value)}
                    className="flex-1 font-mono text-xs"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Immagine URL</Label>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <Image size={16} className="text-muted-foreground" />
                  </div>
                  <Input
                    placeholder="https://..."
                    value={currentTheme.backgroundImage || ''}
                    onChange={(e) => handleCustomChange('backgroundImage', e.target.value)}
                    className="flex-1 text-xs"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Gradiente (opzionale)</Label>
              <Input
                placeholder="linear-gradient(135deg, #000 0%, #333 100%)"
                value={currentTheme.backgroundGradient || ''}
                onChange={(e) => handleCustomChange('backgroundGradient', e.target.value)}
                className="font-mono text-xs"
              />
            </div>
          </div>

          {/* Cards */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Bottoni / Card</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Colore Card</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={currentTheme.cardColor.startsWith('rgba') ? '#ffffff' : currentTheme.cardColor}
                    onChange={(e) => handleCustomChange('cardColor', e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border-0"
                  />
                  <Input
                    value={currentTheme.cardColor}
                    onChange={(e) => handleCustomChange('cardColor', e.target.value)}
                    className="flex-1 font-mono text-xs"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Testo Card</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={currentTheme.cardTextColor}
                    onChange={(e) => handleCustomChange('cardTextColor', e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border-0"
                  />
                  <Input
                    value={currentTheme.cardTextColor}
                    onChange={(e) => handleCustomChange('cardTextColor', e.target.value)}
                    className="flex-1 font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Text Color */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Colore Testo Generale</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={currentTheme.textColor}
                onChange={(e) => handleCustomChange('textColor', e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border-0"
              />
              <Input
                value={currentTheme.textColor}
                onChange={(e) => handleCustomChange('textColor', e.target.value)}
                className="flex-1 font-mono text-xs"
              />
            </div>
          </div>

          {/* Button Style */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Stile Bottoni</Label>
            <RadioGroup
              value={currentTheme.buttonStyle}
              onValueChange={(value) => handleCustomChange('buttonStyle', value)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rounded" id="rounded" />
                <Label htmlFor="rounded" className="text-sm">Arrotondato</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pill" id="pill" />
                <Label htmlFor="pill" className="text-sm">Pillola</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="square" id="square" />
                <Label htmlFor="square" className="text-sm">Quadrato</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Font */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Font</Label>
            <RadioGroup
              value={currentTheme.fontFamily}
              onValueChange={(value) => handleCustomChange('fontFamily', value)}
              className="grid grid-cols-2 gap-2"
            >
              {fontOptions.map((font) => (
                <div key={font.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={font.value} id={font.value} />
                  <Label 
                    htmlFor={font.value} 
                    className="text-sm"
                    style={{ fontFamily: font.value }}
                  >
                    {font.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ThemeSelector;

import { ProfileTheme, presetThemes } from '@/types/profile';
import { Check, Palette, Image, Plus, Type } from 'lucide-react';
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
    { value: 'system-ui', label: 'System', preview: 'Aa' },
    { value: 'Outfit', label: 'Outfit', preview: 'Aa' },
    { value: 'serif', label: 'Serif', preview: 'Aa' },
    { value: 'monospace', label: 'Mono', preview: 'Aa' },
    { value: "'Inter', sans-serif", label: 'Inter', preview: 'Aa' },
    { value: "'Playfair Display', serif", label: 'Playfair', preview: 'Aa' },
    { value: "'Space Grotesk', sans-serif", label: 'Space Grotesk', preview: 'Aa' },
    { value: "'Bebas Neue', sans-serif", label: 'Bebas Neue', preview: 'Aa' },
  ];

  const popularGoogleFonts = [
    { name: 'Poppins', url: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap' },
    { name: 'Montserrat', url: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap' },
    { name: 'Roboto', url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap' },
    { name: 'Open Sans', url: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap' },
    { name: 'Lato', url: 'https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap' },
    { name: 'Oswald', url: 'https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&display=swap' },
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="presets" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-background/50">
          <TabsTrigger value="presets" className="flex items-center gap-2">
            <Palette size={16} />
            <span className="hidden sm:inline">Preset</span>
          </TabsTrigger>
          <TabsTrigger value="custom" className="flex items-center gap-2">
            <Plus size={16} />
            <span className="hidden sm:inline">Colori</span>
          </TabsTrigger>
          <TabsTrigger value="fonts" className="flex items-center gap-2">
            <Type size={16} />
            <span className="hidden sm:inline">Font</span>
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
                    : 'border-border/50 hover:border-muted-foreground bg-card/30'
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
          <div className="space-y-3 p-4 rounded-xl bg-card/30 border border-border/50">
            <Label className="text-sm font-medium flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              Sfondo
            </Label>
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
                    className="flex-1 font-mono text-xs bg-background/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Immagine URL</Label>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                    <Image size={16} className="text-muted-foreground" />
                  </div>
                  <Input
                    placeholder="https://..."
                    value={currentTheme.backgroundImage || ''}
                    onChange={(e) => handleCustomChange('backgroundImage', e.target.value)}
                    className="flex-1 text-xs bg-background/50"
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
                className="font-mono text-xs bg-background/50"
              />
            </div>
          </div>

          {/* Cards */}
          <div className="space-y-3 p-4 rounded-xl bg-card/30 border border-border/50">
            <Label className="text-sm font-medium flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent" />
              Bottoni / Card
            </Label>
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
                    className="flex-1 font-mono text-xs bg-background/50"
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
                    className="flex-1 font-mono text-xs bg-background/50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Text Color */}
          <div className="space-y-3 p-4 rounded-xl bg-card/30 border border-border/50">
            <Label className="text-sm font-medium flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-foreground" />
              Testo Generale
            </Label>
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
                className="flex-1 font-mono text-xs bg-background/50"
              />
            </div>
          </div>

          {/* Button Style */}
          <div className="space-y-3 p-4 rounded-xl bg-card/30 border border-border/50">
            <Label className="text-sm font-medium">Stile Bottoni</Label>
            <RadioGroup
              value={currentTheme.buttonStyle}
              onValueChange={(value) => handleCustomChange('buttonStyle', value)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rounded" id="rounded" />
                <Label htmlFor="rounded" className="text-sm cursor-pointer">Arrotondato</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pill" id="pill" />
                <Label htmlFor="pill" className="text-sm cursor-pointer">Pillola</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="square" id="square" />
                <Label htmlFor="square" className="text-sm cursor-pointer">Quadrato</Label>
              </div>
            </RadioGroup>
          </div>
        </TabsContent>

        <TabsContent value="fonts" className="mt-4 space-y-4">
          {/* Built-in Fonts */}
          <div className="space-y-3 p-4 rounded-xl bg-card/30 border border-border/50">
            <Label className="text-sm font-medium">Font Predefiniti</Label>
            <RadioGroup
              value={currentTheme.fontFamily}
              onValueChange={(value) => handleCustomChange('fontFamily', value)}
              className="grid grid-cols-2 gap-2"
            >
              {fontOptions.map((font) => (
                <div 
                  key={font.value} 
                  className={`flex items-center space-x-2 p-2 rounded-lg border transition-all cursor-pointer ${
                    currentTheme.fontFamily === font.value 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border/50 hover:border-muted-foreground'
                  }`}
                  onClick={() => handleCustomChange('fontFamily', font.value)}
                >
                  <RadioGroupItem value={font.value} id={font.value} />
                  <Label 
                    htmlFor={font.value} 
                    className="text-sm cursor-pointer flex-1"
                    style={{ fontFamily: font.value }}
                  >
                    {font.label}
                  </Label>
                  <span 
                    className="text-lg font-bold opacity-50"
                    style={{ fontFamily: font.value }}
                  >
                    {font.preview}
                  </span>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Google Fonts Quick Select */}
          <div className="space-y-3 p-4 rounded-xl bg-card/30 border border-border/50">
            <Label className="text-sm font-medium">Google Fonts Popolari</Label>
            <div className="grid grid-cols-3 gap-2">
              {popularGoogleFonts.map((font) => (
                <button
                  key={font.name}
                  onClick={() => {
                    handleCustomChange('fontFamily', `'${font.name}', sans-serif`);
                    handleCustomChange('customFontUrl', font.url);
                  }}
                  className={`p-2 text-xs rounded-lg border transition-all ${
                    currentTheme.fontFamily.includes(font.name)
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border/50 hover:border-muted-foreground'
                  }`}
                >
                  {font.name}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Font URL */}
          <div className="space-y-3 p-4 rounded-xl bg-card/30 border border-border/50">
            <Label className="text-sm font-medium">Font Personalizzato</Label>
            <p className="text-xs text-muted-foreground">
              Inserisci un URL di Google Fonts o un altro servizio di font
            </p>
            <div className="space-y-2">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Nome Font (es. 'Roboto', sans-serif)</Label>
                <Input
                  placeholder="'Custom Font', sans-serif"
                  value={currentTheme.fontFamily}
                  onChange={(e) => handleCustomChange('fontFamily', e.target.value)}
                  className="text-sm bg-background/50"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">URL Font (opzionale)</Label>
                <Input
                  placeholder="https://fonts.googleapis.com/css2?family=..."
                  value={currentTheme.customFontUrl || ''}
                  onChange={(e) => handleCustomChange('customFontUrl', e.target.value)}
                  className="text-xs font-mono bg-background/50"
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ThemeSelector;

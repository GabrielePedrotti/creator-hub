export interface ProfileLink {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
  enabled: boolean;
  isFeatured?: boolean;
  badge?: 'NEW' | 'HOT' | 'SALE' | null;
}

export interface ProfileTheme {
  id: string;
  name: string;
  backgroundColor: string;
  backgroundGradient?: string;
  backgroundImage?: string;
  cardColor: string;
  cardTextColor: string;
  textColor: string;
  buttonStyle: 'rounded' | 'pill' | 'square';
  fontFamily: string;
  isCustom?: boolean;
}

export interface Profile {
  username: string;
  displayName: string;
  bio: string;
  avatar: string;
  theme: ProfileTheme;
  links: ProfileLink[];
  featuredVideo?: {
    url: string;
    title: string;
    thumbnail: string;
    platform: 'youtube' | 'twitch' | 'tiktok';
  };
}

export const presetThemes: ProfileTheme[] = [
  {
    id: 'minimal-light',
    name: 'Minimal Light',
    backgroundColor: '#f5f5f5',
    cardColor: '#ffffff',
    cardTextColor: '#1a1a1a',
    textColor: '#1a1a1a',
    buttonStyle: 'rounded',
    fontFamily: 'system-ui',
  },
  {
    id: 'minimal-dark',
    name: 'Minimal Dark',
    backgroundColor: '#0a0a0a',
    cardColor: '#1a1a1a',
    cardTextColor: '#ffffff',
    textColor: '#ffffff',
    buttonStyle: 'rounded',
    fontFamily: 'system-ui',
  },
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    backgroundColor: '#0f172a',
    backgroundGradient: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f766e 100%)',
    cardColor: 'rgba(255,255,255,0.1)',
    cardTextColor: '#ffffff',
    textColor: '#ffffff',
    buttonStyle: 'pill',
    fontFamily: 'system-ui',
  },
  {
    id: 'sunset-glow',
    name: 'Sunset Glow',
    backgroundColor: '#1a0a1e',
    backgroundGradient: 'linear-gradient(180deg, #1a0a1e 0%, #4a1942 50%, #ff6b35 100%)',
    cardColor: 'rgba(255,255,255,0.15)',
    cardTextColor: '#ffffff',
    textColor: '#ffffff',
    buttonStyle: 'rounded',
    fontFamily: 'Outfit',
  },
  {
    id: 'neon-nights',
    name: 'Neon Nights',
    backgroundColor: '#0d0d0d',
    backgroundGradient: 'linear-gradient(135deg, #0d0d0d 0%, #1a0a2e 50%, #2d1b4e 100%)',
    cardColor: 'rgba(138,43,226,0.2)',
    cardTextColor: '#e0b0ff',
    textColor: '#ffffff',
    buttonStyle: 'pill',
    fontFamily: 'Outfit',
  },
  {
    id: 'forest-calm',
    name: 'Forest Calm',
    backgroundColor: '#0f1f0f',
    backgroundGradient: 'linear-gradient(180deg, #0f1f0f 0%, #1a3a1a 50%, #2d5a2d 100%)',
    cardColor: 'rgba(255,255,255,0.1)',
    cardTextColor: '#b8e6b8',
    textColor: '#e0f0e0',
    buttonStyle: 'rounded',
    fontFamily: 'system-ui',
  },
  {
    id: 'pastel-dream',
    name: 'Pastel Dream',
    backgroundColor: '#fdf2f8',
    backgroundGradient: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #f5d0fe 100%)',
    cardColor: 'rgba(255,255,255,0.9)',
    cardTextColor: '#831843',
    textColor: '#831843',
    buttonStyle: 'pill',
    fontFamily: 'Outfit',
  },
  {
    id: 'cyber-punk',
    name: 'Cyber Punk',
    backgroundColor: '#0a0a0a',
    backgroundGradient: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 30%, #0a1a2e 70%, #0a0a0a 100%)',
    cardColor: 'rgba(0,255,255,0.1)',
    cardTextColor: '#00ffff',
    textColor: '#ff00ff',
    buttonStyle: 'square',
    fontFamily: 'monospace',
  },
];

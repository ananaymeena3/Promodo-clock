import { create } from 'zustand';
import { ThemePreset, UserSettings } from '../types';
import { getStoredItem, setStoredItem, KEYS } from '../services/localStorageSync';

export const THEMES: { id: ThemePreset; name: string; description: string; hex: string }[] = [
  {
    id: 'dark-academia',
    name: 'Dark Academia',
    description: 'Moody mahogany browns, gold leaf & old Oxford library warmth',
    hex: '#CDAA7D',
  },
  {
    id: 'cozy-lofi',
    name: 'Cozy Lo-fi',
    description: 'Warm dusk ambient lighting, rain window & soft lo-fi study room',
    hex: '#f97316',
  },
  {
    id: 'forest',
    name: 'Forest Cabin',
    description: 'Evergreen woods, pine trees & natural cedar cabin warmth',
    hex: '#4ade80',
  },
  {
    id: 'tokyo',
    name: 'Tokyo Night',
    description: 'Neon indigo twilight, rainy city street & cozy high-rise sanctuary',
    hex: '#818cf8',
  },
  {
    id: 'minimalist',
    name: 'Minimalist Slate',
    description: 'Clean desks, neutral soft tones & clutter-free sanctuary',
    hex: '#D1D5DB',
  },
  {
    id: 'coffee',
    name: 'Coffee Shop',
    description: 'Rich espresso hues, warm roasted beans & cafe booth relaxation',
    hex: '#A1887F',
  },
  {
    id: 'moonlight',
    name: 'Moonlight Orient',
    description: 'Nocturnal starlight, cool azure mist & train window journey',
    hex: '#38bdf8',
  },
  {
    id: 'autumn',
    name: 'Alpine Autumn',
    description: 'Rust orange leaves, mountain fog & crisp wooden desk atmosphere',
    hex: '#f97316',
  },
];

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark-academia',
  accentColor: '#CDAA7D',
  notificationsEnabled: true,
  soundEnabled: true,
  soundVolume: 0.7,
  animationsEnabled: true,
  timeFormat: '12h',
  autoStartPomodoro: false,
  autoStartBreak: true,
  pomodoroMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakInterval: 4,
  activeStudyRoomId: 'oxford_library',
  lightingMode: 'golden_hour',
};

interface ThemeState {
  settings: UserSettings;
  setThemePreset: (preset: ThemePreset) => void;
  setCustomAccent: (hex: string) => void;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  settings: getStoredItem<UserSettings>(KEYS.SETTINGS, DEFAULT_SETTINGS),

  setThemePreset: (preset) => {
    const themeObj = THEMES.find((t) => t.id === preset);
    const hex = themeObj ? themeObj.hex : '#CDAA7D';
    const updated = { ...get().settings, theme: preset, accentColor: hex };
    set({ settings: updated });
    setStoredItem(KEYS.SETTINGS, updated);

    // Update root document CSS variables and class
    document.documentElement.className = `theme-${preset}`;
    document.documentElement.style.setProperty('--accent-primary', hex);
    document.documentElement.style.setProperty('--accent-glow', `${hex}55`);
  },

  setCustomAccent: (hex) => {
    const updated = { ...get().settings, accentColor: hex };
    set({ settings: updated });
    setStoredItem(KEYS.SETTINGS, updated);

    document.documentElement.style.setProperty('--accent-primary', hex);
    document.documentElement.style.setProperty('--accent-glow', `${hex}55`);
  },

  updateSettings: (newSettings) => {
    const updated = { ...get().settings, ...newSettings };
    set({ settings: updated });
    setStoredItem(KEYS.SETTINGS, updated);
  },
}));

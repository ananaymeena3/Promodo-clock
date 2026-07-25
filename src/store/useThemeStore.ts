import { create } from 'zustand';
import { ThemePreset, UserSettings } from '../types';
import { getStoredItem, setStoredItem, KEYS } from '../services/localStorageSync';

export const THEMES: { id: ThemePreset; name: string; hex: string }[] = [
  { id: 'purple', name: 'Purple Neon', hex: '#8b5cf6' },
  { id: 'midnight', name: 'Midnight Indigo', hex: '#6366f1' },
  { id: 'ocean', name: 'Cyan Ocean', hex: '#06b6d4' },
  { id: 'blue', name: 'Royal Blue', hex: '#3b82f6' },
  { id: 'green', name: 'Emerald Green', hex: '#10b981' },
  { id: 'forest', name: 'Forest Teal', hex: '#059669' },
  { id: 'orange', name: 'Amber Sunset', hex: '#f97316' },
  { id: 'red', name: 'Crimson Red', hex: '#ef4444' },
  { id: 'rosegold', name: 'Rose Gold', hex: '#f43f5e' },
  { id: 'black', name: 'Monochrome Slate', hex: '#64748b' },
];

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'purple',
  accentColor: '#8b5cf6',
  isDark: true,
  notificationsEnabled: true,
  soundEnabled: true,
  soundVolume: 0.7,
  animationsEnabled: true,
  language: 'English',
  timeFormat: '12h',
  autoStartPomodoro: false,
  autoStartBreak: true,
  pomodoroMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakInterval: 4,
};

interface ThemeState {
  settings: UserSettings;
  setThemePreset: (preset: ThemePreset) => void;
  setCustomAccent: (hex: string) => void;
  toggleDarkMode: () => void;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  settings: getStoredItem<UserSettings>(KEYS.SETTINGS, DEFAULT_SETTINGS),

  setThemePreset: (preset) => {
    const themeObj = THEMES.find((t) => t.id === preset);
    const hex = themeObj ? themeObj.hex : '#8b5cf6';
    const updated = { ...get().settings, theme: preset, accentColor: hex };
    set({ settings: updated });
    setStoredItem(KEYS.SETTINGS, updated);

    // Update root document CSS variables and class
    document.documentElement.className = updated.isDark ? `dark theme-${preset}` : `theme-${preset}`;
    document.documentElement.style.setProperty('--accent-primary', hex);
    document.documentElement.style.setProperty('--accent-glow', `${hex}66`);
  },

  setCustomAccent: (hex) => {
    const updated = { ...get().settings, accentColor: hex };
    set({ settings: updated });
    setStoredItem(KEYS.SETTINGS, updated);

    document.documentElement.style.setProperty('--accent-primary', hex);
    document.documentElement.style.setProperty('--accent-glow', `${hex}66`);
  },

  toggleDarkMode: () => {
    const isDark = !get().settings.isDark;
    const updated = { ...get().settings, isDark };
    set({ settings: updated });
    setStoredItem(KEYS.SETTINGS, updated);

    const theme = updated.theme;
    document.documentElement.className = isDark ? `dark theme-${theme}` : `theme-${theme}`;
  },

  updateSettings: (newSettings) => {
    const updated = { ...get().settings, ...newSettings };
    set({ settings: updated });
    setStoredItem(KEYS.SETTINGS, updated);
  },
}));

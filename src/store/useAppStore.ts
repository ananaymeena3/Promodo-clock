import { create } from 'zustand';
import {
  FocusSession,
  StreakStats,
  Achievement,
  Goal,
  Quote,
  StudyRoom,
  SanctuaryDecor,
  JournalEntry,
  SoundChannelId,
  SoundMixPreset,
  ThemePreset,
} from '../types';
import { getStoredItem, setStoredItem, KEYS } from '../services/localStorageSync';
import { soundEngine } from '../services/soundGenerator';
import confetti from 'canvas-confetti';

export const MOTIVATIONAL_QUOTES: Quote[] = [
  { id: 'q1', quote: 'Deep work is the ability to focus without distraction on a cognitively demanding task.', author: 'Cal Newport', category: 'Focus' },
  { id: 'q2', quote: 'You do not rise to the level of your goals. You fall to the level of your systems.', author: 'James Clear', category: 'Habits' },
  { id: 'q3', quote: 'Action is the foundational key to all success.', author: 'Pablo Picasso', category: 'Action' },
  { id: 'q4', quote: 'Simplicity boils down to two steps: Identify the essential. Eliminate the rest.', author: 'Leo Babauta', category: 'Minimalism' },
  { id: 'q5', quote: 'It is not that we have a short time to live, but that we waste a lot of it.', author: 'Seneca', category: 'Time' },
  { id: 'q6', quote: 'The secret of getting ahead is getting started.', author: 'Mark Twain', category: 'Motivation' },
  { id: 'q7', quote: 'Your mind is for having ideas, not holding them.', author: 'David Allen', category: 'Productivity' },
  { id: 'q8', quote: 'Amateurs sit and wait for inspiration, the rest of us just get up and go to work.', author: 'Stephen King', category: 'Work Ethic' },
];

export const DEFAULT_STUDY_ROOMS: StudyRoom[] = [
  {
    id: 'oxford_library',
    name: 'Oxford University Library',
    description: 'Vintage dark mahogany tables, high arched windows & soft rain outside Bodleian Library.',
    themePreset: 'dark-academia',
    bgType: 'library',
    lightingMode: 'golden_hour',
    defaultRain: true,
    defaultSoundPreset: 'Oxford Afternoon',
    wallpaperUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1600&auto=format&fit=crop&q=80',
  },
  {
    id: 'cozy_cabin',
    name: 'Cozy Mountain Log Cabin',
    description: 'Crackling stone fireplace, cedar wood walls, warm lamp glow & falling snow outside.',
    themePreset: 'forest',
    bgType: 'cabin_fire',
    lightingMode: 'fireplace',
    defaultRain: false,
    defaultSoundPreset: 'Fireplace & Snow',
    wallpaperUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1600&auto=format&fit=crop&q=80',
  },
  {
    id: 'rain_apartment',
    name: 'Rainy City Apartment',
    description: 'Soft twilight lo-fi beats, steam rising from coffee & steady raindrops on window glass.',
    themePreset: 'cozy-lofi',
    bgType: 'rain_window',
    lightingMode: 'night',
    defaultRain: true,
    defaultSoundPreset: 'Midnight Rain',
    wallpaperUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&auto=format&fit=crop&q=80',
  },
  {
    id: 'japanese_study',
    name: 'Kyoto Zen Sanctuary',
    description: 'Minimalist tatami desk, gentle bamboo water fountain & serene garden courtyard.',
    themePreset: 'minimalist',
    bgType: 'japanese_garden',
    lightingMode: 'afternoon',
    defaultRain: false,
    defaultSoundPreset: 'Bamboo Garden',
    wallpaperUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1600&auto=format&fit=crop&q=80',
  },
  {
    id: 'coffee_corner',
    name: 'Artisan Espresso Bar',
    description: 'Aromatic coffee steam, soft Jazz piano chords & cozy corner booth by the window.',
    themePreset: 'coffee',
    bgType: 'coffee_desk',
    lightingMode: 'golden_hour',
    defaultRain: false,
    defaultSoundPreset: 'Cafe Murmur',
    wallpaperUrl: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1600&auto=format&fit=crop&q=80',
  },
  {
    id: 'train_cabin',
    name: 'Midnight Orient Express',
    description: 'Gentle train rhythm on tracks, moonlight over misty mountains & velvet armchairs.',
    themePreset: 'moonlight',
    bgType: 'train_window',
    lightingMode: 'night',
    defaultRain: true,
    defaultSoundPreset: 'Night Train',
    wallpaperUrl: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1600&auto=format&fit=crop&q=80',
  },
];

export const INITIAL_SANCTUARY_DECOR: SanctuaryDecor[] = [
  { id: 'dec_book1', title: 'First Edition Leatherbound Book', category: 'book', description: 'Unlocked after 1 focus session. Adds classic library charm.', requiredSessions: 1, icon: 'BookOpen' },
  { id: 'dec_plant1', title: 'Monstera Desk Plant', category: 'plant', description: 'Unlocked after 3 focus sessions. Brings fresh botanical life.', requiredSessions: 3, icon: 'Flower2' },
  { id: 'dec_lamp1', title: 'Warm Brass Desk Lamp', category: 'lamp', description: 'Unlocked after 5 focus sessions. Emits golden reading glow.', requiredSessions: 5, icon: 'Lamp' },
  { id: 'dec_mug1', title: 'Handcrafted Ceramic Mug', category: 'mug', description: 'Unlocked after 8 focus sessions. Keeps warm coffee steaming.', requiredSessions: 8, icon: 'Coffee' },
  { id: 'dec_globe1', title: 'Vintage Brass Desk Globe', category: 'book', description: 'Unlocked after 12 focus sessions. Represents world exploration.', requiredSessions: 12, icon: 'Compass' },
  { id: 'dec_cat1', title: 'Sleeping Sanctuary Cat', category: 'cat', description: 'Unlocked after 15 focus sessions. Purrs softly on your desk cushion.', requiredSessions: 15, icon: 'Cat' },
  { id: 'dec_bonsai', title: '100-Year Ancient Bonsai Tree', category: 'plant', description: 'Unlocked after 25 focus sessions. A symbol of patience and mastery.', requiredSessions: 25, icon: 'Trees' },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'ach_first', title: 'First Spark', description: 'Complete your first Pomodoro session', icon: 'Zap', requiredSessions: 1 },
  { id: 'ach_10', title: 'Flow Explorer', description: 'Complete 10 focus sessions', icon: 'Compass', requiredSessions: 10 },
  { id: 'ach_100', title: 'Deep Work Master', description: 'Complete 100 focus sessions', icon: 'Award', requiredSessions: 100 },
  { id: 'ach_500', title: 'Productivity Titan', description: 'Complete 500 focus sessions', icon: 'Crown', requiredSessions: 500 },
];

const INITIAL_STREAKS: StreakStats = {
  dailyStreak: 0,
  weeklyStreak: 0,
  monthlyStreak: 0,
  bestStreak: 0,
  lastActiveDate: new Date().toISOString().slice(0, 10),
  totalSessions: 0,
  totalFocusMinutes: 0,
  booksEarned: 0,
  plantsEarned: 0,
  decorUnlockedCount: 0,
};

const INITIAL_GOALS: Goal[] = [
  { id: 'g_daily', type: 'daily', targetMinutes: 120, currentMinutes: 0, completed: false },
  { id: 'g_weekly', type: 'weekly', targetMinutes: 600, currentMinutes: 0, completed: false },
  { id: 'g_monthly', type: 'monthly', targetMinutes: 2400, currentMinutes: 0, completed: false },
];

interface AppState {
  // Modals & Panels
  isCommandPaletteOpen: boolean;
  isShortcutsModalOpen: boolean;
  isAICoachOpen: boolean;
  isAchievementsOpen: boolean;
  isBackupModalOpen: boolean;

  // Haven Core State
  currentQuote: Quote;
  favoriteQuoteIds: string[];
  sessions: FocusSession[];
  streaks: StreakStats;
  achievements: Achievement[];
  goals: Goal[];

  // Study Rooms & Environment
  studyRooms: StudyRoom[];
  activeRoomId: string;
  lightingMode: 'morning' | 'afternoon' | 'golden_hour' | 'night' | 'fireplace';
  
  // Sanctuary Decor / Gamification
  sanctuaryDecor: SanctuaryDecor[];

  // Journal
  journalEntries: JournalEntry[];

  // Ambient Mixer state
  activeChannels: Record<SoundChannelId, { volume: number; isMuted: boolean; isPlaying: boolean }>;

  // Actions
  toggleCommandPalette: () => void;
  toggleShortcutsModal: () => void;
  toggleAICoachModal: () => void;
  toggleAchievementsModal: () => void;
  toggleBackupModal: () => void;

  refreshQuote: () => void;
  toggleFavoriteQuote: (id: string) => void;

  setActiveRoom: (roomId: string) => void;
  setLightingMode: (mode: 'morning' | 'afternoon' | 'golden_hour' | 'night' | 'fireplace') => void;

  logFocusSession: (durationMins: number, mode: any, taskId?: string, taskTitle?: string) => void;
  updateGoals: (addedMinutes: number) => void;

  // Sound Channel Mixer Actions
  setChannelVolume: (id: SoundChannelId, volume: number) => void;
  toggleChannelMute: (id: SoundChannelId) => void;
  toggleChannelPlay: (id: SoundChannelId) => void;
  applyMixPreset: (preset: Record<SoundChannelId, number>) => void;
  stopAllSoundChannels: () => void;

  // Journal Actions
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateJournalEntry: (id: string, updates: Partial<JournalEntry>) => void;
  deleteJournalEntry: (id: string) => void;

  triggerConfetti: () => void;
  resetStreaksAndStats: () => void;
  clearAllData: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  isCommandPaletteOpen: false,
  isShortcutsModalOpen: false,
  isAICoachOpen: false,
  isAchievementsOpen: false,
  isBackupModalOpen: false,

  currentQuote: MOTIVATIONAL_QUOTES[0],
  favoriteQuoteIds: getStoredItem<string[]>(KEYS.FAVORITE_QUOTES, []),

  sessions: getStoredItem<FocusSession[]>(KEYS.SESSIONS, []),
  streaks: getStoredItem<StreakStats>(KEYS.STREAKS, INITIAL_STREAKS),
  achievements: getStoredItem<Achievement[]>(KEYS.ACHIEVEMENTS, INITIAL_ACHIEVEMENTS),
  goals: getStoredItem<Goal[]>(KEYS.GOALS, INITIAL_GOALS),

  studyRooms: DEFAULT_STUDY_ROOMS,
  activeRoomId: getStoredItem<string>('haven_active_room', 'oxford_library'),
  lightingMode: getStoredItem<'morning' | 'afternoon' | 'golden_hour' | 'night' | 'fireplace'>('haven_lighting_mode', 'golden_hour'),

  sanctuaryDecor: getStoredItem<SanctuaryDecor[]>('haven_sanctuary_decor', INITIAL_SANCTUARY_DECOR),
  journalEntries: getStoredItem<JournalEntry[]>('haven_journal_entries', []),

  activeChannels: {
    rain: { volume: 0.5, isMuted: false, isPlaying: false },
    heavy_rain: { volume: 0.5, isMuted: false, isPlaying: false },
    thunder: { volume: 0.4, isMuted: false, isPlaying: false },
    fireplace: { volume: 0.6, isMuted: false, isPlaying: false },
    forest: { volume: 0.5, isMuted: false, isPlaying: false },
    ocean: { volume: 0.5, isMuted: false, isPlaying: false },
    coffeeshop: { volume: 0.5, isMuted: false, isPlaying: false },
    library: { volume: 0.4, isMuted: false, isPlaying: false },
    wind: { volume: 0.4, isMuted: false, isPlaying: false },
    crickets: { volume: 0.4, isMuted: false, isPlaying: false },
    snow: { volume: 0.4, isMuted: false, isPlaying: false },
    train: { volume: 0.5, isMuted: false, isPlaying: false },
    whitenoise: { volume: 0.3, isMuted: false, isPlaying: false },
    brownnoise: { volume: 0.3, isMuted: false, isPlaying: false },
    pinknoise: { volume: 0.3, isMuted: false, isPlaying: false },
  },

  toggleCommandPalette: () => set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),
  toggleShortcutsModal: () => set((state) => ({ isShortcutsModalOpen: !state.isShortcutsModalOpen })),
  toggleAICoachModal: () => set((state) => ({ isAICoachOpen: !state.isAICoachOpen })),
  toggleAchievementsModal: () => set((state) => ({ isAchievementsOpen: !state.isAchievementsOpen })),
  toggleBackupModal: () => set((state) => ({ isBackupModalOpen: !state.isBackupModalOpen })),

  refreshQuote: () => {
    const quotes = MOTIVATIONAL_QUOTES;
    const randomIndex = Math.floor(Math.random() * quotes.length);
    set({ currentQuote: quotes[randomIndex] });
  },

  toggleFavoriteQuote: (id) => {
    const favs = get().favoriteQuoteIds;
    const nextFavs = favs.includes(id) ? favs.filter((qId) => qId !== id) : [...favs, id];
    set({ favoriteQuoteIds: nextFavs });
    setStoredItem(KEYS.FAVORITE_QUOTES, nextFavs);
  },

  setActiveRoom: (roomId) => {
    const room = get().studyRooms.find((r) => r.id === roomId);
    if (room) {
      set({ activeRoomId: roomId, lightingMode: room.lightingMode });
      setStoredItem('haven_active_room', roomId);
      setStoredItem('haven_lighting_mode', room.lightingMode);

      // Apply Room Theme
      document.documentElement.className = `theme-${room.themePreset}`;
    }
  },

  setLightingMode: (lightingMode) => {
    set({ lightingMode });
    setStoredItem('haven_lighting_mode', lightingMode);
  },

  logFocusSession: (durationMins, mode, taskId, taskTitle) => {
    const today = new Date().toISOString().slice(0, 10);
    const newSession: FocusSession = {
      id: 'sess_' + Date.now(),
      durationMinutes: durationMins,
      mode,
      taskId,
      taskTitle,
      completedAt: new Date().toISOString(),
      date: today,
    };

    const updatedSessions = [newSession, ...get().sessions];
    const currentStreaks = get().streaks;
    const lastActive = currentStreaks.lastActiveDate;
    let newDaily = currentStreaks.dailyStreak;

    if (lastActive !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      if (lastActive === yesterday) {
        newDaily += 1;
      } else {
        newDaily = 1;
      }
    }

    const newTotalSessions = currentStreaks.totalSessions + 1;
    const updatedStreaks: StreakStats = {
      ...currentStreaks,
      dailyStreak: newDaily,
      bestStreak: Math.max(newDaily, currentStreaks.bestStreak),
      lastActiveDate: today,
      totalSessions: newTotalSessions,
      totalFocusMinutes: currentStreaks.totalFocusMinutes + durationMins,
      booksEarned: Math.floor(newTotalSessions / 2),
      plantsEarned: Math.floor(newTotalSessions / 4),
      decorUnlockedCount: get().sanctuaryDecor.filter((d) => newTotalSessions >= d.requiredSessions).length,
    };

    // Unlock Sanctuary Decor items
    const updatedDecor = get().sanctuaryDecor.map((d) => {
      if (!d.unlockedAt && newTotalSessions >= d.requiredSessions) {
        soundEngine.playAchievementSound();
        try {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        } catch (e) {}
        return { ...d, unlockedAt: new Date().toISOString() };
      }
      return d;
    });

    set({
      sessions: updatedSessions,
      streaks: updatedStreaks,
      sanctuaryDecor: updatedDecor,
    });

    setStoredItem(KEYS.SESSIONS, updatedSessions);
    setStoredItem(KEYS.STREAKS, updatedStreaks);
    setStoredItem('haven_sanctuary_decor', updatedDecor);

    get().updateGoals(durationMins);
  },

  updateGoals: (addedMinutes) => {
    const updatedGoals = get().goals.map((g) => {
      const nextCurr = g.currentMinutes + addedMinutes;
      const wasCompleted = g.completed;
      const isNowCompleted = nextCurr >= g.targetMinutes;

      if (!wasCompleted && isNowCompleted) {
        soundEngine.playAchievementSound();
        get().triggerConfetti();
      }

      return { ...g, currentMinutes: nextCurr, completed: isNowCompleted };
    });

    set({ goals: updatedGoals });
    setStoredItem(KEYS.GOALS, updatedGoals);
  },

  setChannelVolume: (id, volume) => {
    soundEngine.setChannelVolume(id, volume);
    set((state) => ({
      activeChannels: {
        ...state.activeChannels,
        [id]: { ...state.activeChannels[id], volume },
      },
    }));
  },

  toggleChannelMute: (id) => {
    const isMuted = soundEngine.toggleChannelMute(id);
    set((state) => ({
      activeChannels: {
        ...state.activeChannels,
        [id]: { ...state.activeChannels[id], isMuted },
      },
    }));
  },

  toggleChannelPlay: (id) => {
    const isPlaying = soundEngine.toggleChannelPlay(id);
    set((state) => ({
      activeChannels: {
        ...state.activeChannels,
        [id]: { ...state.activeChannels[id], isPlaying },
      },
    }));
  },

  applyMixPreset: (preset) => {
    Object.entries(preset).forEach(([idStr, vol]) => {
      const id = idStr as SoundChannelId;
      if (vol > 0) {
        soundEngine.startChannel(id, vol);
        set((state) => ({
          activeChannels: {
            ...state.activeChannels,
            [id]: { volume: vol, isMuted: false, isPlaying: true },
          },
        }));
      } else {
        soundEngine.stopChannel(id);
        set((state) => ({
          activeChannels: {
            ...state.activeChannels,
            [id]: { volume: 0, isMuted: false, isPlaying: false },
          },
        }));
      }
    });
  },

  stopAllSoundChannels: () => {
    soundEngine.stopAllChannels();
    const resetChannels = { ...get().activeChannels };
    Object.keys(resetChannels).forEach((id) => {
      resetChannels[id as SoundChannelId] = { ...resetChannels[id as SoundChannelId], isPlaying: false };
    });
    set({ activeChannels: resetChannels });
  },

  addJournalEntry: (entryData) => {
    const today = new Date().toISOString().slice(0, 10);
    const newEntry: JournalEntry = {
      ...entryData,
      id: 'j_' + Date.now(),
      date: today,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newEntry, ...get().journalEntries];
    set({ journalEntries: updated });
    setStoredItem('haven_journal_entries', updated);
  },

  updateJournalEntry: (id, updates) => {
    const updated = get().journalEntries.map((e) =>
      e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e
    );
    set({ journalEntries: updated });
    setStoredItem('haven_journal_entries', updated);
  },

  deleteJournalEntry: (id) => {
    const updated = get().journalEntries.filter((e) => e.id !== id);
    set({ journalEntries: updated });
    setStoredItem('haven_journal_entries', updated);
  },

  triggerConfetti: () => {
    try {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
    } catch (e) {}
  },

  resetStreaksAndStats: () => {
    const resetStreaks: StreakStats = {
      dailyStreak: 0,
      weeklyStreak: 0,
      monthlyStreak: 0,
      bestStreak: 0,
      lastActiveDate: new Date().toISOString().slice(0, 10),
      totalSessions: 0,
      totalFocusMinutes: 0,
      booksEarned: 0,
      plantsEarned: 0,
      decorUnlockedCount: 0,
    };
    const resetGoals: Goal[] = [
      { id: 'g_daily', type: 'daily', targetMinutes: 120, currentMinutes: 0, completed: false },
      { id: 'g_weekly', type: 'weekly', targetMinutes: 600, currentMinutes: 0, completed: false },
      { id: 'g_monthly', type: 'monthly', targetMinutes: 2400, currentMinutes: 0, completed: false },
    ];
    set({ streaks: resetStreaks, sessions: [], goals: resetGoals, sanctuaryDecor: INITIAL_SANCTUARY_DECOR });
    setStoredItem(KEYS.STREAKS, resetStreaks);
    setStoredItem(KEYS.SESSIONS, []);
    setStoredItem(KEYS.GOALS, resetGoals);
    setStoredItem('haven_sanctuary_decor', INITIAL_SANCTUARY_DECOR);
  },

  clearAllData: () => {
    localStorage.clear();
    window.location.reload();
  },
}));

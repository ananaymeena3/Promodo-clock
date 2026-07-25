import { create } from 'zustand';
import { FocusSession, StreakStats, Achievement, Goal, Quote, SoundTrack } from '../types';
import { getStoredItem, setStoredItem, KEYS } from '../services/localStorageSync';
import { soundEngine } from '../services/soundGenerator';
import confetti from 'canvas-confetti';

export const MOTIVATIONAL_QUOTES: Quote[] = [
  { id: 'q1', quote: 'Focus is a muscle. The more you practice non-distraction, the stronger you become.', author: 'Cal Newport', category: 'Focus' },
  { id: 'q2', quote: 'You do not rise to the level of your goals. You fall to the level of your systems.', author: 'James Clear', category: 'Habits' },
  { id: 'q3', quote: 'Action is the foundational key to all success.', author: 'Pablo Picasso', category: 'Action' },
  { id: 'q4', quote: 'Simplicity boils down to two steps: Identify the essential. Eliminate the rest.', author: 'Leo Babauta', category: 'Minimalism' },
  { id: 'q5', quote: 'It is not that we have a short time to live, but that we waste a lot of it.', author: 'Seneca', category: 'Time' },
  { id: 'q6', quote: 'The secret of getting ahead is getting started.', author: 'Mark Twain', category: 'Motivation' },
  { id: 'q7', quote: 'Your mind is for having ideas, not holding them.', author: 'David Allen', category: 'Productivity' },
  { id: 'q8', quote: 'Amateurs sit and wait for inspiration, the rest of us just get up and go to work.', author: 'Stephen King', category: 'Work Ethic' },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'ach_first', title: 'First Spark', description: 'Complete your first Pomodoro session', icon: 'Zap', requiredSessions: 1, unlockedAt: new Date().toISOString() },
  { id: 'ach_10', title: 'Flow Explorer', description: 'Complete 10 focus sessions', icon: 'Compass', requiredSessions: 10, unlockedAt: new Date().toISOString() },
  { id: 'ach_100', title: 'Deep Work Master', description: 'Complete 100 focus sessions', icon: 'Award', requiredSessions: 100 },
  { id: 'ach_500', title: 'Productivity Titan', description: 'Complete 500 focus sessions', icon: 'Crown', requiredSessions: 500 },
  { id: 'ach_1000', title: 'Focus Legend', description: 'Complete 1,000 focus sessions', icon: 'Flame', requiredSessions: 1000 },
];

const INITIAL_STREAKS: StreakStats = {
  dailyStreak: 3,
  weeklyStreak: 2,
  monthlyStreak: 1,
  bestStreak: 7,
  lastActiveDate: new Date().toISOString().slice(0, 10),
  totalSessions: 14,
  totalFocusMinutes: 350,
};

const INITIAL_GOALS: Goal[] = [
  { id: 'g_daily', type: 'daily', targetMinutes: 120, currentMinutes: 75, completed: false },
  { id: 'g_weekly', type: 'weekly', targetMinutes: 600, currentMinutes: 350, completed: false },
  { id: 'g_monthly', type: 'monthly', targetMinutes: 2400, currentMinutes: 1200, completed: false },
];

const INITIAL_SESSIONS: FocusSession[] = [
  { id: 's1', durationMinutes: 25, mode: 'pomodoro', taskTitle: 'Design FocusFlow MacOS Dashboard UI', completedAt: new Date(Date.now() - 3600000).toISOString(), date: new Date().toISOString().slice(0, 10) },
  { id: 's2', durationMinutes: 25, mode: 'pomodoro', taskTitle: 'Refactor State Management', completedAt: new Date(Date.now() - 7200000).toISOString(), date: new Date().toISOString().slice(0, 10) },
  { id: 's3', durationMinutes: 25, mode: 'pomodoro', taskTitle: 'Design FocusFlow MacOS Dashboard UI', completedAt: new Date(Date.now() - 10800000).toISOString(), date: new Date().toISOString().slice(0, 10) },
  { id: 's4', durationMinutes: 50, mode: 'pomodoro', taskTitle: 'Deep Work Coding Sprint', completedAt: new Date(Date.now() - 86400000).toISOString(), date: new Date(Date.now() - 86400000).toISOString().slice(0, 10) },
  { id: 's5', durationMinutes: 25, mode: 'pomodoro', taskTitle: 'Atomic Habits Reading', completedAt: new Date(Date.now() - 172800000).toISOString(), date: new Date(Date.now() - 172800000).toISOString().slice(0, 10) },
];

interface AppState {
  isCommandPaletteOpen: boolean;
  isShortcutsModalOpen: boolean;
  isAICoachOpen: boolean;
  isAchievementsOpen: boolean;
  isBackupModalOpen: boolean;
  
  currentQuote: Quote;
  favoriteQuoteIds: string[];
  
  sessions: FocusSession[];
  streaks: StreakStats;
  achievements: Achievement[];
  goals: Goal[];

  // Ambient Player state
  activeSoundTrack: SoundTrack | null;
  isSoundPlaying: boolean;
  soundVolume: number;

  // Actions
  toggleCommandPalette: () => void;
  toggleShortcutsModal: () => void;
  toggleAICoachModal: () => void;
  toggleAchievementsModal: () => void;
  toggleBackupModal: () => void;
  
  refreshQuote: () => void;
  toggleFavoriteQuote: (id: string) => void;
  
  logFocusSession: (durationMins: number, mode: any, taskId?: string, taskTitle?: string) => void;
  updateGoals: (addedMinutes: number) => void;
  
  setAmbientTrack: (track: SoundTrack | null) => void;
  toggleAmbientPlay: () => void;
  setAmbientVolume: (vol: number) => void;
  
  triggerConfetti: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  isCommandPaletteOpen: false,
  isShortcutsModalOpen: false,
  isAICoachOpen: false,
  isAchievementsOpen: false,
  isBackupModalOpen: false,

  currentQuote: MOTIVATIONAL_QUOTES[0],
  favoriteQuoteIds: getStoredItem<string[]>(KEYS.FAVORITE_QUOTES, ['q1', 'q2']),

  sessions: getStoredItem<FocusSession[]>(KEYS.SESSIONS, INITIAL_SESSIONS),
  streaks: getStoredItem<StreakStats>(KEYS.STREAKS, INITIAL_STREAKS),
  achievements: getStoredItem<Achievement[]>(KEYS.ACHIEVEMENTS, INITIAL_ACHIEVEMENTS),
  goals: getStoredItem<Goal[]>(KEYS.GOALS, INITIAL_GOALS),

  activeSoundTrack: null,
  isSoundPlaying: false,
  soundVolume: 0.6,

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

    // Update Streaks
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
    };

    // Check Achievements Unlock
    const updatedAchievements = get().achievements.map((ach) => {
      if (!ach.unlockedAt && newTotalSessions >= ach.requiredSessions) {
        soundEngine.playAchievementSound();
        try {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        } catch (e) {}
        return { ...ach, unlockedAt: new Date().toISOString() };
      }
      return ach;
    });

    set({
      sessions: updatedSessions,
      streaks: updatedStreaks,
      achievements: updatedAchievements,
    });

    setStoredItem(KEYS.SESSIONS, updatedSessions);
    setStoredItem(KEYS.STREAKS, updatedStreaks);
    setStoredItem(KEYS.ACHIEVEMENTS, updatedAchievements);

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

      return {
        ...g,
        currentMinutes: nextCurr,
        completed: isNowCompleted,
      };
    });

    set({ goals: updatedGoals });
    setStoredItem(KEYS.GOALS, updatedGoals);
  },

  setAmbientTrack: (track) => {
    if (track === get().activeSoundTrack && get().isSoundPlaying) {
      soundEngine.stopAmbient();
      set({ activeSoundTrack: null, isSoundPlaying: false });
    } else if (track) {
      soundEngine.startAmbient(track, get().soundVolume);
      set({ activeSoundTrack: track, isSoundPlaying: true });
    }
  },

  toggleAmbientPlay: () => {
    const { isSoundPlaying, activeSoundTrack, soundVolume } = get();
    if (isSoundPlaying) {
      soundEngine.stopAmbient();
      set({ isSoundPlaying: false });
    } else {
      const trackToPlay = activeSoundTrack || 'rain';
      soundEngine.startAmbient(trackToPlay, soundVolume);
      set({ activeSoundTrack: trackToPlay, isSoundPlaying: true });
    }
  },

  setAmbientVolume: (vol) => {
    set({ soundVolume: vol });
    soundEngine.setAmbientVolume(vol);
  },

  triggerConfetti: () => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
      });
    } catch (e) {}
  },
}));

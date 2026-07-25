import { create } from 'zustand';
import { Habit } from '../types';
import { getStoredItem, setStoredItem, KEYS } from '../services/localStorageSync';

interface HabitState {
  habits: Habit[];
  toggleHabitCheckIn: (habitId: string, dateStr: string) => void;
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'history'>) => void;
  deleteHabit: (id: string) => void;
}

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: getStoredItem<Habit[]>(KEYS.HABITS, []),

  toggleHabitCheckIn: (habitId, dateStr) => {
    const updated = get().habits.map((h) => {
      if (h.id === habitId) {
        const nextHistory = { ...h.history };
        if (nextHistory[dateStr]) {
          delete nextHistory[dateStr];
        } else {
          nextHistory[dateStr] = true;
        }
        return { ...h, history: nextHistory };
      }
      return h;
    });
    set({ habits: updated });
    setStoredItem(KEYS.HABITS, updated);
  },

  addHabit: (habitData) => {
    const newHabit: Habit = {
      ...habitData,
      id: 'h_' + Date.now(),
      history: {},
      createdAt: new Date().toISOString(),
    };
    const updated = [...get().habits, newHabit];
    set({ habits: updated });
    setStoredItem(KEYS.HABITS, updated);
  },

  deleteHabit: (id) => {
    const updated = get().habits.filter((h) => h.id !== id);
    set({ habits: updated });
    setStoredItem(KEYS.HABITS, updated);
  },
}));

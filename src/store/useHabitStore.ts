import { create } from 'zustand';
import { Habit } from '../types';
import { getStoredItem, setStoredItem, KEYS } from '../services/localStorageSync';

const DEFAULT_HABITS: Habit[] = [
  {
    id: 'h1',
    title: 'Drink 2.5L Water',
    category: 'Health',
    icon: 'Droplets',
    color: '#06b6d4',
    frequency: 'daily',
    history: {
      [new Date().toISOString().slice(0, 10)]: true,
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'h2',
    title: 'Exercise / Workout',
    category: 'Fitness',
    icon: 'Dumbbell',
    color: '#ef4444',
    frequency: 'daily',
    history: {
      [new Date().toISOString().slice(0, 10)]: true,
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'h3',
    title: 'Read 20 Pages',
    category: 'Mind',
    icon: 'BookOpen',
    color: '#10b981',
    frequency: 'daily',
    history: {},
    createdAt: new Date().toISOString(),
  },
  {
    id: 'h4',
    title: 'Meditation 10m',
    category: 'Mindfulness',
    icon: 'Smile',
    color: '#8b5cf6',
    frequency: 'daily',
    history: {
      [new Date().toISOString().slice(0, 10)]: true,
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'h5',
    title: '8 Hours Sleep',
    category: 'Rest',
    icon: 'Moon',
    color: '#6366f1',
    frequency: 'daily',
    history: {},
    createdAt: new Date().toISOString(),
  },
  {
    id: 'h6',
    title: 'Code 1 Hour',
    category: 'Skill',
    icon: 'Code',
    color: '#f59e0b',
    frequency: 'daily',
    history: {
      [new Date().toISOString().slice(0, 10)]: true,
    },
    createdAt: new Date().toISOString(),
  },
];

interface HabitState {
  habits: Habit[];
  toggleHabitCheckIn: (habitId: string, dateStr: string) => void;
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'history'>) => void;
  deleteHabit: (id: string) => void;
}

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: getStoredItem<Habit[]>(KEYS.HABITS, DEFAULT_HABITS),

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

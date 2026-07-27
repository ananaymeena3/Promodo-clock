import { create } from 'zustand';
import { ExamCountdown } from '../types';
import { getStoredItem, setStoredItem, KEYS } from '../services/localStorageSync';

const DEFAULT_MILESTONES: ExamCountdown[] = [];

interface MilestoneState {
  exams: ExamCountdown[];
  addExam: (exam: Omit<ExamCountdown, 'id'>) => void;
  deleteExam: (id: string) => void;
}

export const useMilestoneStore = create<MilestoneState>((set, get) => ({
  exams: getStoredItem<ExamCountdown[]>(KEYS.MILESTONES, DEFAULT_MILESTONES).filter(
    (e) => e.id !== 'ex_1' && e.id !== 'ex_2'
  ),

  addExam: (examData) => {
    const newExam: ExamCountdown = {
      ...examData,
      id: 'ex_' + Date.now(),
    };
    const updated = [...get().exams, newExam];
    set({ exams: updated });
    setStoredItem(KEYS.MILESTONES, updated);
  },

  deleteExam: (id) => {
    const updated = get().exams.filter((e) => e.id !== id);
    set({ exams: updated });
    setStoredItem(KEYS.MILESTONES, updated);
  },
}));

import { create } from 'zustand';
import { TimerMode, TimerPreset, Task } from '../types';
import { soundEngine } from '../services/soundGenerator';

export const TIMER_PRESETS: TimerPreset[] = [
  { id: 'classic', name: 'Classic', pomodoro: 25, shortBreak: 5, longBreak: 15, description: 'Standard 25/5 technique', iconName: 'Clock' },
  { id: 'deep_work', name: 'Deep Work', pomodoro: 50, shortBreak: 10, longBreak: 25, description: 'Intense 50min focus blocks', iconName: 'Brain' },
  { id: 'quick_tasks', name: 'Quick Tasks', pomodoro: 15, shortBreak: 3, longBreak: 10, description: 'Fast 15min task sprints', iconName: 'Zap' },
  { id: 'exam_mode', name: 'Exam Mode', pomodoro: 90, shortBreak: 20, longBreak: 30, description: 'Long form test endurance', iconName: 'GraduationCap' },
  { id: 'developer', name: 'Developer Mode', pomodoro: 60, shortBreak: 10, longBreak: 20, description: '60min coding flow state', iconName: 'Code' },
];

interface TimerState {
  mode: TimerMode;
  secondsLeft: number;
  totalSeconds: number;
  isRunning: boolean;
  activePresetId: string;
  activeTaskId: string | null;
  activeTaskTitle: string | null;
  pomodoroMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  customMinutes: number;
  completedSessionsCount: number;
  autoSwitch: boolean;
  
  // Actions
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
  setMode: (mode: TimerMode) => void;
  setPreset: (presetId: string) => void;
  setCustomDuration: (minutes: number) => void;
  setActiveTask: (task: Task | null) => void;
  toggleAutoSwitch: () => void;
  adjustTime: (deltaMinutes: number) => void;
}

export const useTimerStore = create<TimerState>((set, get) => ({
  mode: 'pomodoro',
  secondsLeft: 25 * 60,
  totalSeconds: 25 * 60,
  isRunning: false,
  activePresetId: 'classic',
  activeTaskId: null,
  activeTaskTitle: null,
  pomodoroMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  customMinutes: 45,
  completedSessionsCount: 0,
  autoSwitch: true,

  startTimer: () => {
    set({ isRunning: true });
    soundEngine.playClickSound();
  },

  pauseTimer: () => {
    set({ isRunning: false });
    soundEngine.playClickSound();
  },

  resetTimer: () => {
    const { mode, pomodoroMinutes, shortBreakMinutes, longBreakMinutes, customMinutes } = get();
    let mins = pomodoroMinutes;
    if (mode === 'shortBreak') mins = shortBreakMinutes;
    if (mode === 'longBreak') mins = longBreakMinutes;
    if (mode === 'custom') mins = customMinutes;

    set({
      isRunning: false,
      secondsLeft: mins * 60,
      totalSeconds: mins * 60,
    });
    soundEngine.playClickSound();
  },

  setMode: (mode: TimerMode) => {
    const { pomodoroMinutes, shortBreakMinutes, longBreakMinutes, customMinutes } = get();
    let mins = pomodoroMinutes;
    if (mode === 'shortBreak') mins = shortBreakMinutes;
    if (mode === 'longBreak') mins = longBreakMinutes;
    if (mode === 'custom') mins = customMinutes;

    set({
      mode,
      isRunning: false,
      secondsLeft: mins * 60,
      totalSeconds: mins * 60,
    });
    soundEngine.playClickSound();
  },

  setPreset: (presetId: string) => {
    const preset = TIMER_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    set((state) => {
      let mins = preset.pomodoro;
      if (state.mode === 'shortBreak') mins = preset.shortBreak;
      if (state.mode === 'longBreak') mins = preset.longBreak;

      return {
        activePresetId: presetId,
        pomodoroMinutes: preset.pomodoro,
        shortBreakMinutes: preset.shortBreak,
        longBreakMinutes: preset.longBreak,
        isRunning: false,
        secondsLeft: mins * 60,
        totalSeconds: mins * 60,
      };
    });
    soundEngine.playClickSound();
  },

  setCustomDuration: (minutes: number) => {
    const clamped = Math.max(1, Math.min(180, minutes));
    set({
      mode: 'custom',
      customMinutes: clamped,
      isRunning: false,
      secondsLeft: clamped * 60,
      totalSeconds: clamped * 60,
    });
  },

  setActiveTask: (task: Task | null) => {
    set({
      activeTaskId: task ? task.id : null,
      activeTaskTitle: task ? task.title : null,
    });
  },

  toggleAutoSwitch: () => set((state) => ({ autoSwitch: !state.autoSwitch })),

  adjustTime: (deltaMinutes: number) => {
    set((state) => {
      const newTotal = Math.max(60, state.totalSeconds + deltaMinutes * 60);
      const newLeft = Math.max(0, state.secondsLeft + deltaMinutes * 60);
      return {
        secondsLeft: newLeft,
        totalSeconds: newTotal,
      };
    });
  },

  tick: () => {
    const { secondsLeft, isRunning, mode, autoSwitch } = get();
    if (!isRunning) return;

    if (secondsLeft <= 1) {
      soundEngine.playTimerFinishSound();
      
      // Trigger Web Browser Notification
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        const title = mode === 'pomodoro' ? '🎉 Pomodoro Finished!' : '⚡ Break Ended!';
        new Notification(title, {
          body: mode === 'pomodoro' ? 'Great focus work! Time to take a restful break.' : 'Break is over! Ready for your next focus session?',
          icon: '/favicon.svg',
        });
      }

      set((state) => {
        const newCount = mode === 'pomodoro' ? state.completedSessionsCount + 1 : state.completedSessionsCount;
        let nextMode: TimerMode = state.mode;
        
        if (autoSwitch) {
          if (state.mode === 'pomodoro') {
            nextMode = newCount % 4 === 0 ? 'longBreak' : 'shortBreak';
          } else {
            nextMode = 'pomodoro';
          }
        }

        let nextMins = state.pomodoroMinutes;
        if (nextMode === 'shortBreak') nextMins = state.shortBreakMinutes;
        if (nextMode === 'longBreak') nextMins = state.longBreakMinutes;

        return {
          isRunning: autoSwitch,
          mode: nextMode,
          completedSessionsCount: newCount,
          secondsLeft: nextMins * 60,
          totalSeconds: nextMins * 60,
        };
      });
    } else {
      set({ secondsLeft: secondsLeft - 1 });
    }
  },
}));

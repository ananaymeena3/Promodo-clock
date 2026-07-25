export type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak' | 'custom';

export interface TimerPreset {
  id: string;
  name: string;
  pomodoro: number; // in minutes
  shortBreak: number; // in minutes
  longBreak: number; // in minutes
  description: string;
  iconName: string;
}

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  userId?: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  labels: string[];
  colorTag: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
  dueDate?: string;
  notes?: string;
  subtasks: SubTask[];
  isRecurring?: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly';
  createdAt: string;
  updatedAt: string;
}

export interface HabitCheckIn {
  date: string; // YYYY-MM-DD
  completed: boolean;
}

export interface Habit {
  id: string;
  userId?: string;
  title: string;
  category: string;
  icon: string;
  color: string;
  frequency: 'daily' | 'weekly';
  targetDaysPerWeek?: number;
  history: Record<string, boolean>; // 'YYYY-MM-DD': true
  createdAt: string;
}

export interface NoteFolder {
  id: string;
  name: string;
  icon?: string;
}

export interface Note {
  id: string;
  userId?: string;
  title: string;
  content: string;
  folderId?: string;
  tags: string[];
  isPinned?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FocusSession {
  id: string;
  userId?: string;
  durationMinutes: number;
  mode: TimerMode;
  taskId?: string;
  taskTitle?: string;
  completedAt: string; // ISO string
  date: string; // YYYY-MM-DD
}

export interface StreakStats {
  dailyStreak: number;
  weeklyStreak: number;
  monthlyStreak: number;
  bestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  totalSessions: number;
  totalFocusMinutes: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requiredSessions: number;
  unlockedAt?: string;
}

export interface Goal {
  id: string;
  type: 'daily' | 'weekly' | 'monthly';
  targetMinutes: number;
  currentMinutes: number;
  completed: boolean;
}

export type SoundTrack = 'rain' | 'forest' | 'coffee' | 'whitenoise' | 'ocean' | 'lofi';

export interface SoundState {
  track: SoundTrack | null;
  isPlaying: boolean;
  volume: number;
  loop: boolean;
}

export type ThemePreset = 
  | 'midnight'
  | 'red'
  | 'orange'
  | 'green'
  | 'blue'
  | 'purple'
  | 'black'
  | 'ocean'
  | 'forest'
  | 'rosegold';

export interface ThemeConfig {
  preset: ThemePreset;
  accentColor: string;
  isDark: boolean;
}

export interface UserSettings {
  theme: ThemePreset;
  accentColor: string;
  isDark: boolean;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  soundVolume: number;
  animationsEnabled: boolean;
  language: string;
  timeFormat: '12h' | '24h';
  autoStartPomodoro: boolean;
  autoStartBreak: boolean;
  pomodoroMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  longBreakInterval: number;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  createdAt: string;
  bio?: string;
}

export interface Quote {
  id: string;
  quote: string;
  author: string;
  category: string;
}

export interface AICoachReport {
  productivityScore: number; // 0 - 100
  dailySummary: string;
  weeklyInsights: string[];
  bestStudyTime: string;
  breakRecommendation: string;
  taskPrioritization: string[];
  generatedAt: string;
}

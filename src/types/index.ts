export type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak' | 'custom';

export interface TimerPreset {
  id: string;
  name: string;
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
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
  subtasks: SubTask[];
  createdAt: string;
  updatedAt: string;
}

export interface ExamCountdown {
  id: string;
  title: string;
  subject: string;
  date: string; // YYYY-MM-DD
  targetPomodoros: number;
}

export interface Habit {
  id: string;
  title: string;
  category: string;
  icon: string;
  color: string;
  frequency: 'daily' | 'weekly';
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
  title: string;
  content: string;
  folderId?: string;
  tags: string[];
  isPinned?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  content: string;
  whatWentWell?: string;
  distractions?: string;
  tomorrowPlan?: string;
  mood: 'peaceful' | 'focused' | 'cozy' | 'inspired' | 'tired';
  createdAt: string;
  updatedAt: string;
}

export interface FocusSession {
  id: string;
  durationMinutes: number;
  mode: TimerMode;
  taskId?: string;
  taskTitle?: string;
  completedAt: string;
  date: string;
}

export interface StreakStats {
  dailyStreak: number;
  weeklyStreak: number;
  monthlyStreak: number;
  bestStreak: number;
  lastActiveDate: string;
  totalSessions: number;
  totalFocusMinutes: number;
  booksEarned: number;
  plantsEarned: number;
  decorUnlockedCount: number;
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

export interface SanctuaryDecor {
  id: string;
  title: string;
  category: 'book' | 'plant' | 'lamp' | 'cat' | 'mug' | 'theme';
  description: string;
  requiredSessions: number;
  unlockedAt?: string;
  icon: string;
}

export type SoundTrack = 'rain' | 'forest' | 'coffee' | 'whitenoise' | 'ocean' | 'lofi';

export type SoundChannelId = 
  | 'rain'
  | 'heavy_rain'
  | 'thunder'
  | 'fireplace'
  | 'forest'
  | 'ocean'
  | 'coffeeshop'
  | 'library'
  | 'wind'
  | 'crickets'
  | 'snow'
  | 'train'
  | 'whitenoise'
  | 'brownnoise'
  | 'pinknoise';

export interface SoundChannel {
  id: SoundChannelId;
  name: string;
  category: 'nature' | 'cozy' | 'urban' | 'noise';
  icon: string;
  volume: number;
  isMuted: boolean;
  isPlaying: boolean;
}

export interface SoundMixPreset {
  id: string;
  name: string;
  description: string;
  channels: Record<SoundChannelId, number>; // volume per channel
}

export interface StudyRoom {
  id: string;
  name: string;
  description: string;
  themePreset: ThemePreset;
  bgType: 'rain_window' | 'library' | 'cabin_fire' | 'japanese_garden' | 'coffee_desk' | 'train_window';
  lightingMode: 'morning' | 'afternoon' | 'golden_hour' | 'night' | 'fireplace';
  defaultRain: boolean;
  defaultSoundPreset: string;
  wallpaperUrl: string;
}

export type ThemePreset = 
  | 'dark-academia'
  | 'cozy-lofi'
  | 'forest'
  | 'tokyo'
  | 'minimalist'
  | 'coffee'
  | 'moonlight'
  | 'autumn';

export interface UserSettings {
  theme: ThemePreset;
  accentColor: string;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  soundVolume: number;
  animationsEnabled: boolean;
  timeFormat: '12h' | '24h';
  autoStartPomodoro: boolean;
  autoStartBreak: boolean;
  pomodoroMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  longBreakInterval: number;
  activeStudyRoomId: string;
  lightingMode: 'morning' | 'afternoon' | 'golden_hour' | 'night' | 'fireplace';
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  bio?: string;
  createdAt: string;
}

export interface Quote {
  id: string;
  quote: string;
  author: string;
  category: string;
}

export interface AICoachReport {
  productivityScore: number;
  dailySummary: string;
  weeklyInsights: string[];
  bestStudyTime: string;
  breakRecommendation: string;
  taskPrioritization: string[];
  generatedAt: string;
}

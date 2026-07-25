import { create } from 'zustand';
import { Task, TaskPriority, TaskStatus, SubTask } from '../types';
import { getStoredItem, setStoredItem, KEYS } from '../services/localStorageSync';

const DEFAULT_INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Design FocusFlow MacOS Dashboard UI',
    description: 'Implement dark glassmorphism layout, sidebar navigation, and custom color accents.',
    status: 'in_progress',
    priority: 'urgent',
    labels: ['Design', 'UI/UX', 'Frontend'],
    colorTag: '#8b5cf6',
    estimatedPomodoros: 4,
    completedPomodoros: 2,
    dueDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    subtasks: [
      { id: 'sub-1', title: 'Create layout grid & sidebar', completed: true },
      { id: 'sub-2', title: 'Build circular pomodoro progress ring', completed: true },
      { id: 'sub-3', title: 'Add dark blur theme styles', completed: false },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    title: 'Refactor State Management & Supabase Auth',
    description: 'Hook up Zustand stores with Supabase database and local storage fallback.',
    status: 'in_progress',
    priority: 'high',
    labels: ['Development', 'TypeScript', 'Backend'],
    colorTag: '#3b82f6',
    estimatedPomodoros: 3,
    completedPomodoros: 1,
    dueDate: new Date(Date.now() + 172800000).toISOString().slice(0, 10),
    subtasks: [
      { id: 'sub-4', title: 'Setup auth state handler', completed: true },
      { id: 'sub-5', title: 'Add offline local storage sync', completed: false },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    title: 'Read 20 pages of "Atomic Habits"',
    description: 'Focus on habit stacking and environment design principles.',
    status: 'todo',
    priority: 'medium',
    labels: ['Reading', 'Personal'],
    colorTag: '#10b981',
    estimatedPomodoros: 2,
    completedPomodoros: 0,
    dueDate: new Date().toISOString().slice(0, 10),
    subtasks: [
      { id: 'sub-6', title: 'Highlight key actionable insights', completed: false },
      { id: 'sub-7', title: 'Write quick summary note', completed: false },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-4',
    title: 'Morning 45-Min HIIT Workout',
    description: 'Cardio endurance and core strength session.',
    status: 'completed',
    priority: 'medium',
    labels: ['Workout', 'Health'],
    colorTag: '#f97316',
    estimatedPomodoros: 2,
    completedPomodoros: 2,
    dueDate: new Date().toISOString().slice(0, 10),
    subtasks: [
      { id: 'sub-8', title: 'Stretching and warm-up', completed: true },
      { id: 'sub-9', title: 'Cool down & hydration', completed: true },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const QUICK_TEMPLATES = [
  {
    name: 'Study Session',
    category: 'Study',
    priority: 'high' as TaskPriority,
    labels: ['Study', 'Education'],
    colorTag: '#8b5cf6',
    estimatedPomodoros: 4,
    description: 'Deep study sprint focusing on key course modules & notes.',
  },
  {
    name: 'Coding Sprint',
    category: 'Coding',
    priority: 'urgent' as TaskPriority,
    labels: ['Coding', 'Dev'],
    colorTag: '#3b82f6',
    estimatedPomodoros: 3,
    description: 'Feature implementation or bug fixing sprint.',
  },
  {
    name: 'Book Reading',
    category: 'Reading',
    priority: 'low' as TaskPriority,
    labels: ['Reading', 'Self-Improvement'],
    colorTag: '#10b981',
    estimatedPomodoros: 2,
    description: 'Focused chapter reading session with active note-taking.',
  },
  {
    name: 'Physical Workout',
    category: 'Workout',
    priority: 'medium' as TaskPriority,
    labels: ['Fitness', 'Health'],
    colorTag: '#f97316',
    estimatedPomodoros: 2,
    description: 'Gym, running, or home workout routine.',
  },
  {
    name: 'Project Assignment',
    category: 'Assignments',
    priority: 'high' as TaskPriority,
    labels: ['Assignment', 'School/Work'],
    colorTag: '#ec4899',
    estimatedPomodoros: 5,
    description: 'Comprehensive assignment drafting and final review.',
  },
  {
    name: 'Team Meeting Prep',
    category: 'Meetings',
    priority: 'medium' as TaskPriority,
    labels: ['Meeting', 'Sync'],
    colorTag: '#06b6d4',
    estimatedPomodoros: 1,
    description: 'Outline agenda, key takeaways, and action items for meeting.',
  },
];

interface TaskState {
  tasks: Task[];
  searchQuery: string;
  selectedTag: string | null;
  selectedPriority: TaskPriority | null;
  sortBy: 'date' | 'priority' | 'title';

  // Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, status: TaskStatus) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addSubtask: (taskId: string, title: string) => void;
  incrementTaskPomodoro: (id: string) => void;
  addQuickTemplateTask: (templateIndex: number) => void;
  
  setSearchQuery: (query: string) => void;
  setSelectedTag: (tag: string | null) => void;
  setSelectedPriority: (priority: TaskPriority | null) => void;
  setSortBy: (sort: 'date' | 'priority' | 'title') => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: getStoredItem<Task[]>(KEYS.TASKS, DEFAULT_INITIAL_TASKS),
  searchQuery: '',
  selectedTag: null,
  selectedPriority: null,
  sortBy: 'date',

  addTask: (taskData) => {
    const newTask: Task = {
      ...taskData,
      id: 'task_' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newTask, ...get().tasks];
    set({ tasks: updated });
    setStoredItem(KEYS.TASKS, updated);
  },

  updateTask: (id, updates) => {
    const updated = get().tasks.map((t) =>
      t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
    );
    set({ tasks: updated });
    setStoredItem(KEYS.TASKS, updated);
  },

  deleteTask: (id) => {
    const updated = get().tasks.filter((t) => t.id !== id);
    set({ tasks: updated });
    setStoredItem(KEYS.TASKS, updated);
  },

  moveTask: (id, status) => {
    const updated = get().tasks.map((t) =>
      t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t
    );
    set({ tasks: updated });
    setStoredItem(KEYS.TASKS, updated);
  },

  toggleSubtask: (taskId, subtaskId) => {
    const updated = get().tasks.map((t) => {
      if (t.id === taskId) {
        const subs = t.subtasks.map((s) => (s.id === subtaskId ? { ...s, completed: !s.completed } : s));
        return { ...t, subtasks: subs, updatedAt: new Date().toISOString() };
      }
      return t;
    });
    set({ tasks: updated });
    setStoredItem(KEYS.TASKS, updated);
  },

  addSubtask: (taskId, title) => {
    const updated = get().tasks.map((t) => {
      if (t.id === taskId) {
        const newSub: SubTask = { id: 'sub_' + Date.now(), title, completed: false };
        return { ...t, subtasks: [...t.subtasks, newSub], updatedAt: new Date().toISOString() };
      }
      return t;
    });
    set({ tasks: updated });
    setStoredItem(KEYS.TASKS, updated);
  },

  incrementTaskPomodoro: (id) => {
    const updated = get().tasks.map((t) => {
      if (t.id === id) {
        return { ...t, completedPomodoros: t.completedPomodoros + 1, updatedAt: new Date().toISOString() };
      }
      return t;
    });
    set({ tasks: updated });
    setStoredItem(KEYS.TASKS, updated);
  },

  addQuickTemplateTask: (index) => {
    const t = QUICK_TEMPLATES[index];
    if (!t) return;
    get().addTask({
      title: `${t.name} - ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      description: t.description,
      status: 'todo',
      priority: t.priority,
      labels: t.labels,
      colorTag: t.colorTag,
      estimatedPomodoros: t.estimatedPomodoros,
      completedPomodoros: 0,
      subtasks: [
        { id: 'sub_1', title: 'Prepare focus environment & materials', completed: false },
        { id: 'sub_2', title: 'Complete main focus objectives', completed: false },
      ],
      dueDate: new Date().toISOString().slice(0, 10),
    });
  },

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedTag: (selectedTag) => set({ selectedTag }),
  setSelectedPriority: (selectedPriority) => set({ selectedPriority }),
  setSortBy: (sortBy) => set({ sortBy }),
}));

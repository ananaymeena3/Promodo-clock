import { create } from 'zustand';
import { Note, NoteFolder } from '../types';
import { getStoredItem, setStoredItem, KEYS } from '../services/localStorageSync';

const DEFAULT_FOLDERS: NoteFolder[] = [
  { id: 'f_work', name: 'Work & Projects', icon: 'Briefcase' },
  { id: 'f_personal', name: 'Personal Growth', icon: 'User' },
  { id: 'f_ideas', name: 'Brainstorm & Ideas', icon: 'Lightbulb' },
];

const DEFAULT_NOTES: Note[] = [
  {
    id: 'n1',
    title: '🚀 Focus Flow Product Blueprint',
    content: `# Focus Flow Architecture\n\n- **Core Stack**: React 18 + Vite + Tailwind + Framer Motion\n- **Design System**: MacOS + Notion + Arc Glassmorphism\n- **Features**:\n  1. Pomodoro Engine with presets & notification sound synthesizers\n  2. Drag & drop Kanban board with subtasks\n  3. AI Productivity Coach & Deep Work metrics\n  4. Multi-track ambient sound generator`,
    folderId: 'f_work',
    tags: ['Architecture', 'React', 'Design'],
    isPinned: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'n2',
    title: '🧠 Deep Work & Peak State Rules',
    content: `## Principles for Flow State\n\n1. **Zero Context Switching**: Block notification distractions.\n2. **Timeboxing**: Use 50min focus sessions.\n3. **Active Recovery**: 10min breaks away from screens.\n4. **Hydration & Ambient Audio**: Use LoFi or Rain tracks.`,
    folderId: 'f_personal',
    tags: ['Productivity', 'Mindset'],
    isPinned: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

interface NoteState {
  notes: Note[];
  folders: NoteFolder[];
  activeNoteId: string | null;
  selectedFolderId: string | null;
  searchQuery: string;

  // Actions
  setActiveNoteId: (id: string | null) => void;
  setSelectedFolderId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  
  createNote: (folderId?: string) => string;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  createFolder: (name: string, icon?: string) => void;
  deleteFolder: (id: string) => void;
  togglePinNote: (id: string) => void;
}

export const useNoteStore = create<NoteState>((set, get) => ({
  notes: getStoredItem<Note[]>(KEYS.NOTES, DEFAULT_NOTES),
  folders: DEFAULT_FOLDERS,
  activeNoteId: DEFAULT_NOTES[0]?.id || null,
  selectedFolderId: null,
  searchQuery: '',

  setActiveNoteId: (activeNoteId) => set({ activeNoteId }),
  setSelectedFolderId: (selectedFolderId) => set({ selectedFolderId }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  createNote: (folderId) => {
    const id = 'note_' + Date.now();
    const newNote: Note = {
      id,
      title: 'Untitled Note',
      content: '',
      folderId: folderId || get().selectedFolderId || undefined,
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newNote, ...get().notes];
    set({ notes: updated, activeNoteId: id });
    setStoredItem(KEYS.NOTES, updated);
    return id;
  },

  updateNote: (id, updates) => {
    const updated = get().notes.map((n) =>
      n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
    );
    set({ notes: updated });
    setStoredItem(KEYS.NOTES, updated);
  },

  deleteNote: (id) => {
    const updated = get().notes.filter((n) => n.id !== id);
    const active = get().activeNoteId === id ? (updated[0]?.id || null) : get().activeNoteId;
    set({ notes: updated, activeNoteId: active });
    setStoredItem(KEYS.NOTES, updated);
  },

  createFolder: (name, icon) => {
    const newFolder: NoteFolder = {
      id: 'f_' + Date.now(),
      name,
      icon: icon || 'Folder',
    };
    set((state) => ({ folders: [...state.folders, newFolder] }));
  },

  deleteFolder: (id) => {
    set((state) => ({
      folders: state.folders.filter((f) => f.id !== id),
      selectedFolderId: state.selectedFolderId === id ? null : state.selectedFolderId,
    }));
  },

  togglePinNote: (id) => {
    const updated = get().notes.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n));
    set({ notes: updated });
    setStoredItem(KEYS.NOTES, updated);
  },
}));

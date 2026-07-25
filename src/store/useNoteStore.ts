import { create } from 'zustand';
import { Note, NoteFolder } from '../types';
import { getStoredItem, setStoredItem, KEYS } from '../services/localStorageSync';

const DEFAULT_FOLDERS: NoteFolder[] = [
  { id: 'f_work', name: 'Work & Projects', icon: 'Briefcase' },
  { id: 'f_personal', name: 'Personal Growth', icon: 'User' },
  { id: 'f_ideas', name: 'Brainstorm & Ideas', icon: 'Lightbulb' },
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
  notes: getStoredItem<Note[]>(KEYS.NOTES, []),
  folders: DEFAULT_FOLDERS,
  activeNoteId: null,
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

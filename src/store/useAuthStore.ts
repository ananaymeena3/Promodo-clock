import { create } from 'zustand';
import { UserProfile } from '../types';
import { getStoredItem, setStoredItem, KEYS } from '../services/localStorageSync';

/**
 * useAuthStore — no authentication required.
 * Users get a local guest profile that persists to localStorage.
 * Supabase is used only for storage/DB, not auth.
 */
interface AuthState {
  user: UserProfile;
  isAuthenticated: true;
  isLoading: false;
  authError: null;
  isSupabaseConnected: boolean;
  updateProfile: (data: Partial<UserProfile>) => void;
  /** Kept for compatibility — no-op since auth is removed */
  initializeAuth: () => void;
  logout: () => void;
}

const getOrCreateGuestProfile = (): UserProfile => {
  const stored = getStoredItem<UserProfile | null>(KEYS.PROFILE, null);
  if (stored) return stored;
  const guest: UserProfile = {
    id: 'guest_' + Math.random().toString(36).slice(2, 10),
    email: '',
    fullName: 'Guest User',
    createdAt: new Date().toISOString(),
  };
  setStoredItem(KEYS.PROFILE, guest);
  return guest;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: getOrCreateGuestProfile(),
  isAuthenticated: true,
  isLoading: false,
  authError: null,
  isSupabaseConnected: Boolean(
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_ANON_KEY &&
    import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder-project.supabase.co'
  ),

  initializeAuth: () => {
    // No-op: auth is removed. Supabase is used only for storage.
  },

  updateProfile: (data: Partial<UserProfile>) => {
    const updated = { ...get().user, ...data };
    set({ user: updated });
    setStoredItem(KEYS.PROFILE, updated);
  },

  logout: () => {
    // No-op: no auth to log out from.
  },
}));

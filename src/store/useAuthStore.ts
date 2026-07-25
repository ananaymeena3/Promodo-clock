import { create } from 'zustand';
import { UserProfile } from '../types';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { getStoredItem, setStoredItem, KEYS } from '../services/localStorageSync';
import toast from 'react-hot-toast';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  isSupabaseConnected: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (fullName: string, email: string, password?: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: getStoredItem<UserProfile | null>(KEYS.PROFILE, null),
  isAuthenticated: Boolean(getStoredItem<UserProfile | null>(KEYS.PROFILE, null)),
  isLoading: false,
  authError: null,
  isSupabaseConnected: isSupabaseConfigured(),

  initializeAuth: async () => {
    const configured = isSupabaseConfigured();
    set({ isSupabaseConnected: configured });

    if (!configured) {
      const stored = getStoredItem<UserProfile | null>(KEYS.PROFILE, null);
      set({ user: stored, isAuthenticated: Boolean(stored) });
      return;
    }

    try {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        const u = data.session.user;
        const profile: UserProfile = {
          id: u.id,
          email: u.email || '',
          fullName: u.user_metadata?.full_name || u.email?.split('@')[0] || 'User',
          avatarUrl: u.user_metadata?.avatar_url,
          createdAt: u.created_at,
        };
        set({ user: profile, isAuthenticated: true });
        setStoredItem(KEYS.PROFILE, profile);
      } else {
        set({ user: null, isAuthenticated: false });
        setStoredItem(KEYS.PROFILE, null);
      }

      // Listen for auth state changes
      supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
          const u = session.user;
          const profile: UserProfile = {
            id: u.id,
            email: u.email || '',
            fullName: u.user_metadata?.full_name || u.email?.split('@')[0] || 'User',
            avatarUrl: u.user_metadata?.avatar_url,
            createdAt: u.created_at,
          };
          set({ user: profile, isAuthenticated: true });
          setStoredItem(KEYS.PROFILE, profile);
        } else if (event === 'SIGNED_OUT') {
          set({ user: null, isAuthenticated: false });
          setStoredItem(KEYS.PROFILE, null);
        }
      });
    } catch (e) {
      console.warn('Supabase auth init error:', e);
    }
  },

  login: async (email: string, password?: string) => {
    set({ isLoading: true, authError: null });
    if (isSupabaseConfigured() && password) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.user) {
          const profile: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            fullName: data.user.user_metadata?.full_name || email.split('@')[0],
            avatarUrl: data.user.user_metadata?.avatar_url,
            createdAt: data.user.created_at,
          };
          set({ user: profile, isAuthenticated: true, isLoading: false });
          setStoredItem(KEYS.PROFILE, profile);
          return true;
        }
      } catch (err: any) {
        set({ authError: err.message || 'Failed to sign in via Supabase', isLoading: false });
        return false;
      }
    }

    // Fallback login
    const profile: UserProfile = {
      id: 'usr_' + Date.now(),
      email,
      fullName: email.split('@')[0] || 'User',
      createdAt: new Date().toISOString(),
    };
    set({ user: profile, isAuthenticated: true, isLoading: false });
    setStoredItem(KEYS.PROFILE, profile);
    return true;
  },

  register: async (fullName: string, email: string, password?: string) => {
    set({ isLoading: true, authError: null });
    if (isSupabaseConfigured() && password) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) throw error;
        if (data.user) {
          const profile: UserProfile = {
            id: data.user.id,
            email,
            fullName,
            createdAt: new Date().toISOString(),
          };
          set({ user: profile, isAuthenticated: true, isLoading: false });
          setStoredItem(KEYS.PROFILE, profile);
          return true;
        }
      } catch (err: any) {
        set({ authError: err.message || 'Registration failed', isLoading: false });
        return false;
      }
    }

    const profile: UserProfile = {
      id: 'usr_' + Date.now(),
      email,
      fullName,
      createdAt: new Date().toISOString(),
    };
    set({ user: profile, isAuthenticated: true, isLoading: false });
    setStoredItem(KEYS.PROFILE, profile);
    return true;
  },

  loginWithGoogle: async () => {
    set({ isLoading: true, authError: null });
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: window.location.origin },
        });
        if (error) throw error;
      } catch (err: any) {
        const msg = err.message?.includes('validation_failed') || err.message?.includes('provider')
          ? 'Google Sign-In is not enabled in your Supabase project. Enable it under Supabase Dashboard -> Authentication -> Providers -> Google.'
          : err.message || 'Google Sign In failed';
        
        set({ authError: msg, isLoading: false });
        toast.error(msg);
      }
    } else {
      const profile: UserProfile = {
        id: 'google_user_' + Date.now(),
        email: 'user@focusflow.app',
        fullName: 'Google User',
        createdAt: new Date().toISOString(),
      };
      set({ user: profile, isAuthenticated: true, isLoading: false });
      setStoredItem(KEYS.PROFILE, profile);
    }
  },

  logout: async () => {
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch (e) {}
    }
    set({ user: null, isAuthenticated: false });
    setStoredItem(KEYS.PROFILE, null);
  },

  updateProfile: (data: Partial<UserProfile>) => {
    const current = get().user;
    if (!current) return;
    const updated = { ...current, ...data };
    set({ user: updated });
    setStoredItem(KEYS.PROFILE, updated);
  },
}));

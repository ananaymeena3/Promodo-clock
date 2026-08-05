import { create } from 'zustand';

export interface SpotifyPlaylistPreset {
  id: string;
  title: string;
  category: string;
  spotifyId: string;
  type: 'playlist' | 'album' | 'track';
}

const LOCAL_STORAGE_KEY = 'haven_spotify_playlists';
const ACTIVE_ID_KEY = 'haven_spotify_active_id';

export const parseSpotifyUrl = (urlStr: string): { spotifyId: string; type: 'playlist' | 'album' | 'track' } => {
  const cleanStr = urlStr.trim();
  const match = cleanStr.match(/(playlist|album|track)[\/:]([a-zA-Z0-9]+)/);
  if (match && match[1] && match[2]) {
    return {
      type: match[1] as 'playlist' | 'album' | 'track',
      spotifyId: match[2],
    };
  }
  return {
    type: 'playlist',
    spotifyId: cleanStr,
  };
};

interface SpotifyState {
  playlists: SpotifyPlaylistPreset[];
  activePlaylistId: string;
  isMinimized: boolean;
  isPlaying: boolean;
  
  // Actions
  setActivePlaylistId: (id: string) => void;
  addPlaylist: (title: string, inputUrl: string, category?: string) => SpotifyPlaylistPreset | null;
  deletePlaylist: (id: string) => void;
  toggleMinimized: () => void;
  setIsMinimized: (minimized: boolean) => void;
  setIsPlaying: (playing: boolean) => void;
  getActivePlaylist: () => SpotifyPlaylistPreset | null;
}

const loadInitialPlaylists = (): SpotifyPlaylistPreset[] => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed: SpotifyPlaylistPreset[] = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        // Filter out old preloaded default playlists (sp_1, sp_2, etc.)
        const userPlaylists = parsed.filter((p) => !p.id.startsWith('sp_') || p.id.startsWith('sp_custom_'));
        return userPlaylists;
      }
    }
  } catch (e) {
    console.error('Failed to load saved playlists:', e);
  }
  return [];
};

const loadInitialActiveId = (playlists: SpotifyPlaylistPreset[]): string => {
  try {
    const saved = localStorage.getItem(ACTIVE_ID_KEY);
    if (saved && playlists.some((p) => p.id === saved)) {
      return saved;
    }
  } catch (e) {
    console.error('Failed to load active playlist id:', e);
  }
  return playlists[0]?.id || '';
};

export const useSpotifyStore = create<SpotifyState>((set, get) => {
  const initialPlaylists = loadInitialPlaylists();
  const initialActiveId = loadInitialActiveId(initialPlaylists);

  return {
    playlists: initialPlaylists,
    activePlaylistId: initialActiveId,
    isMinimized: false,
    isPlaying: false,

    setActivePlaylistId: (id: string) => {
      set({ activePlaylistId: id, isPlaying: true });
      try {
        localStorage.setItem(ACTIVE_ID_KEY, id);
      } catch (e) {
        console.error('Failed to save active playlist id:', e);
      }
    },

    addPlaylist: (title: string, inputUrl: string, category = 'Custom') => {
      if (!inputUrl.trim()) return null;
      const { spotifyId, type } = parseSpotifyUrl(inputUrl);
      if (!spotifyId) return null;

      const newPreset: SpotifyPlaylistPreset = {
        id: `sp_custom_${Date.now()}`,
        title: title.trim() || 'My Spotify Playlist',
        category,
        spotifyId,
        type,
      };

      const updated = [newPreset, ...get().playlists];
      set({ playlists: updated, activePlaylistId: newPreset.id, isPlaying: true });

      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        localStorage.setItem(ACTIVE_ID_KEY, newPreset.id);
      } catch (e) {
        console.error('Failed to save playlists to localStorage:', e);
      }

      return newPreset;
    },

    deletePlaylist: (id: string) => {
      const state = get();
      const updated = state.playlists.filter((p) => p.id !== id);
      const nextActiveId =
        state.activePlaylistId === id
          ? updated[0]?.id || ''
          : state.activePlaylistId;

      set({
        playlists: updated,
        activePlaylistId: nextActiveId,
      });

      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        localStorage.setItem(ACTIVE_ID_KEY, nextActiveId);
      } catch (e) {
        console.error('Failed to save playlists after delete:', e);
      }
    },

    toggleMinimized: () => set((state) => ({ isMinimized: !state.isMinimized })),
    setIsMinimized: (minimized: boolean) => set({ isMinimized: minimized }),
    setIsPlaying: (playing: boolean) => set({ isPlaying: playing }),

    getActivePlaylist: () => {
      const state = get();
      return state.playlists.find((p) => p.id === state.activePlaylistId) || state.playlists[0] || null;
    },
  };
});

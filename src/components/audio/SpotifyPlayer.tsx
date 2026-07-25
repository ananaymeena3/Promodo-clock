import React, { useState } from 'react';
import { Music, Play, Plus, Trash2, ExternalLink, Sparkles } from 'lucide-react';
import { soundEngine } from '../../services/soundGenerator';
import toast from 'react-hot-toast';

export interface SpotifyPlaylistPreset {
  id: string;
  title: string;
  category: string;
  spotifyId: string; // Spotify Playlist ID
  type: 'playlist' | 'album' | 'track';
}

const DEFAULT_PLAYLISTS: SpotifyPlaylistPreset[] = [
  { id: 'sp_1', title: 'Lofi Beats for Studying', category: 'Lo-Fi', spotifyId: '37i9dQZF1DX8Ueb1gK3vSV', type: 'playlist' },
  { id: 'sp_2', title: 'Deep Focus instrumental', category: 'Focus', spotifyId: '37i9dQZF1DWZeKCadgRdKQ', type: 'playlist' },
  { id: 'sp_3', title: 'Dark Academia Classical', category: 'Academia', spotifyId: '37i9dQZF1DX2GGy0t904tK', type: 'playlist' },
  { id: 'sp_4', title: 'Cozy Rain & Jazz Cafe', category: 'Jazz', spotifyId: '37i9dQZF1DX4wta2J1212q', type: 'playlist' },
  { id: 'sp_5', title: 'Peaceful Reading Piano', category: 'Piano', spotifyId: '37i9dQZF1DX4sWSpwq3LiO', type: 'playlist' },
];

export const SpotifyPlayer: React.FC = () => {
  const [playlists, setPlaylists] = useState<SpotifyPlaylistPreset[]>(() => {
    const saved = localStorage.getItem('haven_spotify_playlists');
    return saved ? JSON.parse(saved) : DEFAULT_PLAYLISTS;
  });

  const [activePlaylist, setActivePlaylist] = useState<SpotifyPlaylistPreset>(playlists[0]);
  const [customInput, setCustomInput] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Extract Spotify ID from URL or URI
  const parseSpotifyUrl = (urlStr: string) => {
    // Examples:
    // https://open.spotify.com/playlist/37i9dQZF1DX8Ueb1gK3vSV?si=...
    // spotify:playlist:37i9dQZF1DX8Ueb1gK3vSV
    const match = urlStr.match(/(?:playlist|album|track)[\/:]([a-zA-Z0-9]+)/);
    if (match && match[1]) {
      return match[1];
    }
    return urlStr.trim();
  };

  const handleAddCustomPlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    soundEngine.playClickSound();

    const spotifyId = parseSpotifyUrl(customInput);
    const newPreset: SpotifyPlaylistPreset = {
      id: 'sp_custom_' + Date.now(),
      title: 'Custom Sanctuary Playlist',
      category: 'Custom',
      spotifyId,
      type: 'playlist',
    };

    const updated = [newPreset, ...playlists];
    setPlaylists(updated);
    localStorage.setItem('haven_spotify_playlists', JSON.stringify(updated));
    setActivePlaylist(newPreset);
    setCustomInput('');
    setIsAddModalOpen(false);
    toast.success('Custom Spotify Playlist Loaded!');
  };

  const handleDeleteCustom = (id: string) => {
    soundEngine.playClickSound();
    const updated = playlists.filter((p) => p.id !== id);
    setPlaylists(updated);
    localStorage.setItem('haven_spotify_playlists', JSON.stringify(updated));
    if (activePlaylist.id === id && updated.length > 0) {
      setActivePlaylist(updated[0]);
    }
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#CDAA7D]/30 space-y-6 bg-gradient-to-b from-[#211C18]/90 via-[#181613] to-[#0F0E0C]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Music className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif-heading text-xl font-bold text-[#F4EFE9] flex items-center gap-2">
              <span>Spotify Sanctuary Player</span>
              <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                SPOTIFY WEB EMBED
              </span>
            </h3>
            <p className="text-xs text-[#A99F96]">Stream curated lo-fi study playlists or load your personal Spotify music.</p>
          </div>
        </div>

        <button
          onClick={() => {
            soundEngine.playClickSound();
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#6D4C41] hover:bg-[#4E342E] text-[#F5EBDD] text-xs font-bold shadow-lg border border-[#CDAA7D]/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Spotify URL</span>
        </button>
      </div>

      {/* Playlist Preset Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {playlists.map((pl) => {
          const isSel = activePlaylist.id === pl.id;
          return (
            <button
              key={pl.id}
              onClick={() => {
                soundEngine.playClickSound();
                setActivePlaylist(pl);
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 border ${
                isSel
                  ? 'bg-gradient-to-r from-[#6D4C41] to-[#CDAA7D] text-[#F5EBDD] border-[#CDAA7D]/50 shadow-lg shadow-[#CDAA7D]/20'
                  : 'bg-white/5 border-white/5 text-[#A99F96] hover:text-[#F4EFE9] hover:bg-white/10'
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>{pl.title}</span>
              {pl.id.startsWith('sp_custom_') && (
                <Trash2
                  className="w-3 h-3 text-red-400 hover:text-red-300 ml-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCustom(pl.id);
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Spotify iFrame Web Player */}
      <div className="relative rounded-2xl overflow-hidden border border-[#CDAA7D]/20 shadow-2xl bg-[#121212]">
        <iframe
          title="Spotify Sanctuary Embed"
          src={`https://open.spotify.com/embed/playlist/${activePlaylist.spotifyId}?utm_source=generator&theme=0`}
          width="100%"
          height="352"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="w-full rounded-2xl shadow-2xl"
        />
      </div>

      {/* Add Custom Spotify Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md p-6 rounded-3xl border border-[#CDAA7D]/30 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#CDAA7D]" />
              <h3 className="font-serif-heading text-lg font-bold text-[#F4EFE9]">Load Spotify Playlist</h3>
            </div>
            <p className="text-xs text-[#A99F96]">
              Paste any Spotify Playlist link (e.g., https://open.spotify.com/playlist/...) to stream it inside Haven.
            </p>

            <form onSubmit={handleAddCustomPlaylist} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[#A99F96] mb-1">Spotify Playlist URL / URI</label>
                <input
                  type="text"
                  required
                  placeholder="https://open.spotify.com/playlist/37i9dQZF1DX8Ueb1gK3vSV"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  className="w-full glass-input px-4 py-3 rounded-2xl text-xs font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs text-[#A99F96] bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-[#181613] bg-[#CDAA7D] hover:bg-[#b59266]"
                >
                  Load Playlist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

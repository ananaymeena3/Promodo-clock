import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Music,
  Plus,
  Trash2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Maximize2,
  X,
  Volume2,
  Radio,
  Music2,
} from 'lucide-react';
import { soundEngine } from '../../services/soundGenerator';
import { useSpotifyStore } from '../../store/useSpotifyStore';
import toast from 'react-hot-toast';

export const GlobalSpotifyPlayer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    playlists,
    isMinimized,
    setActivePlaylistId,
    addPlaylist,
    deletePlaylist,
    toggleMinimized,
    getActivePlaylist,
  } = useSpotifyStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customInput, setCustomInput] = useState('');

  const isSoundsPage = location.pathname === '/sounds';
  const activePlaylist = getActivePlaylist();

  const handleAddCustomPlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    soundEngine.playClickSound();

    const title = customTitle.trim() || 'My Spotify Playlist';
    const newPreset = addPlaylist(title, customInput);

    if (newPreset) {
      setCustomInput('');
      setCustomTitle('');
      setIsAddModalOpen(false);
      toast.success(`Loaded "${newPreset.title}"!`);
    } else {
      toast.error('Invalid Spotify URL or URI');
    }
  };

  const handleDeleteCustom = (e: React.MouseEvent, id: string, title: string) => {
    e.stopPropagation();
    soundEngine.playClickSound();
    deletePlaylist(id);
    toast.success(`Removed "${title}"`);
  };

  // If no playlists exist, don't render floating widget when off /sounds
  if (!isSoundsPage && playlists.length === 0) {
    return null;
  }

  // Embed iframe src URL construction
  const embedSrc = activePlaylist
    ? `https://open.spotify.com/embed/${activePlaylist.type || 'playlist'}/${activePlaylist.spotifyId}?utm_source=generator&theme=0`
    : '';

  return (
    <>
      <div
        className={
          isSoundsPage
            ? 'w-full max-w-6xl mx-auto mt-6 space-y-6'
            : 'fixed bottom-5 right-6 z-40 select-none flex flex-col items-end gap-2 transition-all duration-300'
        }
      >
        {/* Floating Minimized Pill Trigger (Off /sounds & minimized) */}
        {!isSoundsPage && isMinimized && activePlaylist && (
          <button
            onClick={() => {
              soundEngine.playClickSound();
              toggleMinimized();
            }}
            className="glass-panel px-4 py-3 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center gap-3 bg-[#181613]/95 hover:bg-emerald-950/40 text-[#F4EFE9] transition-all group hover:border-emerald-400/60"
          >
            <div className="relative p-2 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:scale-105 transition-transform flex items-center justify-center">
              <Music className="w-4 h-4 animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <div className="text-left">
              <p className="text-xs font-bold font-serif-heading text-[#F4EFE9] line-clamp-1 max-w-[160px]">
                {activePlaylist.title}
              </p>
              <p className="text-[10px] text-emerald-300 font-mono flex items-center gap-1">
                <Volume2 className="w-3 h-3 text-emerald-400" />
                <span>Playing in Background</span>
              </p>
            </div>
            <ChevronUp className="w-4 h-4 text-[#A99F96] group-hover:text-white transition-colors ml-1" />
          </button>
        )}

        {/* Main Panel Box (shown when on /sounds OR when off /sounds & expanded) */}
        <div
          className={
            isSoundsPage
              ? 'glass-panel p-6 sm:p-8 rounded-3xl border border-[#CDAA7D]/30 space-y-6 bg-gradient-to-b from-[#211C18]/90 via-[#181613] to-[#0F0E0C]'
              : !isMinimized && activePlaylist
              ? 'glass-panel w-80 sm:w-96 rounded-3xl p-4 shadow-2xl border border-[#CDAA7D]/30 bg-[#181613]/95 backdrop-blur-xl space-y-3 transition-all'
              : 'hidden'
          }
        >
          {/* Header Bar */}
          {isSoundsPage ? (
            /* Full View Header on /sounds Page */
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Music className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif-heading text-xl font-bold text-[#F4EFE9] flex items-center gap-2">
                    <span>Spotify Sanctuary Player</span>
                    <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      PERSISTENT AUDIO
                    </span>
                  </h3>
                  <p className="text-xs text-[#A99F96]">
                    Stream your personal Spotify playlists, albums, or tracks directly inside Haven.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  soundEngine.playClickSound();
                  setIsAddModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#6D4C41] hover:bg-[#4E342E] text-[#F5EBDD] text-xs font-bold shadow-lg border border-[#CDAA7D]/30 transition-all shrink-0"
              >
                <Plus className="w-4 h-4 text-[#CDAA7D]" />
                <span>Add Spotify Playlist</span>
              </button>
            </div>
          ) : activePlaylist ? (
            /* Compact Header on Floating Widget */
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                  <Radio className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold font-serif-heading text-[#F4EFE9] truncate">
                    {activePlaylist.title}
                  </p>
                  <p className="text-[10px] text-emerald-300 font-mono">Spotify Persistent Player</p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => {
                    soundEngine.playClickSound();
                    navigate('/sounds');
                  }}
                  title="Open Spotify Sanctuary Page"
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#CDAA7D] transition-colors"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    soundEngine.playClickSound();
                    toggleMinimized();
                  }}
                  title="Minimize Player"
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#A99F96] hover:text-white transition-colors"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : null}

          {/* User Playlist Selector Pills */}
          {playlists.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {playlists.map((pl) => {
                const isSel = activePlaylist?.id === pl.id;
                return (
                  <button
                    key={pl.id}
                    onClick={() => {
                      soundEngine.playClickSound();
                      setActivePlaylistId(pl.id);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                      isSel
                        ? 'bg-gradient-to-r from-[#6D4C41] to-[#CDAA7D] text-[#F5EBDD] border-[#CDAA7D]/50 shadow-md'
                        : 'bg-white/5 border-white/5 text-[#A99F96] hover:text-[#F4EFE9] hover:bg-white/10'
                    }`}
                  >
                    <Music className="w-3 h-3" />
                    <span>{pl.title}</span>
                    <Trash2
                      className="w-3 h-3 text-red-400 hover:text-red-300 ml-1 transition-colors p-0.5 rounded hover:bg-red-500/20"
                      onClick={(e) => handleDeleteCustom(e, pl.id, pl.title)}
                    />
                  </button>
                );
              })}
            </div>
          )}

          {/* Empty State on /sounds Page if no playlists exist */}
          {isSoundsPage && playlists.length === 0 && (
            <div className="py-12 px-4 flex flex-col items-center justify-center text-center space-y-4 rounded-2xl border border-dashed border-[#CDAA7D]/20 bg-white/[0.01]">
              <div className="p-4 rounded-3xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Music2 className="w-8 h-8" />
              </div>
              <div className="max-w-md space-y-1">
                <h4 className="text-base font-bold text-[#F4EFE9] font-serif-heading">No Playlists Added Yet</h4>
                <p className="text-xs text-[#A99F96]">
                  Add your Spotify playlist, album, or track URL to stream music directly inside Haven.
                </p>
              </div>
              <button
                onClick={() => {
                  soundEngine.playClickSound();
                  setIsAddModalOpen(true);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#CDAA7D] hover:bg-[#b59266] text-[#181613] text-xs font-bold shadow-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Your First Spotify Playlist</span>
              </button>
            </div>
          )}

          {/* 
            SINGLE PERSISTENT IFRAME WRAPPER
            Rendered whenever activePlaylist exists!
          */}
          {activePlaylist && (
            <div
              className={
                !isSoundsPage && isMinimized
                  ? 'w-0 h-0 opacity-0 absolute overflow-hidden pointer-events-none'
                  : 'relative rounded-2xl overflow-hidden border border-[#CDAA7D]/20 shadow-2xl bg-[#121212] w-full'
              }
            >
              <iframe
                title="Spotify Sanctuary Persistent Embed"
                src={embedSrc}
                width="100%"
                height={isSoundsPage ? '352' : '152'}
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="w-full rounded-2xl shadow-2xl"
              />
            </div>
          )}
        </div>
      </div>

      {/* Add Custom Spotify Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md p-6 rounded-3xl border border-[#CDAA7D]/30 space-y-4 bg-[#181613] text-[#F4EFE9] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#CDAA7D]" />
                <h3 className="font-serif-heading text-lg font-bold">Add Spotify Playlist / Album / Track</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-xl hover:bg-white/10 text-[#A99F96] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#A99F96]">
              Paste any Spotify link or URI (playlists, albums, or tracks). Custom playlists are permanently saved to your account.
            </p>

            <form onSubmit={handleAddCustomPlaylist} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[#A99F96] mb-1">Playlist Name / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. My Chill Lofi Beats"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full glass-input px-4 py-3 rounded-2xl text-xs font-sans text-white placeholder-[#A99F96]/50 bg-white/5 border border-white/10 focus:border-[#CDAA7D] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#A99F96] mb-1">Spotify URL or URI</label>
                <input
                  type="text"
                  required
                  placeholder="https://open.spotify.com/playlist/37i9dQZF1DX8Ueb1gK3vSV"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  className="w-full glass-input px-4 py-3 rounded-2xl text-xs font-mono text-white placeholder-[#A99F96]/50 bg-white/5 border border-white/10 focus:border-[#CDAA7D] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs text-[#A99F96] bg-white/5 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-[#181613] bg-[#CDAA7D] hover:bg-[#b59266] transition-colors"
                >
                  Save Playlist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

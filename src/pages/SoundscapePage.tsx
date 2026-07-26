import React from 'react';
import { Music, Sparkles, Headphones, ShieldCheck, Heart } from 'lucide-react';

export const SoundscapePage: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 py-2">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono mb-2 border border-emerald-500/20">
          <Music className="w-3.5 h-3.5" />
          <span>Spotify Music Sanctuary</span>
        </div>
        <h2 className="font-serif-heading text-3xl sm:text-4xl font-extrabold text-[#F4EFE9]">
          Spotify Music & Soundscapes
        </h2>
        <p className="text-xs sm:text-sm text-[#A99F96] mt-1 max-w-2xl">
          Stream curated lo-fi study playlists or load your personal Spotify music directly inside Haven. 
          Your music keeps playing seamlessly even as you navigate to other pages!
        </p>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="glass-panel p-4 rounded-2xl border border-white/5 bg-white/[0.02] flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#F4EFE9]">Persistent Playback</h4>
            <p className="text-[11px] text-[#A99F96]">Music never stops when switching pages</p>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-white/5 bg-white/[0.02] flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#F4EFE9]">Saved Custom Playlists</h4>
            <p className="text-[11px] text-[#A99F96]">Your custom Spotify URLs are auto-saved</p>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-white/5 bg-white/[0.02] flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#F4EFE9]">Floating Mini Player</h4>
            <p className="text-[11px] text-[#A99F96]">Control audio from anywhere in Haven</p>
          </div>
        </div>
      </div>
    </div>
  );
};

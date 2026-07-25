import React from 'react';
import { SpotifyPlayer } from '../components/audio/SpotifyPlayer';
import { Music, Sparkles } from 'lucide-react';

export const SoundscapePage: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 py-4">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono mb-2 border border-emerald-500/20">
          <Music className="w-3.5 h-3.5" />
          <span>Spotify Music Sanctuary</span>
        </div>
        <h2 className="font-serif-heading text-3xl sm:text-4xl font-extrabold text-[#F4EFE9]">
          Spotify Music & Soundscapes
        </h2>
        <p className="text-xs sm:text-sm text-[#A99F96] mt-1">
          Stream curated lo-fi study playlists or load your personal Spotify music directly inside Haven.
        </p>
      </div>

      {/* Dedicated Spotify Sanctuary Player Component */}
      <SpotifyPlayer />
    </div>
  );
};

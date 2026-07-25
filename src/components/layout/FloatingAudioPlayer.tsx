import React from 'react';
import { Music } from 'lucide-react';
import { soundEngine } from '../../services/soundGenerator';
import { useNavigate } from 'react-router-dom';

export const FloatingAudioPlayer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-5 right-6 z-40 select-none">
      <button
        onClick={() => {
          soundEngine.playClickSound();
          navigate('/sounds');
        }}
        className="glass-panel px-4 py-3 rounded-2xl shadow-2xl border border-emerald-500/30 flex items-center gap-3 bg-[#181613]/90 hover:bg-emerald-600/20 text-[#F4EFE9] transition-all group"
      >
        <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
          <Music className="w-4 h-4" />
        </div>
        <div className="text-left">
          <p className="text-xs font-bold font-serif-heading text-[#F4EFE9]">Spotify Music</p>
          <p className="text-[10px] text-emerald-300 font-mono">Stream Sanctuary Lo-Fi</p>
        </div>
      </button>
    </div>
  );
};

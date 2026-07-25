import React, { useState } from 'react';
import { Volume2, VolumeX, CloudRain, Trees, Coffee, Radio, Waves, Music, ChevronUp, ChevronDown } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { SoundTrack } from '../../types';
import { soundEngine } from '../../services/soundGenerator';

const SOUND_TRACKS: { id: SoundTrack; label: string; icon: any }[] = [
  { id: 'rain', label: 'Rainstorm', icon: CloudRain },
  { id: 'forest', label: 'Deep Forest', icon: Trees },
  { id: 'coffee', label: 'Coffee Shop', icon: Coffee },
  { id: 'whitenoise', label: 'White Noise', icon: Radio },
  { id: 'ocean', label: 'Ocean Waves', icon: Waves },
  { id: 'lofi', label: 'Lo-Fi Chill', icon: Music },
];

export const FloatingAudioPlayer: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    activeSoundTrack,
    isSoundPlaying,
    soundVolume,
    setAmbientTrack,
    toggleAmbientPlay,
    setAmbientVolume,
  } = useAppStore();

  return (
    <div className="fixed bottom-5 right-6 z-40 select-none">
      <div className="glass-panel rounded-2xl p-3 shadow-2xl border border-white/10 transition-all duration-300 backdrop-blur-xl">
        {/* Compact Bar */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundEngine.playClickSound();
              toggleAmbientPlay();
            }}
            className={`p-2.5 rounded-xl transition-all ${
              isSoundPlaying
                ? 'bg-purple-600 text-white glow-primary scale-105'
                : 'bg-white/10 text-slate-300 hover:text-white hover:bg-white/20'
            }`}
          >
            {isSoundPlaying ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <div className="text-left cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
            <p className="text-xs font-semibold text-white flex items-center gap-1.5">
              <span>{activeSoundTrack ? SOUND_TRACKS.find(t => t.id === activeSoundTrack)?.label : 'Ambient Audio'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </p>
            <p className="text-[10px] text-slate-400">
              {isSoundPlaying ? 'Playing synthetic binaural loop' : 'Select ambient soundscape'}
            </p>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-slate-400 hover:text-white bg-white/5 rounded-lg border border-white/5"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        {/* Expanded Panel */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-white/10 space-y-3 w-64">
            {/* Sound Selector Grid */}
            <div className="grid grid-cols-2 gap-2">
              {SOUND_TRACKS.map((t) => {
                const Icon = t.icon;
                const isSelected = activeSoundTrack === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      soundEngine.playClickSound();
                      setAmbientTrack(t.id);
                    }}
                    className={`flex items-center gap-2 p-2 rounded-xl text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-purple-600/30 text-purple-200 border border-purple-500/50'
                        : 'bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10 border border-transparent'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Volume Slider */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Volume</span>
                <span>{Math.round(soundVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={soundVolume}
                onChange={(e) => setAmbientVolume(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

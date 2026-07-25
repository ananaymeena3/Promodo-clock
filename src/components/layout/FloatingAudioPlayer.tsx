import React, { useState } from 'react';
import { Volume2, VolumeX, CloudRain, Flame, Trees, Waves, Coffee, ChevronUp, ChevronDown, Sliders } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { SoundChannelId } from '../../types';
import { soundEngine } from '../../services/soundGenerator';
import { useNavigate } from 'react-router-dom';

const QUICK_CHANNELS: { id: SoundChannelId; label: string; icon: any }[] = [
  { id: 'rain', label: 'Rain', icon: CloudRain },
  { id: 'fireplace', label: 'Fireplace', icon: Flame },
  { id: 'forest', label: 'Forest', icon: Trees },
  { id: 'coffeeshop', label: 'Cafe', icon: Coffee },
  { id: 'ocean', label: 'Ocean', icon: Waves },
];

export const FloatingAudioPlayer: React.FC = () => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const { activeChannels, toggleChannelPlay, stopAllSoundChannels } = useAppStore();

  const activeCount = Object.values(activeChannels).filter((c) => c.isPlaying && !c.isMuted).length;

  return (
    <div className="fixed bottom-5 right-6 z-40 select-none">
      <div className="glass-panel rounded-2xl p-3 shadow-2xl border border-[#CDAA7D]/20 transition-all duration-300 backdrop-blur-2xl bg-[#181613]/90">
        {/* Compact Bar */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundEngine.playClickSound();
              if (activeCount > 0) {
                stopAllSoundChannels();
              } else {
                toggleChannelPlay('rain');
              }
            }}
            className={`p-2.5 rounded-xl transition-all ${
              activeCount > 0
                ? 'bg-[#6D4C41] text-[#F5EBDD] border border-[#CDAA7D]/40 shadow-lg'
                : 'bg-white/5 text-[#A99F96] hover:text-[#F4EFE9] hover:bg-white/10'
            }`}
          >
            {activeCount > 0 ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <div className="text-left cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
            <p className="text-xs font-serif-heading font-bold text-[#F4EFE9] flex items-center gap-1.5">
              <span>{activeCount > 0 ? `${activeCount} Audio Channels Playing` : 'Sanctuary Audio'}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${activeCount > 0 ? 'bg-[#CDAA7D] animate-pulse' : 'bg-[#A99F96]'}`} />
            </p>
            <p className="text-[10px] text-[#A99F96]">
              {activeCount > 0 ? 'Click to manage soundscape' : 'Click to start ambient audio'}
            </p>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-[#A99F96] hover:text-[#F4EFE9] bg-white/5 rounded-lg border border-white/5"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        {/* Expanded Quick Controls */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-white/5 space-y-3 w-64">
            <div className="grid grid-cols-2 gap-2">
              {QUICK_CHANNELS.map((t) => {
                const Icon = t.icon;
                const isPlaying = activeChannels[t.id]?.isPlaying;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      soundEngine.playClickSound();
                      toggleChannelPlay(t.id);
                    }}
                    className={`flex items-center gap-2 p-2 rounded-xl text-xs font-medium transition-all ${
                      isPlaying
                        ? 'bg-[#CDAA7D]/20 text-[#CDAA7D] border border-[#CDAA7D]/40'
                        : 'bg-white/5 text-[#A99F96] hover:text-[#F4EFE9] hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                soundEngine.playClickSound();
                setIsExpanded(false);
                navigate('/sounds');
              }}
              className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-[#CDAA7D] flex items-center justify-center gap-1.5 border border-white/5"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Full Sound Mixer & Presets</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { SoundChannelId } from '../types';
import {
  Volume2,
  VolumeX,
  Sliders,
  CloudRain,
  CloudLightning,
  Flame,
  Trees,
  Waves,
  Coffee,
  BookOpen,
  Wind,
  Moon,
  Snowflake,
  Train,
  Radio,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { soundEngine } from '../services/soundGenerator';
import toast from 'react-hot-toast';

const CHANNELS: { id: SoundChannelId; name: string; category: string; icon: any }[] = [
  { id: 'rain', name: 'Gentle Rain', category: 'Nature', icon: CloudRain },
  { id: 'heavy_rain', name: 'Heavy Downpour', category: 'Nature', icon: CloudRain },
  { id: 'thunder', name: 'Distant Thunder', category: 'Nature', icon: CloudLightning },
  { id: 'fireplace', name: 'Hearth Fireplace', category: 'Cozy', icon: Flame },
  { id: 'forest', name: 'Pine Forest', category: 'Nature', icon: Trees },
  { id: 'ocean', name: 'Ocean Waves', category: 'Nature', icon: Waves },
  { id: 'coffeeshop', name: 'Cafe Murmur', category: 'Urban', icon: Coffee },
  { id: 'library', name: 'Old Library', category: 'Cozy', icon: BookOpen },
  { id: 'wind', name: 'Mountain Wind', category: 'Nature', icon: Wind },
  { id: 'crickets', name: 'Night Crickets', category: 'Nature', icon: Moon },
  { id: 'snow', name: 'Falling Snow', category: 'Nature', icon: Snowflake },
  { id: 'train', name: 'Night Train Tracks', category: 'Urban', icon: Train },
  { id: 'whitenoise', name: 'White Noise', category: 'Noise', icon: Radio },
  { id: 'brownnoise', name: 'Brown Noise', category: 'Noise', icon: Radio },
  { id: 'pinknoise', name: 'Pink Noise', category: 'Noise', icon: Radio },
];

const PRESETS = [
  {
    name: 'Oxford Afternoon',
    desc: 'Gentle rain, quiet library & hearth fireplace crackle',
    mix: { rain: 0.6, library: 0.7, fireplace: 0.3 } as Record<SoundChannelId, number>,
  },
  {
    name: 'Midnight Storm',
    desc: 'Heavy rain, distant thunder rumble & mountain wind',
    mix: { heavy_rain: 0.8, thunder: 0.6, wind: 0.4 } as Record<SoundChannelId, number>,
  },
  {
    name: 'Cabin Hearth & Snow',
    desc: 'Warm fireplace, falling snow & quiet night crickets',
    mix: { fireplace: 0.8, snow: 0.5, crickets: 0.3 } as Record<SoundChannelId, number>,
  },
  {
    name: 'Espresso & Rain',
    desc: 'Cafe murmur & soft raindrops outside the glass window',
    mix: { coffeeshop: 0.7, rain: 0.5 } as Record<SoundChannelId, number>,
  },
  {
    name: 'Night Train Ride',
    desc: 'Rhythmic train track vibrations & ocean waves',
    mix: { train: 0.7, ocean: 0.4, rain: 0.3 } as Record<SoundChannelId, number>,
  },
];

export const SoundscapePage: React.FC = () => {
  const {
    activeChannels,
    setChannelVolume,
    toggleChannelMute,
    toggleChannelPlay,
    applyMixPreset,
    stopAllSoundChannels,
  } = useAppStore();

  const handleApplyPreset = (presetName: string, mix: Record<SoundChannelId, number>) => {
    soundEngine.playClickSound();
    applyMixPreset(mix);
    toast.success(`Loaded preset: ${presetName}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 py-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CDAA7D]/10 text-[#CDAA7D] text-xs font-mono mb-2">
            <Sliders className="w-3.5 h-3.5" />
            <span>Multi-Channel Soundscape Synthesizer</span>
          </div>
          <h2 className="font-serif-heading text-3xl sm:text-4xl font-extrabold text-[#F4EFE9]">
            Sanctuary Audio Mixer
          </h2>
          <p className="text-xs sm:text-sm text-[#A99F96] mt-1">
            Mix unlimited ambient channels simultaneously to craft your perfect study audio atmosphere.
          </p>
        </div>

        <button
          onClick={() => {
            soundEngine.playClickSound();
            stopAllSoundChannels();
            toast('Muted all audio channels');
          }}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-[#A99F96] hover:text-[#F4EFE9] border border-white/10 text-xs font-semibold px-4 py-2.5 rounded-2xl transition-all self-start sm:self-auto"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Stop All Channels</span>
        </button>
      </div>

      {/* Preset Cards */}
      <div className="space-y-3">
        <h3 className="font-serif-heading text-lg font-bold text-[#F4EFE9] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#CDAA7D]" /> Master Audio Presets
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => handleApplyPreset(p.name, p.mix)}
              className="glass-panel p-4 rounded-2xl border border-white/5 hover:border-[#CDAA7D]/30 text-left transition-all group hover:scale-[1.02]"
            >
              <h4 className="text-xs font-bold text-[#F4EFE9] group-hover:text-[#CDAA7D] transition-colors">{p.name}</h4>
              <p className="text-[11px] text-[#A99F96] leading-snug mt-1 line-clamp-2">{p.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Multi-Channel Sound Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {CHANNELS.map((ch) => {
          const Icon = ch.icon;
          const chState = activeChannels[ch.id] || { volume: 0.5, isMuted: false, isPlaying: false };

          return (
            <div
              key={ch.id}
              className={`glass-panel p-5 rounded-3xl border transition-all space-y-4 ${
                chState.isPlaying
                  ? 'border-[#CDAA7D]/40 bg-[#211C18]/90 shadow-xl shadow-[#CDAA7D]/10'
                  : 'border-white/5 bg-[#181613]/60 hover:border-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      soundEngine.playClickSound();
                      toggleChannelPlay(ch.id);
                    }}
                    className={`p-3 rounded-2xl border transition-all ${
                      chState.isPlaying
                        ? 'bg-[#6D4C41] text-[#F5EBDD] border-[#CDAA7D]/40 shadow-lg scale-105'
                        : 'bg-white/5 text-[#A99F96] border-white/5 hover:text-[#F4EFE9]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                  <div>
                    <h4 className="text-xs font-bold text-[#F4EFE9]">{ch.name}</h4>
                    <span className="text-[10px] text-[#A99F96] font-mono">{ch.category}</span>
                  </div>
                </div>

                {/* Mute toggle button */}
                <button
                  onClick={() => {
                    soundEngine.playClickSound();
                    toggleChannelMute(ch.id);
                  }}
                  className={`p-1.5 rounded-xl border text-xs transition-all ${
                    chState.isMuted
                      ? 'bg-red-500/20 text-red-300 border-red-500/30'
                      : 'bg-white/5 text-[#A99F96] border-white/5 hover:text-[#F4EFE9]'
                  }`}
                >
                  {chState.isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Volume Slider */}
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#A99F96]">
                  <span>Volume</span>
                  <span>{chState.isPlaying ? Math.round(chState.volume * 100) : 0}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={chState.volume}
                  onChange={(e) => setChannelVolume(ch.id, parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-[#181613] rounded-lg appearance-none cursor-pointer accent-[#CDAA7D]"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

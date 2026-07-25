import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { StudyRoom, SoundChannelId } from '../types';
import {
  Compass,
  Check,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Sunset,
  Flame,
  CloudRain,
  Sliders,
  Sparkles,
  RotateCcw,
  CloudLightning,
  Trees,
  Waves,
  Coffee,
  BookOpen,
  Wind,
  Snowflake,
  Train,
  Radio,
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

export const StudyRoomsPage: React.FC = () => {
  const {
    studyRooms,
    activeRoomId,
    setActiveRoom,
    lightingMode,
    setLightingMode,
    activeChannels,
    setChannelVolume,
    toggleChannelMute,
    toggleChannelPlay,
    applyMixPreset,
    stopAllSoundChannels,
  } = useAppStore();

  const handleSelectRoom = (room: StudyRoom) => {
    soundEngine.playClickSound();
    setActiveRoom(room.id);
    toast.success(`Entered ${room.name}`);

    // Auto apply sound preset tailored for selected room
    if (room.id === 'oxford_library') {
      applyMixPreset({ rain: 0.5, library: 0.7, fireplace: 0.3 } as any);
    } else if (room.id === 'cozy_cabin') {
      applyMixPreset({ fireplace: 0.8, snow: 0.4, wind: 0.3 } as any);
    } else if (room.id === 'rain_apartment') {
      applyMixPreset({ rain: 0.7, heavy_rain: 0.4, coffeeshop: 0.3 } as any);
    } else if (room.id === 'japanese_study') {
      applyMixPreset({ forest: 0.5, crickets: 0.4 } as any);
    } else if (room.id === 'coffee_corner') {
      applyMixPreset({ coffeeshop: 0.7, rain: 0.3 } as any);
    } else if (room.id === 'train_cabin') {
      applyMixPreset({ train: 0.7, rain: 0.4, thunder: 0.2 } as any);
    }
  };

  const handleApplyPreset = (presetName: string, mix: Record<SoundChannelId, number>) => {
    soundEngine.playClickSound();
    applyMixPreset(mix);
    toast.success(`Loaded audio preset: ${presetName}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-10 py-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CDAA7D]/10 text-[#CDAA7D] text-xs font-mono mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Integrated Study Rooms & Multi-Channel Soundscapes</span>
          </div>
          <h2 className="font-serif-heading text-3xl sm:text-4xl font-extrabold text-[#F4EFE9]">
            Sanctuary Study Rooms & Audio Mixer
          </h2>
          <p className="text-xs sm:text-sm text-[#A99F96] max-w-xl mt-1">
            Choose your ambient study environment and customize multi-channel lo-fi soundscapes in real-time.
          </p>
        </div>

        {/* Lighting Selector Quick Controls */}
        <div className="glass-panel p-2.5 rounded-2xl border border-[#CDAA7D]/20 flex items-center gap-1.5 self-start sm:self-auto">
          {(['morning', 'afternoon', 'golden_hour', 'night', 'fireplace'] as const).map((mode) => {
            const isSel = lightingMode === mode;
            return (
              <button
                key={mode}
                onClick={() => {
                  soundEngine.playClickSound();
                  setLightingMode(mode);
                }}
                title={`Switch to ${mode.replace('_', ' ')} lighting`}
                className={`p-2 rounded-xl text-xs font-semibold capitalize transition-all flex items-center gap-1.5 ${
                  isSel
                    ? 'bg-[#6D4C41] text-[#F5EBDD] border border-[#CDAA7D]/40 shadow-md'
                    : 'text-[#A99F96] hover:text-[#F4EFE9] hover:bg-white/5'
                }`}
              >
                {mode === 'morning' && <Sun className="w-3.5 h-3.5 text-amber-300" />}
                {mode === 'afternoon' && <Sun className="w-3.5 h-3.5 text-sky-300" />}
                {mode === 'golden_hour' && <Sunset className="w-3.5 h-3.5 text-amber-500" />}
                {mode === 'night' && <Moon className="w-3.5 h-3.5 text-indigo-300" />}
                {mode === 'fireplace' && <Flame className="w-3.5 h-3.5 text-orange-400" />}
                <span className="hidden md:inline">{mode.replace('_', ' ')}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Study Rooms Cards */}
      <div className="space-y-4">
        <h3 className="font-serif-heading text-xl font-bold text-[#F4EFE9] flex items-center gap-2">
          <Compass className="w-5 h-5 text-[#CDAA7D]" /> Virtual Sanctuary Study Rooms
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studyRooms.map((room: StudyRoom) => {
            const isActive = activeRoomId === room.id;
            return (
              <div
                key={room.id}
                onClick={() => handleSelectRoom(room)}
                className={`glass-panel rounded-3xl border overflow-hidden cursor-pointer transition-all duration-300 group ${
                  isActive
                    ? 'border-[#CDAA7D] ring-2 ring-[#CDAA7D]/40 shadow-2xl scale-[1.02]'
                    : 'border-white/5 hover:border-[#CDAA7D]/30 hover:scale-[1.01]'
                }`}
              >
                {/* Room Wallpaper Thumbnail with Overlay */}
                <div className="h-48 relative overflow-hidden bg-[#181613]">
                  <img
                    src={room.wallpaperUrl}
                    alt={room.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#181613] via-transparent to-black/30" />

                  {/* Active Badge */}
                  {isActive && (
                    <div className="absolute top-3 right-3 bg-[#CDAA7D] text-[#181613] px-3 py-1 rounded-full text-xs font-bold font-mono shadow-lg flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>ACTIVE SANCTUARY</span>
                    </div>
                  )}

                  {/* Rain indicator */}
                  {room.defaultRain && (
                    <div className="absolute bottom-3 left-3 bg-[#181613]/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] text-sky-300 border border-white/10 flex items-center gap-1">
                      <CloudRain className="w-3.5 h-3.5" />
                      <span>Rain Window</span>
                    </div>
                  )}
                </div>

                {/* Room Content */}
                <div className="p-6 space-y-3">
                  <h3 className="font-serif-heading text-xl font-bold text-[#F4EFE9] group-hover:text-[#CDAA7D] transition-colors">
                    {room.name}
                  </h3>
                  <p className="text-xs text-[#A99F96] leading-relaxed line-clamp-2">
                    {room.description}
                  </p>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-[#CDAA7D]">
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Volume2 className="w-3.5 h-3.5" />
                      {room.defaultSoundPreset}
                    </span>
                    <span className="text-[11px] text-[#A99F96] capitalize font-mono">
                      {room.themePreset.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Preset Sound Mixes Bar */}
      <div className="space-y-4 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between">
          <h3 className="font-serif-heading text-xl font-bold text-[#F4EFE9] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#CDAA7D]" /> Room Sound Presets
          </h3>
          <button
            onClick={() => {
              soundEngine.playClickSound();
              stopAllSoundChannels();
              toast('Muted all audio channels');
            }}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-[#A99F96] hover:text-[#F4EFE9] border border-white/10 text-xs font-semibold px-4 py-2.5 rounded-2xl transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Mute All Audio</span>
          </button>
        </div>

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

      {/* Multi-Channel Sound Synthesizer Grid */}
      <div className="space-y-4">
        <h3 className="font-serif-heading text-xl font-bold text-[#F4EFE9] flex items-center gap-2">
          <Sliders className="w-5 h-5 text-[#CDAA7D]" /> Multi-Channel Ambient Synthesizer
        </h3>

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
    </div>
  );
};

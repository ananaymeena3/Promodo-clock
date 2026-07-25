import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { StudyRoom } from '../types';
import {
  Compass,
  Check,
  Volume2,
  Sun,
  Moon,
  Sunset,
  Flame,
  CloudRain,
} from 'lucide-react';
import { soundEngine } from '../services/soundGenerator';
import toast from 'react-hot-toast';

export const StudyRoomsPage: React.FC = () => {
  const { studyRooms, activeRoomId, setActiveRoom, lightingMode, setLightingMode, applyMixPreset } = useAppStore();

  const handleSelectRoom = (room: StudyRoom) => {
    soundEngine.playClickSound();
    setActiveRoom(room.id);
    toast.success(`Entered ${room.name}`);

    // Auto apply sound preset for room
    if (room.id === 'oxford_library') {
      applyMixPreset({ rain: 0.5, library: 0.6, fireplace: 0.2 } as any);
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

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CDAA7D]/10 text-[#CDAA7D] text-xs font-mono mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Virtual Sanctuary Rooms</span>
          </div>
          <h2 className="font-serif-heading text-3xl sm:text-4xl font-extrabold text-[#F4EFE9]">
            Interactive Study Environments
          </h2>
          <p className="text-xs sm:text-sm text-[#A99F96] max-w-xl mt-1">
            Choose your ambient study sanctuary. Each room offers tailored wallpaper scenes, dynamic lighting moods, and lo-fi soundscapes.
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
  );
};

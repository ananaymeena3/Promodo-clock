import React from 'react';
import { useAppStore } from '../../store/useAppStore';

export const AmbientScene: React.FC = () => {
  const { studyRooms, activeRoomId, lightingMode } = useAppStore();
  const activeRoom = studyRooms.find((r) => r.id === activeRoomId) || studyRooms[0];

  // Dynamic overlay gradient based on lighting mode
  const getLightingOverlay = () => {
    switch (lightingMode) {
      case 'morning':
        return 'from-amber-500/10 via-sky-500/5 to-transparent';
      case 'afternoon':
        return 'from-sky-500/10 via-amber-200/5 to-transparent';
      case 'golden_hour':
        return 'from-amber-600/25 via-orange-600/15 to-purple-900/20';
      case 'night':
        return 'from-indigo-950/40 via-purple-950/30 to-black/60';
      case 'fireplace':
        return 'from-amber-700/30 via-orange-950/40 to-black/70';
      default:
        return 'from-amber-600/20 via-orange-600/10 to-transparent';
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Background Image Wallpaper */}
      {activeRoom?.wallpaperUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105 opacity-25 filter blur-[2px]"
          style={{ backgroundImage: `url(${activeRoom.wallpaperUrl})` }}
        />
      )}

      {/* Dynamic Lighting Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-b ${getLightingOverlay()} transition-all duration-1000`} />

      {/* Ambient Radial Lamp Glow */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[#CDAA7D]/10 rounded-full blur-[140px] animate-pulse" />
      <div className="absolute bottom-1/3 right-1/4 w-[450px] h-[450px] bg-[#6D4C41]/15 rounded-full blur-[130px]" />

      {/* Floating Dust Particles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[#CDAA7D]/40 blur-[0.5px] animate-dust"
            style={{
              top: `${(i * 7 + 10) % 90}%`,
              left: `${(i * 13 + 5) % 95}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${10 + (i % 5) * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Rain Window Effect */}
      {activeRoom?.defaultRain && (
        <div className="absolute inset-0 opacity-20">
          {[...Array(25)].map((_, i) => (
            <div
              key={`rain-${i}`}
              className="absolute w-[1px] h-16 bg-gradient-to-b from-transparent via-[#F5EBDD]/40 to-transparent animate-rain"
              style={{
                left: `${i * 4.2}%`,
                animationDelay: `${(i % 7) * 0.25}s`,
                animationDuration: `${1.1 + (i % 3) * 0.3}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Fireplace Flicker Glow (if fireplace mode) */}
      {lightingMode === 'fireplace' && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-96 bg-gradient-to-t from-orange-600/30 via-amber-700/15 to-transparent animate-flicker" />
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Maximize2,
  Flame,
  HelpCircle,
  Download,
  Sun,
  Moon,
  Sunset,
  Flame as FireIcon,
  UserCircle2,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useThemeStore } from '../../store/useThemeStore';
import { useAuthStore } from '../../store/useAuthStore';
import { soundEngine } from '../../services/soundGenerator';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const {
    toggleCommandPalette,
    toggleShortcutsModal,
    toggleBackupModal,
    streaks,
    lightingMode,
    setLightingMode,
  } = useAppStore();
  const { settings } = useThemeStore();
  const { user } = useAuthStore();
  const [timeString, setTimeString] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: settings.timeFormat === '12h',
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [settings.timeFormat]);

  const enterFocusMode = () => {
    soundEngine.playClickSound();
    navigate('/focus');
  };

  const cycleLighting = () => {
    soundEngine.playClickSound();
    const modes: ('morning' | 'afternoon' | 'golden_hour' | 'night' | 'fireplace')[] = [
      'morning',
      'afternoon',
      'golden_hour',
      'night',
      'fireplace',
    ];
    const idx = modes.indexOf(lightingMode);
    const next = modes[(idx + 1) % modes.length];
    setLightingMode(next);
  };

  return (
    <header className="h-16 glass-panel border-b border-[#CDAA7D]/10 fixed top-0 left-64 right-0 z-30 px-6 flex items-center justify-between backdrop-blur-2xl">
      {/* Search Input Bar */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            soundEngine.playClickSound();
            toggleCommandPalette();
          }}
          className="flex items-center gap-3 bg-[#211C18]/60 hover:bg-[#211C18] text-[#A99F96] hover:text-[#F4EFE9] px-4 py-2 rounded-xl text-xs border border-white/5 transition-all w-72 justify-between group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-[#CDAA7D] group-hover:scale-110 transition-transform" />
            <span>Search sanctuary tasks, journal...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[9px] font-mono bg-[#181613] rounded text-[#CDAA7D] border border-white/10">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Center Live Clock */}
      <div className="hidden md:flex items-center gap-2.5 bg-[#181613]/80 px-4 py-1.5 rounded-full border border-[#CDAA7D]/20 shadow-inner">
        <span className="w-2 h-2 rounded-full bg-[#CDAA7D] animate-pulse" />
        <span className="text-xs font-mono font-semibold tracking-wider text-[#F4EFE9]">{timeString}</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Lighting Atmosphere Mode Toggle */}
        <button
          onClick={cycleLighting}
          title={`Current Atmosphere: ${lightingMode.replace('_', ' ')} (Click to switch)`}
          className="flex items-center gap-1.5 bg-[#211C18]/80 hover:bg-[#211C18] px-3 py-1.5 rounded-xl border border-[#CDAA7D]/20 text-[#CDAA7D] text-xs font-semibold transition-all capitalize"
        >
          {lightingMode === 'morning' && <Sun className="w-3.5 h-3.5 text-amber-300" />}
          {lightingMode === 'afternoon' && <Sun className="w-3.5 h-3.5 text-sky-300" />}
          {lightingMode === 'golden_hour' && <Sunset className="w-3.5 h-3.5 text-amber-500" />}
          {lightingMode === 'night' && <Moon className="w-3.5 h-3.5 text-indigo-300" />}
          {lightingMode === 'fireplace' && <FireIcon className="w-3.5 h-3.5 text-orange-400" />}
          <span className="hidden lg:inline">{lightingMode.replace('_', ' ')}</span>
        </button>

        {/* Streak Counter */}
        <div
          onClick={() => navigate('/analytics')}
          className="flex items-center gap-1.5 bg-[#CDAA7D]/10 px-3 py-1.5 rounded-xl border border-[#CDAA7D]/20 text-[#CDAA7D] text-xs font-semibold cursor-pointer hover:border-[#CDAA7D]/40 transition-all"
        >
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-bounce" />
          <span>{streaks.dailyStreak} Days</span>
        </div>

        {/* Enter Focus Mode Button */}
        <button
          onClick={enterFocusMode}
          title="Enter Fullscreen Focus Mode (Press F)"
          className="flex items-center gap-2 bg-[#6D4C41] hover:bg-[#4E342E] text-[#F5EBDD] text-xs font-semibold px-3.5 py-2 rounded-xl transition-all shadow-lg shadow-[#6D4C41]/30 hover:scale-105 border border-[#CDAA7D]/30"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Focus Mode</span>
          <kbd className="hidden sm:inline text-[9px] bg-[#4E342E] px-1 py-0.2 rounded font-mono">F</kbd>
        </button>

        {/* Shortcuts Modal */}
        <button
          onClick={() => {
            soundEngine.playClickSound();
            toggleShortcutsModal();
          }}
          title="Keyboard Shortcuts"
          className="p-2 text-[#A99F96] hover:text-[#F4EFE9] bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Backup Modal */}
        <button
          onClick={() => {
            soundEngine.playClickSound();
            toggleBackupModal();
          }}
          title="Backup & Restore"
          className="p-2 text-[#A99F96] hover:text-[#F4EFE9] bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5"
        >
          <Download className="w-4 h-4" />
        </button>

        {/* Profile Navigation */}
        <button
          onClick={() => {
            soundEngine.playClickSound();
            navigate('/profile');
          }}
          title="Your Profile"
          className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10 flex items-center justify-center group"
        >
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="Profile" className="w-7 h-7 rounded-lg object-cover" />
          ) : (
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6D4C41] to-[#CDAA7D]/40 border border-[#CDAA7D]/30 flex items-center justify-center text-[#F5EBDD] font-bold text-xs group-hover:border-[#CDAA7D]/60 transition-all">
              {(user?.fullName || 'G').charAt(0).toUpperCase()}
            </div>
          )}
        </button>
      </div>
    </header>
  );
};

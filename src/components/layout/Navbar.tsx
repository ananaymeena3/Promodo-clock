import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Maximize2,
  Moon,
  Sun,
  Flame,
  HelpCircle,
  Download,
  Sparkles,
  User as UserIcon,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useThemeStore } from '../../store/useThemeStore';
import { useAuthStore } from '../../store/useAuthStore';
import { soundEngine } from '../../services/soundGenerator';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { toggleCommandPalette, toggleShortcutsModal, toggleBackupModal, streaks } = useAppStore();
  const { settings, toggleDarkMode } = useThemeStore();
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

  return (
    <header className="h-16 glass-panel border-b border-white/10 fixed top-0 left-64 right-0 z-30 px-6 flex items-center justify-between backdrop-blur-xl">
      {/* Search Input Bar */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            soundEngine.playClickSound();
            toggleCommandPalette();
          }}
          className="flex items-center gap-3 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 px-4 py-2 rounded-xl text-xs border border-white/10 transition-all w-72 justify-between group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-400 transition-colors" />
            <span>Search tasks, notes, commands...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 rounded text-slate-300 border border-slate-700">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Center Live Clock */}
      <div className="hidden md:flex items-center gap-2 bg-slate-900/60 px-4 py-1.5 rounded-full border border-white/10">
        <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
        <span className="text-sm font-mono font-semibold tracking-wider text-slate-200">{timeString}</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Streak Counter */}
        <div
          onClick={() => navigate('/analytics')}
          className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20 text-amber-300 text-xs font-semibold cursor-pointer hover:border-amber-500/40 transition-all"
        >
          <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-bounce" />
          <span>{streaks.dailyStreak} Days</span>
        </div>

        {/* Enter Focus Mode Button */}
        <button
          onClick={enterFocusMode}
          title="Enter Distraction-Free Focus Mode (Press F)"
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-all shadow-lg shadow-purple-600/30 hover:scale-105"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Focus Mode</span>
          <kbd className="hidden sm:inline text-[9px] bg-purple-800 px-1 py-0.2 rounded font-mono">F</kbd>
        </button>

        {/* Shortcuts Modal */}
        <button
          onClick={() => {
            soundEngine.playClickSound();
            toggleShortcutsModal();
          }}
          title="Keyboard Shortcuts"
          className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Export / Import Backup Modal */}
        <button
          onClick={() => {
            soundEngine.playClickSound();
            toggleBackupModal();
          }}
          title="Export / Import Backup"
          className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5"
        >
          <Download className="w-4 h-4" />
        </button>

        {/* Dark/Light Mode Toggle */}
        <button
          onClick={() => {
            soundEngine.playClickSound();
            toggleDarkMode();
          }}
          title="Toggle Theme Mode"
          className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5"
        >
          {settings.isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>

        {/* Profile Navigation */}
        <button
          onClick={() => {
            soundEngine.playClickSound();
            navigate('/profile');
          }}
          className="p-1 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10"
        >
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt="User"
            className="w-7 h-7 rounded-lg object-cover"
          />
        </button>
      </div>
    </header>
  );
};

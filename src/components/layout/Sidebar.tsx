import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Clock,
  CheckSquare,
  BarChart3,
  CalendarHeart,
  FileText,
  User,
  Settings,
  Sparkles,
  Volume2,
  VolumeX,
  Command,
  Maximize2,
  Award,
  LogIn,
  Database,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { soundEngine } from '../../services/soundGenerator';

const NAV_ITEMS = [
  { path: '/timer', label: 'Pomodoro Timer', icon: Clock },
  { path: '/tasks', label: 'Kanban Tasks', icon: CheckSquare },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/habits', label: 'Habit Tracker', icon: CalendarHeart },
  { path: '/notes', label: 'Notes & Docs', icon: FileText },
  { path: '/profile', label: 'Profile & Stats', icon: User },
  { path: '/auth', label: 'Login / Register', icon: LogIn },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user, isSupabaseConnected } = useAuthStore();
  const {
    toggleCommandPalette,
    toggleAICoachModal,
    toggleAchievementsModal,
    activeSoundTrack,
    isSoundPlaying,
    toggleAmbientPlay,
    streaks,
  } = useAppStore();

  return (
    <aside className="w-64 glass-panel border-r border-white/10 flex flex-col h-screen fixed left-0 top-0 z-40 select-none backdrop-blur-xl">
      {/* MacOS Window Traffic Lights */}
      <div className="h-12 px-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="mac-btn-red" />
          <div className="mac-btn-yellow" />
          <div className="mac-btn-green" />
        </div>
        <div className="flex items-center gap-1.5 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
          <span className={`w-2 h-2 rounded-full ${isSupabaseConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          <span className="text-[11px] font-medium text-slate-300">
            {isSupabaseConnected ? 'Supabase Sync' : 'FocusFlow'}
          </span>
        </div>
      </div>

      {/* User Quick Info */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-3 bg-white/5 p-2.5 rounded-xl border border-white/5 hover:border-white/10 transition-all">
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt="Avatar"
            className="w-9 h-9 rounded-full object-cover ring-2 ring-purple-500/40"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-white truncate">{user?.fullName || 'Alex Morgan'}</h4>
            <div className="flex items-center gap-2 text-[11px] text-purple-300 font-mono">
              <span>🔥 {streaks.dailyStreak} Day Streak</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Workspace
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path === '/timer' && location.pathname === '/');

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => soundEngine.playClickSound()}
              className={({ isActive: isSelfActive }) => {
                const active = isActive || isSelfActive;
                return `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  active
                    ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/30 text-white border border-purple-500/30 shadow-lg shadow-purple-500/10'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                }`;
              }}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
            </NavLink>
          );
        })}

        <div className="pt-4 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Smart Tools
        </div>

        {/* AI Productivity Coach Button */}
        <button
          onClick={() => {
            soundEngine.playClickSound();
            toggleAICoachModal();
          }}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-all group"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span>AI Productivity Coach</span>
          </div>
          <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">NEW</span>
        </button>

        {/* Achievements Modal Button */}
        <button
          onClick={() => {
            soundEngine.playClickSound();
            toggleAchievementsModal();
          }}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 transition-all group"
        >
          <div className="flex items-center gap-3">
            <Award className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
            <span>Badges & Level</span>
          </div>
          <span className="text-[10px] font-mono bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded">Lvl 4</span>
        </button>
      </nav>

      {/* Ambient Audio Widget */}
      <div className="p-3 border-t border-white/5 space-y-2">
        <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleAmbientPlay}
              className={`p-2 rounded-lg transition-all ${
                isSoundPlaying
                  ? 'bg-purple-600 text-white glow-primary'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {isSoundPlaying ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <div>
              <p className="text-xs font-semibold text-slate-200">
                {isSoundPlaying ? `Audio: ${activeSoundTrack || 'Rain'}` : 'Ambient Sound'}
              </p>
              <p className="text-[10px] text-slate-400">
                {isSoundPlaying ? 'Playing loop' : 'Click to start ambient'}
              </p>
            </div>
          </div>
        </div>

        {/* Command Palette Trigger */}
        <button
          onClick={toggleCommandPalette}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 text-xs transition-all border border-white/5"
        >
          <div className="flex items-center gap-2">
            <Command className="w-3.5 h-3.5" />
            <span>Quick Actions</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 rounded text-slate-300 border border-slate-700">
            ⌘K
          </kbd>
        </button>
      </div>
    </aside>
  );
};

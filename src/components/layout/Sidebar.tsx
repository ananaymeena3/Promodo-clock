import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Clock,
  Compass,
  BookOpen,
  CheckSquare,
  Volume2,
  BarChart3,
  Calendar,
  Settings,
  Sparkles,
  Award,
  LogOut,
  Command,
  Flame,
  Feather,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { soundEngine } from '../../services/soundGenerator';

const NAV_ITEMS = [
  { path: '/home', label: 'Home Sanctuary', icon: Home },
  { path: '/focus-timer', label: 'Focus Timer', icon: Clock },
  { path: '/rooms', label: 'Study Rooms', icon: Compass },
  { path: '/journal', label: 'Reflection Journal', icon: Feather },
  { path: '/tasks', label: 'Tasks & Goals', icon: CheckSquare },
  { path: '/sounds', label: 'Soundscapes', icon: Volume2 },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/calendar', label: 'Planner & AI', icon: Calendar },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isSupabaseConnected } = useAuthStore();
  const {
    toggleCommandPalette,
    toggleAICoachModal,
    toggleAchievementsModal,
    streaks,
  } = useAppStore();

  return (
    <aside className="w-64 glass-panel border-r border-[#CDAA7D]/10 flex flex-col h-screen fixed left-0 top-0 z-40 select-none backdrop-blur-2xl">
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#6D4C41] to-[#CDAA7D] flex items-center justify-center shadow-lg shadow-[#CDAA7D]/20">
            <Feather className="w-4 h-4 text-[#F4EFE9]" />
          </div>
          <div>
            <h1 className="font-serif-heading text-lg font-bold text-[#F4EFE9] tracking-wide">Haven</h1>
            <p className="text-[10px] text-[#A99F96] tracking-wider uppercase font-mono">Digital Sanctuary</p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-[#CDAA7D]/10 px-2 py-0.5 rounded-full border border-[#CDAA7D]/20">
          <span className={`w-2 h-2 rounded-full ${isSupabaseConnected ? 'bg-emerald-400 animate-pulse' : 'bg-[#CDAA7D]'}`} />
          <span className="text-[10px] font-medium text-[#F5EBDD]">
            {isSupabaseConnected ? 'Synced' : 'Offline'}
          </span>
        </div>
      </div>

      {/* User Quick Info */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-3 bg-[#211C18]/60 p-2.5 rounded-2xl border border-white/5 hover:border-[#CDAA7D]/20 transition-all">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt="Avatar"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-[#CDAA7D]/40"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-[#6D4C41]/50 border border-[#CDAA7D]/30 flex items-center justify-center text-[#F5EBDD] font-bold text-sm ring-2 ring-[#CDAA7D]/20 shrink-0">
              {(user?.fullName || 'H').charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold text-[#F4EFE9] truncate">{user?.fullName || 'Sanctuary Scholar'}</h4>
            <div className="flex items-center gap-1.5 text-[11px] text-[#CDAA7D] font-mono mt-0.5">
              <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>{streaks.dailyStreak} Day Streak</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-[#A99F96] font-mono">
          Sanctuary Workspace
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path === '/home' && location.pathname === '/');

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => soundEngine.playClickSound()}
              className={({ isActive: isSelfActive }) => {
                const active = isActive || isSelfActive;
                return `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                  active
                    ? 'bg-gradient-to-r from-[#6D4C41]/40 to-[#CDAA7D]/20 text-[#F5EBDD] border border-[#CDAA7D]/30 shadow-lg shadow-[#CDAA7D]/10'
                    : 'text-[#A99F96] hover:text-[#F4EFE9] hover:bg-white/5'
                }`;
              }}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-[#CDAA7D]' : 'text-[#A99F96]'}`} />
                <span>{item.label}</span>
              </div>
            </NavLink>
          );
        })}

        <div className="pt-4 px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-[#A99F96] font-mono">
          Sanctuary Tools
        </div>

        {/* AI Planner Button */}
        <button
          onClick={() => {
            soundEngine.playClickSound();
            toggleAICoachModal();
          }}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-[#CDAA7D] bg-[#CDAA7D]/10 hover:bg-[#CDAA7D]/20 border border-[#CDAA7D]/20 transition-all group"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-[#CDAA7D] group-hover:rotate-12 transition-transform" />
            <span>AI Study Planner</span>
          </div>
          <span className="text-[9px] font-mono bg-[#CDAA7D]/20 text-[#F5EBDD] px-1.5 py-0.5 rounded">AI</span>
        </button>

        {/* Achievements Modal Button */}
        <button
          onClick={() => {
            soundEngine.playClickSound();
            toggleAchievementsModal();
          }}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-[#F4EFE9] bg-white/5 hover:bg-white/10 border border-white/5 transition-all group"
        >
          <div className="flex items-center gap-3">
            <Award className="w-4 h-4 text-[#CDAA7D] group-hover:scale-110 transition-transform" />
            <span>Decor & Badges</span>
          </div>
          <span className="text-[9px] font-mono bg-[#35543A]/40 text-emerald-300 px-1.5 py-0.5 rounded">Unlocked</span>
        </button>

        {/* Logout Button */}
        <button
          onClick={() => {
            soundEngine.playClickSound();
            logout();
            navigate('/auth');
          }}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-[#A99F96] hover:text-red-400 hover:bg-red-500/10 transition-all group pt-2"
        >
          <div className="flex items-center gap-3">
            <LogOut className="w-4 h-4 text-[#A99F96] group-hover:text-red-400 transition-transform group-hover:scale-110" />
            <span>Sign Out</span>
          </div>
        </button>
      </nav>

      {/* Quick Action Footer */}
      <div className="p-3 border-t border-white/5 space-y-2">
        <button
          onClick={toggleCommandPalette}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#A99F96] text-xs transition-all border border-white/5"
        >
          <div className="flex items-center gap-2">
            <Command className="w-3.5 h-3.5" />
            <span>Quick Palette</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[9px] font-mono bg-[#181613] rounded text-[#CDAA7D] border border-white/10">
            ⌘K
          </kbd>
        </button>
      </div>
    </aside>
  );
};

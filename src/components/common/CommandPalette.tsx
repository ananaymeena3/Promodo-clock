import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { useTimerStore } from '../../store/useTimerStore';
import { useTaskStore } from '../../store/useTaskStore';
import { useNoteStore } from '../../store/useNoteStore';
import { Search, Clock, CheckSquare, BarChart3, CalendarHeart, FileText, User, Settings, Play, Pause, Maximize2, Sparkles, X } from 'lucide-react';
import { soundEngine } from '../../services/soundGenerator';

export const CommandPalette: React.FC = () => {
  const navigate = useNavigate();
  const { isCommandPaletteOpen, toggleCommandPalette, toggleAICoachModal } = useAppStore();
  const { isRunning, startTimer, pauseTimer } = useTimerStore();
  const { tasks } = useTaskStore();
  const { notes } = useNoteStore();

  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleCommandPalette();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleCommandPalette]);

  if (!isCommandPaletteOpen) return null;

  const COMMANDS = [
    { label: 'Pomodoro Timer', icon: Clock, action: () => navigate('/timer') },
    { label: 'Kanban Tasks Board', icon: CheckSquare, action: () => navigate('/tasks') },
    { label: 'Productivity Analytics', icon: BarChart3, action: () => navigate('/analytics') },
    { label: 'Habit Tracker', icon: CalendarHeart, action: () => navigate('/habits') },
    { label: 'Notes & Docs', icon: FileText, action: () => navigate('/notes') },
    { label: 'User Profile', icon: User, action: () => navigate('/profile') },
    { label: 'App Settings', icon: Settings, action: () => navigate('/settings') },
    { label: 'Enter Focus Mode', icon: Maximize2, action: () => navigate('/focus') },
    { label: isRunning ? 'Pause Timer' : 'Start Timer', icon: isRunning ? Pause : Play, action: () => (isRunning ? pauseTimer() : startTimer()) },
    { label: 'Launch AI Productivity Coach', icon: Sparkles, action: () => toggleAICoachModal() },
  ];

  const filteredCommands = COMMANDS.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()));
  const filteredTasks = tasks.filter((t) => t.title.toLowerCase().includes(query.toLowerCase()));
  const filteredNotes = notes.filter((n) => n.title.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (action: () => void) => {
    soundEngine.playClickSound();
    action();
    toggleCommandPalette();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-md">
      <div className="glass-panel w-full max-w-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-fade-in">
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command or search tasks & notes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-white focus:outline-none placeholder-slate-500"
          />
          <button onClick={toggleCommandPalette} className="p-1 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-3">
          {/* Quick Actions */}
          <div>
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">Navigation & Actions</div>
            {filteredCommands.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.label}
                  onClick={() => handleSelect(cmd.action)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                    <span>{cmd.label}</span>
                  </div>
                  <kbd className="text-[9px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 border border-slate-700">Jump</kbd>
                </button>
              );
            })}
          </div>

          {/* Tasks Results */}
          {filteredTasks.length > 0 && query && (
            <div>
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">Tasks ({filteredTasks.length})</div>
              {filteredTasks.slice(0, 4).map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleSelect(() => navigate('/tasks'))}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-white/10"
                >
                  <span className="truncate">{t.title}</span>
                  <span className="text-[10px] text-purple-400 uppercase">{t.status}</span>
                </button>
              ))}
            </div>
          )}

          {/* Notes Results */}
          {filteredNotes.length > 0 && query && (
            <div>
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">Notes ({filteredNotes.length})</div>
              {filteredNotes.slice(0, 4).map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleSelect(() => navigate('/notes'))}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-white/10"
                >
                  <span className="truncate">{n.title}</span>
                  <span className="text-[10px] text-amber-400">Doc</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

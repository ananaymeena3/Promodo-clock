import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { X, Keyboard } from 'lucide-react';

export const KeyboardShortcutsModal: React.FC = () => {
  const { isShortcutsModalOpen, toggleShortcutsModal } = useAppStore();

  if (!isShortcutsModalOpen) return null;

  const SHORTCUTS = [
    { key: 'Space', description: 'Start / Pause Timer' },
    { key: 'R', description: 'Reset Timer' },
    { key: 'F', description: 'Toggle Fullscreen Focus Mode' },
    { key: '←  →', description: 'Switch Timer Modes (Pomodoro / Break)' },
    { key: '↑  ↓', description: 'Increase / Decrease Timer Duration (+1m / -1m)' },
    { key: '⌘ + K / Ctrl + K', description: 'Open Quick Command Palette' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="glass-panel w-full max-w-md rounded-3xl border border-white/10 shadow-2xl p-6 relative animate-fade-in">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-purple-400" /> Keyboard Shortcuts
          </h3>
          <button onClick={toggleShortcutsModal} className="p-1 rounded-xl text-slate-400 hover:text-white bg-white/5">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 pt-4">
          {SHORTCUTS.map((s) => (
            <div key={s.key} className="flex items-center justify-between p-2.5 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-xs text-slate-300">{s.description}</span>
              <kbd className="px-2 py-1 text-xs font-mono bg-slate-900 text-purple-300 rounded-lg border border-purple-500/30">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

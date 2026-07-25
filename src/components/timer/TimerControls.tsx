import React from 'react';
import { Play, Pause, RotateCcw, Maximize2, FastForward } from 'lucide-react';
import { useTimerStore } from '../../store/useTimerStore';
import { useAppStore } from '../../store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { soundEngine } from '../../services/soundGenerator';

export const TimerControls: React.FC = () => {
  const navigate = useNavigate();
  const { isRunning, startTimer, pauseTimer, resetTimer, mode } = useTimerStore();
  const { logFocusSession } = useAppStore();

  const handleCompleteEarly = () => {
    soundEngine.playClickSound();
    const store = useTimerStore.getState();
    const duration = Math.round(store.totalSeconds / 60);
    logFocusSession(duration, store.mode, store.activeTaskId || undefined, store.activeTaskTitle || undefined);
    resetTimer();
  };

  return (
    <div className="flex items-center justify-center gap-4 py-2">
      {/* Reset Button */}
      <button
        onClick={() => {
          soundEngine.playClickSound();
          resetTimer();
        }}
        title="Reset Timer (R)"
        className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all hover:scale-105"
      >
        <RotateCcw className="w-5 h-5" />
      </button>

      {/* Primary Start/Pause Button */}
      {isRunning ? (
        <button
          onClick={pauseTimer}
          title="Pause Timer (Space)"
          className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-base shadow-xl shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
        >
          <Pause className="w-6 h-6 fill-current" />
          <span>Pause</span>
          <kbd className="text-[10px] font-mono bg-amber-600/40 text-amber-950 px-1.5 py-0.5 rounded">Space</kbd>
        </button>
      ) : (
        <button
          onClick={startTimer}
          title="Start Focus Timer (Space)"
          className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-base shadow-xl shadow-purple-600/30 transition-all hover:scale-105 active:scale-95 glow-primary"
        >
          <Play className="w-6 h-6 fill-current" />
          <span>Start Focus</span>
          <kbd className="text-[10px] font-mono bg-purple-800/60 px-1.5 py-0.5 rounded">Space</kbd>
        </button>
      )}

      {/* Complete Early Session */}
      <button
        onClick={handleCompleteEarly}
        title="Complete Session Early & Record Logs"
        className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all hover:scale-105"
      >
        <FastForward className="w-5 h-5 text-emerald-400" />
      </button>

      {/* Enter Focus Mode Button */}
      <button
        onClick={() => {
          soundEngine.playClickSound();
          navigate('/focus');
        }}
        title="Fullscreen Distraction-Free Focus Mode (F)"
        className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all hover:scale-105"
      >
        <Maximize2 className="w-5 h-5 text-purple-400" />
      </button>
    </div>
  );
};

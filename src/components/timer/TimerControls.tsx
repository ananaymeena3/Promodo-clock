import React from 'react';
import { Play, Pause, RotateCcw, Maximize2, FastForward } from 'lucide-react';
import { useTimerStore } from '../../store/useTimerStore';
import { useAppStore } from '../../store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { soundEngine } from '../../services/soundGenerator';

export const TimerControls: React.FC = () => {
  const navigate = useNavigate();
  const { isRunning, startTimer, pauseTimer, resetTimer } = useTimerStore();
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
        className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-[#A99F96] hover:text-[#F4EFE9] border border-white/10 transition-all hover:scale-105"
      >
        <RotateCcw className="w-5 h-5" />
      </button>

      {/* Primary Start/Pause Button */}
      {isRunning ? (
        <button
          onClick={pauseTimer}
          title="Pause Timer (Space)"
          className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#CDAA7D] hover:bg-[#b59266] text-[#181613] font-bold text-base shadow-xl shadow-[#CDAA7D]/20 transition-all hover:scale-105 active:scale-95 border border-[#CDAA7D]/50"
        >
          <Pause className="w-6 h-6 fill-current" />
          <span>Pause</span>
          <kbd className="text-[10px] font-mono bg-[#181613]/20 px-1.5 py-0.5 rounded text-[#181613]">Space</kbd>
        </button>
      ) : (
        <button
          onClick={startTimer}
          title="Start Focus Timer (Space)"
          className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#6D4C41] hover:bg-[#4E342E] text-[#F5EBDD] font-bold text-base shadow-xl shadow-[#6D4C41]/40 border border-[#CDAA7D]/40 transition-all hover:scale-105 active:scale-95"
        >
          <Play className="w-6 h-6 fill-current" />
          <span>Start Focus</span>
          <kbd className="text-[10px] font-mono bg-[#4E342E] px-1.5 py-0.5 rounded text-[#F5EBDD]">Space</kbd>
        </button>
      )}

      {/* Complete Early Session */}
      <button
        onClick={handleCompleteEarly}
        title="Complete Session Early & Record Logs"
        className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-[#A99F96] hover:text-[#F4EFE9] border border-white/10 transition-all hover:scale-105"
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
        className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-[#A99F96] hover:text-[#F4EFE9] border border-white/10 transition-all hover:scale-105"
      >
        <Maximize2 className="w-5 h-5 text-[#CDAA7D]" />
      </button>
    </div>
  );
};

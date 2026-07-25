import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTimerStore } from '../store/useTimerStore';
import { useTaskStore } from '../store/useTaskStore';
import { useAppStore } from '../store/useAppStore';
import { CircularProgress } from '../components/timer/CircularProgress';
import { TimerControls } from '../components/timer/TimerControls';
import { AmbientScene } from '../components/layout/AmbientScene';
import { Minimize2, CheckSquare, Quote as QuoteIcon, Sparkles } from 'lucide-react';
import { soundEngine } from '../services/soundGenerator';

export const FocusModePage: React.FC = () => {
  const navigate = useNavigate();
  const { secondsLeft, totalSeconds, mode, isRunning, activeTaskId, tick } = useTimerStore();
  const { tasks } = useTaskStore();
  const { currentQuote, studyRooms, activeRoomId } = useAppStore();

  const activeTask = tasks.find((t) => t.id === activeTaskId);
  const activeRoom = studyRooms.find((r) => r.id === activeRoomId) || studyRooms[0];

  // Interval ticker
  useEffect(() => {
    let interval: any = null;
    if (isRunning) {
      interval = setInterval(() => {
        tick();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, tick]);

  // Press Esc or F to exit focus mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'f' || e.key === 'F') {
        soundEngine.playClickSound();
        navigate('/timer');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <div className="fixed inset-0 z-50 bg-transparent text-[#F4EFE9] flex flex-col items-center justify-between p-8 select-none overflow-hidden">
      {/* Active Sanctuary Ambient Canvas Background (Rain, Dust, Lighting, Wallpaper) */}
      <AmbientScene />

      {/* Top Header: Current Task, Sanctuary Room Name & Exit button */}
      <div className="w-full max-w-4xl flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#211C18]/80 backdrop-blur-xl px-4 py-2 rounded-2xl border border-[#CDAA7D]/30 shadow-xl">
            <CheckSquare className="w-4 h-4 text-[#CDAA7D]" />
            <span className="text-xs sm:text-sm font-semibold text-[#F4EFE9]">
              {activeTask ? activeTask.title : 'General Deep Focus Sprint'}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 bg-[#CDAA7D]/10 px-3 py-2 rounded-2xl border border-[#CDAA7D]/20 text-xs text-[#CDAA7D] font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{activeRoom.name}</span>
          </div>
        </div>

        <button
          onClick={() => {
            soundEngine.playClickSound();
            navigate('/timer');
          }}
          className="flex items-center gap-2 bg-[#211C18]/80 hover:bg-[#211C18] text-[#A99F96] hover:text-[#F4EFE9] px-4 py-2 rounded-2xl text-xs font-semibold border border-white/10 transition-all shadow-xl backdrop-blur-xl"
        >
          <Minimize2 className="w-4 h-4 text-[#CDAA7D]" />
          <span>Exit Focus Mode</span>
          <kbd className="text-[9px] font-mono bg-[#181613] px-1.5 py-0.5 rounded text-[#CDAA7D] border border-white/10">
            Esc / F
          </kbd>
        </button>
      </div>

      {/* Center Main Timer Card */}
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-[#CDAA7D]/30 shadow-2xl relative z-10 my-auto flex flex-col items-center justify-center backdrop-blur-2xl bg-[#181613]/85 scale-110">
        <CircularProgress
          secondsLeft={secondsLeft}
          totalSeconds={totalSeconds}
          mode={mode}
          isRunning={isRunning}
        />
        <div className="mt-8">
          <TimerControls />
        </div>
      </div>

      {/* Bottom Motivational Quote */}
      <div className="w-full max-w-2xl text-center z-10 glass-panel p-4 rounded-2xl border border-white/10 backdrop-blur-2xl bg-[#181613]/80">
        <p className="text-xs italic text-[#F4EFE9] font-serif">"{currentQuote.quote}"</p>
        <p className="text-[11px] font-semibold text-[#CDAA7D] mt-1">— {currentQuote.author}</p>
      </div>
    </div>
  );
};

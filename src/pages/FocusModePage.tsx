import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTimerStore } from '../store/useTimerStore';
import { useTaskStore } from '../store/useTaskStore';
import { useAppStore } from '../store/useAppStore';
import { CircularProgress } from '../components/timer/CircularProgress';
import { TimerControls } from '../components/timer/TimerControls';
import { Minimize2, CheckSquare, Quote as QuoteIcon, Sparkles } from 'lucide-react';
import { soundEngine } from '../services/soundGenerator';

export const FocusModePage: React.FC = () => {
  const navigate = useNavigate();
  const { secondsLeft, totalSeconds, mode, isRunning, activeTaskId, tick } = useTimerStore();
  const { tasks } = useTaskStore();
  const { currentQuote } = useAppStore();

  const activeTask = tasks.find((t) => t.id === activeTaskId);

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
    <div className="fixed inset-0 z-50 bg-[#050608] text-white flex flex-col items-center justify-between p-8 select-none overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header: Current Task & Exit button */}
      <div className="w-full max-w-4xl flex items-center justify-between z-10">
        <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
          <CheckSquare className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-semibold text-slate-200">
            {activeTask ? activeTask.title : 'General Deep Work Session'}
          </span>
        </div>

        <button
          onClick={() => {
            soundEngine.playClickSound();
            navigate('/timer');
          }}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white px-4 py-2 rounded-2xl text-xs font-semibold border border-white/10 transition-all"
        >
          <Minimize2 className="w-4 h-4" />
          <span>Exit Focus Mode</span>
          <kbd className="text-[9px] font-mono bg-slate-800 px-1 py-0.5 rounded text-slate-400">Esc / F</kbd>
        </button>
      </div>

      {/* Center Main Timer */}
      <div className="flex flex-col items-center justify-center z-10 my-auto scale-110">
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
      <div className="w-full max-w-2xl text-center z-10 bg-white/5 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
        <p className="text-xs italic text-slate-300 font-serif">"{currentQuote.quote}"</p>
        <p className="text-[11px] font-semibold text-purple-400 mt-1">— {currentQuote.author}</p>
      </div>
    </div>
  );
};

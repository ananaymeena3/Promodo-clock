import React, { useEffect } from 'react';
import { useTimerStore } from '../../store/useTimerStore';
import { useTaskStore } from '../../store/useTaskStore';
import { useAppStore } from '../../store/useAppStore';
import { CircularProgress } from './CircularProgress';
import { TimerControls } from './TimerControls';
import { PresetsBar } from './PresetsBar';
import { TimerMode } from '../../types';
import { CheckSquare, Quote as QuoteIcon, RefreshCw, Sliders, Sparkles } from 'lucide-react';
import { soundEngine } from '../../services/soundGenerator';

export const PomodoroTimer: React.FC = () => {
  const {
    mode,
    secondsLeft,
    totalSeconds,
    isRunning,
    activeTaskId,
    setMode,
    tick,
    setCustomDuration,
    customMinutes,
    setActiveTask,
  } = useTimerStore();

  const { tasks } = useTaskStore();
  const { currentQuote, refreshQuote } = useAppStore();

  // Tick timer interval
  useEffect(() => {
    let interval: any = null;
    if (isRunning) {
      interval = setInterval(() => {
        tick();
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, tick]);

  const activeTask = tasks.find((t) => t.id === activeTaskId);

  const MODES: { id: TimerMode; label: string }[] = [
    { id: 'pomodoro', label: 'Pomodoro (25m)' },
    { id: 'shortBreak', label: 'Short Break (5m)' },
    { id: 'longBreak', label: 'Long Break (15m)' },
    { id: 'custom', label: 'Custom' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 py-4">
      {/* Top Mode Selector Tabs */}
      <div className="flex items-center justify-center">
        <div className="glass-panel p-1.5 rounded-2xl flex items-center gap-1 border border-[#CDAA7D]/20 shadow-xl">
          {MODES.map((m) => {
            const isActive = mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  soundEngine.playClickSound();
                  setMode(m.id);
                }}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#6D4C41] to-[#CDAA7D] text-[#F5EBDD] shadow-lg shadow-[#CDAA7D]/20 border border-[#CDAA7D]/30'
                    : 'text-[#A99F96] hover:text-[#F4EFE9] hover:bg-white/5'
                }`}
              >
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Duration Slider when Mode === 'custom' */}
      {mode === 'custom' && (
        <div className="glass-panel p-4 rounded-2xl border border-[#CDAA7D]/20 max-w-md mx-auto space-y-2 text-center animate-fade-in">
          <div className="flex justify-between items-center text-xs text-[#F4EFE9]">
            <span className="font-semibold flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-[#CDAA7D]" /> Custom Duration
            </span>
            <span className="font-mono text-[#CDAA7D] font-bold">{customMinutes} Minutes</span>
          </div>
          <input
            type="range"
            min="1"
            max="180"
            value={customMinutes}
            onChange={(e) => setCustomDuration(parseInt(e.target.value))}
            className="w-full h-2 bg-[#181613] rounded-lg appearance-none cursor-pointer accent-[#CDAA7D]"
          />
          <div className="flex justify-between text-[10px] text-[#A99F96] font-mono">
            <span>1 Min</span>
            <span>60 Min</span>
            <span>180 Min</span>
          </div>
        </div>
      )}

      {/* Main Circular Timer Display Card */}
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-[#CDAA7D]/20 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center">
        {/* Subtle background ambient blur */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#CDAA7D]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#6D4C41]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Circular SVG Ring */}
        <CircularProgress
          secondsLeft={secondsLeft}
          totalSeconds={totalSeconds}
          mode={mode}
          isRunning={isRunning}
        />

        {/* Timer Action Buttons */}
        <div className="mt-8">
          <TimerControls />
        </div>

        {/* Linked Active Task Picker */}
        <div className="mt-8 w-full max-w-md pt-4 border-t border-white/5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-[#A99F96]">
            <CheckSquare className="w-4 h-4 text-[#CDAA7D]" />
            <span>Active Task:</span>
          </div>

          <select
            value={activeTaskId || ''}
            onChange={(e) => {
              const selected = tasks.find((t) => t.id === e.target.value) || null;
              setActiveTask(selected);
            }}
            className="bg-[#181613] text-[#F4EFE9] border border-white/10 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#CDAA7D] max-w-[220px] truncate"
          >
            <option value="">-- Select a Task --</option>
            {tasks
              .filter((t) => t.status !== 'completed')
              .map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.completedPomodoros}/{t.estimatedPomodoros} 🍅)
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Timer Presets Bar */}
      <div className="glass-panel p-5 rounded-3xl border border-white/5">
        <PresetsBar />
      </div>

      {/* Motivational Quote Banner */}
      <div className="glass-panel p-5 rounded-3xl border border-white/5 flex items-start gap-4 relative">
        <div className="p-2.5 rounded-2xl bg-[#CDAA7D]/10 border border-[#CDAA7D]/20 text-[#CDAA7D]">
          <QuoteIcon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm italic text-[#F4EFE9] font-serif">"{currentQuote.quote}"</p>
          <p className="text-xs font-semibold text-[#CDAA7D] mt-1">— {currentQuote.author}</p>
        </div>
        <button
          onClick={() => {
            soundEngine.playClickSound();
            refreshQuote();
          }}
          title="Refresh Quote"
          className="p-2 text-[#A99F96] hover:text-[#F4EFE9] bg-white/5 rounded-xl hover:bg-white/10 border border-white/5 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

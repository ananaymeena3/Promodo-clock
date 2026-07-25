import React, { useEffect } from 'react';
import { useTimerStore } from '../../store/useTimerStore';
import { useTaskStore } from '../../store/useTaskStore';
import { useAppStore } from '../../store/useAppStore';
import { CircularProgress } from './CircularProgress';
import { TimerControls } from './TimerControls';
import { PresetsBar } from './PresetsBar';
import { TimerMode } from '../../types';
import { CheckSquare, Quote as QuoteIcon, RefreshCw, Sliders, Volume2, Sparkles } from 'lucide-react';
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
    autoSwitch,
    toggleAutoSwitch,
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
    { id: 'pomodoro', label: 'Pomodoro' },
    { id: 'shortBreak', label: 'Short Break' },
    { id: 'longBreak', label: 'Long Break' },
    { id: 'custom', label: 'Custom' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Mode Selector Tabs */}
      <div className="flex items-center justify-center">
        <div className="glass-panel p-1.5 rounded-2xl flex items-center gap-1 border border-white/10 shadow-xl">
          {MODES.map((m) => {
            const isActive = mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  soundEngine.playClickSound();
                  setMode(m.id);
                }}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
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
        <div className="glass-panel p-4 rounded-2xl border border-white/10 max-w-md mx-auto space-y-2 text-center animate-fade-in">
          <div className="flex justify-between items-center text-xs text-slate-300">
            <span className="font-semibold flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-purple-400" /> Custom Duration
            </span>
            <span className="font-mono text-purple-300 font-bold">{customMinutes} Minutes</span>
          </div>
          <input
            type="range"
            min="1"
            max="180"
            value={customMinutes}
            onChange={(e) => setCustomDuration(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>1 Min</span>
            <span>60 Min</span>
            <span>180 Min</span>
          </div>
        </div>
      )}

      {/* Main Circular Timer Display Card */}
      <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center">
        {/* Subtle background ambient blur */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Circular SVG Ring */}
        <CircularProgress
          secondsLeft={secondsLeft}
          totalSeconds={totalSeconds}
          mode={mode}
          isRunning={isRunning}
        />

        {/* Timer Action Buttons */}
        <div className="mt-6">
          <TimerControls />
        </div>

        {/* Linked Active Task Picker */}
        <div className="mt-6 w-full max-w-md pt-4 border-t border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <CheckSquare className="w-4 h-4 text-purple-400" />
            <span>Active Task:</span>
          </div>

          <select
            value={activeTaskId || ''}
            onChange={(e) => {
              const selected = tasks.find((t) => t.id === e.target.value) || null;
              setActiveTask(selected);
            }}
            className="bg-slate-900/80 text-slate-200 border border-white/10 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-purple-500 max-w-[220px] truncate"
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
      <div className="glass-panel p-5 rounded-3xl border border-white/10">
        <PresetsBar />
      </div>

      {/* Motivational Quote Banner */}
      <div className="glass-panel p-5 rounded-3xl border border-white/10 flex items-start gap-4 relative">
        <div className="p-2.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
          <QuoteIcon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm italic text-slate-200 font-serif">"{currentQuote.quote}"</p>
          <p className="text-xs font-semibold text-purple-400 mt-1">— {currentQuote.author}</p>
        </div>
        <button
          onClick={() => {
            soundEngine.playClickSound();
            refreshQuote();
          }}
          title="Refresh Quote"
          className="p-2 text-slate-400 hover:text-white bg-white/5 rounded-xl hover:bg-white/10 border border-white/5 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

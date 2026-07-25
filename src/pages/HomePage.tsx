import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { useTimerStore } from '../store/useTimerStore';
import { useTaskStore } from '../store/useTaskStore';
import { SanctuaryDecor } from '../types';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Coffee,
  Quote as QuoteIcon,
  BookOpen,
} from 'lucide-react';
import { soundEngine } from '../services/soundGenerator';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentQuote, refreshQuote, sanctuaryDecor } = useAppStore();
  const { isRunning, secondsLeft, startTimer, pauseTimer, resetTimer, mode } = useTimerStore();
  const { addTask } = useTaskStore();

  const [taskInput, setTaskInput] = useState('');
  const [greeting, setGreeting] = useState('Good Evening');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartFocus = () => {
    soundEngine.playClickSound();
    if (taskInput.trim()) {
      addTask({
        title: taskInput,
        status: 'in_progress',
        priority: 'high',
        labels: ['Deep Work'],
        colorTag: '#CDAA7D',
        estimatedPomodoros: 2,
        completedPomodoros: 0,
        subtasks: [],
      });
    }
    if (!isRunning) startTimer();
    navigate('/focus-timer');
  };

  const unlockedDecorCount = sanctuaryDecor.filter((d: SanctuaryDecor) => d.unlockedAt).length;

  return (
    <div className="w-full max-w-5xl mx-auto min-h-[calc(100vh-100px)] flex flex-col justify-between py-6 space-y-10 relative">
      {/* Top Greeting & Atmosphere Header */}
      <div className="text-center space-y-3 pt-6 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#CDAA7D]/10 border border-[#CDAA7D]/20 text-[#CDAA7D] text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Haven Digital Sanctuary</span>
        </div>
        <h1 className="font-serif-heading text-4xl sm:text-6xl font-extrabold text-[#F4EFE9] tracking-tight">
          {greeting}.
        </h1>
        <p className="text-base text-[#A99F96] font-serif italic max-w-md mx-auto">
          "What are we creating today?"
        </p>
      </div>

      {/* Hero Atmosphere Desk Graphic & Central Pomodoro Focus Block */}
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-[#CDAA7D]/20 shadow-2xl relative overflow-hidden bg-gradient-to-b from-[#211C18]/90 via-[#181613]/95 to-[#0F0E0C]">
        {/* Animated Desk Lamp & Coffee Steam Graphic */}
        <div className="flex items-center justify-between pb-8 mb-8 border-b border-white/5">
          {/* Coffee Cup with Animated Steam */}
          <div className="flex items-center gap-3">
            <div className="relative p-3 rounded-2xl bg-[#4E342E]/40 border border-[#CDAA7D]/20 text-[#CDAA7D]">
              {/* Steam waves */}
              <div className="absolute -top-3 left-3 w-1.5 h-3 bg-[#F5EBDD]/40 rounded-full blur-[1px] animate-steam-1" />
              <div className="absolute -top-4 left-6 w-1.5 h-4 bg-[#F5EBDD]/30 rounded-full blur-[1px] animate-steam-2" />
              <Coffee className="w-6 h-6 text-[#CDAA7D]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#F4EFE9]">Steaming Coffee</p>
              <p className="text-[11px] text-[#A99F96]">Warm brew ready for deep work</p>
            </div>
          </div>

          {/* Unlocked Sanctuary Decor Status */}
          <div className="hidden sm:flex items-center gap-2 bg-[#CDAA7D]/10 px-3.5 py-1.5 rounded-full border border-[#CDAA7D]/20 text-xs text-[#CDAA7D]">
            <BookOpen className="w-4 h-4 text-[#CDAA7D]" />
            <span>{unlockedDecorCount} / {sanctuaryDecor.length} Sanctuary Items Unlocked</span>
          </div>
        </div>

        {/* Task Input Box */}
        <div className="max-w-xl mx-auto space-y-4 text-center">
          <div className="relative">
            <input
              type="text"
              placeholder="What are you working on right now? (e.g., Reading Chapter 4, Writing Essay...)"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              className="w-full glass-input px-5 py-4 rounded-2xl text-sm sm:text-base text-center font-sans shadow-inner placeholder-[#A99F96]/60 border border-[#CDAA7D]/20 focus:border-[#CDAA7D]"
            />
          </div>

          {/* Large Countdown Display */}
          <div className="py-6">
            <div className="text-6xl sm:text-8xl font-mono-num font-extrabold text-[#F4EFE9] tracking-wider drop-shadow-lg">
              {formatTime(secondsLeft)}
            </div>
            <p className="text-xs text-[#A99F96] font-mono uppercase tracking-widest mt-2">
              {mode === 'pomodoro' ? 'Deep Work Sprint (25 Mins)' : 'Resting Break'}
            </p>
          </div>

          {/* Main Action Buttons */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={handleStartFocus}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#6D4C41] hover:bg-[#4E342E] text-[#F5EBDD] font-bold text-base shadow-xl shadow-[#6D4C41]/40 border border-[#CDAA7D]/40 transition-all hover:scale-105"
            >
              {isRunning ? <Pause className="w-5 h-5 fill-[#F5EBDD]" /> : <Play className="w-5 h-5 fill-[#F5EBDD]" />}
              <span>{isRunning ? 'Pause Sanctuary Sprint' : 'Start Focus Session'}</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClickSound();
                resetTimer();
              }}
              title="Reset Timer"
              className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-[#A99F96] hover:text-[#F4EFE9] border border-white/10 transition-all"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quote Section Underneath */}
      <div className="glass-panel p-6 rounded-3xl border border-white/5 text-center relative max-w-3xl mx-auto w-full space-y-2">
        <QuoteIcon className="w-6 h-6 text-[#CDAA7D]/40 mx-auto" />
        <p className="font-serif text-base text-[#F4EFE9] italic max-w-xl mx-auto leading-relaxed">
          "{currentQuote.quote}"
        </p>
        <p className="text-xs font-mono text-[#CDAA7D]">— {currentQuote.author}</p>

        <button
          onClick={() => {
            soundEngine.playClickSound();
            refreshQuote();
          }}
          className="text-[11px] text-[#A99F96] hover:text-[#CDAA7D] pt-2 transition-colors block mx-auto"
        >
          ↻ New Focus Reflection
        </button>
      </div>
    </div>
  );
};

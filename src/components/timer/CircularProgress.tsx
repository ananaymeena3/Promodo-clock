import React from 'react';
import { motion } from 'framer-motion';

interface CircularProgressProps {
  secondsLeft: number;
  totalSeconds: number;
  mode: string;
  isRunning: boolean;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  secondsLeft,
  totalSeconds,
  mode,
  isRunning,
}) => {
  const size = 320;
  const strokeWidth = 12;
  const center = size / 2;
  const radius = center - strokeWidth * 2;
  const circumference = 2 * Math.PI * radius;

  const progress = totalSeconds > 0 ? (totalSeconds - secondsLeft) / totalSeconds : 0;
  const strokeDashoffset = circumference - progress * circumference;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const getModeColor = () => {
    switch (mode) {
      case 'shortBreak':
        return { stroke: '#10b981', gradientId: 'breakGradient', textClass: 'text-emerald-400' };
      case 'longBreak':
        return { stroke: '#06b6d4', gradientId: 'longBreakGradient', textClass: 'text-cyan-400' };
      case 'custom':
        return { stroke: '#f59e0b', gradientId: 'customGradient', textClass: 'text-amber-400' };
      default:
        return { stroke: '#8b5cf6', gradientId: 'pomodoroGradient', textClass: 'text-purple-400' };
    }
  };

  const modeTheme = getModeColor();

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      <svg width={size} height={size} className="transform -rotate-90 drop-shadow-2xl">
        <defs>
          <linearGradient id="pomodoroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c4b5fd" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#6d28d9" />
          </linearGradient>
          <linearGradient id="breakGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6ee7b7" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="longBreakGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>
          <linearGradient id="customGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>

        {/* Background Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth={strokeWidth}
        />

        {/* Progress Ring */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke={`url(#${modeTheme.gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          animate={{ strokeDashoffset }}
          transition={{ ease: 'linear', duration: 0.5 }}
          strokeLinecap="round"
        />
      </svg>

      {/* Countdown Center Display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <motion.h1
          key={formattedTime}
          initial={{ scale: 0.98 }}
          animate={{ scale: 1 }}
          className="text-6xl font-extrabold tracking-tight font-mono text-white drop-shadow-lg"
        >
          {formattedTime}
        </motion.h1>
        
        <p className={`text-xs font-semibold uppercase tracking-widest mt-2 ${modeTheme.textClass}`}>
          {mode === 'pomodoro' ? 'Focus Session' : mode === 'shortBreak' ? 'Short Break' : mode === 'longBreak' ? 'Long Break' : 'Custom Session'}
        </p>

        {isRunning && (
          <div className="flex items-center gap-1.5 mt-3 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] text-slate-300 font-mono">FLOW ACTIVE</span>
          </div>
        )}
      </div>
    </div>
  );
};

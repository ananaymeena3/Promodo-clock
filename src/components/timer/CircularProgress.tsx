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
        return { stroke: '#35543A', gradientId: 'breakGradient', textClass: 'text-emerald-400' };
      case 'longBreak':
        return { stroke: '#4E342E', gradientId: 'longBreakGradient', textClass: 'text-[#CDAA7D]' };
      case 'custom':
        return { stroke: '#CDAA7D', gradientId: 'customGradient', textClass: 'text-[#CDAA7D]' };
      default:
        return { stroke: '#6D4C41', gradientId: 'pomodoroGradient', textClass: 'text-[#CDAA7D]' };
    }
  };

  const modeTheme = getModeColor();

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      <svg width={size} height={size} className="transform -rotate-90 drop-shadow-2xl">
        <defs>
          <linearGradient id="pomodoroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5EBDD" />
            <stop offset="50%" stopColor="#CDAA7D" />
            <stop offset="100%" stopColor="#6D4C41" />
          </linearGradient>
          <linearGradient id="breakGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#35543A" />
          </linearGradient>
          <linearGradient id="longBreakGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#CDAA7D" />
            <stop offset="100%" stopColor="#4E342E" />
          </linearGradient>
          <linearGradient id="customGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5EBDD" />
            <stop offset="100%" stopColor="#CDAA7D" />
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
          className="text-6xl font-extrabold tracking-wider font-mono-num text-[#F4EFE9] drop-shadow-lg"
        >
          {formattedTime}
        </motion.h1>

        <p className={`text-xs font-mono uppercase tracking-widest mt-2 ${modeTheme.textClass}`}>
          {mode === 'pomodoro' ? 'Focus Session' : mode === 'shortBreak' ? 'Short Break' : mode === 'longBreak' ? 'Long Break' : 'Custom Session'}
        </p>

        {isRunning && (
          <div className="flex items-center gap-1.5 mt-3 bg-[#CDAA7D]/15 px-3 py-0.5 rounded-full border border-[#CDAA7D]/30">
            <span className="w-2 h-2 rounded-full bg-[#CDAA7D] animate-ping" />
            <span className="text-[10px] text-[#F5EBDD] font-mono">FLOW ACTIVE</span>
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { Clock, Brain, Zap, GraduationCap, Code } from 'lucide-react';
import { useTimerStore, TIMER_PRESETS } from '../../store/useTimerStore';
import { soundEngine } from '../../services/soundGenerator';

const ICON_MAP: Record<string, any> = {
  Clock,
  Brain,
  Zap,
  GraduationCap,
  Code,
};

export const PresetsBar: React.FC = () => {
  const { activePresetId, setPreset } = useTimerStore();

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#A99F96]">Timer Presets</h3>
        <span className="text-[11px] text-[#CDAA7D] font-mono">1-click configuration</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {TIMER_PRESETS.map((p) => {
          const Icon = ICON_MAP[p.iconName] || Clock;
          const isSelected = activePresetId === p.id;
          return (
            <button
              key={p.id}
              onClick={() => {
                soundEngine.playClickSound();
                setPreset(p.id);
              }}
              className={`p-3 rounded-2xl border text-left transition-all group ${
                isSelected
                  ? 'bg-gradient-to-br from-[#6D4C41]/40 to-[#CDAA7D]/20 border-[#CDAA7D]/40 shadow-lg text-[#F5EBDD]'
                  : 'bg-white/5 border-white/5 text-[#A99F96] hover:text-[#F4EFE9] hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-4 h-4 ${isSelected ? 'text-[#CDAA7D]' : 'text-[#A99F96] group-hover:text-[#F4EFE9]'}`} />
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/10 text-[#CDAA7D]">
                  {p.pomodoro}/{p.shortBreak}m
                </span>
              </div>
              <p className="text-xs font-bold text-[#F4EFE9] truncate">{p.name}</p>
              <p className="text-[10px] text-[#A99F96] truncate mt-0.5">{p.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

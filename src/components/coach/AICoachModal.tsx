import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useTaskStore } from '../../store/useTaskStore';
import { useHabitStore } from '../../store/useHabitStore';
import { generateAICoachReport } from '../../services/aiCoachService';
import { AICoachReport } from '../../types';
import { Sparkles, X, Brain, Zap, Clock, ShieldCheck, CheckCircle, RefreshCw } from 'lucide-react';
import { soundEngine } from '../../services/soundGenerator';

export const AICoachModal: React.FC = () => {
  const { isAICoachOpen, toggleAICoachModal, sessions, streaks } = useAppStore();
  const { tasks } = useTaskStore();
  const { habits } = useHabitStore();

  const [report, setReport] = useState<AICoachReport | null>(null);

  const handleRefreshReport = () => {
    soundEngine.playClickSound();
    const rep = generateAICoachReport(sessions, tasks, habits, streaks.dailyStreak);
    setReport(rep);
  };

  useEffect(() => {
    if (isAICoachOpen) {
      handleRefreshReport();
    }
  }, [isAICoachOpen]);

  if (!isAICoachOpen || !report) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg">
      <div className="glass-panel w-full max-w-2xl rounded-3xl border border-[#CDAA7D]/30 shadow-2xl p-6 relative animate-fade-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#CDAA7D]/10 border border-[#CDAA7D]/30 text-[#CDAA7D]">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-serif-heading text-lg font-bold text-[#F4EFE9] flex items-center gap-2">
                <span>AI Productivity Coach</span>
                <span className="text-[10px] font-mono bg-[#CDAA7D]/20 text-[#CDAA7D] px-2 py-0.5 rounded-full border border-[#CDAA7D]/30">
                  REAL-TIME ANALYTICS
                </span>
              </h3>
              <p className="text-xs text-[#A99F96]">Automated cognitive flow analysis & task optimization.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefreshReport}
              title="Re-analyze Productivity Data"
              className="p-2 rounded-xl text-[#A99F96] hover:text-[#F4EFE9] bg-white/5 border border-white/10"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={toggleAICoachModal}
              className="p-2 rounded-xl text-[#A99F96] hover:text-[#F4EFE9] bg-white/5 border border-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="space-y-6 pt-6">
          {/* Productivity Score Gauge */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-r from-[#CDAA7D]/10 via-[#6D4C41]/20 to-[#35543A]/20">
            <div className="text-center sm:text-left">
              <span className="text-xs font-mono uppercase tracking-wider text-[#CDAA7D]">Flow Score</span>
              <h2 className="text-4xl font-extrabold text-[#F4EFE9] font-mono mt-1">{report.productivityScore} / 100</h2>
              <p className="text-xs text-[#A99F96] mt-1 max-w-xs">
                {report.productivityScore >= 80
                  ? '🌟 Peak Flow State achieved today!'
                  : '⚡ Good momentum! Keep pushing focused blocks.'}
              </p>
            </div>

            {/* Visual Circular Gauge */}
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="38" fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                <circle
                  cx="48"
                  cy="48"
                  r="38"
                  fill="transparent"
                  stroke="#CDAA7D"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 38}
                  strokeDashoffset={2 * Math.PI * 38 * (1 - report.productivityScore / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <Zap className="w-6 h-6 text-[#CDAA7D] absolute" />
            </div>
          </div>

          {/* Daily Summary */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#A99F96] flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-[#CDAA7D]" /> Daily Summary
            </h4>
            <div className="glass-panel p-4 rounded-2xl border border-white/10 text-xs text-[#F4EFE9] leading-relaxed">
              {report.dailySummary}
            </div>
          </div>

          {/* Key Insights List */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#A99F96] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Weekly Insights & Patterns
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {report.weeklyInsights.map((ins: string, idx: number) => (
                <div key={idx} className="bg-white/5 p-3 rounded-2xl border border-white/5 text-xs text-[#A99F96] flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{ins}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Best Study Time & Break Advice */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-panel p-4 rounded-2xl border border-white/10">
              <h5 className="text-xs font-bold text-[#CDAA7D] flex items-center gap-1.5 mb-1">
                <Clock className="w-4 h-4 text-[#CDAA7D]" /> Best Peak Energy Time
              </h5>
              <p className="text-xs text-[#F4EFE9] font-mono">{report.bestStudyTime}</p>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-white/10">
              <h5 className="text-xs font-bold text-sky-300 flex items-center gap-1.5 mb-1">
                <Zap className="w-4 h-4 text-sky-400" /> Recommended Break Interval
              </h5>
              <p className="text-xs text-[#A99F96]">{report.breakRecommendation}</p>
            </div>
          </div>

          {/* Task Prioritization Recommendations */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#A99F96]">Task Prioritization Engine</h4>
            <div className="space-y-2">
              {report.taskPrioritization.map((rec: string, idx: number) => (
                <div key={idx} className="bg-[#6D4C41]/20 border border-[#CDAA7D]/30 p-3 rounded-2xl text-xs text-[#F5EBDD]">
                  {rec}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

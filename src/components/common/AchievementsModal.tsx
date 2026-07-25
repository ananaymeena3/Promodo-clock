import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { X, Award, Zap, Compass, Crown, Flame, Lock } from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  Zap,
  Compass,
  Award,
  Crown,
  Flame,
};

export const AchievementsModal: React.FC = () => {
  const { isAchievementsOpen, toggleAchievementsModal, achievements, streaks } = useAppStore();

  if (!isAchievementsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="glass-panel w-full max-w-lg rounded-3xl border border-white/10 shadow-2xl p-6 relative animate-fade-in">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-400" />
            <div>
              <h3 className="text-lg font-extrabold text-white">Achievements & Badges</h3>
              <p className="text-xs text-slate-400">Unlock level rewards by completing Pomodoro sessions</p>
            </div>
          </div>
          <button onClick={toggleAchievementsModal} className="p-1 rounded-xl text-slate-400 hover:text-white bg-white/5">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Total stats progress */}
        <div className="py-4 border-b border-white/10 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Total Completed Sessions</p>
            <h4 className="text-2xl font-extrabold font-mono text-purple-400">{streaks.totalSessions} Sessions</h4>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">Level Rank</p>
            <h4 className="text-base font-bold text-amber-300">Level 4 Master</h4>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="space-y-3 pt-4 max-h-80 overflow-y-auto pr-1">
          {achievements.map((ach) => {
            const Icon = ICON_MAP[ach.icon] || Award;
            const isUnlocked = Boolean(ach.unlockedAt);
            const progress = Math.min(100, (streaks.totalSessions / ach.requiredSessions) * 100);

            return (
              <div
                key={ach.id}
                className={`p-3.5 rounded-2xl border flex items-center gap-4 transition-all ${
                  isUnlocked
                    ? 'bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border-purple-500/40 text-white'
                    : 'bg-white/5 border-white/5 text-slate-500 opacity-60'
                }`}
              >
                <div
                  className={`p-3 rounded-2xl border ${
                    isUnlocked ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-slate-800 border-slate-700 text-slate-600'
                  }`}
                >
                  {isUnlocked ? <Icon className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-bold text-white">{ach.title}</h5>
                    <span className="text-[10px] font-mono text-slate-400">
                      {streaks.totalSessions}/{ach.requiredSessions}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{ach.description}</p>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${isUnlocked ? 'bg-amber-400' : 'bg-slate-600'}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

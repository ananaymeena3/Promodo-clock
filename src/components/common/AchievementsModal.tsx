import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { X, BookOpen, Flower2, Lamp, Coffee, Compass, Cat, Lock, CheckCircle2, Sparkles, Award } from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  BookOpen,
  Flower2,
  Lamp,
  Coffee,
  Compass,
  Cat,
};

export const AchievementsModal: React.FC = () => {
  const { isAchievementsOpen, toggleAchievementsModal, sanctuaryDecor, streaks } = useAppStore();

  if (!isAchievementsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-xl rounded-3xl border border-[#CDAA7D]/30 shadow-2xl p-6 sm:p-8 relative animate-fade-in">
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#CDAA7D]/10 text-[#CDAA7D] border border-[#CDAA7D]/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-heading text-xl font-bold text-[#F4EFE9]">Sanctuary Decor & Unlocks</h3>
              <p className="text-xs text-[#A99F96]">Earn books, desk plants, lamps & cats through deep focus</p>
            </div>
          </div>
          <button onClick={toggleAchievementsModal} className="p-2 rounded-xl text-[#A99F96] hover:text-[#F4EFE9] bg-white/5">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stats banner */}
        <div className="py-4 border-b border-white/5 flex items-center justify-between">
          <div>
            <p className="text-xs text-[#A99F96]">Total Completed Sessions</p>
            <h4 className="text-2xl font-mono-num font-extrabold text-[#CDAA7D]">{streaks.totalSessions} Sessions</h4>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#A99F96]">Sanctuary Items Unlocked</p>
            <h4 className="text-base font-bold text-[#F5EBDD]">
              {sanctuaryDecor.filter((d) => streaks.totalSessions >= d.requiredSessions).length} / {sanctuaryDecor.length}
            </h4>
          </div>
        </div>

        {/* Decor Items Grid */}
        <div className="space-y-3 pt-4 max-h-96 overflow-y-auto pr-1">
          {sanctuaryDecor.map((item) => {
            const Icon = ICON_MAP[item.icon] || Award;
            const isUnlocked = streaks.totalSessions >= item.requiredSessions;
            const progress = Math.min(100, (streaks.totalSessions / item.requiredSessions) * 100);

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${
                  isUnlocked
                    ? 'bg-[#211C18]/90 border-[#CDAA7D]/40 text-[#F4EFE9]'
                    : 'bg-white/5 border-white/5 text-[#A99F96] opacity-60'
                }`}
              >
                <div
                  className={`p-3 rounded-2xl border ${
                    isUnlocked ? 'bg-[#CDAA7D]/20 border-[#CDAA7D]/40 text-[#CDAA7D]' : 'bg-[#181613] border-white/5 text-[#A99F96]'
                  }`}
                >
                  {isUnlocked ? <Icon className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className="font-serif-heading text-sm font-bold text-[#F4EFE9]">{item.title}</h5>
                    <span className="text-[10px] font-mono text-[#CDAA7D]">
                      {streaks.totalSessions}/{item.requiredSessions} Sessions
                    </span>
                  </div>
                  <p className="text-xs text-[#A99F96] mt-0.5">{item.description}</p>

                  <div className="w-full bg-[#181613] h-1.5 rounded-full mt-2 overflow-hidden border border-white/5">
                    <div
                      className={`h-full transition-all duration-500 ${isUnlocked ? 'bg-[#CDAA7D]' : 'bg-[#6D4C41]'}`}
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

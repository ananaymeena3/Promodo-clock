import React, { useState } from 'react';
import { useHabitStore } from '../store/useHabitStore';
import { useMilestoneStore } from '../store/useMilestoneStore';
import { Habit, ExamCountdown } from '../types';
import {
  Calendar,
  Clock,
  CheckCircle2,
  CalendarHeart,
  Plus,
  Trash2,
} from 'lucide-react';
import { soundEngine } from '../services/soundGenerator';
import toast from 'react-hot-toast';

export const PlannerPage: React.FC = () => {
  const { habits, deleteHabit, toggleHabitCheckIn } = useHabitStore();
  const { exams, addExam, deleteExam } = useMilestoneStore();

  const [newExamTitle, setNewExamTitle] = useState('');
  const [newExamDate, setNewExamDate] = useState('');
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);

  const handleAddExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExamTitle.trim() || !newExamDate) return;
    soundEngine.playClickSound();
    addExam({
      title: newExamTitle,
      subject: 'Study Milestone',
      date: newExamDate,
      targetPomodoros: 15,
    });
    toast.success('Exam Milestone Added');
    setNewExamTitle('');
    setNewExamDate('');
    setIsExamModalOpen(false);
  };

  const calculateDaysLeft = (targetDateStr: string) => {
    const diff = new Date(targetDateStr).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 3600 * 24)));
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CDAA7D]/10 text-[#CDAA7D] text-xs font-mono mb-2">
          <Calendar className="w-3.5 h-3.5" />
          <span>Sanctuary Calendar & Planner</span>
        </div>
        <h2 className="font-serif-heading text-3xl sm:text-4xl font-extrabold text-[#F4EFE9]">
          Exam Countdowns & Habit Tracking
        </h2>
        <p className="text-xs sm:text-sm text-[#A99F96] mt-1">
          Prepare for major milestones with countdown timers and track your atomic daily habits.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Exam Countdowns Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-heading text-xl font-bold text-[#F4EFE9] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#CDAA7D]" /> Upcoming Milestone Countdowns
            </h3>
            <button
              onClick={() => {
                soundEngine.playClickSound();
                setIsExamModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#6D4C41] hover:bg-[#4E342E] text-[#F5EBDD] text-xs font-bold shadow-lg border border-[#CDAA7D]/30"
            >
              <Plus className="w-4 h-4" />
              <span>Add Exam</span>
            </button>
          </div>

          {exams.length === 0 ? (
            <div className="glass-panel p-8 rounded-3xl border border-[#CDAA7D]/20 text-center space-y-2">
              <p className="text-sm font-bold text-[#F4EFE9]">No Upcoming Milestones</p>
              <p className="text-xs text-[#A99F96]">Click "Add Exam" to add your custom milestones and deadlines.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exams.map((ex) => {
                const days = calculateDaysLeft(ex.date);
                return (
                  <div key={ex.id} className="glass-panel p-6 rounded-3xl border border-[#CDAA7D]/20 space-y-4 relative overflow-hidden">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono bg-[#CDAA7D]/10 text-[#CDAA7D] px-2.5 py-0.5 rounded-full border border-[#CDAA7D]/20">
                          {ex.subject}
                        </span>
                        <h4 className="font-serif-heading text-lg font-bold text-[#F4EFE9] mt-2">{ex.title}</h4>
                      </div>
                      <button
                        onClick={() => deleteExam(ex.id)}
                        className="p-1 text-[#A99F96] hover:text-red-400 rounded-lg hover:bg-white/5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-baseline gap-2 pt-2 border-t border-white/5">
                      <span className="text-4xl font-mono-num font-extrabold text-[#F4EFE9]">{days}</span>
                      <span className="text-xs text-[#A99F96] font-mono">Days Remaining ({ex.date})</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Habit Tracker Section */}
        <div className="space-y-4">
          <h3 className="font-serif-heading text-lg font-bold text-[#F4EFE9] flex items-center gap-2">
            <CalendarHeart className="w-4 h-4 text-[#CDAA7D]" /> Atomic Sanctuary Habits
          </h3>

          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            {habits.map((h: Habit) => {
              const todayStr = new Date().toISOString().slice(0, 10);
              const isChecked = Boolean(h.history[todayStr]);
              return (
                <div key={h.id} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        soundEngine.playClickSound();
                        toggleHabitCheckIn(h.id, todayStr);
                      }}
                      className={`p-2 rounded-xl border transition-all ${
                        isChecked ? 'bg-[#35543A] text-emerald-300 border-emerald-500/40' : 'bg-white/5 text-[#A99F96] border-white/5'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <div>
                      <h5 className="text-xs font-bold text-[#F4EFE9]">{h.title}</h5>
                      <span className="text-[10px] text-[#A99F96]">{h.category}</span>
                    </div>
                  </div>
                  <button onClick={() => deleteHabit(h.id)} className="text-[#A99F96] hover:text-red-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Exam Modal */}
      {isExamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md p-6 rounded-3xl border border-[#CDAA7D]/30 space-y-4">
            <h3 className="font-serif-heading text-lg font-bold text-[#F4EFE9]">Add Milestone Exam</h3>
            <form onSubmit={handleAddExam} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[#A99F96] mb-1">Exam / Milestone Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master's Thesis Submission"
                  value={newExamTitle}
                  onChange={(e) => setNewExamTitle(e.target.value)}
                  className="w-full glass-input px-4 py-2.5 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-[#A99F96] mb-1">Target Date</label>
                <input
                  type="date"
                  required
                  value={newExamDate}
                  onChange={(e) => setNewExamDate(e.target.value)}
                  className="w-full glass-input px-4 py-2.5 rounded-xl text-xs"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsExamModalOpen(false)} className="px-4 py-2 rounded-xl text-xs text-[#A99F96] bg-white/5">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 rounded-xl text-xs font-bold text-[#181613] bg-[#CDAA7D]">
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

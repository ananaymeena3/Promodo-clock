import React, { useState } from 'react';
import { useHabitStore } from '../../store/useHabitStore';
import { Habit } from '../../types';
import {
  CheckCircle2,
  Plus,
  Trash2,
  CalendarHeart,
  Droplets,
  Dumbbell,
  BookOpen,
  Smile,
  Moon,
  Code,
  Flame,
  X,
} from 'lucide-react';
import { soundEngine } from '../../services/soundGenerator';

const ICON_OPTIONS = [
  { name: 'Droplets', icon: Droplets },
  { name: 'Dumbbell', icon: Dumbbell },
  { name: 'BookOpen', icon: BookOpen },
  { name: 'Smile', icon: Smile },
  { name: 'Moon', icon: Moon },
  { name: 'Code', icon: Code },
];

export const HabitTracker: React.FC = () => {
  const { habits, toggleHabitCheckIn, addHabit, deleteHabit } = useHabitStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Health');
  const [newIcon, setNewIcon] = useState('Droplets');
  const [newColor, setNewColor] = useState('#8b5cf6');

  // Generate last 14 days
  const getLast14Days = () => {
    const days = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'narrow' });
      const dayNum = d.getDate();
      const isToday = i === 0;
      days.push({ dateStr, dayName, dayNum, isToday });
    }
    return days;
  };

  const daysList = getLast14Days();
  const todayStr = new Date().toISOString().slice(0, 10);

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    soundEngine.playClickSound();
    addHabit({
      title: newTitle,
      category: newCategory,
      icon: newIcon,
      color: newColor,
      frequency: 'daily',
    });
    setNewTitle('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <CalendarHeart className="w-6 h-6 text-purple-400" /> Habit Tracker
          </h2>
          <p className="text-xs text-slate-400">Build atomic routines and track daily streaks over time.</p>
        </div>

        <button
          onClick={() => {
            soundEngine.playClickSound();
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-purple-600/30 glow-primary"
        >
          <Plus className="w-4 h-4" />
          <span>Create Habit</span>
        </button>
      </div>

      {/* Habits Grid Table Card */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 overflow-x-auto">
        <table className="w-full text-left min-w-[700px]">
          <thead>
            <tr className="border-b border-white/10 text-slate-400 text-xs uppercase font-semibold">
              <th className="py-3 px-4 w-64">Habit</th>
              <th className="py-3 px-2 text-center">History (Last 14 Days)</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {habits.map((habit) => {
              const checkInCount = Object.keys(habit.history).length;
              return (
                <tr key={habit.id} className="hover:bg-white/5 transition-colors group">
                  {/* Habit Info */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="p-2.5 rounded-2xl text-white shadow-md"
                        style={{ backgroundColor: `${habit.color}25`, border: `1px solid ${habit.color}40` }}
                      >
                        <CheckCircle2 className="w-5 h-5" style={{ color: habit.color }} />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">{habit.title}</h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span>{habit.category}</span>
                          <span>•</span>
                          <span className="text-amber-300 font-mono">🔥 {checkInCount} Check-ins</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* 14 Day Check-In Heatmap Grid */}
                  <td className="py-4 px-2">
                    <div className="flex items-center justify-center gap-1.5">
                      {daysList.map((day) => {
                        const isChecked = Boolean(habit.history[day.dateStr]);
                        return (
                          <button
                            key={day.dateStr}
                            onClick={() => {
                              soundEngine.playClickSound();
                              toggleHabitCheckIn(habit.id, day.dateStr);
                            }}
                            title={`${day.dateStr}: ${isChecked ? 'Completed' : 'Click to check in'}`}
                            className={`w-7 h-10 rounded-xl flex flex-col items-center justify-center transition-all ${
                              isChecked
                                ? 'bg-purple-600 text-white shadow-md scale-105 glow-primary'
                                : day.isToday
                                ? 'bg-white/10 border border-purple-500/50 text-slate-200'
                                : 'bg-white/5 text-slate-500 hover:bg-white/10'
                            }`}
                          >
                            <span className="text-[9px] font-bold uppercase">{day.dayName}</span>
                            <span className="text-[10px] font-mono">{day.dayNum}</span>
                          </button>
                        );
                      })}
                    </div>
                  </td>

                  {/* Delete Action */}
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => {
                        soundEngine.playClickSound();
                        deleteHabit(habit.id);
                      }}
                      className="p-2 text-slate-500 hover:text-red-400 rounded-xl hover:bg-white/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Habit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md rounded-3xl border border-white/10 shadow-2xl p-6 relative animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">Create New Habit</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateHabit} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Habit Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Drink 2L Water, Read 30 Mins"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <input
                  type="text"
                  placeholder="Health, Mindset, Fitness..."
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Accent Color</label>
                <div className="flex gap-2">
                  {['#8b5cf6', '#3b82f6', '#10b981', '#f97316', '#ef4444', '#06b6d4'].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewColor(color)}
                      className={`w-7 h-7 rounded-full transition-all ${
                        newColor === color ? 'ring-2 ring-white scale-110' : 'opacity-70'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-600/30"
                >
                  Save Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

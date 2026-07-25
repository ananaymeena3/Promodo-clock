import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { JournalEntry } from '../types';
import {
  Feather,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { soundEngine } from '../services/soundGenerator';
import toast from 'react-hot-toast';

const MOOD_OPTIONS: { id: JournalEntry['mood']; label: string; emoji: string; colorClass: string }[] = [
  { id: 'peaceful', label: 'Peaceful', emoji: '🌿', colorClass: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
  { id: 'focused', label: 'Deep Flow', emoji: '⚡', colorClass: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
  { id: 'cozy', label: 'Cozy', emoji: '☕', colorClass: 'text-[#CDAA7D] border-[#CDAA7D]/30 bg-[#CDAA7D]/10' },
  { id: 'inspired', label: 'Inspired', emoji: '✨', colorClass: 'text-purple-400 border-purple-500/30 bg-purple-500/10' },
  { id: 'tired', label: 'Unwinding', emoji: '🌙', colorClass: 'text-sky-400 border-sky-500/30 bg-sky-500/10' },
];

export const JournalPage: React.FC = () => {
  const { journalEntries, addJournalEntry, deleteJournalEntry } = useAppStore();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [whatWentWell, setWhatWentWell] = useState('');
  const [distractions, setDistractions] = useState('');
  const [tomorrowPlan, setTomorrowPlan] = useState('');
  const [mood, setMood] = useState<JournalEntry['mood']>('cozy');

  const handleSaveReflection = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playClickSound();
    addJournalEntry({
      date: new Date().toISOString().slice(0, 10),
      title: title.trim() || `Sanctuary Reflection - ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      content,
      whatWentWell,
      distractions,
      tomorrowPlan,
      mood,
    });
    toast.success('Journal Reflection Saved');
    setTitle('');
    setContent('');
    setWhatWentWell('');
    setDistractions('');
    setTomorrowPlan('');
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CDAA7D]/10 text-[#CDAA7D] text-xs font-mono mb-2">
          <Feather className="w-3.5 h-3.5" />
          <span>Mindful Sanctuary Reflection</span>
        </div>
        <h2 className="font-serif-heading text-3xl sm:text-4xl font-extrabold text-[#F4EFE9]">
          Study Reflection & Daily Journal
        </h2>
        <p className="text-xs sm:text-sm text-[#A99F96] mt-1">
          Unwind your mind, capture wins, log distractions, and plan tomorrow in peace.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Reflection Form */}
        <form onSubmit={handleSaveReflection} className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border border-[#CDAA7D]/20 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <h3 className="font-serif-heading text-xl font-bold text-[#F4EFE9]">Today's Reflection</h3>
            <span className="text-xs font-mono text-[#CDAA7D]">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
          </div>

          {/* Mood Selector */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#A99F96] mb-2">Sanctuary Mood</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {MOOD_OPTIONS.map((m) => {
                const isSel = mood === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      soundEngine.playClickSound();
                      setMood(m.id);
                    }}
                    className={`p-2.5 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      isSel ? m.colorClass + ' ring-2 ring-[#CDAA7D]/40 scale-105' : 'bg-white/5 border-white/5 text-[#A99F96] hover:bg-white/10'
                    }`}
                  >
                    <span>{m.emoji}</span>
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#A99F96] mb-1.5">Entry Title</label>
            <input
              type="text"
              placeholder="e.g., Solitary Focus in Oxford Room..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full glass-input px-4 py-3 rounded-2xl text-sm"
            />
          </div>

          {/* Prompt 1: What went well */}
          <div>
            <label className="block text-xs font-semibold text-[#F4EFE9] flex items-center gap-1.5 mb-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> What went well today?
            </label>
            <textarea
              rows={2}
              placeholder="Completed 4 focus sessions, read 30 pages of literature..."
              value={whatWentWell}
              onChange={(e) => setWhatWentWell(e.target.value)}
              className="w-full glass-input px-4 py-3 rounded-2xl text-xs resize-none"
            />
          </div>

          {/* Prompt 2: Distractions */}
          <div>
            <label className="block text-xs font-semibold text-[#F4EFE9] flex items-center gap-1.5 mb-1.5">
              <AlertCircle className="w-4 h-4 text-amber-400" /> Any distractions or mental hurdles?
            </label>
            <textarea
              rows={2}
              placeholder="Checked notifications twice, lost momentum around 3 PM..."
              value={distractions}
              onChange={(e) => setDistractions(e.target.value)}
              className="w-full glass-input px-4 py-3 rounded-2xl text-xs resize-none"
            />
          </div>

          {/* Prompt 3: Tomorrow Plan */}
          <div>
            <label className="block text-xs font-semibold text-[#F4EFE9] flex items-center gap-1.5 mb-1.5">
              <ArrowRight className="w-4 h-4 text-[#CDAA7D]" /> Top priority for tomorrow?
            </label>
            <textarea
              rows={2}
              placeholder="Outline project proposal & 2 Pomodoro study sprints..."
              value={tomorrowPlan}
              onChange={(e) => setTomorrowPlan(e.target.value)}
              className="w-full glass-input px-4 py-3 rounded-2xl text-xs resize-none"
            />
          </div>

          {/* Markdown Content Notes */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#A99F96] mb-1.5">Journal Thoughts (Markdown Supported)</label>
            <textarea
              rows={4}
              placeholder="Write freely here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full glass-input px-4 py-3 rounded-2xl text-xs font-mono leading-relaxed resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-[#6D4C41] hover:bg-[#4E342E] text-[#F5EBDD] font-bold text-sm shadow-xl shadow-[#6D4C41]/30 border border-[#CDAA7D]/30 transition-all"
          >
            Save Journal Reflection
          </button>
        </form>

        {/* Previous Entries List Sidebar */}
        <div className="space-y-4">
          <h3 className="font-serif-heading text-lg font-bold text-[#F4EFE9] flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#CDAA7D]" /> Previous Sanctuary Reflections
          </h3>

          <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
            {journalEntries.length > 0 ? (
              journalEntries.map((entry: JournalEntry) => (
                <div key={entry.id} className="glass-panel p-5 rounded-3xl border border-white/5 space-y-2 group hover:border-[#CDAA7D]/30 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-[#CDAA7D]">{entry.date}</span>
                    <button
                      onClick={() => {
                        soundEngine.playClickSound();
                        deleteJournalEntry(entry.id);
                      }}
                      className="p-1 text-[#A99F96] hover:text-red-400 rounded-lg hover:bg-white/5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="font-serif-heading text-base font-bold text-[#F4EFE9]">{entry.title}</h4>
                  {entry.whatWentWell && (
                    <p className="text-xs text-[#A99F96] line-clamp-2">
                      <strong className="text-emerald-400 font-normal">Wins:</strong> {entry.whatWentWell}
                    </p>
                  )}
                  {entry.tomorrowPlan && (
                    <p className="text-xs text-[#A99F96] line-clamp-2">
                      <strong className="text-[#CDAA7D] font-normal">Next:</strong> {entry.tomorrowPlan}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="glass-panel p-8 rounded-3xl border border-white/5 text-center text-[#A99F96] space-y-2">
                <Feather className="w-8 h-8 text-[#CDAA7D]/40 mx-auto" />
                <p className="text-xs">No reflections saved yet.</p>
                <p className="text-[11px] text-[#A99F96]/60">Write your first daily journal reflection above.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useTaskStore, QUICK_TEMPLATES } from '../../store/useTaskStore';
import { Sparkles, Plus, BookOpen, Code, Dumbbell, FileText, Users, GraduationCap } from 'lucide-react';
import { soundEngine } from '../../services/soundGenerator';

const ICON_MAP: Record<string, any> = {
  Study: GraduationCap,
  Coding: Code,
  Reading: BookOpen,
  Workout: Dumbbell,
  Assignments: FileText,
  Meetings: Users,
};

export const QuickTemplates: React.FC = () => {
  const { addQuickTemplateTask } = useTaskStore();

  return (
    <div className="glass-panel p-4 rounded-3xl border border-white/10 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-amber-400" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Quick Add Templates</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
        {QUICK_TEMPLATES.map((tmpl, idx) => {
          const Icon = ICON_MAP[tmpl.category] || Sparkles;
          return (
            <button
              key={tmpl.name}
              onClick={() => {
                soundEngine.playClickSound();
                addQuickTemplateTask(idx);
              }}
              className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group text-left"
            >
              <div
                className="p-2 rounded-xl text-white"
                style={{ backgroundColor: `${tmpl.colorTag}25`, border: `1px solid ${tmpl.colorTag}40` }}
              >
                <Icon className="w-4 h-4" style={{ color: tmpl.colorTag }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-200 truncate group-hover:text-white">{tmpl.name}</p>
                <p className="text-[10px] text-slate-400 font-mono">+{tmpl.estimatedPomodoros} Pomodoros</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

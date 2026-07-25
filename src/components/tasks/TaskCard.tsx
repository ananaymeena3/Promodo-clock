import React from 'react';
import { Task, TaskStatus } from '../../types';
import { useTaskStore } from '../../store/useTaskStore';
import { useTimerStore } from '../../store/useTimerStore';
import { Clock, CheckSquare, MoreVertical, Edit2, Trash2, Calendar, Tag, AlertCircle, Play } from 'lucide-react';
import { soundEngine } from '../../services/soundGenerator';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const { deleteTask, moveTask, toggleSubtask, incrementTaskPomodoro } = useTaskStore();
  const { setActiveTask, activeTaskId, startTimer } = useTimerStore();

  const isCurrentActiveTask = activeTaskId === task.id;

  const completedSubtasksCount = task.subtasks.filter((s) => s.completed).length;
  const subtaskProgress = task.subtasks.length > 0 ? (completedSubtasksCount / task.subtasks.length) * 100 : 0;

  const getPriorityBadge = () => {
    switch (task.priority) {
      case 'urgent':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'high':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'medium':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const handleStartFocus = () => {
    soundEngine.playClickSound();
    setActiveTask(task);
    if (task.status === 'todo') {
      moveTask(task.id, 'in_progress');
    }
    startTimer();
  };

  return (
    <div
      className={`glass-panel p-4 rounded-2xl border transition-all duration-200 group relative ${
        isCurrentActiveTask
          ? 'border-purple-500/60 shadow-lg shadow-purple-500/10 bg-purple-950/20'
          : 'border-white/10 hover:border-white/20 hover:bg-white/5'
      }`}
    >
      {/* Top Tag & Priority Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide border ${getPriorityBadge()}`}
          >
            {task.priority}
          </span>
          {task.labels.map((lbl) => (
            <span
              key={lbl}
              className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/5 text-slate-300 border border-white/5"
            >
              {lbl}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => {
              soundEngine.playClickSound();
              onEdit(task);
            }}
            title="Edit Task"
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              soundEngine.playClickSound();
              deleteTask(task.id);
            }}
            title="Delete Task"
            className="p-1 text-slate-400 hover:text-red-400 rounded-lg hover:bg-white/10"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Task Title */}
      <h4 className="text-sm font-semibold text-white mb-1 leading-snug group-hover:text-purple-200 transition-colors">
        {task.title}
      </h4>

      {/* Task Description */}
      {task.description && (
        <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">{task.description}</p>
      )}

      {/* Subtasks Progress */}
      {task.subtasks.length > 0 && (
        <div className="mb-3 space-y-1.5 bg-slate-900/40 p-2 rounded-xl border border-white/5">
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>Subtasks</span>
            <span>
              {completedSubtasksCount}/{task.subtasks.length}
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
            <div
              className="bg-purple-500 h-full transition-all duration-300"
              style={{ width: `${subtaskProgress}%` }}
            />
          </div>
          <div className="space-y-1 pt-1">
            {task.subtasks.slice(0, 3).map((st) => (
              <label
                key={st.id}
                className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none hover:text-white"
              >
                <input
                  type="checkbox"
                  checked={st.completed}
                  onChange={() => {
                    soundEngine.playClickSound();
                    toggleSubtask(task.id, st.id);
                  }}
                  className="rounded border-slate-700 bg-slate-800 text-purple-600 focus:ring-purple-500 w-3 h-3"
                />
                <span className={st.completed ? 'line-through text-slate-500' : ''}>{st.title}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Footer Info: Pomodoros & Due Date & Column Move Selector */}
      <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 font-mono text-purple-300">
            <span>🍅</span>
            <span>
              {task.completedPomodoros}/{task.estimatedPomodoros}
            </span>
          </div>

          {task.dueDate && (
            <div className="flex items-center gap-1 text-[11px]">
              <Calendar className="w-3 h-3 text-slate-500" />
              <span>{task.dueDate}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Column Status Move Dropdown */}
          <select
            value={task.status}
            onChange={(e) => {
              soundEngine.playClickSound();
              moveTask(task.id, e.target.value as TaskStatus);
            }}
            className="bg-slate-900 text-slate-300 border border-white/10 rounded-lg px-2 py-0.5 text-[11px] focus:outline-none focus:border-purple-500"
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          {/* Quick Focus Button */}
          <button
            onClick={handleStartFocus}
            title="Focus on this task now"
            className="p-1.5 rounded-lg bg-purple-600/30 text-purple-300 hover:bg-purple-600 hover:text-white border border-purple-500/30 transition-all"
          >
            <Play className="w-3 h-3 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
};

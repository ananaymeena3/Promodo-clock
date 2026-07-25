import React, { useState, useEffect } from 'react';
import { Task, TaskPriority, TaskStatus, SubTask } from '../../types';
import { useTaskStore } from '../../store/useTaskStore';
import { X, Plus, Trash2, Calendar, Tag, AlertCircle, Clock } from 'lucide-react';
import { soundEngine } from '../../services/soundGenerator';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, taskToEdit }) => {
  const { addTask, updateTask } = useTaskStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(2);
  const [labels, setLabels] = useState('Design, Work');
  const [dueDate, setDueDate] = useState(new Date().toISOString().slice(0, 10));
  const [subtasks, setSubtasks] = useState<{ id: string; title: string; completed: boolean }[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setStatus(taskToEdit.status);
      setPriority(taskToEdit.priority);
      setEstimatedPomodoros(taskToEdit.estimatedPomodoros);
      setLabels(taskToEdit.labels.join(', '));
      setDueDate(taskToEdit.dueDate || new Date().toISOString().slice(0, 10));
      setSubtasks(taskToEdit.subtasks || []);
    } else {
      setTitle('');
      setDescription('');
      setStatus('todo');
      setPriority('medium');
      setEstimatedPomodoros(2);
      setLabels('Work');
      setDueDate(new Date().toISOString().slice(0, 10));
      setSubtasks([]);
    }
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    setSubtasks([...subtasks, { id: 'sub_' + Date.now(), title: newSubtaskTitle.trim(), completed: false }]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter((s) => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    soundEngine.playClickSound();

    const formattedLabels = labels
      .split(',')
      .map((l) => l.trim())
      .filter(Boolean);

    if (taskToEdit) {
      updateTask(taskToEdit.id, {
        title,
        description,
        status,
        priority,
        estimatedPomodoros,
        labels: formattedLabels,
        dueDate,
        subtasks,
      });
    } else {
      addTask({
        title,
        description,
        status,
        priority,
        labels: formattedLabels,
        colorTag: '#8b5cf6',
        estimatedPomodoros,
        completedPomodoros: 0,
        dueDate,
        subtasks,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="glass-panel w-full max-w-lg rounded-3xl border border-white/10 shadow-2xl p-6 relative animate-fade-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>{taskToEdit ? 'Edit Task' : 'Create New Focus Task'}</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Task Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Design FocusFlow MacOS Navigation Bar"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
            <textarea
              rows={3}
              placeholder="Add key notes, context, or requirements..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm bg-slate-900"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent & Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Status Column</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm bg-slate-900"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Estimated Pomodoros 🍅</label>
              <input
                type="number"
                min="1"
                max="20"
                value={estimatedPomodoros}
                onChange={(e) => setEstimatedPomodoros(parseInt(e.target.value) || 1)}
                className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Labels / Tags (comma separated)</label>
            <input
              type="text"
              placeholder="e.g. Design, Frontend, Urgently"
              value={labels}
              onChange={(e) => setLabels(e.target.value)}
              className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
            />
          </div>

          {/* Subtasks Checklist Manager */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <label className="block text-xs font-semibold text-slate-300">Subtasks Checklist</label>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add subtask item..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                className="flex-1 glass-input px-3 py-2 rounded-xl text-xs"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold"
              >
                Add
              </button>
            </div>

            <div className="space-y-1.5 max-h-32 overflow-y-auto">
              {subtasks.map((st) => (
                <div key={st.id} className="flex items-center justify-between bg-white/5 p-2 rounded-xl text-xs">
                  <span className="text-slate-200">{st.title}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(st.id)}
                    className="text-slate-400 hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Submit */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-600/30"
            >
              {taskToEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

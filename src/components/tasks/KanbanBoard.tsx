import React, { useState } from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import { Task, TaskPriority, TaskStatus } from '../../types';
import { TaskCard } from './TaskCard';
import { TaskModal } from './TaskModal';
import { QuickTemplates } from './QuickTemplates';
import { Plus, Search, Filter, ArrowUpDown, CheckCircle2, Clock, ListTodo } from 'lucide-react';
import { soundEngine } from '../../services/soundGenerator';

export const KanbanBoard: React.FC = () => {
  const {
    tasks,
    searchQuery,
    setSearchQuery,
    selectedPriority,
    setSelectedPriority,
    sortBy,
    setSortBy,
  } = useTaskStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const handleOpenCreateModal = () => {
    soundEngine.playClickSound();
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    soundEngine.playClickSound();
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.labels.some((l) => l.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPriority = selectedPriority ? t.priority === selectedPriority : true;

    return matchesSearch && matchesPriority;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityOrder: Record<TaskPriority, number> = { urgent: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const todoTasks = sortedTasks.filter((t) => t.status === 'todo');
  const inProgressTasks = sortedTasks.filter((t) => t.status === 'in_progress');
  const completedTasks = sortedTasks.filter((t) => t.status === 'completed');

  const COLUMNS: { status: TaskStatus; label: string; icon: any; colorClass: string; items: Task[] }[] = [
    { status: 'todo', label: 'To Do', icon: ListTodo, colorClass: 'text-amber-400 border-amber-500/20 bg-amber-500/10', items: todoTasks },
    { status: 'in_progress', label: 'In Progress', icon: Clock, colorClass: 'text-purple-400 border-purple-500/20 bg-purple-500/10', items: inProgressTasks },
    { status: 'completed', label: 'Completed', icon: CheckCircle2, colorClass: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10', items: completedTasks },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Quick Add Templates */}
      <QuickTemplates />

      {/* Control Filter Bar */}
      <div className="glass-panel p-4 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tasks or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full glass-input pl-9 pr-4 py-2 rounded-xl text-xs"
          />
        </div>

        {/* Filters and Sort */}
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          {/* Priority filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={selectedPriority || ''}
              onChange={(e) => setSelectedPriority((e.target.value as TaskPriority) || null)}
              className="bg-slate-900 text-slate-200 border border-white/10 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-purple-500"
            >
              <option value="">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-900 text-slate-200 border border-white/10 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-purple-500"
            >
              <option value="date">Sort by Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>

          {/* Create Task Button */}
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all shadow-lg shadow-purple-600/30 glow-primary ml-auto"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {COLUMNS.map((col) => {
          const Icon = col.icon;
          return (
            <div key={col.status} className="glass-panel p-5 rounded-3xl border border-white/10 flex flex-col min-h-[500px]">
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-xl border ${col.colorClass}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-white">{col.label}</h3>
                </div>
                <span className="text-xs font-mono font-bold bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full text-slate-300">
                  {col.items.length}
                </span>
              </div>

              {/* Task Cards List */}
              <div className="space-y-3.5 flex-1 overflow-y-auto pr-1">
                {col.items.length > 0 ? (
                  col.items.map((task) => (
                    <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500">
                    <p className="text-xs">No tasks in {col.label}</p>
                    <button
                      onClick={handleOpenCreateModal}
                      className="mt-2 text-xs text-purple-400 hover:underline"
                    >
                      + Add task
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create / Edit Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        taskToEdit={taskToEdit}
      />
    </div>
  );
};

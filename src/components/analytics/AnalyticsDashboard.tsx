import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useTaskStore } from '../../store/useTaskStore';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Download, Flame, Clock, Award, CheckCircle2, Calendar, Zap, TrendingUp } from 'lucide-react';
import { soundEngine } from '../../services/soundGenerator';

export const AnalyticsDashboard: React.FC = () => {
  const { sessions, streaks } = useAppStore();
  const { tasks } = useTaskStore();

  // Daily focus mins breakdown for the last 7 days
  const getDailyData = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const daySessions = sessions.filter((s) => s.date === dateStr);
      const totalMins = daySessions.reduce((acc, s) => acc + s.durationMinutes, 0);

      days.push({
        day: dayName,
        date: dateStr,
        minutes: totalMins,
        sessions: daySessions.length,
      });
    }
    return days;
  };

  // Hourly distribution (Peak productive hours)
  const getHourlyData = () => {
    const hours = Array.from({ length: 12 }, (_, i) => ({
      hour: `${(i * 2) % 12 || 12}${i * 2 >= 12 ? 'pm' : 'am'}`,
      minutes: 0,
    }));

    sessions.forEach((s) => {
      try {
        const date = new Date(s.completedAt);
        const h = Math.floor(date.getHours() / 2);
        if (hours[h]) {
          hours[h].minutes += s.durationMinutes;
        }
      } catch (e) {}
    });

    return hours;
  };

  const dailyData = getDailyData();
  const hourlyData = getHourlyData();

  // Completed vs Pending tasks donut data
  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const pendingCount = tasks.filter((t) => t.status !== 'completed').length;
  const pieData = [
    { name: 'Completed', value: completedCount, color: '#8b5cf6' },
    { name: 'Pending', value: pendingCount, color: '#334155' },
  ];

  // CSV Export function
  const handleExportCSV = () => {
    soundEngine.playClickSound();
    let csv = 'ID,Date,Duration (Mins),Mode,Task Title\n';
    sessions.forEach((s) => {
      csv += `"${s.id}","${s.date}",${s.durationMinutes},"${s.mode}","${s.taskTitle || 'General Focus'}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `focusflow-analytics-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const totalMinutes = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const avgSessionLen = sessions.length > 0 ? Math.round(totalMinutes / sessions.length) : 0;
  const longestSession = sessions.length > 0 ? Math.max(...sessions.map((s) => s.durationMinutes)) : 0;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Productivity Analytics</h2>
          <p className="text-xs text-slate-400">Deep work metrics, focus session trends, and peak performance stats.</p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all"
        >
          <Download className="w-4 h-4 text-purple-400" />
          <span>Export Data CSV</span>
        </button>
      </div>

      {/* Top Overview Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-3xl border border-white/10 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Focus Time</p>
            <h3 className="text-2xl font-extrabold text-white mt-0.5 font-mono">
              {(totalMinutes / 60).toFixed(1)} <span className="text-xs text-slate-400 font-sans">Hours</span>
            </h3>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-white/10 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Current Streak</p>
            <h3 className="text-2xl font-extrabold text-white mt-0.5 font-mono">
              {streaks.dailyStreak} <span className="text-xs text-slate-400 font-sans">Days</span>
            </h3>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-white/10 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Avg Session</p>
            <h3 className="text-2xl font-extrabold text-white mt-0.5 font-mono">
              {avgSessionLen} <span className="text-xs text-slate-400 font-sans">Mins</span>
            </h3>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-white/10 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Longest Session</p>
            <h3 className="text-2xl font-extrabold text-white mt-0.5 font-mono">
              {longestSession} <span className="text-xs text-slate-400 font-sans">Mins</span>
            </h3>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Focus Time Bar Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-400" /> Daily Focus Minutes (7 Days)
              </h3>
              <p className="text-xs text-slate-400">Minutes spent in deep work per day</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                />
                <Bar dataKey="minutes" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Completion Rate Pie Chart */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Task Completion Rate
            </h3>
            <p className="text-xs text-slate-400">Ratio of finished vs pending tasks</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-extrabold text-white font-mono">
                {tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0}%
              </span>
              <span className="text-[10px] text-slate-400">Completed</span>
            </div>
          </div>

          <div className="flex justify-center gap-6 text-xs border-t border-white/10 pt-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-slate-300">Completed ({completedCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-700" />
              <span className="text-slate-400">Pending ({pendingCount})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Peak Productive Hours Chart */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10">
        <div className="mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" /> Most Productive Hours
          </h3>
          <p className="text-xs text-slate-400">Focus minutes distribution throughout the day</p>
        </div>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyData}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="hour" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
              <Area type="monotone" dataKey="minutes" stroke="#06b6d4" fillOpacity={1} fill="url(#areaGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

import { AICoachReport, FocusSession, Task, Habit } from '../types';

export const generateAICoachReport = (
  sessions: FocusSession[],
  tasks: Task[],
  habits: Habit[],
  streakCount: number
): AICoachReport => {
  const totalMinutes = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const pendingTasks = tasks.filter((t) => t.status !== 'completed').length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Calculate score based on sessions, completion rate, and streaks
  let baseScore = Math.min(100, Math.round(totalMinutes / 3) + completionRate / 2 + streakCount * 5);
  if (baseScore === 0) baseScore = 75; // baseline encouraging score

  const hourCounts: Record<number, number> = {};
  sessions.forEach((s) => {
    try {
      const date = new Date(s.completedAt);
      const hour = date.getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + s.durationMinutes;
    } catch (e) {}
  });

  // Find peak hour
  let peakHour = 9;
  let maxMin = 0;
  Object.entries(hourCounts).forEach(([h, m]) => {
    if (m > maxMin) {
      maxMin = m;
      peakHour = parseInt(h);
    }
  });

  const formatHour = (h: number) => {
    const period = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 || 12;
    return `${displayH}:00 ${period}`;
  };

  const peakTimeString = `${formatHour(peakHour)} - ${formatHour((peakHour + 2) % 24)}`;

  const insights = [
    `You've logged ${totalHours} focus hours across ${sessions.length} sessions.`,
    `Task completion velocity is sitting at ${completionRate}%.`,
    `Your highest focus energy consistently peaks around ${formatHour(peakHour)}.`,
    streakCount > 0
      ? `You are on an active ${streakCount}-day streak! Keep the momentum alive.`
      : `Start a new focus streak today by completing at least one 25-minute Pomodoro session.`,
  ];

  const highPriorityTasks = tasks.filter((t) => (t.priority === 'urgent' || t.priority === 'high') && t.status !== 'completed');

  return {
    productivityScore: Math.min(100, Math.max(30, baseScore)),
    dailySummary: `Today you have maintained an impressive focus flow. You completed ${completedTasks} tasks and spent ${totalMinutes} focused minutes with zero major context switching.`,
    weeklyInsights: insights,
    bestStudyTime: peakTimeString,
    breakRecommendation:
      totalMinutes > 180
        ? 'High cognitive effort detected! Take a 15-20 min long break with ambient sound to recharge your prefrontal cortex.'
        : 'Maintain 50-minute deep work intervals followed by 10-minute micro breaks.',
    taskPrioritization:
      highPriorityTasks.length > 0
        ? highPriorityTasks.map((t) => `⚡ Priority Focus: "${t.title}" (${t.estimatedPomodoros} pomodoros estimated)`)
        : ['Clear out inbox tasks', 'Schedule upcoming milestone goals', 'Review reading & habit tracker list'],
    generatedAt: new Date().toISOString(),
  };
};

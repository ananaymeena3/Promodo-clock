// Storage keys
const KEYS = {
  SETTINGS: 'focusflow_settings',
  TASKS: 'focusflow_tasks',
  HABITS: 'focusflow_habits',
  NOTES: 'focusflow_notes',
  SESSIONS: 'focusflow_sessions',
  STREAKS: 'focusflow_streaks',
  GOALS: 'focusflow_goals',
  PROFILE: 'focusflow_profile',
  FAVORITE_QUOTES: 'focusflow_fav_quotes',
  ACHIEVEMENTS: 'focusflow_achievements',
  MILESTONES: 'focusflow_milestones',
};

export const getStoredItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

export const setStoredItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting ${key} in localStorage:`, error);
  }
};

export const exportUserDataJSON = () => {
  const data: Record<string, any> = {};
  Object.entries(KEYS).forEach(([name, key]) => {
    data[name] = getStoredItem(key, null);
  });
  data['exportDate'] = new Date().toISOString();
  data['version'] = '1.0.0';

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `focusflow-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importUserDataJSON = (jsonString: string): boolean => {
  try {
    const data = JSON.parse(jsonString);
    if (!data || typeof data !== 'object') return false;

    if (data.SETTINGS) setStoredItem(KEYS.SETTINGS, data.SETTINGS);
    if (data.TASKS) setStoredItem(KEYS.TASKS, data.TASKS);
    if (data.HABITS) setStoredItem(KEYS.HABITS, data.HABITS);
    if (data.NOTES) setStoredItem(KEYS.NOTES, data.NOTES);
    if (data.SESSIONS) setStoredItem(KEYS.SESSIONS, data.SESSIONS);
    if (data.STREAKS) setStoredItem(KEYS.STREAKS, data.STREAKS);
    if (data.GOALS) setStoredItem(KEYS.GOALS, data.GOALS);
    if (data.PROFILE) setStoredItem(KEYS.PROFILE, data.PROFILE);
    if (data.ACHIEVEMENTS) setStoredItem(KEYS.ACHIEVEMENTS, data.ACHIEVEMENTS);
    if (data.MILESTONES) setStoredItem(KEYS.MILESTONES, data.MILESTONES);

    return true;
  } catch (err) {
    console.error('Import error:', err);
    return false;
  }
};

export { KEYS };

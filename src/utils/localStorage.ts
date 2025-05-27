// Type definitions for our stored data
export interface StoredTask {
  id: string;
  title: string;
  completed: boolean;
  priority: 1 | 2 | 3; // 1 = high, 2 = medium, 3 = low
}

export interface StoredCalendarTask {
  id: string;
  title: string;
  date: string; // ISO date string format
  completed: boolean;
  priority: 1 | 2 | 3; // 1 = high, 2 = medium, 3 = low
}

export interface StoredReflection {
  date: string; // ISO date string format
  wins: string;
  improvements: string;
}

export interface StoredStats {
  focusSessions: number;
  tasksCompleted: number;
  streak: number;
  level: number;
  xp: number;
  xpForNextLevel: number;
}

export interface StoredSettings {
  theme: string;
  fontSize: string;
}

// Storage keys
const TASKS_KEY = 'productivity_tasks';
const CALENDAR_TASKS_KEY = 'productivity_calendar_tasks';
const REFLECTIONS_KEY = 'productivity_reflections';
const STATS_KEY = 'productivity_stats';
const SETTINGS_KEY = 'productivity_settings';
const LAST_SETTINGS_CHANGE_KEY = 'productivity_settings_last_change';

// Save functions
export const saveTasks = (tasks: StoredTask[]) => {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};

export const saveCalendarTasks = (tasks: StoredCalendarTask[]) => {
  localStorage.setItem(CALENDAR_TASKS_KEY, JSON.stringify(tasks));
};

export const saveReflection = (reflection: StoredReflection) => {
  const reflections = getReflections();
  
  // Check if a reflection for this date already exists
  const existingIndex = reflections.findIndex(r => r.date === reflection.date);
  
  if (existingIndex !== -1) {
    // Update existing reflection
    reflections[existingIndex] = reflection;
  } else {
    // Add new reflection
    reflections.push(reflection);
  }
  
  localStorage.setItem(REFLECTIONS_KEY, JSON.stringify(reflections));
};

export const saveStats = (stats: StoredStats) => {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
};

export const saveSettings = (settings: StoredSettings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  
  // Save timestamp to track when settings were last changed
  localStorage.setItem(LAST_SETTINGS_CHANGE_KEY, Date.now().toString());
  
  // Apply settings immediately
  applySettings(settings);
};

// Get functions
export const getTasks = (): StoredTask[] => {
  const tasksJson = localStorage.getItem(TASKS_KEY);
  return tasksJson ? JSON.parse(tasksJson) : [];
};

export const getCalendarTasks = (): StoredCalendarTask[] => {
  const tasksJson = localStorage.getItem(CALENDAR_TASKS_KEY);
  const tasks = tasksJson ? JSON.parse(tasksJson) : [];
  
  // Convert stored date strings back to Date objects
  return tasks;
};

export const getReflections = (): StoredReflection[] => {
  const reflectionsJson = localStorage.getItem(REFLECTIONS_KEY);
  return reflectionsJson ? JSON.parse(reflectionsJson) : [];
};

export const getReflectionForDate = (dateString: string): StoredReflection | null => {
  const reflections = getReflections();
  return reflections.find(r => r.date === dateString) || null;
};

export const getStats = (): StoredStats => {
  const statsJson = localStorage.getItem(STATS_KEY);
  return statsJson ? JSON.parse(statsJson) : {
    focusSessions: 0,
    tasksCompleted: 0,
    streak: 0,
    level: 1,
    xp: 0,
    xpForNextLevel: 100
  };
};

export const getSettings = (): StoredSettings => {
  const settingsJson = localStorage.getItem(SETTINGS_KEY);
  const defaultSettings = {
    theme: 'system',
    fontSize: 'medium'
  };
  return settingsJson ? JSON.parse(settingsJson) : defaultSettings;
};

// Get the timestamp when settings were last changed
export const getLastSettingsChangeTime = (): number => {
  const timestamp = localStorage.getItem(LAST_SETTINGS_CHANGE_KEY);
  return timestamp ? parseInt(timestamp, 10) : 0;
};

// Apply settings throughout the application
export const applySettings = (settings: StoredSettings) => {
  // Apply theme
  if (settings.theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else if (settings.theme === 'light') {
    document.documentElement.classList.remove('dark');
  } else if (settings.theme === 'system') {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
  
  // Apply font size
  document.documentElement.classList.remove('text-size-small', 'text-size-medium', 'text-size-large');
  document.documentElement.classList.add(`text-size-${settings.fontSize}`);
};

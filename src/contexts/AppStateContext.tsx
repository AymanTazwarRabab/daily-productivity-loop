
import React, { createContext, useContext } from 'react';
import { useDatabase } from '@/hooks/useDatabase';

type AppStateContextType = {
  stats: {
    focusSessions: number;
    tasksCompleted: number;
    streak: number;
    level: number;
    xp: number;
    xpForNextLevel: number;
  };
  updateStats: (newStats: {
    focusSessions?: number;
    tasksCompleted?: number;
    streak?: number;
    level?: number;
    xp?: number;
    xpForNextLevel?: number;
  }) => void;
  settings: {
    defaultFocusTime: number;
    breakTime: number;
    notifications: boolean;
    sound: boolean;
    theme: string;
    fontSize: string;
    compactMode: boolean;
  };
  updateSettings: (newSettings: {
    defaultFocusTime?: number;
    breakTime?: number;
    notifications?: boolean;
    sound?: boolean;
    theme?: string;
    fontSize?: string;
    compactMode?: boolean;
  }) => void;
  refreshStats: () => void;
  isLoading: boolean;
};

const defaultContext: AppStateContextType = {
  stats: {
    focusSessions: 0,
    tasksCompleted: 0,
    streak: 0,
    level: 1,
    xp: 0,
    xpForNextLevel: 100
  },
  updateStats: () => {},
  settings: {
    defaultFocusTime: 25,
    breakTime: 5,
    notifications: true,
    sound: true,
    theme: 'system',
    fontSize: 'medium',
    compactMode: false
  },
  updateSettings: () => {},
  refreshStats: () => {},
  isLoading: false
};

export const AppStateContext = createContext<AppStateContextType>(defaultContext);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    userStats, 
    appSettings, 
    updateUserStats, 
    updateAppSettings,
    loadingUserStats,
    loadingAppSettings 
  } = useDatabase();

  const isLoading = loadingUserStats || loadingAppSettings;

  // Convert database format to component format with fallbacks
  const stats = userStats ? {
    focusSessions: userStats.focus_sessions ?? 0,
    tasksCompleted: userStats.tasks_completed ?? 0,
    streak: userStats.streak ?? 0,
    level: userStats.level ?? 1,
    xp: userStats.xp ?? 0,
    xpForNextLevel: userStats.xp_for_next_level ?? 100
  } : defaultContext.stats;

  const settings = appSettings ? {
    defaultFocusTime: appSettings.default_focus_time ?? 25,
    breakTime: appSettings.break_time ?? 5,
    notifications: appSettings.notifications ?? true,
    sound: appSettings.sound ?? true,
    theme: appSettings.theme ?? 'system',
    fontSize: appSettings.font_size ?? 'medium',
    compactMode: appSettings.compact_mode ?? false
  } : defaultContext.settings;

  const handleUpdateStats = (newStats: {
    focusSessions?: number;
    tasksCompleted?: number;
    streak?: number;
    level?: number;
    xp?: number;
    xpForNextLevel?: number;
  }) => {
    console.log('AppStateContext - Updating stats:', newStats);
    
    if (!updateUserStats) {
      console.warn('updateUserStats not available yet');
      return;
    }
    
    // Convert to database format
    const dbStats: any = {};
    if (newStats.focusSessions !== undefined) dbStats.focus_sessions = newStats.focusSessions;
    if (newStats.tasksCompleted !== undefined) dbStats.tasks_completed = newStats.tasksCompleted;
    if (newStats.streak !== undefined) dbStats.streak = newStats.streak;
    if (newStats.level !== undefined) dbStats.level = newStats.level;
    if (newStats.xp !== undefined) dbStats.xp = newStats.xp;
    if (newStats.xpForNextLevel !== undefined) dbStats.xp_for_next_level = newStats.xpForNextLevel;
    
    updateUserStats(dbStats);
  };

  const handleUpdateSettings = (newSettings: {
    defaultFocusTime?: number;
    breakTime?: number;
    notifications?: boolean;
    sound?: boolean;
    theme?: string;
    fontSize?: string;
    compactMode?: boolean;
  }) => {
    console.log('AppStateContext - Updating settings:', newSettings);
    
    if (!updateAppSettings) {
      console.warn('updateAppSettings not available yet');
      return;
    }
    
    // Convert to database format
    const dbSettings: any = {};
    if (newSettings.defaultFocusTime !== undefined) dbSettings.default_focus_time = newSettings.defaultFocusTime;
    if (newSettings.breakTime !== undefined) dbSettings.break_time = newSettings.breakTime;
    if (newSettings.notifications !== undefined) dbSettings.notifications = newSettings.notifications;
    if (newSettings.sound !== undefined) dbSettings.sound = newSettings.sound;
    if (newSettings.theme !== undefined) dbSettings.theme = newSettings.theme;
    if (newSettings.fontSize !== undefined) dbSettings.font_size = newSettings.fontSize;
    if (newSettings.compactMode !== undefined) dbSettings.compact_mode = newSettings.compactMode;
    
    updateAppSettings(dbSettings);
  };

  const refreshStats = () => {
    console.log('AppStateContext - Refreshing stats');
    // The useQuery will automatically refetch when invalidated
  };

  return (
    <AppStateContext.Provider value={{ 
      stats, 
      updateStats: handleUpdateStats, 
      settings, 
      updateSettings: handleUpdateSettings, 
      refreshStats,
      isLoading
    }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};

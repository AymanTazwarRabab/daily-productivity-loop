
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStats, saveStats, getSettings, saveSettings, StoredStats, StoredSettings } from '@/utils/localStorage';

type AppStateContextType = {
  stats: StoredStats;
  updateStats: (newStats: StoredStats) => void;
  settings: StoredSettings;
  updateSettings: (newSettings: StoredSettings) => void;
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
  updateSettings: () => {}
};

export const AppStateContext = createContext<AppStateContextType>(defaultContext);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<StoredStats>(getStats());
  const [settings, setSettings] = useState<StoredSettings>(getSettings());

  // Update local storage whenever stats change
  const updateStats = (newStats: StoredStats) => {
    console.log('Updating stats:', newStats);
    setStats(newStats);
    saveStats(newStats);
  };

  // Update settings and save to localStorage
  const updateSettings = (newSettings: StoredSettings) => {
    console.log('Updating settings:', newSettings);
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  return (
    <AppStateContext.Provider value={{ stats, updateStats, settings, updateSettings }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => useContext(AppStateContext);

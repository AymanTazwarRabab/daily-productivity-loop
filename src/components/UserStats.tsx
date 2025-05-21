
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getStats, saveStats } from '@/utils/localStorage';

interface UserStatsProps {
  streak: number;
  tasksCompleted: number;
  focusSessions: number;
  level: number;
  xp: number;
  xpForNextLevel: number;
}

const UserStats: React.FC<UserStatsProps> = ({ 
  streak: initialStreak,
  tasksCompleted: initialTasksCompleted,
  focusSessions: initialFocusSessions,
  level: initialLevel,
  xp: initialXp,
  xpForNextLevel: initialXpForNextLevel
}) => {
  // Load stats from localStorage if available
  useEffect(() => {
    const savedStats = getStats();
    
    // Use saved stats or props as initial values
    const streak = savedStats.streak || initialStreak;
    const tasksCompleted = savedStats.tasksCompleted || initialTasksCompleted;
    const focusSessions = savedStats.focusSessions || initialFocusSessions;
    const level = savedStats.level || initialLevel;
    const xp = savedStats.xp || initialXp;
    const xpForNextLevel = savedStats.xpForNextLevel || initialXpForNextLevel;
    
    // Save the merged stats back to localStorage
    saveStats({
      streak,
      tasksCompleted,
      focusSessions,
      level,
      xp,
      xpForNextLevel
    });
  }, [initialStreak, initialTasksCompleted, initialFocusSessions, initialLevel, initialXp, initialXpForNextLevel]);

  // Subscribe to changes in props to update localStorage
  useEffect(() => {
    saveStats({
      streak: initialStreak,
      tasksCompleted: initialTasksCompleted,
      focusSessions: initialFocusSessions,
      level: initialLevel,
      xp: initialXp,
      xpForNextLevel: initialXpForNextLevel
    });
  }, [initialStreak, initialTasksCompleted, initialFocusSessions, initialLevel, initialXp, initialXpForNextLevel]);

  const progressPercent = (initialXp / initialXpForNextLevel) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <span className="text-lg font-bold mr-2">Level {initialLevel}</span>
              <div className="bg-primary/10 text-primary text-xs rounded-full px-2 py-0.5">
                {initialXp} / {initialXpForNextLevel} XP
              </div>
            </div>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">{initialStreak}</span>
            <span className="text-xs text-muted-foreground">Day Streak</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">{initialTasksCompleted}</span>
            <span className="text-xs text-muted-foreground">Tasks Done</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">{initialFocusSessions}</span>
            <span className="text-xs text-muted-foreground">Focus Sessions</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserStats;

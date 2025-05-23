
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAppState } from '@/contexts/AppStateContext';

interface UserStatsProps {
  streak?: number;
  tasksCompleted?: number;
  focusSessions?: number;
  level?: number;
  xp?: number;
  xpForNextLevel?: number;
}

const UserStats: React.FC<UserStatsProps> = (props) => {
  // Get stats from context, fallback to props for backward compatibility
  const { stats } = useAppState();
  
  const streak = props.streak ?? stats.streak;
  const tasksCompleted = props.tasksCompleted ?? stats.tasksCompleted;
  const focusSessions = props.focusSessions ?? stats.focusSessions;
  const level = props.level ?? stats.level;
  const xp = props.xp ?? stats.xp;
  const xpForNextLevel = props.xpForNextLevel ?? stats.xpForNextLevel;

  const progressPercent = (xp / xpForNextLevel) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <span className="text-lg font-bold mr-2">Level {level}</span>
              <div className="bg-primary/10 text-primary text-xs rounded-full px-2 py-0.5">
                {xp} / {xpForNextLevel} XP
              </div>
            </div>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">{streak}</span>
            <span className="text-xs text-muted-foreground">Day Streak</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">{tasksCompleted}</span>
            <span className="text-xs text-muted-foreground">Tasks Done</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">{focusSessions}</span>
            <span className="text-xs text-muted-foreground">Focus Sessions</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserStats;

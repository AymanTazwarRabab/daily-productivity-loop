
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface UserStatsProps {
  streak: number;
  tasksCompleted: number;
  focusSessions: number;
  level: number;
  xp: number;
  xpForNextLevel: number;
}

const UserStats: React.FC<UserStatsProps> = ({
  streak,
  tasksCompleted,
  focusSessions,
  level,
  xp,
  xpForNextLevel,
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span>Level {level}</span>
          <span className="stats-pill">{xp} / {xpForNextLevel} XP</span>
        </CardTitle>
        <CardDescription>Keep building your productivity skills</CardDescription>
      </CardHeader>
      <CardContent>
        <Progress value={xp / xpForNextLevel * 100} className="h-2 mb-4" />
        
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-muted p-3">
            <div className="text-2xl font-bold text-primary">{streak}</div>
            <div className="text-xs text-muted-foreground">Day Streak</div>
          </div>
          <div className="rounded-lg bg-muted p-3">
            <div className="text-2xl font-bold text-primary">{tasksCompleted}</div>
            <div className="text-xs text-muted-foreground">Tasks Done</div>
          </div>
          <div className="rounded-lg bg-muted p-3">
            <div className="text-2xl font-bold text-primary">{focusSessions}</div>
            <div className="text-xs text-muted-foreground">Focus Sessions</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserStats;


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

  const statItems = [
    { value: streak, label: 'Day Streak', color: 'text-white' },
    { value: tasksCompleted, label: 'Tasks Done', color: 'text-white' },
    { value: focusSessions, label: 'Focus Sessions', color: 'text-white' },
  ];

  return (
    <Card className="card-interactive">
      <CardHeader>
        <CardTitle className="text-white font-bold text-xl">
          Your Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <span className="text-lg font-bold text-white">
                Level {level}
              </span>
              <div className="bg-white/20 backdrop-blur-sm text-white text-xs rounded-full px-3 py-1 border border-white/30 hover:border-white/50 transition-all duration-300 font-semibold">
                {xp} / {xpForNextLevel} XP
              </div>
            </div>
          </div>
          <div className="relative">
            <Progress 
              value={progressPercent} 
              className="h-3 bg-white/20 border border-white/30 overflow-hidden" 
            />
            <div 
              className="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 stagger-fade-in">
          {statItems.map((item, index) => (
            <div 
              key={item.label}
              className="flex flex-col items-center p-3 rounded-lg bg-white/10 border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 hover:shadow-lg group backdrop-blur-sm"
            >
              <span className={`text-2xl font-bold text-white group-hover:scale-110 transition-transform duration-300`}>
                {item.value}
              </span>
              <span className="text-xs text-white/90 group-hover:text-white transition-colors duration-300 text-center font-medium">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserStats;

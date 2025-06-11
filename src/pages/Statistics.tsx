
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart, PieChart, LineChart, Bar, Pie, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Award, Star } from 'lucide-react';
import { useAppState } from '@/contexts/AppStateContext';
import { useDatabase } from '@/hooks/useDatabase';

const Statistics = () => {
  const { stats, refreshStats } = useAppState();
  const { dailyTasks, calendarTasks, reflections } = useDatabase();
  
  // Refresh stats when component mounts to ensure latest data
  useEffect(() => {
    refreshStats();
  }, [refreshStats]);
  
  const completedTasks = dailyTasks.filter(task => task.completed).length;
  const totalTasks = dailyTasks.length;
  
  const completedCalendarTasks = calendarTasks.filter(task => task.completed).length;
  const totalCalendarTasks = calendarTasks.length;
  
  const progressPercent = stats.xpForNextLevel > 0 ? (stats.xp / stats.xpForNextLevel) * 100 : 0;
  
  // Data for task completion pie chart
  const taskCompletionData = [
    { name: 'Completed', value: completedTasks, fill: '#4ade80' },
    { name: 'Remaining', value: Math.max(0, totalTasks - completedTasks), fill: '#f87171' },
  ];
  
  // Data for calendar task completion pie chart
  const calendarTaskCompletionData = [
    { name: 'Completed', value: completedCalendarTasks, fill: '#60a5fa' },
    { name: 'Remaining', value: Math.max(0, totalCalendarTasks - completedCalendarTasks), fill: '#f87171' },
  ];
  
  // Data for focus sessions bar chart (mock data based on total sessions)
  const focusSessionData = [
    { day: 'Mon', sessions: Math.floor(stats.focusSessions * 0.2) },
    { day: 'Tue', sessions: Math.floor(stats.focusSessions * 0.15) },
    { day: 'Wed', sessions: Math.floor(stats.focusSessions * 0.25) },
    { day: 'Thu', sessions: Math.floor(stats.focusSessions * 0.1) },
    { day: 'Fri', sessions: Math.floor(stats.focusSessions * 0.3) },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gradient-primary">Statistics</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 stagger-fade-in">
          <Card className="card-interactive">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center text-gradient-primary">
                <TrendingUp className="mr-2 h-5 w-5 text-primary transition-all duration-300 hover:scale-110" />
                Productivity Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <span className="text-lg font-bold mr-2 text-readable">Level {stats.level}</span>
                      <div className="bg-primary/10 text-primary text-xs rounded-full px-2 py-0.5 transition-all duration-300 hover:scale-105">
                        {stats.xp} / {stats.xpForNextLevel} XP
                      </div>
                    </div>
                  </div>
                  <Progress value={progressPercent} className="h-2 progress-enhanced" />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center p-2 rounded-md hover:bg-secondary/50 transition-all duration-300 hover:scale-105">
                    <span className="text-2xl font-bold text-gradient-accent">{stats.streak}</span>
                    <span className="text-xs text-readable-muted">Day Streak</span>
                  </div>
                  <div className="flex flex-col items-center p-2 rounded-md hover:bg-secondary/50 transition-all duration-300 hover:scale-105">
                    <span className="text-2xl font-bold text-gradient-accent">{stats.tasksCompleted}</span>
                    <span className="text-xs text-readable-muted">Tasks Done</span>
                  </div>
                  <div className="flex flex-col items-center p-2 rounded-md hover:bg-secondary/50 transition-all duration-300 hover:scale-105">
                    <span className="text-2xl font-bold text-gradient-accent">{stats.focusSessions}</span>
                    <span className="text-xs text-readable-muted">Focus Sessions</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-interactive">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center text-gradient-primary">
                <Award className="mr-2 h-5 w-5 text-primary transition-all duration-300 hover:scale-110" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats.tasksCompleted > 0 && (
                  <div className="flex items-center p-2 rounded-md border hover:border-border/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
                    <Star className="h-5 w-5 text-yellow-500 mr-2 transition-all duration-300 hover:scale-110" />
                    <div>
                      <div className="font-medium text-readable">Productivity Warrior</div>
                      <div className="text-sm text-readable-muted">Completed {stats.tasksCompleted} tasks</div>
                    </div>
                  </div>
                )}
                
                {stats.focusSessions > 0 && (
                  <div className="flex items-center p-2 rounded-md border hover:border-border/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
                    <Star className="h-5 w-5 text-yellow-500 mr-2 transition-all duration-300 hover:scale-110" />
                    <div>
                      <div className="font-medium text-readable">Focus Master</div>
                      <div className="text-sm text-readable-muted">Completed {stats.focusSessions} focus sessions</div>
                    </div>
                  </div>
                )}
                
                {stats.streak > 0 && (
                  <div className="flex items-center p-2 rounded-md border hover:border-border/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
                    <Star className="h-5 w-5 text-yellow-500 mr-2 transition-all duration-300 hover:scale-110" />
                    <div>
                      <div className="font-medium text-readable">Consistency Champion</div>
                      <div className="text-sm text-readable-muted">{stats.streak} day streak</div>
                    </div>
                  </div>
                )}

                {stats.tasksCompleted === 0 && stats.focusSessions === 0 && stats.streak === 0 && (
                  <div className="text-center text-readable-muted p-4 rounded-md border border-dashed transition-all duration-300 hover:border-border/50">
                    Start completing tasks to unlock achievements!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-interactive">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-gradient-primary">Task Completion</CardTitle>
            </CardHeader>
            <CardContent>
              {totalTasks > 0 ? (
                <>
                  <div className="h-[150px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={taskCompletionData}
                          cx="50%"
                          cy="50%"
                          outerRadius={60}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        />
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-center text-sm mt-2 text-readable">
                    {completedTasks} of {totalTasks} daily tasks completed
                  </div>
                </>
              ) : (
                <div className="h-[150px] flex items-center justify-center text-readable-muted">
                  No daily tasks yet. Add some tasks to see statistics!
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-fade-in">
          <Card className="card-interactive">
            <CardHeader>
              <CardTitle className="text-gradient-primary">Focus Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.focusSessions > 0 ? (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={focusSessionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="sessions" fill="#3b82f6" name="Sessions" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-readable-muted">
                  Complete your first focus session to see statistics!
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="card-interactive">
            <CardHeader>
              <CardTitle className="text-gradient-primary">Calendar Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              {totalCalendarTasks > 0 ? (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={calendarTaskCompletionData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      />
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-readable-muted">
                  Schedule some calendar tasks to see completion statistics!
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default Statistics;

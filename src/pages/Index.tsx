
import React, { useState, useEffect } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import DailyPlan from '@/components/DailyPlan';
import FocusTimer from '@/components/FocusTimer';
import DailyReflection from '@/components/DailyReflection';
import UserStats from '@/components/UserStats';
import TaskCalendar from '@/components/TaskCalendar';
import PrayerTimes from '@/components/PrayerTimes';
import Navbar from '@/components/Navbar';
import { toast } from 'sonner';
import { useAppState } from '@/contexts/AppStateContext';
import { useDatabase } from '@/hooks/useDatabase';

const Index = () => {
  const [date] = useState(new Date());
  const { stats, updateStats, isLoading, hasError } = useAppState();
  const { 
    updateDailyTask, 
    addDailyTask, 
    updateCalendarTask, 
    addCalendarTask, 
    updatePrayer, 
    saveReflection,
    updateUserStats
  } = useDatabase();
  
  console.log('Current stats in Index:', stats);
  
  // Function to handle XP gain and potential level up
  const handleXpGain = (amount: number) => {
    console.log('Adding XP:', amount, 'Current XP:', stats.xp);
    
    const newXp = stats.xp + amount;
    let newLevel = stats.level;
    let newXpForNextLevel = stats.xpForNextLevel;
    
    // Check if leveled up
    if (newXp >= stats.xpForNextLevel) {
      newLevel = stats.level + 1;
      newXpForNextLevel = Math.round(stats.xpForNextLevel * 1.5);
      
      console.log('Level up! New level:', newLevel, 'New XP for next level:', newXpForNextLevel);
      
      toast.success("Level Up!", {
        description: `Congratulations! You're now level ${newLevel}!`,
      });
    } else {
      toast.success("XP Gained!", {
        description: `You earned ${amount} XP. Keep it up!`,
      });
    }
    
    return { level: newLevel, xp: newXp, xpForNextLevel: newXpForNextLevel };
  };

  const handleTaskComplete = (taskId: string, completed: boolean) => {
    console.log('Task completion:', taskId, completed);
    
    if (completed) {
      // Calculate new XP and level
      const { level, xp, xpForNextLevel } = handleXpGain(10);
      
      // Update task in database
      updateDailyTask({ id: taskId, updates: { completed: true } });
      
      // Update all stats in a single call
      const newStats = {
        tasksCompleted: stats.tasksCompleted + 1,
        level,
        xp,
        xpForNextLevel
      };
      
      console.log('Updating to new stats:', newStats);
      updateStats(newStats);
    } else {
      // Update task in database
      updateDailyTask({ id: taskId, updates: { completed: false } });
      
      const newTasksCompleted = Math.max(0, stats.tasksCompleted - 1);
      const newXp = Math.max(0, stats.xp - 10);
      
      // Update state in a single call
      const newStats = {
        tasksCompleted: newTasksCompleted,
        xp: newXp
      };
      updateStats(newStats);
    }
  };

  const handleAddTask = (task: { title: string; priority?: number }) => {
    addDailyTask(task);
  };

  const handleCalendarTaskAdd = (task: { title: string; date: Date; priority?: number }) => {
    const dateString = task.date.toISOString().split('T')[0];
    addCalendarTask({
      title: task.title,
      date: dateString,
      priority: task.priority || 2
    });
    
    toast.success("Calendar task added", {
      description: `Task "${task.title}" scheduled for ${task.date.toLocaleDateString()}`,
    });
  };

  const handleCalendarTaskComplete = (taskId: string, completed: boolean) => {
    console.log('Calendar task completion:', taskId, completed);
    
    if (completed) {
      // Update task in database
      updateCalendarTask({ id: taskId, updates: { completed: true } });
      
      // Calculate new XP and level for calendar tasks (15 XP)
      const { level, xp, xpForNextLevel } = handleXpGain(15);
      
      // Update all stats in a single call
      const newStats = {
        tasksCompleted: stats.tasksCompleted + 1,
        level,
        xp,
        xpForNextLevel
      };
      updateStats(newStats);
    } else {
      // Update task in database
      updateCalendarTask({ id: taskId, updates: { completed: false } });
      
      // Remove XP for uncompleting a calendar task
      const newTasksCompleted = Math.max(0, stats.tasksCompleted - 1);
      const newXp = Math.max(0, stats.xp - 15);
      
      const newStats = {
        tasksCompleted: newTasksCompleted,
        xp: newXp
      };
      updateStats(newStats);
    }
  };

  const handleSessionComplete = () => {
    console.log('Focus session completed');
    
    // Calculate new XP and level for focus sessions (25 XP)
    const { level, xp, xpForNextLevel } = handleXpGain(25);
    
    // Update all stats in a single call
    const newStats = {
      focusSessions: stats.focusSessions + 1,
      level,
      xp,
      xpForNextLevel
    };
    updateStats(newStats);
  };

  const handleSaveReflection = (reflection: { wins: string; improvements: string }) => {
    const dateString = date.toISOString().split('T')[0];
    saveReflection({
      date: dateString,
      wins: reflection.wins,
      improvements: reflection.improvements
    });
  };

  const handlePrayerComplete = (prayerName: string, completed: boolean) => {
    console.log('Prayer completion:', prayerName, completed);
    
    // Update prayer in database
    updatePrayer({ prayer_name: prayerName, completed });
    
    if (completed) {
      // Calculate new XP and level for prayers (5 XP)
      const { level, xp, xpForNextLevel } = handleXpGain(5);
      
      const newStats = {
        level,
        xp,
        xpForNextLevel
      };
      updateStats(newStats);
    } else {
      // Remove XP for uncompleting a prayer
      const newXp = Math.max(0, stats.xp - 5);
      
      const newStats = {
        xp: newXp
      };
      updateStats(newStats);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading your productivity dashboard...</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">There was an error loading your dashboard data.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <DashboardHeader userName="Ayman Tazwar" date={date} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <DailyPlan 
              date={date} 
              onTaskComplete={handleTaskComplete}
              onAddTask={handleAddTask}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TaskCalendar 
                onAddTask={handleCalendarTaskAdd}
                onTaskComplete={handleCalendarTaskComplete}
              />
              
              <PrayerTimes 
                onPrayerComplete={handlePrayerComplete}
              />
            </div>
            
            <DailyReflection 
              date={date} 
              onSave={handleSaveReflection}
            />
          </div>
          
          <div className="space-y-6">
            <UserStats />
            <FocusTimer onSessionComplete={handleSessionComplete} />
          </div>
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default Index;

import React, { useState, useEffect } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import DailyPlan from '@/components/DailyPlan';
import FocusTimer from '@/components/FocusTimer';
import DailyReflection from '@/components/DailyReflection';
import UserStats from '@/components/UserStats';
import TaskCalendar from '@/components/TaskCalendar';
import PrayerTimes from '@/components/PrayerTimes';
import Navbar from '@/components/Navbar';
import { useToast } from '@/hooks/use-toast';
import { useAppState } from '@/contexts/AppStateContext';

const Index = () => {
  const { toast } = useToast();
  const [date] = useState(new Date());
  const { stats, updateStats } = useAppState();
  
  // Function to handle XP gain and potential level up
  const handleXpGain = (amount: number) => {
    const newXp = stats.xp + amount;
    let newLevel = stats.level;
    let newXpForNextLevel = stats.xpForNextLevel;
    
    // Check if leveled up
    if (newXp >= stats.xpForNextLevel) {
      newLevel = stats.level + 1;
      newXpForNextLevel = Math.round(stats.xpForNextLevel * 1.5); // Increase XP needed for next level
      
      toast({
        title: "Level Up!",
        description: `Congratulations! You're now level ${newLevel}!`,
        duration: 5000,
      });
    } else {
      toast({
        title: "XP Gained!",
        description: `You earned ${amount} XP. Keep it up!`,
        duration: 3000,
      });
    }
    
    // Update state
    const newStats = {
      ...stats,
      level: newLevel,
      xp: newXp,
      xpForNextLevel: newXpForNextLevel
    };
    
    updateStats(newStats);
    
    return { level: newLevel, xp: newXp };
  };

  const handleTaskComplete = (taskId: string, completed: boolean) => {
    if (completed) {
      const newTasksCompleted = stats.tasksCompleted + 1;
      
      // Add XP for completing a task
      handleXpGain(10);
      
      // Update tasksCompleted in state
      updateStats({
        ...stats,
        tasksCompleted: newTasksCompleted
      });
    } else {
      const newTasksCompleted = Math.max(0, stats.tasksCompleted - 1);
      const newXp = Math.max(0, stats.xp - 10);
      
      // Update state
      updateStats({
        ...stats,
        tasksCompleted: newTasksCompleted,
        xp: newXp
      });
    }
  };

  const handleAddTask = () => {
    toast({
      title: "Task added",
      description: "New task added to your daily plan",
      duration: 2000,
    });
  };

  const handleCalendarTaskAdd = (task: any) => {
    toast({
      title: "Calendar task added",
      description: `Task "${task.title}" scheduled for ${task.date.toLocaleDateString()}`,
      duration: 2000,
    });
  };

  const handleCalendarTaskComplete = (taskId: string, completed: boolean) => {
    // Handle calendar task completion separately to add XP
    if (completed) {
      // Add XP for completing a calendar task
      handleXpGain(15); // Calendar tasks give more XP
      
      // Update tasksCompleted in state and localStorage
      const newTasksCompleted = stats.tasksCompleted + 1;
      
      updateStats({
        ...stats,
        tasksCompleted: newTasksCompleted
      });
    } else {
      // Remove XP for uncompleting a calendar task
      const newXp = Math.max(0, stats.xp - 15);
      
      // Update localStorage
      const newTasksCompleted = Math.max(0, stats.tasksCompleted - 1);
      
      updateStats({
        ...stats,
        tasksCompleted: newTasksCompleted,
        xp: newXp
      });
    }
  };

  const handleSessionComplete = () => {
    const newFocusSessions = stats.focusSessions + 1;
    
    // Add XP for completing a focus session
    handleXpGain(25);
    
    // Update state
    updateStats({
      ...stats,
      focusSessions: newFocusSessions
    });
  };

  const handleSaveReflection = (reflection: { wins: string; improvements: string }) => {
    // No XP for reflections, just display a toast
    toast({
      title: "Reflection saved",
      description: "Your daily reflection has been saved",
      duration: 2000,
    });
  };

  const handlePrayerComplete = (prayerName: string, completed: boolean) => {
    // Add XP for completing prayers
    if (completed) {
      handleXpGain(5); // Prayer completion gives 5 XP
    } else {
      // Remove XP for uncompleting a prayer
      const newXp = Math.max(0, stats.xp - 5);
      
      // Update localStorage
      updateStats({
        ...stats,
        xp: newXp
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <DashboardHeader userName="Productivity Pro" date={date} />
        
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

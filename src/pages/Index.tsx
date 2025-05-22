
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
import { getStats, saveStats } from '@/utils/localStorage';

const Index = () => {
  const { toast } = useToast();
  const [date] = useState(new Date());
  const [focusSessions, setFocusSessions] = useState(0);
  const [tasksCompleted, setTasksCompleted] = useState(0);
  
  // User stats
  const [streak, setStreak] = useState(3);
  const [level, setLevel] = useState(2);
  const [xp, setXp] = useState(125);
  const [xpForNextLevel, setXpForNextLevel] = useState(200);

  // Load stats from localStorage
  useEffect(() => {
    const savedStats = getStats();
    setFocusSessions(savedStats.focusSessions);
    setTasksCompleted(savedStats.tasksCompleted);
    setStreak(savedStats.streak);
    setLevel(savedStats.level);
    setXp(savedStats.xp);
    setXpForNextLevel(savedStats.xpForNextLevel);
  }, []);

  // Function to handle XP gain and potential level up
  const handleXpGain = (amount: number) => {
    const newXp = xp + amount;
    let newLevel = level;
    let newXpForNextLevel = xpForNextLevel;
    
    // Check if leveled up
    if (newXp >= xpForNextLevel) {
      newLevel = level + 1;
      newXpForNextLevel = Math.round(xpForNextLevel * 1.5); // Increase XP needed for next level
      
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
    setXp(newXp);
    setLevel(newLevel);
    setXpForNextLevel(newXpForNextLevel);
    
    // Update localStorage
    saveStats({
      focusSessions,
      tasksCompleted,
      streak,
      level: newLevel,
      xp: newXp,
      xpForNextLevel: newXpForNextLevel
    });
    
    return { level: newLevel, xp: newXp };
  };

  const handleTaskComplete = (taskId: string, completed: boolean) => {
    if (completed) {
      const newTasksCompleted = tasksCompleted + 1;
      setTasksCompleted(newTasksCompleted);
      
      // Add XP for completing a task
      handleXpGain(10);
      
      // Update tasksCompleted in localStorage
      const stats = getStats();
      saveStats({
        ...stats,
        tasksCompleted: newTasksCompleted
      });
    } else {
      const newTasksCompleted = Math.max(0, tasksCompleted - 1);
      setTasksCompleted(newTasksCompleted);
      
      // Remove XP for uncompleting a task
      const newXp = Math.max(0, xp - 10);
      setXp(newXp);
      
      // Update localStorage
      const stats = getStats();
      saveStats({
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
      const newTasksCompleted = tasksCompleted + 1;
      setTasksCompleted(newTasksCompleted);
      
      const stats = getStats();
      saveStats({
        ...stats,
        tasksCompleted: newTasksCompleted
      });
    } else {
      // Remove XP for uncompleting a calendar task
      const newXp = Math.max(0, xp - 15);
      setXp(newXp);
      
      // Update localStorage
      const newTasksCompleted = Math.max(0, tasksCompleted - 1);
      setTasksCompleted(newTasksCompleted);
      
      const stats = getStats();
      saveStats({
        ...stats,
        tasksCompleted: newTasksCompleted,
        xp: newXp
      });
    }
  };

  const handleSessionComplete = () => {
    const newFocusSessions = focusSessions + 1;
    setFocusSessions(newFocusSessions);
    
    // Add XP for completing a focus session
    handleXpGain(25);
    
    // Update localStorage
    const stats = getStats();
    saveStats({
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
      const newXp = Math.max(0, xp - 5);
      setXp(newXp);
      
      // Update localStorage
      saveStats({
        ...getStats(),
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
            <UserStats 
              streak={streak}
              tasksCompleted={tasksCompleted}
              focusSessions={focusSessions}
              level={level}
              xp={xp}
              xpForNextLevel={xpForNextLevel}
            />
            
            <FocusTimer onSessionComplete={handleSessionComplete} />
          </div>
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default Index;

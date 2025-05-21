
import React, { useState, useEffect } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import DailyPlan from '@/components/DailyPlan';
import FocusTimer from '@/components/FocusTimer';
import DailyReflection from '@/components/DailyReflection';
import UserStats from '@/components/UserStats';
import TaskCalendar from '@/components/TaskCalendar';
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
  const [xpForNextLevel] = useState(200);

  // Load stats from localStorage
  useEffect(() => {
    const savedStats = getStats();
    setFocusSessions(savedStats.focusSessions);
    setTasksCompleted(savedStats.tasksCompleted);
    setStreak(savedStats.streak);
    setLevel(savedStats.level);
    setXp(savedStats.xp);
  }, []);

  const handleTaskComplete = (taskId: string, completed: boolean) => {
    if (completed) {
      const newTasksCompleted = tasksCompleted + 1;
      setTasksCompleted(newTasksCompleted);
      
      const newXp = xp + 10;
      setXp(newXp);
      
      // Check if leveled up
      if (newXp >= xpForNextLevel) {
        const newLevel = level + 1;
        setLevel(newLevel);
        toast({
          title: "Level Up!",
          description: `Congratulations! You're now level ${newLevel}!`,
          duration: 5000,
        });
      } else {
        toast({
          title: "Task completed!",
          description: "You earned 10 XP. Keep it up!",
          duration: 3000,
        });
      }
      
      // Update localStorage
      saveStats({
        focusSessions,
        tasksCompleted: newTasksCompleted,
        streak,
        level: newXp >= xpForNextLevel ? level + 1 : level,
        xp: newXp,
        xpForNextLevel
      });
    } else {
      const newTasksCompleted = Math.max(0, tasksCompleted - 1);
      setTasksCompleted(newTasksCompleted);
      
      // Update localStorage
      saveStats({
        focusSessions,
        tasksCompleted: newTasksCompleted,
        streak,
        level,
        xp: Math.max(0, xp - 10),
        xpForNextLevel
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

  const handleSessionComplete = () => {
    const newFocusSessions = focusSessions + 1;
    setFocusSessions(newFocusSessions);
    
    const newXp = xp + 25;
    setXp(newXp);
    
    // Check if leveled up
    if (newXp >= xpForNextLevel) {
      const newLevel = level + 1;
      setLevel(newLevel);
      toast({
        title: "Level Up!",
        description: `Congratulations! You're now level ${newLevel}!`,
        duration: 5000,
      });
    } else {
      toast({
        title: "Focus session completed!",
        description: "Great job! You earned 25 XP.",
        duration: 3000,
      });
    }
    
    // Update localStorage
    saveStats({
      focusSessions: newFocusSessions,
      tasksCompleted,
      streak,
      level: newXp >= xpForNextLevel ? level + 1 : level,
      xp: newXp,
      xpForNextLevel
    });
  };

  const handleSaveReflection = (reflection: { wins: string; improvements: string }) => {
    toast({
      title: "Reflection saved",
      description: "Your daily reflection has been saved",
      duration: 2000,
    });
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
            
            <TaskCalendar 
              onAddTask={handleCalendarTaskAdd}
              onTaskComplete={handleTaskComplete}
            />
            
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

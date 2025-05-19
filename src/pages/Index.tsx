
import React, { useState } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import DailyPlan from '@/components/DailyPlan';
import FocusTimer from '@/components/FocusTimer';
import DailyReflection from '@/components/DailyReflection';
import UserStats from '@/components/UserStats';
import TaskCalendar from '@/components/TaskCalendar';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [date] = useState(new Date());
  const [focusSessions, setFocusSessions] = useState(0);
  const [tasksCompleted, setTasksCompleted] = useState(0);
  
  // User stats
  const [streak] = useState(3);
  const [level] = useState(2);
  const [xp] = useState(125);
  const [xpForNextLevel] = useState(200);

  const handleTaskComplete = (taskId: string, completed: boolean) => {
    if (completed) {
      setTasksCompleted(prev => prev + 1);
      toast({
        title: "Task completed!",
        description: "You earned 10 XP. Keep it up!",
        duration: 3000,
      });
    } else {
      setTasksCompleted(prev => Math.max(0, prev - 1));
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
    setFocusSessions(prev => prev + 1);
    toast({
      title: "Focus session completed!",
      description: "Great job! You earned 25 XP.",
      duration: 3000,
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
    <div className="min-h-screen bg-background p-4 md:p-8">
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
    </div>
  );
};

export default Index;

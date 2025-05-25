
import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { saveReflection, getReflectionForDate, getTasks, saveTasks, getCalendarTasks, saveCalendarTasks } from '@/utils/localStorage';
import { RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DailyReflectionProps {
  date: Date;
  onSave: (reflection: { wins: string; improvements: string }) => void;
}

const DailyReflection: React.FC<DailyReflectionProps> = ({ date, onSave }) => {
  const [wins, setWins] = useState('');
  const [improvements, setImprovements] = useState('');
  const { toast } = useToast();

  // Format date for storage
  const dateString = date.toISOString().split('T')[0];
  
  // Load reflection from localStorage on component mount or date change
  useEffect(() => {
    const savedReflection = getReflectionForDate(dateString);
    if (savedReflection) {
      setWins(savedReflection.wins);
      setImprovements(savedReflection.improvements);
    } else {
      // Reset fields if no saved reflection for this date
      setWins('');
      setImprovements('');
    }
  }, [dateString]);

  const handleSave = () => {
    const reflection = { wins, improvements };
    
    // Save to localStorage
    saveReflection({
      date: dateString,
      wins,
      improvements
    });
    
    // Call parent handler
    onSave(reflection);
  };

  const handleReset = () => {
    // Reset reflection
    setWins('');
    setImprovements('');
    
    // Reset daily tasks
    const tasks = getTasks();
    const resetTasks = tasks.map(task => ({ ...task, completed: false }));
    saveTasks(resetTasks);
    
    // Reset calendar tasks for today
    const calendarTasks = getCalendarTasks();
    const resetCalendarTasks = calendarTasks.map(task => {
      if (task.date === dateString) {
        return { ...task, completed: false };
      }
      return task;
    });
    saveCalendarTasks(resetCalendarTasks);
    
    // Clear reflection from localStorage
    saveReflection({
      date: dateString,
      wins: '',
      improvements: ''
    });
    
    toast({
      title: "Day Reset",
      description: "Your daily tasks and reflection have been reset. Start fresh!",
      duration: 3000,
    });
    
    // Reload the page to reflect changes
    window.location.reload();
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Reflection</CardTitle>
        <CardDescription>{formatDate(date)}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 block">What went well today?</label>
          <Textarea
            placeholder="List your wins and accomplishments..."
            value={wins}
            onChange={(e) => setWins(e.target.value)}
            className="resize-none"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">What could be improved?</label>
          <Textarea
            placeholder="Areas to focus on tomorrow..."
            value={improvements}
            onChange={(e) => setImprovements(e.target.value)}
            className="resize-none"
          />
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button onClick={handleSave} className="flex-1">Save Reflection</Button>
        <Button 
          onClick={handleReset} 
          variant="outline" 
          className="flex items-center gap-2"
        >
          <RotateCcw size={16} />
          Reset Day
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DailyReflection;

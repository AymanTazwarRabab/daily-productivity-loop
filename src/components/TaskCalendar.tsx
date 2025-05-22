
import React, { useState, useEffect } from 'react';
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DayContent } from "react-day-picker";
import { getCalendarTasks, saveCalendarTasks, StoredCalendarTask } from '@/utils/localStorage';

interface CalendarTask {
  id: string;
  title: string;
  date: Date;
  completed: boolean;
}

interface TaskCalendarProps {
  onAddTask: (task: Omit<CalendarTask, 'id'>) => void;
  onTaskComplete?: (taskId: string, completed: boolean) => void;
}

const TaskCalendar: React.FC<TaskCalendarProps> = ({ onAddTask, onTaskComplete }) => {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [tasks, setTasks] = useState<CalendarTask[]>([]);
  
  // Load tasks from localStorage
  useEffect(() => {
    const storedTasks = getCalendarTasks();
    if (storedTasks && storedTasks.length > 0) {
      // Convert ISO date strings to Date objects
      const tasksWithDates: CalendarTask[] = storedTasks.map(task => ({
        ...task,
        date: new Date(task.date)
      }));
      setTasks(tasksWithDates);
    } else {
      // Default tasks if none exist
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const defaultTasks: CalendarTask[] = [
        { id: '101', title: 'Team meeting', date: today, completed: false },
        { id: '102', title: 'Review project', date: tomorrow, completed: false },
      ];
      
      setTasks(defaultTasks);
      
      // Save to localStorage
      const tasksForStorage: StoredCalendarTask[] = defaultTasks.map(task => ({
        ...task,
        date: task.date.toISOString()
      }));
      saveCalendarTasks(tasksForStorage);
    }
  }, []);
  
  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (tasks.length > 0) {
      const tasksForStorage: StoredCalendarTask[] = tasks.map(task => ({
        ...task,
        date: task.date.toISOString()
      }));
      saveCalendarTasks(tasksForStorage);
    }
  }, [tasks]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setIsAddTaskDialogOpen(true);
    }
  };

  const handleAddTask = () => {
    if (newTaskTitle.trim() === '' || !selectedDate) return;
    
    const newTask = {
      title: newTaskTitle,
      date: selectedDate,
      completed: false
    };
    
    // Add to local state
    const newTaskWithId = { ...newTask, id: Date.now().toString() };
    setTasks([...tasks, newTaskWithId]);
    
    // Call parent handler
    onAddTask(newTask);
    
    // Reset form and close dialog
    setNewTaskTitle('');
    setIsAddTaskDialogOpen(false);
  };

  const handleTaskToggle = (taskId: string, completed: boolean) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed } : task
    ));
    
    if (onTaskComplete) {
      onTaskComplete(taskId, completed);
    }
  };

  // Function to get tasks for a specific date
  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => 
      task.date.getDate() === date.getDate() &&
      task.date.getMonth() === date.getMonth() &&
      task.date.getFullYear() === date.getFullYear()
    );
  };

  // Function to render task indicators on calendar days
  const renderTaskIndicators = (day: Date) => {
    const dayTasks = getTasksForDate(day);
    if (dayTasks.length === 0) return null;
    
    return (
      <div className="flex justify-center">
        <div className="h-1 w-1 bg-primary rounded-full"></div>
      </div>
    );
  };

  const formatDate = (date: Date) => {
    return format(date, "EEEE, MMMM d, yyyy");
  };

  // Custom day content renderer compatible with react-day-picker types
  const CustomDayContent = (props: React.ComponentProps<typeof DayContent>) => {
    return (
      <div className="relative w-full h-full">
        <div>{props.date.getDate()}</div>
        {renderTaskIndicators(props.date)}
      </div>
    );
  };

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="flex justify-between items-center text-base font-medium">
          <span>Task Calendar</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                {format(date, "MMM yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                onSelect={setDate}
                selected={date}
                components={{
                  DayContent: CustomDayContent,
                }}
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid gap-4 grid-cols-1">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => {
              if (date) {
                setDate(date);
                handleDateSelect(date);
              }
            }}
            className={cn("p-2 pointer-events-auto rounded-md border")}
            components={{
              DayContent: CustomDayContent,
            }}
          />
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Tasks for {format(date, "MMM d")}</h3>
            <div className="max-h-[200px] overflow-y-auto space-y-1">
              {getTasksForDate(date).length > 0 ? (
                getTasksForDate(date).map(task => (
                  <div key={task.id} className="flex items-center justify-between py-1 px-2 border rounded-md text-sm">
                    <div className="flex items-center">
                      <input 
                        type="checkbox"
                        checked={task.completed}
                        onChange={(e) => handleTaskToggle(task.id, e.target.checked)}
                        className="mr-2"
                      />
                      <span className={task.completed ? "line-through text-muted-foreground" : ""}>
                        {task.title}
                      </span>
                    </div>
                    {task.completed && <Badge variant="outline" className="bg-green-100 text-xs">Done</Badge>}
                  </div>
                ))
              ) : (
                <p className="text-center py-1 text-muted-foreground text-sm">
                  No tasks for this date.
                </p>
              )}
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              className="w-full" 
              onClick={() => setIsAddTaskDialogOpen(true)}
            >
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Task
            </Button>
          </div>
        </div>
      </CardContent>

      {/* Dialog for adding new tasks */}
      <Dialog open={isAddTaskDialogOpen} onOpenChange={setIsAddTaskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Task for {selectedDate ? format(selectedDate, "EEEE, MMMM d, yyyy") : ""}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter task title..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTaskDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTask}>Add Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TaskCalendar;

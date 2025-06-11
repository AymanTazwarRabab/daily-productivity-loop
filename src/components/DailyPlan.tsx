
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TaskItem from './TaskItem';
import { getTasks, saveTasks, StoredTask } from '@/utils/localStorage';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 1 | 2 | 3; // 1 = high, 2 = medium, 3 = low
}

interface DailyPlanProps {
  date: Date;
  onTaskComplete: (taskId: string, completed: boolean) => void;
  onAddTask: (task: Omit<Task, 'id'>) => void;
}

const DailyPlan: React.FC<DailyPlanProps> = ({ date, onTaskComplete, onAddTask }) => {
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState<1 | 2 | 3>(2);
  const [tasks, setTasks] = useState<Task[]>([]);
  const { toast } = useToast();

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const storedTasks = getTasks();
    if (storedTasks && storedTasks.length > 0) {
      setTasks(storedTasks);
    } else {
      // Default tasks if none exist
      const defaultTasks: Task[] = [
        { id: '1', title: 'Complete project presentation', completed: false, priority: 1 },
        { id: '2', title: 'Read 20 pages', completed: false, priority: 2 },
        { id: '3', title: 'Go for a 30-minute walk', completed: false, priority: 3 },
      ];
      setTasks(defaultTasks);
      saveTasks(defaultTasks);
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (tasks.length > 0) {
      saveTasks(tasks);
    }
  }, [tasks]);

  const handleAddTask = () => {
    if (newTask.trim() === '') return;
    
    const task = {
      title: newTask,
      completed: false,
      priority,
    };
    
    // Add to local state
    const newTaskWithId = { ...task, id: Date.now().toString() };
    setTasks([...tasks, newTaskWithId]);
    
    // Call parent handler
    onAddTask(task);
    
    // Show success toast
    toast({
      title: "Task Added",
      description: `"${newTask}" has been added to your tasks.`,
      duration: 3000,
    });
    
    // Reset form
    setNewTask('');
    setPriority(2);
  };

  const handleToggleTask = (id: string, completed: boolean) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed } : task
    ));
    onTaskComplete(id, completed);
  };
  
  const handleRemoveTask = (id: string) => {
    // Find the task to get its title for the toast message
    const taskToRemove = tasks.find(task => task.id === id);
    
    // Remove the task from state
    setTasks(tasks.filter(task => task.id !== id));
    
    // Show success toast
    toast({
      title: "Task Removed",
      description: taskToRemove ? `"${taskToRemove.title}" has been removed.` : "Task has been removed.",
      duration: 3000,
    });
  };

  const handlePriorityChange = (value: string) => {
    setPriority(parseInt(value) as 1 | 2 | 3);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const remainingTasks = tasks.filter(t => !t.completed).length;
  const completedTasks = tasks.filter(t => t.completed).length;

  return (
    <Card className="card-interactive">
      <CardHeader>
        <CardTitle className="text-gradient-primary">Today's Plan</CardTitle>
        <CardDescription>{formatDate(date)}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Add a task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
              />
            </div>
            <Button onClick={handleAddTask} className="btn-enhanced">
              <Plus size={16} className="mr-1" />
              Add
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Priority:</span>
            <Select value={priority.toString()} onValueChange={handlePriorityChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">High Priority</SelectItem>
                <SelectItem value="2">Medium Priority</SelectItem>
                <SelectItem value="3">Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Most Important Tasks ({remainingTasks} remaining)</h4>
          
          {/* Active Tasks */}
          {tasks.filter(task => !task.completed).length > 0 && (
            <div className="space-y-2 mb-4 stagger-fade-in">
              <h5 className="text-xs font-medium text-muted-foreground">Active Tasks</h5>
              {tasks
                .filter(task => !task.completed)
                .sort((a, b) => a.priority - b.priority)
                .map((task) => (
                  <div key={task.id} className="flex items-center gap-1">
                    <TaskItem
                      id={task.id}
                      title={task.title}
                      completed={task.completed}
                      priority={task.priority}
                      onToggle={handleToggleTask}
                    />
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive btn-enhanced"
                      onClick={() => handleRemoveTask(task.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
              ))}
            </div>
          )}
          
          {/* Completed Tasks */}
          {completedTasks > 0 && (
            <div className="space-y-2 stagger-fade-in">
              <h5 className="text-xs font-medium text-muted-foreground">Completed Tasks</h5>
              {tasks
                .filter(task => task.completed)
                .map((task) => (
                  <div key={task.id} className="flex items-center gap-1">
                    <TaskItem
                      id={task.id}
                      title={task.title}
                      completed={task.completed}
                      priority={task.priority}
                      onToggle={handleToggleTask}
                    />
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive btn-enhanced"
                      onClick={() => handleRemoveTask(task.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
              ))}
            </div>
          )}
          
          {tasks.length === 0 && (
            <p className="text-center py-4 text-muted-foreground">
              No tasks added yet. Add your first task above!
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 justify-between">
        <p className="text-sm text-muted-foreground">
          {tasks.filter(t => t.completed).length} of {tasks.length} completed
        </p>
        {tasks.length > 0 && tasks.every(t => t.completed) && (
          <div className="bg-primary/10 backdrop-blur-sm text-primary text-xs rounded-full px-3 py-1 border border-primary/30 hover:border-primary/50 transition-all duration-300">
            All done! 🎉
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default DailyPlan;

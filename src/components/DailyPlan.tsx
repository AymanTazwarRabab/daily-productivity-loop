
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import TaskItem from './TaskItem';

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
  
  // Sample tasks - in a real app, these would come from props or state management
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Complete project presentation', completed: false, priority: 1 },
    { id: '2', title: 'Read 20 pages', completed: false, priority: 2 },
    { id: '3', title: 'Go for a 30-minute walk', completed: false, priority: 3 },
  ]);

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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const remainingTasks = tasks.filter(t => !t.completed).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Plan</CardTitle>
        <CardDescription>{formatDate(date)}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Input
              placeholder="Add a task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            />
          </div>
          <div className="space-x-1">
            <Button 
              size="sm" 
              variant={priority === 1 ? "default" : "outline"}
              onClick={() => setPriority(1)}
              className="px-2 w-8 h-8"
            >
              1
            </Button>
            <Button 
              size="sm" 
              variant={priority === 2 ? "default" : "outline"}
              onClick={() => setPriority(2)}
              className="px-2 w-8 h-8"
            >
              2
            </Button>
            <Button 
              size="sm" 
              variant={priority === 3 ? "default" : "outline"}
              onClick={() => setPriority(3)}
              className="px-2 w-8 h-8"
            >
              3
            </Button>
          </div>
          <Button onClick={handleAddTask}>Add</Button>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Most Important Tasks ({remainingTasks} remaining)</h4>
          <div className="space-y-2">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                id={task.id}
                title={task.title}
                completed={task.completed}
                priority={task.priority}
                onToggle={handleToggleTask}
              />
            ))}
            {tasks.length === 0 && (
              <p className="text-center py-4 text-muted-foreground">
                No tasks added yet. Add your first task above!
              </p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 justify-between">
        <p className="text-sm text-muted-foreground">
          {tasks.filter(t => t.completed).length} of {tasks.length} completed
        </p>
        {tasks.length > 0 && tasks.every(t => t.completed) && (
          <div className="stats-pill">All done! 🎉</div>
        )}
      </CardFooter>
    </Card>
  );
};

export default DailyPlan;

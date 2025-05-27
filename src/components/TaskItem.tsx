
import React from 'react';
import { Check, Clock } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  id: string;
  title: string;
  completed: boolean;
  priority: 1 | 2 | 3;
  onToggle: (id: string, completed: boolean) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  id,
  title,
  completed,
  priority,
  onToggle,
}) => {
  const priorityStyles = {
    1: { 
      bg: 'from-destructive/20 to-destructive/10', 
      border: 'border-destructive/30', 
      text: 'text-destructive',
      indicator: 'bg-destructive'
    },
    2: { 
      bg: 'from-primary/20 to-accent/10', 
      border: 'border-primary/30', 
      text: 'text-primary',
      indicator: 'bg-primary'
    },
    3: { 
      bg: 'from-secondary/30 to-muted/20', 
      border: 'border-muted/30', 
      text: 'text-muted-foreground',
      indicator: 'bg-muted-foreground'
    },
  };

  const style = priorityStyles[priority];

  return (
    <div className={cn(
      "task-item group flex items-center gap-3 p-3 rounded-lg w-full transition-all duration-300 hover:scale-[1.02] relative overflow-hidden",
      completed 
        ? "bg-muted/30 text-muted-foreground backdrop-blur-sm" 
        : `bg-gradient-to-r ${style.bg} hover:shadow-md ${style.border} border backdrop-blur-sm`
    )}>
      {/* Priority Indicator */}
      <div className={cn(
        "w-1 self-stretch rounded-full transition-all duration-300",
        style.indicator,
        completed && "opacity-50"
      )} />
      
      {/* Checkbox */}
      <Checkbox
        id={`task-${id}`}
        checked={completed}
        onCheckedChange={(checked) => onToggle(id, checked as boolean)}
        className={cn(
          "data-[state=checked]:bg-primary transition-all duration-300 hover:scale-110"
        )}
      />
      
      {/* Task Title */}
      <label
        htmlFor={`task-${id}`}
        className={cn(
          "flex-1 text-sm font-medium cursor-pointer transition-all duration-300 hover:text-primary text-readable",
          completed && "line-through opacity-70"
        )}
      >
        {title}
      </label>
      
      {/* Status Icon */}
      <div className="flex items-center justify-center w-6 h-6">
        {completed ? (
          <Check 
            size={16} 
            className="text-primary transition-all duration-300" 
          />
        ) : (
          <Clock 
            size={16} 
            className={cn(
              "transition-all duration-300 group-hover:text-primary",
              style.text
            )} 
          />
        )}
      </div>
      
      {/* Hover Shimmer Effect */}
      {!completed && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
      )}
    </div>
  );
};

export default TaskItem;


import React from 'react';
import { Check, Clock, Flag } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  id: string;
  title: string;
  completed: boolean;
  priority: 1 | 2 | 3;
  onToggle: (id: string, completed: boolean) => void;
  onPriorityChange?: (id: string, priority: 1 | 2 | 3) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  id,
  title,
  completed,
  priority,
  onToggle,
  onPriorityChange,
}) => {
  const priorityColors = {
    1: 'bg-destructive/20 border-destructive/30 text-destructive', // High priority
    2: 'bg-primary/20 border-primary/30 text-primary', // Medium priority
    3: 'bg-muted border-muted/50 text-muted-foreground', // Low priority
  };
  
  const priorityLabels = {
    1: 'High',
    2: 'Medium',
    3: 'Low'
  };

  const handlePriorityClick = () => {
    if (onPriorityChange) {
      // Cycle through priorities: 1 -> 2 -> 3 -> 1
      const newPriority = (priority % 3) + 1 as 1 | 2 | 3;
      onPriorityChange(id, newPriority);
    }
  };

  return (
    <div className={cn(
      "task-item group flex items-center gap-2 p-2 rounded-md w-full",
      completed ? "bg-muted/50 text-muted-foreground" : "hover:bg-secondary/50"
    )}>
      <div className={cn(
        "w-1 self-stretch rounded-full",
        priorityColors[priority]
      )} />
      <Checkbox
        id={`task-${id}`}
        checked={completed}
        onCheckedChange={(checked) => onToggle(id, checked as boolean)}
        className="data-[state=checked]:bg-primary"
      />
      <label
        htmlFor={`task-${id}`}
        className={cn(
          "flex-1 text-sm font-medium cursor-pointer",
          completed && "line-through"
        )}
      >
        {title}
      </label>
      
      {onPriorityChange && !completed && (
        <button
          onClick={handlePriorityClick}
          className={cn(
            "flex items-center px-2 py-0.5 rounded text-xs font-medium",
            priority === 1 ? "bg-destructive/10 text-destructive" : 
            priority === 2 ? "bg-primary/10 text-primary" :
            "bg-muted text-muted-foreground"
          )}
        >
          <Flag className="w-3 h-3 mr-1" />
          {priorityLabels[priority]}
        </button>
      )}
      
      {completed ? (
        <Check size={16} className="text-primary" />
      ) : (
        <Clock size={16} className="text-muted-foreground" />
      )}
    </div>
  );
};

export default TaskItem;

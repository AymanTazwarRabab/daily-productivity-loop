
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
  const priorityColors = {
    1: 'bg-destructive/20 border-destructive/30 text-destructive', // High priority
    2: 'bg-primary/20 border-primary/30 text-primary', // Medium priority
    3: 'bg-muted border-muted/50 text-muted-foreground', // Low priority
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
      {completed ? (
        <Check size={16} className="text-primary" />
      ) : (
        <Clock size={16} className="text-muted-foreground" />
      )}
    </div>
  );
};

export default TaskItem;


import React, { useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface FocusTimerProps {
  onSessionComplete: () => void;
}

const FocusTimer: React.FC<FocusTimerProps> = ({ onSessionComplete }) => {
  // Default to 25 minutes (in seconds)
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [progress, setProgress] = useState(100);
  
  const focusTime = 25 * 60; // 25 minutes
  const breakTime = 5 * 60; // 5 minutes

  useEffect(() => {
    let interval: number | undefined;
    
    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
        setProgress((timeLeft - 1) / (isBreak ? breakTime : focusTime) * 100);
      }, 1000);
    } else if (timeLeft === 0) {
      // Session completed
      if (!isBreak) {
        onSessionComplete();
        // Switch to break
        setIsBreak(true);
        setTimeLeft(breakTime);
        setProgress(100);
      } else {
        // Break completed, reset to focus time
        setIsBreak(false);
        setTimeLeft(focusTime);
        setProgress(100);
      }
      setIsRunning(false);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, isBreak, onSessionComplete, breakTime, focusTime]);

  const toggleTimer = () => {
    setIsRunning(prev => !prev);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(isBreak ? breakTime : focusTime);
    setProgress(100);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="focus-card p-6 flex flex-col items-center">
      <h3 className="text-xl font-bold mb-4">
        {isBreak ? 'Break Time' : 'Focus Session'}
      </h3>
      
      <div className="relative w-40 h-40 mb-6">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-bold">{formatTime(timeLeft)}</span>
        </div>
        <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={isBreak ? "hsl(var(--secondary))" : "hsl(var(--primary))"}
            strokeWidth="8"
            strokeDasharray="283"
            strokeDashoffset={283 - (283 * progress) / 100}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
      </div>
      
      <div className="flex space-x-2">
        <Button 
          onClick={toggleTimer}
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full"
        >
          {isRunning ? <Pause size={18} /> : <Play size={18} />}
        </Button>
        <Button 
          onClick={resetTimer}
          variant="secondary"
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default FocusTimer;

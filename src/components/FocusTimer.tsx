
import React, { useState, useEffect } from 'react';
import { Play, Pause, Timer, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { getSettings, saveSettings } from '@/utils/localStorage';

interface FocusTimerProps {
  onSessionComplete: () => void;
}

const FocusTimer: React.FC<FocusTimerProps> = ({ onSessionComplete }) => {
  const minFocusTime = 20; // 20 minutes minimum
  const maxFocusTime = 90; // 90 minutes maximum
  
  const [defaultFocusTime, setDefaultFocusTime] = useState(25);
  const [focusMinutes, setFocusMinutes] = useState(defaultFocusTime);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [timeLeft, setTimeLeft] = useState(defaultFocusTime * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [progress, setProgress] = useState(100);
  const [showSettings, setShowSettings] = useState(false);
  
  const focusTime = focusMinutes * 60; // Convert to seconds
  const breakTime = breakMinutes * 60; // Convert to seconds

  // Load settings from localStorage
  useEffect(() => {
    const settings = getSettings();
    setDefaultFocusTime(settings.defaultFocusTime);
    setFocusMinutes(settings.defaultFocusTime);
    setBreakMinutes(settings.breakTime);
    setTimeLeft(settings.defaultFocusTime * 60);
  }, []);

  useEffect(() => {
    // Update timeLeft when focusMinutes changes (only when timer is not running)
    if (!isRunning && !isBreak) {
      setTimeLeft(focusMinutes * 60);
      setProgress(100);
    }
  }, [focusMinutes, isRunning, isBreak]);

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

  const handleFocusTimeChange = (value: number[]) => {
    if (!isRunning) {
      setFocusMinutes(value[0]);
    }
  };

  const handleBreakTimeChange = (value: number[]) => {
    if (!isRunning && !isBreak) {
      setBreakMinutes(value[0]);
    }
  };

  const handleDefaultFocusTimeChange = (value: number[]) => {
    setDefaultFocusTime(value[0]);
  };

  const saveDefaultSettings = () => {
    const settings = {
      defaultFocusTime,
      breakTime: breakMinutes
    };
    saveSettings(settings);
    setShowSettings(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="focus-card p-6 flex flex-col items-center">
      <h3 className="text-xl font-bold mb-4 flex justify-between w-full">
        <span>{isBreak ? 'Break Time' : 'Focus Session'}</span>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowSettings(!showSettings)}
          className="h-7 w-7 p-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
        </Button>
      </h3>
      
      {showSettings ? (
        <div className="w-full space-y-4 mb-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Default session length</span>
              <span className="text-sm font-medium">{defaultFocusTime} min</span>
            </div>
            <div className="flex items-center space-x-2">
              <Timer size={16} />
              <Slider 
                value={[defaultFocusTime]}
                min={minFocusTime} 
                max={maxFocusTime} 
                step={5}
                onValueChange={handleDefaultFocusTimeChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Break duration</span>
              <span className="text-sm font-medium">{breakMinutes} min</span>
            </div>
            <div className="flex items-center space-x-2">
              <Timer size={16} />
              <Slider 
                value={[breakMinutes]}
                min={1} 
                max={15} 
                step={1}
                onValueChange={handleBreakTimeChange}
              />
            </div>
          </div>
          
          <Button onClick={saveDefaultSettings} className="w-full">
            <Save size={16} className="mr-2" /> Save Settings
          </Button>
        </div>
      ) : (
        <>
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
          
          {!isRunning && !isBreak && (
            <div className="w-full mb-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Session duration</span>
                <span className="text-sm font-medium">{focusMinutes} minutes</span>
              </div>
              <div className="flex items-center space-x-2">
                <Timer size={16} />
                <Slider 
                  defaultValue={[defaultFocusTime]} 
                  value={[focusMinutes]}
                  min={minFocusTime} 
                  max={maxFocusTime} 
                  step={5}
                  onValueChange={handleFocusTimeChange}
                  disabled={isRunning}
                />
              </div>
            </div>
          )}
          
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
        </>
      )}
    </div>
  );
};

export default FocusTimer;

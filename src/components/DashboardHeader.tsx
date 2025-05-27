
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Calendar, Clock } from 'lucide-react';

interface DashboardHeaderProps {
  userName: string;
  date: Date;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userName, date }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const greeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    if (hour < 21) return 'Good evening';
    return 'Good night';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  return (
    <Card className="card-interactive relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10"></div>
      <CardContent className="p-6 relative z-10">
        <div className="flex justify-between items-start">
          <div className="stagger-fade-in">
            <h1 className="text-3xl font-bold mb-1 text-gradient-primary">
              {greeting()}, {userName}
            </h1>
            <p className="text-muted-foreground flex items-center hover:text-foreground transition-colors duration-300">
              <Calendar size={14} className="mr-1 text-primary" /> 
              {formatDate(date)}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-secondary/30 backdrop-blur-sm rounded-lg px-3 py-2 border border-border/50 hover:bg-secondary/40 transition-all duration-300">
              <Clock size={16} className="mr-2 text-primary" />
              <span className="font-mono text-lg font-semibold text-primary-readable">
                {formatTime(currentTime)}
              </span>
            </div>
            <Button className="btn-enhanced bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
              <Check size={16} className="mr-2" /> 
              Check In
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardHeader;

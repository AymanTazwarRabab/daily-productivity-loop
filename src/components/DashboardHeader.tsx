
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
    <Card className="bg-primary text-primary-foreground">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-1">{greeting()}, {userName}</h1>
            <p className="text-primary-foreground/80 flex items-center">
              <Calendar size={14} className="mr-1" /> {formatDate(date)}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white/10 rounded-lg px-3 py-2">
              <Clock size={16} className="mr-2" />
              <span className="font-mono text-lg">{formatTime(currentTime)}</span>
            </div>
            <Button variant="secondary" className="bg-white/10 hover:bg-white/20">
              <Check size={16} className="mr-2" /> Check In
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardHeader;


import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Calendar } from 'lucide-react';

interface DashboardHeaderProps {
  userName: string;
  date: Date;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userName, date }) => {
  const greeting = () => {
    const hour = date.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    }).format(date);
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
          <Button variant="secondary" className="bg-white/10 hover:bg-white/20">
            <Check size={16} className="mr-2" /> Check In
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardHeader;

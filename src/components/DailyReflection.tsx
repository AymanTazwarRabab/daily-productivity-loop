
import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { saveReflection, getReflectionForDate } from '@/utils/localStorage';

interface DailyReflectionProps {
  date: Date;
  onSave: (reflection: { wins: string; improvements: string }) => void;
}

const DailyReflection: React.FC<DailyReflectionProps> = ({ date, onSave }) => {
  const [wins, setWins] = useState('');
  const [improvements, setImprovements] = useState('');

  // Format date for storage
  const dateString = date.toISOString().split('T')[0];
  
  // Load reflection from localStorage on component mount or date change
  useEffect(() => {
    const savedReflection = getReflectionForDate(dateString);
    if (savedReflection) {
      setWins(savedReflection.wins);
      setImprovements(savedReflection.improvements);
    } else {
      // Reset fields if no saved reflection for this date
      setWins('');
      setImprovements('');
    }
  }, [dateString]);

  const handleSave = () => {
    const reflection = { wins, improvements };
    
    // Save to localStorage
    saveReflection({
      date: dateString,
      wins,
      improvements
    });
    
    // Call parent handler
    onSave(reflection);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Reflection</CardTitle>
        <CardDescription>{formatDate(date)}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 block">What went well today?</label>
          <Textarea
            placeholder="List your wins and accomplishments..."
            value={wins}
            onChange={(e) => setWins(e.target.value)}
            className="resize-none"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">What could be improved?</label>
          <Textarea
            placeholder="Areas to focus on tomorrow..."
            value={improvements}
            onChange={(e) => setImprovements(e.target.value)}
            className="resize-none"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} className="w-full">Save Reflection</Button>
      </CardFooter>
    </Card>
  );
};

export default DailyReflection;

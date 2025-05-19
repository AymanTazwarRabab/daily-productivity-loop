
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface DailyReflectionProps {
  date: Date;
  onSave: (reflection: { wins: string; improvements: string; gratitude: string }) => void;
}

const DailyReflection: React.FC<DailyReflectionProps> = ({ date, onSave }) => {
  const [wins, setWins] = useState('');
  const [improvements, setImprovements] = useState('');
  const [gratitude, setGratitude] = useState('');

  const handleSave = () => {
    onSave({ wins, improvements, gratitude });
    setWins('');
    setImprovements('');
    setGratitude('');
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
        
        <div>
          <label className="text-sm font-medium mb-1 block">What are you grateful for?</label>
          <Textarea
            placeholder="Express gratitude for something today..."
            value={gratitude}
            onChange={(e) => setGratitude(e.target.value)}
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

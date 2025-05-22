import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type PrayerName = 'Fajr' | 'Zuhr' | 'Asr' | 'Maghrib' | 'Isha';

interface Prayer {
  name: PrayerName;
  completed: boolean;
  time: string;
}

const PrayerTimes = () => {
  const [prayers, setPrayers] = useState<Prayer[]>([
    { name: 'Fajr', completed: false, time: '05:30' },
    { name: 'Zuhr', completed: false, time: '13:00' },
    { name: 'Asr', completed: false, time: '16:30' },
    { name: 'Maghrib', completed: false, time: '19:15' },
    { name: 'Isha', completed: false, time: '20:45' }
  ]);
  const { toast } = useToast();

  // Try to load saved prayer status from localStorage on component mount
  useEffect(() => {
    const savedPrayers = localStorage.getItem('prayerTimes');
    if (savedPrayers) {
      try {
        const parsedPrayers = JSON.parse(savedPrayers);
        // If it's the same day, use the saved data
        const today = new Date().toDateString();
        if (parsedPrayers.date === today) {
          setPrayers(parsedPrayers.prayers);
        } else {
          // Reset prayers for the new day but keep the times
          const resetPrayers = prayers.map(p => ({
            ...p,
            completed: false
          }));
          setPrayers(resetPrayers);
          savePrayers(resetPrayers);
        }
      } catch (e) {
        console.error('Error parsing saved prayers', e);
      }
    }
  }, []);

  const savePrayers = (updatedPrayers: Prayer[]) => {
    const today = new Date().toDateString();
    localStorage.setItem('prayerTimes', JSON.stringify({
      date: today,
      prayers: updatedPrayers
    }));
  };

  const handlePrayerToggle = (index: number) => {
    const updatedPrayers = [...prayers];
    const newStatus = !updatedPrayers[index].completed;
    updatedPrayers[index].completed = newStatus;
    setPrayers(updatedPrayers);
    savePrayers(updatedPrayers);
    
    toast({
      title: newStatus ? `${prayers[index].name} Prayer Completed` : `${prayers[index].name} Prayer Marked as Incomplete`,
      description: newStatus ? "May Allah accept your prayers." : "Prayer status updated.",
      duration: 3000,
    });
  };

  const getNextPrayer = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    for (const prayer of prayers) {
      const [hours, minutes] = prayer.time.split(':').map(Number);
      const prayerTime = hours * 60 + minutes;
      
      if (prayerTime > currentTime && !prayer.completed) {
        return prayer;
      }
    }
    
    // If all prayers for today are done or passed, next is tomorrow's Fajr
    return prayers[0];
  };
  
  const nextPrayer = getNextPrayer();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prayer Times</CardTitle>
        <CardDescription>
          Next prayer: {nextPrayer.name} at {nextPrayer.time}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {prayers.map((prayer, index) => (
            <div 
              key={prayer.name}
              className={cn(
                "flex items-center justify-between p-3 rounded-md border",
                prayer.completed ? "bg-muted/30" : "hover:bg-accent/50"
              )}
            >
              <div className="flex items-center gap-3">
                <Button
                  variant={prayer.completed ? "outline" : "default"}
                  size="sm"
                  className={cn(
                    "h-8 w-8 p-0",
                    prayer.completed ? "bg-primary/20 text-primary" : ""
                  )}
                  onClick={() => handlePrayerToggle(index)}
                >
                  {prayer.completed ? <Check size={16} /> : <Clock size={16} />}
                </Button>
                <div>
                  <p className={cn("font-medium", prayer.completed && "text-muted-foreground")}>
                    {prayer.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{prayer.time}</p>
                </div>
              </div>
              <div>
                {prayer.completed ? (
                  <span className="text-xs font-medium text-primary py-1 px-2 bg-primary/10 rounded-full">
                    Completed
                  </span>
                ) : (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handlePrayerToggle(index)}
                  >
                    Mark Complete
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PrayerTimes;

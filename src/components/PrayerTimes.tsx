
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { RefreshCcw } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface Prayer {
  name: string;
  time: string;
  completed: boolean;
}

interface PrayerTimesProps {
  onPrayerComplete?: (prayerName: string, completed: boolean) => void;
}

const PrayerTimes: React.FC<PrayerTimesProps> = ({ onPrayerComplete }) => {
  const { toast } = useToast();
  const [prayers, setPrayers] = useState<Prayer[]>(() => {
    const savedPrayers = localStorage.getItem('prayers');
    if (savedPrayers) {
      return JSON.parse(savedPrayers);
    }
    return [
      { name: 'Fajr', time: '5:15 AM', completed: false },
      { name: 'Zuhr', time: '1:30 PM', completed: false },
      { name: 'Asr', time: '4:45 PM', completed: false },
      { name: 'Maghrib', time: '6:53 PM', completed: false },
      { name: 'Isha', time: '8:15 PM', completed: false },
    ];
  });

  // Save prayers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('prayers', JSON.stringify(prayers));
  }, [prayers]);

  const handleTogglePrayer = (index: number) => {
    const newPrayers = [...prayers];
    newPrayers[index].completed = !newPrayers[index].completed;
    setPrayers(newPrayers);

    if (onPrayerComplete) {
      onPrayerComplete(prayers[index].name, newPrayers[index].completed);
    }

    toast({
      title: newPrayers[index].completed ? "Prayer completed" : "Prayer marked as incomplete",
      description: `${prayers[index].name} prayer has been ${newPrayers[index].completed ? 'completed' : 'unmarked'}`,
      duration: 2000,
    });
  };

  const handleResetPrayers = () => {
    const newPrayers = prayers.map(prayer => ({ ...prayer, completed: false }));
    setPrayers(newPrayers);
    
    toast({
      title: "Prayers reset",
      description: "All prayers have been reset for a new day",
      duration: 3000,
    });
  };

  return (
    <Card className="h-full card-interactive">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-medium text-gradient-primary">Daily Prayers</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 btn-enhanced">
                <RefreshCcw className="h-3.5 w-3.5 mr-1" />
                Reset
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset Prayer Tracking</AlertDialogTitle>
                <AlertDialogDescription>
                  This will mark all prayers as incomplete for a new day. Do you want to continue?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleResetPrayers}>Reset</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="space-y-2 stagger-fade-in">
          {prayers.map((prayer, index) => (
            <li key={prayer.name} className="flex items-center justify-between p-2 rounded-md border hover:border-border/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
              <div>
                <div className="font-medium text-readable">{prayer.name}</div>
                <div className="text-sm text-muted-foreground">{prayer.time}</div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={prayer.completed}
                  onChange={() => handleTogglePrayer(index)}
                  className="h-4 w-4 rounded border-gray-300 transition-all duration-300 hover:scale-110"
                />
                <span className={`text-xs transition-colors duration-300 ${prayer.completed ? 'text-green-600' : 'text-amber-600'}`}>
                  {prayer.completed ? 'Completed' : 'Due'}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default PrayerTimes;


import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { getStats, saveStats, getSettings, saveSettings } from '@/utils/localStorage';
import { Settings as SettingsIcon, RefreshCcw } from 'lucide-react';

const Settings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState(getSettings());
  const [stats, setStats] = useState(getStats());

  const handleFocusTimeChange = (value: number[]) => {
    const newSettings = { ...settings, defaultFocusTime: value[0] };
    setSettings(newSettings);
    saveSettings(newSettings);
    toast({
      title: "Settings updated",
      description: `Default focus time set to ${value[0]} minutes`,
    });
  };

  const handleBreakTimeChange = (value: number[]) => {
    const newSettings = { ...settings, breakTime: value[0] };
    setSettings(newSettings);
    saveSettings(newSettings);
    toast({
      title: "Settings updated",
      description: `Break time set to ${value[0]} minutes`,
    });
  };

  const handleResetLevel = () => {
    const newStats = {
      ...stats,
      level: 1,
      xp: 0,
      xpForNextLevel: 100
    };
    setStats(newStats);
    saveStats(newStats);
    toast({
      title: "Progress reset",
      description: "Your level and XP have been reset to 1",
    });
  };

  const handleResetAllStats = () => {
    const newStats = {
      focusSessions: 0,
      tasksCompleted: 0,
      streak: 0,
      level: 1,
      xp: 0,
      xpForNextLevel: 100
    };
    setStats(newStats);
    saveStats(newStats);
    toast({
      title: "Stats reset",
      description: "All your statistics have been reset",
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        
        <Tabs defaultValue="general">
          <TabsList className="mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="focus-time">Focus Session Duration (minutes)</Label>
                    <span className="text-sm">{settings.defaultFocusTime} min</span>
                  </div>
                  <Slider
                    id="focus-time"
                    defaultValue={[settings.defaultFocusTime]}
                    max={60}
                    min={5}
                    step={5}
                    onValueChange={handleFocusTimeChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="break-time">Break Duration (minutes)</Label>
                    <span className="text-sm">{settings.breakTime} min</span>
                  </div>
                  <Slider
                    id="break-time"
                    defaultValue={[settings.breakTime]}
                    max={30}
                    min={1}
                    step={1}
                    onValueChange={handleBreakTimeChange}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="notifications">Enable Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications when tasks are due</p>
                  </div>
                  <Switch id="notifications" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="sound">Sound Effects</Label>
                    <p className="text-sm text-muted-foreground">Play sounds for timer and task completion</p>
                  </div>
                  <Switch id="sound" defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select defaultValue="system">
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="font-size">Font Size</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue placeholder="Select font size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="compact">Compact Mode</Label>
                    <p className="text-sm text-muted-foreground">Use compact layout for more content on screen</p>
                  </div>
                  <Switch id="compact" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="progress">
            <Card>
              <CardHeader>
                <CardTitle>Progress & Level Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="mb-2 flex justify-between">
                      <Label>Current Level</Label>
                      <span className="font-medium">{stats.level}</span>
                    </div>
                    <div className="mb-2 flex justify-between">
                      <Label>Current XP</Label>
                      <span>{stats.xp} / {stats.xpForNextLevel}</span>
                    </div>
                    <div className="mb-2 flex justify-between">
                      <Label>Tasks Completed</Label>
                      <span>{stats.tasksCompleted}</span>
                    </div>
                    <div className="mb-2 flex justify-between">
                      <Label>Focus Sessions</Label>
                      <span>{stats.focusSessions}</span>
                    </div>
                    <div className="mb-2 flex justify-between">
                      <Label>Current Streak</Label>
                      <span>{stats.streak} days</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-4">Reset Options</h3>
                    
                    <div className="space-y-4">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" className="w-full flex items-center justify-center">
                            <RefreshCcw className="mr-2 h-4 w-4" />
                            Reset Level and XP
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Reset Level Progress</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will reset your level to 1 and your XP to 0. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleResetLevel}>Reset</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" className="w-full">
                            Reset All Statistics
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Reset All Statistics</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will reset all your statistics including tasks completed, focus sessions, streak, level, and XP. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleResetAllStats}>Reset All</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Navbar />
    </div>
  );
};

export default Settings;

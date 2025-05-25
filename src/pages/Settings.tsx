import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { saveSettings, applySettings } from '@/utils/localStorage';
import { Settings as SettingsIcon, RefreshCcw, Save } from 'lucide-react';
import { useAppState } from '@/contexts/AppStateContext';

const Settings = () => {
  const { toast } = useToast();
  const { stats, updateStats, settings, updateSettings } = useAppState();
  const [pendingSettings, setPendingSettings] = useState(settings);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Check if there are pending changes that differ from saved settings
    setHasChanges(
      pendingSettings.defaultFocusTime !== settings.defaultFocusTime ||
      pendingSettings.breakTime !== settings.breakTime ||
      pendingSettings.notifications !== settings.notifications ||
      pendingSettings.sound !== settings.sound ||
      pendingSettings.theme !== settings.theme ||
      pendingSettings.fontSize !== settings.fontSize ||
      pendingSettings.compactMode !== settings.compactMode
    );
  }, [pendingSettings, settings]);

  const handleFocusTimeChange = (value: number[]) => {
    setPendingSettings({ ...pendingSettings, defaultFocusTime: value[0] });
  };

  const handleBreakTimeChange = (value: number[]) => {
    setPendingSettings({ ...pendingSettings, breakTime: value[0] });
  };
  
  const handleNotificationsChange = (checked: boolean) => {
    setPendingSettings({ ...pendingSettings, notifications: checked });
  };
  
  const handleSoundChange = (checked: boolean) => {
    setPendingSettings({ ...pendingSettings, sound: checked });
  };
  
  const handleThemeChange = (value: string) => {
    setPendingSettings({ ...pendingSettings, theme: value });
  };
  
  const handleFontSizeChange = (value: string) => {
    setPendingSettings({ ...pendingSettings, fontSize: value });
  };
  
  const handleCompactModeChange = (checked: boolean) => {
    setPendingSettings({ ...pendingSettings, compactMode: checked });
  };

  const handleSaveChanges = () => {
    updateSettings(pendingSettings);
    setHasChanges(false);
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully",
    });
  };

  const handleResetLevel = () => {
    const newStats = {
      ...stats,
      level: 1,
      xp: 0,
      xpForNextLevel: 100
    };
    updateStats(newStats);
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
    updateStats(newStats);
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
                    <span className="text-sm">{pendingSettings.defaultFocusTime} min</span>
                  </div>
                  <Slider
                    id="focus-time"
                    value={[pendingSettings.defaultFocusTime]}
                    max={60}
                    min={5}
                    step={5}
                    onValueChange={handleFocusTimeChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="break-time">Break Duration (minutes)</Label>
                    <span className="text-sm">{pendingSettings.breakTime} min</span>
                  </div>
                  <Slider
                    id="break-time"
                    value={[pendingSettings.breakTime]}
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
                  <Switch 
                    id="notifications" 
                    checked={pendingSettings.notifications}
                    onCheckedChange={handleNotificationsChange}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="sound">Sound Effects</Label>
                    <p className="text-sm text-muted-foreground">Play sounds for timer and task completion</p>
                  </div>
                  <Switch 
                    id="sound" 
                    checked={pendingSettings.sound !== undefined ? pendingSettings.sound : true}
                    onCheckedChange={handleSoundChange}
                  />
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
                  <Select 
                    value={pendingSettings.theme || "system"} 
                    onValueChange={handleThemeChange}
                  >
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
                  <Select 
                    value={pendingSettings.fontSize || "medium"}
                    onValueChange={handleFontSizeChange}
                  >
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
                  <Switch 
                    id="compact" 
                    checked={pendingSettings.compactMode || false}
                    onCheckedChange={handleCompactModeChange}
                  />
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

        {/* Save Changes Button */}
        {hasChanges && (
          <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-10">
            <Button onClick={handleSaveChanges} className="shadow-lg">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        )}
      </div>
      <Navbar />
    </div>
  );
};

export default Settings;

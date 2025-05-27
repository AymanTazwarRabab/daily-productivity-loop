
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { RefreshCcw, Save } from 'lucide-react';
import { useAppState } from '@/contexts/AppStateContext';

const Settings = () => {
  const { toast } = useToast();
  const { stats, updateStats, settings, updateSettings } = useAppState();
  const [pendingSettings, setPendingSettings] = useState(settings);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Update pending settings when settings change
    setPendingSettings(settings);
  }, [settings]);

  useEffect(() => {
    // Check if there are pending changes that differ from saved settings
    setHasChanges(
      pendingSettings.theme !== settings.theme ||
      pendingSettings.fontSize !== settings.fontSize
    );
  }, [pendingSettings, settings]);
  
  const handleThemeChange = (value: string) => {
    const newSettings = { ...pendingSettings, theme: value };
    setPendingSettings(newSettings);
    // Apply theme immediately
    applyThemeSettings(newSettings);
  };
  
  const handleFontSizeChange = (value: string) => {
    const newSettings = { ...pendingSettings, fontSize: value };
    setPendingSettings(newSettings);
    // Apply font size immediately
    applyFontSizeSettings(newSettings);
  };

  const applyThemeSettings = (newSettings: typeof settings) => {
    if (newSettings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (newSettings.theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else if (newSettings.theme === 'system') {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const applyFontSizeSettings = (newSettings: typeof settings) => {
    document.documentElement.classList.remove('text-size-small', 'text-size-medium', 'text-size-large');
    document.documentElement.classList.add(`text-size-${newSettings.fontSize}`);
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
        
        <Tabs defaultValue="appearance">
          <TabsList className="mb-4">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>
          
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

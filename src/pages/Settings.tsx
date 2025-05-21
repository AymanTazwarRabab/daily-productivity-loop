
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Save, Download, RefreshCw, Trash2, Palette } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getSettings, saveSettings } from '@/utils/localStorage';

const colorThemes = [
  { name: 'Default', primary: 'hsl(var(--primary))', background: 'hsl(var(--background))' },
  { name: 'Purple', primary: '#9b87f5', background: '#1A1F2C' },
  { name: 'Ocean', primary: '#0EA5E9', background: '#0c1e2b' },
  { name: 'Forest', primary: '#16a34a', background: '#0f1f14' },
  { name: 'Sunset', primary: '#F97316', background: '#261311' },
  { name: 'Berry', primary: '#D946EF', background: '#261129' },
];

const Settings = () => {
  const [defaultFocusTime, setDefaultFocusTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [offlineMode, setOfflineMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedColorTheme, setSelectedColorTheme] = useState('Default');
  
  useEffect(() => {
    // Load settings from localStorage
    const settings = getSettings();
    setDefaultFocusTime(settings.defaultFocusTime);
    setBreakTime(settings.breakTime);
    setSelectedColorTheme(settings.colorTheme || 'Default');
    
    // Check if dark mode is set
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);
    
    // Apply dark mode if necessary
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }

    // Apply color theme if set
    applyColorTheme(settings.colorTheme || 'Default');
  }, []);

  const applyColorTheme = (themeName: string) => {
    const theme = colorThemes.find(t => t.name === themeName);
    if (!theme) return;
    
    document.documentElement.style.setProperty('--theme-primary', theme.primary);
    document.documentElement.style.setProperty('--theme-background', theme.background);
  };
  
  const handleSaveSettings = () => {
    // Save focus and break time settings
    saveSettings({
      defaultFocusTime,
      breakTime,
      colorTheme: selectedColorTheme
    });
    
    // Save dark mode preference
    localStorage.setItem('darkMode', darkMode.toString());
    
    // Apply dark mode immediately
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Apply color theme
    applyColorTheme(selectedColorTheme);
    
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated",
    });
  };
  
  const handleExportData = () => {
    const allData = {
      tasks: localStorage.getItem('productivity_tasks'),
      calendarTasks: localStorage.getItem('productivity_calendar_tasks'),
      reflections: localStorage.getItem('productivity_reflections'),
      stats: localStorage.getItem('productivity_stats'),
      settings: localStorage.getItem('productivity_settings')
    };
    
    const dataStr = JSON.stringify(allData);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `productivity-data-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Data exported",
      description: "Your data has been exported as a JSON file",
    });
  };
  
  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all your data? This cannot be undone.')) {
      localStorage.removeItem('productivity_tasks');
      localStorage.removeItem('productivity_calendar_tasks');
      localStorage.removeItem('productivity_reflections');
      localStorage.removeItem('productivity_stats');
      
      toast({
        title: "Data reset",
        description: "All your data has been cleared",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/">
            <Button variant="ghost" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Focus Timer Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Default Focus Session Duration: {defaultFocusTime} minutes</Label>
                </div>
                <Slider 
                  value={[defaultFocusTime]} 
                  min={20} 
                  max={90} 
                  step={5} 
                  onValueChange={(values) => setDefaultFocusTime(values[0])} 
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Default Break Duration: {breakTime} minutes</Label>
                </div>
                <Slider 
                  value={[breakTime]} 
                  min={1} 
                  max={15} 
                  step={1} 
                  onValueChange={(values) => setBreakTime(values[0])} 
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="mr-2 h-5 w-5" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <Switch 
                  id="dark-mode" 
                  checked={darkMode} 
                  onCheckedChange={setDarkMode} 
                />
              </div>
              
              <div className="space-y-3">
                <Label>Color Theme</Label>
                <RadioGroup 
                  value={selectedColorTheme} 
                  onValueChange={setSelectedColorTheme}
                  className="grid grid-cols-2 gap-4"
                >
                  {colorThemes.map((theme) => (
                    <div key={theme.name} className="flex items-center space-x-2">
                      <RadioGroupItem value={theme.name} id={`theme-${theme.name}`} />
                      <Label htmlFor={`theme-${theme.name}`} className="flex items-center">
                        <span 
                          className="inline-block w-4 h-4 rounded-full mr-2 border border-border" 
                          style={{ backgroundColor: theme.primary }} 
                        />
                        {theme.name}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button onClick={handleExportData} className="flex items-center">
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
                
                <Button onClick={handleResetData} variant="destructive" className="flex items-center">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Reset All Data
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button onClick={handleSaveSettings} className="flex items-center">
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getSettings, saveSettings } from '@/utils/localStorage';
import { applyColorTheme, toggleDarkMode, colorThemes } from '@/utils/themeManager';
import FocusTimerSettings from '@/components/settings/FocusTimerSettings';
import AppearanceSettings from '@/components/settings/AppearanceSettings';
import DataManagementSettings from '@/components/settings/DataManagementSettings';

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
  }, []);

  const handleDarkModeChange = (checked: boolean) => {
    setDarkMode(checked);
    // Apply dark mode immediately for preview
    toggleDarkMode(checked);
    // Reapply the current theme with new dark/light context
    applyColorTheme(selectedColorTheme, checked);
  };
  
  const handleThemePreview = (themeName: string) => {
    setSelectedColorTheme(themeName);
    applyColorTheme(themeName, darkMode);
  };
  
  const handleSaveSettings = () => {
    // Save focus and break time settings
    saveSettings({
      defaultFocusTime,
      breakTime,
      colorTheme: selectedColorTheme
    });
    
    // Save dark mode preference and apply
    toggleDarkMode(darkMode);
    
    // Apply color theme
    applyColorTheme(selectedColorTheme, darkMode);
    
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated",
    });
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
          <FocusTimerSettings 
            defaultFocusTime={defaultFocusTime}
            breakTime={breakTime}
            setDefaultFocusTime={setDefaultFocusTime}
            setBreakTime={setBreakTime}
          />
          
          <AppearanceSettings 
            darkMode={darkMode}
            selectedColorTheme={selectedColorTheme}
            setDarkMode={handleDarkModeChange}
            handleThemePreview={handleThemePreview}
            colorThemes={colorThemes}
          />
          
          <DataManagementSettings />
          
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

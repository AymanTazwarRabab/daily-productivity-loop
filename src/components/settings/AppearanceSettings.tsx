
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Palette } from "lucide-react";
import { ColorTheme } from '@/utils/themeManager';

interface AppearanceSettingsProps {
  darkMode: boolean;
  selectedColorTheme: string;
  setDarkMode: (value: boolean) => void;
  handleThemePreview: (themeName: string) => void;
  colorThemes: ColorTheme[];
}

const AppearanceSettings = ({ 
  darkMode, 
  selectedColorTheme, 
  setDarkMode, 
  handleThemePreview,
  colorThemes 
}: AppearanceSettingsProps) => {
  return (
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
            onCheckedChange={(checked) => setDarkMode(checked)} 
          />
        </div>
        
        <div className="space-y-3">
          <Label>Color Theme</Label>
          <RadioGroup 
            value={selectedColorTheme} 
            onValueChange={handleThemePreview}
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
  );
};

export default AppearanceSettings;

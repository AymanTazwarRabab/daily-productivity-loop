
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface FocusTimerSettingsProps {
  defaultFocusTime: number;
  breakTime: number;
  setDefaultFocusTime: (value: number) => void;
  setBreakTime: (value: number) => void;
}

const FocusTimerSettings = ({ 
  defaultFocusTime, 
  breakTime, 
  setDefaultFocusTime, 
  setBreakTime 
}: FocusTimerSettingsProps) => {
  return (
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
  );
};

export default FocusTimerSettings;

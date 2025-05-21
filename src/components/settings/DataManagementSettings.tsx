
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const DataManagementSettings = () => {
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
  );
};

export default DataManagementSettings;

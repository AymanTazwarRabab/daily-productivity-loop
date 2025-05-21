
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart } from "lucide-react";
import { ChartContainer, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { 
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { getTasks, getCalendarTasks, getReflections, getStats } from '@/utils/localStorage';

const Statistics = () => {
  const [focusSessions, setFocusSessions] = useState(0);
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [tasksByPriority, setTasksByPriority] = useState([
    { name: 'High Priority', value: 0, color: '#ef4444' },
    { name: 'Medium Priority', value: 0, color: '#f59e0b' },
    { name: 'Low Priority', value: 0, color: '#10b981' },
  ]);
  
  const [weeklyActivity, setWeeklyActivity] = useState([
    { day: 'Mon', tasks: 0, focus: 0 },
    { day: 'Tue', tasks: 0, focus: 0 },
    { day: 'Wed', tasks: 0, focus: 0 },
    { day: 'Thu', tasks: 0, focus: 0 },
    { day: 'Fri', tasks: 0, focus: 0 },
    { day: 'Sat', tasks: 0, focus: 0 },
    { day: 'Sun', tasks: 0, focus: 0 },
  ]);
  
  useEffect(() => {
    // Get stats data
    const stats = getStats();
    setFocusSessions(stats.focusSessions);
    setTasksCompleted(stats.tasksCompleted);
    
    // Generate task priority distribution
    const dailyTasks = getTasks();
    const priorityCounts = [0, 0, 0]; // high, medium, low
    
    dailyTasks.forEach(task => {
      if (task.completed) {
        priorityCounts[task.priority - 1]++;
      }
    });
    
    setTasksByPriority([
      { name: 'High Priority', value: priorityCounts[0], color: '#ef4444' },
      { name: 'Medium Priority', value: priorityCounts[1], color: '#f59e0b' },
      { name: 'Low Priority', value: priorityCounts[2], color: '#10b981' },
    ]);
    
    // Calculate weekly activity (simulation since we don't have date-based tasks)
    const today = new Date();
    const dayIndex = today.getDay(); // 0 = Sunday
    
    // Adjust to make Monday the first day
    const adjustedDayIndex = dayIndex === 0 ? 6 : dayIndex - 1;
    
    // Generate random activity data simulating a week of productivity
    const dummyActivityData = weeklyActivity.map((day, index) => {
      // Current day and days in the future have 0 activity
      if (index >= adjustedDayIndex) {
        return day;
      }
      
      // Generate random data for past days
      return {
        ...day,
        tasks: Math.floor(Math.random() * 5) + 1,
        focus: Math.floor(Math.random() * 3) + 1
      };
    });
    
    setWeeklyActivity(dummyActivityData);
  }, []);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/">
            <Button variant="ghost" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Statistics</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Focus Sessions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="text-5xl font-bold">{focusSessions}</div>
              <p className="text-muted-foreground mt-2">Sessions completed</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Tasks Completed</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="text-5xl font-bold">{tasksCompleted}</div>
              <p className="text-muted-foreground mt-2">Tasks finished</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Productivity Score</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="text-5xl font-bold">{Math.min(100, focusSessions * 10 + tasksCompleted * 5)}%</div>
              <p className="text-muted-foreground mt-2">Based on your activities</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ChartContainer 
                className="h-full"
                config={{
                  tasks: { label: 'Tasks' },
                  focus: { label: 'Focus Sessions' },
                }}
              >
                <RechartsBarChart data={weeklyActivity} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="tasks" name="Tasks" fill="hsl(var(--primary))" />
                  <Bar dataKey="focus" name="Focus Sessions" fill="hsl(var(--secondary))" />
                </RechartsBarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Tasks by Priority</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ChartContainer 
                className="h-full"
                config={{
                  high: { label: 'High' },
                  medium: { label: 'Medium' },
                  low: { label: 'Low' },
                }}
              >
                <PieChart>
                  <Pie
                    data={tasksByPriority}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {tasksByPriority.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ChartContainer>
              <div className="flex justify-center mt-4 space-x-4">
                {tasksByPriority.map((entry, index) => (
                  <div key={index} className="flex items-center">
                    <div 
                      className="w-3 h-3 mr-1 rounded-sm" 
                      style={{ backgroundColor: entry.color }}
                    ></div>
                    <span className="text-xs">{entry.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Statistics;

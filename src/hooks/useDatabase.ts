
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Types for our data
export interface DailyTask {
  id: string;
  title: string;
  completed: boolean;
  priority: number;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface CalendarTask {
  id: string;
  title: string;
  completed: boolean;
  priority: number;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface PrayerTracking {
  id: string;
  prayer_name: string;
  completed: boolean;
  date: string;
  completed_at?: string;
  created_at: string;
}

export interface DailyReflection {
  id: string;
  date: string;
  wins?: string;
  improvements?: string;
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  id: string;
  focus_sessions: number;
  tasks_completed: number;
  streak: number;
  level: number;
  xp: number;
  xp_for_next_level: number;
  created_at: string;
  updated_at: string;
}

export interface AppSettings {
  id: string;
  default_focus_time: number;
  break_time: number;
  notifications: boolean;
  sound: boolean;
  theme: string;
  font_size: string;
  compact_mode: boolean;
  created_at: string;
  updated_at: string;
}

export const useDatabase = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Daily Tasks
  const {
    data: dailyTasks = [],
    isLoading: loadingDailyTasks,
    error: dailyTasksError
  } = useQuery({
    queryKey: ['dailyTasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_tasks')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as DailyTask[];
    }
  });

  // Calendar Tasks
  const {
    data: calendarTasks = [],
    isLoading: loadingCalendarTasks,
    error: calendarTasksError
  } = useQuery({
    queryKey: ['calendarTasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('calendar_tasks')
        .select('*')
        .order('date', { ascending: true });
      
      if (error) throw error;
      return data as CalendarTask[];
    }
  });

  // Prayer Tracking
  const {
    data: prayerTracking = [],
    isLoading: loadingPrayerTracking,
    error: prayerTrackingError
  } = useQuery({
    queryKey: ['prayerTracking'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('prayer_tracking')
        .select('*')
        .eq('date', today)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as PrayerTracking[];
    }
  });

  // Daily Reflections
  const {
    data: reflections = [],
    isLoading: loadingReflections,
    error: reflectionsError
  } = useQuery({
    queryKey: ['reflections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_reflections')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data as DailyReflection[];
    }
  });

  // User Stats
  const {
    data: userStats,
    isLoading: loadingUserStats,
    error: userStatsError
  } = useQuery({
    queryKey: ['userStats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .single();
      
      if (error) throw error;
      return data as UserStats;
    }
  });

  // App Settings
  const {
    data: appSettings,
    isLoading: loadingAppSettings,
    error: appSettingsError
  } = useQuery({
    queryKey: ['appSettings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .single();
      
      if (error) throw error;
      return data as AppSettings;
    }
  });

  // Mutations
  const addDailyTaskMutation = useMutation({
    mutationFn: async (task: { title: string; priority?: number; date?: string }) => {
      const { data, error } = await supabase
        .from('daily_tasks')
        .insert([{
          title: task.title,
          priority: task.priority || 2,
          date: task.date || new Date().toISOString().split('T')[0]
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyTasks'] });
      toast({
        title: "Task added",
        description: "New daily task has been added",
        duration: 2000,
      });
    }
  });

  const updateDailyTaskMutation = useMutation({
    mutationFn: async (params: { id: string; updates: Partial<DailyTask> }) => {
      const { data, error } = await supabase
        .from('daily_tasks')
        .update(params.updates)
        .eq('id', params.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyTasks'] });
    }
  });

  const addCalendarTaskMutation = useMutation({
    mutationFn: async (task: { title: string; date: string; priority?: number }) => {
      const { data, error } = await supabase
        .from('calendar_tasks')
        .insert([{
          title: task.title,
          date: task.date,
          priority: task.priority || 2
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendarTasks'] });
      toast({
        title: "Calendar task added",
        description: "New calendar task has been scheduled",
        duration: 2000,
      });
    }
  });

  const updateCalendarTaskMutation = useMutation({
    mutationFn: async (params: { id: string; updates: Partial<CalendarTask> }) => {
      const { data, error } = await supabase
        .from('calendar_tasks')
        .update(params.updates)
        .eq('id', params.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendarTasks'] });
    }
  });

  const updatePrayerMutation = useMutation({
    mutationFn: async (params: { prayer_name: string; completed: boolean }) => {
      const today = new Date().toISOString().split('T')[0];
      
      // First check if prayer exists for today
      const { data: existing } = await supabase
        .from('prayer_tracking')
        .select('*')
        .eq('prayer_name', params.prayer_name)
        .eq('date', today)
        .single();

      if (existing) {
        // Update existing
        const { data, error } = await supabase
          .from('prayer_tracking')
          .update({
            completed: params.completed,
            completed_at: params.completed ? new Date().toISOString() : null
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Create new
        const { data, error } = await supabase
          .from('prayer_tracking')
          .insert([{
            prayer_name: params.prayer_name,
            completed: params.completed,
            date: today,
            completed_at: params.completed ? new Date().toISOString() : null
          }])
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prayerTracking'] });
    }
  });

  const saveReflectionMutation = useMutation({
    mutationFn: async (reflection: { date: string; wins?: string; improvements?: string }) => {
      const { data: existing } = await supabase
        .from('daily_reflections')
        .select('*')
        .eq('date', reflection.date)
        .single();

      if (existing) {
        // Update existing
        const { data, error } = await supabase
          .from('daily_reflections')
          .update({
            wins: reflection.wins,
            improvements: reflection.improvements,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Create new
        const { data, error } = await supabase
          .from('daily_reflections')
          .insert([reflection])
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reflections'] });
      toast({
        title: "Reflection saved",
        description: "Your daily reflection has been saved",
        duration: 2000,
      });
    }
  });

  const updateUserStatsMutation = useMutation({
    mutationFn: async (stats: Partial<UserStats>) => {
      const { data, error } = await supabase
        .from('user_stats')
        .update({
          ...stats,
          updated_at: new Date().toISOString()
        })
        .eq('id', userStats?.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
    }
  });

  const updateAppSettingsMutation = useMutation({
    mutationFn: async (settings: Partial<AppSettings>) => {
      const { data, error } = await supabase
        .from('app_settings')
        .update({
          ...settings,
          updated_at: new Date().toISOString()
        })
        .eq('id', appSettings?.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appSettings'] });
      toast({
        title: "Settings saved",
        description: "Your settings have been updated",
        duration: 2000,
      });
    }
  });

  return {
    // Data
    dailyTasks,
    calendarTasks,
    prayerTracking,
    reflections,
    userStats,
    appSettings,
    
    // Loading states
    loadingDailyTasks,
    loadingCalendarTasks,
    loadingPrayerTracking,
    loadingReflections,
    loadingUserStats,
    loadingAppSettings,
    
    // Errors
    dailyTasksError,
    calendarTasksError,
    prayerTrackingError,
    reflectionsError,
    userStatsError,
    appSettingsError,
    
    // Mutations
    addDailyTask: addDailyTaskMutation.mutate,
    updateDailyTask: updateDailyTaskMutation.mutate,
    addCalendarTask: addCalendarTaskMutation.mutate,
    updateCalendarTask: updateCalendarTaskMutation.mutate,
    updatePrayer: updatePrayerMutation.mutate,
    saveReflection: saveReflectionMutation.mutate,
    updateUserStats: updateUserStatsMutation.mutate,
    updateAppSettings: updateAppSettingsMutation.mutate,
    
    // Loading states for mutations
    addingDailyTask: addDailyTaskMutation.isPending,
    updatingDailyTask: updateDailyTaskMutation.isPending,
    addingCalendarTask: addCalendarTaskMutation.isPending,
    updatingCalendarTask: updateCalendarTaskMutation.isPending,
    updatingPrayer: updatePrayerMutation.isPending,
    savingReflection: saveReflectionMutation.isPending,
    updatingUserStats: updateUserStatsMutation.isPending,
    updatingAppSettings: updateAppSettingsMutation.isPending
  };
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  const queryClient = useQueryClient();

  // Helper function to create initial user stats
  const createInitialUserStats = async () => {
    console.log('Creating initial user stats...');
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .insert([{
          focus_sessions: 0,
          tasks_completed: 0,
          streak: 0,
          level: 1,
          xp: 0,
          xp_for_next_level: 100
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating initial user stats:', error);
        // Return default stats if creation fails
        return {
          id: 'temp',
          focus_sessions: 0,
          tasks_completed: 0,
          streak: 0,
          level: 1,
          xp: 0,
          xp_for_next_level: 100,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }
      console.log('Initial user stats created successfully:', data);
      return data;
    } catch (err) {
      console.error('Exception creating initial user stats:', err);
      // Return default stats if creation fails
      return {
        id: 'temp',
        focus_sessions: 0,
        tasks_completed: 0,
        streak: 0,
        level: 1,
        xp: 0,
        xp_for_next_level: 100,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
  };

  // Helper function to create initial app settings
  const createInitialAppSettings = async () => {
    console.log('Creating initial app settings...');
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .insert([{
          default_focus_time: 25,
          break_time: 5,
          notifications: true,
          sound: true,
          theme: 'system',
          font_size: 'medium',
          compact_mode: false
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating initial app settings:', error);
        // Return default settings if creation fails
        return {
          id: 'temp',
          default_focus_time: 25,
          break_time: 5,
          notifications: true,
          sound: true,
          theme: 'system',
          font_size: 'medium',
          compact_mode: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }
      console.log('Initial app settings created successfully:', data);
      return data;
    } catch (err) {
      console.error('Exception creating initial app settings:', err);
      // Return default settings if creation fails
      return {
        id: 'temp',
        default_focus_time: 25,
        break_time: 5,
        notifications: true,
        sound: true,
        theme: 'system',
        font_size: 'medium',
        compact_mode: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
  };

  // Daily Tasks
  const {
    data: dailyTasks = [],
    isLoading: loadingDailyTasks,
    error: dailyTasksError
  } = useQuery({
    queryKey: ['dailyTasks'],
    queryFn: async () => {
      console.log('Fetching daily tasks...');
      const { data, error } = await supabase
        .from('daily_tasks')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching daily tasks:', error);
        throw error;
      }
      console.log('Daily tasks fetched:', data);
      return data as DailyTask[];
    },
    retry: 1,
    refetchOnWindowFocus: false
  });

  // Calendar Tasks
  const {
    data: calendarTasks = [],
    isLoading: loadingCalendarTasks,
    error: calendarTasksError
  } = useQuery({
    queryKey: ['calendarTasks'],
    queryFn: async () => {
      console.log('Fetching calendar tasks...');
      const { data, error } = await supabase
        .from('calendar_tasks')
        .select('*')
        .order('date', { ascending: true });
      
      if (error) {
        console.error('Error fetching calendar tasks:', error);
        throw error;
      }
      console.log('Calendar tasks fetched:', data);
      return data as CalendarTask[];
    },
    retry: 1,
    refetchOnWindowFocus: false
  });

  // Prayer Tracking
  const {
    data: prayerTracking = [],
    isLoading: loadingPrayerTracking,
    error: prayerTrackingError
  } = useQuery({
    queryKey: ['prayerTracking'],
    queryFn: async () => {
      console.log('Fetching prayer tracking...');
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('prayer_tracking')
        .select('*')
        .eq('date', today)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching prayer tracking:', error);
        throw error;
      }
      console.log('Prayer tracking fetched:', data);
      return data as PrayerTracking[];
    },
    retry: 1,
    refetchOnWindowFocus: false
  });

  // Daily Reflections
  const {
    data: reflections = [],
    isLoading: loadingReflections,
    error: reflectionsError
  } = useQuery({
    queryKey: ['reflections'],
    queryFn: async () => {
      console.log('Fetching reflections...');
      const { data, error } = await supabase
        .from('daily_reflections')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) {
        console.error('Error fetching reflections:', error);
        throw error;
      }
      console.log('Reflections fetched:', data);
      return data as DailyReflection[];
    },
    retry: 1,
    refetchOnWindowFocus: false
  });

  // User Stats with better error handling
  const {
    data: userStats,
    isLoading: loadingUserStats,
    error: userStatsError
  } = useQuery({
    queryKey: ['userStats'],
    queryFn: async () => {
      console.log('Fetching user stats...');
      try {
        const { data, error } = await supabase
          .from('user_stats')
          .select('*')
          .limit(1)
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching user stats:', error);
          // Try to create initial stats
          return await createInitialUserStats();
        }

        // If no stats exist, create initial ones
        if (!data) {
          console.log('No user stats found, creating initial stats...');
          return await createInitialUserStats();
        }

        console.log('User stats fetched:', data);
        return data as UserStats;
      } catch (err) {
        console.error('Exception in user stats query:', err);
        return await createInitialUserStats();
      }
    },
    retry: false, // Don't retry on failure
    refetchOnWindowFocus: false
  });

  // App Settings with better error handling
  const {
    data: appSettings,
    isLoading: loadingAppSettings,
    error: appSettingsError
  } = useQuery({
    queryKey: ['appSettings'],
    queryFn: async () => {
      console.log('Fetching app settings...');
      try {
        const { data, error } = await supabase
          .from('app_settings')
          .select('*')
          .limit(1)
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching app settings:', error);
          // Try to create initial settings
          return await createInitialAppSettings();
        }

        // If no settings exist, create initial ones
        if (!data) {
          console.log('No app settings found, creating initial settings...');
          return await createInitialAppSettings();
        }

        console.log('App settings fetched:', data);
        return data as AppSettings;
      } catch (err) {
        console.error('Exception in app settings query:', err);
        return await createInitialAppSettings();
      }
    },
    retry: false, // Don't retry on failure
    refetchOnWindowFocus: false
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
      toast.success("Task added", {
        description: "New daily task has been added",
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
      toast.success("Calendar task added", {
        description: "New calendar task has been scheduled",
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
      toast.success("Reflection saved", {
        description: "Your daily reflection has been saved",
      });
    }
  });

  const updateUserStatsMutation = useMutation({
    mutationFn: async (stats: Partial<UserStats>) => {
      // Skip update if we have temp data
      if (userStats?.id === 'temp') {
        console.log('Skipping user stats update for temp data');
        return userStats;
      }

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
      // Skip update if we have temp data
      if (appSettings?.id === 'temp') {
        console.log('Skipping app settings update for temp data');
        return appSettings;
      }

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
      toast.success("Settings saved", {
        description: "Your settings have been updated",
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

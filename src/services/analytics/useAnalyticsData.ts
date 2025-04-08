
import { useState, useMemo } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { DateRange, AnalyticsData } from './types';
import { 
  processDateData,
  processDeviceData, 
  processReferrerData,
  processLocationData,
  findTopDate
} from './analyticsDataProcessors';

// Re-export the types properly using 'export type' syntax for isolatedModules
export { DateRange } from './types';
export type { 
  AnalyticsDataPoint,
  DeviceDataPoint,
  ReferrerDataPoint,
  AnalyticsData
} from './types';

export const useAnalyticsData = (dateRange: DateRange = '30') => {
  const { user } = useUser();
  const userId = user?.id;
  
  // Calculate the start date based on the selected range
  const startDate = useMemo(() => {
    if (dateRange === 'all') return null;
    
    const date = new Date();
    date.setDate(date.getDate() - parseInt(dateRange));
    return date.toISOString();
  }, [dateRange]);
  
  return useQuery({
    queryKey: ['analytics', userId, dateRange],
    queryFn: async (): Promise<AnalyticsData> => {
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      // Use direct query instead of RPC to avoid TypeScript issues
      const { data, error } = await supabase
        .from('link_analytics')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', startDate ? startDate : '1970-01-01')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching analytics:', error);
        throw error;
      }
      
      console.log('Raw analytics data:', data);
      
      // Return default empty data structure if no data
      if (!data || !data.length) {
        return {
          byDate: [],
          byDevice: [],
          byReferrer: [],
          byLocation: [],
          topDate: null,
          topLocation: null,
          totalClicks: 0,
          totalScans: 0
        };
      }
      
      console.log('Processing analytics data, count:', data.length);
      
      // Calculate total counts
      const totalClicks = data.filter(item => !item.is_qr_scan).length;
      const totalScans = data.filter(item => item.is_qr_scan).length;
      
      // Process data for different chart types using our utility functions
      const byDate = processDateData(data);
      const topDate = findTopDate(byDate);
      const byDevice = processDeviceData(data);
      const byReferrer = processReferrerData(data);
      const { locationData: byLocation, topLocation } = processLocationData(data);
      
      return {
        byDate,
        byDevice,
        byReferrer,
        byLocation,
        topDate,
        topLocation,
        totalClicks,
        totalScans
      };
    },
    enabled: !!userId,
  });
};

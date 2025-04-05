
import { useState, useMemo } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";

export type DateRange = '7' | '30' | '90' | 'all';

export type AnalyticsDataPoint = {
  date: string;
  clicks: number;
  scans: number;
  total: number;
};

export type DeviceDataPoint = {
  device: string;
  count: number;
  percentage: number;
};

export type ReferrerDataPoint = {
  referrer: string;
  count: number;
};

export type LocationDataPoint = {
  location: string;
  count: number;
};

export type AnalyticsData = {
  byDate: AnalyticsDataPoint[];
  byDevice: DeviceDataPoint[];
  byReferrer: ReferrerDataPoint[];
  byLocation: LocationDataPoint[];
  topDate: { date: string; count: number } | null;
  topLocation: { location: string; count: number } | null;
  totalClicks: number;
  totalScans: number;
};

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
      
      // Base query
      let query = supabase
        .from('link_analytics')
        .select('*')
        .eq('user_id', userId);
      
      // Apply date filter if needed
      if (startDate) {
        query = query.gte('created_at', startDate);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching analytics:', error);
        throw error;
      }
      
      // Process the data for different chart types
      const processedData = processAnalyticsData(data || []);
      return processedData;
    },
    enabled: !!userId,
  });
};

// Process raw analytics data for chart display
const processAnalyticsData = (data: any[]): AnalyticsData => {
  // Default empty data structure
  if (!data.length) {
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
  
  // Total counts
  const totalClicks = data.filter(item => !item.is_qr_scan).length;
  const totalScans = data.filter(item => item.is_qr_scan).length;
  
  // Group by date
  const byDateMap = new Map<string, { clicks: number, scans: number }>();
  data.forEach(item => {
    const date = new Date(item.created_at).toLocaleDateString();
    if (!byDateMap.has(date)) {
      byDateMap.set(date, { clicks: 0, scans: 0 });
    }
    const current = byDateMap.get(date)!;
    if (item.is_qr_scan) {
      current.scans += 1;
    } else {
      current.clicks += 1;
    }
  });
  
  // Convert to array and sort by date
  const byDate = Array.from(byDateMap.entries())
    .map(([date, counts]) => ({
      date,
      clicks: counts.clicks,
      scans: counts.scans,
      total: counts.clicks + counts.scans
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Find top date
  const topDate = byDate.length > 0 
    ? byDate.reduce((max, current) => 
        current.total > max.total ? current : max, byDate[0])
    : null;
  
  // Group by device
  const byDeviceMap = new Map<string, number>();
  data.forEach(item => {
    const device = item.device_type || 'Unknown';
    byDeviceMap.set(device, (byDeviceMap.get(device) || 0) + 1);
  });
  
  // Convert to array with percentages
  const byDevice = Array.from(byDeviceMap.entries())
    .map(([device, count]) => ({
      device,
      count,
      percentage: Math.round((count / data.length) * 100)
    }))
    .sort((a, b) => b.count - a.count);
  
  // Group by referrer
  const byReferrerMap = new Map<string, number>();
  data.forEach(item => {
    const referrer = item.referrer || 'Direct';
    byReferrerMap.set(referrer, (byReferrerMap.get(referrer) || 0) + 1);
  });
  
  // Convert to array
  const byReferrer = Array.from(byReferrerMap.entries())
    .map(([referrer, count]) => ({ referrer, count }))
    .sort((a, b) => b.count - a.count);
  
  // Group by location (country if available, otherwise city)
  const byLocationMap = new Map<string, number>();
  data.forEach(item => {
    const location = item.location_country || item.location_city || 'Unknown';
    byLocationMap.set(location, (byLocationMap.get(location) || 0) + 1);
  });
  
  // Convert to array
  const byLocation = Array.from(byLocationMap.entries())
    .map(([location, count]) => ({ location, count }))
    .sort((a, b) => b.count - a.count);
  
  // Find top location
  const topLocation = byLocation.length > 0 
    ? { location: byLocation[0].location, count: byLocation[0].count }
    : null;
  
  return {
    byDate,
    byDevice,
    byReferrer,
    byLocation,
    topDate: topDate ? { date: topDate.date, count: topDate.total } : null,
    topLocation,
    totalClicks,
    totalScans
  };
};

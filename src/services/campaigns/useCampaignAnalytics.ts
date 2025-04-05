
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@clerk/clerk-react";

export interface CampaignAnalyticsData {
  totalClicks: number;
  clicksByDay: { date: string; clicks: number }[];
  deviceTypes: { device_type: string; count: number }[];
  topReferrers: { referrer: string; count: number }[];
  topLocations: { location_country: string; count: number }[];
}

export const useCampaignAnalytics = (campaignId?: string) => {
  const { user } = useUser();
  
  return useQuery({
    queryKey: ['campaign-analytics', campaignId],
    queryFn: async (): Promise<CampaignAnalyticsData> => {
      if (!user?.id || !campaignId) {
        throw new Error('User ID and Campaign ID are required');
      }

      // First, get the link IDs that belong to this campaign
      const { data: campaignLinks, error: linksError } = await supabase
        .from('links')
        .select('id')
        .eq('campaign_id', campaignId)
        .eq('user_id', user.id);

      if (linksError) {
        console.error('Error fetching campaign links:', linksError);
        throw linksError;
      }

      if (!campaignLinks || campaignLinks.length === 0) {
        return {
          totalClicks: 0,
          clicksByDay: [],
          deviceTypes: [],
          topReferrers: [],
          topLocations: []
        };
      }

      const linkIds = campaignLinks.map(link => link.id);
      
      // Fetch analytics data for these links
      const { data: analyticsData, error: analyticsError } = await supabase
        .from('link_analytics')
        .select('*')
        .in('link_id', linkIds)
        .eq('user_id', user.id);

      if (analyticsError) {
        console.error('Error fetching link analytics:', analyticsError);
        throw analyticsError;
      }

      // Calculate total clicks
      const totalClicks = analyticsData?.length || 0;

      // Process clicks by day
      const clicksByDayMap = new Map<string, number>();
      analyticsData?.forEach(item => {
        const date = new Date(item.created_at).toLocaleDateString();
        clicksByDayMap.set(date, (clicksByDayMap.get(date) || 0) + 1);
      });

      const clicksByDay = Array.from(clicksByDayMap).map(([date, clicks]) => ({
        date,
        clicks
      })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      // Process device types
      const deviceTypesMap = new Map<string, number>();
      analyticsData?.forEach(item => {
        const deviceType = item.device_type || 'Unknown';
        deviceTypesMap.set(deviceType, (deviceTypesMap.get(deviceType) || 0) + 1);
      });

      const deviceTypes = Array.from(deviceTypesMap).map(([device_type, count]) => ({
        device_type,
        count
      })).sort((a, b) => b.count - a.count);

      // Process top referrers
      const referrersMap = new Map<string, number>();
      analyticsData?.forEach(item => {
        const referrer = item.referrer || 'Direct';
        referrersMap.set(referrer, (referrersMap.get(referrer) || 0) + 1);
      });

      const topReferrers = Array.from(referrersMap).map(([referrer, count]) => ({
        referrer,
        count
      })).sort((a, b) => b.count - a.count);

      // Process top locations
      const locationsMap = new Map<string, number>();
      analyticsData?.forEach(item => {
        const location = item.location_country || 'Unknown';
        locationsMap.set(location, (locationsMap.get(location) || 0) + 1);
      });

      const topLocations = Array.from(locationsMap).map(([location_country, count]) => ({
        location_country,
        count
      })).sort((a, b) => b.count - a.count);

      return {
        totalClicks,
        clicksByDay,
        deviceTypes,
        topReferrers,
        topLocations
      };
    },
    enabled: !!user?.id && !!campaignId,
  });
};

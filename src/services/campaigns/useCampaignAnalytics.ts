
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { format, subDays } from "date-fns";

interface CampaignAnalyticsResponse {
  totalClicks: number;
  clicksByDay: { date: string; clicks: number }[];
  topLinks: { id: string; original_url: string; short_url: string; clicks: number }[];
  deviceTypes: { device_type: string; count: number }[];
  topLocations: { location_country: string; count: number }[];
  topReferrers: { referrer: string; count: number }[];
}

// Hook to get analytics for a specific campaign
export const useCampaignAnalytics = (campaignId?: string, days = 30) => {
  const { user } = useUser();
  
  return useQuery({
    queryKey: ['campaign-analytics', campaignId, days],
    queryFn: async (): Promise<CampaignAnalyticsResponse> => {
      if (!user?.id || !campaignId) {
        return {
          totalClicks: 0,
          clicksByDay: [],
          topLinks: [],
          deviceTypes: [],
          topLocations: [],
          topReferrers: []
        };
      }
      
      console.log('Fetching analytics for campaign ID:', campaignId);
      
      // First, get all links for this campaign
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
          topLinks: [],
          deviceTypes: [],
          topLocations: [],
          topReferrers: []
        };
      }
      
      const linkIds = campaignLinks.map(link => link.id);
      
      // Get total clicks
      const { count: totalClicks, error: countError } = await supabase
        .from('link_analytics')
        .select('*', { count: 'exact', head: true })
        .in('link_id', linkIds);
      
      if (countError) {
        console.error('Error counting clicks:', countError);
        throw countError;
      }
      
      // Get clicks by day for the last 30 days
      const startDate = subDays(new Date(), days).toISOString();
      const { data: analyticsData, error: analyticsError } = await supabase
        .from('link_analytics')
        .select('created_at')
        .in('link_id', linkIds)
        .gte('created_at', startDate);
      
      if (analyticsError) {
        console.error('Error fetching analytics by day:', analyticsError);
        throw analyticsError;
      }
      
      // Process clicks by day
      const clicksByDay: Record<string, number> = {};
      
      // Initialize all days with 0 clicks
      for (let i = 0; i < days; i++) {
        const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
        clicksByDay[date] = 0;
      }
      
      // Count clicks per day
      analyticsData?.forEach(item => {
        const day = format(new Date(item.created_at), 'yyyy-MM-dd');
        if (clicksByDay[day] !== undefined) {
          clicksByDay[day]++;
        }
      });
      
      // Convert to array sorted by date
      const clicksByDayArray = Object.entries(clicksByDay)
        .map(([date, clicks]) => ({ date, clicks }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      // Get top links
      const { data: links, error: topLinksError } = await supabase
        .from('links')
        .select('id, original_url, short_url, clicks')
        .in('id', linkIds)
        .order('clicks', { ascending: false })
        .limit(5);
      
      if (topLinksError) {
        console.error('Error fetching top links:', topLinksError);
        throw topLinksError;
      }
      
      // Get device types
      const { data: deviceData, error: deviceError } = await supabase
        .from('link_analytics')
        .select('device_type, count')
        .in('link_id', linkIds)
        .not('device_type', 'is', null)
        .group('device_type');
      
      if (deviceError) {
        console.error('Error fetching device types:', deviceError);
        throw deviceError;
      }
      
      // Get top locations
      const { data: locationData, error: locationError } = await supabase
        .from('link_analytics')
        .select('location_country, count')
        .in('link_id', linkIds)
        .not('location_country', 'is', null)
        .group('location_country')
        .order('count', { ascending: false })
        .limit(5);
      
      if (locationError) {
        console.error('Error fetching top locations:', locationError);
        throw locationError;
      }
      
      // Get top referrers
      const { data: referrerData, error: referrerError } = await supabase
        .from('link_analytics')
        .select('referrer, count')
        .in('link_id', linkIds)
        .not('referrer', 'is', null)
        .group('referrer')
        .order('count', { ascending: false })
        .limit(5);
      
      if (referrerError) {
        console.error('Error fetching top referrers:', referrerError);
        throw referrerError;
      }
      
      return {
        totalClicks: totalClicks || 0,
        clicksByDay: clicksByDayArray,
        topLinks: links || [],
        deviceTypes: deviceData || [],
        topLocations: locationData || [],
        topReferrers: referrerData || []
      };
    },
    enabled: !!user?.id && !!campaignId,
  });
};

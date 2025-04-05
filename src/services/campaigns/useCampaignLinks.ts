
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import type { LinkData } from "../links/types";

// Hook to get all links for a specific campaign
export const useCampaignLinks = (campaignId?: string) => {
  const { user } = useUser();
  
  return useQuery({
    queryKey: ['campaign-links', campaignId],
    queryFn: async (): Promise<LinkData[]> => {
      if (!user?.id || !campaignId) return [];
      
      console.log('Fetching links for campaign ID:', campaignId);
      
      const { data, error } = await supabase
        .from('links')
        .select('*')
        .eq('campaign_id', campaignId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching campaign links:', error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!user?.id && !!campaignId,
  });
};


import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Hook to increment click count for a link and record analytics
export const useIncrementLinkClicks = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ linkId, userId, deviceType, referrer, locationCountry, locationCity }: { 
      linkId: string; 
      userId: string;
      deviceType?: string;
      referrer?: string;
      locationCountry?: string;
      locationCity?: string;
    }) => {
      // 1. Increment the clicks count in the links table
      const { data: linkData, error: linkError } = await supabase
        .from('links')
        .select('clicks, campaign_id')
        .eq('id', linkId)
        .single();
      
      if (linkError) throw linkError;
      
      const newClicks = (linkData.clicks || 0) + 1;
      const campaignId = linkData.campaign_id;
      
      const { data: updatedLink, error: updateError } = await supabase
        .from('links')
        .update({ clicks: newClicks })
        .eq('id', linkId)
        .select()
        .single();
      
      if (updateError) throw updateError;
      
      // 2. Record analytics data directly in the database
      // This avoids the RPC TypeScript issue
      try {
        const { error: analyticsError } = await supabase
          .from('link_analytics')
          .insert({
            link_id: linkId,
            user_id: userId,
            device_type: deviceType || 'Unknown',
            referrer: referrer || null,
            location_country: locationCountry || null,
            location_city: locationCity || null,
            is_qr_scan: false
          });
          
        if (analyticsError) throw analyticsError;
      } catch (error) {
        console.error('Error recording analytics:', error);
      }
      
      return { updatedLink, campaignId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      
      // If the link belongs to a campaign, invalidate campaign-related queries
      if (data.campaignId) {
        queryClient.invalidateQueries({ queryKey: ['campaign-links', data.campaignId] });
        queryClient.invalidateQueries({ queryKey: ['campaign-analytics', data.campaignId] });
      }
    }
  });
};

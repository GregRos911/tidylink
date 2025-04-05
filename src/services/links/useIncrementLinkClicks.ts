
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
        .select('clicks')
        .eq('id', linkId)
        .single();
      
      if (linkError) throw linkError;
      
      const newClicks = (linkData.clicks || 0) + 1;
      
      const { data: updatedLink, error: updateError } = await supabase
        .from('links')
        .update({ clicks: newClicks })
        .eq('id', linkId)
        .select()
        .single();
      
      if (updateError) throw updateError;
      
      // 2. Record analytics data using RPC instead of direct table access
      try {
        const { error: analyticsError } = await supabase.rpc('insert_link_analytics', {
          p_link_id: linkId,
          p_user_id: userId,
          p_device_type: deviceType || 'Unknown',
          p_referrer: referrer || null,
          p_location_country: locationCountry || null,
          p_location_city: locationCity || null,
          p_is_qr_scan: false
        });
        
        if (analyticsError) throw analyticsError;
      } catch (error) {
        console.error('Error recording analytics:', error);
      }
      
      return { updatedLink };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    }
  });
};

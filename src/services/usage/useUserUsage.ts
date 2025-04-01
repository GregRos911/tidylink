
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { UsageData } from "./types";

// Hook to get current user usage
export const useUserUsage = () => {
  const { user } = useUser();
  
  return useQuery({
    queryKey: ['usage', user?.id],
    queryFn: async (): Promise<UsageData | null> => {
      if (!user?.id) return null;
      
      try {
        // Try to get existing usage record
        const { data, error } = await supabase
          .from('usage')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching usage:', error);
          throw error;
        }
        
        // If no usage record exists, create one
        if (!data) {
          const { data: newUsage, error: insertError } = await supabase
            .from('usage')
            .insert([{ 
              user_id: user.id,
              links_used: 0,
              qr_codes_used: 0,
              custom_backhalves_used: 0,
              last_reset: new Date().toISOString()
            }])
            .select('*')
            .single();
          
          if (insertError) {
            console.error('Error creating usage record:', insertError);
            // Instead of throwing immediately, return a default usage object
            return {
              id: 'temp-id',
              user_id: user.id,
              links_used: 0,
              qr_codes_used: 0,
              custom_backhalves_used: 0,
              last_reset: new Date().toISOString(),
              created_at: new Date().toISOString()
            };
          }
          
          return newUsage;
        }
        
        return data;
      } catch (error) {
        console.error('Usage service error:', error);
        // Return a default usage object on error instead of throwing
        return {
          id: 'temp-id',
          user_id: user.id,
          links_used: 0,
          qr_codes_used: 0,
          custom_backhalves_used: 0,
          last_reset: new Date().toISOString(),
          created_at: new Date().toISOString()
        };
      }
    },
    enabled: !!user?.id,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

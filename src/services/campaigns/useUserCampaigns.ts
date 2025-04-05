
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import type { Campaign } from "./types";

// Hook to get all campaigns for a user
export const useUserCampaigns = () => {
  const { user } = useUser();
  
  return useQuery({
    queryKey: ['campaigns', user?.id],
    queryFn: async (): Promise<Campaign[]> => {
      if (!user?.id) return [];
      
      console.log('Fetching campaigns for user ID:', user.id);
      
      // Use raw query to avoid Typescript issues with table definitions
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching campaigns:', error);
        throw error;
      }
      
      // Cast data to Campaign type
      return (data as unknown) as Campaign[] || [];
    },
    enabled: !!user?.id,
  });
};

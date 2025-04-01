
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import type { LinkData } from "./types";

// Hook to get all links for a user
export const useUserLinks = () => {
  const { user } = useUser();
  
  return useQuery({
    queryKey: ['links', user?.id],
    queryFn: async (): Promise<LinkData[]> => {
      if (!user?.id) return [];
      
      console.log('Fetching links for user ID:', user.id);
      
      const { data, error } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching links:', error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!user?.id,
  });
};

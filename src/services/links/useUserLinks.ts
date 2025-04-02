
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import type { LinkData } from "./types";

// Hook to get all links for a user
export const useUserLinks = (options?: { 
  limit?: number; 
  page?: number;
  orderBy?: 'created_at' | 'clicks';
  orderDirection?: 'asc' | 'desc';
}) => {
  const { user } = useUser();
  const limit = options?.limit || 50;
  const page = options?.page || 0;
  const orderBy = options?.orderBy || 'created_at';
  const orderDirection = options?.orderDirection || 'desc';
  
  return useQuery({
    queryKey: ['links', user?.id, limit, page, orderBy, orderDirection],
    queryFn: async (): Promise<LinkData[]> => {
      if (!user?.id) return [];
      
      console.log('Fetching links for user ID:', user.id);
      
      const { data, error } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', user.id)
        .order(orderBy, { ascending: orderDirection === 'asc' })
        .range(page * limit, (page + 1) * limit - 1);
      
      if (error) {
        console.error('Error fetching links:', error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!user?.id,
  });
};

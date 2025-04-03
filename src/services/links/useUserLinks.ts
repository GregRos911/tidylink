
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
  searchQuery?: string;
}) => {
  const { user } = useUser();
  const limit = options?.limit || 50;
  const page = options?.page || 0;
  const orderBy = options?.orderBy || 'created_at';
  const orderDirection = options?.orderDirection || 'desc';
  const searchQuery = options?.searchQuery || '';
  
  return useQuery({
    queryKey: ['links', user?.id, limit, page, orderBy, orderDirection, searchQuery],
    queryFn: async (): Promise<LinkData[]> => {
      if (!user?.id) return [];
      
      console.log('Fetching links for user ID:', user.id);
      
      let query = supabase
        .from('links')
        .select('*')
        .eq('user_id', user.id)
        .order(orderBy, { ascending: orderDirection === 'asc' });
      
      // Add search functionality if a search query is provided
      if (searchQuery) {
        query = query.or(`original_url.ilike.%${searchQuery}%,short_url.ilike.%${searchQuery}%`);
      }
      
      // Apply pagination
      query = query.range(page * limit, (page + 1) * limit - 1);
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching links:', error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!user?.id,
  });
};

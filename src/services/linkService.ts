
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@clerk/clerk-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useIncrementUsage } from "./usageService";

// Types
export interface LinkData {
  id: string;
  user_id: string;
  original_url: string;
  short_url: string;
  custom_backhalf?: string;
  clicks: number;
  created_at: string;
}

// Generate a random alias for short URLs
const generateRandomAlias = (length = 6) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Hook to create a new short link
export const useCreateLink = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const incrementUsage = useIncrementUsage();
  
  return useMutation({
    mutationFn: async ({ 
      originalUrl, 
      customBackhalf 
    }: { 
      originalUrl: string; 
      customBackhalf?: string 
    }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      try {
        // First increment usage counters and check limits
        await incrementUsage.mutateAsync({ 
          type: 'link', 
          customBackHalf: !!customBackhalf 
        });
        
        // Create short URL
        const alias = customBackhalf || generateRandomAlias();
        const baseUrl = window.location.origin;
        const shortUrl = `${baseUrl}/r/${alias}`;
        
        // Check if the custom alias is already taken
        if (customBackhalf) {
          const { data: existingLink } = await supabase
            .from('links')
            .select('id')
            .eq('custom_backhalf', customBackhalf)
            .maybeSingle();
          
          if (existingLink) {
            throw new Error('This custom back-half is already in use. Please choose another one.');
          }
        }
        
        // Insert new link
        const { data, error } = await supabase
          .from('links')
          .insert([{
            user_id: user.id,
            original_url: originalUrl,
            short_url: shortUrl,
            custom_backhalf: customBackhalf || null,
          }])
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } catch (error) {
        // If there's an error after incrementing usage, we should revert the usage increment
        // For now, we'll just propagate the error
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links', user?.id] });
    }
  });
};

// Hook to get all links for a user
export const useUserLinks = () => {
  const { user } = useUser();
  
  return useQuery({
    queryKey: ['links', user?.id],
    queryFn: async (): Promise<LinkData[]> => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });
};

// Hook to increment click count for a link
export const useIncrementLinkClicks = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (linkId: string) => {
      const { data, error } = await supabase
        .from('links')
        .select('clicks')
        .eq('id', linkId)
        .single();
      
      if (error) throw error;
      
      const newClicks = (data.clicks || 0) + 1;
      
      const { data: updatedLink, error: updateError } = await supabase
        .from('links')
        .update({ clicks: newClicks })
        .eq('id', linkId)
        .select()
        .single();
      
      if (updateError) throw updateError;
      return updatedLink;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
    }
  });
};

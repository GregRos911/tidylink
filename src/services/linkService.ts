
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@clerk/clerk-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useIncrementUsage } from "./usage";

// Use the LinkItem type from the new location
import { LinkItem } from "@/lib/types/linkTypes";

// Types
export interface LinkData {
  id: string;
  user_id: string;
  original_url: string;
  short_url: string;
  custom_backhalf?: string;
  title?: string;
  clicks: number;
  created_at: string;
  is_qr_code_generated?: boolean;
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
      customBackhalf,
      title,
      generateQrCode = false
    }: { 
      originalUrl: string; 
      customBackhalf?: string;
      title?: string;
      generateQrCode?: boolean;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      try {
        // Get JWT token from Clerk
        const token = await user.getJWTToken();
        
        // Set the auth token for this request
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: token,
          refresh_token: token, // Using the same token for simplicity
        });
        
        if (sessionError) {
          console.error('Error setting session:', sessionError);
          throw sessionError;
        }
        
        // First increment usage counters and check limits
        await incrementUsage.mutateAsync({ 
          type: 'link', 
          customBackHalf: !!customBackhalf
        });
        
        // If QR code is requested, increment QR code usage
        if (generateQrCode) {
          await incrementUsage.mutateAsync({ 
            type: 'qrCode'
          });
        }
        
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
            title: title || null,
            is_qr_code_generated: generateQrCode
          }])
          .select()
          .single();
        
        if (error) {
          console.error('Error creating link:', error);
          throw error;
        }
        
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
      
      try {
        // Get JWT token from Clerk
        const token = await user.getJWTToken();
        
        // Set the auth token for this request
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: token,
          refresh_token: token, // Using the same token for simplicity
        });
        
        if (sessionError) {
          console.error('Error setting session:', sessionError);
          throw sessionError;
        }
        
        const { data, error } = await supabase
          .from('links')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error fetching links:', error);
        return [];
      }
    },
    enabled: !!user?.id,
  });
};

// Hook to increment click count for a link
export const useIncrementLinkClicks = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  
  return useMutation({
    mutationFn: async (linkId: string) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      try {
        // Get JWT token from Clerk
        const token = await user.getJWTToken();
        
        // Set the auth token for this request
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: token,
          refresh_token: token, // Using the same token for simplicity
        });
        
        if (sessionError) {
          console.error('Error setting session:', sessionError);
          throw sessionError;
        }
        
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
      } catch (error) {
        console.error('Error incrementing clicks:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
    }
  });
};

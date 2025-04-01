
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useIncrementUsage } from "../usage";
import { generateRandomAlias } from "./utils";
import type { LinkData, CreateLinkParams } from "./types";

// Hook to create a new short link
export const useCreateLink = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const incrementUsage = useIncrementUsage();
  
  return useMutation({
    mutationFn: async ({ 
      originalUrl, 
      customBackhalf,
      generateQrCode = false
    }: CreateLinkParams) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      try {
        console.log('Creating link with user ID:', user.id);
        
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
            clicks: 0
          }])
          .select()
          .single();
        
        if (error) {
          console.error('Error creating link:', error);
          throw error;
        }
        
        console.log('Link created successfully:', data);
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

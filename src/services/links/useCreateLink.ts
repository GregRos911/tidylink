
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useIncrementUsage } from "../usage";
import { generateRandomAlias } from "./utils";
import type { LinkData, CreateLinkParams } from "./types";
import { useState } from "react";

// Hook to create a new short link
export const useCreateLink = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const incrementUsage = useIncrementUsage();
  const [createdLink, setCreatedLink] = useState<LinkData | null>(null);
  
  const mutation = useMutation({
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
        
        // Create a unique short URL
        let alias = customBackhalf;
        let isUnique = false;
        
        if (!alias) {
          // Generate unique random alias if no custom backhalf
          while (!isUnique) {
            alias = generateRandomAlias(7);
            
            // Check if alias already exists
            const { data: existingLink } = await supabase
              .from('links')
              .select('id')
              .eq('custom_backhalf', alias)
              .maybeSingle();
            
            isUnique = !existingLink;
          }
        } else {
          // Check if the custom alias is already taken
          const { data: existingLink } = await supabase
            .from('links')
            .select('id')
            .eq('custom_backhalf', alias)
            .maybeSingle();
          
          if (existingLink) {
            throw new Error('This custom back-half is already in use. Please choose another one.');
          }
        }
        
        // Generate the short URL
        const baseUrl = window.location.origin;
        const shortUrl = `${baseUrl}/r/${alias}`;
        
        // Insert new link
        const { data, error } = await supabase
          .from('links')
          .insert([{
            user_id: user.id,
            original_url: originalUrl,
            short_url: shortUrl,
            custom_backhalf: alias,
            clicks: 0
          }])
          .select()
          .single();
        
        if (error) {
          console.error('Error creating link:', error);
          throw error;
        }
        
        console.log('Link created successfully:', data);
        
        // Store the created link data
        setCreatedLink(data);
        
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
  
  return {
    ...mutation,
    createdLink,
    clearCreatedLink: () => setCreatedLink(null)
  };
};

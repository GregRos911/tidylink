
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useIncrementUsage } from "../usage";
import { generateRandomAlias } from "../links/utils";
import type { CreateUTMParams } from "./types";
import type { LinkData } from "../links/types";

// Hook to create a new UTM link for a campaign
export const useCreateUTMLink = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const incrementUsage = useIncrementUsage();
  
  return useMutation({
    mutationFn: async ({
      originalUrl,
      campaignId,
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
      customBackhalf,
    }: CreateUTMParams): Promise<LinkData> => {
      if (!user?.id) throw new Error('User not authenticated');
      
      try {
        console.log('Creating UTM link for user ID:', user.id);
        
        // First increment usage counters and check limits
        await incrementUsage.mutateAsync({ 
          type: 'link', 
          customBackHalf: !!customBackhalf
        });
        
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
        
        // Append UTM parameters to the original URL
        const url = new URL(originalUrl);
        url.searchParams.append('utm_source', utmSource);
        url.searchParams.append('utm_medium', utmMedium);
        url.searchParams.append('utm_campaign', utmCampaign);
        if (utmTerm) url.searchParams.append('utm_term', utmTerm);
        if (utmContent) url.searchParams.append('utm_content', utmContent);
        
        // Insert new link with UTM parameters
        const { data: rawData, error } = await supabase
          .from('links')
          .insert([{
            user_id: user.id,
            campaign_id: campaignId,
            original_url: url.toString(),
            short_url: shortUrl,
            custom_backhalf: alias,
            clicks: 0,
            utm_source: utmSource,
            utm_medium: utmMedium,
            utm_campaign: utmCampaign,
            utm_term: utmTerm || null,
            utm_content: utmContent || null
          }])
          .select();
        
        if (error) {
          console.error('Error creating UTM link:', error);
          throw error;
        }
        
        if (!rawData || rawData.length === 0) {
          throw new Error('Failed to create UTM link: No data returned');
        }
        
        const data = rawData[0] as LinkData;
        console.log('UTM link created successfully:', data);
        return data;
      } catch (error: any) {
        console.error('Error creating UTM link:', error);
        toast.error(error.message || 'Failed to create UTM link');
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['links', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['campaigns', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['campaign-links', data.campaign_id] });
      toast.success('UTM link created successfully!');
    }
  });
};

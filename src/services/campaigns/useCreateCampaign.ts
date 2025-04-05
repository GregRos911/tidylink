
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Campaign, CreateCampaignParams } from "./types";

// Hook to create a new campaign
export const useCreateCampaign = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  
  return useMutation({
    mutationFn: async ({ 
      name,
      description
    }: CreateCampaignParams): Promise<Campaign> => {
      if (!user?.id) throw new Error('User not authenticated');
      
      try {
        console.log('Creating campaign for user ID:', user.id);
        
        // Insert new campaign
        const { data, error } = await supabase
          .from('campaigns')
          .insert([{
            user_id: user.id,
            name,
            description,
            updated_at: new Date().toISOString()
          }])
          .select()
          .single();
        
        if (error) {
          console.error('Error creating campaign:', error);
          throw error;
        }
        
        console.log('Campaign created successfully:', data);
        return data;
      } catch (error: any) {
        console.error('Error creating campaign:', error);
        toast.error(error.message || 'Failed to create campaign');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', user?.id] });
      toast.success('Campaign created successfully!');
    }
  });
};

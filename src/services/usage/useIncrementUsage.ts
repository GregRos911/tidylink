
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FREE_PLAN_LIMITS } from "./constants";

// Hook to increment usage counters
export const useIncrementUsage = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  
  return useMutation({
    mutationFn: async ({ 
      type, 
      customBackHalf = false 
    }: { 
      type: 'link' | 'qrCode'; 
      customBackHalf?: boolean 
    }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      try {
        // Get JWT token from Clerk
        const token = await user.sessionIds[0];
        
        // Set the auth token for this request
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: token,
          refresh_token: token, // Using the same token for simplicity
        });
        
        if (sessionError) {
          console.error('Error setting session:', sessionError);
          throw sessionError;
        }
        
        // Get current usage
        const { data: currentUsage, error: usageError } = await supabase
          .from('usage')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (usageError) {
          console.error('Error getting usage:', usageError);
          throw usageError;
        }
        
        if (!currentUsage) {
          // Create new usage record if it doesn't exist
          const { data, error } = await supabase
            .from('usage')
            .insert([
              { 
                user_id: user.id,
                links_used: type === 'link' ? 1 : 0,
                qr_codes_used: type === 'qrCode' ? 1 : 0,
                custom_backhalves_used: customBackHalf ? 1 : 0,
                last_reset: new Date().toISOString()
              }
            ])
            .select()
            .single();
          
          if (error) {
            console.error('Error creating usage record:', error);
            throw error;
          }
          return data;
        }
        
        // Check limits before incrementing
        if (type === 'link' && (currentUsage.links_used || 0) >= FREE_PLAN_LIMITS.links) {
          throw new Error(`You've reached your monthly limit of ${FREE_PLAN_LIMITS.links} links on the Free Plan. Please upgrade to continue.`);
        }
        
        if (type === 'qrCode' && (currentUsage.qr_codes_used || 0) >= FREE_PLAN_LIMITS.qrCodes) {
          throw new Error(`You've reached your monthly limit of ${FREE_PLAN_LIMITS.qrCodes} QR codes on the Free Plan. Please upgrade to continue.`);
        }
        
        if (customBackHalf && (currentUsage.custom_backhalves_used || 0) >= FREE_PLAN_LIMITS.customBackHalves) {
          throw new Error(`You've reached your monthly limit of ${FREE_PLAN_LIMITS.customBackHalves} custom back-halves on the Free Plan. Please upgrade to continue.`);
        }
        
        // Update usage
        const updates: Record<string, any> = {};
        
        if (type === 'link') updates.links_used = (currentUsage.links_used || 0) + 1;
        if (type === 'qrCode') updates.qr_codes_used = (currentUsage.qr_codes_used || 0) + 1;
        if (customBackHalf) updates.custom_backhalves_used = (currentUsage.custom_backhalves_used || 0) + 1;
        
        const { data, error } = await supabase
          .from('usage')
          .update(updates)
          .eq('user_id', user.id)
          .select()
          .single();
        
        if (error) {
          console.error('Error updating usage:', error);
          throw error;
        }
        return data;
      } catch (error: any) {
        console.error('Error updating usage:', error);
        toast.error(error.message || 'Failed to update usage limits');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usage', user?.id] });
    }
  });
};

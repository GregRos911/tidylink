
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@clerk/clerk-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Free plan limits
export const FREE_PLAN_LIMITS = {
  links: 7,
  qrCodes: 5,
  customBackHalves: 5
};

// Types
export interface UsageData {
  id: string;
  user_id: string;
  links_used: number;
  qr_codes_used: number;
  custom_backhalves_used: number;
  last_reset: string;
  created_at: string;
}

// Hook to get current user usage
export const useUserUsage = () => {
  const { user } = useUser();
  
  return useQuery({
    queryKey: ['usage', user?.id],
    queryFn: async (): Promise<UsageData | null> => {
      if (!user?.id) return null;
      
      // Try to get existing usage record
      const { data, error } = await supabase
        .from('usage')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching usage:', error);
        throw error;
      }
      
      // If no usage record exists, create one
      if (!data) {
        const { data: newUsage, error: insertError } = await supabase
          .from('usage')
          .insert([{ user_id: user.id }])
          .select('*')
          .single();
        
        if (insertError) {
          console.error('Error creating usage record:', insertError);
          throw insertError;
        }
        
        return newUsage;
      }
      
      return data;
    },
    enabled: !!user?.id,
  });
};

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
      
      // Get current usage
      const { data: currentUsage } = await supabase
        .from('usage')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (!currentUsage) {
        // Create new usage record if it doesn't exist
        const { data, error } = await supabase
          .from('usage')
          .insert([
            { 
              user_id: user.id,
              links_used: type === 'link' ? 1 : 0,
              qr_codes_used: type === 'qrCode' ? 1 : 0,
              custom_backhalves_used: customBackHalf ? 1 : 0
            }
          ])
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
      
      // Check limits before incrementing
      if (type === 'link' && currentUsage.links_used >= FREE_PLAN_LIMITS.links) {
        throw new Error(`You've reached your monthly limit of ${FREE_PLAN_LIMITS.links} links on the Free Plan. Please upgrade to continue.`);
      }
      
      if (type === 'qrCode' && currentUsage.qr_codes_used >= FREE_PLAN_LIMITS.qrCodes) {
        throw new Error(`You've reached your monthly limit of ${FREE_PLAN_LIMITS.qrCodes} QR codes on the Free Plan. Please upgrade to continue.`);
      }
      
      if (customBackHalf && currentUsage.custom_backhalves_used >= FREE_PLAN_LIMITS.customBackHalves) {
        throw new Error(`You've reached your monthly limit of ${FREE_PLAN_LIMITS.customBackHalves} custom back-halves on the Free Plan. Please upgrade to continue.`);
      }
      
      // Update usage
      const updates: Record<string, any> = {};
      
      if (type === 'link') updates.links_used = currentUsage.links_used + 1;
      if (type === 'qrCode') updates.qr_codes_used = currentUsage.qr_codes_used + 1;
      if (customBackHalf) updates.custom_backhalves_used = currentUsage.custom_backhalves_used + 1;
      
      const { data, error } = await supabase
        .from('usage')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usage', user?.id] });
    }
  });
};

// Hook to reset usage
export const useResetUsage = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  
  return useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('usage')
        .update({
          links_used: 0,
          qr_codes_used: 0,
          custom_backhalves_used: 0,
          last_reset: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usage', user?.id] });
    }
  });
};

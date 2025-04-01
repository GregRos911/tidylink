
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@clerk/clerk-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
      
      try {
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
          console.log('No usage record found, creating one...');
          const { data: newUsage, error: insertError } = await supabase
            .from('usage')
            .insert([{ 
              user_id: user.id,
              links_used: 0,
              qr_codes_used: 0,
              custom_backhalves_used: 0,
              last_reset: new Date().toISOString()
            }])
            .select('*')
            .single();
          
          if (insertError) {
            console.error('Error creating usage record:', insertError);
            // Instead of throwing immediately, return a default usage object
            return {
              id: 'temp-id',
              user_id: user.id,
              links_used: 0,
              qr_codes_used: 0,
              custom_backhalves_used: 0,
              last_reset: new Date().toISOString(),
              created_at: new Date().toISOString()
            };
          }
          
          return newUsage;
        }
        
        return data;
      } catch (error) {
        console.error('Usage service error:', error);
        // Return a default usage object on error instead of throwing
        return {
          id: 'temp-id',
          user_id: user.id,
          links_used: 0,
          qr_codes_used: 0,
          custom_backhalves_used: 0,
          last_reset: new Date().toISOString(),
          created_at: new Date().toISOString()
        };
      }
    },
    enabled: !!user?.id,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
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
      
      try {
        console.log(`Incrementing ${type} usage for user ${user.id}`);
        
        // Get current usage
        const { data: currentUsage, error: usageError } = await supabase
          .from('usage')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        console.log('Current usage:', currentUsage);
        console.log('Usage error:', usageError);
        
        if (usageError) {
          console.error('Error fetching usage:', usageError);
          throw usageError;
        }
        
        if (!currentUsage) {
          // Create new usage record if it doesn't exist
          console.log('Creating new usage record');
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
        
        console.log('Updating usage with:', updates);
        
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
        
        console.log('Updated usage:', data);
        return data;
      } catch (error: any) {
        console.error('Error in incrementUsage:', error);
        toast.error(error.message || 'Failed to update usage limits');
        throw error;
      }
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
      
      try {
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
      } catch (error: any) {
        console.error('Error resetting usage:', error);
        toast.error(error.message || 'Failed to reset usage stats');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usage', user?.id] });
    }
  });
};


import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Hook to reset usage and clear analytics data
export const useResetUsage = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  
  return useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      try {
        console.log('Resetting usage and analytics for user ID:', user.id);
        
        // Reset usage stats
        const { data: usageData, error: usageError } = await supabase
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
        
        if (usageError) {
          console.error('Error resetting usage:', usageError);
          throw usageError;
        }
        
        // Delete all analytics data for this user
        const { error: analyticsError } = await supabase
          .from('link_analytics')
          .delete()
          .eq('user_id', user.id);
          
        if (analyticsError) {
          console.error('Error deleting analytics:', analyticsError);
          throw analyticsError;
        }
        
        return usageData;
      } catch (error: any) {
        console.error('Error resetting data:', error);
        toast.error(error.message || 'Failed to reset data');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usage', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['analytics', user?.id] });
      toast.success('All usage stats and analytics data have been reset successfully!');
    }
  });
};

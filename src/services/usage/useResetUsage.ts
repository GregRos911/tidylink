
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Hook to reset usage
export const useResetUsage = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  
  return useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      try {
        console.log('Resetting usage for user ID:', user.id);
        
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
        
        if (error) {
          console.error('Error resetting usage:', error);
          throw error;
        }
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

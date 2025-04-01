
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Hook to increment click count for a link
export const useIncrementLinkClicks = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (linkId: string) => {
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
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
    }
  });
};

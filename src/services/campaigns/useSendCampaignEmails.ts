
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface SendCampaignEmailsParams {
  campaignId: string;
  emails: string[];
  subject: string;
  message?: string;
}

interface SendCampaignEmailsResult {
  sent: number;
  failed: number;
  total: number;
}

// Hook to send campaign emails
export const useSendCampaignEmails = () => {
  const { user } = useUser();
  
  return useMutation({
    mutationFn: async ({ 
      campaignId,
      emails,
      subject,
      message
    }: SendCampaignEmailsParams): Promise<SendCampaignEmailsResult> => {
      if (!user?.id) throw new Error('User not authenticated');
      
      try {
        console.log('Sending campaign emails for campaign ID:', campaignId);
        
        const response = await fetch(`${window.location.origin}/functions/v1/send-campaign-emails`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}`,
          },
          body: JSON.stringify({
            campaignId,
            emails,
            subject,
            message,
            userId: user.id,
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to send campaign emails');
        }
        
        const result = await response.json();
        console.log('Campaign emails sent successfully:', result);
        return result;
      } catch (error: any) {
        console.error('Error sending campaign emails:', error);
        toast.error(error.message || 'Failed to send campaign emails');
        throw error;
      }
    },
    onSuccess: (data) => {
      if (data.failed > 0) {
        toast.warning(`Sent ${data.sent} emails successfully (${data.failed} failed)`);
      } else {
        toast.success(`Successfully sent ${data.sent} campaign emails!`);
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send campaign emails');
    }
  });
};

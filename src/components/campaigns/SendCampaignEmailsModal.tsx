
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Campaign } from '@/services/campaigns/types';
import { useSendCampaignEmails } from '@/services/campaigns/useSendCampaignEmails';
import { EmailForm, FormValues, formSchema } from './email-modal/EmailForm';
import { parseEmails } from './email-modal/EmailUtils';
import ResultSummary from './email-modal/ResultSummary';

interface SendCampaignEmailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign;
}

const SendCampaignEmailsModal: React.FC<SendCampaignEmailsModalProps> = ({ 
  isOpen, 
  onClose,
  campaign 
}) => {
  const [result, setResult] = useState<{ sent: number; failed: number; total: number } | null>(null);
  const sendEmails = useSendCampaignEmails();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: `${campaign.name} - Check out this link!`,
      emailRecipients: '',
      message: '',
    },
  });
  
  const onSubmit = async (values: FormValues) => {
    const emails = parseEmails(values.emailRecipients);
    
    if (emails.length === 0) {
      form.setError('emailRecipients', {
        type: 'manual',
        message: 'No valid email addresses found',
      });
      return;
    }
    
    if (emails.length > 500) {
      form.setError('emailRecipients', {
        type: 'manual',
        message: 'Maximum 500 recipients allowed',
      });
      return;
    }
    
    try {
      const result = await sendEmails.mutateAsync({
        campaignId: campaign.id,
        emails,
        subject: values.subject,
        message: values.message,
      });
      
      setResult(result);
    } catch (error) {
      console.error('Error sending campaign emails:', error);
    }
  };
  
  const handleClose = () => {
    form.reset();
    setResult(null);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Send Campaign Emails</DialogTitle>
        </DialogHeader>
        
        {result ? (
          <ResultSummary result={result} onClose={handleClose} />
        ) : (
          <EmailForm 
            form={form} 
            onSubmit={onSubmit} 
            onClose={handleClose} 
            isPending={sendEmails.isPending} 
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SendCampaignEmailsModal;

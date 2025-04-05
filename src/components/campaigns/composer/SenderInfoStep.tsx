
import React from 'react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CampaignData } from '../CampaignComposer';
import { Campaign } from '@/services/campaigns/types';
import EmailInfoAlert from './sender-step/EmailInfoAlert';
import FormFieldWithTooltip from './sender-step/FormFieldWithTooltip';
import { senderFormSchema, SenderFormValues } from './sender-step/senderFormSchema';

interface SenderInfoStepProps {
  campaignData: CampaignData;
  updateCampaignData: (data: Partial<CampaignData>) => void;
  campaign: Campaign;
}

const SenderInfoStep: React.FC<SenderInfoStepProps> = ({
  campaignData,
  updateCampaignData
}) => {
  const form = useForm<SenderFormValues>({
    resolver: zodResolver(senderFormSchema),
    defaultValues: {
      fromName: campaignData.fromName,
      fromEmail: campaignData.fromEmail,
      subject: campaignData.subject,
    },
  });
  
  // Update parent form data when this form changes
  React.useEffect(() => {
    const subscription = form.watch((value) => {
      updateCampaignData({
        fromName: value.fromName || campaignData.fromName,
        fromEmail: value.fromEmail || campaignData.fromEmail,
        subject: value.subject || campaignData.subject,
      });
    });
    
    return () => subscription.unsubscribe();
  }, [form, updateCampaignData, campaignData]);
  
  return (
    <div className="space-y-4">
      <EmailInfoAlert />
      
      <Form {...form}>
        <form className="space-y-4">
          <FormFieldWithTooltip 
            control={form.control}
            name="fromName"
            label="Sender Name"
            tooltipText="This is the name that will appear as the sender in the recipient's inbox."
            placeholder="Your Company"
          />
          
          <FormFieldWithTooltip 
            control={form.control}
            name="fromEmail"
            label="Sender Email"
            tooltipText="This email must be from a domain you've verified with Resend. Using non-verified domains may cause your emails to be marked as spam."
            placeholder="noreply@yourdomain.com"
            type="email"
            tooltipWidth="w-80"
          />
          
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Subject</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default SenderInfoStep;

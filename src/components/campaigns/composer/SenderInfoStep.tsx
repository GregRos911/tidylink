
import React from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CampaignData } from '../CampaignComposer';
import { Campaign } from '@/services/campaigns/types';
import { InfoCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SenderInfoStepProps {
  campaignData: CampaignData;
  updateCampaignData: (data: Partial<CampaignData>) => void;
  campaign: Campaign;
}

const formSchema = z.object({
  fromName: z.string().min(2, 'Name is required'),
  fromEmail: z.string().email('Valid email is required'),
  subject: z.string().min(1, 'Subject is required'),
});

const SenderInfoStep: React.FC<SenderInfoStepProps> = ({
  campaignData,
  updateCampaignData
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <InfoCircle className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Important</h3>
            <p className="text-sm text-yellow-700 mt-1">
              To prevent your emails from landing in spam, make sure:
            </p>
            <ul className="list-disc list-inside text-sm text-yellow-700 mt-1">
              <li>You've verified your domain with Resend</li>
              <li>Your 'From' email matches your verified domain</li>
              <li>Your email content is relevant to recipients</li>
            </ul>
          </div>
        </div>
      </div>
      
      <Form {...form}>
        <form className="space-y-4">
          <FormField
            control={form.control}
            name="fromName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  Sender Name 
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoCircle className="h-4 w-4 ml-2 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-60">This is the name that will appear as the sender in the recipient's inbox.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Your Company" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="fromEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  Sender Email
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoCircle className="h-4 w-4 ml-2 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-80">This email must be from a domain you've verified with Resend. Using non-verified domains may cause your emails to be marked as spam.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="noreply@yourdomain.com" type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
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


import React from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CampaignData } from '../CampaignComposer';
import { Campaign } from '@/services/campaigns/types';
import { AlertCircle, FileText, Tag } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ComposeMessageStepProps {
  campaignData: CampaignData;
  updateCampaignData: (data: Partial<CampaignData>) => void;
  campaign: Campaign;
}

const formSchema = z.object({
  message: z.string().min(1, 'Message content is required'),
});

const ComposeMessageStep: React.FC<ComposeMessageStepProps> = ({
  campaignData,
  updateCampaignData
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: campaignData.message,
    },
  });
  
  // Update parent form data when this form changes
  React.useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.message !== undefined) {
        updateCampaignData({ message: value.message });
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, updateCampaignData]);
  
  return (
    <div className="space-y-4">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Compose your campaign message</AlertTitle>
        <AlertDescription>
          Write the content of your email. You'll be able to add a tracked link in the next step.
        </AlertDescription>
      </Alert>
      
      <Form {...form}>
        <form className="space-y-4">
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Message Content
                </FormLabel>
                <div className="text-sm text-gray-500 mb-2">
                  Write your email message. You can use HTML formatting like &lt;b&gt;bold&lt;/b&gt; and &lt;i&gt;italic&lt;/i&gt;.
                </div>
                <FormControl>
                  <Textarea 
                    {...field} 
                    placeholder="Hello,&#10;&#10;We wanted to share this link with you...&#10;&#10;[Your link will be added in the next step]&#10;&#10;Best regards,&#10;Your team" 
                    className="h-60"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      
      <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
        <h3 className="flex items-center gap-2 text-sm font-medium mb-2">
          <Tag className="h-4 w-4" /> Available Template Variables
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="bg-white p-2 rounded border text-sm">
            <code className="text-pink-600">{'{{firstName}}'}</code>
            <span className="text-gray-500 text-xs ml-2">Recipient's first name</span>
          </div>
          <div className="bg-white p-2 rounded border text-sm">
            <code className="text-pink-600">{'{{lastName}}'}</code>
            <span className="text-gray-500 text-xs ml-2">Recipient's last name</span>
          </div>
          <div className="bg-white p-2 rounded border text-sm">
            <code className="text-pink-600">{'{{trackingLink}}'}</code>
            <span className="text-gray-500 text-xs ml-2">Your campaign tracking link</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          These variables will be automatically replaced with the appropriate values when your email is sent.
        </p>
      </div>
    </div>
  );
};

export default ComposeMessageStep;

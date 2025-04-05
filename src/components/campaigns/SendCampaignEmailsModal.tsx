
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Campaign } from '@/services/campaigns/types';
import { useSendCampaignEmails } from '@/services/campaigns/useSendCampaignEmails';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface SendCampaignEmailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign;
}

const formSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  emailRecipients: z.string().min(3, 'At least one email is required'),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

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
  
  const parseEmails = (input: string): string[] => {
    // Split by commas, semicolons, spaces, or newlines
    const parts = input.split(/[,;\s\n]+/);
    
    // Simple regex for valid emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Filter valid emails and remove duplicates
    return [...new Set(parts.filter(part => emailRegex.test(part.trim())))];
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
          <div className="space-y-6">
            <Alert variant={result.failed > 0 ? "destructive" : "default"}>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Email sending completed</AlertTitle>
              <AlertDescription>
                Successfully sent {result.sent} of {result.total} emails
                {result.failed > 0 && ` (${result.failed} failed)`}.
              </AlertDescription>
            </Alert>
            
            <DialogFooter>
              <Button 
                type="button" 
                onClick={handleClose}
                className="bg-brand-blue hover:bg-brand-blue/90 w-full"
              >
                Close
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              
              <FormField
                control={form.control}
                name="emailRecipients"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Recipients</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter email addresses (separated by commas, spaces or new lines)" 
                        className="h-32"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-gray-500 mt-1">
                      Maximum 500 recipients. Duplicates will be removed automatically.
                    </p>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message (optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter an optional message to include in the email" 
                        {...field} 
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleClose}
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={sendEmails.isPending}
                  className="bg-brand-blue hover:bg-brand-blue/90"
                >
                  {sendEmails.isPending ? 'Sending...' : 'Send Emails'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SendCampaignEmailsModal;

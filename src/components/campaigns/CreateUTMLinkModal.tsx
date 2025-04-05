
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCreateUTMLink } from '@/services/campaigns';
import { Campaign } from '@/services/campaigns/types';
import { toast } from 'sonner';

interface CreateUTMLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign;
}

// Validation schema
const formSchema = z.object({
  originalUrl: z.string().url('Enter a valid URL'),
  utmSource: z.string().min(1, 'Source is required'),
  utmMedium: z.string().min(1, 'Medium is required'),
  utmCampaign: z.string().min(1, 'Campaign name is required'),
  utmTerm: z.string().optional(),
  utmContent: z.string().optional(),
  customBackhalf: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CreateUTMLinkModal: React.FC<CreateUTMLinkModalProps> = ({
  isOpen,
  onClose,
  campaign,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createUTMLink = useCreateUTMLink();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      originalUrl: '',
      utmSource: '',
      utmMedium: '',
      utmCampaign: campaign.name,
      utmTerm: '',
      utmContent: '',
      customBackhalf: '',
    },
  });
  
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      await createUTMLink.mutateAsync({
        originalUrl: values.originalUrl,
        campaignId: campaign.id,
        utmSource: values.utmSource,
        utmMedium: values.utmMedium,
        utmCampaign: values.utmCampaign,
        utmTerm: values.utmTerm,
        utmContent: values.utmContent,
        customBackhalf: values.customBackhalf || undefined,
      });
      
      form.reset();
      onClose();
    } catch (error: any) {
      console.error('Error creating UTM link:', error);
      toast.error(error.message || 'Failed to create UTM link');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleClose = () => {
    form.reset();
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create UTM Link for {campaign.name}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="originalUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destination URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/landing-page" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="utmSource"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source</FormLabel>
                    <FormControl>
                      <Input placeholder="facebook" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="utmMedium"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medium</FormLabel>
                    <FormControl>
                      <Input placeholder="social" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="utmCampaign"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="utmTerm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Term (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="running+shoes" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="utmContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="logolink" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="customBackhalf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom Back-half (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="summer-sale" {...field} value={field.value || ''} />
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
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-brand-blue hover:bg-brand-blue/90"
              >
                {isSubmitting ? 'Creating...' : 'Create UTM Link'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUTMLinkModal;

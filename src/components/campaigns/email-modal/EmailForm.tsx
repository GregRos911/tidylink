
import React from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  emailRecipients: z.string().min(3, 'At least one email is required'),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EmailFormProps {
  form: UseFormReturn<FormValues>;
  onSubmit: (values: FormValues) => void;
  onClose: () => void;
  isPending: boolean;
}

const EmailForm: React.FC<EmailFormProps> = ({ 
  form, 
  onSubmit, 
  onClose, 
  isPending 
}) => {
  return (
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
            onClick={onClose}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isPending}
            className="bg-brand-blue hover:bg-brand-blue/90"
          >
            {isPending ? 'Sending...' : 'Send Emails'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export { EmailForm, formSchema };
export type { FormValues };

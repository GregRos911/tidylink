
import React from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { NewLinkFormValues } from './linkFormSchema';

interface NewLinkFormProps {
  form: UseFormReturn<NewLinkFormValues>;
}

const NewLinkForm: React.FC<NewLinkFormProps> = ({ form }) => {
  return (
    <Form {...form}>
      <form className="space-y-3">
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Destination URL</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://yourdomain.com/landing-page" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="utmSource"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Source</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="email" />
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
                <FormLabel className="text-xs">Medium</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="utmCampaign"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Campaign Name</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                <FormLabel className="text-xs">Content (optional)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="campaign_email" value={field.value || ''} />
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
              <FormLabel className="text-xs">Custom Back-half (optional)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="summer-sale" value={field.value || ''} />
              </FormControl>
              <FormMessage />
              <p className="text-xs text-gray-500 mt-1">
                Leave blank to generate automatically
              </p>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default NewLinkForm;

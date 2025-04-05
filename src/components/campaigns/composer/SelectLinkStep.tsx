
import React, { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CampaignData } from '../CampaignComposer';
import { Campaign } from '@/services/campaigns/types';
import { useCampaignLinks, useCreateUTMLink } from '@/services/campaigns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LinkIcon, Link2Icon, Plus } from 'lucide-react';

interface SelectLinkStepProps {
  campaignData: CampaignData;
  updateCampaignData: (data: Partial<CampaignData>) => void;
  campaign: Campaign;
}

const newLinkSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
  utmSource: z.string().min(1, 'Source is required'),
  utmMedium: z.string().min(1, 'Medium is required'),
  utmCampaign: z.string().min(1, 'Campaign name is required'),
  utmContent: z.string().optional(),
  customBackhalf: z.string().optional(),
});

const SelectLinkStep: React.FC<SelectLinkStepProps> = ({
  campaignData,
  updateCampaignData,
  campaign
}) => {
  const [linkOption, setLinkOption] = useState<'existing' | 'new'>(
    campaignData.selectedLinkId ? 'existing' : 'new'
  );
  
  const { data: links, isLoading: isLoadingLinks } = useCampaignLinks(campaign.id);
  
  const form = useForm<z.infer<typeof newLinkSchema>>({
    resolver: zodResolver(newLinkSchema),
    defaultValues: {
      url: campaignData.newLink?.url || '',
      utmSource: campaignData.newLink?.utmSource || 'email',
      utmMedium: campaignData.newLink?.utmMedium || 'email',
      utmCampaign: campaignData.newLink?.utmCampaign || campaign.name,
      utmContent: campaignData.newLink?.utmContent || 'campaign_email',
      customBackhalf: campaignData.newLink?.customBackhalf || '',
    },
  });
  
  // Update parent form data when this form changes
  React.useEffect(() => {
    if (linkOption === 'new') {
      const subscription = form.watch((value) => {
        updateCampaignData({
          selectedLinkId: undefined,
          newLink: {
            url: value.url || '',
            utmSource: value.utmSource || 'email',
            utmMedium: value.utmMedium || 'email',
            utmCampaign: value.utmCampaign || campaign.name,
            utmContent: value.utmContent,
            customBackhalf: value.customBackhalf,
          }
        });
      });
      
      return () => subscription.unsubscribe();
    }
  }, [form, updateCampaignData, linkOption, campaign.name]);
  
  const handleExistingLinkSelect = (linkId: string) => {
    updateCampaignData({ 
      selectedLinkId: linkId,
      newLink: undefined
    });
  };
  
  const handleOptionChange = (value: 'existing' | 'new') => {
    setLinkOption(value);
    
    if (value === 'existing' && links && links.length > 0) {
      updateCampaignData({
        selectedLinkId: campaignData.selectedLinkId || links[0].id,
        newLink: undefined
      });
    } else {
      updateCampaignData({
        selectedLinkId: undefined,
        newLink: {
          url: form.getValues('url') || '',
          utmSource: form.getValues('utmSource') || 'email',
          utmMedium: form.getValues('utmMedium') || 'email',
          utmCampaign: form.getValues('utmCampaign') || campaign.name,
          utmContent: form.getValues('utmContent'),
          customBackhalf: form.getValues('customBackhalf'),
        }
      });
    }
  };
  
  return (
    <div className="space-y-4">
      <Alert>
        <LinkIcon className="h-4 w-4" />
        <AlertTitle>Add a Tracking Link</AlertTitle>
        <AlertDescription>
          Choose an existing link or create a new one to include in your campaign emails.
        </AlertDescription>
      </Alert>
      
      <RadioGroup 
        defaultValue={linkOption} 
        onValueChange={(v) => handleOptionChange(v as 'existing' | 'new')}
        className="space-y-3"
      >
        <div className={`flex items-start space-x-2 p-3 rounded-md border ${linkOption === 'existing' ? 'bg-gray-50 border-brand-blue' : ''}`}>
          <RadioGroupItem value="existing" id="existing" className="mt-1" />
          <div className="flex-1">
            <label htmlFor="existing" className="block font-medium text-sm cursor-pointer">
              Use an existing link from this campaign
            </label>
            {linkOption === 'existing' && (
              <div className="mt-3">
                {isLoadingLinks ? (
                  <p className="text-sm text-gray-500">Loading links...</p>
                ) : links && links.length > 0 ? (
                  <div className="grid gap-3">
                    {links.map(link => (
                      <div 
                        key={link.id}
                        className={`
                          flex items-center border rounded-md p-2 cursor-pointer 
                          ${campaignData.selectedLinkId === link.id ? 'bg-gray-100 border-gray-400' : 'hover:bg-gray-50'}
                        `}
                        onClick={() => handleExistingLinkSelect(link.id)}
                      >
                        <Link2Icon className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <div className="ml-3 flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{link.original_url}</p>
                          <p className="text-xs text-gray-500 truncate">{link.short_url}</p>
                        </div>
                        <div className="ml-2 flex-shrink-0 text-xs text-gray-500">
                          {link.clicks} clicks
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No links found for this campaign. Create a new one.</p>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className={`flex items-start space-x-2 p-3 rounded-md border ${linkOption === 'new' ? 'bg-gray-50 border-brand-blue' : ''}`}>
          <RadioGroupItem value="new" id="new" className="mt-1" />
          <div className="flex-1">
            <label htmlFor="new" className="block font-medium text-sm cursor-pointer">
              Create a new tracking link
            </label>
            
            {linkOption === 'new' && (
              <div className="mt-3">
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
              </div>
            )}
          </div>
        </div>
      </RadioGroup>
    </div>
  );
};

export default SelectLinkStep;

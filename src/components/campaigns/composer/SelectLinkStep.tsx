
import React, { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CampaignData } from '../CampaignComposer';
import { Campaign } from '@/services/campaigns/types';
import { useCampaignLinks } from '@/services/campaigns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LinkIcon } from 'lucide-react';
import { newLinkSchema, NewLinkFormValues } from './link-step/linkFormSchema';
import ExistingLinksList from './link-step/ExistingLinksList';
import NewLinkForm from './link-step/NewLinkForm';

interface SelectLinkStepProps {
  campaignData: CampaignData;
  updateCampaignData: (data: Partial<CampaignData>) => void;
  campaign: Campaign;
}

const SelectLinkStep: React.FC<SelectLinkStepProps> = ({
  campaignData,
  updateCampaignData,
  campaign
}) => {
  const [linkOption, setLinkOption] = useState<'existing' | 'new'>(
    campaignData.selectedLinkId ? 'existing' : 'new'
  );
  
  const { data: links, isLoading: isLoadingLinks } = useCampaignLinks(campaign.id);
  
  const form = useForm<NewLinkFormValues>({
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
  useEffect(() => {
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
                <ExistingLinksList 
                  links={links}
                  isLoading={isLoadingLinks}
                  selectedLinkId={campaignData.selectedLinkId}
                  onSelectLink={handleExistingLinkSelect}
                />
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
                <NewLinkForm form={form} />
              </div>
            )}
          </div>
        </div>
      </RadioGroup>
    </div>
  );
};

export default SelectLinkStep;

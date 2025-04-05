
import { Campaign } from '@/services/campaigns/types';

// Define a type for our form data
export interface CampaignData {
  fromName: string;
  fromEmail: string;
  subject: string;
  message: string;
  recipients: string[];
  selectedLinkId?: string;
  newLink?: {
    url: string;
    utmSource: string;
    utmMedium: string;
    utmCampaign: string;
    utmContent?: string;
    customBackhalf?: string;
  };
}

export interface ComposerStepProps {
  campaignData: CampaignData;
  updateCampaignData: (data: Partial<CampaignData>) => void;
  campaign: Campaign;
}


// Types for campaign data
export interface Campaign {
  id: string;
  user_id: string;
  name: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

// Parameters for creating a campaign
export interface CreateCampaignParams {
  name: string;
  description?: string;
}

// Parameters for generating a UTM link
export interface CreateUTMParams {
  originalUrl: string;
  campaignId: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm?: string;
  utmContent?: string;
  customBackhalf?: string;
}

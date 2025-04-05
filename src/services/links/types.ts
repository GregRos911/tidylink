
// Types for link related data and operations
export interface LinkData {
  id: string;
  original_url: string;
  short_url: string;
  created_at: string;
  user_id: string;
  clicks: number;
  custom_backhalf: string | null;
  qr_code_design_id: string | null;
  campaign_id: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
}

export interface CreateLinkParams {
  originalUrl: string;
  customBackhalf?: string;
}

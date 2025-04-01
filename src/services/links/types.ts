
// Types for link data
export interface LinkData {
  id: string;
  user_id: string;
  original_url: string;
  short_url: string;
  custom_backhalf?: string;
  created_at: string;
  clicks: number;
}

// Parameters for creating a link
export interface CreateLinkParams {
  originalUrl: string;
  customBackhalf?: string;
  generateQrCode?: boolean;
}

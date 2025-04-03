
// Types for link data
export interface LinkData {
  id: string;
  user_id: string;
  original_url: string;
  short_url: string;
  custom_backhalf?: string;
  created_at: string;
  clicks: number;
  qr_code_design_id?: string; // Added this property for QR code support
}

// Parameters for creating a link
export interface CreateLinkParams {
  originalUrl: string;
  customBackhalf?: string;
  generateQrCode?: boolean;
}

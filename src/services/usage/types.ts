
// Types related to usage tracking
export interface UsageData {
  id: string;
  user_id: string;
  links_used: number;
  qr_codes_used: number;
  custom_backhalves_used: number;
  last_reset: string;
  created_at: string;
}


export type DateRange = '7' | '30' | '90' | 'all';

export interface AnalyticsDataPoint {
  date: string;
  clicks: number;
  scans: number;
  total: number;
}

export interface DeviceDataPoint {
  device: string;
  count: number;
  percentage: number;
}

export interface ReferrerDataPoint {
  referrer: string;
  count: number;
}

export interface TopDateInfo {
  date: string;
  count: number;
}

export interface TopLocationInfo {
  location: string;
  count: number;
}

export interface AnalyticsData {
  byDate: AnalyticsDataPoint[];
  byDevice: DeviceDataPoint[];
  byReferrer: ReferrerDataPoint[];
  byLocation: any[]; // Using any[] for compatibility with LocationChart.tsx
  topDate: TopDateInfo | null;
  topLocation: TopLocationInfo | null;
  totalClicks: number;
  totalScans: number;
}

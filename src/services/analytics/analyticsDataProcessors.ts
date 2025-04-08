
import { LocationDataPoint } from '@/components/analytics/LocationChart';

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

export interface AnalyticsData {
  byDate: AnalyticsDataPoint[];
  byDevice: DeviceDataPoint[];
  byReferrer: ReferrerDataPoint[];
  byLocation: LocationDataPoint[];
  topDate: { date: string; count: number } | null;
  topLocation: { location: string; count: number } | null;
  totalClicks: number;
  totalScans: number;
}

/**
 * Process raw analytics data for time series chart
 */
export const processDateData = (data: any[]): AnalyticsDataPoint[] => {
  // Group by date
  const byDateMap = new Map<string, { clicks: number, scans: number }>();
  
  data.forEach(item => {
    const date = new Date(item.created_at).toLocaleDateString();
    if (!byDateMap.has(date)) {
      byDateMap.set(date, { clicks: 0, scans: 0 });
    }
    const current = byDateMap.get(date)!;
    if (item.is_qr_scan) {
      current.scans += 1;
    } else {
      current.clicks += 1;
    }
  });
  
  // Convert to array and sort by date
  return Array.from(byDateMap.entries())
    .map(([date, counts]) => ({
      date,
      clicks: counts.clicks,
      scans: counts.scans,
      total: counts.clicks + counts.scans
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

/**
 * Find top performing date based on total engagements
 */
export const findTopDate = (dateData: AnalyticsDataPoint[]): { date: string; count: number } | null => {
  return dateData.length > 0 
    ? dateData.reduce((max, current) => 
        current.total > max.total ? current : max, dateData[0])
    : null;
};

/**
 * Process device type data
 */
export const processDeviceData = (data: any[]): DeviceDataPoint[] => {
  // Group by device
  const byDeviceMap = new Map<string, number>();
  data.forEach(item => {
    const device = item.device_type || 'Unknown';
    byDeviceMap.set(device, (byDeviceMap.get(device) || 0) + 1);
  });
  
  // Convert to array with percentages
  return Array.from(byDeviceMap.entries())
    .map(([device, count]) => ({
      device,
      count,
      percentage: Math.round((count / data.length) * 100)
    }))
    .sort((a, b) => b.count - a.count);
};

/**
 * Process referrer data
 */
export const processReferrerData = (data: any[]): ReferrerDataPoint[] => {
  // Group by referrer
  const byReferrerMap = new Map<string, number>();
  data.forEach(item => {
    const referrer = item.referrer || 'Direct';
    byReferrerMap.set(referrer, (byReferrerMap.get(referrer) || 0) + 1);
  });
  
  // Convert to array
  return Array.from(byReferrerMap.entries())
    .map(([referrer, count]) => ({ referrer, count }))
    .sort((a, b) => b.count - a.count);
};

/**
 * Process location data and find top location
 */
export const processLocationData = (data: any[]): { 
  locationData: LocationDataPoint[],
  topLocation: { location: string; count: number } | null
} => {
  // Log location data for debugging
  const locationDetails = data.map(item => ({
    country: item.location_country || 'null',
    city: item.location_city || 'null'
  }));
  console.log('Location data in analytics:', locationDetails);
  
  // Group by location (country if available, otherwise city)
  const byLocationMap = new Map<string, number>();
  data.forEach(item => {
    // Make sure we use a meaningful location value, prioritizing country
    let location = 'Unknown';
    
    if (item.location_country && item.location_country !== 'Unknown' && item.location_country !== 'null') {
      location = item.location_country;
    } else if (item.location_city && item.location_city !== 'Unknown' && item.location_city !== 'null') {
      location = item.location_city;
    }
    
    byLocationMap.set(location, (byLocationMap.get(location) || 0) + 1);
  });
  
  // Convert to array
  const locationData = Array.from(byLocationMap.entries())
    .map(([location, count]) => ({ location, count }))
    .sort((a, b) => b.count - a.count);
  
  console.log('Processed location data:', locationData);
  
  // Find top location - prefer non-Unknown locations if available
  let topLocation = null;
  if (locationData.length > 0) {
    const nonUnknownLocations = locationData.filter(item => item.location !== 'Unknown');
    if (nonUnknownLocations.length > 0) {
      topLocation = { 
        location: nonUnknownLocations[0].location, 
        count: nonUnknownLocations[0].count 
      };
    } else {
      topLocation = { 
        location: locationData[0].location, 
        count: locationData[0].count 
      };
    }
  }
  
  console.log('Top location:', topLocation);
  
  return { locationData, topLocation };
};

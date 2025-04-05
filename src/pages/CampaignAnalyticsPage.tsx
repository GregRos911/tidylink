
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardTopBar from '@/components/dashboard/DashboardTopBar';
import { useCampaignAnalytics, useUserCampaigns } from '@/services/campaigns';
import TopStatsCard from '@/components/analytics/TopStatsCard';
import TimeSeriesChart from '@/components/analytics/TimeSeriesChart';
import DeviceChart from '@/components/analytics/DeviceChart';
import LocationChart from '@/components/analytics/LocationChart';
import ReferrerChart from '@/components/analytics/ReferrerChart';
import ChartCard from '@/components/analytics/ChartCard';
import { DateRange } from '@/services/analytics/useAnalyticsData';

const CampaignAnalyticsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [dateRange, setDateRange] = useState<DateRange>('30');
  const { data: campaigns } = useUserCampaigns();
  const campaign = campaigns?.find(c => c.id === id);
  
  const { 
    data: analyticsData,
    isLoading: isLoadingAnalytics 
  } = useCampaignAnalytics(id);
  
  // Transform data to match the expected format for chart components
  const timeSeriesData = analyticsData?.clicksByDay.map(item => ({
    date: item.date,
    clicks: item.clicks,
    scans: 0, // Set default scans to 0
    total: item.clicks // Total is equal to clicks since we don't have scans
  })) || [];
  
  // Transform device data to match the expected format
  const deviceData = analyticsData?.deviceTypes.map(item => ({
    device: item.device_type,
    count: item.count,
    percentage: 0 // Add percentage field
  })) || [];
  
  // Update percentage values for device data
  const totalDeviceCount = deviceData.reduce((sum, item) => sum + item.count, 0);
  deviceData.forEach(item => {
    item.percentage = totalDeviceCount > 0 
      ? Math.round((item.count / totalDeviceCount) * 100) 
      : 0;
  });
  
  // Transform location data to match the expected format
  const locationData = analyticsData?.topLocations.map(item => ({
    location: item.location_country || 'Unknown',
    count: item.count
  })) || [];
  
  // Transform referrer data to match the expected format
  const referrerData = analyticsData?.topReferrers.map(item => ({
    referrer: item.referrer || 'Direct',
    count: item.count
  })) || [];
  
  const isEmpty = !analyticsData || (
    timeSeriesData.length === 0 && 
    deviceData.length === 0 && 
    locationData.length === 0 && 
    referrerData.length === 0
  );
  
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar - Hidden on mobile */}
      <DashboardSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <DashboardTopBar setShowCreateLinkCard={() => {}} />
        
        {/* Dashboard Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <Link 
                to={`/campaigns/${id}`}
                className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to campaign
              </Link>
              
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{campaign?.name || 'Campaign'} Analytics</h2>
                <p className="text-gray-500">View detailed performance data for this campaign</p>
              </div>
            </div>
            
            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Total Clicks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData?.totalClicks || 0}</div>
                  <CardDescription>All campaign link clicks</CardDescription>
                </CardContent>
              </Card>
            </div>
            
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <ChartCard 
                title="Traffic Over Time"
                description="Clicks by date"
                isEmpty={timeSeriesData.length === 0}
              >
                <TimeSeriesChart data={timeSeriesData} />
              </ChartCard>
              
              <ChartCard 
                title="Traffic by Device"
                description="Distribution across device types"
                isEmpty={deviceData.length === 0}
              >
                <DeviceChart data={deviceData} />
              </ChartCard>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard 
                title="Traffic by Location"
                description="Where your visitors are from"
                isEmpty={locationData.length === 0}
              >
                <LocationChart data={locationData} />
              </ChartCard>
              
              <ChartCard 
                title="Traffic by Referrer"
                description="Where your traffic is coming from"
                isEmpty={referrerData.length === 0}
              >
                <ReferrerChart data={referrerData} />
              </ChartCard>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// Import the Card components at the top level to avoid React hook ordering issues
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default CampaignAnalyticsPage;


import React from 'react';
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
import AnalyticsHeader from '@/components/analytics/AnalyticsHeader';
import ChartCard from '@/components/analytics/ChartCard';

const CampaignAnalyticsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
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
    location: item.location_country,
    count: item.count
  })) || [];
  
  // Transform referrer data to match the expected format
  const referrerData = analyticsData?.topReferrers.map(item => ({
    referrer: item.referrer,
    count: item.count
  })) || [];
  
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
              
              {/* Using dateRange="30" as a default since it's required by AnalyticsHeader */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{campaign?.name || 'Campaign'} Analytics</h2>
                <p className="text-gray-500">View detailed performance data for this campaign</p>
              </div>
            </div>
            
            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <TopStatsCard
                label="Total Clicks"
                value={analyticsData?.totalClicks || 0}
                icon={<Calendar className="text-blue-600" />}
                loading={isLoadingAnalytics}
              />
            </div>
            
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <ChartCard title="Clicks Over Time">
                <TimeSeriesChart data={timeSeriesData} />
              </ChartCard>
              
              <ChartCard title="Device Types">
                <DeviceChart data={deviceData} />
              </ChartCard>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="Top Locations">
                <LocationChart data={locationData} />
              </ChartCard>
              
              <ChartCard title="Top Referrers">
                <ReferrerChart data={referrerData} />
              </ChartCard>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CampaignAnalyticsPage;

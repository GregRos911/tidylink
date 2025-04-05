
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
              
              <AnalyticsHeader 
                title={`${campaign?.name || 'Campaign'} Analytics`}
                description="View detailed performance data for this campaign"
                isLoading={isLoadingAnalytics}
              />
            </div>
            
            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <TopStatsCard
                title="Total Clicks"
                value={analyticsData?.totalClicks || 0}
                icon={<Calendar className="text-blue-600" />}
                isLoading={isLoadingAnalytics}
              />
            </div>
            
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <ChartCard title="Clicks Over Time" isLoading={isLoadingAnalytics}>
                <TimeSeriesChart 
                  data={analyticsData?.clicksByDay || []}
                  isLoading={isLoadingAnalytics} 
                />
              </ChartCard>
              
              <ChartCard title="Device Types" isLoading={isLoadingAnalytics}>
                <DeviceChart 
                  data={analyticsData?.deviceTypes || []}
                  isLoading={isLoadingAnalytics}
                />
              </ChartCard>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="Top Locations" isLoading={isLoadingAnalytics}>
                <LocationChart 
                  data={analyticsData?.topLocations || []}
                  isLoading={isLoadingAnalytics}
                />
              </ChartCard>
              
              <ChartCard title="Top Referrers" isLoading={isLoadingAnalytics}>
                <ReferrerChart 
                  data={analyticsData?.topReferrers || []}
                  isLoading={isLoadingAnalytics}
                />
              </ChartCard>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CampaignAnalyticsPage;

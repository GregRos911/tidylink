
import React, { useState } from 'react';
import { useAnalyticsData, DateRange } from '@/services/analytics/useAnalyticsData';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardTopBar from '@/components/dashboard/DashboardTopBar';
import AnalyticsHeader from '@/components/analytics/AnalyticsHeader';
import TimeSeriesChart from '@/components/analytics/TimeSeriesChart';
import DeviceChart from '@/components/analytics/DeviceChart';
import ReferrerChart from '@/components/analytics/ReferrerChart';
import LocationChart from '@/components/analytics/LocationChart';
import TopStatsCard from '@/components/analytics/TopStatsCard';

const AnalyticsPage: React.FC = () => {
  const [showCreateLinkCard, setShowCreateLinkCard] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>('30');
  
  const { data: analyticsData, isLoading, error } = useAnalyticsData(dateRange);
  
  const isEmpty = !analyticsData || (
    analyticsData.byDate.length === 0 && 
    analyticsData.byDevice.length === 0 && 
    analyticsData.byReferrer.length === 0 && 
    analyticsData.byLocation.length === 0
  );
  
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar - Hidden on mobile */}
      <DashboardSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <DashboardTopBar setShowCreateLinkCard={setShowCreateLinkCard} />
        
        {/* Dashboard Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {isLoading ? (
              <div className="h-96 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="h-10 w-40 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 w-60 bg-gray-200 rounded"></div>
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4">
                <strong className="font-bold">Error loading analytics data!</strong>
                <span className="block sm:inline"> Please try again later.</span>
              </div>
            ) : (
              <>
                <AnalyticsHeader 
                  dateRange={dateRange}
                  setDateRange={setDateRange}
                  totalClicks={analyticsData?.totalClicks || 0}
                  totalScans={analyticsData?.totalScans || 0}
                />
                
                <TopStatsCard 
                  topDate={analyticsData?.topDate}
                  topLocation={analyticsData?.topLocation}
                />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                  <TimeSeriesChart data={analyticsData?.byDate || []} />
                  <DeviceChart data={analyticsData?.byDevice || []} />
                  <ReferrerChart data={analyticsData?.byReferrer || []} />
                  <LocationChart data={analyticsData?.byLocation || []} />
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AnalyticsPage;

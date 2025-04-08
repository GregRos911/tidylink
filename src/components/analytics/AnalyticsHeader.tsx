
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRange } from '@/services/analytics/useAnalyticsData';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { useResetUsage } from '@/services/usage';

interface AnalyticsHeaderProps {
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  totalClicks: number;
  totalScans: number;
}

const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  dateRange,
  setDateRange,
  totalClicks,
  totalScans
}) => {
  const resetMutation = useResetUsage();
  
  const handleReset = () => {
    if (confirm("Are you sure you want to reset all your analytics data? This action cannot be undone.")) {
      resetMutation.mutate();
    }
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <div className="flex items-center gap-2 mt-2 md:mt-0">
          <Button 
            variant="outline"
            size="sm"
            onClick={handleReset} 
            disabled={resetMutation.isPending}
            className="flex items-center gap-1"
          >
            <RefreshCcw className="h-4 w-4" />
            Reset Analytics
          </Button>
          <Select value={dateRange} onValueChange={(value) => setDateRange(value as DateRange)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Total Traffic</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks + totalScans}</div>
            <CardDescription>All clicks and scans</CardDescription>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks}</div>
            <CardDescription>All short link clicks</CardDescription>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Total Scans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalScans}</div>
            <CardDescription>All QR code scans</CardDescription>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Scan Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalClicks + totalScans > 0
                ? `${Math.round((totalScans / (totalClicks + totalScans)) * 100)}%`
                : '0%'}
            </div>
            <CardDescription>QR scans vs link clicks</CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsHeader;

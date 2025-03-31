
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useUserUsage, FREE_PLAN_LIMITS, useResetUsage } from '@/services/usageService';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { UsageStatsProps } from './types';

// Modified component to accept props based on the interface
const UsageStats: React.FC<UsageStatsProps> = ({ usageStats }) => {
  const { data: usageData, isLoading, error } = useUserUsage();
  const resetUsage = useResetUsage();
  
  const calculatePercentage = (used: number, total: number) => {
    return (used / total) * 100;
  };
  
  const handleResetUsage = async () => {
    try {
      await resetUsage.mutateAsync();
      toast.success('Usage stats reset successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to reset usage stats');
      console.error('Error resetting usage:', error);
    }
  };
  
  // If we're loading data from the hook, show loading state
  if (isLoading) {
    return (
      <Card className="p-6 mb-6">
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </Card>
    );
  }
  
  // If there's an error from the hook, show error state
  if (error || !usageData) {
    return (
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Your Usage</h3>
        <p className="text-sm text-red-500">Error loading usage data. Please try again.</p>
      </Card>
    );
  }
  
  // If we have data from the hook, use it instead of props
  // This allows the component to work both with props and with data from the hook
  const displayStats = usageData ? {
    links: { used: usageData.links_used || 0, total: FREE_PLAN_LIMITS.links },
    qrCodes: { used: usageData.qr_codes_used || 0, total: FREE_PLAN_LIMITS.qrCodes },
    customBackHalves: { used: usageData.custom_backhalves_used || 0, total: FREE_PLAN_LIMITS.customBackHalves }
  } : usageStats;
  
  // Format last reset date
  const lastReset = usageData ? new Date(usageData.last_reset) : new Date();
  const nextReset = new Date(lastReset);
  nextReset.setDate(lastReset.getDate() + 30);
  
  return (
    <Card className="p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Your Usage</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleResetUsage}
          disabled={resetUsage.isPending}
        >
          {resetUsage.isPending ? (
            <><Loader2 className="h-3 w-3 mr-1 animate-spin" /> Resetting...</>
          ) : (
            'Reset Usage'
          )}
        </Button>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Short Links</span>
            <span className="text-sm text-gray-500">
              {displayStats.links.used} / {displayStats.links.total}
            </span>
          </div>
          <Progress 
            value={calculatePercentage(displayStats.links.used, displayStats.links.total)} 
            className="h-2"
          />
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">QR Codes</span>
            <span className="text-sm text-gray-500">
              {displayStats.qrCodes.used} / {displayStats.qrCodes.total}
            </span>
          </div>
          <Progress 
            value={calculatePercentage(displayStats.qrCodes.used, displayStats.qrCodes.total)} 
            className="h-2"
          />
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Custom Back-Halves</span>
            <span className="text-sm text-gray-500">
              {displayStats.customBackHalves.used} / {displayStats.customBackHalves.total}
            </span>
          </div>
          <Progress 
            value={calculatePercentage(displayStats.customBackHalves.used, displayStats.customBackHalves.total)} 
            className="h-2"
          />
        </div>
      </div>
      
      <div className="mt-4 border-t pt-4">
        <p className="text-xs text-gray-500 mb-1">Next reset: {nextReset.toLocaleDateString()}</p>
        <p className="text-sm text-gray-500 mb-3">Need more? Upgrade to get access to unlimited links and QR codes.</p>
        <Link to="/pricing" className="text-sm font-medium text-brand-blue hover:underline">
          View pricing plans →
        </Link>
      </div>
    </Card>
  );
};

export default UsageStats;

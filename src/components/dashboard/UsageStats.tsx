
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';

interface UsageStatsProps {
  usageStats: {
    links: { used: number; total: number };
    qrCodes: { used: number; total: number };
    customBackHalves: { used: number; total: number };
  };
}

const UsageStats: React.FC<UsageStatsProps> = ({ usageStats }) => {
  const calculatePercentage = (used: number, total: number) => {
    return (used / total) * 100;
  };

  return (
    <Card className="p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Your Usage</h3>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Short Links</span>
            <span className="text-sm text-gray-500">
              {usageStats.links.used} / {usageStats.links.total}
            </span>
          </div>
          <Progress 
            value={calculatePercentage(usageStats.links.used, usageStats.links.total)} 
            className="h-2"
          />
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">QR Codes</span>
            <span className="text-sm text-gray-500">
              {usageStats.qrCodes.used} / {usageStats.qrCodes.total}
            </span>
          </div>
          <Progress 
            value={calculatePercentage(usageStats.qrCodes.used, usageStats.qrCodes.total)} 
            className="h-2"
          />
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Custom Back-Halves</span>
            <span className="text-sm text-gray-500">
              {usageStats.customBackHalves.used} / {usageStats.customBackHalves.total}
            </span>
          </div>
          <Progress 
            value={calculatePercentage(usageStats.customBackHalves.used, usageStats.customBackHalves.total)} 
            className="h-2"
          />
        </div>
      </div>
      
      <div className="mt-4 border-t pt-4">
        <p className="text-sm text-gray-500 mb-3">Need more? Upgrade to get access to unlimited links and QR codes.</p>
        <Link to="/pricing" className="text-sm font-medium text-brand-blue hover:underline">
          View pricing plans →
        </Link>
      </div>
    </Card>
  );
};

export default UsageStats;

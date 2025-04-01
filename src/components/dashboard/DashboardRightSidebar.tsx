
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import UserProfile from './UserProfile';
import UsageStats from './UsageStats';

interface DashboardRightSidebarProps {
  usageStats: {
    links: { used: number; total: number };
    qrCodes: { used: number; total: number };
    customBackHalves: { used: number; total: number };
  };
}

const DashboardRightSidebar: React.FC<DashboardRightSidebarProps> = ({ usageStats }) => {
  return (
    <div className="lg:w-80">
      {/* User Profile */}
      <UserProfile />
      
      {/* Usage Stats */}
      <div className="mt-6">
        <UsageStats usageStats={usageStats} />
      </div>
      
      {/* Premium Promo */}
      <Card className="p-6 mt-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Replace "tidy.ly" with your brand</h3>
          <p className="text-sm text-gray-600">Click it, scan it, or share it.</p>
        </div>
        <div className="bg-gray-100 p-3 rounded-lg mb-4 relative">
          <div className="relative">
            <div className="absolute -top-6 right-0 bg-white rounded-full p-1 border">
              <div className="bg-brand-blue rounded-full flex items-center justify-center w-5 h-5">
                <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <div className="text-center py-2 pl-2 pr-6 bg-white rounded border mb-2">
              <span className="text-gray-400 text-sm">tidy.ly/2BN6kd</span>
            </div>
            <div className="text-center py-2 bg-white rounded border">
              <span className="text-brand-blue font-medium text-sm">yourbrnd.co/link</span>
            </div>
          </div>
        </div>
        <Link to="/pricing">
          <Button className="w-full" variant="outline">View our plans</Button>
        </Link>
      </Card>
    </div>
  );
};

export default DashboardRightSidebar;

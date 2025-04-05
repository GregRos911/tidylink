
import React, { useState } from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardTopBar from '@/components/dashboard/DashboardTopBar';
import CampaignsList from '@/components/campaigns/CampaignsList';
import CreateCampaignModal from '@/components/campaigns/CreateCampaignModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useUserCampaigns } from '@/services/campaigns';

const CampaignsPage: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { data: campaigns, isLoading } = useUserCampaigns();
  
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
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Campaigns</h1>
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="bg-brand-blue hover:bg-brand-blue/90"
              >
                <Plus className="mr-2 h-4 w-4" /> New Campaign
              </Button>
            </div>
            
            <CampaignsList 
              campaigns={campaigns || []} 
              isLoading={isLoading} 
            />
          </div>
        </main>
      </div>
      
      {/* Create Campaign Modal */}
      <CreateCampaignModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
};

export default CampaignsPage;

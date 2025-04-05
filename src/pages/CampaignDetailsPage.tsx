
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardTopBar from '@/components/dashboard/DashboardTopBar';
import { useCampaignLinks } from '@/services/campaigns';
import { useUserCampaigns } from '@/services/campaigns';
import CreateUTMLinkModal from '@/components/campaigns/CreateUTMLinkModal';
import CampaignLinksTable from '@/components/campaigns/CampaignLinksTable';

const CampaignDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const { data: campaigns } = useUserCampaigns();
  const campaign = campaigns?.find(c => c.id === id);
  
  const { 
    data: links, 
    isLoading: isLoadingLinks 
  } = useCampaignLinks(id);
  
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
                to="/campaigns" 
                className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to campaigns
              </Link>
              
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold">
                    {campaign?.name || 'Campaign'}
                  </h1>
                  {campaign?.description && (
                    <p className="text-gray-500 mt-1">{campaign.description}</p>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    onClick={() => setShowCreateModal(true)}
                    className="bg-brand-blue hover:bg-brand-blue/90"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Create UTM Link
                  </Button>
                  
                  <Link to={`/campaigns/${id}/analytics`}>
                    <Button variant="outline">
                      View Analytics
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border shadow-sm">
              <CampaignLinksTable 
                links={links || []} 
                isLoading={isLoadingLinks}
              />
            </div>
          </div>
        </main>
      </div>
      
      {/* Create UTM Link Modal */}
      {campaign && (
        <CreateUTMLinkModal 
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          campaign={campaign}
        />
      )}
    </div>
  );
};

export default CampaignDetailsPage;

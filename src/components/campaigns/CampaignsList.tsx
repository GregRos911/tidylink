
import React from 'react';
import { Link } from 'react-router-dom';
import { Campaign } from '@/services/campaigns/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart2, Link as LinkIcon } from 'lucide-react';
import { useCampaignLinks } from '@/services/campaigns';

interface CampaignsListProps {
  campaigns: Campaign[];
  isLoading: boolean;
}

const CampaignCard: React.FC<{ campaign: Campaign }> = ({ campaign }) => {
  const { data: campaignLinks } = useCampaignLinks(campaign.id);
  const linksCount = campaignLinks?.length || 0;
  
  return (
    <Card className="p-6 bg-white h-full">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {campaign.name}
          </h3>
        </div>
        
        {campaign.description && (
          <p className="text-sm text-gray-500 mb-4">
            {campaign.description}
          </p>
        )}
        
        <div className="mt-auto">
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <LinkIcon className="h-4 w-4 mr-2" />
            <span>{linksCount} link{linksCount !== 1 ? 's' : ''}</span>
          </div>
          
          <div className="flex space-x-2">
            <Link to={`/campaigns/${campaign.id}`} className="flex-1">
              <Button variant="outline" className="w-full">
                View Links
              </Button>
            </Link>
            
            <Link to={`/campaigns/${campaign.id}/analytics`} className="flex-1">
              <Button variant="outline" className="w-full">
                <BarChart2 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};

const CampaignsList: React.FC<CampaignsListProps> = ({ campaigns, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <Card key={i} className="p-6 animate-pulse h-64">
            <div className="h-5 bg-gray-200 rounded mb-4 w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
            <div className="h-4 bg-gray-200 rounded mb-2 w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded mb-8 w-4/6"></div>
            <div className="mt-auto">
              <div className="h-4 bg-gray-200 rounded mb-4 w-1/4"></div>
              <div className="flex space-x-2">
                <div className="h-10 bg-gray-200 rounded w-full"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }
  
  if (campaigns.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <LinkIcon className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No campaigns yet</h3>
        <p className="text-gray-500 mb-6">
          Create your first campaign to organize your marketing links
        </p>
        <Button className="bg-brand-blue hover:bg-brand-blue/90">
          Create Your First Campaign
        </Button>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns.map(campaign => (
        <CampaignCard key={campaign.id} campaign={campaign} />
      ))}
    </div>
  );
};

export default CampaignsList;

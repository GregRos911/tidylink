
import React from 'react';
import { Button } from '@/components/ui/button';
import { Campaign } from '@/services/campaigns/types';
import { Link } from 'react-router-dom';
import { CheckCircle2, ChevronRight, BarChart2, ExternalLink } from 'lucide-react';

interface ConfirmationStepProps {
  campaign: Campaign;
  onClose: () => void;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  campaign,
  onClose
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="bg-green-50 mx-auto rounded-full p-4 w-20 h-20 flex items-center justify-center mb-4">
          <CheckCircle2 className="h-12 w-12 text-green-500" />
        </div>
        <h2 className="text-xl font-bold mb-2">Campaign Sent Successfully!</h2>
        <p className="text-gray-500">
          Your campaign emails are on their way to the recipients.
        </p>
      </div>
      
      <div className="grid gap-4">
        <Link to={`/campaigns/${campaign.id}/analytics`}>
          <Button 
            className="w-full bg-brand-blue hover:bg-brand-blue/90 flex items-center justify-center"
          >
            <BarChart2 className="mr-2 h-4 w-4" /> 
            View Campaign Analytics
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        
        <Link to="/campaigns">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center"
          >
            <ExternalLink className="mr-2 h-4 w-4" /> 
            Go to Campaigns Dashboard
          </Button>
        </Link>
        
        <Button 
          variant="ghost" 
          onClick={onClose} 
          className="w-full"
        >
          Close
        </Button>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-800 mb-2">What's Next?</h3>
        <ul className="text-sm space-y-2 text-blue-700">
          <li className="flex items-start">
            <span className="bg-blue-200 rounded-full h-4 w-4 inline-flex items-center justify-center text-blue-800 mr-2 flex-shrink-0 mt-0.5">1</span>
            <span>Track engagement metrics in real-time on your campaign analytics dashboard</span>
          </li>
          <li className="flex items-start">
            <span className="bg-blue-200 rounded-full h-4 w-4 inline-flex items-center justify-center text-blue-800 mr-2 flex-shrink-0 mt-0.5">2</span>
            <span>Monitor link clicks to measure the effectiveness of your campaign</span>
          </li>
          <li className="flex items-start">
            <span className="bg-blue-200 rounded-full h-4 w-4 inline-flex items-center justify-center text-blue-800 mr-2 flex-shrink-0 mt-0.5">3</span>
            <span>Create follow-up campaigns to re-engage your audience</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ConfirmationStep;

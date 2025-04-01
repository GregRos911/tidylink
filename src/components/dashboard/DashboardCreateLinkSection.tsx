
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CreateLinkCard from './CreateLinkCard';

interface DashboardCreateLinkSectionProps {
  setShowCreateLinkCard: (show: boolean) => void;
}

const DashboardCreateLinkSection: React.FC<DashboardCreateLinkSectionProps> = ({ setShowCreateLinkCard }) => {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Create a new link</h1>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowCreateLinkCard(false)}
        >
          <X className="h-4 w-4 mr-1" /> Close
        </Button>
      </div>
      <CreateLinkCard />
    </>
  );
};

export default DashboardCreateLinkSection;

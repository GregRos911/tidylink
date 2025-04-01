
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MobileSidebar from './MobileSidebar';

interface DashboardTopBarProps {
  setShowCreateLinkCard: (show: boolean) => void;
}

const DashboardTopBar: React.FC<DashboardTopBarProps> = ({ setShowCreateLinkCard }) => {
  return (
    <header className="sticky top-0 z-10 bg-white border-b h-16 flex items-center px-4 md:px-6 justify-between">
      {/* Mobile menu button */}
      <div className="md:hidden">
        <MobileSidebar />
      </div>
      
      <div className="w-full max-w-md mx-auto md:mx-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Search links or QR codes..." 
            className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2 md:gap-4">
        <Button 
          className="bg-brand-blue hover:bg-brand-blue/90 hidden sm:inline-flex"
          onClick={() => setShowCreateLinkCard(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> Create Link
        </Button>
        
        <Link to="/pricing">
          <Button className="bg-brand-blue hover:bg-brand-blue/90 hidden sm:inline-flex">
            Upgrade
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default DashboardTopBar;

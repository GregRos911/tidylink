
import React, { useState } from 'react';
import { 
  BarChart2, ExternalLink, 
  Globe, Home, Link as LinkIcon, 
  QrCode, X, Plus
} from 'lucide-react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardTopBar from '@/components/dashboard/DashboardTopBar';
import DashboardCreateLinkSection from '@/components/dashboard/DashboardCreateLinkSection';
import DashboardMainContent from '@/components/dashboard/DashboardMainContent';
import DashboardRightSidebar from '@/components/dashboard/DashboardRightSidebar';

const DashboardPage: React.FC = () => {
  const [showCreateLinkCard, setShowCreateLinkCard] = useState(false);
  
  const usageStats = {
    links: { used: 3, total: 7 },
    qrCodes: { used: 2, total: 5 },
    customBackHalves: { used: 1, total: 5 }
  };

  const quickActions = [
    { title: "Make it short", description: "Create a short link for any URL", icon: <LinkIcon className="h-8 w-8 text-brand-blue" />, href: "#", cta: "Create Link", onClick: () => setShowCreateLinkCard(true) },
    { title: "Make it scannable", description: "Generate QR codes for your content", icon: <QrCode className="h-8 w-8 text-brand-purple" />, href: "/qr-codes", cta: "Go to Codes" },
    { title: "Customize your link", description: "Create memorable custom links", icon: <ExternalLink className="h-8 w-8 text-brand-pink" />, href: "/custom-links", cta: "Customize" },
    { title: "Make a page", description: "Build landing pages for your links", icon: <Globe className="h-8 w-8 text-gray-400" />, href: "#", cta: "Go to Pages", disabled: true }
  ];

  const gettingStartedItems = [
    { title: "Make a TidyLink", icon: <LinkIcon className="h-5 w-5" />, cta: "Create a link", href: "#", complete: true, onClick: () => setShowCreateLinkCard(true) },
    { title: "Make a TidyLink Code", icon: <QrCode className="h-5 w-5" />, cta: "Create a QR Code", href: "/qr-codes", complete: false },
    { title: "Click it, scan it, or share it", icon: <ExternalLink className="h-5 w-5" />, cta1: "View your links", cta2: "View your QR Codes", href1: "/links", href2: "/qr-codes", complete: false },
    { title: "Connect your apps with TidyLink", icon: <Globe className="h-5 w-5" />, appIcons: true, complete: false }
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar - Hidden on mobile */}
      <DashboardSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <DashboardTopBar setShowCreateLinkCard={setShowCreateLinkCard} />
        
        {/* Dashboard Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
            {/* Main Column */}
            <div className="flex-1">
              {showCreateLinkCard ? (
                <DashboardCreateLinkSection setShowCreateLinkCard={setShowCreateLinkCard} />
              ) : (
                <DashboardMainContent 
                  quickActions={quickActions} 
                  gettingStartedItems={gettingStartedItems} 
                />
              )}
            </div>
            
            {/* Right Sidebar */}
            <DashboardRightSidebar usageStats={usageStats} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;

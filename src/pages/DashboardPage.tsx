
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart2, ExternalLink, 
  Globe, Home, Link as LinkIcon, 
  Lock, QrCode, Search, Settings, 
  UserCircle, X, Menu, Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import QuickActionCard from '@/components/dashboard/QuickActionCard';
import GettingStartedItem from '@/components/dashboard/GettingStartedItem';
import UsageStats from '@/components/dashboard/UsageStats';
import MobileSidebar from '@/components/dashboard/MobileSidebar';
import UserProfile from '@/components/dashboard/UserProfile';
import CreateLinkCard from '@/components/dashboard/CreateLinkCard';

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
        
        {/* Dashboard Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
            {/* Main Column */}
            <div className="flex-1">
              {showCreateLinkCard ? (
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
              ) : (
                <>
                  <h1 className="text-2xl font-bold mb-2">Welcome to TidyLink</h1>
                  <p className="text-gray-500 mb-6">Your link management dashboard</p>
                  
                  {/* Quick Actions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                    {quickActions.map((action, index) => (
                      <QuickActionCard
                        key={index}
                        title={action.title}
                        description={action.description}
                        icon={action.icon}
                        href={action.href}
                        cta={action.cta}
                        disabled={action.disabled}
                        onClick={action.onClick}
                      />
                    ))}
                  </div>
                  
                  {/* Notification Banner */}
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-8 flex items-start gap-3">
                    <div className="bg-orange-100 rounded-full p-2 mt-1">
                      <svg className="h-5 w-5 text-orange-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor" />
                        <path d="M12 6C11.45 6 11 6.45 11 7V13C11 13.55 11.45 14 12 14C12.55 14 13 13.55 13 13V7C13 6.45 12.55 6 12 6Z" fill="currentColor" />
                        <path d="M12 16C11.45 16 11 16.45 11 17C11 17.55 11.45 18 12 18C12.55 18 13 17.55 13 17C13 16.45 12.55 16 12 16Z" fill="currentColor" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium">Bring people to your content</h3>
                        <button className="text-gray-500 hover:text-gray-700">
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600">Create and share unique links and QR Codes to attract attention, connect with more followers, and drive traffic to your content.</p>
                    </div>
                  </div>
                  
                  {/* Getting Started Section */}
                  <div className="bg-white border rounded-lg mb-8">
                    <div className="p-6 border-b">
                      <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Getting started with TidyLink</h2>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 mr-2">0%</span>
                          <Progress value={0} className="w-24 h-2" />
                        </div>
                      </div>
                    </div>
                    <div className="divide-y">
                      {gettingStartedItems.map((item, index) => (
                        <GettingStartedItem
                          key={index}
                          title={item.title}
                          icon={item.icon}
                          cta={item.cta}
                          cta1={item.cta1}
                          cta2={item.cta2}
                          href={item.href}
                          href1={item.href1}
                          href2={item.href2}
                          complete={item.complete}
                          appIcons={item.appIcons}
                          onClick={item.onClick}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {/* Right Sidebar */}
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
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;

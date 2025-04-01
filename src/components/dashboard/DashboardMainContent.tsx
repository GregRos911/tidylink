
import React from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import QuickActionCard from './QuickActionCard';
import GettingStartedItem from './GettingStartedItem';

interface DashboardMainContentProps {
  quickActions: {
    title: string;
    description: string;
    icon: React.ReactNode;
    href: string;
    cta: string;
    disabled?: boolean;
    onClick?: () => void;
  }[];
  gettingStartedItems: {
    title: string;
    icon: React.ReactNode;
    cta?: string;
    cta1?: string;
    cta2?: string;
    href?: string;
    href1?: string;
    href2?: string;
    complete?: boolean;
    appIcons?: boolean;
    onClick?: () => void;
  }[];
}

const DashboardMainContent: React.FC<DashboardMainContentProps> = ({ 
  quickActions, 
  gettingStartedItems 
}) => {
  return (
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
  );
};

export default DashboardMainContent;

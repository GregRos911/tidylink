
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart2, Globe, Home, 
  Link as LinkIcon, QrCode, 
  Settings, LayoutGrid, Plus, Lock 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const DashboardSidebar: React.FC = () => {
  const location = useLocation();
  
  const menuItems = [
    { icon: Home, label: 'Home', href: '/dashboard' },
    { icon: LinkIcon, label: 'Links', href: '/links' },
    { icon: QrCode, label: 'QR Codes', href: '/qr-codes' },
    { icon: BarChart2, label: 'Analytics', href: '/analytics', locked: true },
    { icon: LayoutGrid, label: 'Campaigns', href: '/campaigns', locked: true },
    { icon: Globe, label: 'Custom Domains', href: '/domains', locked: true },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];
  
  const isActive = (href: string) => location.pathname === href;
  
  return (
    <aside className="hidden md:flex flex-col w-60 bg-white border-r shrink-0">
      <div className="h-16 border-b flex items-center px-4">
        <Link to="/dashboard" className="flex items-center gap-2">
          <LinkIcon className="h-6 w-6 text-brand-blue" />
          <span className="font-bold text-xl bg-clip-text text-transparent bg-hero-gradient">TidyLink</span>
        </Link>
      </div>
      
      <div className="p-4">
        <Button className="w-full bg-brand-blue hover:bg-brand-blue/90">
          <Plus className="mr-2 h-4 w-4" /> Create new
        </Button>
      </div>
      
      <nav className="flex-1 px-2">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.label}>
              {item.locked ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div 
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-gray-500 cursor-not-allowed",
                        "hover:bg-gray-100"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                      <Lock className="h-4 w-4 ml-auto" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Upgrade to access {item.label}</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Link 
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md",
                    isActive(item.href) 
                      ? "bg-gray-100 text-gray-900 font-medium" 
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 mt-auto">
        <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
          <p className="font-medium text-gray-900 mb-1">Free Plan</p>
          <p className="mb-3">Upgrade to unlock all features</p>
          <Link to="/pricing">
            <Button variant="outline" size="sm" className="w-full">
              View Plans
            </Button>
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;

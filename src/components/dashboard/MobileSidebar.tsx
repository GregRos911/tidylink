
import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import DashboardSidebar from './DashboardSidebar';
import { 
  SidebarProvider,
  Sidebar,
  SidebarContent
} from '@/components/ui/sidebar';

const MobileSidebar: React.FC = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-72">
        <SidebarProvider>
          <Sidebar variant="inset">
            <SidebarContent>
              <DashboardSidebar />
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;

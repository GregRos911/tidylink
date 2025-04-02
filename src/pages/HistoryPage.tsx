
import React from 'react';
import Nav from '@/components/Nav';
import LinkHistory from '@/components/LinkHistory';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useUserLinks } from '@/services/links';
import { PlusCircle } from 'lucide-react';

const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: links, isLoading } = useUserLinks();
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Nav />
      
      <main className="flex-1 container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Your TidyLinks</h1>
          <Button 
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create link
          </Button>
        </div>
        
        <div className="space-y-6">
          <LinkHistory />
        </div>
      </main>
      
      <footer className="bg-background border-t py-6">
        <div className="container flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="font-bold bg-clip-text text-transparent bg-hero-gradient">Tidylink</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Tidylink. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HistoryPage;

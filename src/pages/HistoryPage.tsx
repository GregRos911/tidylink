
import React from 'react';
import Nav from '@/components/Nav';
import LinkHistory from '@/components/LinkHistory';
import { Link as LinkIcon } from 'lucide-react';

const HistoryPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Nav />
      
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-6">Link History</h1>
        <LinkHistory />
      </main>
      
      <footer className="bg-background border-t py-6">
        <div className="container flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5 text-brand-blue" />
            <span className="font-bold bg-clip-text text-transparent bg-hero-gradient">Linky</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Linky. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HistoryPage;

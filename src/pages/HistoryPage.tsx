
import React, { useState } from 'react';
import Nav from '@/components/Nav';
import LinkHistory from '@/components/LinkHistory';
import { Link as LinkIcon, Search, Calendar, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/clerk-react';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';

const HistoryPage: React.FC = () => {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Nav />
      
      <main className="flex-1 container py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Your TidyLinks</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track all your shortened links
            </p>
          </div>
          
          <Link to="/dashboard">
            <Button className="whitespace-nowrap">
              Create link
            </Button>
          </Link>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search links..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Filter by created date
          </Button>
          
          <Button variant="outline" className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Add filters
          </Button>
        </div>
        
        <LinkHistory searchQuery={searchQuery} />
      </main>
      
      <footer className="bg-background border-t py-6">
        <div className="container flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5 text-brand-blue" />
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

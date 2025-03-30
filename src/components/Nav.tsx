
import React from 'react';
import { Link } from 'react-router-dom';
import { Link as LinkIcon } from 'lucide-react';

const Nav: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-3 items-center">
          <LinkIcon className="h-7 w-7 text-brand-blue" />
          <span className="font-bold text-2xl bg-clip-text text-transparent bg-hero-gradient">Linky</span>
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <Link to="/" className="px-3 py-2 font-medium text-muted-foreground hover:text-primary">Home</Link>
            <Link to="/history" className="px-3 py-2 font-medium text-muted-foreground hover:text-primary">History</Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Nav;

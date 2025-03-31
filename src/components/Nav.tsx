
import React from 'react';
import { Link } from 'react-router-dom';
import { Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/clerk-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Nav: React.FC = () => {
  const { isSignedIn } = useAuth();
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-3 items-center">
          <LinkIcon className="h-7 w-7 text-brand-blue" />
          <span className="font-bold text-2xl bg-clip-text text-transparent bg-hero-gradient">Tidylink</span>
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <Link to="/pricing" className="px-3 py-2 font-medium text-muted-foreground hover:text-primary">Pricing</Link>
            {isSignedIn && (
              <>
                <Link to="/history" className="px-3 py-2 font-medium text-muted-foreground hover:text-primary">History</Link>
                <Link to="/dashboard" className="px-3 py-2 font-medium text-muted-foreground hover:text-primary">Dashboard</Link>
              </>
            )}
            
            {isSignedIn ? (
              <div className="ml-4">
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button 
                    className="ml-2 bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink hover:opacity-90 transition-opacity"
                    size="sm"
                  >
                    Start for Free
                  </Button>
                </SignUpButton>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Nav;

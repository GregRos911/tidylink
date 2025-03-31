
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SignInButton, SignUpButton, UserButton, useAuth, useUser } from "@clerk/clerk-react";

const Nav: React.FC = () => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're on the dashboard page
  const isDashboard = location.pathname === '/dashboard';
  const isPricing = location.pathname === '/pricing';
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-3 items-center">
          <LinkIcon className="h-7 w-7 text-brand-blue" />
          <Link to="/" className="font-bold text-2xl bg-clip-text text-transparent bg-hero-gradient">Tidylink</Link>
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            {!isPricing && (
              <Link to="/pricing" className="px-3 py-2 font-medium text-muted-foreground hover:text-primary">Pricing</Link>
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
                    onClick={() => navigate('/pricing')}
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

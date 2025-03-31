
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Link as LinkIcon, User, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SignInButton, SignUpButton, UserButton, useAuth, useUser } from "@clerk/clerk-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Nav: React.FC = () => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-3 items-center">
          <LinkIcon className="h-7 w-7 text-brand-blue" />
          <Link to="/" className="font-bold text-2xl bg-clip-text text-transparent bg-hero-gradient">Tidylink</Link>
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar>
                        <AvatarImage src={user?.imageUrl} alt={user?.fullName || 'User'} />
                        <AvatarFallback className="text-xs">
                          {user?.firstName?.charAt(0) || ''}
                          {user?.lastName?.charAt(0) || ''}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-0.5">
                        <p className="text-sm font-medium">{user?.fullName || 'User'}</p>
                        <p className="text-xs text-muted-foreground">{user?.primaryEmailAddress?.emailAddress || ''}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link to="/dashboard" className="flex w-full items-center">
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link to="/settings" className="flex w-full items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <div className="flex w-full items-center">
                        <UserButton afterSignOutUrl="/" />
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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

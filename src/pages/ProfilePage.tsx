
import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { Loader2, UserRound, Mail, Calendar, AtSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import Nav from '@/components/Nav';

const ProfilePage: React.FC = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Nav />
      
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <Card className="p-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={user?.imageUrl} alt={user?.fullName || 'User'} />
                <AvatarFallback className="text-lg">
                  {user?.firstName?.charAt(0) || ''}
                  {user?.lastName?.charAt(0) || ''}
                </AvatarFallback>
              </Avatar>
              
              <h2 className="text-xl font-semibold">{user?.fullName || 'User'}</h2>
              <p className="text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p>
              
              <div className="mt-6 w-full">
                <Button variant="outline" className="w-full" asChild>
                  <a href="https://accounts.clerk.dev/user/profile" target="_blank" rel="noopener noreferrer">
                    Manage Account
                  </a>
                </Button>
              </div>
            </div>
          </Card>
          
          {/* User Details */}
          <Card className="p-6 md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Account Information</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <UserRound className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{user?.fullName || 'Not provided'}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Email Address</p>
                  <p className="font-medium">{user?.primaryEmailAddress?.emailAddress || 'Not provided'}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <AtSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Username</p>
                  <p className="font-medium">{user?.username || 'Not set'}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="font-medium">
                    {user?.createdAt ? format(new Date(user.createdAt), 'MMMM d, yyyy') : 'Unknown'}
                  </p>
                </div>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <Button variant="outline" className="justify-start" asChild>
                  <a href="https://accounts.clerk.dev/user/security" target="_blank" rel="noopener noreferrer">
                    Security Settings
                  </a>
                </Button>
                
                <Button variant="outline" className="justify-start" asChild>
                  <a href="https://accounts.clerk.dev/user/profile" target="_blank" rel="noopener noreferrer">
                    Edit Profile
                  </a>
                </Button>
              </div>
            </div>
          </Card>
          
          {/* Usage Summary */}
          <Card className="p-6 md:col-span-3">
            <h3 className="text-lg font-semibold mb-4">Your TidyLink Usage</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Total Links Created</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Total QR Codes Generated</p>
                <p className="text-2xl font-bold">2</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Custom Links Used</p>
                <p className="text-2xl font-bold">1</p>
              </div>
            </div>
          </Card>
        </div>
      </main>
      
      <footer className="bg-background border-t py-6">
        <div className="container flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.75 15.25V6.75H15.25V15.25H6.75Z" fill="#8B5CF6" />
              <path fillRule="evenodd" clipRule="evenodd" d="M3 6.75C3 4.67893 4.67893 3 6.75 3H17.25C19.3211 3 21 4.67893 21 6.75V17.25C21 19.3211 19.3211 21 17.25 21H6.75C4.67893 21 3 19.3211 3 17.25V6.75ZM6.75 4.5C5.50736 4.5 4.5 5.50736 4.5 6.75V17.25C4.5 18.4926 5.50736 19.5 6.75 19.5H17.25C18.4926 19.5 19.5 18.4926 19.5 17.25V6.75C19.5 5.50736 18.4926 4.5 17.25 4.5H6.75Z" fill="#8B5CF6" />
            </svg>
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

export default ProfilePage;

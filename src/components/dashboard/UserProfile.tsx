
import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserRound, Mail, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const UserProfile: React.FC = () => {
  const { user } = useUser();

  if (!user) {
    return null;
  }

  return (
    <Card className="p-6">
      <div className="flex flex-col items-center text-center">
        <Avatar className="h-24 w-24 mb-4">
          <AvatarImage src={user.imageUrl} alt={user.fullName || 'User'} />
          <AvatarFallback className="text-lg">
            {user.firstName?.charAt(0) || ''}
            {user.lastName?.charAt(0) || ''}
          </AvatarFallback>
        </Avatar>
        
        <h2 className="text-xl font-semibold">{user.fullName || 'User'}</h2>
        <p className="text-muted-foreground">{user.primaryEmailAddress?.emailAddress}</p>
        
        <div className="w-full mt-4 space-y-3">
          <div className="flex items-start gap-3">
            <UserRound className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="text-left">
              <p className="text-sm text-muted-foreground">Username</p>
              <p className="font-medium">{user.username || 'Not set'}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="text-left">
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user.primaryEmailAddress?.emailAddress || 'Not provided'}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="text-left">
              <p className="text-sm text-muted-foreground">Member Since</p>
              <p className="font-medium">
                {user.createdAt ? format(new Date(user.createdAt), 'MMMM d, yyyy') : 'Unknown'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 w-full">
          <Button variant="outline" className="w-full" asChild>
            <a href="/profile">View Full Profile</a>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default UserProfile;

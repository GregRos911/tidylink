
import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { setupSupabaseSession } from '@/services/clerkSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isSignedIn, isLoaded, user } = useAuth();
  const [isSupabaseReady, setIsSupabaseReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const syncSupabaseAuth = async () => {
      if (isLoaded && isSignedIn && user) {
        try {
          // Setup Supabase session with Clerk user
          await setupSupabaseSession(user);
          setIsSupabaseReady(true);
        } catch (error) {
          console.error('Error syncing Supabase auth:', error);
        } finally {
          setIsLoading(false);
        }
      } else if (isLoaded) {
        setIsLoading(false);
      }
    };

    syncSupabaseAuth();
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded || (isSignedIn && isLoading)) {
    // Show loading spinner when checking auth state
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

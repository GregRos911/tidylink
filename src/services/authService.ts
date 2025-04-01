
import React from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { setupSupabaseSession } from "./clerkSupabaseAuth";

// This function gets a JWT token from Clerk and sets it in Supabase
export const useSupabaseAuth = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const [isSupabaseAuthenticated, setIsSupabaseAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const syncSupabaseAuth = async () => {
      if (isLoaded) {
        setIsLoading(true);
        try {
          if (isSignedIn && user) {
            // Use our utility function
            await setupSupabaseSession(user);
            setIsSupabaseAuthenticated(true);
            setError(null);
          } else {
            // If not signed in with Clerk, sign out from Supabase too
            await supabase.auth.signOut();
            setIsSupabaseAuthenticated(false);
          }
        } catch (err: any) {
          console.error("Auth synchronization error:", err);
          setError(err.message || "Failed to authenticate with Supabase");
          setIsSupabaseAuthenticated(false);
        } finally {
          setIsLoading(false);
        }
      }
    };

    syncSupabaseAuth();
  }, [isSignedIn, isLoaded, user]);

  return { isSupabaseAuthenticated, isLoading, error };
};

// A component to wrap your app with Supabase authentication
export function withSupabaseAuth<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> {
  const WithSupabaseAuthComponent: React.FC<P> = (props) => {
    const { isSupabaseAuthenticated, isLoading, error } = useSupabaseAuth();
    
    // You can handle loading and error states as needed
    // For simplicity, we're just rendering the component
    
    return React.createElement(Component, props);
  };
  
  return WithSupabaseAuthComponent;
}

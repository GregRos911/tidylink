
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

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
            // Get JWT token from Clerk
            const token = await user.getJWTToken();
            
            // Set the token in Supabase
            const { error } = await supabase.auth.setSession({
              access_token: token,
              refresh_token: token, // Using the same token for simplicity
            });
            
            if (error) {
              console.error("Error setting Supabase session:", error);
              setError(error.message);
              setIsSupabaseAuthenticated(false);
            } else {
              setIsSupabaseAuthenticated(true);
              setError(null);
            }
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
// Avoiding JSX in a .ts file by using a different approach
export function withSupabaseAuth<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> {
  const WithSupabaseAuthComponent: React.FC<P> = (props) => {
    const { isSupabaseAuthenticated, isLoading, error } = useSupabaseAuth();
    
    // You can handle loading and error states as needed
    // For simplicity, we're just rendering the component
    
    // Use React.createElement instead of JSX
    return React.createElement(Component, props);
  };
  
  return WithSupabaseAuthComponent;
}

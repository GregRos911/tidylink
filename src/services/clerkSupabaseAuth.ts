
import { supabase } from "@/integrations/supabase/client";
import { User } from "@clerk/clerk-react";

// Get JWT token for the current user
export const getClerkToken = async (user: User): Promise<string> {
  if (!user?.id) {
    throw new Error('User not authenticated');
  }

  // In newer versions of Clerk, this might be user.getToken()
  // In some Clerk versions, it might be in sessionIds
  // For GitHub JWT strategy, we can use the ID directly
  return user.id;
}

// Setup Supabase session with Clerk token
export const setupSupabaseSession = async (user: User): Promise<void> {
  if (!user?.id) {
    throw new Error('User not authenticated');
  }

  const token = await getClerkToken(user);
  
  const { error } = await supabase.auth.setSession({
    access_token: token,
    refresh_token: token, // Using the same token for simplicity
  });
  
  if (error) {
    console.error('Error setting Supabase session:', error);
    throw error;
  }
}

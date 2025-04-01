
import { supabase } from "@/integrations/supabase/client";

// Get JWT token for the current user
export const getClerkToken = async (user) => {
  if (!user?.id) {
    throw new Error('User not authenticated');
  }

  // For Clerk, we need to use the proper JWT token
  // In this case, we'll need to get a proper JWT token from Clerk
  // Since Clerk's API doesn't expose getToken directly in this version,
  // we can use a compatible workaround with the user's session ID
  
  try {
    // Try to get a token using Clerk API
    if (typeof user.getToken === 'function') {
      return await user.getToken({template: 'supabase'});
    }
    
    // Fallback: For demo/development purposes only
    // In production, you should configure Clerk to issue proper JWTs compatible with Supabase
    return user.id;
  } catch (error) {
    console.error('Error getting token:', error);
    // Fallback to user ID
    return user.id;
  }
}

// Setup Supabase session with Clerk token
export const setupSupabaseSession = async (user) => {
  if (!user?.id) {
    throw new Error('User not authenticated');
  }

  const token = await getClerkToken(user);
  
  try {
    // For development purposes, we'll use a custom auth approach
    // This is a simplified demo implementation
    const { data, error } = await supabase.auth.signInWithPassword({
      email: `user-${user.id.slice(0, 8)}@example.com`, // Using a valid email format
      password: user.id,
    });
    
    if (error) {
      // If the user doesn't exist, let's create one
      if (error.message.includes('Invalid login credentials')) {
        // Create a user in Supabase
        const { error: signUpError } = await supabase.auth.signUp({
          email: `user-${user.id.slice(0, 8)}@example.com`, // Using a valid email format
          password: user.id,
        });
        
        if (signUpError) {
          console.error('Error creating Supabase user:', signUpError);
          throw signUpError;
        }
        
        // Try signing in again
        const { error: retryError } = await supabase.auth.signInWithPassword({
          email: `user-${user.id.slice(0, 8)}@example.com`, // Using a valid email format
          password: user.id,
        });
        
        if (retryError) {
          console.error('Error signing in to Supabase after creation:', retryError);
          throw retryError;
        }
      } else {
        console.error('Error setting Supabase session:', error);
        throw error;
      }
    }
  } catch (error) {
    console.error('Error in setupSupabaseSession:', error);
    throw error;
  }
}

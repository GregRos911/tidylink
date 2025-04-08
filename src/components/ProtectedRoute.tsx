
import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();
  const [isRecruiter, setIsRecruiter] = useState(false);
  const [isCheckingRecruiter, setIsCheckingRecruiter] = useState(true);

  useEffect(() => {
    // Check if there's a valid recruiter session
    const recruiterSession = localStorage.getItem("recruiter-session");
    const loginTime = localStorage.getItem("recruiter-login-time");
    
    if (recruiterSession === "true" && loginTime) {
      // Check if the session is still valid (24 hours)
      const loginDate = new Date(loginTime);
      const now = new Date();
      const diffHours = (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60);
      
      if (diffHours < 24) {
        setIsRecruiter(true);
      } else {
        // Clear expired session
        localStorage.removeItem("recruiter-session");
        localStorage.removeItem("recruiter-login-time");
      }
    }
    
    setIsCheckingRecruiter(false);
  }, []);

  if (!isLoaded || isCheckingRecruiter) {
    // You could show a loading spinner here
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Allow access if user is signed in through Clerk OR is a recruiter
  if (!isSignedIn && !isRecruiter) {
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

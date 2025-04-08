
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const RedirectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }
    
    // Construct the redirect URL using the edge function
    const redirectUrl = `${window.location.origin}/functions/v1/redirect/${id}`;
    console.log('Redirecting to:', redirectUrl);
    
    // Redirect to the edge function URL
    window.location.href = redirectUrl;
    
    // Set a timeout to show an error message if the redirect doesn't happen
    const timeout = setTimeout(() => {
      setIsLoading(false);
      setError("Redirect timed out. The link may be invalid or the server is experiencing issues.");
      toast({
        title: "Redirect failed",
        description: "The link may be invalid or our servers may be experiencing issues.",
        variant: "destructive"
      });
    }, 5000);
    
    return () => clearTimeout(timeout);
  }, [id, navigate]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-brand-blue" />
          <h1 className="text-2xl font-bold mb-2">Redirecting you...</h1>
          <p className="text-muted-foreground">Please wait while we take you to your destination.</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Redirect Error</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-blue/90"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }
  
  return null; // This should never be rendered as we either show loading or error state
};

export default RedirectPage;

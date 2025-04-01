
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const RedirectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }
    
    const fetchLink = async () => {
      try {
        setIsLoading(true);
        const baseUrl = window.location.origin;
        const shortUrl = `${baseUrl}/r/${id}`;
        
        // First try to find by short_url or custom_backhalf
        const { data: link, error } = await supabase
          .from('links')
          .select('*')
          .or(`short_url.eq.${shortUrl},custom_backhalf.eq.${id}`)
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching from Supabase:', error);
          throw error;
        }
        
        if (link) {
          setOriginalUrl(link.original_url);
          
          // Increment click count
          await supabase
            .from('links')
            .update({ clicks: (link.clicks || 0) + 1 })
            .eq('id', link.id);
          
          // Start countdown for redirect
          const timer = setInterval(() => {
            setCountdown(prev => {
              if (prev <= 1) {
                clearInterval(timer);
                window.location.href = link.original_url;
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
          
          return () => clearInterval(timer);
        } else {
          // Check localStorage as fallback
          const storedLinksJson = localStorage.getItem('linky_shortened_urls');
          if (storedLinksJson) {
            const storedLinks = JSON.parse(storedLinksJson);
            const storedLink = storedLinks.find((link: any) => {
              const linkPath = new URL(link.shortUrl).pathname.slice(3); // Remove '/r/'
              return linkPath === id;
            });
            
            if (storedLink) {
              setOriginalUrl(storedLink.originalUrl);
              
              // Update click count in localStorage
              const updatedLinks = storedLinks.map((link: any) => {
                const linkPath = new URL(link.shortUrl).pathname.slice(3);
                if (linkPath === id) {
                  return { ...link, clicks: (link.clicks || 0) + 1 };
                }
                return link;
              });
              
              localStorage.setItem('linky_shortened_urls', JSON.stringify(updatedLinks));
              
              // Start countdown for redirect
              const timer = setInterval(() => {
                setCountdown(prev => {
                  if (prev <= 1) {
                    clearInterval(timer);
                    window.location.href = storedLink.originalUrl;
                    return 0;
                  }
                  return prev - 1;
                });
              }, 1000);
              
              return () => clearInterval(timer);
            }
          }
          
          toast.error('Link not found');
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching link:', error);
        toast.error('Link not found or has expired');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLink();
  }, [id, navigate]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-brand-blue" />
          <h1 className="text-2xl font-bold mb-2">Looking for your link...</h1>
          <p className="text-muted-foreground">Please wait while we find your destination.</p>
        </div>
      </div>
    );
  }
  
  if (!originalUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Link not found</h1>
          <p className="text-muted-foreground mb-4">The requested link does not exist or has expired.</p>
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
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-6 bg-card shadow-lg rounded-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting you...</h1>
        <p className="mb-6 text-muted-foreground">
          You'll be redirected to {originalUrl} in {countdown} seconds.
        </p>
        <div className="w-full bg-muted rounded-full h-2 mb-6">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-1000"
            style={{ width: `${((3 - countdown) / 3) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-center">
          <a
            href={originalUrl}
            className="text-primary hover:underline"
          >
            Click here if you're not redirected automatically
          </a>
        </div>
      </div>
    </div>
  );
};

export default RedirectPage;

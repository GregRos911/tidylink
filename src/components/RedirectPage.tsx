
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

    const fetchOriginalUrl = async () => {
      try {
        console.log('Looking up link with ID:', id);
        
        // First try to find by custom_backhalf
        let { data: link, error: linkError } = await supabase
          .from('links')
          .select('original_url, clicks, id, user_id')
          .eq('custom_backhalf', id)
          .maybeSingle();
        
        // If not found by custom_backhalf, try with short_url
        if (!link) {
          const { data: urlLink, error: urlError } = await supabase
            .from('links')
            .select('original_url, clicks, id, user_id')
            .ilike('short_url', `%/${id}`)
            .maybeSingle();
          
          if (urlError) throw new Error(urlError.message);
          link = urlLink;
        }
        
        if (!link) {
          throw new Error('Link not found');
        }
        
        console.log('Link found:', link);
        
        // Increment click count directly (now possible with RLS policy)
        if (link.id) {
          await supabase
            .from('links')
            .update({ clicks: (link.clicks || 0) + 1 })
            .eq('id', link.id);
            
          // Record analytics data
          const userAgent = navigator.userAgent;
          const referrer = document.referrer;
          
          // Determine device type
          let deviceType = 'Desktop';
          if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
            deviceType = 'Tablet';
          } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
            deviceType = 'Mobile';
          }
          
          // Get referrer domain
          let referrerDomain = 'Direct';
          if (referrer) {
            try {
              referrerDomain = new URL(referrer).hostname;
            } catch (e) {
              console.error('Error parsing referrer:', e);
            }
          }
          
          try {
            // Try to get IP address via a public API
            // This is a best-effort approach as client-side IP detection is unreliable
            // The edge function is the primary way we'll get location data
            const ipResponse = await fetch('https://api.ipify.org?format=json');
            if (ipResponse.ok) {
              const ipData = await ipResponse.json();
              console.log('Client IP detected:', ipData.ip);
              
              // Get location data using ip-api.com (free tier, no API key needed)
              const geoResponse = await fetch(`https://ipinfo.io/${ipData.ip}/json`);
              if (geoResponse.ok) {
                const geoData = await geoResponse.json();
                
                // Insert analytics record with location data
                await supabase
                  .from('link_analytics')
                  .insert({
                    link_id: link.id,
                    user_id: link.user_id,
                    device_type: deviceType,
                    referrer: referrerDomain,
                    location_country: geoData.country || 'Unknown',
                    location_city: geoData.city || 'Unknown',
                    is_qr_scan: false
                  });
                  
                console.log('Analytics recorded with location data from client');
              } else {
                throw new Error('Failed to get location data');
              }
            } else {
              throw new Error('Failed to get IP address');
            }
          } catch (analyticsError) {
            // If location detection fails, still log analytics but with Unknown location
            console.error('Error getting location data:', analyticsError);
            
            // Insert analytics record without location data
            const { error: insertError } = await supabase
              .from('link_analytics')
              .insert({
                link_id: link.id,
                user_id: link.user_id,
                device_type: deviceType,
                referrer: referrerDomain,
                location_country: 'Unknown',
                location_city: 'Unknown',
                is_qr_scan: false
              });
              
            if (insertError) {
              console.error('Error recording analytics:', insertError);
            }
          }
        }
        
        // Redirect to the original URL
        window.location.href = link.original_url;
        
      } catch (err: any) {
        console.error('Redirect error:', err);
        setIsLoading(false);
        setError(`Redirect failed: ${err.message}`);
        toast({
          title: "Redirect failed",
          description: "The link may be invalid or our servers may be experiencing issues.",
          variant: "destructive"
        });
      }
    };
    
    fetchOriginalUrl();
    
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

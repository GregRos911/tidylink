
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from "../integrations/supabase/client";
import { useUser } from "@clerk/clerk-react";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const getDeviceType = () => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "Tablet";
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return "Mobile";
  }
  return "Desktop";
};

const getReferrer = () => {
  return document.referrer ? new URL(document.referrer).hostname : "Direct";
};

const RedirectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const user = useUser();

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
        
        console.log('Looking for link with short_url:', shortUrl);
        
        let { data: link, error } = await supabase
          .from('links')
          .select('*')
          .eq('short_url', shortUrl)
          .maybeSingle();
        
        if (error) {
          console.error('Error when searching by short_url:', error);
        }
        
        if (!link) {
          console.log('Link not found by short_url, trying custom_backhalf:', id);
          const { data: customLink, error: customError } = await supabase
            .from('links')
            .select('*')
            .eq('custom_backhalf', id)
            .maybeSingle();
          
          if (customError) {
            console.error('Error when searching by custom_backhalf:', customError);
          }
          
          link = customLink;
        }
        
        if (link) {
          console.log('Link found:', link);
          setOriginalUrl(link.original_url);
          
          const deviceType = getDeviceType();
          const referrer = getReferrer();
          
          await supabase.from('links').update({ clicks: (link.clicks || 0) + 1 }).eq('id', link.id);
          
          // We'll store analytics data but handle the case if link_analytics isn't in types yet
          try {
            await supabase.rpc('insert_link_analytics', {
              p_link_id: link.id,
              p_user_id: link.user_id,
              p_device_type: deviceType,
              p_referrer: referrer,
              p_is_qr_scan: false
            });
          } catch (analyticsError) {
            console.error('Error logging analytics:', analyticsError);
          }
          
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
          console.log('Link not found for ID:', id);
          toast({
            title: "Link not found",
            description: "The requested link does not exist or has expired."
          });
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching link:', error);
        toast({
          title: "Error",
          description: "Link not found or has expired",
          variant: "destructive"
        });
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLink();
  }, [id, navigate, user]);
  
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


import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

// Define CORS headers for browser compatibility
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to get device type from user agent
const getDeviceType = (userAgent: string) => {
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
    return "Tablet";
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
    return "Mobile";
  }
  return "Desktop";
};

// Helper function to get referrer domain
const getReferrer = (referrer: string | null) => {
  try {
    if (referrer) {
      return new URL(referrer).hostname;
    }
  } catch (e) {
    console.error('Error parsing referrer:', e);
  }
  return "Direct";
};

// Helper function to fetch location data from IP
const getLocationFromIP = async (ipAddress: string) => {
  try {
    // Using ipinfo.io's free tier (no API key needed for basic usage)
    const response = await fetch(`https://ipinfo.io/${ipAddress}/json`);
    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }
    const data = await response.json();
    return {
      country: data.country,
      city: data.city
    };
  } catch (error) {
    console.error('Error fetching location:', error);
    return {
      country: null,
      city: null
    };
  }
};

// Main handler function
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }
  
  try {
    // Get the ID from the request URL
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/');
    const id = pathSegments[pathSegments.length - 1];
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'No ID provided' }), { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
    
    console.log(`Processing redirect for ID: ${id}`);
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') as string;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // First try to find by custom_backhalf
    let { data: customLink, error: customError } = await supabase
      .from('links')
      .select('*')
      .eq('custom_backhalf', id)
      .maybeSingle();
    
    if (customError) {
      console.error('Error when searching by custom_backhalf:', customError);
    }
    
    let link = customLink;
    
    // If not found by custom_backhalf, try the full short_url
    if (!link) {
      // Try different URL formats to match what might be stored in the database
      const baseUrl = url.origin;
      const possibleUrls = [
        `${baseUrl}/r/${id}`,
        `${baseUrl}/go/${id}`,
        id // Try the raw ID as last resort
      ];
      
      console.log('Not found by custom_backhalf, trying possible short_urls:', possibleUrls);
      
      for (const shortUrl of possibleUrls) {
        const { data: urlLink, error } = await supabase
          .from('links')
          .select('*')
          .eq('short_url', shortUrl)
          .maybeSingle();
        
        if (error) {
          console.error(`Error when searching by short_url (${shortUrl}):`, error);
        }
        
        if (urlLink) {
          link = urlLink;
          break;
        }
      }
      
      // If still not found, try as a partial match
      if (!link) {
        const { data: partialLinks, error: partialError } = await supabase
          .from('links')
          .select('*')
          .ilike('short_url', `%${id}%`)
          .limit(1);
        
        if (partialError) {
          console.error('Error when doing partial search:', partialError);
        }
        
        if (partialLinks && partialLinks.length > 0) {
          link = partialLinks[0];
        }
      }
    }
    
    if (!link) {
      console.log('Link not found for ID:', id);
      // Return a 404 response with a custom error page
      return new Response(
        `<!DOCTYPE html>
        <html>
        <head>
          <title>Link Not Found</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { 
              font-family: system-ui, sans-serif; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              height: 100vh; 
              margin: 0;
              background-color: #f9fafb;
            }
            .container { 
              max-width: 500px;
              padding: 2rem;
              text-align: center;
              background-color: white;
              border-radius: 0.5rem;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
            h1 { color: #1f2937; margin-bottom: 1rem; }
            p { color: #4b5563; margin-bottom: 1.5rem; }
            a { 
              display: inline-block;
              background-color: #2563eb;
              color: white;
              padding: 0.5rem 1rem;
              border-radius: 0.25rem;
              text-decoration: none;
              font-weight: 500;
            }
            a:hover { background-color: #1d4ed8; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Link Not Found</h1>
            <p>The requested link does not exist or has expired.</p>
            <a href="/">Go Home</a>
          </div>
        </body>
        </html>`,
        { 
          status: 404,
          headers: {
            ...corsHeaders,
            'Content-Type': 'text/html'
          }
        }
      );
    }
    
    console.log('Link found:', link);
    
    // Get analytics data
    const userAgent = req.headers.get('user-agent') || '';
    const referer = req.headers.get('referer');
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('cf-connecting-ip') || '';
    
    const deviceType = getDeviceType(userAgent);
    const referrer = getReferrer(referer);
    
    // Process analytics in the background to avoid delaying the redirect
    const analyticsPromise = (async () => {
      try {
        // Get location data from IP
        const location = await getLocationFromIP(ip);
        
        // Increment clicks count
        await supabase.from('links').update({ clicks: (link.clicks || 0) + 1 }).eq('id', link.id);
        
        // Store analytics
        const { error: analyticsError } = await supabase
          .from('link_analytics')
          .insert({
            link_id: link.id,
            user_id: link.user_id,
            device_type: deviceType,
            referrer: referrer,
            location_country: location.country,
            location_city: location.city,
            is_qr_scan: false
          });
          
        if (analyticsError) {
          console.error('Error logging analytics:', analyticsError);
        }
      } catch (error) {
        console.error('Error processing analytics:', error);
      }
    })();
    
    // Use waitUntil to ensure analytics processing doesn't delay the redirect
    if (typeof EdgeRuntime !== 'undefined') {
      EdgeRuntime.waitUntil(analyticsPromise);
    } else {
      // Fallback for environments without EdgeRuntime
      analyticsPromise.catch(console.error);
    }
    
    // Redirect the user to the original URL
    return new Response(null, {
      status: 302, // Temporary redirect
      headers: {
        ...corsHeaders,
        'Location': link.original_url
      }
    });
    
  } catch (error) {
    console.error('Error handling redirect:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
});

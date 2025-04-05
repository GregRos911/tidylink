
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NewLinkData {
  url: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent?: string;
  customBackhalf?: string;
}

interface CampaignEmailRequest {
  campaignId: string;
  emails: string[];
  subject: string;
  message?: string;
  userId: string;
  fromName?: string;
  fromEmail?: string;
  linkId?: string;
  newLinkData?: NewLinkData;
}

interface LinkData {
  id: string;
  short_url: string;
  original_url: string;
}

interface CampaignData {
  id: string;
  name: string;
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const generateRandomAlias = (length = 7) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

async function createNewLink(newLinkData: NewLinkData, userId: string, campaignId: string): Promise<LinkData> {
  try {
    // Create a unique short URL
    let alias = newLinkData.customBackhalf;
    let isUnique = false;
    
    if (!alias) {
      // Generate unique random alias if no custom backhalf
      while (!isUnique) {
        alias = generateRandomAlias(7);
        
        // Check if alias already exists
        const { data: existingLink } = await supabase
          .from('links')
          .select('id')
          .eq('custom_backhalf', alias)
          .maybeSingle();
        
        isUnique = !existingLink;
      }
    } else {
      // Check if the custom alias is already taken
      const { data: existingLink } = await supabase
        .from('links')
        .select('id')
        .eq('custom_backhalf', alias)
        .maybeSingle();
      
      if (existingLink) {
        throw new Error('This custom back-half is already in use.');
      }
    }
    
    // Generate the short URL
    const baseUrl = SUPABASE_URL.split('.')[0].replace('https://', '');
    const shortUrl = `https://${baseUrl}/r/${alias}`;
    
    // Append UTM parameters to the original URL
    const url = new URL(newLinkData.url);
    url.searchParams.append('utm_source', newLinkData.utmSource);
    url.searchParams.append('utm_medium', newLinkData.utmMedium);
    url.searchParams.append('utm_campaign', newLinkData.utmCampaign);
    if (newLinkData.utmContent) url.searchParams.append('utm_content', newLinkData.utmContent);
    
    // Insert new link with UTM parameters
    const { data, error } = await supabase
      .from('links')
      .insert([{
        user_id: userId,
        campaign_id: campaignId,
        original_url: url.toString(),
        short_url: shortUrl,
        custom_backhalf: alias,
        clicks: 0,
        utm_source: newLinkData.utmSource,
        utm_medium: newLinkData.utmMedium,
        utm_campaign: newLinkData.utmCampaign,
        utm_term: null,
        utm_content: newLinkData.utmContent || null
      }])
      .select();
    
    if (error || !data || data.length === 0) {
      console.error('Error creating new link:', error);
      throw new Error('Failed to create new tracking link');
    }
    
    return data[0] as LinkData;
  } catch (error) {
    console.error('Error in createNewLink:', error);
    throw error;
  }
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { 
      campaignId, 
      emails, 
      subject, 
      message, 
      userId,
      fromName,
      fromEmail,
      linkId,
      newLinkData 
    }: CampaignEmailRequest = await req.json();
    
    // Input validation
    if (!campaignId) {
      throw new Error('Campaign ID is required');
    }
    
    if (!emails || emails.length === 0) {
      throw new Error('At least one email recipient is required');
    }
    
    if (emails.length > 500) {
      throw new Error('Maximum 500 recipients allowed');
    }
    
    if (!subject) {
      throw new Error('Email subject is required');
    }
    
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    if (!fromName || !fromEmail) {
      throw new Error('Sender name and email are required');
    }

    // Fetch campaign data
    const { data: campaignData, error: campaignError } = await supabase
      .from('campaigns')
      .select('id, name')
      .eq('id', campaignId)
      .single();
    
    if (campaignError || !campaignData) {
      throw new Error('Campaign not found');
    }

    // Get or create link
    let trackingLink: LinkData | null = null;
    
    if (linkId) {
      // Fetch existing link
      const { data: linkData, error: linkError } = await supabase
        .from('links')
        .select('id, short_url, original_url')
        .eq('id', linkId)
        .single();
      
      if (linkError || !linkData) {
        throw new Error('Selected link not found');
      }
      
      trackingLink = linkData;
    } 
    else if (newLinkData) {
      // Create new link
      trackingLink = await createNewLink(newLinkData, userId, campaignId);
    }
    
    // Deduplicate emails
    const uniqueEmails = [...new Set(emails)];
    const total = uniqueEmails.length;
    let sent = 0;
    let failed = 0;
    
    // Rate limiting: Process in batches of 20 emails with a small delay between batches
    const batchSize = 20;
    
    for (let i = 0; i < uniqueEmails.length; i += batchSize) {
      const batch = uniqueEmails.slice(i, i + batchSize);
      const sendPromises = batch.map(async (email) => {
        try {
          let formattedMessage = message || '';
          
          // Process templates
          if (trackingLink) {
            formattedMessage = formattedMessage.replace(/{{trackingLink}}/g, trackingLink.short_url);
          }
          
          // Basic email parsing for name templates
          const nameParts = email.split('@')[0].split('.');
          const firstName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1);
          const lastName = nameParts.length > 1 ? nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1) : '';
          
          formattedMessage = formattedMessage.replace(/{{firstName}}/g, firstName);
          formattedMessage = formattedMessage.replace(/{{lastName}}/g, lastName);
          
          // Convert newlines to <br> for HTML
          formattedMessage = formattedMessage.replace(/\n/g, '<br>');
          
          // Add tracking link if not already in the message
          if (trackingLink && !formattedMessage.includes(trackingLink.short_url)) {
            formattedMessage += `<br><br><a href="${trackingLink.short_url}">${trackingLink.short_url}</a>`;
          }
          
          // Send email using Resend
          await resend.emails.send({
            from: `${fromName} <${fromEmail}>`,
            to: [email],
            subject,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                ${formattedMessage}
              </div>
            `,
          });
          
          sent++;
          return true;
        } catch (error) {
          console.error(`Failed to send email to ${email}:`, error);
          failed++;
          return false;
        }
      });
      
      // Wait for batch to complete
      await Promise.all(sendPromises);
      
      // Pause between batches to prevent rate limiting
      if (i + batchSize < uniqueEmails.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    // Record the campaign send in the database
    const { error: insertError } = await supabase
      .from('campaign_emails')
      .insert({
        campaign_id: campaignId,
        user_id: userId,
        emails_sent: sent,
        emails_failed: failed
      });
    
    if (insertError) {
      console.error('Error recording campaign send:', insertError);
    }
    
    return new Response(
      JSON.stringify({ sent, failed, total }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    );
  } catch (error: any) {
    console.error('Error in send-campaign-emails function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to send campaign emails' }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    );
  }
};

serve(handler);

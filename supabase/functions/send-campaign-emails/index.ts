
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SendCampaignEmailsRequest {
  campaignId: string;
  emails: string[];
  subject: string;
  message?: string;
  userId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { campaignId, emails, subject, message, userId } = await req.json() as SendCampaignEmailsRequest;
    
    // Validate inputs
    if (!campaignId || !emails || !Array.isArray(emails) || !subject || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Enforce rate limits
    if (emails.length > 500) {
      return new Response(
        JSON.stringify({ error: "Maximum 500 recipients allowed" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Remove duplicates
    const uniqueEmails = [...new Set(emails)];
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Fetch campaign details
    const { data: campaign, error: campaignError } = await supabase
      .from("campaigns")
      .select("*")
      .eq("id", campaignId)
      .eq("user_id", userId)
      .single();
    
    if (campaignError || !campaign) {
      return new Response(
        JSON.stringify({ error: "Campaign not found or access denied" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Fetch campaign links
    const { data: campaignLinks, error: linksError } = await supabase
      .from("links")
      .select("*")
      .eq("campaign_id", campaignId)
      .limit(uniqueEmails.length);
    
    if (linksError || !campaignLinks || campaignLinks.length === 0) {
      return new Response(
        JSON.stringify({ error: "No links found for this campaign" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create mapping between emails and links
    const emailLinkPairs = uniqueEmails.map((email, index) => {
      // If we have fewer links than emails, reuse links
      const link = campaignLinks[index % campaignLinks.length];
      return { email, link };
    });

    // Send emails in batches to avoid timeouts
    const results = [];
    const batchSize = 10;
    
    for (let i = 0; i < emailLinkPairs.length; i += batchSize) {
      const batch = emailLinkPairs.slice(i, i + batchSize);
      const batchPromises = batch.map(({ email, link }) => {
        return resend.emails.send({
          from: "TidyLink <onboarding@resend.dev>", // Update with your verified domain
          to: [email],
          subject: subject,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #2767FF; font-size: 24px;">${campaign.name}</h1>
              ${message ? `<p style="color: #333; font-size: 16px;">${message}</p>` : ''}
              <p style="color: #555; font-size: 16px;">Check out this link:</p>
              <a href="${link.short_url}" style="background-color: #2767FF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0;">
                ${link.short_url}
              </a>
              <p style="color: #777; font-size: 12px; margin-top: 30px;">
                This email was sent as part of the ${campaign.name} campaign.
              </p>
            </div>
          `,
        });
      });
      
      const batchResults = await Promise.allSettled(batchPromises);
      results.push(...batchResults);
    }
    
    // Analyze results
    const successful = results.filter(r => r.status === "fulfilled").length;
    const failed = results.filter(r => r.status === "rejected").length;
    
    // Store email sending activity
    await supabase
      .from("campaign_emails")
      .insert({
        campaign_id: campaignId,
        user_id: userId,
        emails_sent: successful,
        emails_failed: failed,
        sent_at: new Date().toISOString()
      });

    return new Response(
      JSON.stringify({ 
        success: true,
        total: uniqueEmails.length,
        sent: successful,
        failed: failed
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in send-campaign-emails function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);

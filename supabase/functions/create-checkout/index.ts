
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper function to log steps with timestamps for easier debugging
const logStep = (message, details = null) => {
  const timestamp = new Date().toISOString();
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[${timestamp}] ${message}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { priceId, clerkUserId, userEmail } = await req.json();
    
    logStep("Request received", { priceId, clerkUserId, userEmail: userEmail ? `${userEmail.substring(0, 3)}...` : undefined });
    
    if (!priceId) {
      throw new Error("Price ID is required");
    }

    if (!clerkUserId || !userEmail) {
      throw new Error("User ID and email are required");
    }
    
    // Get Stripe API key
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      logStep("ERROR: Missing Stripe API key");
      return new Response(
        JSON.stringify({
          error: "Server configuration error: Missing Stripe API key"
        }), 
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    logStep("Using Stripe API key", { key: `${stripeKey.substring(0, 7)}...` });

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    // For free plan, no Stripe checkout needed
    if (priceId === "free" || priceId === null) {
      logStep("Free plan selected, no checkout needed");
      return new Response(JSON.stringify({ 
        success: true,
        message: "Free plan activated",
        url: `${req.headers.get("origin") || "https://tidylink.io"}/dashboard?success=true&plan=free`
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Check if customer exists
    logStep("Checking if customer exists with email", { email: userEmail ? `${userEmail.substring(0, 3)}...` : undefined });
    const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
    let customerId = customers.data[0]?.id;

    // Create customer if doesn't exist
    if (!customerId) {
      logStep("Creating new customer");
      const customer = await stripe.customers.create({ 
        email: userEmail,
        metadata: {
          clerkUserId
        }
      });
      customerId = customer.id;
      logStep("Created new customer", { customerId });
    } else {
      logStep("Using existing customer", { customerId });
    }

    // Get origin for success/cancel URLs
    // First try the origin header, then referer, finally fall back to tidylink.io
    const origin = req.headers.get("origin") || 
                  req.headers.get("referer")?.replace(/\/$/, "") || 
                  "https://tidylink.io";
    
    logStep("Using origin for redirect URLs", { origin });
    
    // Create checkout session with absolute URLs for both success and cancel paths
    // This helps with Netlify SPA routing
    logStep("Creating checkout session", { priceId });
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${origin}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?canceled=true`,
      allow_promotion_codes: true,
      subscription_data: {
        metadata: {
          clerkUserId
        }
      },
    });

    if (!session.url) {
      logStep("ERROR: Failed to create checkout session URL");
      throw new Error("Failed to create checkout session URL");
    }

    logStep("Successfully created checkout session", { 
      sessionId: session.id,
      sessionUrl: session.url,
      customerEmail: userEmail?.substring(0, 3) + "...",
      customerId
    });
    
    return new Response(JSON.stringify({ 
      url: session.url,
      sessionId: session.id
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    // Enhanced error handling
    console.error("Checkout error:", error);
    
    let errorMessage = "Payment processing error";
    let errorDetails = error.message || String(error);
    let statusCode = 400;
    
    if (error.type) {
      // Handle specific Stripe error types
      if (error.type === 'StripeAuthenticationError') {
        errorMessage = "Invalid API key or authentication error";
        statusCode = 500;
      } else if (error.type === 'StripeRateLimitError') {
        errorMessage = "Too many requests to payment processor";
        statusCode = 429;
      } else if (error.type === 'StripeConnectionError') {
        errorMessage = "Could not connect to payment service";
        statusCode = 503;
      } else if (error.type.includes('Stripe')) {
        errorMessage = `Stripe error: ${error.type}`;
      }
    }
    
    logStep(`ERROR (${statusCode}): ${errorMessage}`, { details: errorDetails });
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: errorDetails
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: statusCode,
    });
  }
});

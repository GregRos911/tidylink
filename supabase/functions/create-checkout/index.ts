
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
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { priceId, clerkUserId, userEmail } = await req.json();
    
    if (!priceId) {
      throw new Error("Price ID is required");
    }

    if (!clerkUserId || !userEmail) {
      throw new Error("User ID and email are required");
    }
    
    logStep("Processing checkout", { clerkUserId, userEmail: userEmail.substring(0, 3) + "..." });

    // Initialize Stripe with proper error handling
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      console.error("STRIPE_SECRET_KEY environment variable is not set");
      return new Response(
        JSON.stringify({ 
          error: "Server configuration error. Please contact support.",
          details: "STRIPE_SECRET_KEY is not set"
        }), 
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    // Additional validation for API key format
    if (!stripeKey.startsWith('sk_')) {
      console.error("Invalid STRIPE_SECRET_KEY format");
      return new Response(
        JSON.stringify({ 
          error: "Server configuration error. Incorrect API key format.",
          details: "STRIPE_SECRET_KEY should start with 'sk_'" 
        }), 
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    // Log sanitized key for debugging (only part of the key)
    logStep("Using Stripe API key", { key: stripeKey.substring(0, 7) + "..." + stripeKey.substring(stripeKey.length - 4) });

    // Check if using live mode in development
    if (stripeKey.startsWith('sk_live') && !req.headers.get("origin")?.includes("tidylink.io")) {
      console.warn("WARNING: Using live mode Stripe key in development environment");
      // We'll continue but log warning - don't block as it might be intentional
    }

    try {
      const stripe = new Stripe(stripeKey, {
        apiVersion: "2023-10-16",
      });

      // Check if customer exists
      logStep("Checking if customer exists with email", { email: userEmail.substring(0, 3) + "..." });
      const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
      let customerId = customers.data[0]?.id;

      // Create customer if doesn't exist
      if (!customerId) {
        logStep("Creating new customer");
        const customer = await stripe.customers.create({ 
          email: userEmail,
          metadata: {
            clerkUserId: clerkUserId
          }
        });
        customerId = customer.id;
        logStep("Created new customer", { customerId });
      } else {
        logStep("Using existing customer", { customerId });
      }

      // Get origin for success/cancel URLs
      const origin = req.headers.get("origin") || "https://tidylink.io";
      logStep("Using origin for redirect URLs", { origin });

      // Create checkout session with proper error handling
      logStep("Creating checkout session", { priceId });
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        line_items: [{ price: priceId, quantity: 1 }],
        mode: "subscription",
        success_url: `${origin}/dashboard?success=true`,
        cancel_url: `${origin}/pricing?canceled=true`,
        allow_promotion_codes: true,
        subscription_data: {
          trial_period_days: 14,
          metadata: {
            clerkUserId: clerkUserId
          }
        },
      });

      if (!session.url) {
        throw new Error("Failed to create checkout session URL");
      }

      logStep("Successfully created checkout session", { sessionUrl: session.url });
      return new Response(JSON.stringify({ url: session.url }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } catch (stripeError) {
      // Detailed Stripe error handling
      console.error("Stripe API error:", stripeError);
      let errorMessage = "Payment processing error";
      let statusCode = 400;
      
      if (stripeError.type === 'StripeAuthenticationError') {
        errorMessage = "Invalid API key or authentication error";
        statusCode = 500;
      } else if (stripeError.type === 'StripeRateLimitError') {
        errorMessage = "Too many requests to payment processor";
        statusCode = 429;
      } else if (stripeError.type === 'StripeConnectionError') {
        errorMessage = "Could not connect to payment service";
        statusCode = 503;
      }
      
      return new Response(JSON.stringify({ 
        error: errorMessage,
        details: stripeError.message
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: statusCode,
      });
    }
  } catch (error) {
    console.error("General checkout error:", error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: "An unexpected error occurred during checkout"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});

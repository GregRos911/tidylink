
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role key for admin access
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get user from auth header
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user?.email) {
      throw new Error("User not authenticated");
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Get customer
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    const customerId = customers.data[0]?.id;

    if (!customerId) {
      // No subscription found, update database
      await supabaseAdmin.from("subscribers").upsert({
        user_id: user.id,
        subscribed: false,
        subscription_tier: "FREE",
        updated_at: new Date().toISOString(),
      });

      return new Response(JSON.stringify({ 
        subscribed: false, 
        tier: "FREE" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      // No active subscription
      await supabaseAdmin.from("subscribers").upsert({
        user_id: user.id,
        stripe_customer_id: customerId,
        subscribed: false,
        subscription_tier: "FREE",
        subscription_end: null,
        updated_at: new Date().toISOString(),
      });

      return new Response(JSON.stringify({ 
        subscribed: false, 
        tier: "FREE" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get subscription details
    const subscription = subscriptions.data[0];
    const priceId = subscription.items.data[0].price.id;
    
    // Map price ID to tier
    const tierMap: Record<string, string> = {
      "price_starter": "STARTER",
      "price_growth": "GROWTH",
      "price_enterprise": "ENTERPRISE"
    };
    
    const tier = tierMap[priceId] || "FREE";

    // Update subscriber record
    await supabaseAdmin.from("subscribers").upsert({
      user_id: user.id,
      stripe_customer_id: customerId,
      subscribed: true,
      subscription_tier: tier,
      subscription_end: new Date(subscription.current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    });

    return new Response(JSON.stringify({
      subscribed: true,
      tier,
      subscription_end: new Date(subscription.current_period_end * 1000).toISOString(),
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});

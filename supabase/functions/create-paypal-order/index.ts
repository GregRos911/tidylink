
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function logStep(message: string, details: any = null) {
  const timestamp = new Date().toISOString();
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[${timestamp}] ${message}${detailsStr}`);
}

const PLAN_PRICE_MAP: Record<string, { price: string, name: string }> = {
  "price_1RG74DKsMMugzAZwjxqj0tY3": { price: "5.00", name: "Starter Plan" },
  "price_1RG776KsMMugzAZwplIX6K9N": { price: "20.00", name: "Growth Plan" },
  "price_1RG798KsMMugzAZwG2CXzMJe": { price: "150.00", name: "Enterprise Plan" }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    const { priceId, clerkUserId, userEmail } = await req.json();

    logStep("PayPal order requested", { priceId, clerkUserId, userEmail: userEmail ? `${userEmail.substring(0, 3)}...` : undefined });

    if (!priceId || !PLAN_PRICE_MAP[priceId]) {
      return new Response(
        JSON.stringify({ error: "Invalid or missing price ID" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (!clerkUserId || !userEmail) {
      return new Response(
        JSON.stringify({ error: "User ID and email are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const clientId = Deno.env.get("PAYPAL_CLIENT_ID");
    if (!clientId) {
      logStep("ERROR: Missing PayPal Client ID");
      return new Response(
        JSON.stringify({ error: "Missing PayPal Client ID" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Extract plan details
    const { price, name } = PLAN_PRICE_MAP[priceId];
    logStep("Creating PayPal order data", { price, name });
    
    // Return PayPal client ID and order details to the frontend
    return new Response(
      JSON.stringify({ 
        clientId,
        orderDetails: {
          priceId,
          value: price,
          plan: name,
          customId: clerkUserId
        }
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("PayPal order error", { error: errorMessage });
    
    return new Response(
      JSON.stringify({ error: "PayPal order error", details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});


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
    const clientSecret = Deno.env.get("PAYPAL_SECRET_KEY");
    if (!clientId || !clientSecret) {
      logStep("ERROR: Missing PayPal credentials");
      return new Response(
        JSON.stringify({ error: "Missing PayPal credentials" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Step 1: Get PayPal OAuth token
    logStep("Getting PayPal OAuth token");
    const auth = btoa(`${clientId}:${clientSecret}`);

    const tokenResp = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "grant_type=client_credentials"
    });
    if (!tokenResp.ok) {
      const trace = await tokenResp.text();
      logStep("PayPal token error", { trace });
      throw new Error("Could not get PayPal access token");
    }
    const tokenData = await tokenResp.json();
    const accessToken = tokenData.access_token;
    logStep("Obtained PayPal access token");

    // Step 2: Create PayPal order
    const { price, name } = PLAN_PRICE_MAP[priceId];

    logStep("Creating PayPal order", { price, name });
    const baseUrl = req.headers.get("origin") ||
      req.headers.get("referer")?.replace(/\/$/, "") ||
      "https://tidylink.io";

    const orderResp = await fetch("https://api-m.paypal.com/v2/checkout/orders", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: price,
            },
            description: name,
            custom_id: `${clerkUserId}`,
            payee: {
              email_address: userEmail,
            },
          }
        ],
        application_context: {
          brand_name: "tidylink.io",
          landing_page: "LOGIN",
          user_action: "PAY_NOW",
          shipping_preference: "NO_SHIPPING",
          return_url: `${baseUrl}/dashboard?success=true&paypal=1`,
          cancel_url: `${baseUrl}/pricing?canceled=true&paypal=1`
        }
      }),
    });
    const orderData = await orderResp.json();
    if (!orderData.links) {
      logStep("PayPal order API error", { orderData });
      throw new Error("Failed to create PayPal order");
    }
    const approveLink = orderData.links.find((l: any) => l.rel === "approve")?.href;
    if (!approveLink) {
      logStep("No approval URL in PayPal order", { orderData });
      throw new Error("No approval URL returned from PayPal");
    }

    logStep("Created PayPal order", { orderId: orderData.id, approveLink });

    return new Response(
      JSON.stringify({ url: approveLink, orderId: orderData.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    logStep("PayPal order error", { error: error.message || String(error) });
    return new Response(
      JSON.stringify({ error: error.message || "PayPal order error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

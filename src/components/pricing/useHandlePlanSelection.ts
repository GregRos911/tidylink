
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useSession } from "@clerk/clerk-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Accepts entire plan object
interface LastCheckout {
  plan: string;
  priceId: string | null;
  sessionId?: string;
  result?: any;
  error?: string;
}

export function useHandlePlanSelection() {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const { session } = useSession();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [lastCheckout, setLastCheckout] = useState<LastCheckout | null>(null);

  // Accept the whole plan object so we can directly pull the priceId
  const handlePlanSelection = async (plan: { name: string; priceId: string | null }) => {
    if (!isSignedIn) {
      navigate("/sign-up");
      return;
    }
    setIsLoading(plan.name);
    setLastCheckout(null);

    try {
      if (!session) {
        toast.error("You must be signed in to purchase a plan.");
        setIsLoading(null);
        return;
      }

      const token = await session.getToken();
      if (!token) {
        toast.error("Authentication token not available");
        setIsLoading(null);
        throw new Error("Authentication token not available");
      }

      const priceId = plan.priceId;
      setLastCheckout({ plan: plan.name, priceId, sessionId: session.id });

      const userEmail = session.user.primaryEmailAddress?.emailAddress;
      if (!userEmail) {
        toast.error("User email not available");
        setIsLoading(null);
        throw new Error("User email not available");
      }

      console.log("Initiating checkout for:", {
        plan: plan.name,
        priceId,
        userId: session.user.id,
        userEmail: userEmail
      });

      // Handle free plan separately - no need to call Stripe
      if (plan.priceId === null) {
        console.log("Processing free plan activation");
        toast.success("Free plan activated! You have 7 days to try our service.");
        navigate("/dashboard?success=true&plan=free");
        setIsLoading(null);
        return;
      }

      // For paid plans, create a Stripe checkout session
      console.log("Calling create-checkout function with:", { priceId, clerkUserId: session.user.id, userEmail });
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          priceId,
          clerkUserId: session.user.id,
          userEmail: userEmail,
        },
      });

      console.log("Checkout response:", { data, error });

      setLastCheckout((prev) => ({
        ...prev!,
        result: data,
        error: error?.message,
      }));

      if (error) {
        console.error("Function error:", error);
        toast.error(`Payment setup error: ${error.message || "Unknown error"}`);
        setIsLoading(null);
        return;
      }

      // Make sure we have a URL before redirecting
      if (!data?.url) {
        console.error("No checkout URL returned:", data);
        toast.error("Failed to create checkout session. Please try again.");
        setIsLoading(null);
        return;
      }

      // Set a timeout to ensure the toast is visible before redirect
      toast.success("Redirecting to checkout...");
      
      // Redirect to Stripe checkout page
      setTimeout(() => {
        console.log("Redirecting to:", data.url);
        window.location.href = data.url;
      }, 1000);
      
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
      toast.error(error.message || "Failed to start checkout process. Please try again.");
      setLastCheckout((prev) => ({
        ...prev!,
        error: error.message || String(error),
      }));
      setIsLoading(null);
    }
  };

  // PayPal payment flow with JavaScript SDK
  const handlePayPalSelection = async (plan: { name: string; priceId: string | null }) => {
    if (!isSignedIn) {
      navigate("/sign-up");
      return;
    }
    setIsLoading(plan.name);
    setLastCheckout(null);

    try {
      if (!session) {
        toast.error("You must be signed in to purchase a plan.");
        setIsLoading(null);
        return;
      }
      const token = await session.getToken();
      if (!token) {
        toast.error("Authentication token not available");
        setIsLoading(null);
        throw new Error("Authentication token not available");
      }
      const priceId = plan.priceId;
      setLastCheckout({ plan: plan.name, priceId, sessionId: session.id });

      const userEmail = session.user.primaryEmailAddress?.emailAddress;
      if (!userEmail) {
        toast.error("User email not available");
        setIsLoading(null);
        throw new Error("User email not available");
      }

      console.log("Initiating PayPal checkout for:", {
        plan: plan.name,
        priceId,
        userId: session.user.id,
        userEmail: userEmail
      });

      // Call the edge function to get PayPal client ID and order details
      const { data, error } = await supabase.functions.invoke("create-paypal-order", {
        body: {
          priceId,
          clerkUserId: session.user.id,
          userEmail: userEmail,
        },
      });

      setLastCheckout((prev) => ({
        ...prev!,
        result: data,
        error: error?.message,
      }));

      if (error) {
        console.error("PayPal function error:", error);
        toast.error(`PayPal payment error: ${error.message || "Unknown error"}`);
        setIsLoading(null);
        return;
      }
      
      if (!data?.clientId || !data?.orderDetails) {
        console.error("Invalid PayPal configuration returned:", data);
        toast.error("Failed to configure PayPal. Please try again.");
        setIsLoading(null);
        return;
      }

      const { clientId, orderDetails } = data;

      // Load the PayPal SDK
      const paypalScriptPromise = new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load PayPal SDK"));
        document.body.appendChild(script);
      });

      toast.info("Initializing PayPal checkout...");
      
      try {
        await paypalScriptPromise;
        
        // Create a PayPal button container if it doesn't exist
        let paypalButtonContainer = document.getElementById('paypal-button-container');
        if (!paypalButtonContainer) {
          paypalButtonContainer = document.createElement('div');
          paypalButtonContainer.id = 'paypal-button-container';
          paypalButtonContainer.style.position = 'fixed';
          paypalButtonContainer.style.zIndex = '9999';
          paypalButtonContainer.style.top = '50%';
          paypalButtonContainer.style.left = '50%';
          paypalButtonContainer.style.transform = 'translate(-50%, -50%)';
          paypalButtonContainer.style.background = 'white';
          paypalButtonContainer.style.padding = '20px';
          paypalButtonContainer.style.borderRadius = '8px';
          paypalButtonContainer.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
          document.body.appendChild(paypalButtonContainer);
        } else {
          // Clear any existing buttons
          paypalButtonContainer.innerHTML = '';
        }
        
        // Add a close button to the container
        const closeButton = document.createElement('button');
        closeButton.textContent = '✕';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '5px';
        closeButton.style.right = '5px';
        closeButton.style.background = 'none';
        closeButton.style.border = 'none';
        closeButton.style.fontSize = '16px';
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = () => {
          document.body.removeChild(paypalButtonContainer!);
          setIsLoading(null);
        };
        paypalButtonContainer.appendChild(closeButton);

        // Show plan info in the container
        const planInfo = document.createElement('div');
        planInfo.innerHTML = `<h3 style="margin: 0 0 15px 0;">Purchasing: ${orderDetails.plan}</h3><p style="margin: 0 0 20px 0;">Amount: $${orderDetails.value} USD</p>`;
        paypalButtonContainer.appendChild(planInfo);
        
        // @ts-ignore - PayPal is loaded via the script
        window.paypal.Buttons({
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: orderDetails.value,
                  currency_code: 'USD'
                },
                description: orderDetails.plan,
                custom_id: orderDetails.customId
              }],
              application_context: {
                shipping_preference: 'NO_SHIPPING'
              }
            });
          },
          onApprove: async (data: any, actions: any) => {
            toast.info("Processing payment...");
            try {
              const details = await actions.order.capture();
              console.log("PayPal payment captured:", details);
              
              // Clean up the PayPal button container
              if (paypalButtonContainer && document.body.contains(paypalButtonContainer)) {
                document.body.removeChild(paypalButtonContainer);
              }
              
              toast.success("Payment successful! Your subscription has been activated.");
              navigate("/dashboard?success=true&paypal=1");
            } catch (error) {
              console.error("PayPal capture error:", error);
              toast.error("Failed to complete payment. Please try again.");
            } finally {
              setIsLoading(null);
            }
          },
          onCancel: () => {
            // Clean up the PayPal button container
            if (paypalButtonContainer && document.body.contains(paypalButtonContainer)) {
              document.body.removeChild(paypalButtonContainer);
            }
            toast.info("Payment canceled.");
            setIsLoading(null);
          },
          onError: (err: any) => {
            console.error("PayPal error:", err);
            // Clean up the PayPal button container
            if (paypalButtonContainer && document.body.contains(paypalButtonContainer)) {
              document.body.removeChild(paypalButtonContainer);
            }
            toast.error("PayPal payment error. Please try again.");
            setIsLoading(null);
          }
        }).render('#paypal-button-container');
        
      } catch (sdkError) {
        console.error("PayPal SDK error:", sdkError);
        toast.error("Failed to load PayPal. Please try again later.");
        setIsLoading(null);
      }
    } catch (error: any) {
      console.error("Error creating PayPal order:", error);
      toast.error(error.message || "Failed to start PayPal payment. Please try again.");
      setLastCheckout((prev) => ({
        ...prev!,
        error: error.message || String(error),
      }));
      setIsLoading(null);
    }
  };

  return { handlePlanSelection, isLoading, lastCheckout, handlePayPalSelection };
}

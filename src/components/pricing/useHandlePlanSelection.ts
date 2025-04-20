
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
        return;
      }

      const token = await session.getToken();
      if (!token) {
        toast.error("Authentication token not available");
        throw new Error("Authentication token not available");
      }

      const priceId = plan.priceId;
      setLastCheckout({ plan: plan.name, priceId, sessionId: session.id });

      const userEmail = session.user.primaryEmailAddress?.emailAddress;
      if (!userEmail) {
        toast.error("User email not available");
        throw new Error("User email not available");
      }

      console.log("Initiating checkout for:", {
        plan: plan.name,
        priceId,
        userId: session.user.id,
        userEmail: userEmail
      });

      // Handle free plan separately
      if (priceId === null) {
        toast.success("Free plan activated! You have 7 days to try our service.");
        navigate("/dashboard?success=true&plan=free");
        setIsLoading(null);
        return;
      }

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
        if (error.message?.toLowerCase().includes("stripe")) {
          toast.error("Payment setup error. Please check your Stripe credentials.");
        } else {
          toast.error(`Function error: ${error.message}`);
        }
        return;
      }

      if (!data?.url) {
        console.error("No URL returned:", data);
        toast.error("No checkout URL returned from server");
        return;
      }

      window.location.href = data.url;
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
      toast.error(error.message || "Failed to start checkout process. Please try again.");
      setLastCheckout((prev) => ({
        ...prev!,
        error: error.message || String(error),
      }));
    } finally {
      setIsLoading(null);
    }
  };

  return { handlePlanSelection, isLoading, lastCheckout };
}

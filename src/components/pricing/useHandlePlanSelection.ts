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

  // Refactor: Only handle free plan directly, otherwise navigate to /checkout
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

      if (plan.priceId === null) {
        toast.success("Free plan activated! You have 7 days to try our service.");
        navigate("/dashboard?success=true&plan=free");
        setIsLoading(null);
        return;
      }

      // Paid plan: store selected plan in localStorage and navigate to checkout page
      localStorage.setItem('tidylink_selected_plan', JSON.stringify(plan));
      setIsLoading(null);
      navigate("/checkout");
    } catch (error: any) {
      toast.error(error.message || "Failed to initiate checkout.");
      setLastCheckout((prev) => ({
        ...prev!,
        error: error.message || String(error),
      }));
      setIsLoading(null);
    }
  };

  // Remove handlePayPalSelection: all payment handled from CheckoutPage now
  return { handlePlanSelection, isLoading, lastCheckout };
}

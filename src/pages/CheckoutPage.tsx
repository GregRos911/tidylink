
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import PayPalButton from "@/components/payment/PayPalButton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useUser } from "@clerk/clerk-react";

interface Plan {
  name: string;
  priceId: string | null;
  annualPriceId?: string | null;
  price: string;
  annualPrice?: string;
  description: string;
  features: string[];
}

const ANNUAL_SAVE_PERCENT = 20;

// Helper to get annual plan info if available
function getPlanVariants(plan: Plan) {
  // Here, you could later pull these from your pricing data or props if you want to make it generic.
  // For now, this is hardcoded to Growth Plan logic for demo — feel free to extend as needed.
  if (plan.name === "Growth Plan") {
    return [
      {
        id: "monthly",
        label: "Pay monthly",
        price: "$20/mo",
        priceId: plan.priceId,
      },
      {
        id: "annual",
        label: "Pay annually",
        price: "$192/year",
        rawAmount: 192, // Used as numeric value for payments
        priceId: "price_1RG79rKsMMugzAZwlSoQptTJ", // 👈 fill this with your real Stripe annual price_id
        badge: `Save ${ANNUAL_SAVE_PERCENT}%`
      }
    ];
  } else {
    // For other plans, just return current price info, you can expand as needed.
    return [
      {
        id: "monthly",
        label: `Pay monthly`,
        price: plan.price,
        priceId: plan.priceId,
      }
    ];
  }
}

const CheckoutPage: React.FC = () => {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState("monthly");
  const navigate = useNavigate();
  const { userId } = useAuth();
  const { user } = useUser();

  // First useEffect - get plan from localStorage
  useEffect(() => {
    // Get the selected plan from localStorage
    const planData = localStorage.getItem('tidylink_selected_plan');
    if (!planData) {
      toast.error("No plan selected, returning to pricing.");
      navigate("/pricing");
      return;
    }
    setPlan(JSON.parse(planData));
  }, [navigate]);

  // Exit early if no plan is available
  if (!plan) return null;

  // Get available billing cycles for this plan
  const planVariants = getPlanVariants(plan);
  
  // Set default cycle to "annual" if previously selected or only annual available
  // IMPORTANT: This was causing the hooks ordering issue - moving this logic into useEffect
  useEffect(() => {
    if (planVariants.length === 2) setSelectedCycle("annual");
    else if (planVariants.length > 0) setSelectedCycle(planVariants[0].id);
  }, [plan?.name]);

  const selectedVariant = planVariants.find(v => v.id === selectedCycle) || planVariants[0];

  // Extract numeric price for PayPal
  const priceNumeric = (() => {
    const match = selectedVariant.price.match(/[\d,.]+/);
    return match ? match[0].replace(/,/g, "") : "0.00";
  })();

  // Handler for starting Stripe payment
  const handleStripePayment = async () => {
    try {
      setIsLoading(true);
      if (!userId || !user?.primaryEmailAddress) {
        toast.error("You must be signed in to make a payment.");
        setIsLoading(false);
        return;
      }
      // Call Edge Function to create Stripe Checkout session
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          priceId: selectedVariant.priceId,
          planName: plan.name,
          clerkUserId: userId,
          userEmail: user.primaryEmailAddress.emailAddress
        },
      });
      if (error || !data?.url) {
        toast.error("Stripe payment failed to start.");
        setIsLoading(false);
        return;
      }
      window.location.href = data.url; // Redirect user to Stripe payment page
    } catch (err: any) {
      toast.error("Unexpected error during Stripe payment.");
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center py-8">
      <div className="w-full max-w-xl bg-white rounded-lg shadow-xl p-8 relative">
        <h2 className="font-bold text-2xl mb-1">{plan.name}</h2>
        {/* Billing cycle selector */}
        <div className="mb-5">
          <div className="font-semibold mb-3">Billing cycle</div>
          <div className="flex gap-4 w-full">
            {planVariants.map(variant => (
              <button
                key={variant.id}
                onClick={() => setSelectedCycle(variant.id)}
                className={`
                  flex-1 py-4 px-4 rounded-lg border transition 
                  ${selectedCycle === variant.id
                    ? "border-blue-600 ring-2 ring-blue-200 bg-blue-50"
                    : "border-gray-300 bg-white hover:bg-gray-50"}
                  flex flex-col items-start relative
                `}
                style={{ minWidth: 0 }}
                disabled={isLoading}
                type="button"
              >
                <div className="flex items-center gap-2 text-lg font-semibold">
                  {variant.label}
                  {variant.badge && (
                    <span className="text-xs font-bold bg-green-100 text-green-700 rounded px-2 py-0.5 ml-2">
                      {variant.badge}
                    </span>
                  )}
                </div>
                <div className="mt-1 text-2xl font-bold">{variant.price}</div>
              </button>
            ))}
          </div>
        </div>
        {/* Plan description/features */}
        <div className="mb-4 text-gray-600">{plan.description}</div>
        <div className="mb-5">
          <ul className="list-disc pl-5 space-y-2">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="text-gray-700">{feature}</li>
            ))}
          </ul>
        </div>
        {/* Terms of service */}
        <div className="bg-gray-100 p-4 rounded mb-6 text-xs">
          By clicking below, you agree to our Terms of Service and Privacy Policy.
        </div>
        {/* Payment buttons: PayPal SDK and Stripe */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
          {/* PayPal SDK button */}
          <div className="w-full sm:w-1/2">
            <PayPalButton
              amount={priceNumeric}
              onSuccess={() => {
                toast.success("PayPal payment successful! (Demo)");
                // Add real logic here!
              }}
              disabled={isLoading}
            />
          </div>
          {/* Stripe button */}
          <div className="w-full sm:w-1/2">
            <Button
              className="flex items-center justify-center bg-[#635bff] hover:bg-[#3e33d1] text-white font-bold w-full py-3 rounded transition-colors text-lg"
              onClick={handleStripePayment}
              disabled={isLoading}
              type="button"
            >
              Pay with Stripe
            </Button>
          </div>
        </div>
        <Button
          className="mt-6 w-full"
          variant="outline"
          onClick={() => navigate("/pricing")}
          disabled={isLoading}
        >
          &larr; Back to Plans
        </Button>
      </div>
    </div>
  );
};

export default CheckoutPage;

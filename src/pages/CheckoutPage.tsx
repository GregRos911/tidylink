import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import PayPalButton from "@/components/payment/PayPalButton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useUser } from "@clerk/clerk-react";
import BillingCycleSelector from "@/components/checkout/BillingCycleSelector";
import PlanFeatures from "@/components/checkout/PlanFeatures";
import CheckoutPaymentButtons from "@/components/checkout/CheckoutPaymentButtons";

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

function getPlanVariants(plan: Plan) {
  if (plan.name === "Starter Plan") {
    return [
      {
        id: "monthly",
        label: "Pay monthly",
        price: "$5/mo",
        priceId: plan.priceId,
      },
      {
        id: "annual",
        label: "Pay annually",
        price: "$48/year",
        rawAmount: 48,
        priceId: "price_1RG7APKsMMugzAZwq6vWGzPl",
        badge: `Save ${ANNUAL_SAVE_PERCENT}%`
      }
    ];
  } else if (plan.name === "Growth Plan") {
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
        rawAmount: 192,
        priceId: "price_1RG79rKsMMugzAZwlSoQptTJ",
        badge: `Save ${ANNUAL_SAVE_PERCENT}%`
      }
    ];
  } else if (plan.name === "Enterprise Plan") {
    return [
      {
        id: "monthly",
        label: "Pay monthly",
        price: "$150/mo",
        priceId: plan.priceId,
      },
      {
        id: "annual",
        label: "Pay annually",
        price: "$1440/year",
        rawAmount: 1440,
        priceId: "price_1RG7BbKsMMugzAZwljjrP6Fv",
        badge: `Save ${ANNUAL_SAVE_PERCENT}%`
      }
    ];
  } else {
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
  const [planVariants, setPlanVariants] = useState<any[]>([]);
  const navigate = useNavigate();
  const { userId } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    const planData = localStorage.getItem('tidylink_selected_plan');
    if (!planData) {
      toast.error("No plan selected, returning to pricing.");
      navigate("/pricing");
      return;
    }
    
    const parsedPlan = JSON.parse(planData);
    setPlan(parsedPlan);
    
    const variants = getPlanVariants(parsedPlan);
    setPlanVariants(variants);
    
    if (variants.length === 2) {
      setSelectedCycle("annual");
    } else if (variants.length > 0) {
      setSelectedCycle(variants[0].id);
    }
  }, [navigate]);

  if (!plan) return null;

  const selectedVariant = planVariants.find(v => v.id === selectedCycle) || planVariants[0];

  const priceNumeric = (() => {
    const match = selectedVariant.price.match(/[\d,.]+/);
    return match ? match[0].replace(/,/g, "") : "0.00";
  })();

  const handleStripePayment = async () => {
    try {
      setIsLoading(true);
      if (!userId || !user?.primaryEmailAddress) {
        toast.error("You must be signed in to make a payment.");
        setIsLoading(false);
        return;
      }
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
      window.location.href = data.url;
    } catch (err: any) {
      toast.error("Unexpected error during Stripe payment.");
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center py-8">
      <div className="w-full max-w-xl bg-white rounded-lg shadow-xl p-8 relative">
        <h2 className="font-bold text-2xl mb-1">{plan.name}</h2>
        <BillingCycleSelector
          planVariants={planVariants}
          selectedCycle={selectedCycle}
          setSelectedCycle={setSelectedCycle}
          isLoading={isLoading}
        />
        <PlanFeatures
          description={plan.description}
          features={plan.features}
        />
        <div className="bg-gray-100 p-4 rounded mb-6 text-xs">
          By clicking below, you agree to our Terms of Service and Privacy Policy.
        </div>
        <CheckoutPaymentButtons
          priceNumeric={priceNumeric}
          isLoading={isLoading}
          handleStripePayment={handleStripePayment}
        />
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

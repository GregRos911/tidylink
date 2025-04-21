
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import PayPalButton from "@/components/payment/PayPalButton";

interface Plan {
  name: string;
  priceId: string | null;
  price: string;
  description: string;
  features: string[];
}

const CheckoutPage: React.FC = () => {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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

  if (!plan) return null;

  // Extract loanable price string to number (ex: "$5/mo" => "5.00")
  const priceNumeric = (() => {
    // Find digits/decimals in price string
    const match = plan.price.match(/[\d,.]+/);
    return match ? match[0].replace(/,/g, "") : "0.00";
  })();

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center py-8">
      <div className="w-full max-w-xl bg-white rounded-lg shadow-xl p-8 relative">
        <h2 className="font-bold text-2xl mb-2">{plan.name}</h2>
        <div className="text-xl mb-4 font-medium text-gray-700">{plan.price}</div>
        <p className="mb-4 text-gray-600">{plan.description}</p>
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
        {/* Payment buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
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
          <div className="w-full sm:w-1/2">
            <Button
              className="flex items-center justify-center bg-[#635bff] hover:bg-[#3e33d1] text-white font-bold w-full py-3 rounded transition-colors text-lg"
              onClick={async () => {
                setIsLoading(true);
                // The Stripe handler would be invoked here
                try {
                  toast.success("Stripe payment coming soon!");
                } finally {
                  setTimeout(() => setIsLoading(false), 1200);
                }
              }}
              disabled={isLoading}
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


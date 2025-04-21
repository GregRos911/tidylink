
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
        <div className="flex flex-col gap-3">
          <Button 
            className="flex items-center justify-center bg-yellow-400 hover:bg-yellow-500 text-black font-bold w-full py-3 rounded transition-colors text-lg"
            onClick={() => {
              setIsLoading(true);
              // The PayPal handler would be invoked here.
              toast.info("PayPal payment coming soon!");
              setTimeout(() => setIsLoading(false), 1200);
            }}
            disabled={isLoading}
          >
            <img src="/lovable-uploads/3ab8c374-d373-49d0-9f33-c0818a3d2bc2.png" alt="PayPal" className="h-6 mr-2" />
            Pay with PayPal
          </Button>
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
          <Button
            className="mt-2 w-full"
            variant="outline"
            onClick={() => navigate("/pricing")}
            disabled={isLoading}
          >
            &larr; Back to Plans
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;


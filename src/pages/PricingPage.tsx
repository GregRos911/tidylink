import React from 'react';
import Nav from '@/components/Nav';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLocation } from 'react-router-dom';
import { toast } from "sonner";
import PricingPlansGrid from "@/components/pricing/PricingPlansGrid";
import PricingDebugInfo from "@/components/pricing/PricingDebugInfo";
import PricingCustomSolution from "@/components/pricing/PricingCustomSolution";
import PricingFooter from "@/components/pricing/PricingFooter";
import pricingPlans from "@/components/pricing/pricingPlans";
import { useHandlePlanSelection } from "@/components/pricing/useHandlePlanSelection";

const DEBUG = true;

const PricingPage: React.FC = () => {
  const location = useLocation();
  const { handlePlanSelection, isLoading, lastCheckout } = useHandlePlanSelection();

  React.useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get('canceled') === 'true') {
      toast.info("Checkout was canceled. You can try again when you're ready.");
    }
    if (queryParams.get('success') === 'true') {
      toast.success("Your subscription has been activated! Enjoy your premium features.");
    }
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Nav />
      <main className="flex-1">
        <section className="container py-12 md:py-20">
          {location.search.includes("canceled=true") && (
            <Alert className="mb-6">
              <AlertTitle>Checkout Canceled</AlertTitle>
              <AlertDescription>
                {`You've canceled the checkout process. You can try again when you're ready.`}
              </AlertDescription>
            </Alert>
          )}

          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Pricing that grows with your needs.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Millions of users worldwide trust Tidylink for their link management. Choose the plan that's right for you.
            </p>
          </div>

          {DEBUG && <PricingDebugInfo lastCheckout={lastCheckout} />}

          <PricingPlansGrid
            plans={pricingPlans}
            isLoading={isLoading}
            handlePlanSelection={handlePlanSelection}
          />

          <PricingCustomSolution />
        </section>
      </main>
      <PricingFooter />
    </div>
  );
};

export default PricingPage;

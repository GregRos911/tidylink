
import React from 'react';
import Nav from '@/components/Nav';
import PricingPlansGrid from "@/components/pricing/PricingPlansGrid";
import PricingDebugInfo from "@/components/pricing/PricingDebugInfo";
import PricingCustomSolution from "@/components/pricing/PricingCustomSolution";
import PricingFooter from "@/components/pricing/PricingFooter";
import pricingPlans from "@/components/pricing/pricingPlans";
import { useHandlePlanSelection } from "@/components/pricing/useHandlePlanSelection";
import PricingHeader from "@/components/pricing/PricingHeader";
import PricingAlert from "@/components/pricing/PricingAlert";
import { useLocation } from 'react-router-dom';
import { toast } from "sonner";

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
          <PricingAlert canceled={location.search.includes("canceled=true")} />

          <PricingHeader />

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

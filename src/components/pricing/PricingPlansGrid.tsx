
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useUser } from "@clerk/clerk-react";

interface PricingPlan {
  name: string;
  priceId: string | null;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  color: string;
  highlighted: boolean;
}

interface PricingPlansGridProps {
  plans: PricingPlan[];
  isLoading: string | null;
  handlePlanSelection: (plan: PricingPlan) => void;
}

const getAccountAgeInDays = (createdAt: number | string) => {
  const created = typeof createdAt === "string" ? new Date(createdAt) : new Date(Number(createdAt));
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};

const PricingPlansGrid: React.FC<PricingPlansGridProps> = ({
  plans,
  isLoading,
  handlePlanSelection,
}) => {
  const { user } = useUser();
  const accountAge =
    user?.createdAt ? getAccountAgeInDays(user.createdAt) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-16">
      {plans.map((plan, index) => {
        const isFree = plan.name.toLowerCase().includes('free');
        const freePlanExpired = isFree && accountAge > 7;

        return (
          <div key={index} className="relative">
            {plan.highlighted && (
              <div className="absolute -top-4 left-0 right-0 text-center">
                <span className="bg-primary text-primary-foreground text-sm px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
            )}
            <Card className={`h-full overflow-hidden ${plan.highlighted ? 'border-primary shadow-lg' : 'shadow'}`}>
              <div className={`h-2 w-full bg-gradient-to-r ${plan.color}`} />
              <div className="p-6">
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">{plan.name}</h3>
                <p className="text-base mb-4">{plan.description}</p>
                {isFree && (
                  <p className="text-red-500 text-xs mb-2">
                    * Free plan ends after 1 week. Upgrade required to continue.
                  </p>
                )}
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                </div>
                <Button
                  className={`w-full mb-6 ${plan.highlighted ? 'bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink hover:opacity-90 transition-opacity' : ''}`}
                  variant={plan.highlighted ? 'default' : 'outline'}
                  onClick={() => !freePlanExpired && handlePlanSelection(plan)}
                  disabled={isLoading === plan.name || freePlanExpired}
                >
                  {freePlanExpired
                    ? "Free trial expired"
                    : isLoading === plan.name
                    ? 'Processing...'
                    : plan.buttonText}
                </Button>
                <div className="space-y-4">
                  <p className="font-medium">Plan includes:</p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="mr-2 mt-1 text-primary">+</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        );
      })}
    </div>
  );
};

export default PricingPlansGrid;


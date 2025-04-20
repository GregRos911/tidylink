
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface PricingPlan {
  name: string;
  description: string;
  price: string;
  period: string;
  features: string[];
  buttonText: string;
  color: string;
  highlighted: boolean;
}

interface PricingPlansGridProps {
  plans: PricingPlan[];
  isLoading: string | null;
  handlePlanSelection: (plan: string) => void;
}

const PricingPlansGrid: React.FC<PricingPlansGridProps> = ({
  plans,
  isLoading,
  handlePlanSelection,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
      {plans.map((plan, index) => (
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
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground ml-1">{plan.period}</span>
              </div>
              <Button
                className={`w-full mb-6 ${plan.highlighted ? 'bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink hover:opacity-90 transition-opacity' : ''}`}
                variant={plan.highlighted ? 'default' : 'outline'}
                onClick={() => handlePlanSelection(plan.name)}
                disabled={isLoading === plan.name}
              >
                {isLoading === plan.name ? 'Processing...' : plan.buttonText}
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
      ))}
    </div>
  );
};

export default PricingPlansGrid;

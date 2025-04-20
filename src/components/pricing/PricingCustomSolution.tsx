
import React from "react";
import { Button } from "@/components/ui/button";

const PricingCustomSolution: React.FC = () => (
  <div className="mt-16 text-center bg-muted rounded-lg p-8">
    <h2 className="text-2xl font-bold mb-4">Need a custom solution?</h2>
    <p className="text-muted-foreground mb-6">
      We offer tailored plans for businesses with specific requirements.
      Our team will work with you to build the perfect solution.
    </p>
    <Button variant="outline" size="lg">
      Contact Our Sales Team
    </Button>
  </div>
);

export default PricingCustomSolution;

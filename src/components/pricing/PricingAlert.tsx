
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface PricingAlertProps {
  canceled: boolean;
}

const PricingAlert: React.FC<PricingAlertProps> = ({ canceled }) => {
  if (!canceled) return null;
  return (
    <Alert className="mb-6">
      <AlertTitle>Checkout Canceled</AlertTitle>
      <AlertDescription>
        {`You've canceled the checkout process. You can try again when you're ready.`}
      </AlertDescription>
    </Alert>
  );
};

export default PricingAlert;

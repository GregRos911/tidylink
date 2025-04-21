
import React from "react";
import { Button } from "@/components/ui/button";
import PayPalButton from "@/components/payment/PayPalButton";
import { toast } from "sonner";

interface CheckoutPaymentButtonsProps {
  priceNumeric: string;
  isLoading: boolean;
  handleStripePayment: () => void;
}

const CheckoutPaymentButtons: React.FC<CheckoutPaymentButtonsProps> = ({
  priceNumeric,
  isLoading,
  handleStripePayment
}) => (
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
);

export default CheckoutPaymentButtons;

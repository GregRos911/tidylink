
import React, { useEffect, useRef } from "react";

interface PayPalButtonProps {
  amount: string;
  currency?: string;
  onSuccess?: (details: any) => void;
  disabled?: boolean;
}

declare global {
  interface Window { paypal?: any; }
}

const PayPalButton: React.FC<PayPalButtonProps> = ({
  amount,
  currency = "USD",
  onSuccess,
  disabled,
}) => {
  const paypalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cleanup old PayPal button if present
    if (paypalRef.current) {
      paypalRef.current.innerHTML = '';
    }

    // Load the PayPal JS SDK if not present
    const scriptId = "paypal-sdk";
    if (!window.paypal && !document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://www.paypal.com/sdk/js?client-id=sb&currency=${currency}`;
      script.async = true;
      script.onload = renderPayPalButton;
      document.body.appendChild(script);
    } else if (window.paypal) {
      renderPayPalButton();
    } else {
      // If script is loading, wait for it to load
      const script = document.getElementById(scriptId) as HTMLScriptElement;
      script?.addEventListener("load", renderPayPalButton);
    }

    function renderPayPalButton() {
      if (!window.paypal || !paypalRef.current) return;
      window.paypal.Buttons({
        style: {
          layout: 'horizontal',
          color: 'gold',
          shape: 'rect',
          label: 'paypal',
          height: 40,
        },
        // Only enable when not disabled
        onInit: (data: any, actions: any) => {
          if (disabled) actions.disable();
          else actions.enable();
        },
        createOrder: (_: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{ amount: { value: amount } }],
          });
        },
        onApprove: async (_: any, actions: any) => {
          const details = await actions.order.capture();
          if (onSuccess) onSuccess(details);
        },
        onError: (err: any) => {
          // Optionally, notify user or log error
          // toast.error("PayPal payment failed.");
          console.error("PayPal error", err);
        }
      }).render(paypalRef.current);
    }

    // Cleanup handler for the effect
    return () => {
      if (paypalRef.current) {
        paypalRef.current.innerHTML = '';
      }
    };
    // Only re-render if disabled or amount changes
    // eslint-disable-next-line
  }, [amount, currency, disabled]);

  return <div ref={paypalRef} data-testid="paypal-button" />;
};

export default PayPalButton;

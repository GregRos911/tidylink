
import React from "react";

interface DebugInfoProps {
  lastCheckout: {
    plan: string;
    priceId: string;
    sessionId?: string;
    result?: any;
    error?: string;
  } | null;
}

const PricingDebugInfo: React.FC<DebugInfoProps> = ({ lastCheckout }) => {
  if (!lastCheckout) return null;
  return (
    <div className="mb-6 p-4 rounded bg-yellow-50 border border-yellow-300 text-yellow-900 text-sm">
      <strong>[DEBUG]</strong> Last Checkout Attempt:<br />
      Plan: {lastCheckout.plan} <br />
      Price ID: {lastCheckout.priceId}<br />
      Session ID: {lastCheckout.sessionId}<br />
      {lastCheckout.error && (
        <span className="text-red-600">Error: {lastCheckout.error}</span>
      )}
      {lastCheckout.result && (
        <span>
          <br />Result: <pre className="whitespace-pre-wrap">{JSON.stringify(lastCheckout.result, null, 2)}</pre>
        </span>
      )}
    </div>
  );
};

export default PricingDebugInfo;

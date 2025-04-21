
import React from "react";

interface BillingCycleSelectorProps {
  planVariants: any[];
  selectedCycle: string;
  setSelectedCycle: (id: string) => void;
  isLoading: boolean;
}

const BillingCycleSelector: React.FC<BillingCycleSelectorProps> = ({
  planVariants,
  selectedCycle,
  setSelectedCycle,
  isLoading,
}) => (
  <div className="mb-5">
    <div className="font-semibold mb-3">Billing cycle</div>
    <div className="flex gap-4 w-full">
      {planVariants.map(variant => (
        <button
          key={variant.id}
          onClick={() => setSelectedCycle(variant.id)}
          className={`
            flex-1 py-4 px-4 rounded-lg border transition 
            ${selectedCycle === variant.id
              ? "border-blue-600 ring-2 ring-blue-200 bg-blue-50"
              : "border-gray-300 bg-white hover:bg-gray-50"}
            flex flex-col items-start relative
          `}
          style={{ minWidth: 0 }}
          disabled={isLoading}
          type="button"
        >
          <div className="flex items-center gap-2 text-lg font-semibold">
            {variant.label}
            {variant.badge && (
              <span className="text-xs font-bold bg-green-100 text-green-700 rounded px-2 py-0.5 ml-2">
                {variant.badge}
              </span>
            )}
          </div>
          <div className="mt-1 text-2xl font-bold">{variant.price}</div>
        </button>
      ))}
    </div>
  </div>
);

export default BillingCycleSelector;


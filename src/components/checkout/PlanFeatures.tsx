
import React from "react";

interface PlanFeaturesProps {
  description: string;
  features: string[];
}

const PlanFeatures: React.FC<PlanFeaturesProps> = ({ description, features }) => (
  <>
    <div className="mb-4 text-gray-600">{description}</div>
    <div className="mb-5">
      <ul className="list-disc pl-5 space-y-2">
        {features.map((feature, idx) => (
          <li key={idx} className="text-gray-700">{feature}</li>
        ))}
      </ul>
    </div>
  </>
);

export default PlanFeatures;

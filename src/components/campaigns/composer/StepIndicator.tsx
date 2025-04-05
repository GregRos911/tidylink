
import React from 'react';
import { Check } from 'lucide-react';

interface StepProps {
  steps: { title: string }[];
  currentStep: number;
}

const StepIndicator: React.FC<StepProps> = ({ steps, currentStep }) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        {steps.map((step, index) => (
          <div 
            key={step.title} 
            className={`flex items-center ${index !== 0 ? 'ml-2' : ''}`}
          >
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm
              ${currentStep >= index 
                ? 'bg-brand-blue text-white' 
                : 'bg-gray-200 text-gray-500'
              }`}
            >
              {currentStep > index ? <Check className="h-4 w-4" /> : index + 1}
            </div>
            <span 
              className={`ml-1 text-xs hidden sm:inline
              ${currentStep >= index ? 'text-brand-blue' : 'text-gray-500'}`}
            >
              {step.title}
            </span>
            {index < steps.length - 1 && (
              <div className="h-[1px] w-4 bg-gray-300 mx-1"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;

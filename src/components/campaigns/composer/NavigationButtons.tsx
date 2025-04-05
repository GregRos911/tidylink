
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NavigationButtonsProps {
  currentStep: number;
  isLastStep: boolean;
  isSubmitting: boolean;
  handleBack: () => void;
  handleNext: () => void;
  handleClose: () => void;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentStep,
  isLastStep,
  isSubmitting,
  handleBack,
  handleNext,
  handleClose
}) => {
  return (
    <div className="flex justify-between mt-6">
      <Button
        variant="outline"
        onClick={currentStep === 0 ? handleClose : handleBack}
        disabled={isSubmitting}
      >
        {currentStep === 0 ? 'Cancel' : (
          <>
            <ChevronLeft className="mr-1 h-4 w-4" /> Back
          </>
        )}
      </Button>
      <Button 
        onClick={handleNext}
        className="bg-brand-blue hover:bg-brand-blue/90"
        disabled={isSubmitting}
      >
        {isLastStep ? (
          isSubmitting ? 'Sending...' : 'Send Campaign'
        ) : (
          <>
            Next <ChevronRight className="ml-1 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
};

export default NavigationButtons;

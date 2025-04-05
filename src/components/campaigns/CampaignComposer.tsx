
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Campaign } from '@/services/campaigns/types';
import { Check, ChevronLeft, ChevronRight, Mail } from 'lucide-react';
import SenderInfoStep from './composer/SenderInfoStep';
import ComposeMessageStep from './composer/ComposeMessageStep';
import RecipientsStep from './composer/RecipientsStep';
import SelectLinkStep from './composer/SelectLinkStep';
import PreviewStep from './composer/PreviewStep';
import ConfirmationStep from './composer/ConfirmationStep';
import { useSendCampaignEmails } from '@/services/campaigns';

interface CampaignComposerProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign;
}

// Define a type for our form data
export interface CampaignData {
  fromName: string;
  fromEmail: string;
  subject: string;
  message: string;
  recipients: string[];
  selectedLinkId?: string;
  newLink?: {
    url: string;
    utmSource: string;
    utmMedium: string;
    utmCampaign: string;
    utmContent?: string;
    customBackhalf?: string;
  };
}

const CampaignComposer: React.FC<CampaignComposerProps> = ({
  isOpen,
  onClose,
  campaign
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [campaignData, setCampaignData] = useState<CampaignData>({
    fromName: '',
    fromEmail: '',
    subject: `${campaign.name} - Check out this link!`,
    message: '',
    recipients: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const sendEmails = useSendCampaignEmails();
  
  const steps = [
    { title: 'Sender Info', component: SenderInfoStep },
    { title: 'Compose Message', component: ComposeMessageStep },
    { title: 'Recipients', component: RecipientsStep },
    { title: 'Add Link', component: SelectLinkStep },
    { title: 'Preview', component: PreviewStep },
  ];
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSendCampaign();
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSendCampaign = async () => {
    setIsSubmitting(true);
    try {
      await sendEmails.mutateAsync({
        campaignId: campaign.id,
        emails: campaignData.recipients,
        subject: campaignData.subject,
        message: campaignData.message,
        fromName: campaignData.fromName,
        fromEmail: campaignData.fromEmail,
        linkId: campaignData.selectedLinkId,
        newLinkData: campaignData.newLink
      });
      
      setCurrentStep(steps.length); // Move to confirmation screen
    } catch (error) {
      console.error('Error sending campaign:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const updateCampaignData = (data: Partial<CampaignData>) => {
    setCampaignData(prev => ({ ...prev, ...data }));
  };
  
  const handleClose = () => {
    setCurrentStep(0);
    setCampaignData({
      fromName: '',
      fromEmail: '',
      subject: `${campaign.name} - Check out this link!`,
      message: '',
      recipients: []
    });
    onClose();
  };
  
  // If we're at the confirmation step
  if (currentStep === steps.length) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Campaign Sent Successfully</DialogTitle>
          </DialogHeader>
          <ConfirmationStep campaign={campaign} onClose={handleClose} />
        </DialogContent>
      </Dialog>
    );
  }
  
  const CurrentStepComponent = steps[currentStep].component;
  const isLastStep = currentStep === steps.length - 1;
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Campaign Composer</DialogTitle>
        </DialogHeader>
        
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
        
        <CurrentStepComponent 
          campaignData={campaignData}
          updateCampaignData={updateCampaignData}
          campaign={campaign}
        />
        
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
      </DialogContent>
    </Dialog>
  );
};

export default CampaignComposer;

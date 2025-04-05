
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Campaign } from '@/services/campaigns/types';
import { Mail } from 'lucide-react';
import SenderInfoStep from './composer/SenderInfoStep';
import ComposeMessageStep from './composer/ComposeMessageStep';
import RecipientsStep from './composer/RecipientsStep';
import SelectLinkStep from './composer/SelectLinkStep';
import PreviewStep from './composer/PreviewStep';
import ConfirmationStep from './composer/ConfirmationStep';
import { useSendCampaignEmails } from '@/services/campaigns';
import StepIndicator from './composer/StepIndicator';
import NavigationButtons from './composer/NavigationButtons';
import { CampaignData } from './composer/types';

interface CampaignComposerProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign;
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
        
        <StepIndicator steps={steps} currentStep={currentStep} />
        
        <CurrentStepComponent 
          campaignData={campaignData}
          updateCampaignData={updateCampaignData}
          campaign={campaign}
        />
        
        <NavigationButtons
          currentStep={currentStep}
          isLastStep={isLastStep}
          isSubmitting={isSubmitting}
          handleBack={handleBack}
          handleNext={handleNext}
          handleClose={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CampaignComposer;

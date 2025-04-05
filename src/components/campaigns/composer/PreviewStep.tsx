
import React from 'react';
import { CampaignData } from '../CampaignComposer';
import { Campaign } from '@/services/campaigns/types';
import { useCampaignLinks } from '@/services/campaigns';
import { AlertCircle, Mail, User, Link, Users, Check } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface PreviewStepProps {
  campaignData: CampaignData;
  updateCampaignData: (data: Partial<CampaignData>) => void;
  campaign: Campaign;
}

const PreviewStep: React.FC<PreviewStepProps> = ({
  campaignData,
  campaign
}) => {
  const { data: links } = useCampaignLinks(campaign.id);
  
  // Find the selected link if using an existing one
  const selectedLink = campaignData.selectedLinkId && links 
    ? links.find(link => link.id === campaignData.selectedLinkId) 
    : null;
  
  // Format the preview message with the tracking link
  const formatPreview = (message: string): string => {
    // Replace {{trackingLink}} with the actual link
    let formattedMessage = message;
    
    if (selectedLink) {
      formattedMessage = message.replace(/{{trackingLink}}/g, selectedLink.short_url);
    } else if (campaignData.newLink) {
      formattedMessage = message.replace(/{{trackingLink}}/g, '[New tracking link]');
    }
    
    // Replace other template variables
    formattedMessage = formattedMessage.replace(/{{firstName}}/g, '[First Name]');
    formattedMessage = formattedMessage.replace(/{{lastName}}/g, '[Last Name]');
    
    // Convert newlines to <br> for HTML display
    formattedMessage = formattedMessage.replace(/\n/g, '<br>');
    
    return formattedMessage;
  };
  
  return (
    <div className="space-y-4">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Campaign Preview</AlertTitle>
        <AlertDescription>
          Review your campaign details before sending. Double-check all information is correct.
        </AlertDescription>
      </Alert>
      
      <div className="grid gap-4 mb-6">
        <div className="bg-gray-50 border rounded-lg p-4">
          <h3 className="font-medium mb-2 flex items-center"><Mail className="h-4 w-4 mr-2" /> Email Details</h3>
          <div className="grid gap-3">
            <div className="grid grid-cols-3 text-sm">
              <span className="text-gray-500">From</span>
              <span className="col-span-2 font-medium">
                {campaignData.fromName} &lt;{campaignData.fromEmail}&gt;
              </span>
            </div>
            <div className="grid grid-cols-3 text-sm">
              <span className="text-gray-500">Subject</span>
              <span className="col-span-2 font-medium">{campaignData.subject}</span>
            </div>
            <div className="grid grid-cols-3 text-sm">
              <span className="text-gray-500">Recipients</span>
              <span className="col-span-2 font-medium">
                {campaignData.recipients.length} email addresses
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 border rounded-lg p-4">
          <h3 className="font-medium mb-2 flex items-center"><Link className="h-4 w-4 mr-2" /> Tracking Link</h3>
          <div className="text-sm">
            {selectedLink ? (
              <div className="grid gap-1">
                <div>
                  <span className="text-gray-500">Short URL: </span>
                  <span className="font-medium text-blue-600">{selectedLink.short_url}</span>
                </div>
                <div>
                  <span className="text-gray-500">Destination: </span>
                  <span className="break-all">{selectedLink.original_url}</span>
                </div>
                <div className="flex gap-2 mt-1">
                  {selectedLink.utm_source && (
                    <span className="bg-gray-200 text-xs px-2 py-1 rounded">
                      source: {selectedLink.utm_source}
                    </span>
                  )}
                  {selectedLink.utm_medium && (
                    <span className="bg-gray-200 text-xs px-2 py-1 rounded">
                      medium: {selectedLink.utm_medium}
                    </span>
                  )}
                </div>
              </div>
            ) : campaignData.newLink ? (
              <div className="grid gap-1">
                <div>
                  <span className="text-gray-500">Destination: </span>
                  <span className="break-all">{campaignData.newLink.url}</span>
                </div>
                <div className="flex gap-2 mt-1 flex-wrap">
                  <span className="bg-gray-200 text-xs px-2 py-1 rounded">
                    source: {campaignData.newLink.utmSource}
                  </span>
                  <span className="bg-gray-200 text-xs px-2 py-1 rounded">
                    medium: {campaignData.newLink.utmMedium}
                  </span>
                  <span className="bg-gray-200 text-xs px-2 py-1 rounded">
                    campaign: {campaignData.newLink.utmCampaign}
                  </span>
                  {campaignData.newLink.utmContent && (
                    <span className="bg-gray-200 text-xs px-2 py-1 rounded">
                      content: {campaignData.newLink.utmContent}
                    </span>
                  )}
                </div>
                {campaignData.newLink.customBackhalf && (
                  <div className="mt-1">
                    <span className="text-gray-500">Custom back-half: </span>
                    <span>{campaignData.newLink.customBackhalf}</span>
                  </div>
                )}
              </div>
            ) : (
              <span className="text-red-500">No tracking link selected</span>
            )}
          </div>
        </div>
        
        <div className="bg-white border rounded-lg p-4">
          <h3 className="font-medium mb-3 flex items-center">
            <Mail className="h-4 w-4 mr-2" /> Email Preview
          </h3>
          
          <div className="border p-4 rounded-md mb-3 bg-gray-50">
            <div className="mb-2">
              <span className="text-gray-500 text-sm">From: </span>
              <span className="text-sm font-medium">{campaignData.fromName} &lt;{campaignData.fromEmail}&gt;</span>
            </div>
            <div className="mb-2">
              <span className="text-gray-500 text-sm">To: </span>
              <span className="text-sm font-medium">[Recipient]</span>
            </div>
            <div className="pb-3 border-b">
              <span className="text-gray-500 text-sm">Subject: </span>
              <span className="text-sm font-medium">{campaignData.subject}</span>
            </div>
            <div 
              className="pt-3 text-sm" 
              dangerouslySetInnerHTML={{ __html: formatPreview(campaignData.message) }} 
            />
          </div>
        </div>
      </div>
      
      <div className="bg-green-50 rounded-lg border border-green-200 p-3 text-green-800">
        <div className="flex">
          <Check className="h-5 w-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Ready to send</p>
            <p className="text-sm">Your campaign will be sent to {campaignData.recipients.length} recipients.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewStep;

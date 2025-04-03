
import React from 'react';
import { QRTemplate } from './qrCodeTemplates';
import QRCodeTemplateThumbnail from './QRCodeTemplateThumbnail';

interface QRCodeTemplateSelectorProps {
  availableTemplates: QRTemplate[];
  selectedTemplateId: string;
  handleTemplateSelect: (templateId: string) => void;
}

const QRCodeTemplateSelector: React.FC<QRCodeTemplateSelectorProps> = ({
  availableTemplates,
  selectedTemplateId,
  handleTemplateSelect
}) => {
  return (
    <div className="space-y-6 mb-8">
      <h2 className="text-xl font-semibold">Choose a design template</h2>
      <div className="flex flex-wrap gap-3">
        {availableTemplates.map((template) => (
          <QRCodeTemplateThumbnail
            key={template.id}
            template={template}
            isSelected={selectedTemplateId === template.id}
            onClick={() => handleTemplateSelect(template.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default QRCodeTemplateSelector;

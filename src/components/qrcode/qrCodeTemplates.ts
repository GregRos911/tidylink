
export type QRTemplate = {
  id: string;
  name: string;
  image: string;
  category: 'pattern' | 'frame';
  premium: boolean;
};

// QR Code pattern templates
export const qrCodeTemplates: QRTemplate[] = [
  {
    id: 'template-1',
    name: 'Pattern 1',
    image: '/src/assets/qr-templates/pattern1.png',
    category: 'pattern',
    premium: false,
  },
  {
    id: 'template-2',
    name: 'Pattern 2',
    image: '/src/assets/qr-templates/pattern2.png',
    category: 'pattern',
    premium: false,
  },
  {
    id: 'template-3',
    name: 'Pattern 3',
    image: '/src/assets/qr-templates/pattern3.png',
    category: 'pattern',
    premium: false,
  },
  {
    id: 'template-4',
    name: 'Pattern 4',
    image: '/src/assets/qr-templates/pattern4.png',
    category: 'pattern',
    premium: true,
  },
  {
    id: 'template-5',
    name: 'Pattern 5',
    image: '/src/assets/qr-templates/pattern5.png',
    category: 'pattern',
    premium: true,
  },
  {
    id: 'template-6',
    name: 'Pattern 6',
    image: '/src/assets/qr-templates/pattern6.png',
    category: 'pattern',
    premium: true,
  },
];

// Function to get a template by ID
export const getTemplateById = (id: string): QRTemplate | undefined => {
  return qrCodeTemplates.find((template) => template.id === id);
};

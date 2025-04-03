
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
    image: '/images/qr-patterns/pattern-1.png',
    category: 'pattern',
    premium: false,
  },
  {
    id: 'template-2',
    name: 'Pattern 2',
    image: '/images/qr-patterns/pattern-2.png',
    category: 'pattern',
    premium: false,
  },
  {
    id: 'template-3',
    name: 'Pattern 3',
    image: '/images/qr-patterns/pattern-3.png',
    category: 'pattern',
    premium: false,
  },
  {
    id: 'template-4',
    name: 'Pattern 4',
    image: '/images/qr-patterns/pattern-4.png',
    category: 'pattern',
    premium: true,
  },
  {
    id: 'template-5',
    name: 'Pattern 5',
    image: '/images/qr-patterns/pattern-5.png',
    category: 'pattern',
    premium: true,
  },
  {
    id: 'template-6',
    name: 'Pattern 6',
    image: '/images/qr-patterns/pattern-6.png',
    category: 'pattern',
    premium: true,
  },
];

// Function to get a template by ID
export const getTemplateById = (id: string): QRTemplate | undefined => {
  return qrCodeTemplates.find((template) => template.id === id);
};

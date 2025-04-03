
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
    image: '/lovable-uploads/89378886-9ae0-4259-a1e3-8783781a272d.png',
    category: 'pattern',
    premium: false,
  },
  {
    id: 'template-2',
    name: 'Pattern 2',
    image: '/lovable-uploads/d93f9df5-d94d-4a3a-ba38-4f989bd483d2.png',
    category: 'pattern',
    premium: false,
  },
  {
    id: 'template-3',
    name: 'Pattern 3',
    image: '/lovable-uploads/25311cf9-da5e-42c3-aa33-96335628c7ce.png',
    category: 'pattern',
    premium: false,
  },
  {
    id: 'template-4',
    name: 'Pattern 4',
    image: '/lovable-uploads/933f6158-a6fe-49b6-bf3d-694a180e5bc9.png',
    category: 'pattern',
    premium: true,
  },
  {
    id: 'template-5',
    name: 'Pattern 5',
    image: '/lovable-uploads/f0ca27e8-b6d9-4f3f-bed0-f3b7e560f02e.png',
    category: 'pattern',
    premium: true,
  },
  {
    id: 'template-6',
    name: 'Pattern 6',
    image: '/lovable-uploads/632c6f28-8a90-44d4-86f2-0b78f518fbc6.png',
    category: 'pattern',
    premium: true,
  },
];

// Function to get a template by ID
export const getTemplateById = (id: string): QRTemplate | undefined => {
  return qrCodeTemplates.find((template) => template.id === id);
};

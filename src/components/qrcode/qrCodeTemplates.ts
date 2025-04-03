
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
    image: '/lovable-uploads/8bb6efa0-1e26-4d28-ab13-8ca6f576249b.png',
    category: 'pattern',
    premium: false,
  },
  {
    id: 'template-2',
    name: 'Pattern 2',
    image: '/lovable-uploads/b70ab65d-3930-497a-970e-d0e1392d46f2.png',
    category: 'pattern',
    premium: false,
  },
  {
    id: 'template-3',
    name: 'Pattern 3',
    image: '/lovable-uploads/2ffb2f40-9101-40c9-8a3d-3ad05e8373a4.png',
    category: 'pattern',
    premium: false,
  },
  {
    id: 'template-4',
    name: 'Pattern 4',
    image: '/lovable-uploads/422a5ca6-eed9-4ec1-a1c5-4741db421249.png',
    category: 'pattern',
    premium: true,
  },
  {
    id: 'template-5',
    name: 'Pattern 5',
    image: '/lovable-uploads/207e5526-4fe0-448f-9ba6-23d47af80000.png',
    category: 'pattern',
    premium: true,
  },
  {
    id: 'template-6',
    name: 'Pattern 6',
    image: '/lovable-uploads/a457f469-a3ec-4524-8b5d-90840e58971c.png',
    category: 'pattern',
    premium: true,
  },
];

// Function to get a template by ID
export const getTemplateById = (id: string): QRTemplate | undefined => {
  return qrCodeTemplates.find((template) => template.id === id);
};

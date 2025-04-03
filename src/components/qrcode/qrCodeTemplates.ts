
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
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=300&h=300',
    category: 'pattern',
    premium: false,
  },
  {
    id: 'template-2',
    name: 'Pattern 2',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=300&h=300',
    category: 'pattern',
    premium: false,
  },
  {
    id: 'template-3',
    name: 'Pattern 3',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=300&h=300',
    category: 'pattern',
    premium: false,
  },
  {
    id: 'template-4',
    name: 'Pattern 4',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=300&h=300',
    category: 'pattern',
    premium: true,
  },
  {
    id: 'template-5',
    name: 'Pattern 5',
    image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=300&h=300',
    category: 'pattern',
    premium: true,
  },
  {
    id: 'template-6',
    name: 'Pattern 6',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=300&h=300&v=2',
    category: 'pattern',
    premium: true,
  },
];

// Function to get a template by ID
export const getTemplateById = (id: string): QRTemplate | undefined => {
  return qrCodeTemplates.find((template) => template.id === id);
};

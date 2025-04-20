
const pricingPlans = [
  {
    name: 'FREE',
    description: 'Perfect for personal use and trying out features.',
    price: '$0',
    period: 'forever',
    features: [
      '7 short links per month',
      '5 QR code generations',
      'QR Code customizations',
      'Standard link analytics',
      '5 custom back-halves',
      'QR code customizations'
    ],
    buttonText: 'Get Started',
    color: 'from-yellow-100 to-yellow-200',
    highlighted: false
  },
  {
    name: 'STARTER',
    description: 'Everything you need to start creating your own short links.',
    price: '$5',
    period: 'per month',
    features: [
      'Up to 200 short links per month',
      '10 QR code generations',
      '60 days of scan & click data',
      'An advanced UTM builder',
      'Link & QR code redirects',
      'Advanced QR code customizations'
    ],
    buttonText: 'Start a free trial',
    color: 'from-blue-100 to-blue-200',
    highlighted: false
  },
  {
    name: 'GROWTH',
    description: 'All the extras for your growing team.',
    price: '$49',
    period: 'per month',
    features: [
      'Up to 700 short links per month',
      '20 QR codes per month',
      'Premium QR codes with analytics',
      'Unlimited click history tracking',
      'Team collaboration features',
      'Branded links'
    ],
    buttonText: 'Start a free trial',
    color: 'from-purple-100 to-purple-200',
    highlighted: true
  },
  {
    name: 'ENTERPRISE',
    description: 'Added flexibility to scale with your business.',
    price: '$199',
    period: 'per month',
    features: [
      'Unlimited short links',
      'White-label link shortening',
      'Dedicated account manager',
      'SSO and advanced security',
      'Custom contract & SLA'
    ],
    buttonText: 'Contact Sales',
    color: 'from-pink-100 to-pink-200',
    highlighted: false
  }
];

export default pricingPlans;

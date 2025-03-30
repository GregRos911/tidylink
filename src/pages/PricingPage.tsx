
import React from 'react';
import Nav from '@/components/Nav';
import { Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const PricingPage: React.FC = () => {
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Nav />
      
      <main className="flex-1">
        <section className="container py-12 md:py-20">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Pricing that grows with your needs.</h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Millions of users worldwide trust Tidylink for their link management. Choose the plan that's right for you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {pricingPlans.map((plan, index) => (
              <div key={index} className="relative">
                {plan.highlighted && (
                  <div className="absolute -top-4 left-0 right-0 text-center">
                    <span className="bg-primary text-primary-foreground text-sm px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <Card className={`h-full overflow-hidden ${plan.highlighted ? 'border-primary shadow-lg' : 'shadow'}`}>
                  <div className={`h-2 w-full bg-gradient-to-r ${plan.color}`} />
                  <div className="p-6">
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">{plan.name}</h3>
                    <p className="text-base mb-4">{plan.description}</p>
                    <div className="mb-6">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground ml-1">{plan.period}</span>
                    </div>
                    
                    <Button 
                      className={`w-full mb-6 ${plan.highlighted ? 'bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink hover:opacity-90 transition-opacity' : ''}`}
                      variant={plan.highlighted ? 'default' : 'outline'}
                    >
                      {plan.buttonText}
                    </Button>
                    
                    <div className="space-y-4">
                      <p className="font-medium">Plan includes:</p>
                      <ul className="space-y-3">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="mr-2 mt-1 text-primary">+</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center bg-muted rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Need a custom solution?</h2>
            <p className="text-muted-foreground mb-6">
              We offer tailored plans for businesses with specific requirements.
              Our team will work with you to build the perfect solution.
            </p>
            <Button variant="outline" size="lg">
              Contact Our Sales Team
            </Button>
          </div>
        </section>
      </main>
      
      <footer className="bg-background border-t py-6">
        <div className="container flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5 text-brand-blue" />
            <span className="font-bold bg-clip-text text-transparent bg-hero-gradient">Tidylink</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Tidylink. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PricingPage;

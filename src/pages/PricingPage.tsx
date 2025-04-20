
import React from 'react';
import Nav from '@/components/Nav';
import { Link as LinkIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, useSession } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
// Import refactored components
import PricingPlansGrid from "@/components/pricing/PricingPlansGrid";
import PricingDebugInfo from "@/components/pricing/PricingDebugInfo";
import PricingCustomSolution from "@/components/pricing/PricingCustomSolution";

const DEBUG = true;

// These IDs must match your Stripe test mode price IDs
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

const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSignedIn } = useAuth();
  const { session } = useSession();
  const [isLoading, setIsLoading] = React.useState<string | null>(null);
  const [lastCheckout, setLastCheckout] = React.useState<{
    plan: string;
    priceId: string;
    sessionId?: string;
    result?: any;
    error?: string;
  } | null>(null);

  React.useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get('canceled') === 'true') {
      toast.info('Checkout was canceled. You can try again when you\'re ready.');
    }
    if (queryParams.get('success') === 'true') {
      toast.success('Your subscription has been activated! Enjoy your premium features.');
    }
  }, [location]);

  const handlePlanSelection = async (plan: string) => {
    if (!isSignedIn) {
      navigate('/sign-up');
      return;
    }
    setIsLoading(plan);
    setLastCheckout(null);

    try {
      if (!session) {
        toast.error("You must be signed in to purchase a plan.");
        return;
      }

      const token = await session.getToken();

      if (!token) {
        toast.error("Authentication token not available");
        throw new Error("Authentication token not available");
      }

      // Using test mode price IDs - these should match your Stripe test price IDs
      const priceIds: Record<string, string> = {
        'STARTER': 'price_1PEwbDDm3KR6H5Yn1cg3jnCT',
        'GROWTH': 'price_1PEwbWDm3KR6H5YnMVuEFmGc',
        'ENTERPRISE': 'price_1PEwbrDm3KR6H5YnCwvLLgbp'
      };

      const priceId = priceIds[plan];
      if (!priceId) {
        toast.error('Invalid plan selected');
        throw new Error('Invalid plan selected');
      }

      setLastCheckout({ 
        plan, 
        priceId, 
        sessionId: session.id 
      });

      const userEmail = session.user.primaryEmailAddress?.emailAddress;
      if (!userEmail) {
        toast.error('User email not available');
        throw new Error('User email not available');
      }

      console.log("Initiating checkout for:", {
        plan,
        priceId,
        userId: session.user.id,
        userEmail: userEmail
      });

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          priceId,
          clerkUserId: session.user.id,
          userEmail: userEmail
        }
      });

      console.log("Checkout response:", { data, error });
      
      setLastCheckout(prev => ({
        ...prev!,
        result: data,
        error: error?.message
      }));

      if (error) {
        console.error('Function error:', error);
        if (error.message?.toLowerCase().includes("stripe")) {
          toast.error('Payment setup error. Please check your Stripe credentials.');
        } else {
          toast.error(`Function error: ${error.message}`);
        }
        return;
      }

      if (!data?.url) {
        console.error('No URL returned:', data);
        toast.error('No checkout URL returned from server');
        return;
      }

      // Redirect to Stripe checkout
      window.location.href = data.url;
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      toast.error(error.message || 'Failed to start checkout process. Please try again.');
      setLastCheckout((prev) => ({
        ...prev!,
        error: error.message || String(error)
      }));
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Nav />
      <main className="flex-1">
        <section className="container py-12 md:py-20">
          {location.search.includes('canceled=true') && (
            <Alert className="mb-6">
              <AlertTitle>Checkout Canceled</AlertTitle>
              <AlertDescription>
                {`You've canceled the checkout process. You can try again when you're ready.`}
              </AlertDescription>
            </Alert>
          )}

          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Pricing that grows with your needs.</h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Millions of users worldwide trust Tidylink for their link management. Choose the plan that's right for you.
            </p>
          </div>

          {DEBUG && (
            <PricingDebugInfo lastCheckout={lastCheckout} />
          )}

          <PricingPlansGrid
            plans={pricingPlans}
            isLoading={isLoading}
            handlePlanSelection={handlePlanSelection}
          />

          <PricingCustomSolution />
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

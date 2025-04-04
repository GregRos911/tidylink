
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { LinkIcon, ChevronRight } from 'lucide-react';
import TypingAnimation from './TypingAnimation';

const LinkShortener: React.FC = () => {
  const {
    isSignedIn,
    isLoaded
  } = useUser();
  const navigate = useNavigate();
  
  const handleCreateLink = () => {
    if (isSignedIn) {
      navigate('/dashboard');
    } else {
      navigate('/sign-in');
    }
  };
  
  return <Card className="w-full max-w-3xl mx-auto shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl">Shorten Your URLs</CardTitle>
        <CardDescription>Create short links and QR codes with the option to build trust with a secure link.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6">
        <div className="text-center p-4">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-brand-blue/10 rounded-full">
              <LinkIcon size={40} className="text-brand-blue" />
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2">Start creating and sharing links</h3>
          <p className="text-gray-600 mb-2">
            Sign in to your account to create custom branded short links, QR codes and more
          </p>
          
          <div className="flex justify-center mb-6">
            <TypingAnimation 
              texts={["Build Trust.", "Secure Links."]} 
              typingSpeed={80}
              pauseTime={1500}
              fadeTime={600}
            />
          </div>
          
          <Button onClick={handleCreateLink} className="w-full sm:w-auto bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink hover:opacity-90 transition-opacity">
            {isSignedIn ? "Go to Dashboard" : "Sign In to Get Started"}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        
        <div className="w-full border-t pt-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <p className="text-sm text-gray-600">
              TidyLink helps you create branded links that drive more clicks and build trust
            </p>
            <Link to="/pricing">
              <Button variant="outline" size="sm">
                View Plans
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>;
};

export default LinkShortener;

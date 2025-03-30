
import React, { useState } from 'react';
import Nav from '@/components/Nav';
import LinkShortener from '@/components/LinkShortener';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import { Link as LinkIcon, QrCode, BarChart } from "lucide-react";

const Index: React.FC = () => {
  const [shortenedUrl, setShortenedUrl] = useState('');
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Nav />
      
      <main className="flex-1">
        <section className="container py-12 md:py-20">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Simple URL Shortening & QR Codes
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Create short links, QR codes, and secure sharing links with just a few clicks.
            </p>
          </div>
          
          <div className="flex flex-col items-center justify-center">
            {/* URL Shortener Component */}
            <LinkShortener />
            
            {/* QR Code Generator (only shows when a URL has been shortened) */}
            {shortenedUrl && <QRCodeGenerator url={shortenedUrl} />}
          </div>
        </section>
        
        {/* Features Section */}
        <section className="bg-muted py-16">
          <div className="container">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Why Choose Linky?</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-background rounded-lg p-6 shadow-sm">
                <div className="mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <LinkIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Short Links</h3>
                <p className="text-muted-foreground">Create compact, memorable links that never expire and are easy to share.</p>
              </div>
              
              <div className="bg-background rounded-lg p-6 shadow-sm">
                <div className="mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <QrCode className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">QR Codes</h3>
                <p className="text-muted-foreground">Generate scannable QR codes for your links that work on any device.</p>
              </div>
              
              <div className="bg-background rounded-lg p-6 shadow-sm">
                <div className="mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <BarChart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Link Analytics</h3>
                <p className="text-muted-foreground">Track clicks and monitor the performance of your shortened links.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-background border-t py-6">
        <div className="container flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5 text-brand-blue" />
            <span className="font-bold bg-clip-text text-transparent bg-hero-gradient">Linky</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Linky. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

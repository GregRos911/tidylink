import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import HistoryPage from "./pages/HistoryPage";
import PricingPage from "./pages/PricingPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import RedirectPage from "./components/RedirectPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import QRCodeBuilderPage from "./pages/QRCodeBuilderPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import CampaignsPage from "./pages/CampaignsPage";
import CampaignDetailsPage from "./pages/CampaignDetailsPage";
import CampaignAnalyticsPage from "./pages/CampaignAnalyticsPage";
import CheckoutPage from "./pages/CheckoutPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/history" element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/links" element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          } />
          <Route path="/qr-codes" element={
            <ProtectedRoute>
              <QRCodeBuilderPage />
            </ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          } />
          {/* New Campaign Routes */}
          <Route path="/campaigns" element={
            <ProtectedRoute>
              <CampaignsPage />
            </ProtectedRoute>
          } />
          <Route path="/campaigns/:id" element={
            <ProtectedRoute>
              <CampaignDetailsPage />
            </ProtectedRoute>
          } />
          <Route path="/campaigns/:id/analytics" element={
            <ProtectedRoute>
              <CampaignAnalyticsPage />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/custom-links" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          {/* Routes for redirection */}
          <Route path="/r/:id" element={<RedirectPage />} />
          <Route path="/go/:id" element={<RedirectPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        {/* Beta Version Label */}
        <div className="fixed bottom-2 left-2 text-xs text-gray-500 bg-white bg-opacity-70 px-2 py-1 rounded-md shadow-sm z-50">
          Beta Version 1.0
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

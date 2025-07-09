import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Index from "./pages/Index";
import Contact from "./pages/Contact";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import ModelAdvisor from "./pages/ModelAdvisor";
import Layout from "@/components/Layout";

const queryClient = new QueryClient();

// Component to handle scroll restoration
const ScrollToTop = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
};

// Safe default redirector that doesn't evaluate window at module load time
const getDefaultRedirector = () => {
  if (typeof window !== "undefined") {
    return window.location.replace;
  }
  return (url: string) => {
    console.warn('Redirect attempted in non-browser environment:', url);
  };
};

// Fixed ExternalRedirect: proper state management, SSR-safe, error handling
export const ExternalRedirect = ({ to, redirector }: { to: string, redirector?: (url: string) => void }) => {
  const [redirecting, setRedirecting] = useState(true);
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const actualRedirector = redirector || getDefaultRedirector();
      
      try {
        // Set a timeout to handle cases where redirect fails or is delayed
        const timeoutId = setTimeout(() => {
          console.warn('Redirect may have failed, hiding loading screen');
          setRedirecting(false);
        }, 3000);
        
        // Attempt the redirect
        actualRedirector(to);
        
        // If we reach here, the redirect was called successfully
        // but we might still be in the page (e.g., in tests or if redirect fails)
        // The timeout will handle this case
        
        // Cleanup function to clear timeout if component unmounts
        return () => clearTimeout(timeoutId);
        
      } catch (error) {
        console.error('Redirect failed:', error);
        setRedirecting(false);
      }
    } else {
      // SSR environment - don't show loading screen
      setRedirecting(false);
    }
  }, [to, redirector]);
  
  return redirecting ? (
    <div
      className="min-h-screen flex items-center justify-center bg-white"
      role="status"
      aria-live="polite"
      aria-label="Redirecting"
    >
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-lg font-medium text-gray-700">Redirecting to external site...</p>
        <p className="text-sm text-gray-500">If you are not redirected, <a href={to} className="text-blue-600 underline">click here</a>.</p>
      </div>
    </div>
  ) : null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Analytics />
      <BrowserRouter 
        future={{
          v7_startTransition: true,
        }}
        basename={undefined}
      >
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout><Index /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="/modeladvisor" element={<Layout><ModelAdvisor /></Layout>} />
          <Route path="/blog" element={<ExternalRedirect to="https://drelsolutions.substack.com/" />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

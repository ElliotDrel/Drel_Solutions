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
import { ThemeProvider } from "@/contexts/ThemeContext";

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

// Enhanced ExternalRedirect: improved UX with better loading states and error handling
export const ExternalRedirect = ({ to, redirector }: { to: string, redirector?: (url: string) => void }) => {
  const [redirecting, setRedirecting] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const actualRedirector = redirector || getDefaultRedirector();
      
      try {
        // Progress animation
        const progressInterval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 90) return prev;
            return prev + Math.random() * 20;
          });
        }, 100);
        
        // Reduced timeout to 1.5 seconds for better UX
        const timeoutId = setTimeout(() => {
          console.warn('Redirect may have failed, showing fallback');
          setProgress(100);
          setError('Redirect is taking longer than expected.');
          setRedirecting(false);
          clearInterval(progressInterval);
        }, 1500);
        
        // Attempt the redirect with a small delay for better UX
        const redirectTimeout = setTimeout(() => {
          actualRedirector(to);
        }, 500);
        
        // Cleanup function
        return () => {
          clearTimeout(timeoutId);
          clearTimeout(redirectTimeout);
          clearInterval(progressInterval);
        };
        
      } catch (error) {
        console.error('Redirect failed:', error);
        setError('Failed to redirect. Please try clicking the link below.');
        setRedirecting(false);
      }
    } else {
      // SSR environment - don't show loading screen
      setRedirecting(false);
    }
  }, [to, redirector]);
  
  if (!redirecting && !error) return null;
  
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100"
      role="status"
      aria-live="polite"
      aria-label={error ? "Redirect error" : "Redirecting"}
    >
      <div className="text-center space-y-6 bg-white rounded-lg shadow-lg p-8 max-w-md mx-4">
        {redirecting && !error ? (
          <>
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium text-blue-600">{Math.round(progress)}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-800">Redirecting to Blog</h2>
              <p className="text-sm text-gray-600">Taking you to our Substack publication...</p>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </>
        ) : (
          <>
            <div className="text-yellow-600">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.802-.833-2.572 0L4.242 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-800">Redirect Issue</h2>
              <p className="text-sm text-gray-600">{error}</p>
            </div>
          </>
        )}
        
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-3">
            You can also visit our blog directly:
          </p>
          <a 
            href={to} 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Visit Drel Solutions Blog
          </a>
        </div>
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
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
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

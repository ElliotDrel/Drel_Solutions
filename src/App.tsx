import { useEffect, lazy, Suspense, Component, ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Contact from "./pages/Contact";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import ModelAdvisor from "./pages/ModelAdvisor";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

// Lazy load blog components for performance
const Blog = lazy(() => import("./pages/Blog"));
const Article = lazy(() => import("./pages/Article"));

// Lazy load auth pages for performance
const SignInPage = lazy(() => import("./pages/auth/SignInPage"));
const SignUpPage = lazy(() => import("./pages/auth/SignUpPage"));
const ForgotPasswordPage = lazy(() => import("./pages/auth/ForgotPasswordPage"));

// Lazy load survey pages for performance
const AIFundamentalsLanding = lazy(() => import("./pages/surveys/AIFundamentalsLanding"));
// Note: PreSurvey, PostSurvey, Lesson will be added when implemented
// const PreSurvey = lazy(() => import("./pages/surveys/PreSurvey"));
// const PostSurvey = lazy(() => import("./pages/surveys/PostSurvey"));
// const Lesson = lazy(() => import("./pages/surveys/Lesson"));

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

// Simple Error Boundary component
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Something went wrong with the blog</h2>
            <p className="text-muted-foreground">{this.state.error?.message}</p>
            <p className="text-sm text-muted-foreground">Please try refreshing the page.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Analytics />
      <AuthProvider>
        <BrowserRouter 
          future={{
            v7_startTransition: true,
          }}
          basename={undefined}
        >
          <ScrollToTop />
          <Layout>
            <Routes>
              {/* Public routes - no authentication required */}
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/modeladvisor" element={<ModelAdvisor />} />
              
              {/* Blog routes with error boundaries */}
              <Route 
                path="/blog" 
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<div className="container mx-auto px-4 py-8 text-center">Loading blog...</div>}>
                      <Blog />
                    </Suspense>
                  </ErrorBoundary>
                } 
              />
              <Route 
                path="/blog/:slug" 
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<div className="container mx-auto px-4 py-8 text-center">Loading article...</div>}>
                      <Article />
                    </Suspense>
                  </ErrorBoundary>
                } 
              />

              {/* Authentication routes - public access */}
              <Route 
                path="/signin" 
                element={
                  <Suspense fallback={<div className="min-h-screen bg-brand-neutral-50 flex items-center justify-center">Loading...</div>}>
                    <SignInPage />
                  </Suspense>
                } 
              />
              <Route 
                path="/signup" 
                element={
                  <Suspense fallback={<div className="min-h-screen bg-brand-neutral-50 flex items-center justify-center">Loading...</div>}>
                    <SignUpPage />
                  </Suspense>
                } 
              />
              <Route 
                path="/forgot-password" 
                element={
                  <Suspense fallback={<div className="min-h-screen bg-brand-neutral-50 flex items-center justify-center">Loading...</div>}>
                    <ForgotPasswordPage />
                  </Suspense>
                } 
              />

              {/* AI Fundamentals Survey routes */}
              <Route 
                path="/ai-fundamentals" 
                element={
                  <Suspense fallback={<div className="min-h-screen bg-brand-neutral-50 flex items-center justify-center">Loading...</div>}>
                    <AIFundamentalsLanding />
                  </Suspense>
                } 
              />
              
              {/* Protected survey routes - require authentication */}
              {/* TODO: Uncomment when survey pages are implemented
              <Route 
                path="/ai-fundamentals/pre-survey" 
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<div className="min-h-screen bg-brand-neutral-50 flex items-center justify-center">Loading...</div>}>
                      <PreSurvey />
                    </Suspense>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/ai-fundamentals/post-survey" 
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<div className="min-h-screen bg-brand-neutral-50 flex items-center justify-center">Loading...</div>}>
                      <PostSurvey />
                    </Suspense>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/ai-fundamentals/lesson" 
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<div className="min-h-screen bg-brand-neutral-50 flex items-center justify-center">Loading...</div>}>
                      <Lesson />
                    </Suspense>
                  </ProtectedRoute>
                } 
              />
              */}

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

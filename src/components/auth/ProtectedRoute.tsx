import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Lock, AlertCircle } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  fallbackPath?: string;
}

export const ProtectedRoute = ({ children, fallbackPath = '/signin' }: ProtectedRouteProps) => {
  const { user, loading, initialized, available } = useAuth();
  const location = useLocation();

  // Show loading state while auth system initializes
  if (!initialized || loading) {
    return (
      <div className="min-h-screen bg-brand-neutral-50 flex items-center justify-center">
        <div className="text-brand-neutral-500">Loading authentication...</div>
      </div>
    );
  }

  // Show auth unavailable message
  if (!available) {
    return (
      <div className="min-h-screen bg-brand-neutral-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-brand-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-brand-warning" />
            </div>
            <CardTitle className="text-brand-neutral-700">Authentication Unavailable</CardTitle>
            <p className="text-brand-neutral-500 text-sm">
              The authentication service is currently unavailable. This feature requires user authentication to function properly.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/ai-fundamentals">
              <Button variant="outline" className="w-full">
                Return to AI Fundamentals
              </Button>
            </Link>
            <Link to="/">
              <Button variant="ghost" className="w-full">
                Go Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Redirect to sign in if not authenticated
  if (!user) {
    const returnTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`${fallbackPath}?returnTo=${returnTo}`} replace />;
  }

  // User is authenticated and auth system is available
  return <>{children}</>;
};

// Alternative component for displaying auth requirements without redirecting
export const AuthRequired = ({ children }: { children: ReactNode }) => {
  const { user, loading, initialized, available } = useAuth();

  if (!initialized || loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-brand-neutral-500">Loading...</div>
      </div>
    );
  }

  if (!available) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-brand-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-brand-warning" />
          </div>
          <CardTitle className="text-brand-neutral-700">Authentication Required</CardTitle>
          <p className="text-brand-neutral-500 text-sm">
            This feature requires authentication, but the service is currently unavailable.
          </p>
        </CardHeader>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-brand-primary" />
          </div>
          <CardTitle className="text-brand-neutral-700">Sign In Required</CardTitle>
          <p className="text-brand-neutral-500 text-sm">
            Please sign in to access this feature and track your progress.
          </p>
        </CardHeader>
        <CardContent>
          <Link to="/signin">
            <Button className="w-full bg-brand-primary hover:bg-brand-primary/90 text-brand-neutral-50">
              Sign In
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
};
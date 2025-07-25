import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { isAppSubdomain } from '@/lib/domain-check';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

interface DomainProtectedRouteProps {
  children: ReactNode;
}

/**
 * Component that restricts access to app.drelsolutions subdomain only
 * Shows access denied message for other domains
 */
export const DomainProtectedRoute = ({ children }: DomainProtectedRouteProps) => {
  // Block access if not on app subdomain
  if (!isAppSubdomain()) {
    return (
      <div className="min-h-screen bg-brand-neutral-50">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-brand-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-brand-warning" />
              </div>
              <CardTitle className="text-2xl text-brand-neutral-700">
                Access Restricted
              </CardTitle>
              <p className="text-brand-neutral-500">
                This feature is only available on the Drel Solutions app platform.
              </p>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/">
                <Button className="bg-brand-primary hover:bg-brand-primary/90 text-brand-neutral-50">
                  Return Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Allow access if on correct subdomain
  return <>{children}</>;
};
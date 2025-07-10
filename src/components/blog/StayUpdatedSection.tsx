import { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface StayUpdatedSectionProps {
  onSignup: (email: string) => Promise<void>;
}

export const StayUpdatedSection = ({ onSignup }: StayUpdatedSectionProps) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    try {
      await onSignup(email);
      setEmail('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-gradient-card shadow-card">
      <CardContent className="p-8 text-center space-y-6">
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold">Stay Updated</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get the latest insights on workflow optimization and process automation 
            delivered straight to your inbox. Join our community of forward-thinking professionals.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
              required
            />
            <Button 
              type="submit" 
              disabled={isLoading}
              className="shadow-card hover:shadow-card-hover"
            >
              {isLoading ? 'Subscribing...' : (
                <>
                  Subscribe
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </form>

        <p className="text-sm text-muted-foreground">
          No spam, unsubscribe at any time. We respect your privacy.
        </p>
      </CardContent>
    </Card>
  );
};
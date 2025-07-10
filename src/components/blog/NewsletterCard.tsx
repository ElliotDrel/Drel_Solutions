import { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface NewsletterCardProps {
  onSignup: (email: string) => Promise<void>;
}

export const NewsletterCard = ({ onSignup }: NewsletterCardProps) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      await onSignup(email);
      setEmail('');
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 bg-gradient-hero text-primary-foreground h-full flex flex-col">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-primary-foreground/20 rounded-full flex items-center justify-center mb-4">
          <Mail className="h-6 w-6" />
        </div>
        <CardTitle className="text-xl">Stay Updated</CardTitle>
        <p className="text-primary-foreground/80 text-sm">
          Get the latest insights on workflow optimization and process automation delivered to your inbox.
        </p>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col justify-end">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 focus:border-primary-foreground focus:ring-primary-foreground"
              disabled={isLoading}
            />
            {error && (
              <p className="text-xs text-primary-foreground/80 bg-primary-foreground/10 p-2 rounded">
                {error}
              </p>
            )}
          </div>
          
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 transition-colors"
          >
            {isLoading ? (
              'Subscribing...'
            ) : (
              <>
                Subscribe
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase, isSupabaseAvailable } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const ForgotPasswordPage = () => {
  const { toast } = useToast();
  const { available, initialized } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Show loading if auth system not ready
  if (!initialized) {
    return (
      <div className="min-h-screen bg-brand-neutral-50 flex items-center justify-center p-4">
        <div className="text-brand-neutral-500">Loading authentication...</div>
      </div>
    );
  }

  // Show message if auth not available
  if (!available) {
    return (
      <div className="min-h-screen bg-brand-neutral-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-brand-neutral-700">
              Authentication Unavailable
            </CardTitle>
            <p className="text-brand-neutral-500">
              Authentication service is currently unavailable. Please check your configuration.
            </p>
          </CardHeader>
          <CardContent>
            <Link to="/">
              <Button className="w-full">Return Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Missing Information",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    if (!isSupabaseAvailable() || !supabase) {
      toast({
        title: "Service Unavailable",
        description: "Password reset is currently unavailable.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const redirectUrl = `${window.location.origin}/reset-password`;
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setEmailSent(true);
      toast({
        title: "Reset Email Sent!",
        description: "Check your email for a password reset link.",
      });
    }
    setLoading(false);
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-brand-neutral-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-brand-primary">
              Check Your Email
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-brand-neutral-600">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="text-sm text-brand-neutral-500">
              Check your email and click the link to reset your password.
            </p>
            <Link to="/signin">
              <Button variant="outline" className="w-full">
                Back to Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-neutral-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-brand-primary">
            Reset Password
          </CardTitle>
          <p className="text-brand-neutral-500">
            Enter your email to receive a password reset link
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-brand-primary hover:bg-brand-primary/90 text-brand-neutral-50" 
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <Link to="/signin" className="text-brand-primary hover:underline">
              Back to Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
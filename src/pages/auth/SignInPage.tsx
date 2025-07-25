import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const SignInPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, available, initialized } = useAuth();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

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

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        toast({
          title: "Account Not Found",
          description: "No account found with this email. Would you like to create one?",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sign In Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } else {
      // Navigate to AI Fundamentals landing page after successful sign-in
      const returnTo = searchParams.get('returnTo') || '/ai-fundamentals';
      navigate(returnTo);
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-brand-neutral-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-brand-primary">
            Sign In
          </CardTitle>
          <p className="text-brand-neutral-500">
            Sign in to access AI Fundamentals Survey
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
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
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-brand-primary hover:bg-brand-primary/90 text-brand-neutral-50" 
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
          
          <div className="mt-6 space-y-2 text-center text-sm">
            <Link 
              to="/forgot-password" 
              className="text-brand-primary hover:underline block"
            >
              Forgot your password?
            </Link>
            <p className="text-brand-neutral-500">
              Don't have an account?{" "}
              <Link to="/signup" className="text-brand-primary hover:underline">
                Create one here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignInPage;
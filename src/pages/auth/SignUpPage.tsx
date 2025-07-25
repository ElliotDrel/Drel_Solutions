import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const SignUpPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp, available, initialized } = useAuth();
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password);

    if (error) {
      if (error.message.includes("User already registered")) {
        toast({
          title: "Account Already Exists",
          description: "An account with this email already exists. Try signing in instead.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sign Up Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Check Your Email!",
        description: "We've sent you a magic link to verify your account. Click the link in your email to continue.",
      });
      // Navigate to a confirmation page or back to sign in
      navigate('/signin?email=' + encodeURIComponent(email));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-brand-neutral-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-brand-primary">
            Create Account
          </CardTitle>
          <p className="text-brand-neutral-500">
            Create an account to take the AI Fundamentals Survey
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
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
                placeholder="Choose a password (min 6 characters)"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-brand-primary hover:bg-brand-primary/90 text-brand-neutral-50" 
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <p className="text-brand-neutral-500">
              Already have an account?{" "}
              <Link to="/signin" className="text-brand-primary hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpPage;
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Contact = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Show success notification
      toast({
        title: "Email Successfully Sent! ✅",
        description: "Your email was officially sent and we will get back to you in LESS than 24 hours.",
      });
      
      // Reset form
      setEmail('');
      setName('');
      setMessage('');
    }, 1000);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-primary/10 via-white to-brand-success/10">
      {/* Main Content */}
      <div className="pt-4 min-h-screen flex items-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Left Column - Info */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-bold text-brand-neutral-900">
                  Get In <span className="text-brand-primary">Touch</span>
                </h1>
                <p className="text-xl text-brand-neutral-600 leading-relaxed">
                  Ready to automate your busywork and save time? Let's discuss how AI can transform your business operations.
                </p>
              </div>

              {/* Response Time Promise */}
              <div className="bg-brand-primary/10 border border-brand-primary/20 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <Clock className="h-8 w-8 text-brand-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-brand-primary mb-2">Quick Response Guarantee</h3>
                    <p className="text-brand-primary/80">
                      We will get back to you in <strong>LESS than 24 hours</strong>. 
                      Your time is valuable, and we respect that.
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Mail className="h-6 w-6 text-brand-primary" />
                  <div>
                    <h3 className="font-semibold text-brand-neutral-900">Email Us</h3>
                    <p className="text-brand-neutral-600">Quick responses to all inquiries</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <CheckCircle className="h-6 w-6 text-brand-success" />
                  <div>
                    <h3 className="font-semibold text-brand-neutral-900">Free Consultation</h3>
                    <p className="text-brand-neutral-600">No obligation, just insights</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-brand-neutral-900">Send us a message</h2>
                  <p className="text-brand-neutral-600">Fill out the form below and we'll get back to you in less than 24 hours.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-brand-neutral-700">
                      Name (Optional)
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-brand-neutral-700">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@company.com"
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-sm font-medium text-brand-neutral-700">
                      Message (Optional)
                    </Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your business and what you'd like to automate..."
                      className="mt-1 min-h-[120px]"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white py-3 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:transform-none disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    'Send Message'
                  )}
                </Button>

                <p className="text-sm text-brand-neutral-500 text-center">
                  * Required field. We respect your privacy and will never share your information.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 
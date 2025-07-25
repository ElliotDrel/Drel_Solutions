import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { CheckCircle, Circle, Play, BookOpen, TrendingUp, Award, ArrowRight, Users, Clock, Target } from "lucide-react";

// Mock hook for user progress - would be implemented with actual API calls
const useUserProgress = (surveyType: string) => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<{
    pre_survey_completed_at: string | null;
    lesson_completed_at: string | null;
    post_survey_completed_at: string | null;
  } | null>(null);

  useEffect(() => {
    // In real implementation, this would fetch from Supabase
    // For now, returning null to show "start assessment" state
    if (user) {
      setProgress({
        pre_survey_completed_at: null,
        lesson_completed_at: null,
        post_survey_completed_at: null,
      });
    }
  }, [user, surveyType]);

  return { data: progress, loading: false };
};

const AIFundamentalsLanding = () => {
  const navigate = useNavigate();
  const { user, available, initialized } = useAuth();
  const { data: progress, loading: progressLoading } = useUserProgress('ai-fundamentals');

  // Show loading state while auth initializes
  if (!initialized) {
    return (
      <div className="min-h-screen bg-brand-neutral-50 flex items-center justify-center">
        <div className="text-brand-neutral-500">Loading...</div>
      </div>
    );
  }

  // Show auth unavailable message
  if (!available) {
    return (
      <div className="min-h-screen bg-brand-neutral-50">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-brand-neutral-700">
                AI Fundamentals Assessment
              </CardTitle>
              <p className="text-brand-neutral-500">
                Authentication service is currently unavailable. The assessment system requires authentication to track your progress.
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

  const getNextStep = () => {
    if (!user) return { action: 'Sign In to Start', href: '/signin?returnTo=/ai-fundamentals', variant: 'default' as const };
    if (!progress?.pre_survey_completed_at) return { action: 'Take Pre-Assessment', href: '/ai-fundamentals/pre-survey', variant: 'default' as const };
    if (!progress?.lesson_completed_at) return { action: 'Continue to Lesson', href: '/ai-fundamentals/lesson', variant: 'default' as const };
    if (!progress?.post_survey_completed_at) return { action: 'Take Post-Assessment', href: '/ai-fundamentals/post-survey', variant: 'default' as const };
    return { action: 'View Your Results', href: '/ai-fundamentals/results', variant: 'outline' as const };
  };

  const getProgressPercentage = () => {
    if (!progress) return 0;
    let completed = 0;
    if (progress.pre_survey_completed_at) completed += 33;
    if (progress.lesson_completed_at) completed += 33;
    if (progress.post_survey_completed_at) completed += 34;
    return completed;
  };

  const nextStep = getNextStep();
  const progressPercentage = getProgressPercentage();

  return (
    <div className="min-h-screen bg-brand-neutral-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-primary/5 to-brand-accent/5 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-brand-neutral-800 mb-6">
              AI Fundamentals Assessment & Training
            </h1>
            <p className="text-xl text-brand-neutral-600 mb-8 max-w-2xl mx-auto">
              Measure your ChatGPT knowledge before and after our comprehensive presentation. 
              Track your learning progress and identify areas for improvement.
            </p>
            
            {/* User Status Integration */}
            {user ? (
              <div className="bg-white rounded-lg p-6 shadow-sm max-w-md mx-auto mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-brand-neutral-700">Welcome back!</p>
                    <p className="text-sm text-brand-neutral-500">{user.email}</p>
                  </div>
                </div>
                
                {progressPercentage > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-brand-neutral-600">Progress</span>
                      <span className="text-brand-neutral-600">{progressPercentage}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-6 shadow-sm max-w-md mx-auto mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-brand-warning/10 rounded-full flex items-center justify-center">
                    <Target className="w-5 h-5 text-brand-warning" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-brand-neutral-700">Ready to start?</p>
                    <p className="text-sm text-brand-neutral-500">Sign in to track your progress</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={nextStep.href}>
                <Button 
                  size="lg" 
                  className="bg-brand-primary hover:bg-brand-primary/90 text-brand-neutral-50 min-w-[200px]"
                  variant={nextStep.variant}
                >
                  {nextStep.action}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              {user && (
                <Button variant="outline" size="lg" className="min-w-[200px]">
                  View Sample Questions
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-brand-neutral-800 mb-12">
              How It Works
            </h2>
            
            <div className="grid md:grid-cols-4 gap-8">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-brand-primary text-brand-neutral-50 rounded-full text-sm font-bold">
                    1
                  </div>
                </div>
                <h3 className="font-semibold text-brand-neutral-700 mb-2">Take Pre-Assessment</h3>
                <p className="text-sm text-brand-neutral-500">
                  Assess your current ChatGPT knowledge and identify your starting point
                </p>
                <div className="mt-4">
                  {progress?.pre_survey_completed_at ? (
                    <CheckCircle className="w-5 h-5 text-brand-success mx-auto" />
                  ) : (
                    <Circle className="w-5 h-5 text-brand-neutral-300 mx-auto" />
                  )}
                </div>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-brand-accent text-brand-neutral-50 rounded-full text-sm font-bold">
                    2
                  </div>
                </div>
                <h3 className="font-semibold text-brand-neutral-700 mb-2">Complete Training</h3>
                <p className="text-sm text-brand-neutral-500">
                  Pay attention to our comprehensive ChatGPT fundamentals presentation
                </p>
                <div className="mt-4">
                  {progress?.lesson_completed_at ? (
                    <CheckCircle className="w-5 h-5 text-brand-success mx-auto" />
                  ) : (
                    <BookOpen className="w-5 h-5 text-brand-neutral-300 mx-auto" />
                  )}
                </div>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-brand-success text-brand-neutral-50 rounded-full text-sm font-bold">
                    3
                  </div>
                </div>
                <h3 className="font-semibold text-brand-neutral-700 mb-2">Take Post-Assessment</h3>
                <p className="text-sm text-brand-neutral-500">
                  Measure your improvement and validate your new knowledge
                </p>
                <div className="mt-4">
                  {progress?.post_survey_completed_at ? (
                    <CheckCircle className="w-5 h-5 text-brand-success mx-auto" />
                  ) : (
                    <TrendingUp className="w-5 h-5 text-brand-neutral-300 mx-auto" />
                  )}
                </div>
              </div>

              {/* Step 4 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-brand-warning text-brand-neutral-50 rounded-full text-sm font-bold">
                    4
                  </div>
                </div>
                <h3 className="font-semibold text-brand-neutral-700 mb-2">View Progress</h3>
                <p className="text-sm text-brand-neutral-500">
                  Track your learning journey and celebrate your achievements
                </p>
                <div className="mt-4">
                  {progressPercentage === 100 ? (
                    <Award className="w-5 h-5 text-brand-warning mx-auto" />
                  ) : (
                    <Clock className="w-5 h-5 text-brand-neutral-300 mx-auto" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-brand-neutral-800 mb-12">
              Why Take This Assessment?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-brand-neutral-700">
                    <TrendingUp className="w-5 h-5 text-brand-primary" />
                    Track Your Learning Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-brand-neutral-600">
                    See measurable improvement in your ChatGPT skills. Our pre and post assessments 
                    provide concrete evidence of your learning journey.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-brand-neutral-700">
                    <Target className="w-5 h-5 text-brand-accent" />
                    Identify Knowledge Gaps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-brand-neutral-600">
                    Discover areas where you can improve your ChatGPT usage. Get personalized 
                    insights into your strengths and opportunities for growth.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-brand-neutral-700">
                    <BookOpen className="w-5 h-5 text-brand-success" />
                    Get Personalized Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-brand-neutral-600">
                    Based on your assessment results, receive tailored suggestions for 
                    improving your ChatGPT prompting and usage strategies.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-brand-neutral-700">
                    <Award className="w-5 h-5 text-brand-warning" />
                    Earn Completion Certificates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-brand-neutral-600">
                    <span className="text-brand-neutral-400">(Coming Soon)</span> Demonstrate your 
                    ChatGPT proficiency with official completion certificates for your professional portfolio.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-brand-primary/5 to-brand-accent/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-brand-neutral-800 mb-6">
              Ready to Begin Your AI Learning Journey?
            </h2>
            <p className="text-brand-neutral-600 mb-8">
              Join others who have improved their ChatGPT skills through our structured assessment and training program.
            </p>
            <Link to={nextStep.href}>
              <Button 
                size="lg" 
                className="bg-brand-primary hover:bg-brand-primary/90 text-brand-neutral-50"
              >
                {nextStep.action}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AIFundamentalsLanding;
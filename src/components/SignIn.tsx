
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail, Brain } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface SignInProps {
  onSignIn: (user: any) => void;
  onBack: () => void;
}

export const SignIn = ({ onSignIn, onBack }: SignInProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    
    try {
      // Check if Google Sign-In is available
      if (typeof window !== 'undefined' && window.google) {
        // Real Google Sign-In would go here
        console.log("Google Sign-In API available");
      }
      
      // For now, simulate the sign-in process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a more realistic mock user
      const mockUser = {
        id: `user_${Date.now()}`,
        name: "Demo User",
        email: "demo@neuroask.com",
        picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
        provider: "google",
        joinedAt: new Date().toISOString()
      };
      
      toast({
        title: "Welcome to Neuro Ask!",
        description: `Successfully signed in as ${mockUser.name}`,
      });
      
      onSignIn(mockUser);
    } catch (error) {
      console.error("Sign-in error:", error);
      toast({
        title: "Sign In Failed",
        description: "Unable to sign in at the moment. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button variant="ghost" onClick={onBack} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Neuro Ask
              </span>
            </div>
          </div>
        </div>

        {/* Sign In Form */}
        <div className="max-w-md mx-auto mt-20">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Welcome to Neuro Ask</CardTitle>
              <CardDescription className="text-base">
                Sign in to start practicing your interview skills with AI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full h-12 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                size="lg"
              >
                <Mail className="h-5 w-5 mr-3" />
                {isLoading ? "Signing in..." : "Continue with Google"}
              </Button>
              
              <div className="text-center text-sm text-gray-600">
                <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
                <p className="mt-2 text-xs text-blue-600">
                  Note: This is a demo. In production, real Google OAuth would be integrated.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Preview */}
        <div className="max-w-4xl mx-auto mt-16 grid md:grid-cols-3 gap-6">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">AI-Powered Interviews</h3>
            <p className="text-sm text-gray-600">Practice with intelligent AI that adapts to your responses</p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">Multiple Formats</h3>
            <p className="text-sm text-gray-600">Choose between voice and text-based interviews</p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Instant Feedback</h3>
            <p className="text-sm text-gray-600">Get detailed analysis and improvement suggestions</p>
          </div>
        </div>
      </div>
    </div>
  );
};


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
      // Simulate Google Sign In - In production, you'd integrate with Google OAuth
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockUser = {
        id: "1",
        name: "John Doe",
        email: "john.doe@example.com",
        picture: "https://via.placeholder.com/150",
        provider: "google"
      };
      
      toast({
        title: "Welcome to Neuro Ask!",
        description: "You have successfully signed in with Google.",
      });
      
      onSignIn(mockUser);
    } catch (error) {
      toast({
        title: "Sign In Failed",
        description: "Unable to sign in with Google. Please try again.",
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

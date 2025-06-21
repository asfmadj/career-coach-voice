import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Mic, CheckCircle, BarChart3, Users, Zap, BookOpen, Brain } from "lucide-react";
import { useState } from "react";
import { InterviewSetup } from "@/components/InterviewSetup";
import { Dashboard } from "@/components/Dashboard";
import { VoiceInterview } from "@/components/VoiceInterview";
import { TextInterview } from "@/components/TextInterview";
import { SignIn } from "@/components/SignIn";
import { UserProfile } from "@/components/UserProfile";

const Index = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'setup' | 'dashboard' | 'voice-interview' | 'text-interview' | 'signin' | 'profile'>('landing');
  const [interviewConfig, setInterviewConfig] = useState({
    industry: '',
    level: '',
    type: '',
    duration: ''
  });
  const [user, setUser] = useState<any>(null);

  const features = [
    {
      icon: <Mic className="h-8 w-8 text-blue-600" />,
      title: "AI Voice Interviewer",
      description: "Practice with our intelligent AI interviewer that adapts to your responses and provides natural conversation flow."
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-600" />,
      title: "Text-Based Interview",
      description: "Chat with our AI interviewer through text messages for a comfortable interview experience."
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-green-600" />,
      title: "Instant Feedback",
      description: "Get detailed feedback on your answers, including clarity, structure, and professional communication tips."
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-orange-600" />,
      title: "Progress Tracking",
      description: "Monitor your improvement over time with detailed analytics and performance insights."
    }
  ];

  const industries = [
    "Software Engineering", "Marketing", "Finance", "Healthcare", 
    "Sales", "Consulting", "Data Science", "Design", "Operations", "HR"
  ];

  const handleInterviewComplete = (config: { industry: string; level: string; type: string; duration: string }) => {
    setInterviewConfig(config);
    setCurrentView('dashboard');
  };

  const handleStartVoiceInterview = () => {
    if (!interviewConfig.industry) {
      setCurrentView('setup');
    } else {
      setCurrentView('voice-interview');
    }
  };

  const handleStartTextInterview = () => {
    if (!interviewConfig.industry) {
      setCurrentView('setup');
    } else {
      setCurrentView('text-interview');
    }
  };

  const handleSignIn = (userData: any) => {
    setUser(userData);
    setCurrentView('dashboard');
  };

  if (currentView === 'signin') {
    return <SignIn onSignIn={handleSignIn} onBack={() => setCurrentView('landing')} />;
  }

  if (currentView === 'profile') {
    return <UserProfile user={user} onBack={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'setup') {
    return (
      <InterviewSetup 
        onBack={() => setCurrentView('landing')} 
        onComplete={handleInterviewComplete} 
      />
    );
  }

  if (currentView === 'dashboard') {
    return (
      <Dashboard 
        onBack={() => setCurrentView('landing')} 
        onStartVoiceInterview={handleStartVoiceInterview}
        onStartTextInterview={handleStartTextInterview}
        user={user}
        onProfile={() => setCurrentView('profile')}
      />
    );
  }

  if (currentView === 'voice-interview') {
    return (
      <VoiceInterview
        onBack={() => setCurrentView('dashboard')}
        onComplete={() => setCurrentView('dashboard')}
        interviewConfig={interviewConfig}
      />
    );
  }

  if (currentView === 'text-interview') {
    return (
      <TextInterview
        onBack={() => setCurrentView('dashboard')}
        onComplete={() => setCurrentView('dashboard')}
        interviewConfig={interviewConfig}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-6 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Neuro Ask
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Button variant="ghost" onClick={() => setCurrentView('profile')}>
                  {user.name || user.email}
                </Button>
                <Button onClick={() => setCurrentView('dashboard')}>Dashboard</Button>
              </div>
            ) : (
              <>
                <Button variant="ghost" onClick={() => setCurrentView('signin')}>Sign In</Button>
                <Button onClick={() => setCurrentView('setup')}>Get Started</Button>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-100">
            <Zap className="h-4 w-4 mr-1" />
            AI-Powered Interview Practice
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            Master Your Next Interview with Neuro Ask
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Practice with our intelligent AI interviewer, get instant feedback, and boost your confidence with personalized interview preparation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => user ? setCurrentView('dashboard') : setCurrentView('signin')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              Start Practicing Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline">
              <BookOpen className="mr-2 h-5 w-5" />
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Neuro Ask?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our AI-powered platform provides everything you need to excel in your next interview
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-gray-50 rounded-full w-fit">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Industries Section */}
      <section className="container mx-auto px-6 py-20 bg-white/50 rounded-3xl mx-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Practice for Any Industry</h2>
          <p className="text-lg text-gray-600">
            Tailored interview questions for your specific field and career level
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {industries.map((industry, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="px-4 py-2 text-sm bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 hover:from-blue-200 hover:to-purple-200 cursor-pointer transition-all duration-200"
            >
              {industry}
            </Badge>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Ace Your Interview?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of professionals who have improved their interview skills with Neuro Ask
          </p>
          <Button 
            size="lg" 
            onClick={() => user ? setCurrentView('dashboard') : setCurrentView('signin')}
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            Get Started for Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded"></div>
            <span className="font-semibold text-gray-800">Neuro Ask</span>
          </div>
          <p className="text-gray-600 text-sm">
            © 2024 Neuro Ask. Empowering careers through AI-powered practice.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

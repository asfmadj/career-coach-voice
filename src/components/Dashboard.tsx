
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Mic, Play, Clock, TrendingUp, Award, Calendar, BarChart3, Phone } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { RandomPractice } from "@/components/RandomPractice";
import { QuickSession } from "@/components/QuickSession";
import { SessionReview } from "@/components/SessionReview";

interface DashboardProps {
  onBack: () => void;
  onStartVoiceInterview: () => void;
  onStartTextInterview: () => void;
  user: any;
  onProfile: () => void;
  interviewConfig: {
    industry: string;
    level: string;
    type: string;
    duration: string;
  };
}

export const Dashboard = ({ onBack, onStartVoiceInterview, onStartTextInterview, user, onProfile, interviewConfig }: DashboardProps) => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'random-practice' | 'quick-session' | 'session-review'>('dashboard');
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const { toast } = useToast();

  const recentSessions = [
    {
      id: 1,
      type: "Behavioral",
      industry: interviewConfig.industry || "Software Engineering",
      date: "2024-01-15",
      score: 85,
      duration: "12 min",
      feedback: "Great use of STAR method. Your responses were well-structured and provided clear examples of your experience.",
      questions: [
        "Tell me about a time when you had to work with a difficult team member.",
        "Describe a situation where you had to meet a tight deadline.",
        "Give me an example of when you had to learn something new quickly."
      ],
      answers: [
        "I once worked with a team member who was resistant to feedback...",
        "During my last project, we had to deliver a feature in half the expected time...",
        "When I started my current role, I had to learn React Native in two weeks..."
      ]
    },
    {
      id: 2,
      type: "Technical",
      industry: interviewConfig.industry || "Software Engineering",
      date: "2024-01-14",
      score: 78,
      duration: "18 min",
      feedback: "Good problem-solving approach. Consider explaining your thought process more clearly and discussing time complexity.",
      questions: [
        "How would you implement a LRU cache?",
        "Explain the difference between REST and GraphQL.",
        "What are the benefits of using TypeScript?"
      ],
      answers: [
        "I would use a combination of a hash map and doubly linked list...",
        "REST is an architectural style while GraphQL is a query language...",
        "TypeScript provides static type checking which helps catch errors..."
      ]
    },
    {
      id: 3,
      type: "HR/Cultural",
      industry: interviewConfig.industry || "Software Engineering",
      date: "2024-01-12",
      score: 92,
      duration: "8 min",
      feedback: "Excellent cultural fit responses. You demonstrated strong alignment with company values and clear career goals.",
      questions: [
        "Why do you want to work here?",
        "Where do you see yourself in 5 years?",
        "What motivates you in your work?"
      ],
      answers: [
        "I'm excited about your company's mission to democratize technology...",
        "In 5 years, I see myself in a senior technical role...",
        "I'm motivated by solving complex problems that have real impact..."
      ]
    }
  ];

  const stats = [
    { label: "Total Sessions", value: "24", icon: <Calendar className="h-5 w-5" />, color: "blue" },
    { label: "Average Score", value: "85%", icon: <TrendingUp className="h-5 w-5" />, color: "green" },
    { label: "Hours Practiced", value: "12.5", icon: <Clock className="h-5 w-5" />, color: "purple" },
    { label: "Streak", value: "7 days", icon: <Award className="h-5 w-5" />, color: "orange" }
  ];

  const handleRandomPractice = () => {
    setCurrentView('random-practice');
  };

  const handleQuickSession = () => {
    setCurrentView('quick-session');
  };

  const handleSessionReview = (sessionId: number) => {
    setSelectedSessionId(sessionId);
    setCurrentView('session-review');
  };

  const handleTechnicalPractice = () => {
    toast({
      title: "Technical Practice",
      description: "Starting a focused technical interview session..."
    });
    onStartTextInterview();
  };

  const handleResponseStructure = () => {
    toast({
      title: "Response Structure Practice",
      description: "Starting a session focused on STAR method and clear communication..."
    });
    onStartTextInterview();
  };

  if (currentView === 'random-practice') {
    return <RandomPractice onBack={() => setCurrentView('dashboard')} interviewConfig={interviewConfig} />;
  }

  if (currentView === 'quick-session') {
    return <QuickSession onBack={() => setCurrentView('dashboard')} interviewConfig={interviewConfig} />;
  }

  if (currentView === 'session-review' && selectedSessionId) {
    const session = recentSessions.find(s => s.id === selectedSessionId);
    return <SessionReview session={session} onBack={() => setCurrentView('dashboard')} />;
  }

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
            <div>
              <h1 className="text-2xl font-bold">Interview Dashboard</h1>
              <p className="text-gray-600">Track your progress and continue practicing</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button 
              onClick={onStartVoiceInterview}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              <Phone className="h-4 w-4 mr-2" />
              Voice Interview
            </Button>
            <Button 
              onClick={onStartTextInterview}
              variant="outline"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
            >
              <Mic className="h-4 w-4 mr-2" />
              Text Interview
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-${stat.color}-100 text-${stat.color}-600`}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Sessions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Recent Practice Sessions
                </CardTitle>
                <CardDescription>
                  Your latest interview practice sessions and feedback
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentSessions.map((session) => (
                    <Card key={session.id} className="border border-gray-200 hover:shadow-md transition-shadow duration-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Badge variant="outline">{session.type}</Badge>
                            <span className="text-sm text-gray-600">{session.industry}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{session.duration}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Performance Score</span>
                          <span className="text-sm font-bold text-blue-600">{session.score}%</span>
                        </div>
                        <Progress value={session.score} className="mb-3" />
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600">{session.feedback}</p>
                          <Button variant="ghost" size="sm" onClick={() => handleSessionReview(session.id)}>
                            <Play className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Recommendations */}
          <div className="space-y-6">
            {/* Quick Start */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Start</CardTitle>
                <CardDescription>
                  Jump into a practice session
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={onStartVoiceInterview}
                  className="w-full justify-start bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Start Voice Interview
                </Button>
                <Button 
                  onClick={onStartTextInterview}
                  className="w-full justify-start" 
                  variant="outline"
                >
                  <Mic className="h-4 w-4 mr-2" />
                  Start Text Interview
                </Button>
                <Button 
                  onClick={handleRandomPractice}
                  className="w-full justify-start" 
                  variant="outline"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Random Practice Question
                </Button>
                <Button 
                  onClick={handleQuickSession}
                  className="w-full justify-start" 
                  variant="outline"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  5-Minute Quick Session
                </Button>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Recommendations</CardTitle>
                <CardDescription className="text-blue-600">
                  Based on your recent performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded-lg border border-blue-200 cursor-pointer hover:shadow-md transition-shadow" onClick={handleTechnicalPractice}>
                    <p className="text-sm font-medium text-blue-800 mb-1">Practice Technical Questions</p>
                    <p className="text-xs text-blue-600">Your technical scores could improve with more practice</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-blue-200 cursor-pointer hover:shadow-md transition-shadow" onClick={handleResponseStructure}>
                    <p className="text-sm font-medium text-blue-800 mb-1">Work on Response Structure</p>
                    <p className="text-xs text-blue-600">Focus on clear, organized answers using frameworks</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress Goal */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Goal</CardTitle>
                <CardDescription>
                  5 practice sessions this week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={60} className="mb-2" />
                <p className="text-sm text-gray-600">3 of 5 sessions completed</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

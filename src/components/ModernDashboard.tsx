
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Mic, 
  MessageSquare, 
  Brain, 
  TrendingUp, 
  Award, 
  Calendar, 
  Clock, 
  Users, 
  BarChart3,
  Zap,
  Target,
  Phone,
  Play,
  User,
  Settings,
  LogOut
} from "lucide-react";
import { useState, useEffect } from "react";

interface ModernDashboardProps {
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

export const ModernDashboard = ({ 
  onBack, 
  onStartVoiceInterview, 
  onStartTextInterview, 
  user, 
  onProfile, 
  interviewConfig 
}: ModernDashboardProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const practiceAreas = [
    {
      id: 1,
      title: "Behavioral",
      members: 12,
      icon: <Users className="h-6 w-6" />,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      description: "STAR method & situational questions"
    },
    {
      id: 2,
      title: "Technical",
      members: 8,
      icon: <Brain className="h-6 w-6" />,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      description: "Coding & system design interviews"
    },
    {
      id: 3,
      title: "HR & Cultural",
      members: 15,
      icon: <Target className="h-6 w-6" />,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      description: "Company fit & culture alignment"
    },
    {
      id: 4,
      title: "Leadership",
      members: 6,
      icon: <Award className="h-6 w-6" />,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-500/10",
      description: "Management & team leadership"
    },
    {
      id: 5,
      title: "Case Studies",
      members: 10,
      icon: <BarChart3 className="h-6 w-6" />,
      color: "from-indigo-500 to-purple-500",
      bgColor: "bg-indigo-500/10",
      description: "Business analysis & problem solving"
    },
    {
      id: 6,
      title: "Industry Specific",
      members: 20,
      icon: <Zap className="h-6 w-6" />,
      color: "from-teal-500 to-blue-500",
      bgColor: "bg-teal-500/10",
      description: "Domain expertise questions"
    }
  ];

  const recentSessions = [
    { id: 1, name: "Sarah Chen", role: "Technical Lead", score: 92, avatar: "SC" },
    { id: 2, name: "Mike Johnson", role: "Product Manager", score: 88, avatar: "MJ" },
    { id: 3, name: "Alex Rivera", role: "UX Designer", score: 85, avatar: "AR" },
    { id: 4, name: "Emily Davis", role: "Data Scientist", score: 90, avatar: "ED" }
  ];

  const stats = [
    { label: "Sessions", value: "24", icon: <Calendar className="h-5 w-5" /> },
    { label: "Score", value: "85%", icon: <TrendingUp className="h-5 w-5" /> },
    { label: "Hours", value: "12.5", icon: <Clock className="h-5 w-5" /> },
    { label: "Streak", value: "7", icon: <Award className="h-5 w-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-2xl animate-float"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="backdrop-blur-md bg-white/5 border-b border-white/10 sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Left Section */}
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  onClick={onBack}
                  className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <div className="h-6 w-px bg-white/20"></div>
                <h1 className="text-xl font-bold text-white">NeuroAsk Dashboard</h1>
              </div>

              {/* Center - Current Session */}
              <div className="hidden md:flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white/90 text-sm font-medium">Practice Session Active</span>
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                  {interviewConfig.industry || "Software Engineering"}
                </Badge>
              </div>

              {/* Right Section */}
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-white/90 text-sm font-medium">{user?.name || "Welcome Back"}</p>
                  <p className="text-white/60 text-xs">
                    {currentTime.toLocaleDateString()} • {currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold cursor-pointer hover:scale-105 transition-transform duration-200"
                     onClick={onProfile}>
                  {user?.name?.[0] || "U"}
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-6 py-8">
          {/* Quick Actions */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Quick Start</h2>
                <p className="text-white/70">Choose your interview practice mode</p>
              </div>
              <div className="flex space-x-3 mt-4 lg:mt-0">
                <Button 
                  onClick={onStartVoiceInterview}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Voice Interview
                </Button>
                <Button 
                  onClick={onStartTextInterview}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Text Interview
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/70 text-sm mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                      </div>
                      <div className="p-2 bg-white/10 rounded-lg text-white/80">
                        {stat.icon}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Practice Areas */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Practice Areas</h3>
                <Badge className="bg-white/10 text-white/80 border-white/20">
                  6 Categories
                </Badge>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {practiceAreas.map((area, index) => (
                  <Card 
                    key={area.id} 
                    className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${area.color} ${area.bgColor} backdrop-blur-sm`}>
                          <div className="text-white">
                            {area.icon}
                          </div>
                        </div>
                        <Badge className="bg-white/10 text-white/80 border-white/20 text-xs">
                          {area.members} sessions
                        </Badge>
                      </div>
                      <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors duration-200">
                        {area.title}
                      </h4>
                      <p className="text-white/60 text-sm leading-relaxed">
                        {area.description}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex -space-x-2">
                          {[1, 2, 3].map((i) => (
                            <div 
                              key={i} 
                              className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full border-2 border-white/20 flex items-center justify-center text-xs text-white font-medium"
                            >
                              {i}
                            </div>
                          ))}
                          <div className="w-6 h-6 bg-white/20 rounded-full border-2 border-white/20 flex items-center justify-center text-xs text-white/60">
                            +
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-white/80 hover:text-white hover:bg-white/10 p-2 h-8 w-8"
                          onClick={onStartTextInterview}
                        >
                          <Play className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Recent Activity & Profile */}
            <div className="space-y-6">
              {/* User Profile Card */}
              <Card className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white shadow-xl">
                    {user?.name?.[0] || "U"}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {user?.name || "Guest User"}
                  </h3>
                  <p className="text-white/60 text-sm mb-4">
                    {interviewConfig.level || "Software Engineer"}
                  </p>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-white/80 hover:text-white hover:bg-white/10 flex-1"
                      onClick={onProfile}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-white/80 hover:text-white hover:bg-white/10 p-2"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Sessions */}
              <Card className="bg-white/10 backdrop-blur-md border border-white/20">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Recent Sessions</h3>
                  <div className="space-y-3">
                    {recentSessions.map((session) => (
                      <div key={session.id} className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 cursor-pointer group">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-blue-400 flex items-center justify-center text-sm font-semibold text-white">
                          {session.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium text-sm truncate group-hover:text-blue-300 transition-colors duration-200">
                            {session.name}
                          </p>
                          <p className="text-white/60 text-xs truncate">{session.role}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-green-400 font-semibold text-sm">{session.score}%</p>
                          <div className="w-12 h-1 bg-white/20 rounded-full mt-1">
                            <div 
                              className="h-full bg-gradient-to-r from-green-400 to-blue-400 rounded-full transition-all duration-300"
                              style={{ width: `${session.score}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button 
                    variant="ghost" 
                    className="w-full mt-4 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
                  >
                    View All Sessions
                  </Button>
                </CardContent>
              </Card>

              {/* Progress Goal */}
              <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md border border-purple-500/30">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Weekly Goal</h3>
                  <p className="text-white/70 text-sm mb-4">5 practice sessions this week</p>
                  <Progress value={60} className="mb-3 bg-white/20" />
                  <div className="flex justify-between items-center">
                    <span className="text-white/80 text-sm">3 of 5 completed</span>
                    <Badge className="bg-purple-500/30 text-purple-200 border-purple-500/40">
                      60%
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Mail, Calendar, Award, TrendingUp, Brain } from "lucide-react";
import { useState } from "react";

interface UserProfileProps {
  user: any;
  onBack: () => void;
}

export const UserProfile = ({ user, onBack }: UserProfileProps) => {
  const [stats] = useState({
    totalInterviews: 12,
    averageScore: 85,
    improvementRate: "+15%",
    favoriteIndustry: "Software Engineering"
  });

  const recentInterviews = [
    { date: "2024-06-20", type: "Technical", industry: "Software Engineering", score: 88 },
    { date: "2024-06-19", type: "Behavioral", industry: "Marketing", score: 82 },
    { date: "2024-06-18", type: "Technical", industry: "Data Science", score: 90 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-2xl animate-float"></div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={onBack} 
                className="mr-4 text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">User Profile</h1>
                  <p className="text-white/70">Manage your account and view your progress</p>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Profile Info */}
            <Card className="mb-8 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <User className="h-5 w-5 mr-2" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <User className="h-10 w-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white">{user?.name || "User"}</h3>
                    <div className="flex items-center text-white/70 mt-1">
                      <Mail className="h-4 w-4 mr-2" />
                      {user?.email || "user@example.com"}
                    </div>
                    <div className="flex items-center text-white/70 mt-1">
                      <Calendar className="h-4 w-4 mr-2" />
                      Member since June 2024
                    </div>
                  </div>
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                    Active
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-blue-400">{stats.totalInterviews}</div>
                  <div className="text-sm text-white/70">Total Interviews</div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="text-2xl font-bold text-green-400">{stats.averageScore}%</div>
                  <div className="text-sm text-white/70">Average Score</div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="h-6 w-6 text-purple-400" />
                  </div>
                  <div className="text-2xl font-bold text-purple-400">{stats.improvementRate}</div>
                  <div className="text-sm text-white/70">Improvement</div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="h-6 w-6 text-orange-400" />
                  </div>
                  <div className="text-sm font-semibold text-orange-400">{stats.favoriteIndustry}</div>
                  <div className="text-sm text-white/70">Top Industry</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Interviews */}
            <Card className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white">Recent Interview Sessions</CardTitle>
                <CardDescription className="text-white/70">Your latest practice sessions and scores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentInterviews.map((interview, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                          <Award className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <div className="font-medium text-white">{interview.type} Interview</div>
                          <div className="text-sm text-white/70">{interview.industry}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-400">{interview.score}%</div>
                        <div className="text-sm text-white/70">{interview.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

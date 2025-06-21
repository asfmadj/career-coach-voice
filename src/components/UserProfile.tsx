
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Mail, Calendar, Award, TrendingUp } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button variant="ghost" onClick={onBack} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold">User Profile</h1>
              <p className="text-gray-600">Manage your account and view your progress</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Profile Info */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{user?.name || "User"}</h3>
                  <div className="flex items-center text-gray-600 mt-1">
                    <Mail className="h-4 w-4 mr-2" />
                    {user?.email || "user@example.com"}
                  </div>
                  <div className="flex items-center text-gray-600 mt-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    Member since June 2024
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  Active
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-600">{stats.totalInterviews}</div>
                <div className="text-sm text-gray-600">Total Interviews</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-600">{stats.averageScore}%</div>
                <div className="text-sm text-gray-600">Average Score</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-purple-600">{stats.improvementRate}</div>
                <div className="text-sm text-gray-600">Improvement</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="h-6 w-6 text-orange-600" />
                </div>
                <div className="text-sm font-semibold text-orange-600">{stats.favoriteIndustry}</div>
                <div className="text-sm text-gray-600">Top Industry</div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Interviews */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Interview Sessions</CardTitle>
              <CardDescription>Your latest practice sessions and scores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentInterviews.map((interview, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Award className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{interview.type} Interview</div>
                        <div className="text-sm text-gray-600">{interview.industry}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">{interview.score}%</div>
                      <div className="text-sm text-gray-600">{interview.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

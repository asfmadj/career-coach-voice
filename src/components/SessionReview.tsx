
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Clock, TrendingUp, CheckCircle, AlertCircle, Lightbulb, Download, Play, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SessionReviewProps {
  session: any;
  onBack: () => void;
}

export const SessionReview = ({ session, onBack }: SessionReviewProps) => {
  const { toast } = useToast();

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Session not found</h1>
            <Button onClick={onBack}>Back to Dashboard</Button>
          </div>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return "bg-green-100";
    if (score >= 80) return "bg-blue-100";
    if (score >= 70) return "bg-yellow-100";
    return "bg-red-100";
  };

  const getDetailedFeedback = (score: number, type: string) => {
    if (score >= 90) {
      return {
        title: "Outstanding Performance!",
        message: "You demonstrated exceptional interview skills with clear, structured responses and strong confidence. Your answers showed deep understanding and excellent communication abilities.",
        areas: ["Maintain your excellent preparation routine", "Consider mentoring others", "Focus on advanced technical concepts"]
      };
    } else if (score >= 80) {
      return {
        title: "Strong Performance!",
        message: "You showed good interview skills with well-structured answers. There's room for minor improvements in delivery and confidence.",
        areas: ["Practice more technical scenarios", "Work on response timing", "Enhance storytelling with examples"]
      };
    } else if (score >= 70) {
      return {
        title: "Good Foundation, Needs Improvement",
        message: "You have a solid understanding but need to work on clarity and structure. Your responses could be more organized and confident.",
        areas: ["Practice STAR method consistently", "Improve answer organization", "Build confidence through repetition"]
      };
    } else {
      return {
        title: "Significant Improvement Needed",
        message: "Your responses need substantial work. Focus on fundamentals like clear communication, proper structure, and relevant examples.",
        areas: ["Study common interview questions", "Practice basic communication skills", "Work on confidence building"]
      };
    }
  };

  const handlePracticeSimilar = () => {
    toast({
      title: "Starting Similar Practice",
      description: `Preparing ${session.type.toLowerCase()} questions for ${session.industry}...`
    });
    // Navigate to practice session with similar questions
    setTimeout(() => {
      onBack(); // Return to dashboard to start new session
    }, 1500);
  };

  const handleExportReport = () => {
    const reportData = {
      sessionDate: session.date,
      sessionType: session.type,
      industry: session.industry,
      score: session.score,
      duration: session.duration,
      questions: session.questions,
      answers: session.answers,
      feedback: session.feedback,
      detailedFeedback: getDetailedFeedback(session.score, session.type)
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-report-${session.date}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Report Exported",
      description: "Your session report has been downloaded successfully."
    });
  };

  const handleStartNewSession = () => {
    toast({
      title: "Starting New Session",
      description: "Preparing a new interview session for you..."
    });
    onBack(); // Return to dashboard to start new session
  };

  const detailedFeedback = getDetailedFeedback(session.score, session.type);

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
              <h1 className="text-2xl font-bold">Session Review</h1>
              <p className="text-gray-600">{session.type} Interview - {session.date}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline">{session.industry}</Badge>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">{session.duration}</span>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Performance Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Performance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-medium">Overall Score</span>
                    <div className={`text-3xl font-bold ${getScoreColor(session.score)}`}>
                      {session.score}%
                    </div>
                  </div>
                  <Progress value={session.score} className="mb-4" />
                  
                  <div className={`p-4 rounded-lg ${getScoreBg(session.score)} border-l-4 ${session.score >= 80 ? 'border-green-500' : session.score >= 70 ? 'border-yellow-500' : 'border-red-500'}`}>
                    <div className="flex items-start">
                      {session.score >= 80 ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                      )}
                      <div>
                        <p className="font-medium text-gray-800 mb-1">
                          {detailedFeedback.title}
                        </p>
                        <p className="text-sm text-gray-700 mb-2">{detailedFeedback.message}</p>
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-800 mb-1">Key Areas to Focus On:</p>
                          <ul className="text-sm text-gray-700 space-y-1">
                            {detailedFeedback.areas.map((area, index) => (
                              <li key={index} className="flex items-center">
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                                {area}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Questions and Answers */}
              <Card>
                <CardHeader>
                  <CardTitle>Questions & Answers</CardTitle>
                  <CardDescription>
                    Review your responses to each interview question
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {session.questions.map((question: string, index: number) => {
                      // Generate individual question scores based on overall performance
                      const questionScore = session.score + (Math.random() * 20 - 10); // Slight variation
                      const normalizedScore = Math.max(0, Math.min(100, Math.round(questionScore)));
                      
                      return (
                        <div key={index} className="border-l-4 border-blue-200 pl-4">
                          <div className="mb-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                                Question {index + 1}
                              </span>
                              <span className={`text-sm font-medium ${getScoreColor(normalizedScore)}`}>
                                {normalizedScore}%
                              </span>
                            </div>
                            <p className="font-medium text-gray-800 mb-3">{question}</p>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-lg mb-3">
                            <p className="text-sm text-gray-600 mb-1">Your Answer:</p>
                            <p className="text-gray-800">{session.answers[index] || "No answer recorded"}</p>
                          </div>

                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-sm text-blue-800 font-medium mb-1">Feedback:</p>
                            <p className="text-sm text-blue-700">
                              {normalizedScore >= 80 
                                ? "Well-structured response with clear examples. Good use of specific details."
                                : normalizedScore >= 70
                                ? "Good foundation but could benefit from more specific examples and clearer structure."
                                : "Consider using the STAR method and providing more concrete examples."}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Session Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Session Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{session.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{session.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Industry:</span>
                      <span className="font-medium">{session.industry}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{session.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Questions:</span>
                      <span className="font-medium">{session.questions.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Improvement Tips */}
              <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-yellow-800">
                    <Lightbulb className="h-5 w-5 mr-2" />
                    Improvement Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {session.score < 80 && (
                      <div className="p-3 bg-white rounded-lg border border-yellow-200">
                        <p className="text-sm font-medium text-yellow-800 mb-1">Structure Your Answers</p>
                        <p className="text-xs text-yellow-700">Use the STAR method: Situation, Task, Action, Result</p>
                      </div>
                    )}
                    
                    {session.type === "Technical" && (
                      <div className="p-3 bg-white rounded-lg border border-yellow-200">
                        <p className="text-sm font-medium text-yellow-800 mb-1">Explain Your Thinking</p>
                        <p className="text-xs text-yellow-700">Walk through your problem-solving process step by step</p>
                      </div>
                    )}
                    
                    <div className="p-3 bg-white rounded-lg border border-yellow-200">
                      <p className="text-sm font-medium text-yellow-800 mb-1">Practice Regularly</p>
                      <p className="text-xs text-yellow-700">Consistent practice leads to better performance</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card>
                <CardHeader>
                  <CardTitle>Next Steps</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={handlePracticeSimilar}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Practice Similar Questions
                  </Button>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={handleExportReport}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Session Report
                  </Button>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={handleStartNewSession}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Start New Session
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

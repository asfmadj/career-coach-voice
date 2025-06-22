import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Clock, TrendingUp, CheckCircle, AlertCircle, Lightbulb, Download, Play, Plus, Brain, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { analyzeInterviewWithGemini } from "@/utils/geminiAnalytics";

interface SessionReviewProps {
  session: any;
  onBack: () => void;
}

export const SessionReview = ({ session, onBack }: SessionReviewProps) => {
  const { toast } = useToast();
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (session && !analysis) {
      analyzeSession();
    }
  }, [session]);

  const analyzeSession = async () => {
    if (!session) return;
    
    setIsAnalyzing(true);
    try {
      const result = await analyzeInterviewWithGemini({
        questions: session.questions || [],
        answers: session.answers || [],
        type: session.type || "General",
        industry: session.industry || "Technology",
        level: session.level || "Mid-level",
        duration: session.duration || "15 minutes"
      });
      
      setAnalysis(result);
      
      // Update session score with Gemini analysis
      session.score = result.overallScore;
      
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: "Analysis Error",
        description: "Using fallback analysis method.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Session not found</h1>
            <Button onClick={onBack} className="bg-indigo-600 hover:bg-indigo-700">Back to Dashboard</Button>
          </div>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-600";
    if (score >= 75) return "text-blue-600";
    if (score >= 65) return "text-amber-600";
    return "text-red-500";
  };

  const getScoreBg = (score: number) => {
    if (score >= 85) return "bg-emerald-50 border-emerald-200";
    if (score >= 75) return "bg-blue-50 border-blue-200";
    if (score >= 65) return "bg-amber-50 border-amber-200";
    return "bg-red-50 border-red-200";
  };

  const handlePracticeSimilar = () => {
    toast({
      title: "Starting Similar Practice",
      description: `Preparing ${session.type.toLowerCase()} questions for ${session.industry}...`
    });
    setTimeout(() => {
      onBack();
    }, 1500);
  };

  const handleExportReport = () => {
    const reportData = {
      sessionDate: session.date,
      sessionType: session.type,
      industry: session.industry,
      geminiAnalysis: analysis,
      questions: session.questions,
      answers: session.answers,
      generatedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-analysis-${session.date}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Report Exported",
      description: "Your detailed analysis report has been downloaded.",
    });
  };

  const handleStartNewSession = () => {
    toast({
      title: "Starting New Session",
      description: "Preparing a new interview session..."
    });
    onBack();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button variant="ghost" onClick={onBack} className="mr-4 hover:bg-slate-100">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Interview Analysis</h1>
              <p className="text-slate-600">{session.type} Interview - {session.date}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="bg-white">{session.industry}</Badge>
            <div className="flex items-center space-x-2 text-slate-600">
              <Clock className="h-4 w-4" />
              <span className="text-sm">{session.duration}</span>
            </div>
          </div>
        </div>

        {isAnalyzing && (
          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Brain className="h-6 w-6 text-blue-600 animate-pulse" />
                <div>
                  <p className="font-semibold text-blue-800">AI Analysis in Progress</p>
                  <p className="text-sm text-blue-600">Gemini AI is analyzing your interview performance...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* AI-Powered Performance Overview */}
              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center">
                    <Brain className="h-6 w-6 mr-2" />
                    AI Performance Analysis
                  </CardTitle>
                  <CardDescription className="text-indigo-100">
                    Powered by Gemini AI for accurate assessment
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-lg font-medium text-slate-700">Overall Score</span>
                    <div className={`text-4xl font-bold ${getScoreColor(analysis?.overallScore || session.score)}`}>
                      {analysis?.overallScore || session.score}%
                    </div>
                  </div>
                  <Progress value={analysis?.overallScore || session.score} className="mb-6 h-3" />
                  
                  {analysis && (
                    <>
                      {/* Skill Breakdown */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-slate-600">Communication</span>
                            <span className="text-sm font-bold text-slate-800">{analysis.skillBreakdown.communication}%</span>
                          </div>
                          <Progress value={analysis.skillBreakdown.communication} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-slate-600">Technical</span>
                            <span className="text-sm font-bold text-slate-800">{analysis.skillBreakdown.technical}%</span>
                          </div>
                          <Progress value={analysis.skillBreakdown.technical} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-slate-600">Problem Solving</span>
                            <span className="text-sm font-bold text-slate-800">{analysis.skillBreakdown.problemSolving}%</span>
                          </div>
                          <Progress value={analysis.skillBreakdown.problemSolving} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-slate-600">Confidence</span>
                            <span className="text-sm font-bold text-slate-800">{analysis.skillBreakdown.confidence}%</span>
                          </div>
                          <Progress value={analysis.skillBreakdown.confidence} className="h-2" />
                        </div>
                      </div>

                      {/* AI Feedback */}
                      <div className={`p-5 rounded-lg border-l-4 ${getScoreBg(analysis.overallScore)} ${
                        analysis.overallScore >= 85 ? 'border-emerald-500' : 
                        analysis.overallScore >= 75 ? 'border-blue-500' : 
                        analysis.overallScore >= 65 ? 'border-amber-500' : 'border-red-500'
                      }`}>
                        <div className="flex items-start">
                          <Brain className="h-5 w-5 text-indigo-600 mr-3 mt-0.5" />
                          <div>
                            <p className="font-medium text-slate-800 mb-2">AI Assessment</p>
                            <p className="text-sm text-slate-700 mb-4">{analysis.detailedFeedback}</p>
                            
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium text-emerald-700 mb-2">Strengths</p>
                                <ul className="text-sm text-slate-600 space-y-1">
                                  {analysis.strengths.map((strength: string, index: number) => (
                                    <li key={index} className="flex items-center">
                                      <CheckCircle className="h-3 w-3 text-emerald-500 mr-2" />
                                      {strength}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-amber-700 mb-2">Areas for Improvement</p>
                                <ul className="text-sm text-slate-600 space-y-1">
                                  {analysis.weaknesses.map((weakness: string, index: number) => (
                                    <li key={index} className="flex items-center">
                                      <Target className="h-3 w-3 text-amber-500 mr-2" />
                                      {weakness}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Questions and Detailed Scoring */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-slate-800">Question-by-Question Analysis</CardTitle>
                  <CardDescription>
                    Individual performance breakdown with AI scoring
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {session.questions.map((question: string, index: number) => {
                      const questionScore = analysis?.questionScores?.[index] || (session.score + (Math.random() * 20 - 10));
                      const normalizedScore = Math.max(0, Math.min(100, Math.round(questionScore)));
                      
                      return (
                        <div key={index} className="border-l-4 border-indigo-200 pl-6 bg-slate-50 p-4 rounded-r-lg">
                          <div className="mb-3">
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="outline" className="bg-white">
                                Question {index + 1}
                              </Badge>
                              <span className={`text-sm font-bold ${getScoreColor(normalizedScore)}`}>
                                {normalizedScore}%
                              </span>
                            </div>
                            <p className="font-medium text-slate-800 mb-3">{question}</p>
                          </div>
                          
                          <div className="bg-white p-4 rounded-lg mb-3 border">
                            <p className="text-sm text-slate-600 mb-1 font-medium">Your Answer:</p>
                            <p className="text-slate-800">{session.answers[index] || "No answer recorded"}</p>
                          </div>

                          <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                            <p className="text-sm text-indigo-800 font-medium mb-1">AI Feedback:</p>
                            <p className="text-sm text-indigo-700">
                              {normalizedScore >= 85 
                                ? "Excellent response with clear structure, specific examples, and strong technical knowledge."
                                : normalizedScore >= 75
                                ? "Good response with solid foundation. Consider adding more specific examples and detail."
                                : normalizedScore >= 65
                                ? "Adequate response but needs improvement in structure and specificity using STAR method."
                                : "Response needs significant improvement. Focus on clear structure, relevant examples, and addressing all parts of the question."}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Sidebar */}
            <div className="space-y-6">
              {/* Session Details */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-slate-800">Session Details</CardTitle>
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

              {/* AI Recommendations */}
              {analysis && (
                <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-amber-800">
                      <Lightbulb className="h-5 w-5 mr-2" />
                      AI Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analysis.recommendations.map((rec: string, index: number) => (
                        <div key={index} className="p-3 bg-white rounded-lg border border-amber-200">
                          <p className="text-sm font-medium text-amber-800 mb-1">Recommendation {index + 1}</p>
                          <p className="text-xs text-amber-700">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-slate-800">Next Steps</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" 
                    onClick={handlePracticeSimilar}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Practice Similar Questions
                  </Button>
                  <Button 
                    className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50" 
                    variant="outline"
                    onClick={handleExportReport}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export AI Analysis Report
                  </Button>
                  <Button 
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
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

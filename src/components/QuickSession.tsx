
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Clock, CheckCircle, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface QuickSessionProps {
  onBack: () => void;
  interviewConfig: {
    industry: string;
    level: string;
    type: string;
    duration: string;
  };
}

export const QuickSession = ({ onBack, interviewConfig }: QuickSessionProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes total
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const { toast } = useToast();

  const questions = [
    "Tell me about yourself and your background.",
    "Why are you interested in this position?",
    "What's your greatest professional strength?"
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0 && !isCompleted) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isCompleted) {
      completeSession();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, isCompleted]);

  const startSession = () => {
    setIsActive(true);
  };

  const nextQuestion = () => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = currentAnswer;
    setAnswers(newAnswers);
    setCurrentAnswer("");

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      completeSession();
    }
  };

  const completeSession = () => {
    setIsActive(false);
    setIsCompleted(true);
    
    const finalAnswers = [...answers];
    if (currentAnswer) {
      finalAnswers[currentQuestionIndex] = currentAnswer;
    }
    setAnswers(finalAnswers);

    toast({
      title: "Quick Session Complete!",
      description: "Great job! You've completed your 5-minute practice session.",
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = ((currentQuestionIndex + (currentAnswer ? 1 : 0)) / questions.length) * 100;

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl">Session Complete!</CardTitle>
                <CardDescription>
                  You've completed your 5-minute quick practice session
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Session Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Questions Answered:</span>
                        <span className="font-medium">{answers.filter(a => a).length} / {questions.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Time Used:</span>
                        <span className="font-medium">{formatTime(300 - timeLeft)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Industry:</span>
                        <span className="font-medium">{interviewConfig.industry || "General"}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Quick Feedback</h3>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Good job completing the session</li>
                      <li>• Practice speaking your answers aloud</li>
                      <li>• Consider using the STAR method</li>
                      <li>• Keep practicing regularly</li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex space-x-3 justify-center">
                  <Button onClick={onBack} variant="outline">
                    Back to Dashboard
                  </Button>
                  <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">
                    Start Another Session
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

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
              <h1 className="text-2xl font-bold">5-Minute Quick Session</h1>
              <p className="text-gray-600">Fast-paced practice with 3 essential questions</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className={`text-lg font-bold ${timeLeft < 60 ? 'text-red-600' : 'text-blue-600'}`}>
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-gray-500">remaining</div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Progress */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-gray-600">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
              </div>
              <Progress value={progressPercentage} className="w-full" />
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Question */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Question {currentQuestionIndex + 1}</CardTitle>
                  <CardDescription>
                    Answer concisely - you have limited time for each question
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-6 bg-blue-50 rounded-lg border-l-4 border-blue-500 mb-6">
                    <p className="text-lg font-medium text-blue-800">
                      {questions[currentQuestionIndex]}
                    </p>
                  </div>
                  
                  <textarea
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  
                  <div className="flex space-x-3 mt-4">
                    {!isActive && (
                      <Button onClick={startSession} className="bg-green-600 hover:bg-green-700">
                        <Clock className="h-4 w-4 mr-2" />
                        Start Session
                      </Button>
                    )}
                    {isActive && (
                      <Button 
                        onClick={nextQuestion} 
                        disabled={!currentAnswer.trim()}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {currentQuestionIndex < questions.length - 1 ? (
                          <>
                            Next Question
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </>
                        ) : (
                          <>
                            Complete Session
                            <CheckCircle className="h-4 w-4 ml-2" />
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Session Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Session Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium">Duration:</span> 5 minutes
                    </div>
                    <div>
                      <span className="font-medium">Questions:</span> 3 essential questions
                    </div>
                    <div>
                      <span className="font-medium">Focus:</span> Quick practice
                    </div>
                    <div>
                      <span className="font-medium">Industry:</span> {interviewConfig.industry || "General"}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Questions Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {questions.map((_, index) => (
                      <div 
                        key={index} 
                        className={`flex items-center space-x-2 text-sm ${
                          index === currentQuestionIndex ? 'text-blue-600 font-medium' : 
                          index < currentQuestionIndex ? 'text-green-600' : 'text-gray-400'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                          index === currentQuestionIndex ? 'bg-blue-100 text-blue-600' :
                          index < currentQuestionIndex ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {index < currentQuestionIndex ? <CheckCircle className="h-3 w-3" /> : index + 1}
                        </div>
                        <span>Question {index + 1}</span>
                      </div>
                    ))}
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

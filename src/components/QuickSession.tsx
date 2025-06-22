
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Clock, CheckCircle, ArrowRight, Mic, MessageSquare, Phone, PhoneOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Vapi from "@vapi-ai/web";

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
  const [timeLeft, setTimeLeft] = useState(300);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [sessionType, setSessionType] = useState<"text" | "voice">("text");
  
  // Voice-specific state
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [voiceAnswers, setVoiceAnswers] = useState<string[]>([]);
  
  const { toast } = useToast();

  const questions = [
    "Tell me about yourself and your background.",
    "Why are you interested in this position?",
    "What's your greatest professional strength?"
  ];

  // Initialize Vapi for voice sessions
  useEffect(() => {
    if (sessionType === "voice") {
      const initializeVapi = async () => {
        try {
          const vapiInstance = new Vapi("8a96f7dc-932d-4ed3-b067-d125fcc61afb");
          setVapi(vapiInstance);

          vapiInstance.on("call-start", () => {
            setIsCallActive(true);
            setIsActive(true);
          });

          vapiInstance.on("call-end", () => {
            setIsCallActive(false);
            completeSession();
          });

          vapiInstance.on("message", (message: any) => {
            if (message.type === "transcript" && message.transcript && message.role === "user") {
              const newVoiceAnswers = [...voiceAnswers];
              newVoiceAnswers[currentQuestionIndex] = message.transcript;
              setVoiceAnswers(newVoiceAnswers);
            }
          });

        } catch (error) {
          console.error("Failed to initialize Vapi:", error);
          toast({
            title: "Voice Setup Error",
            description: "Please try the text option instead.",
            variant: "destructive",
          });
        }
      };

      initializeVapi();
    }

    return () => {
      if (vapi) {
        try {
          vapi.stop();
        } catch (error) {
          console.error("Error stopping Vapi:", error);
        }
      }
    };
  }, [sessionType]);

  // Timer
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

  const startTextSession = () => {
    setIsActive(true);
    setSessionType("text");
    toast({
      title: "Text Session Started",
      description: "Answer the questions by typing your responses.",
    });
  };

  const startVoiceSession = async () => {
    if (!vapi) {
      toast({
        title: "Voice Not Ready",
        description: "Please wait or try the text option.",
        variant: "destructive",
      });
      return;
    }

    try {
      const assistantConfig = {
        name: "Quick Interview Assistant",
        model: {
          provider: "openai" as const,
          model: "gpt-4" as const,
          messages: [
            {
              role: "system" as const,
              content: `You are conducting a quick 5-minute interview for ${interviewConfig.industry}. Ask these questions one by one and listen to responses:
              1. Tell me about yourself and your background.
              2. Why are you interested in this position?
              3. What's your greatest professional strength?
              
              Keep responses brief and move to the next question after each answer. End after 5 minutes.`
            }
          ]
        },
        voice: {
          provider: "11labs" as const,
          voiceId: "21m00Tcm4TlvDq8ikWAM"
        },
        firstMessage: "Hello! Welcome to your 5-minute quick interview. Let's start with the first question: Tell me about yourself and your background.",
      };

      await vapi.start(assistantConfig);
      setSessionType("voice");
      
    } catch (error) {
      console.error("Failed to start voice session:", error);
      toast({
        title: "Voice Session Failed",
        description: "Please try the text option instead.",
        variant: "destructive",
      });
    }
  };

  const nextQuestion = () => {
    if (sessionType === "text") {
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = currentAnswer;
      setAnswers(newAnswers);
      setCurrentAnswer("");

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        completeSession();
      }
    }
  };

  const endVoiceSession = () => {
    if (vapi && isCallActive) {
      vapi.stop();
    }
  };

  const completeSession = () => {
    setIsActive(false);
    setIsCompleted(true);
    setIsCallActive(false);
    
    const finalAnswers = sessionType === "voice" ? voiceAnswers : [...answers];
    if (sessionType === "text" && currentAnswer) {
      finalAnswers[currentQuestionIndex] = currentAnswer;
    }
    
    if (sessionType === "voice") {
      setAnswers(finalAnswers);
    }

    toast({
      title: "Quick Session Complete!",
      description: `Great job! You've completed your 5-minute ${sessionType} practice session.`,
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-lg">
              <CardHeader className="text-center bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-t-lg">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Session Complete!</CardTitle>
                <CardDescription className="text-emerald-100">
                  You've completed your 5-minute {sessionType} practice session
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3 text-slate-800">Session Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Session Type:</span>
                        <Badge className="capitalize">{sessionType}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Questions Answered:</span>
                        <span className="font-medium text-slate-800">{answers.filter(a => a).length} / {questions.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Time Used:</span>
                        <span className="font-medium text-slate-800">{formatTime(300 - timeLeft)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Industry:</span>
                        <span className="font-medium text-slate-800">{interviewConfig.industry || "General"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3 text-blue-800">Quick Feedback</h3>
                    <ul className="space-y-2 text-sm text-blue-700">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
                        Good job completing the session
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
                        {sessionType === "voice" ? "Practice speaking clearly" : "Good written responses"}
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
                        Consider using the STAR method
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
                        Keep practicing regularly
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex space-x-3 justify-center">
                  <Button onClick={onBack} variant="outline" className="border-slate-300 hover:bg-slate-50">
                    Back to Dashboard
                  </Button>
                  <Button onClick={() => window.location.reload()} className="bg-indigo-600 hover:bg-indigo-700">
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
              <h1 className="text-3xl font-bold text-slate-800">5-Minute Quick Session</h1>
              <p className="text-slate-600">Choose between text or voice interview practice</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className={`text-lg font-bold ${timeLeft < 60 ? 'text-red-600' : 'text-indigo-600'}`}>
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-slate-500">remaining</div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Progress */}
          <Card className="mb-6 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Progress</span>
                <span className="text-sm text-slate-600">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
              </div>
              <Progress value={progressPercentage} className="w-full h-2" />
            </CardContent>
          </Card>

          {!isActive ? (
            /* Session Type Selection */
            <Card className="shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-slate-800">Choose Your Interview Style</CardTitle>
                <CardDescription>
                  Select how you'd like to practice - both options cover the same essential questions
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <Tabs defaultValue="text" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="text" className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4" />
                      <span>Text Interview</span>
                    </TabsTrigger>
                    <TabsTrigger value="voice" className="flex items-center space-x-2">
                      <Mic className="h-4 w-4" />
                      <span>Voice Interview</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="text" className="space-y-6">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="h-10 w-10 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-slate-800">Text-Based Interview</h3>
                      <p className="text-slate-600 mb-6">Type your responses to interview questions</p>
                      <div className="grid md:grid-cols-3 gap-4 mb-6 text-sm">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="font-medium text-blue-800">✍️ Written Responses</p>
                          <p className="text-blue-600">Perfect for organizing thoughts</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="font-medium text-blue-800">⏰ Self-Paced</p>
                          <p className="text-blue-600">Take time to craft answers</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="font-medium text-blue-800">📝 Structure Practice</p>
                          <p className="text-blue-600">Focus on answer organization</p>
                        </div>
                      </div>
                      <Button 
                        onClick={startTextSession}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                        size="lg"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Start Text Interview
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="voice" className="space-y-6">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mic className="h-10 w-10 text-emerald-600" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-slate-800">Voice Interview</h3>
                      <p className="text-slate-600 mb-6">Speak naturally with our AI interviewer</p>
                      <div className="grid md:grid-cols-3 gap-4 mb-6 text-sm">
                        <div className="bg-emerald-50 p-3 rounded-lg">
                          <p className="font-medium text-emerald-800">🎤 Real Conversation</p>
                          <p className="text-emerald-600">Practice speaking skills</p>
                        </div>
                        <div className="bg-emerald-50 p-3 rounded-lg">
                          <p className="font-medium text-emerald-800">🤖 AI Interviewer</p>
                          <p className="text-emerald-600">Interactive responses</p>
                        </div>
                        <div className="bg-emerald-50 p-3 rounded-lg">
                          <p className="font-medium text-emerald-800">⚡ Real-time</p>
                          <p className="text-emerald-600">Immediate feedback</p>
                        </div>
                      </div>
                      <Button 
                        onClick={startVoiceSession}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3"
                        size="lg"
                      >
                        <Mic className="h-4 w-4 mr-2" />
                        Start Voice Interview
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            /* Active Session Interface */
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Question Area */}
              <div className="lg:col-span-2">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-slate-800">
                      {sessionType === "text" ? <MessageSquare className="h-5 w-5 mr-2" /> : <Mic className="h-5 w-5 mr-2" />}
                      Question {currentQuestionIndex + 1}
                    </CardTitle>
                    <CardDescription>
                      {sessionType === "text" 
                        ? "Type your answer below - be concise but thorough" 
                        : "Speak naturally - the AI is listening and will respond"
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-6 bg-indigo-50 rounded-lg border-l-4 border-indigo-500 mb-6">
                      <p className="text-lg font-medium text-indigo-800">
                        {questions[currentQuestionIndex]}
                      </p>
                    </div>
                    
                    {sessionType === "text" ? (
                      <>
                        <textarea
                          value={currentAnswer}
                          onChange={(e) => setCurrentAnswer(e.target.value)}
                          placeholder="Type your answer here..."
                          className="w-full h-40 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        
                        <div className="flex space-x-3 mt-4">
                          <Button 
                            onClick={nextQuestion} 
                            disabled={!currentAnswer.trim()}
                            className="bg-indigo-600 hover:bg-indigo-700"
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
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          {isCallActive ? (
                            <Mic className="h-12 w-12 text-emerald-600 animate-pulse" />
                          ) : (
                            <Phone className="h-12 w-12 text-slate-400" />
                          )}
                        </div>
                        <div className="text-lg font-semibold mb-2 text-slate-800">
                          {isCallActive ? 'Interview Active' : 'Connecting...'}
                        </div>
                        {isCallActive && (
                          <div className="space-y-4">
                            <p className="text-slate-600">Speak clearly and naturally</p>
                            <Button
                              onClick={endVoiceSession}
                              variant="destructive"
                              className="bg-red-500 hover:bg-red-600"
                            >
                              <PhoneOff className="h-4 w-4 mr-2" />
                              End Interview
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Session Info Sidebar */}
              <div className="space-y-6">
                {/* Session Overview */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-slate-800">Session Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium text-slate-600">Type:</span>
                        <Badge className="capitalize">{sessionType}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-slate-600">Duration:</span>
                        <span className="text-slate-800">5 minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-slate-600">Questions:</span>
                        <span className="text-slate-800">3 essential questions</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-slate-600">Industry:</span>
                        <span className="text-slate-800">{interviewConfig.industry || "General"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Questions Progress */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-slate-800">Questions Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {questions.map((_, index) => (
                        <div 
                          key={index} 
                          className={`flex items-center space-x-3 text-sm ${
                            index === currentQuestionIndex ? 'text-indigo-600 font-medium' : 
                            index < currentQuestionIndex ? 'text-emerald-600' : 'text-slate-400'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                            index === currentQuestionIndex ? 'bg-indigo-100 text-indigo-600' :
                            index < currentQuestionIndex ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
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
          )}
        </div>
      </div>
    </div>
  );
};

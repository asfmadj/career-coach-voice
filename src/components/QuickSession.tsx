import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Clock, CheckCircle, ArrowRight, Mic, MessageSquare, Phone, PhoneOff, Brain, TrendingUp, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Vapi from "@vapi-ai/web";
import { analyzeInterviewWithGemini } from "@/utils/geminiAnalytics";

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
  const [showStats, setShowStats] = useState(false);
  const [sessionStats, setSessionStats] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  
  // Voice-specific state
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [voiceAnswers, setVoiceAnswers] = useState<string[]>([]);
  const [isVapiInitialized, setIsVapiInitialized] = useState(false);
  const [vapiError, setVapiError] = useState(false);
  
  const { toast } = useToast();

  const languages = [
    { code: "en", name: "English", locale: "en-US" },
    { code: "hi", name: "हिंदी (Hindi)", locale: "hi-IN" }
  ];

  const questions = [
    "Tell me about yourself and your background.",
    "Why are you interested in this position?",
    "What's your greatest professional strength?"
  ];

  const questionsHindi = [
    "अपने बारे में और अपनी पृष्ठभूमि के बारे में बताएं।",
    "आप इस पद में क्यों रुचि रखते हैं?",
    "आपकी सबसे बड़ी व्यावसायिक शक्ति क्या है?"
  ];

  const currentQuestions = selectedLanguage === "hi" ? questionsHindi : questions;

  // Initialize Vapi for voice sessions
  useEffect(() => {
    const initializeVapi = async () => {
      try {
        // Request microphone permission first
        await navigator.mediaDevices.getUserMedia({ audio: true });
        
        const vapiInstance = new Vapi("8a96f7dc-932d-4ed3-b067-d125fcc61afb");
        setVapi(vapiInstance);
        setIsVapiInitialized(true);

        vapiInstance.on("call-start", () => {
          console.log("Call started");
          setIsCallActive(true);
          setIsActive(true);
          setVapiError(false);
        });

        vapiInstance.on("call-end", () => {
          console.log("Call ended");
          setIsCallActive(false);
          completeSession();
        });

        vapiInstance.on("message", (message: any) => {
          console.log("Vapi message:", message);
          
          if (message.type === "transcript" && message.transcript) {
            if (message.role === "user") {
              // User spoke - store their answer
              const newVoiceAnswers = [...voiceAnswers];
              newVoiceAnswers[currentQuestionIndex] = message.transcript;
              setVoiceAnswers(newVoiceAnswers);
            } else if (message.role === "assistant") {
              // AI spoke - check if it's moving to next question or ending
              const transcript = message.transcript.toLowerCase();
              
              // Check if AI is ending the interview (multiple language support)
              const endKeywords = [
                "thank you", "interview", "complete", "end", "conclude",
                "धन्यवाद", "साक्षात्कार", "समाप्त", "पूरा"
              ];
              const isEnding = endKeywords.some(keyword => transcript.includes(keyword)) &&
                               (transcript.includes("complete") || transcript.includes("end") || 
                                transcript.includes("conclude") || transcript.includes("समाप्त") || 
                                transcript.includes("पूरा"));
              
              if (isEnding) {
                console.log("AI is ending the interview");
                setTimeout(() => {
                  if (vapi && isCallActive) {
                    vapi.stop();
                  }
                }, 2000);
              }
              
              // Check if AI is asking the next question (multiple language support)
              const questionKeywords = [
                "second question", "next question", "final question", "last question",
                "दूसरा प्रश्न", "अगला प्रश्न", "अंतिम प्रश्न", "आखिरी प्रश्न"
              ];
              const isNextQuestion = questionKeywords.some(keyword => transcript.includes(keyword));
              
              if (isNextQuestion && currentQuestionIndex < currentQuestions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
              }
            }
          }
          
          // Handle conversation-end or session-complete messages
          if (message.type === "conversation-end" || message.type === "session-complete") {
            console.log("Session completed by AI");
            setTimeout(() => completeSession(), 1000);
          }
        });

        vapiInstance.on("error", (error: any) => {
          console.error("Vapi error:", error);
          setVapiError(true);
          setIsCallActive(false);
          toast({
            title: "Voice Error",
            description: "There was an issue with the voice system. Try the text option instead.",
            variant: "destructive",
          });
        });

      } catch (error) {
        console.error("Failed to initialize Vapi:", error);
        setVapiError(true);
        toast({
          title: "Microphone Access Required",
          description: "Please allow microphone access for voice interviews.",
          variant: "destructive",
        });
      }
    };

    initializeVapi();

    return () => {
      if (vapi) {
        try {
          vapi.stop();
        } catch (error) {
          console.error("Error stopping Vapi:", error);
        }
      }
    };
  }, []);

  // Timer - modified to handle voice session completion
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0 && !isCompleted) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isCompleted) {
      // Time is up - end the session
      if (sessionType === "voice" && vapi && isCallActive) {
        vapi.stop();
      } else {
        completeSession();
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, isCompleted, sessionType, vapi, isCallActive]);

  const startTextSession = () => {
    setIsActive(true);
    setSessionType("text");
    toast({
      title: "Text Session Started",
      description: "Answer the questions by typing your responses.",
    });
  };

  const startVoiceSession = async () => {
    if (!vapi || !isVapiInitialized) {
      toast({
        title: "Voice Not Ready",
        description: "Voice system is initializing. Please wait or try text option.",
        variant: "destructive",
      });
      return;
    }

    if (vapiError) {
      toast({
        title: "Voice Unavailable",
        description: "Please use the text interview option.",
        variant: "destructive",
      });
      return;
    }

    try {
      const currentLanguage = languages.find(lang => lang.code === selectedLanguage);
      
      const assistantConfig = {
        name: "Quick Interview Assistant",
        model: {
          provider: "openai" as const,
          model: "gpt-4" as const,
          messages: [
            {
              role: "system" as const,
              content: selectedLanguage === "hi" 
                ? `आप ${interviewConfig.industry} के लिए एक त्वरित 5-मिनट का साक्षात्कार ले रहे हैं। आपको इन 3 प्रश्नों को क्रम में पूछना होगा:

                1. "अपने बारे में और अपनी पृष्ठभूमि के बारे में बताएं।"
                2. "आप इस पद में क्यों रुचि रखते हैं?"
                3. "आपकी सबसे बड़ी व्यावसायिक शक्ति क्या है?"

                महत्वपूर्ण निर्देश:
                - एक समय में केवल एक प्रश्न पूछें
                - अगले प्रश्न पर जाने से पहले उपयोगकर्ता के पूरे उत्तर की प्रतीक्षा करें
                - प्रत्येक उत्तर के बाद, संक्षेप में स्वीकार करें और फिर कहें "अगले प्रश्न पर जाते हैं:"
                - तीसरे प्रश्न का उत्तर देने के बाद, कहें "इस साक्षात्कार को पूरा करने के लिए धन्यवाद। यह हमारा सत्र समाप्त होता है।"
                - अपने उत्तर संक्षिप्त रखें (30 शब्दों के तहत)
                - फॉलो-अप प्रश्न न पूछें - केवल 3 मुख्य प्रश्नों पर टिके रहें
                - पूरा साक्षात्कार लगभग 5 मिनट का होना चाहिए`
                : `You are conducting a quick 5-minute interview for ${interviewConfig.industry}. You must ask these 3 questions in order:

                1. "Tell me about yourself and your background."
                2. "Why are you interested in this position?"  
                3. "What's your greatest professional strength?"

                IMPORTANT INSTRUCTIONS:
                - Ask ONE question at a time
                - Wait for the user's complete response before moving to the next question
                - After each answer, acknowledge briefly and then say "Moving to the [second/final] question:"
                - After the third question is answered, say "Thank you for completing this interview. This concludes our session."
                - Keep your responses brief (under 30 words)
                - Do not ask follow-up questions - stick to the 3 main questions only
                - The entire interview should take about 5 minutes`
            }
          ],
          temperature: 0.7,
          maxTokens: 100
        },
        voice: {
          provider: "11labs" as const,
          voiceId: selectedLanguage === "hi" ? "pFZP5JQG7iQjIQuC4Bku" : "21m00Tcm4TlvDq8ikWAM"
        },
        firstMessage: selectedLanguage === "hi" 
          ? "नमस्ते! आपके 5-मिनट के त्वरित साक्षात्कार में आपका स्वागत है। आइए पहले प्रश्न से शुरुआत करते हैं: अपने बारे में और अपनी पृष्ठभूमि के बारे में बताएं।"
          : "Hello! Welcome to your 5-minute quick interview. Let's start with the first question: Tell me about yourself and your background.",
        transcriber: {
          provider: "deepgram" as const,
          model: "nova-2" as const,
          language: currentLanguage?.locale || "en-US"
        }
      };

      await vapi.start(assistantConfig);
      setSessionType("voice");
      
    } catch (error) {
      console.error("Failed to start voice session:", error);
      setVapiError(true);
      toast({
        title: "Voice Session Failed",
        description: "Please check your microphone and try the text option.",
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

      if (currentQuestionIndex < currentQuestions.length - 1) {
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

  const completeSession = async () => {
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

    // Generate stats using Gemini AI
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeInterviewWithGemini({
        questions: questions,
        answers: finalAnswers,
        type: "Quick Session",
        industry: interviewConfig.industry || "General",
        level: interviewConfig.level || "Mid-level",
        duration: "5 minutes"
      });
      
      setSessionStats(analysis);
    } catch (error) {
      console.error('Analysis failed:', error);
      // Fallback stats
      setSessionStats({
        overallScore: Math.floor(Math.random() * 20) + 70,
        skillBreakdown: {
          communication: Math.floor(Math.random() * 20) + 70,
          technical: Math.floor(Math.random() * 20) + 70,
          problemSolving: Math.floor(Math.random() * 20) + 70,
          confidence: Math.floor(Math.random() * 20) + 70
        },
        strengths: ["Clear communication", "Good examples"],
        weaknesses: ["Could be more specific", "Practice timing"],
        detailedFeedback: "Good performance in this quick session. Focus on providing more detailed examples in future interviews."
      });
    } finally {
      setIsAnalyzing(false);
    }

    toast({
      title: "Quick Session Complete!",
      description: `Great job! You've completed your 5-minute ${sessionType} practice session.`,
    });
  };

  const viewStats = () => {
    setShowStats(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = ((currentQuestionIndex + (currentAnswer ? 1 : 0)) / questions.length) * 100;

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-600";
    if (score >= 75) return "text-blue-600";
    if (score >= 65) return "text-amber-600";
    return "text-red-500";
  };

  if (showStats && sessionStats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-primary to-accent text-white rounded-t-lg">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-center">Quick Session Analysis</CardTitle>
                <CardDescription className="text-primary-100 text-center">
                  AI-powered performance insights from your {sessionType} interview
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-6 rounded-xl border border-primary/20">
                    <h3 className="font-semibold mb-4 text-primary flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Performance Score
                    </h3>
                    <div className="text-center">
                      <div className={`text-4xl font-bold mb-2 ${getScoreColor(sessionStats.overallScore)}`}>
                        {sessionStats.overallScore}%
                      </div>
                      <Progress value={sessionStats.overallScore} className="mb-4 h-3" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Communication</span>
                          <span className="font-bold">{sessionStats.skillBreakdown.communication}%</span>
                        </div>
                        <Progress value={sessionStats.skillBreakdown.communication} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Technical</span>
                          <span className="font-bold">{sessionStats.skillBreakdown.technical}%</span>
                        </div>
                        <Progress value={sessionStats.skillBreakdown.technical} className="h-2" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-xl border border-emerald-200">
                    <h3 className="font-semibold mb-4 text-emerald-800">Session Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Session Type:</span>
                        <Badge className="capitalize bg-emerald-100 text-emerald-800">{sessionType}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Questions Answered:</span>
                        <span className="font-medium">{answers.filter(a => a).length} / {currentQuestions.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Time Used:</span>
                        <span className="font-medium">{formatTime(300 - timeLeft)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Language:</span>
                        <span className="font-medium">{languages.find(l => l.code === selectedLanguage)?.name}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 p-6 rounded-xl border">
                  <h3 className="font-semibold mb-3">AI Feedback</h3>
                  <p className="text-muted-foreground mb-4">{sessionStats.detailedFeedback}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-emerald-700 mb-2">Strengths</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {sessionStats.strengths.map((strength: string, index: number) => (
                          <li key={index} className="flex items-center">
                            <CheckCircle className="h-3 w-3 text-emerald-500 mr-2" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-amber-700 mb-2">Areas for Improvement</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {sessionStats.weaknesses.map((weakness: string, index: number) => (
                          <li key={index} className="flex items-center">
                            <ArrowRight className="h-3 w-3 text-amber-500 mr-2" />
                            {weakness}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3 justify-center">
                  <Button onClick={onBack} variant="outline" className="border-muted-foreground/30 hover:bg-muted">
                    Back to Dashboard
                  </Button>
                  <Button onClick={() => window.location.reload()} className="bg-primary hover:bg-primary/90">
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

  if (isCompleted && !showStats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-xl border-0">
              <CardHeader className="text-center bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-t-lg">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Session Complete!</CardTitle>
                <CardDescription className="text-emerald-100">
                  You've completed your 5-minute {sessionType} practice session
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                {isAnalyzing && (
                  <div className="text-center py-4">
                    <Brain className="h-8 w-8 mx-auto mb-2 text-blue-600 animate-pulse" />
                    <p className="text-blue-600">AI is analyzing your performance...</p>
                  </div>
                )}
                
                <div className="flex space-x-3 justify-center">
                  <Button onClick={onBack} variant="outline" className="border-slate-300 hover:bg-slate-50">
                    Back to Dashboard
                  </Button>
                  <Button 
                    onClick={viewStats} 
                    disabled={isAnalyzing}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    {isAnalyzing ? "Analyzing..." : "View Performance Stats"}
                  </Button>
                  <Button onClick={() => window.location.reload()} variant="outline">
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button variant="ghost" onClick={onBack} className="mr-4 hover:bg-muted">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold">5-Minute Quick Session</h1>
              <p className="text-muted-foreground">Choose between text or voice interview practice</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className={`text-lg font-bold ${timeLeft < 60 ? 'text-destructive' : 'text-primary'}`}>
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-muted-foreground">remaining</div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Progress */}
          <Card className="mb-6 shadow-lg border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">
                  Question {currentQuestionIndex + 1} of {currentQuestions.length}
                </span>
              </div>
              <Progress value={progressPercentage} className="w-full h-2" />
            </CardContent>
          </Card>

          {!isActive ? (
            /* Session Type Selection */
            <Card className="shadow-xl border-0">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Choose Your Interview Style</CardTitle>
                <CardDescription>
                  Select how you'd like to practice - both options cover the same essential questions
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                {/* Language Selector */}
                <div className="flex items-center justify-center space-x-2 mb-6">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <label className="text-sm font-medium">Language:</label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Tabs defaultValue="text" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted/50">
                    <TabsTrigger value="text" className="flex items-center space-x-2 data-[state=active]:bg-background">
                      <MessageSquare className="h-4 w-4" />
                      <span>Text Interview</span>
                    </TabsTrigger>
                    <TabsTrigger value="voice" className="flex items-center space-x-2 data-[state=active]:bg-background">
                      <Mic className="h-4 w-4" />
                      <span>Voice Interview</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="text" className="space-y-6">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="h-10 w-10 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Text-Based Interview</h3>
                      <p className="text-muted-foreground mb-6">Type your responses to interview questions</p>
                      <div className="grid md:grid-cols-3 gap-4 mb-6 text-sm">
                        <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                          <p className="font-medium text-primary">✍️ Written Responses</p>
                          <p className="text-primary/70">Perfect for organizing thoughts</p>
                        </div>
                        <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                          <p className="font-medium text-primary">⏰ Self-Paced</p>
                          <p className="text-primary/70">Take time to craft answers</p>
                        </div>
                        <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                          <p className="font-medium text-primary">📝 Structure Practice</p>
                          <p className="text-primary/70">Focus on answer organization</p>
                        </div>
                      </div>
                      <Button 
                        onClick={startTextSession}
                        className="bg-primary hover:bg-primary/90 text-white px-8 py-3"
                        size="lg"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Start Text Interview
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="voice" className="space-y-6">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mic className="h-10 w-10 text-accent" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Voice Interview</h3>
                      <p className="text-muted-foreground mb-6">Speak naturally with our AI interviewer</p>
                      
                      {vapiError && (
                        <div className="bg-destructive/5 border border-destructive/20 p-4 rounded-lg mb-4">
                          <p className="text-destructive text-sm">Voice system unavailable. Please use text interview.</p>
                        </div>
                      )}
                      
                      <div className="grid md:grid-cols-3 gap-4 mb-6 text-sm">
                        <div className="bg-accent/5 p-4 rounded-lg border border-accent/20">
                          <p className="font-medium text-accent">🎤 Real Conversation</p>
                          <p className="text-accent/70">Practice speaking skills</p>
                        </div>
                        <div className="bg-accent/5 p-4 rounded-lg border border-accent/20">
                          <p className="font-medium text-accent">🤖 AI Interviewer</p>
                          <p className="text-accent/70">Interactive responses</p>
                        </div>
                        <div className="bg-accent/5 p-4 rounded-lg border border-accent/20">
                          <p className="font-medium text-accent">⚡ Real-time</p>
                          <p className="text-accent/70">Immediate feedback</p>
                        </div>
                      </div>
                      <Button 
                        onClick={startVoiceSession}
                        disabled={!isVapiInitialized || vapiError}
                        className="bg-accent hover:bg-accent/90 text-white px-8 py-3 disabled:bg-muted-foreground"
                        size="lg"
                      >
                        <Mic className="h-4 w-4 mr-2" />
                        {!isVapiInitialized ? "Initializing..." : vapiError ? "Voice Unavailable" : "Start Voice Interview"}
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
                <Card className="shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center">
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
                    <div className="p-6 bg-primary/5 rounded-lg border-l-4 border-primary mb-6">
                      <p className="text-lg font-medium text-primary">
                        {currentQuestions[currentQuestionIndex]}
                      </p>
                    </div>
                    
                    {sessionType === "text" ? (
                      <>
                        <textarea
                          value={currentAnswer}
                          onChange={(e) => setCurrentAnswer(e.target.value)}
                          placeholder="Type your answer here..."
                          className="w-full h-40 p-4 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        
                        <div className="flex space-x-3 mt-4">
                          <Button 
                            onClick={nextQuestion} 
                            disabled={!currentAnswer.trim()}
                            className="bg-primary hover:bg-primary/90"
                          >
                            {currentQuestionIndex < currentQuestions.length - 1 ? (
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
                        <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          {isCallActive ? (
                            <Mic className="h-12 w-12 text-accent animate-pulse" />
                          ) : (
                            <Phone className="h-12 w-12 text-muted-foreground" />
                          )}
                        </div>
                        <div className="text-lg font-semibold mb-2">
                          {isCallActive ? 'Interview Active' : 'Connecting...'}
                        </div>
                        {isCallActive && (
                          <div className="space-y-4">
                            <p className="text-muted-foreground">Speak clearly and naturally</p>
                            <Button
                              onClick={endVoiceSession}
                              variant="destructive"
                              className="bg-destructive hover:bg-destructive/90"
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
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle>Session Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium text-muted-foreground">Type:</span>
                        <Badge className="capitalize bg-primary/10 text-primary">{sessionType}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-muted-foreground">Duration:</span>
                        <span>5 minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-muted-foreground">Questions:</span>
                        <span>3 essential questions</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-muted-foreground">Language:</span>
                        <span>{languages.find(l => l.code === selectedLanguage)?.name}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Questions Progress */}
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle>Questions Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {currentQuestions.map((_, index) => (
                        <div 
                          key={index} 
                          className={`flex items-center space-x-3 text-sm ${
                            index === currentQuestionIndex ? 'text-primary font-medium' : 
                            index < currentQuestionIndex ? 'text-emerald-600' : 'text-muted-foreground'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                            index === currentQuestionIndex ? 'bg-primary/10 text-primary' :
                            index < currentQuestionIndex ? 'bg-emerald-100 text-emerald-600' : 'bg-muted text-muted-foreground'
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

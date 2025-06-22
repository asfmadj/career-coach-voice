import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Mic, MicOff, Phone, PhoneOff, Volume2, AlertCircle, Globe } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Vapi from "@vapi-ai/web";
import { useToast } from "@/hooks/use-toast";

interface VoiceInterviewProps {
  onBack: () => void;
  onComplete: () => void;
  interviewConfig: {
    industry: string;
    level: string;
    type: string;
    duration: string;
  };
}

export const VoiceInterview = ({ onBack, onComplete, interviewConfig }: VoiceInterviewProps) => {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [conversationMessages, setConversationMessages] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const { toast } = useToast();
  const initializeAttempted = useRef(false);

  const languages = [
    { code: "en", name: "English", vapiLocale: "en-US" as const },
    { code: "hi", name: "हिंदी (Hindi)", vapiLocale: "hi" as const }
  ];

  // Initialize Vapi with improved error handling
  useEffect(() => {
    if (initializeAttempted.current) return;
    initializeAttempted.current = true;

    const initializeVapi = async () => {
      try {
        console.log("Initializing Vapi...");
        
        // Request microphone permission first
        try {
          await navigator.mediaDevices.getUserMedia({ audio: true });
          console.log("Microphone permission granted");
        } catch (micError) {
          console.error("Microphone permission denied:", micError);
          toast({
            title: "Microphone Access Required",
            description: "Please allow microphone access to use voice interviews.",
            variant: "destructive",
          });
          setHasError(true);
          return;
        }

        const vapiInstance = new Vapi("8a96f7dc-932d-4ed3-b067-d125fcc61afb");
        setVapi(vapiInstance);
        setIsInitialized(true);

        // Set up event listeners with improved error handling
        vapiInstance.on("call-start", () => {
          console.log("Call started successfully");
          setIsCallActive(true);
          setHasError(false);
          toast({
            title: "Interview Started",
            description: "Your AI interview has begun. Speak clearly!",
          });
        });

        vapiInstance.on("call-end", () => {
          console.log("Call ended");
          setIsCallActive(false);
          toast({
            title: "Interview Completed",
            description: "Your interview session has ended.",
          });
          setTimeout(() => onComplete(), 2000);
        });

        vapiInstance.on("message", (message: any) => {
          console.log("Vapi message:", message);
          
          if (message.type === "transcript" && message.transcript) {
            setConversationMessages(prev => [...prev, `${message.role}: ${message.transcript}`]);
            
            // Check if AI is concluding the interview
            if (message.role === "assistant") {
              const transcript = message.transcript.toLowerCase();
              const conclusionKeywords = [
                "thank you for your time",
                "this concludes our interview",
                "we've reached the end",
                "interview is complete",
                "thank you for joining us today"
              ];
              
              const isConclusion = conclusionKeywords.some(keyword => 
                transcript.includes(keyword)
              );
              
              if (isConclusion) {
                console.log("AI is concluding the interview");
                setTimeout(() => {
                  if (vapi && isCallActive) {
                    vapi.stop();
                  }
                }, 3000); // Give 3 seconds for the message to finish
              }
            }
          }
          
          // Handle conversation-end messages
          if (message.type === "conversation-end" || message.type === "session-complete") {
            console.log("Session completed by AI");
            setTimeout(() => {
              setIsCallActive(false);
              onComplete();
            }, 1000);
          }
        });

        vapiInstance.on("error", (error: any) => {
          console.error("Vapi error:", error);
          setHasError(true);
          setIsCallActive(false);
          toast({
            title: "Voice Interview Error",
            description: "There was an issue with the voice system. Try restarting or use text interview.",
            variant: "destructive",
          });
        });

      } catch (error) {
        console.error("Failed to initialize Vapi:", error);
        setHasError(true);
        toast({
          title: "Voice System Unavailable",
          description: "Voice interviews are currently unavailable. Please use the text interview option.",
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
  }, [onComplete, toast]);

  // Timer for call duration - modified to handle auto-completion
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => {
          const newDuration = prev + 1;
          const maxDurationSeconds = getDurationInMinutes() * 60;
          
          // Auto-end call when time limit reached
          if (newDuration >= maxDurationSeconds) {
            console.log("Time limit reached, ending call");
            if (vapi) {
              vapi.stop();
            }
          }
          
          return newDuration;
        });
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [isCallActive, vapi]);

  const getDurationInMinutes = () => {
    return parseInt(interviewConfig.duration?.split(' ')[0] || '15');
  };

  const startInterview = async () => {
    if (!vapi || !isInitialized) {
      toast({
        title: "Voice System Not Ready",
        description: "Please wait for the system to initialize or use text interview.",
        variant: "destructive",
      });
      return;
    }

    if (hasError) {
      toast({
        title: "System Error",
        description: "Please refresh the page or try the text interview option.",
        variant: "destructive",
      });
      return;
    }

    const durationMinutes = getDurationInMinutes();
    const currentLanguage = languages.find(lang => lang.code === selectedLanguage);

    // Enhanced assistant configuration with language support
    const assistantConfig = {
      name: `${interviewConfig.type} Interview Assistant`,
      model: {
        provider: "openai" as const,
        model: "gpt-4" as const,
        messages: [
          {
            role: "system" as const,
            content: selectedLanguage === "hi" 
              ? `आप एक अनुभवी ${interviewConfig.industry} साक्षात्कारकर्ता हैं जो ${interviewConfig.level} पद के लिए ${interviewConfig.type} साक्षात्कार ले रहे हैं। साक्षात्कार लगभग ${durationMinutes} मिनट का होना चाहिए।

आपकी भूमिका:
- एक गर्मजोशी भरे, पेशेवर अभिवादन के साथ शुरुआत करें
- उद्योग (${interviewConfig.industry}) और स्तर (${interviewConfig.level}) के आधार पर प्रासंगिक साक्षात्कार प्रश्न पूछें
- उत्तरों को ध्यान से सुनें और विचारशील फॉलो-अप प्रश्न पूछें
- बातचीत को प्राकृतिक, पेशेवर और आकर्षक रखें
- साक्षात्कार को ${durationMinutes}-मिनट की समय सीमा में फिट करने के लिए गति निर्धारित करें
- तकनीकी कौशल और सांस्कृतिक फिट दोनों का परीक्षण करने वाले प्रश्न पूछें

महत्वपूर्ण समय:
- ${Math.max(durationMinutes-2, 1)} मिनट के बाद, साक्षात्कार को समाप्त करना शुरू करें
- अंत में कहें "आज आपका समय देने के लिए धन्यवाद। यह हमारा साक्षात्कार समाप्त होता है।"

दिशानिर्देश:
- अपने उत्तर संक्षिप्त लेकिन पेशेवर रखें (50 शब्दों के तहत)
- एक समय में एक प्रश्न पूछें
- उनके उत्तरों में रुचि दिखाएं
- एक सहायक लेकिन पेशेवर स्वर बनाए रखें

शुरुआत इसके साथ करें: "नमस्ते! आज हमारे साथ जुड़ने के लिए धन्यवाद। मैं ${interviewConfig.industry} में आपके बारे में और आपके अनुभव के बारे में जानने के लिए उत्साहित हूं। आइए शुरुआत करते हैं।"`
              : `You are an experienced ${interviewConfig.industry} interviewer conducting a ${interviewConfig.type} interview for a ${interviewConfig.level} position. The interview should last approximately ${durationMinutes} minutes.

Your role:
- Start with a warm, professional greeting
- Ask relevant interview questions based on the industry (${interviewConfig.industry}) and level (${interviewConfig.level})
- Listen carefully to responses and ask thoughtful follow-up questions
- Keep the conversation natural, professional, and engaging
- Pace the interview to fit the ${durationMinutes}-minute timeframe
- Ask questions that test both technical skills and cultural fit
- Provide encouraging feedback when appropriate

IMPORTANT TIMING:
- After ${Math.max(durationMinutes-2, 1)} minutes, start wrapping up the interview
- At the end, say "Thank you for your time today. This concludes our interview. We'll be in touch with next steps."

Guidelines:
- Keep your responses concise but professional (under 50 words)
- Ask one question at a time
- Show interest in their responses
- Maintain a supportive but professional tone
- If they seem nervous, be encouraging

Start with: "Hello! Thank you for joining us today. I'm excited to learn more about you and your experience in ${interviewConfig.industry}. Let's begin with you telling me a bit about yourself and what interests you about this ${interviewConfig.level} position."`
          }
        ],
        temperature: 0.7,
        maxTokens: 150
      },
      voice: {
        provider: "11labs" as const,
        voiceId: selectedLanguage === "hi" ? "pFZP5JQG7iQjIQuC4Bku" : "21m00Tcm4TlvDq8ikWAM",
        stability: 0.8,
        similarityBoost: 0.8
      },
      firstMessage: selectedLanguage === "hi" 
        ? `नमस्ते! आज हमारे साथ जुड़ने के लिए धन्यवाद। मैं ${interviewConfig.industry} में आपके बारे में और आपके अनुभव के बारे में जानने के लिए उत्साहित हूं। आइए शुरुआत करते हैं - क्या आप अपने बारे में थोड़ा बता सकते हैं?`
        : `Hello! Thank you for joining us today. I'm excited to learn more about you and your experience in ${interviewConfig.industry}. Let's begin - can you tell me a bit about yourself and what interests you about this ${interviewConfig.level} position?`,
      transcriber: {
        provider: "deepgram" as const,
        model: "nova-2" as const,
        language: currentLanguage?.vapiLocale || ("en-US" as const)
      }
    };

    try {
      console.log("Starting Vapi call with config:", assistantConfig);
      setConversationMessages([]);
      await vapi.start(assistantConfig);
    } catch (error) {
      console.error("Failed to start interview:", error);
      setHasError(true);
      toast({
        title: "Failed to Start Voice Interview",
        description: "Please check your microphone and internet connection, then try again.",
        variant: "destructive",
      });
    }
  };

  const endInterview = async () => {
    if (vapi && isCallActive) {
      try {
        await vapi.stop();
      } catch (error) {
        console.error("Error ending interview:", error);
        setIsCallActive(false);
      }
    }
  };

  const toggleMute = async () => {
    if (vapi && isCallActive) {
      try {
        await vapi.setMuted(!isMuted);
        setIsMuted(!isMuted);
        toast({
          title: isMuted ? "Unmuted" : "Muted",
          description: isMuted ? "You can now speak" : "Your microphone is muted",
        });
      } catch (error) {
        console.error("Error toggling mute:", error);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button variant="ghost" onClick={onBack} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">AI Voice Interview</h1>
              <p className="text-muted-foreground">Practice your interview skills with our AI interviewer</p>
            </div>
          </div>
          {isCallActive && (
            <div className="text-lg font-mono text-primary">
              {formatTime(callDuration)} / {interviewConfig.duration}
            </div>
          )}
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Interview Configuration */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Interview Configuration</CardTitle>
              <CardDescription>Your personalized interview setup</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">{interviewConfig.industry}</Badge>
                <Badge variant="secondary">{interviewConfig.level}</Badge>
                <Badge variant="secondary">{interviewConfig.type} Interview</Badge>
                <Badge variant="secondary">{interviewConfig.duration}</Badge>
              </div>
              
              {/* Language Selector */}
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <label className="text-sm font-medium">Interview Language:</label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage} disabled={isCallActive}>
                  <SelectTrigger className="w-40">
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
            </CardContent>
          </Card>

          {/* Error State */}
          {hasError && (
            <Card className="mb-8 border-destructive/20 bg-destructive/5">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 text-destructive">
                  <AlertCircle className="h-5 w-5" />
                  <div>
                    <h3 className="font-semibold">Voice Interview Unavailable</h3>
                    <p className="text-sm">There's an issue with the voice system. Please try the text interview instead.</p>
                  </div>
                </div>
                <Button 
                  onClick={onBack}
                  className="mt-4 bg-destructive hover:bg-destructive/90"
                >
                  Try Text Interview
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Voice Interview Interface */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Call Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Volume2 className="h-5 w-5 mr-2" />
                  Voice Interview
                </CardTitle>
                <CardDescription>
                  {!isInitialized 
                    ? "Initializing voice system..."
                    : isCallActive 
                      ? "Interview in progress - speak naturally with the AI interviewer"
                      : "Click start to begin your voice interview session"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Call Status */}
                <div className="text-center py-8">
                  <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 ${
                    isCallActive ? 'bg-primary/10 animate-pulse' : hasError ? 'bg-destructive/10' : 'bg-muted'
                  }`}>
                    {isCallActive ? (
                      <Phone className="h-10 w-10 text-primary" />
                    ) : hasError ? (
                      <AlertCircle className="h-10 w-10 text-destructive" />
                    ) : (
                      <PhoneOff className="h-10 w-10 text-muted-foreground" />
                    )}
                  </div>
                  <div className="text-lg font-semibold mb-2">
                    {!isInitialized ? 'Initializing...' : isCallActive ? 'Interview Active' : hasError ? 'System Error' : 'Ready to Start'}
                  </div>
                  {isCallActive && (
                    <div className="text-2xl font-mono text-primary">
                      {formatTime(callDuration)}
                    </div>
                  )}
                </div>

                {/* Controls */}
                <div className="flex justify-center space-x-4">
                  {!isCallActive && !hasError ? (
                    <Button 
                      onClick={startInterview}
                      disabled={!isInitialized}
                      className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                      size="lg"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      {isInitialized ? 'Start Voice Interview' : 'Initializing...'}
                    </Button>
                  ) : isCallActive ? (
                    <>
                      <Button
                        onClick={toggleMute}
                        variant={isMuted ? "destructive" : "outline"}
                        size="lg"
                      >
                        {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      </Button>
                      <Button
                        onClick={endInterview}
                        variant="destructive"
                        size="lg"
                      >
                        <PhoneOff className="h-4 w-4 mr-2" />
                        End Interview
                      </Button>
                    </>
                  ) : null}
                </div>

                {/* Alternative option */}
                {!isCallActive && (
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <p className="text-sm text-primary/70 mb-2">
                      {hasError ? "Voice system unavailable?" : "Prefer typing?"}
                    </p>
                    <Button 
                      onClick={onBack}
                      variant="outline" 
                      size="sm"
                      className="text-primary border-primary/30"
                    >
                      Try Text Interview Instead
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Live Conversation */}
            <Card>
              <CardHeader>
                <CardTitle>Live Conversation</CardTitle>
                <CardDescription>Real-time transcript of your interview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 overflow-y-auto bg-muted/50 rounded-lg p-4 space-y-2">
                  {conversationMessages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <Mic className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Conversation will appear here once started</p>
                    </div>
                  ) : (
                    conversationMessages.map((message, index) => (
                      <div key={index} className="bg-background p-2 rounded border text-sm">
                        {message}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Instructions */}
          <Card className="mt-8 bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3 text-primary">Interview Tips</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-primary/70">
                <div>
                  <p className="font-medium mb-1">🎤 Audio Quality</p>
                  <p>Ensure you're in a quiet environment with a good microphone</p>
                </div>
                <div>
                  <p className="font-medium mb-1">💬 Speaking</p>
                  <p>Speak clearly and at a normal pace, just like a real interview</p>
                </div>
                <div>
                  <p className="font-medium mb-1">⏱️ Timing</p>
                  <p>Your interview is set for {interviewConfig.duration} - pace yourself accordingly</p>
                </div>
                <div>
                  <p className="font-medium mb-1">🔄 Natural Flow</p>
                  <p>The AI will ask follow-up questions based on your responses</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

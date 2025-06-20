
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mic, MicOff, Phone, PhoneOff, Volume2 } from "lucide-react";
import { useState, useEffect } from "react";
import Vapi from "@vapi-ai/web";
import { useToast } from "@/hooks/use-toast";

interface VoiceInterviewProps {
  onBack: () => void;
  onComplete: () => void;
  interviewConfig: {
    industry: string;
    level: string;
    type: string;
  };
}

export const VoiceInterview = ({ onBack, onComplete, interviewConfig }: VoiceInterviewProps) => {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [conversationMessages, setConversationMessages] = useState<string[]>([]);
  const { toast } = useToast();

  // Initialize Vapi
  useEffect(() => {
    const vapiInstance = new Vapi("your-vapi-public-key"); // Replace with your actual Vapi public key
    setVapi(vapiInstance);

    // Set up event listeners
    vapiInstance.on("call-start", () => {
      console.log("Call started");
      setIsCallActive(true);
      toast({
        title: "Interview Started",
        description: "Your AI interview has begun. Good luck!",
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
      console.log("Message:", message);
      if (message.type === "transcript") {
        setConversationMessages(prev => [...prev, message.transcript]);
      }
    });

    vapiInstance.on("error", (error: any) => {
      console.error("Vapi error:", error);
      toast({
        title: "Error",
        description: "An error occurred during the interview. Please try again.",
        variant: "destructive",
      });
    });

    return () => {
      if (vapiInstance) {
        vapiInstance.stop();
      }
    };
  }, [onComplete, toast]);

  // Timer for call duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  const startInterview = async () => {
    if (!vapi) return;

    // Create interview assistant configuration based on user's selections
    const assistantConfig = {
      name: `${interviewConfig.type} Interview Assistant`,
      model: {
        provider: "openai" as const,
        model: "gpt-3.5-turbo" as const,
        messages: [
          {
            role: "system" as const,
            content: `You are an experienced ${interviewConfig.industry} interviewer conducting a ${interviewConfig.type} interview for a ${interviewConfig.level} position. 

Your role:
- Ask relevant interview questions based on the industry and level
- Listen carefully to responses and ask follow-up questions
- Keep the conversation natural and professional
- The interview should last about 10-15 minutes
- End the interview naturally when you feel you have enough information

Industry: ${interviewConfig.industry}
Level: ${interviewConfig.level}
Type: ${interviewConfig.type}

Start with a warm greeting and introduction, then begin with your first question.`
          }
        ]
      },
      voice: {
        provider: "11labs" as const,
        voiceId: "21m00Tcm4TlvDq8ikWAM" // Professional voice
      }
    };

    try {
      await vapi.start(assistantConfig);
    } catch (error) {
      console.error("Failed to start interview:", error);
      toast({
        title: "Failed to Start",
        description: "Could not start the interview. Please check your microphone permissions.",
        variant: "destructive",
      });
    }
  };

  const endInterview = () => {
    if (vapi) {
      vapi.stop();
    }
  };

  const toggleMute = () => {
    if (vapi) {
      if (isMuted) {
        vapi.setMuted(false);
      } else {
        vapi.setMuted(true);
      }
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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
              <h1 className="text-2xl font-bold">AI Voice Interview</h1>
              <p className="text-gray-600">Practice your interview skills with our AI interviewer</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Interview Configuration */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Interview Configuration</CardTitle>
              <CardDescription>Your personalized interview setup</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{interviewConfig.industry}</Badge>
                <Badge variant="secondary">{interviewConfig.level}</Badge>
                <Badge variant="secondary">{interviewConfig.type} Interview</Badge>
              </div>
            </CardContent>
          </Card>

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
                  {isCallActive 
                    ? "Interview in progress - speak naturally with the AI interviewer"
                    : "Click start to begin your voice interview session"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Call Status */}
                <div className="text-center py-8">
                  <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 ${
                    isCallActive ? 'bg-green-100 animate-pulse' : 'bg-gray-100'
                  }`}>
                    {isCallActive ? (
                      <Phone className="h-10 w-10 text-green-600" />
                    ) : (
                      <PhoneOff className="h-10 w-10 text-gray-400" />
                    )}
                  </div>
                  <div className="text-lg font-semibold mb-2">
                    {isCallActive ? 'Interview Active' : 'Ready to Start'}
                  </div>
                  {isCallActive && (
                    <div className="text-2xl font-mono text-blue-600">
                      {formatTime(callDuration)}
                    </div>
                  )}
                </div>

                {/* Controls */}
                <div className="flex justify-center space-x-4">
                  {!isCallActive ? (
                    <Button 
                      onClick={startInterview}
                      className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                      size="lg"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Start Interview
                    </Button>
                  ) : (
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
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Live Conversation */}
            <Card>
              <CardHeader>
                <CardTitle>Live Conversation</CardTitle>
                <CardDescription>Real-time transcript of your interview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 overflow-y-auto bg-gray-50 rounded-lg p-4 space-y-2">
                  {conversationMessages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <Mic className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Conversation will appear here once started</p>
                    </div>
                  ) : (
                    conversationMessages.map((message, index) => (
                      <div key={index} className="bg-white p-2 rounded border text-sm">
                        {message}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Instructions */}
          <Card className="mt-8 bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3 text-blue-800">Interview Tips</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
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
                  <p>Take your time to think before answering questions</p>
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

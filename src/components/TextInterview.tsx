import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Brain, User, Bot } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface TextInterviewProps {
  onBack: () => void;
  onComplete: () => void;
  interviewConfig: {
    industry: string;
    level: string;
    type: string;
    duration: string;
  };
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export const TextInterview = ({ onBack, onComplete, interviewConfig }: TextInterviewProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [interviewDuration, setInterviewDuration] = useState(0);
  const [isInterviewEnding, setIsInterviewEnding] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const GEMINI_API_KEY = "AIzaSyBwOdkC1Ko_01gCvYzyDXieKrdGHbG7VWA";

  const getDurationInMinutes = () => {
    return parseInt(interviewConfig.duration?.split(' ')[0] || '15');
  };

  // Timer for interview duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isInterviewStarted && !isInterviewEnding) {
      interval = setInterval(() => {
        setInterviewDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isInterviewStarted, isInterviewEnding]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const endInterview = () => {
    setIsInterviewEnding(true);
    setIsInterviewStarted(false);
    
    const endMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: "Thank you for completing this interview session. Your responses have been recorded for analysis.",
      sender: 'ai',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, endMessage]);
    
    setTimeout(() => {
      toast({
        title: "Interview Ended",
        description: "Your interview has been completed successfully.",
      });
      onComplete();
    }, 2000);
  };

  const startInterview = () => {
    setIsInterviewStarted(true);
    const durationMinutes = getDurationInMinutes();
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      content: `Hello! I'm your AI interviewer for today's ${interviewConfig.type} interview in the ${interviewConfig.industry} field for a ${interviewConfig.level} position. We have ${durationMinutes} minutes scheduled for this session.

Let's start with a simple question: Can you tell me a bit about yourself and why you're interested in this role?`,
      sender: 'ai',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
    
    toast({
      title: "Interview Started",
      description: `Your ${interviewConfig.duration} text interview has begun. Good luck!`,
    });
  };

  const sendMessage = async () => {
    if (!currentMessage.trim() || isLoading || isInterviewEnding) return;

    const stopKeywords = ['stop', 'end', 'finish', 'quit', 'terminate', 'conclude'];
    const userWantsToStop = stopKeywords.some(keyword => 
      currentMessage.toLowerCase().includes(keyword) && 
      (currentMessage.toLowerCase().includes('interview') || currentMessage.toLowerCase().includes('session'))
    );

    if (userWantsToStop) {
      endInterview();
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: currentMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = currentMessage;
    setCurrentMessage("");
    setIsLoading(true);

    try {
      console.log('Sending request to Gemini API...');
      const durationMinutes = getDurationInMinutes();
      const conversationHistory = messages.map(msg => `${msg.sender}: ${msg.content}`).join('\n');
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an experienced ${interviewConfig.industry} interviewer conducting a ${interviewConfig.type} interview for a ${interviewConfig.level} position. This is a ${interviewConfig.duration} interview session.

IMPORTANT: Track the conversation carefully. This is message ${messages.length + 1} in the conversation.

Context of the conversation so far:
${conversationHistory}

Latest candidate response: ${messageToSend}

Respond as an interviewer would:
- Ask relevant follow-up questions based on their response
- Provide encouraging feedback when appropriate
- Keep the conversation professional and engaging
- Ask questions that test both technical skills and cultural fit
- Pace the interview appropriately for a ${durationMinutes}-minute session
- If this is getting long (${Math.floor(durationMinutes/2)}+ exchanges), start wrapping up the interview
- Keep responses concise and focused (under 100 words)
- Store detailed feedback about their responses for later analysis

Your response:`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I didn't catch that. Could you please repeat your answer?";

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

      const targetExchanges = Math.max(6, Math.floor(durationMinutes / 3));
      if (messages.length > targetExchanges) {
        setTimeout(() => {
          endInterview();
        }, 2000);
      }

    } catch (error) {
      console.error('Error calling Gemini API:', error);
      toast({
        title: "Error",
        description: `Failed to get AI response: ${error.message}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-2xl animate-float"></div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-white/20">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={onBack} 
                className="mr-4 text-white/90 hover:text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold text-white">AI Text Interview</h1>
                <p className="text-white/80 text-sm">Chat with our AI interviewer through text messages</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isInterviewStarted && (
                <div className="text-right">
                  <div className="text-lg font-mono text-cyan-400 font-bold">
                    {formatTime(interviewDuration)}
                  </div>
                  <div className="text-xs text-white/70">/ {interviewConfig.duration}</div>
                </div>
              )}
              {isInterviewStarted && (
                <Button 
                  onClick={endInterview}
                  variant="destructive"
                  size="sm"
                  disabled={isInterviewEnding}
                >
                  End Interview
                </Button>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Interview Configuration - Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4 bg-white/10 backdrop-blur-md border border-white/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-white">Interview Setup</CardTitle>
                  <CardDescription className="text-xs text-white/80">Your session details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-200 border-blue-500/30">{interviewConfig.industry}</Badge>
                    <Badge variant="secondary" className="text-xs bg-purple-500/20 text-purple-200 border-purple-500/30">{interviewConfig.level}</Badge>
                    <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-200 border-green-500/30">{interviewConfig.type}</Badge>
                    <Badge variant="secondary" className="text-xs bg-orange-500/20 text-orange-200 border-orange-500/30">{interviewConfig.duration}</Badge>
                  </div>
                  {isInterviewStarted && (
                    <div className="mt-4 p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
                      <p className="text-xs text-blue-200 font-medium">Pro Tip</p>
                      <p className="text-xs text-blue-200/90 mt-1">
                        Type "stop interview" or "end interview" at any time to conclude the session.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Chat Interface - Main area */}
            <div className="lg:col-span-3">
              <Card className="h-[70vh] flex flex-col shadow-lg border-0 bg-white/10 backdrop-blur-md border border-white/20">
                <CardHeader className="pb-3 border-b border-white/20 bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                  <CardTitle className="flex items-center text-lg text-white">
                    <Brain className="h-5 w-5 mr-2 text-cyan-400" />
                    Text Interview Chat
                  </CardTitle>
                  <CardDescription className="text-sm text-white/80">
                    {isInterviewStarted 
                      ? `Interview in progress (${interviewConfig.duration}) - type your responses below`
                      : "Click start to begin your text-based interview session"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-0">
                  {!isInterviewStarted ? (
                    <div className="flex-1 flex items-center justify-center p-8">
                      <div className="text-center max-w-md">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                          <Brain className="h-10 w-10 text-cyan-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-white">Ready to Start?</h3>
                        <p className="text-white/80 mb-6 text-sm leading-relaxed">
                          Begin your text-based interview with our AI interviewer. The conversation will feel natural and professional.
                        </p>
                        <Button 
                          onClick={startInterview}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
                          size="lg"
                        >
                          <Brain className="h-4 w-4 mr-2" />
                          Start Interview
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Messages - Scrollable area */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20">
                        {messages.map((message) => (
                          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex items-start space-x-3 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                message.sender === 'user' 
                                  ? 'bg-blue-600' 
                                  : 'bg-purple-600'
                              }`}>
                                {message.sender === 'user' ? (
                                  <User className="h-4 w-4 text-white" />
                                ) : (
                                  <Bot className="h-4 w-4 text-white" />
                                )}
                              </div>
                              <div className={`p-4 rounded-2xl shadow-sm ${
                                message.sender === 'user'
                                  ? 'bg-blue-600 text-white rounded-br-md'
                                  : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-bl-md'
                              }`}>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
                                <div className={`text-xs mt-2 ${
                                  message.sender === 'user' ? 'text-blue-100' : 'text-white/70'
                                }`}>
                                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        {isLoading && (
                          <div className="flex justify-start">
                            <div className="flex items-start space-x-3">
                              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                                <Bot className="h-4 w-4 text-white" />
                              </div>
                              <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-2xl rounded-bl-md shadow-sm">
                                <div className="flex space-x-1">
                                  <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce"></div>
                                  <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                  <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>

                      {/* Input - Fixed at bottom */}
                      <div className="border-t border-white/20 bg-white/5 backdrop-blur-sm p-4">
                        <div className="flex space-x-3">
                          <Input
                            value={currentMessage}
                            onChange={(e) => setCurrentMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your response here..."
                            disabled={isLoading || isInterviewEnding}
                            className="flex-1 bg-white/10 border-white/30 text-white placeholder-white/60 focus:border-cyan-500 focus:ring-cyan-500"
                          />
                          <Button 
                            onClick={sendMessage}
                            disabled={!currentMessage.trim() || isLoading || isInterviewEnding}
                            className="bg-blue-600 hover:bg-blue-700 px-6"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-white/70 mt-2">
                          Press Enter to send • Type "stop interview" to end session
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

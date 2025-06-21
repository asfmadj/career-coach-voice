
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const GEMINI_API_KEY = "AIzaSyBwOdkC1Ko_01gCvYzyDXieKrdGHbG7VWA";

  // Timer for interview duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isInterviewStarted) {
      interval = setInterval(() => {
        setInterviewDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isInterviewStarted]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startInterview = () => {
    setIsInterviewStarted(true);
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      content: `Hello! I'm your AI interviewer for today's ${interviewConfig.type} interview in the ${interviewConfig.industry} field for a ${interviewConfig.level} position. 

Let's start with a simple question: Can you tell me a bit about yourself and why you're interested in this role?`,
      sender: 'ai',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
    
    toast({
      title: "Interview Started",
      description: "Your text-based interview has begun. Good luck!",
    });
  };

  const sendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;

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
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an experienced ${interviewConfig.industry} interviewer conducting a ${interviewConfig.type} interview for a ${interviewConfig.level} position. 

Context of the conversation so far:
${messages.map(msg => `${msg.sender}: ${msg.content}`).join('\n')}

Latest candidate response: ${messageToSend}

Respond as an interviewer would:
- Ask relevant follow-up questions based on their response
- Provide encouraging feedback when appropriate
- Keep the conversation professional and engaging
- Ask questions that test both technical skills and cultural fit
- If this is getting long (10+ exchanges), start wrapping up the interview
- Keep responses concise and focused

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

      // Check if interview should end
      if (messages.length > 15) {
        setTimeout(() => {
          const endMessage: Message = {
            id: (Date.now() + 2).toString(),
            content: "Thank you for taking the time to interview with us today. This concludes our interview session. You've done great! Have a wonderful day!",
            sender: 'ai',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, endMessage]);
          
          setTimeout(() => {
            toast({
              title: "Interview Completed",
              description: "Your text interview has ended successfully.",
            });
            onComplete();
          }, 3000);
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
              <h1 className="text-2xl font-bold">AI Text Interview</h1>
              <p className="text-gray-600">Chat with our AI interviewer through text messages</p>
            </div>
          </div>
          {isInterviewStarted && (
            <div className="text-lg font-mono text-blue-600">
              {formatTime(interviewDuration)}
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
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{interviewConfig.industry}</Badge>
                <Badge variant="secondary">{interviewConfig.level}</Badge>
                <Badge variant="secondary">{interviewConfig.type} Interview</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Chat Interface */}
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                Text Interview Chat
              </CardTitle>
              <CardDescription>
                {isInterviewStarted 
                  ? "Interview in progress - type your responses below"
                  : "Click start to begin your text-based interview session"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {!isInterviewStarted ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Brain className="h-12 w-12 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Ready to Start?</h3>
                    <p className="text-gray-600 mb-6">Begin your text-based interview with our AI interviewer</p>
                    <Button 
                      onClick={startInterview}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      size="lg"
                    >
                      <Brain className="h-4 w-4 mr-2" />
                      Start Interview
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-gray-50 rounded-lg">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex items-start space-x-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
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
                          <div className={`p-3 rounded-lg ${
                            message.sender === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-white border'
                          }`}>
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            <div className={`text-xs mt-1 ${
                              message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {message.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="flex items-start space-x-2">
                          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                            <Bot className="h-4 w-4 text-white" />
                          </div>
                          <div className="bg-white border p-3 rounded-lg">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="flex space-x-2">
                    <Input
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your response..."
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button 
                      onClick={sendMessage}
                      disabled={!currentMessage.trim() || isLoading}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="mt-8 bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3 text-blue-800">Text Interview Tips</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
                <div>
                  <p className="font-medium mb-1">💬 Clear Communication</p>
                  <p>Write clear, concise responses that showcase your skills</p>
                </div>
                <div>
                  <p className="font-medium mb-1">⏱️ Take Your Time</p>
                  <p>Think before you type - there's no rush in text interviews</p>
                </div>
                <div>
                  <p className="font-medium mb-1">📝 Structure Your Answers</p>
                  <p>Use the STAR method for behavioral questions</p>
                </div>
                <div>
                  <p className="font-medium mb-1">🤖 Natural Conversation</p>
                  <p>Treat it like a real conversation with a human interviewer</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

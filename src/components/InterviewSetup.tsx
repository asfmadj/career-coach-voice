import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, User, Briefcase, MessageSquare, Code, BarChart3 } from "lucide-react";
import { useState } from "react";

interface InterviewSetupProps {
  onBack: () => void;
  onComplete: (config: { industry: string; level: string; type: string }) => void;
}

export const InterviewSetup = ({ onBack, onComplete }: InterviewSetupProps) => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");

  const industries = [
    { name: "Software Engineering", icon: "💻", description: "Technical coding and system design questions" },
    { name: "Marketing", icon: "📊", description: "Campaign strategy and analytics focused" },
    { name: "Finance", icon: "💰", description: "Financial modeling and market analysis" },
    { name: "Healthcare", icon: "🏥", description: "Clinical scenarios and patient care" },
    { name: "Sales", icon: "📈", description: "Prospecting, negotiation, and closing techniques" },
    { name: "Consulting", icon: "🎯", description: "Case studies and problem-solving frameworks" }
  ];

  const levels = [
    { name: "Entry Level", description: "0-2 years experience", color: "green" },
    { name: "Mid Level", description: "3-7 years experience", color: "blue" },
    { name: "Senior Level", description: "8+ years experience", color: "purple" }
  ];

  const interviewTypes = [
    { 
      name: "Behavioral", 
      icon: <MessageSquare className="h-6 w-6" />, 
      description: "STAR method questions about past experiences",
      color: "blue"
    },
    { 
      name: "Technical", 
      icon: <Code className="h-6 w-6" />, 
      description: "Skills-based questions and problem solving",
      color: "green"
    },
    { 
      name: "Case Study", 
      icon: <BarChart3 className="h-6 w-6" />, 
      description: "Business scenarios and analytical thinking",
      color: "purple"
    },
    { 
      name: "HR/Cultural", 
      icon: <User className="h-6 w-6" />, 
      description: "Company fit and values alignment",
      color: "orange"
    }
  ];

  const canProceed = selectedIndustry && selectedLevel && selectedType;

  const handleComplete = () => {
    onComplete({
      industry: selectedIndustry,
      level: selectedLevel,
      type: selectedType
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Customize Your Interview</h1>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Industry Selection */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="h-5 w-5 mr-2" />
                Select Your Industry
              </CardTitle>
              <CardDescription>
                Choose the field you're interviewing for to get relevant questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {industries.map((industry) => (
                  <Card 
                    key={industry.name}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedIndustry === industry.name 
                        ? 'ring-2 ring-blue-500 bg-blue-50' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedIndustry(industry.name)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-2">{industry.icon}</div>
                      <h3 className="font-semibold mb-1">{industry.name}</h3>
                      <p className="text-sm text-gray-600">{industry.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Experience Level */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Experience Level
              </CardTitle>
              <CardDescription>
                This helps us tailor the complexity of questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {levels.map((level) => (
                  <Card 
                    key={level.name}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedLevel === level.name 
                        ? 'ring-2 ring-blue-500 bg-blue-50' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedLevel(level.name)}
                  >
                    <CardContent className="p-4 text-center">
                      <Badge className={`mb-2 bg-${level.color}-100 text-${level.color}-800`}>
                        {level.name}
                      </Badge>
                      <p className="text-sm text-gray-600">{level.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Interview Type */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Interview Type
              </CardTitle>
              <CardDescription>
                What type of interview are you preparing for?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {interviewTypes.map((type) => (
                  <Card 
                    key={type.name}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedType === type.name 
                        ? 'ring-2 ring-blue-500 bg-blue-50' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedType(type.name)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg bg-${type.color}-100 text-${type.color}-600`}>
                          {type.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">{type.name}</h3>
                          <p className="text-sm text-gray-600">{type.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Summary and Start */}
          {canProceed && (
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Interview Configuration</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge variant="secondary">{selectedIndustry}</Badge>
                  <Badge variant="secondary">{selectedLevel}</Badge>
                  <Badge variant="secondary">{selectedType} Interview</Badge>
                </div>
                <Button 
                  onClick={handleComplete}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Start Your AI Interview
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

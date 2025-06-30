
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Briefcase, TrendingUp, Clock, Target, Sparkles } from "lucide-react";
import { useState } from "react";

interface InterviewSetupProps {
  onBack: () => void;
  onComplete: (config: { industry: string; level: string; type: string; duration: string }) => void;
}

export const InterviewSetup = ({ onBack, onComplete }: InterviewSetupProps) => {
  const [industry, setIndustry] = useState("");
  const [level, setLevel] = useState("");
  const [type, setType] = useState("");
  const [duration, setDuration] = useState("");

  const industries = [
    "Software Engineering", "Marketing", "Finance", "Healthcare", 
    "Sales", "Consulting", "Data Science", "Design", "Operations", "HR",
    "Product Management", "Customer Success", "Business Development"
  ];

  const levels = [
    "Entry Level (0-2 years)",
    "Mid Level (3-5 years)", 
    "Senior Level (6-10 years)",
    "Executive Level (10+ years)"
  ];

  const types = [
    "Behavioral",
    "Technical", 
    "Case Study",
    "Mixed (Behavioral + Technical)"
  ];

  const durations = [
    "15 minutes",
    "30 minutes",
    "45 minutes", 
    "60 minutes"
  ];

  const handleStart = () => {
    if (industry && level && type && duration) {
      onComplete({ industry, level, type, duration });
    }
  };

  const isComplete = industry && level && type && duration;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden page-enter">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-2xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-indigo-500/5 rounded-full blur-2xl animate-pulse-slow"></div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-6 py-8 max-w-4xl">
          {/* Header */}
          <div className="fade-in mb-8">
            <div className="flex items-center mb-6">
              <Button 
                variant="ghost" 
                onClick={onBack} 
                className="mr-4 text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm rounded-full border border-cyan-500/30 mb-6">
                <Sparkles className="h-4 w-4 mr-2 text-cyan-400" />
                <span className="text-cyan-200 font-medium">Customize Your Interview</span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-4 text-reveal">
                Set Up Your Practice Session
              </h1>
              <p className="text-xl text-white/80 max-w-2xl mx-auto text-reveal">
                Customize your interview experience to match your career goals and get the most relevant practice
              </p>
            </div>
          </div>

          {/* Setup Form */}
          <Card className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-300 slide-up shadow-2xl">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Industry Selection */}
                <div className="space-y-4 fade-in">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg border border-blue-500/30">
                      <Briefcase className="h-5 w-5 text-blue-300" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Industry</h3>
                      <p className="text-sm text-white/70">Choose your target industry</p>
                    </div>
                  </div>
                  <Select value={industry} onValueChange={setIndustry}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white hover:bg-white/15 backdrop-blur-sm">
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800/95 backdrop-blur-md border-slate-600">
                      {industries.map((ind) => (
                        <SelectItem key={ind} value={ind} className="text-white hover:bg-slate-700/50">
                          {ind}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Experience Level */}
                <div className="space-y-4 fade-in">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/30">
                      <TrendingUp className="h-5 w-5 text-green-300" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Experience Level</h3>
                      <p className="text-sm text-white/70">Your career stage</p>
                    </div>
                  </div>
                  <Select value={level} onValueChange={setLevel}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white hover:bg-white/15 backdrop-blur-sm">
                      <SelectValue placeholder="Select your level" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800/95 backdrop-blur-md border-slate-600">
                      {levels.map((lvl) => (
                        <SelectItem key={lvl} value={lvl} className="text-white hover:bg-slate-700/50">
                          {lvl}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Interview Type */}
                <div className="space-y-4 fade-in">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
                      <Target className="h-5 w-5 text-purple-300" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Interview Type</h3>
                      <p className="text-sm text-white/70">Focus area for practice</p>
                    </div>
                  </div>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white hover:bg-white/15 backdrop-blur-sm">
                      <SelectValue placeholder="Select interview type" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800/95 backdrop-blur-md border-slate-600">
                      {types.map((t) => (
                        <SelectItem key={t} value={t} className="text-white hover:bg-slate-700/50">
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Duration */}
                <div className="space-y-4 fade-in">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg border border-orange-500/30">
                      <Clock className="h-5 w-5 text-orange-300" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Duration</h3>
                      <p className="text-sm text-white/70">Practice session length</p>
                    </div>
                  </div>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white hover:bg-white/15 backdrop-blur-sm">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800/95 backdrop-blur-md border-slate-600">
                      {durations.map((dur) => (
                        <SelectItem key={dur} value={dur} className="text-white hover:bg-slate-700/50">
                          {dur}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Start Button */}
              <div className="mt-12 text-center scale-in">
                <Button 
                  onClick={handleStart}
                  disabled={!isComplete}
                  size="lg"
                  className={`px-8 py-4 text-lg font-semibold shadow-xl transition-all duration-300 ${
                    isComplete 
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white hover:shadow-2xl hover:scale-105" 
                      : "bg-white/20 text-white/50 cursor-not-allowed"
                  }`}
                >
                  {isComplete ? (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Start Your Interview Practice
                    </>
                  ) : (
                    "Complete all fields to continue"
                  )}
                </Button>
                {isComplete && (
                  <p className="text-sm text-white/70 mt-4 fade-in">
                    Your personalized interview session is ready to begin
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tips Card - Fixed text visibility */}
          <Card className="mt-8 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-md border border-indigo-500/30 hover:from-indigo-500/25 hover:to-purple-500/25 transition-all duration-300 slide-up">
            <CardHeader>
              <CardTitle className="text-white font-bold flex items-center">
                <span className="text-2xl mr-2">💡</span>
                Pro Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="text-white fade-in">
                  <span className="font-semibold text-indigo-300">Be Specific:</span> 
                  <span className="text-white/90 ml-1">Choose the exact industry and role you're targeting for the most relevant questions.</span>
                </div>
                <div className="text-white fade-in">
                  <span className="font-semibold text-purple-300">Start Small:</span> 
                  <span className="text-white/90 ml-1">Begin with shorter sessions to build confidence, then increase duration.</span>
                </div>
                <div className="text-white fade-in">
                  <span className="font-semibold text-pink-300">Mix It Up:</span> 
                  <span className="text-white/90 ml-1">Try different interview types to prepare for various scenarios.</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

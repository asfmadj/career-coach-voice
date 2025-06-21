import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Brain, Mic, MessageSquare, BarChart3, Award, Clock, Users, CheckCircle, Star, Zap } from "lucide-react";

interface LearnMoreProps {
  onBack: () => void;
}

export const LearnMore = ({ onBack }: LearnMoreProps) => {
  const features = [
    {
      icon: <Brain className="h-8 w-8 text-blue-600" />,
      title: "Advanced AI Technology",
      description: "Our AI interviewer uses cutting-edge natural language processing to provide realistic interview experiences that adapt to your responses in real-time.",
      benefits: ["Dynamic question generation", "Context-aware follow-ups", "Industry-specific scenarios"]
    },
    {
      icon: <Mic className="h-8 w-8 text-green-600" />,
      title: "Voice & Text Interviews",
      description: "Practice with both voice-based and text-based interviews to prepare for any format your potential employer might use.",
      benefits: ["Natural conversation flow", "Speech clarity feedback", "Flexible practice modes"]
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-purple-600" />,
      title: "Detailed Analytics",
      description: "Get comprehensive feedback on your performance with detailed analytics that track your improvement over time.",
      benefits: ["Performance scoring", "Improvement tracking", "Weakness identification"]
    },
    {
      icon: <Award className="h-8 w-8 text-orange-600" />,
      title: "Professional Feedback",
      description: "Receive instant, actionable feedback on your answers including structure, clarity, and professional communication tips.",
      benefits: ["STAR method guidance", "Communication tips", "Industry best practices"]
    }
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Sign Up & Setup",
      description: "Create your account and customize your interview preferences including industry, experience level, and interview type."
    },
    {
      step: 2,
      title: "Practice Sessions",
      description: "Engage in realistic interview sessions with our AI interviewer through voice or text-based conversations."
    },
    {
      step: 3,
      title: "Get Feedback",
      description: "Receive detailed feedback on your performance with specific suggestions for improvement."
    },
    {
      step: 4,
      title: "Track Progress",
      description: "Monitor your improvement over time with comprehensive analytics and performance metrics."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer",
      company: "Tech Startup",
      quote: "Neuro Ask helped me land my dream job! The AI feedback was incredibly accurate and helped me improve my interview skills significantly.",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "Marketing Manager",
      company: "Fortune 500",
      quote: "The voice interview feature was a game-changer. It felt so realistic and prepared me perfectly for my actual interviews.",
      rating: 5
    },
    {
      name: "Emily Johnson",
      role: "Data Scientist",
      company: "Healthcare Corp",
      quote: "The detailed analytics helped me identify my weak areas and focus my preparation. Highly recommended!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Neuro Ask
            </span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Master Your Interview Skills with AI
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Neuro Ask is the most advanced AI-powered interview preparation platform that helps professionals at all levels 
            practice, improve, and succeed in their career interviews.
          </p>
        </section>

        {/* Detailed Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Neuro Ask?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gray-50 rounded-full">
                      {feature.icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4">
                    {feature.description}
                  </CardDescription>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">{step.step}</span>
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{step.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="text-base italic">
                    "{testimonial.quote}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-sm text-gray-500">{testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Ace Your Next Interview?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of professionals who have improved their interview skills with Neuro Ask
            </p>
            <Button 
              size="lg" 
              onClick={onBack}
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

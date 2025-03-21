
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface HeroSectionProps {
  onDemoClick?: () => void;
  onLearnMoreClick?: () => void;
}

const HeroSection = ({ onDemoClick, onLearnMoreClick }: HeroSectionProps) => {
  return (
    <section id="hero" className="relative bg-gray-50 pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
              National Hospital <span className="text-health-600">Management System</span>
            </h1>
            <p className="text-xl text-gray-600">
              Connecting hospitals, police departments, and citizens in a unified healthcare platform for efficient resource management and emergency response.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                className="bg-health-600 hover:bg-health-700"
                asChild
              >
                <Link to="/patient-login">Get Started</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-health-600 text-health-600 hover:bg-health-50"
                onClick={onLearnMoreClick}
              >
                Learn More
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="text-health-600 hover:bg-health-50"
                onClick={onDemoClick}
              >
                Watch Demo
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 rounded-lg overflow-hidden shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1504439468489-c8920d796a29?q=80&w=500&auto=format&fit=crop"
              alt="Healthcare system"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default HeroSection;


import { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Database, Shield, Activity, Users } from "lucide-react";

const HeroSection = () => {
  const statsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const elements = document.querySelectorAll('.reveal');
    elements.forEach(el => observer.observe(el));
    
    return () => {
      elements.forEach(el => observer.unobserve(el));
    };
  }, []);

  return (
    <section className="relative overflow-hidden pt-20 md:pt-[120px] pb-16 md:pb-24 bg-gradient-to-b from-white to-blue-50">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(200,230,255,0.4),transparent_40%)]"></div>
        <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-health-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-gentle"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-health-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-gentle" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="reveal mb-4 inline-flex items-center px-3 py-1 rounded-full bg-health-100 text-health-800 text-sm font-medium">
            <span className="animate-fade-in">Transforming Nigerian Healthcare</span>
          </div>
          
          <h1 className="reveal text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
            <span className="text-gradient">Nationwide Hospital</span> Management System
          </h1>
          
          <p className="reveal text-xl text-gray-600 mb-8 max-w-3xl leading-relaxed">
            A unified digital platform that connects all hospitals in Nigeria, centralizing patient records and transforming healthcare delivery across the nation.
          </p>
          
          <div className="reveal flex flex-col sm:flex-row gap-4 mb-16">
            <Button 
              size="lg" 
              className="bg-health-600 hover:bg-health-700 text-white shadow-md hover:shadow-lg group"
            >
              Request Demo
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-health-600 text-health-700 hover:bg-health-50"
            >
              Learn More
            </Button>
          </div>
          
          <div 
            ref={statsRef}
            className="reveal w-full max-w-4xl p-6 rounded-2xl glass-effect shadow-soft grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
          >
            {[
              { icon: <Database className="h-6 w-6 text-health-600" />, value: "100%", label: "Digital Records" },
              { icon: <Shield className="h-6 w-6 text-health-600" />, value: "Secure", label: "Data Protection" },
              { icon: <Activity className="h-6 w-6 text-health-600" />, value: "Real-time", label: "Health Analytics" },
              { icon: <Users className="h-6 w-6 text-health-600" />, value: "Nationwide", label: "Accessibility" }
            ].map((stat, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="mb-2 p-2 rounded-full bg-health-100">{stat.icon}</div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/80 to-transparent"></div>
    </section>
  );
};

export default HeroSection;

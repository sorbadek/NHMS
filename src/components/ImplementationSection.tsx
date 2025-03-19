
import { useEffect } from 'react';
import { 
  FlaskConical, 
  Globe, 
  Building, 
  Layers 
} from "lucide-react";

const ImplementationSection = () => {
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

  const phases = [
    {
      icon: <FlaskConical className="h-6 w-6" />,
      number: "01",
      title: "Pilot Testing",
      timeframe: "6-12 Months",
      description: "Deploy the NHMS in selected federal and state hospitals. Test biometric verification, data security, and cloud storage. Train healthcare workers on using the system.",
      outcome: "A functional pilot system ready for scaling."
    },
    {
      icon: <Globe className="h-6 w-6" />,
      number: "02",
      title: "Nationwide Rollout",
      timeframe: "1-2 Years",
      description: "Expand the system to all federal and state hospitals. Conduct nationwide training for healthcare workers. Establish partnerships with technology providers for infrastructure support.",
      outcome: "A fully operational system in federal and state hospitals."
    },
    {
      icon: <Building className="h-6 w-6" />,
      number: "03",
      title: "Private Hospital Integration & AI Development",
      timeframe: "2-3 Years",
      description: "Onboard private hospitals and clinics into the NHMS network. Develop AI-powered tools for predictive health analytics and disease prevention.",
      outcome: "A comprehensive healthcare network with advanced analytics capabilities."
    },
    {
      icon: <Layers className="h-6 w-6" />,
      number: "04",
      title: "Full NIMC Integration & Policy Adoption",
      timeframe: "3-5 Years",
      description: "Mandate health-linked NIN registration for all births and deaths. Enable real-time disease tracking and health monitoring for government use. Integrate NHMS data into national health policies and programs.",
      outcome: "A fully integrated system supporting national health goals."
    }
  ];

  return (
    <section id="implementation" className="section-padding bg-white">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="reveal mb-3 inline-flex items-center px-3 py-1 rounded-full bg-health-100 text-health-800 text-sm font-medium">
            <span>Implementation Strategy</span>
          </div>
          <h2 className="reveal text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            A <span className="text-gradient">Phase-Based</span> Approach
          </h2>
          <p className="reveal text-xl text-gray-600 leading-relaxed">
            Our implementation plan spans five years, with carefully planned phases to ensure successful nationwide adoption.
          </p>
        </div>

        <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-2 md:gap-8 lg:gap-12">
          {phases.map((phase, index) => (
            <div 
              key={index} 
              className="reveal relative p-8 rounded-xl bg-white border border-gray-100 shadow-soft transition-all-300 hover:shadow-md hover:border-health-100"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="absolute top-0 right-0 p-2 px-4 bg-health-600 text-white rounded-bl-xl rounded-tr-xl font-medium">
                {phase.timeframe}
              </div>
              <div className="flex items-start mb-6">
                <div className="p-3 rounded-full bg-health-50 text-health-600 mr-4">
                  {phase.icon}
                </div>
                <div>
                  <div className="text-sm font-bold text-health-700 mb-1">Phase {phase.number}</div>
                  <h3 className="text-xl font-semibold text-gray-900">{phase.title}</h3>
                </div>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                {phase.description}
              </p>
              <div className="mt-auto pt-4 border-t border-gray-100">
                <div className="flex items-start">
                  <span className="text-sm font-medium text-gray-500 mr-2">Outcome:</span>
                  <span className="text-sm font-medium text-gray-900">{phase.outcome}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="reveal mt-16 p-8 rounded-2xl bg-gradient-to-r from-health-600 to-health-700 text-white shadow-md">
          <div className="flex flex-col text-center">
            <h3 className="text-2xl font-semibold mb-4">Long-Term Sustainability</h3>
            <p className="text-lg leading-relaxed max-w-3xl mx-auto">
              Beyond the initial five-year implementation, the NHMS is designed for long-term growth and sustainability. The system architecture allows for continuous improvements, technology upgrades, and adaptation to evolving healthcare needs, ensuring that Nigeria's healthcare system remains at the forefront of digital innovation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImplementationSection;

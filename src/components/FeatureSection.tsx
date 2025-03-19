
import { useEffect } from 'react';
import { 
  Database, 
  Globe, 
  Fingerprint, 
  UserCheck, 
  Calendar, 
  Network, 
  ShieldCheck, 
  BarChart4 
} from "lucide-react";

const FeatureSection = () => {
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

  const features = [
    {
      icon: <Database className="h-6 w-6" />,
      title: "Centralized Digital Medical Records",
      description: "Stores and retrieves patient data including birth, illness, treatment, and death records in one secure platform."
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Nationwide Accessibility",
      description: "Doctors can access patient histories from any hospital in Nigeria, ensuring continuity of care."
    },
    {
      icon: <Fingerprint className="h-6 w-6" />,
      title: "Biometric Identification",
      description: "Uses NIN, fingerprint, and iris scans for accurate patient verification across all healthcare facilities."
    },
    {
      icon: <UserCheck className="h-6 w-6" />,
      title: "NIMC Integration",
      description: "Automatically registers newborns and updates records for deceased individuals in the national database."
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Efficient Hospital Operations",
      description: "Digital appointment scheduling, reminders, and resource management to streamline hospital workflows."
    },
    {
      icon: <Network className="h-6 w-6" />,
      title: "Inter-Hospital Networking",
      description: "Connects federal, state, and private hospitals under a unified system for seamless coordination."
    },
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: "Data Security & Compliance",
      description: "Ensures adherence to the Nigeria Data Protection Regulation (NDPR) with robust security protocols."
    },
    {
      icon: <BarChart4 className="h-6 w-6" />,
      title: "Real-Time Health Analytics",
      description: "Provides actionable insights for government health policies and disease tracking nationwide."
    }
  ];

  return (
    <section id="features" className="section-padding bg-white">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="reveal mb-3 inline-flex items-center px-3 py-1 rounded-full bg-health-100 text-health-800 text-sm font-medium">
            <span>Key Features</span>
          </div>
          <h2 className="reveal text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Comprehensive Healthcare <span className="text-gradient">Management Solution</span>
          </h2>
          <p className="reveal text-xl text-gray-600 leading-relaxed">
            Our platform brings together essential features that transform how healthcare is delivered and managed across Nigeria.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="reveal flex flex-col p-6 rounded-xl transition-all-300 bg-white border border-gray-100 shadow-soft hover:shadow-md hover:border-health-100 hover:translate-y-[-5px]"
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <div className="p-3 mb-4 rounded-full bg-health-50 w-fit text-health-600">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="reveal mt-20 p-8 rounded-2xl bg-gradient-to-r from-health-50 to-health-100 shadow-soft">
          <div className="flex flex-col md:flex-row items-center">
            <div className="mb-8 md:mb-0 md:mr-8 flex-shrink-0">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-md">
                <Database className="h-8 w-8 text-health-600" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Smart Data Management</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our system uses advanced encryption and cloud technology to ensure that patient data is both secure and accessible when needed. Healthcare providers can instantly access vital information while maintaining strict privacy controls.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;

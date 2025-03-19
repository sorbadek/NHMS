
import { useEffect } from 'react';
import { 
  LandmarkIcon, 
  Building2, 
  UserCircle, 
  Check 
} from "lucide-react";

const BenefitSection = () => {
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

  const benefitGroups = [
    {
      icon: <LandmarkIcon className="h-8 w-8" />,
      title: "For the Federal Government",
      benefits: [
        "Strengthens Healthcare Infrastructure",
        "Real-Time Health Data for Policy-Making",
        "Improved Disease Tracking and Response",
        "Aligns with Digital Transformation Goals",
        "Supports NIN Expansion and Identity Initiatives"
      ]
    },
    {
      icon: <Building2 className="h-8 w-8" />,
      title: "For Hospitals",
      benefits: [
        "Improved Operational Efficiency",
        "Reduced Paperwork and Administrative Costs",
        "Continuity of Care Across Facilities",
        "Enhanced Data Security Protocols",
        "Better Resource Allocation and Management"
      ]
    },
    {
      icon: <UserCircle className="h-8 w-8" />,
      title: "For Patients",
      benefits: [
        "Convenient Access to Medical Records",
        "Faster Diagnosis and Treatment",
        "Reduced Wait Times and Duplicate Tests",
        "Enhanced Privacy and Data Security",
        "Improved Overall Healthcare Experience"
      ]
    }
  ];

  return (
    <section id="benefits" className="section-padding relative bg-gray-50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute right-0 top-20 w-72 h-72 rounded-full bg-health-100 opacity-40 mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute left-0 bottom-20 w-72 h-72 rounded-full bg-blue-100 opacity-40 mix-blend-multiply filter blur-3xl"></div>
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="reveal mb-3 inline-flex items-center px-3 py-1 rounded-full bg-health-100 text-health-800 text-sm font-medium">
            <span>Stakeholder Benefits</span>
          </div>
          <h2 className="reveal text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Creating Value for <span className="text-gradient">Everyone</span>
          </h2>
          <p className="reveal text-xl text-gray-600 leading-relaxed">
            The NHMS delivers specific benefits to all stakeholders in Nigeria's healthcare ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefitGroups.map((group, index) => (
            <div 
              key={index} 
              className="reveal flex flex-col h-full"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col h-full p-8 rounded-xl bg-white shadow-soft transition-all duration-300 hover:shadow-md border border-gray-100">
                <div className="p-3 mb-6 rounded-full bg-health-50 w-fit text-health-600">
                  {group.icon}
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">{group.title}</h3>
                <ul className="space-y-4 mt-auto">
                  {group.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="flex-shrink-0 p-1 rounded-full bg-health-100 text-health-600 mr-3 mt-0.5">
                        <Check className="h-4 w-4" />
                      </div>
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="reveal mt-16 p-8 rounded-2xl glass-effect shadow-soft">
          <div className="flex flex-col text-center">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Nationwide Impact</h3>
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
              By connecting all stakeholders in Nigeria's healthcare system, the NHMS creates a unified ecosystem that improves outcomes for everyone. From government officials making policy decisions to healthcare providers delivering care and patients receiving treatment, the platform serves as a foundation for a stronger, more responsive healthcare system.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitSection;

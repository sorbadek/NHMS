
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeatureSection from '@/components/FeatureSection';
import BenefitSection from '@/components/BenefitSection';
import ImplementationSection from '@/components/ImplementationSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight } from 'lucide-react';

const Index = () => {
  const [demoOpen, setDemoOpen] = useState(false);
  const [demoStep, setDemoStep] = useState(1);
  const [learnMoreOpen, setLearnMoreOpen] = useState(false);

  useEffect(() => {
    // Initialize intersection observer for animations
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

  useEffect(() => {
    // Add smooth scrolling for anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        const id = target.getAttribute('href')?.substring(1);
        if (!id) return;
        
        const element = document.getElementById(id);
        if (element) {
          e.preventDefault();
          element.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  const handleDemoStart = () => {
    setDemoStep(1);
    setDemoOpen(true);
  };

  const handleNextStep = () => {
    if (demoStep < 5) {
      setDemoStep(demoStep + 1);
    } else {
      setDemoOpen(false);
    }
  };

  const DemoContent = () => {
    switch (demoStep) {
      case 1:
        return (
          <>
            <DialogHeader>
              <DialogTitle>Welcome to the NHMS Portal</DialogTitle>
              <DialogDescription>
                The National Hospital Management System connects hospitals, police, and citizens in a unified platform.
              </DialogDescription>
            </DialogHeader>
            <div className="p-6 space-y-4">
              <p className="text-center text-lg">Step 1 of 5: Introduction</p>
              <div className="flex flex-col items-center gap-4">
                <img src="/placeholder.svg" alt="Demo" className="rounded-lg w-full max-w-lg" />
                <p>The NHMS Portal provides a centralized system for health records, emergency reports, and resource management across the country.</p>
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <DialogHeader>
              <DialogTitle>Patient Portal</DialogTitle>
              <DialogDescription>
                Access your health records and appointments securely
              </DialogDescription>
            </DialogHeader>
            <div className="p-6 space-y-4">
              <p className="text-center text-lg">Step 2 of 5: Patient Features</p>
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium">Health Records Access</h3>
                    <p className="text-sm text-gray-600">View your complete medical history from all healthcare providers</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium">Appointment Management</h3>
                    <p className="text-sm text-gray-600">Schedule and track appointments with any registered hospital</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium">Emergency Information</h3>
                    <p className="text-sm text-gray-600">Access critical health information during emergencies</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <DialogHeader>
              <DialogTitle>Hospital Dashboard</DialogTitle>
              <DialogDescription>
                Comprehensive tools for healthcare providers
              </DialogDescription>
            </DialogHeader>
            <div className="p-6 space-y-4">
              <p className="text-center text-lg">Step 3 of 5: Hospital Features</p>
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium">Patient Management</h3>
                    <p className="text-sm text-gray-600">Complete patient records and treatment history</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium">Staff Management</h3>
                    <p className="text-sm text-gray-600">Track and manage hospital staff credentials and assignments</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium">Resource Management</h3>
                    <p className="text-sm text-gray-600">Monitor and allocate hospital resources efficiently</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case 4:
        return (
          <>
            <DialogHeader>
              <DialogTitle>Police Department Portal</DialogTitle>
              <DialogDescription>
                Tools for emergency management and reporting
              </DialogDescription>
            </DialogHeader>
            <div className="p-6 space-y-4">
              <p className="text-center text-lg">Step 4 of 5: Police Features</p>
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium">Accident Reports</h3>
                    <p className="text-sm text-gray-600">File and manage accident reports with direct hospital integration</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium">Emergency Coordination</h3>
                    <p className="text-sm text-gray-600">Coordinate emergency responses with healthcare providers</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium">Victim Identification</h3>
                    <p className="text-sm text-gray-600">Quick access to identify accident victims through the system</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case 5:
        return (
          <>
            <DialogHeader>
              <DialogTitle>Get Started Today</DialogTitle>
              <DialogDescription>
                Join the National Hospital Management System
              </DialogDescription>
            </DialogHeader>
            <div className="p-6 space-y-4">
              <p className="text-center text-lg">Step 5 of 5: Registration</p>
              <div className="text-center space-y-4">
                <p>Ready to get started? Register as a patient to access your health records or register your organization to join the network.</p>
                <div className="flex justify-center gap-4 mt-4">
                  <Link to="/patient-register">
                    <Button>Register as Patient</Button>
                  </Link>
                  <Link to="/hospital-registration">
                    <Button variant="outline">Register Organization</Button>
                  </Link>
                </div>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection 
          onDemoClick={handleDemoStart}
          onLearnMoreClick={() => setLearnMoreOpen(true)}
        />
        <FeatureSection />
        <BenefitSection />
        <ImplementationSection />
        <ContactSection />

        {/* Demo/Onboarding Dialog */}
        <Dialog open={demoOpen} onOpenChange={setDemoOpen}>
          <DialogContent className="max-w-3xl">
            <DemoContent />
            <div className="flex justify-end mt-4">
              <Button onClick={handleNextStep}>
                {demoStep < 5 ? (
                  <>Next <ArrowRight className="ml-2 h-4 w-4" /></>
                ) : (
                  "Finish"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Learn More Dialog */}
        <Dialog open={learnMoreOpen} onOpenChange={setLearnMoreOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">National Hospital Management System Documentation</DialogTitle>
              <DialogDescription>
                Comprehensive guide to using the NHMS Portal
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 p-2">
              <section className="space-y-3">
                <h2 className="text-xl font-bold text-health-700">System Overview</h2>
                <p>The National Hospital Management System (NHMS) is a comprehensive platform designed to facilitate seamless coordination between healthcare providers, police departments, and citizens. The system centralizes health records, accident reporting, and resource management under a unified interface.</p>
                
                <h3 className="text-lg font-semibold mt-4">Core Principles</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Every citizen is registered as a patient with a universal health ID</li>
                  <li>Healthcare providers can access patient records with appropriate permissions</li>
                  <li>Police departments can log accident reports that automatically alert relevant hospitals</li>
                  <li>Resource management allows for optimal allocation during emergencies</li>
                  <li>Real-time communication ensures timely response and coordination</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-health-700">User Roles</h2>
                
                <h3 className="text-lg font-semibold">Patient</h3>
                <p>All citizens are registered as patients and can:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>View their complete medical history</li>
                  <li>Schedule appointments with healthcare providers</li>
                  <li>Access emergency information</li>
                  <li>Communicate with healthcare providers</li>
                </ul>
                
                <h3 className="text-lg font-semibold mt-4">Hospital Staff</h3>
                <p>Healthcare workers registered under a hospital can:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Access patient records with appropriate permissions</li>
                  <li>Update medical records</li>
                  <li>Manage appointments</li>
                  <li>Coordinate with other facilities</li>
                  <li>Manage hospital resources</li>
                </ul>
                
                <h3 className="text-lg font-semibold mt-4">Police Officers</h3>
                <p>Law enforcement personnel registered under a police department can:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Create and manage accident reports</li>
                  <li>Identify victims through the system</li>
                  <li>Coordinate emergency responses with hospitals</li>
                  <li>Track incident status and outcomes</li>
                </ul>
                
                <h3 className="text-lg font-semibold mt-4">Administrators</h3>
                <p>System administrators manage:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Hospital registrations</li>
                  <li>Police department registrations</li>
                  <li>System-wide configurations</li>
                  <li>Data integrity and security</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-health-700">Key System Features</h2>
                
                <h3 className="text-lg font-semibold">Universal Health Records</h3>
                <p>The NHMS maintains centralized health records for all citizens, ensuring that critical medical information is available to authorized healthcare providers regardless of which facility the patient visits.</p>
                
                <h3 className="text-lg font-semibold mt-4">Accident Response Coordination</h3>
                <p>When police officers file accident reports, the system automatically alerts nearby hospitals, providing real-time information about incoming patients and injury details to help facilities prepare appropriate responses.</p>
                
                <h3 className="text-lg font-semibold mt-4">Resource Management</h3>
                <p>Hospitals can track and manage resources such as beds, equipment, and medical supplies. This information can be shared with other facilities during emergency situations to optimize resource allocation.</p>
                
                <h3 className="text-lg font-semibold mt-4">Real-time Communication</h3>
                <p>The integrated messaging system enables secure, real-time communication between patients, healthcare providers, and emergency services, ensuring efficient coordination and information sharing.</p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-health-700">Getting Started</h2>
                
                <h3 className="text-lg font-semibold">Patient Registration</h3>
                <p>Citizens can register as patients through the patient registration portal. This creates a universal health account that can be used across all healthcare facilities in the network.</p>
                
                <h3 className="text-lg font-semibold mt-4">Organization Registration</h3>
                <p>Hospitals and police departments can register through their respective registration portals. Once approved, they can add staff members to the system.</p>
                
                <h3 className="text-lg font-semibold mt-4">Staff Registration</h3>
                <p>Hospital administrators and police chiefs can register staff members, who must already have patient accounts. This dual-account system ensures that all users have a unified identity while maintaining role-specific access.</p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-health-700">Security and Privacy</h2>
                <p>The NHMS implements robust security measures and adheres to strict privacy policies:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Role-based access control ensures users only access information necessary for their duties</li>
                  <li>End-to-end encryption protects all communications</li>
                  <li>Comprehensive audit trails track all system access and changes</li>
                  <li>Regular security assessments maintain system integrity</li>
                  <li>All data handling complies with relevant healthcare privacy regulations</li>
                </ul>
              </section>

              <div className="flex justify-center mt-8">
                <Link to="/documentation">
                  <Button variant="outline" size="lg">
                    View Complete Documentation
                  </Button>
                </Link>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
};

export default Index;

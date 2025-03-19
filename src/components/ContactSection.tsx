
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle, Mail, Phone, MapPin } from "lucide-react";

const ContactSection = () => {
  const { toast } = useToast();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    organization: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Inquiry Submitted",
        description: "Thank you for your interest. Our team will contact you shortly.",
        duration: 5000,
      });
      setFormState({
        name: '',
        email: '',
        organization: '',
        message: '',
      });
    }, 1500);
  };

  const contactInfo = [
    { icon: <Mail className="h-5 w-5" />, label: "Email", value: "info@nhms-nigeria.gov.ng" },
    { icon: <Phone className="h-5 w-5" />, label: "Phone", value: "+234 (0) 123 456 7890" },
    { icon: <MapPin className="h-5 w-5" />, label: "Address", value: "Federal Ministry of Health, Abuja, Nigeria" },
  ];

  return (
    <section id="contact" className="section-padding bg-gray-50">
      <div className="container mx-auto">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="lg:sticky lg:top-24">
              <div className="reveal mb-3 inline-flex items-center px-3 py-1 rounded-full bg-health-100 text-health-800 text-sm font-medium">
                <span>Get In Touch</span>
              </div>
              <h2 className="reveal text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Interested in <span className="text-gradient">Implementing NHMS?</span>
              </h2>
              <p className="reveal text-xl text-gray-600 mb-8 leading-relaxed">
                Contact our team to learn more about how the Nationwide Hospital Management System can transform healthcare delivery in your facility or region.
              </p>
              
              <div className="reveal space-y-6 mb-8">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="p-2 rounded-full bg-health-100 text-health-600 mr-4">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-0.5">{item.label}</div>
                      <div className="text-gray-900 font-medium">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="reveal p-6 rounded-xl bg-white shadow-soft">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Benefits For Stakeholders</h3>
                <ul className="space-y-3">
                  {[
                    "Centralized digital medical records",
                    "Seamless inter-hospital data access",
                    "Enhanced policy-making capabilities",
                    "Reduced administrative burden",
                    "Improved patient experience"
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-health-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="reveal">
              <div className="p-8 rounded-xl bg-white shadow-soft border border-gray-100">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Request Information</h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleInputChange}
                      className="bg-gray-50 border-gray-200 focus:border-health-500 focus:ring-health-500"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formState.email}
                      onChange={handleInputChange}
                      className="bg-gray-50 border-gray-200 focus:border-health-500 focus:ring-health-500"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
                      Organization
                    </label>
                    <Input
                      id="organization"
                      name="organization"
                      value={formState.organization}
                      onChange={handleInputChange}
                      className="bg-gray-50 border-gray-200 focus:border-health-500 focus:ring-health-500"
                      placeholder="Enter your organization name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formState.message}
                      onChange={handleInputChange}
                      className="bg-gray-50 border-gray-200 focus:border-health-500 focus:ring-health-500 min-h-[120px]"
                      placeholder="Tell us about your needs or questions"
                      required
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-health-600 hover:bg-health-700 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Inquiry"}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

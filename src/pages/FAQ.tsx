
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowLeft, Search } from "lucide-react";

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const faqCategories = [
    {
      category: "General",
      questions: [
        {
          question: "What is the National Hospital Management System?",
          answer: "The National Hospital Management System (NHMS) is a comprehensive platform designed to facilitate seamless coordination between healthcare providers, police departments, and citizens. The system centralizes health records, accident reporting, and resource management under a unified interface."
        },
        {
          question: "Who can use the NHMS platform?",
          answer: "The NHMS platform serves various user groups including citizens (patients), healthcare providers, hospital administrators, police departments, and emergency services. Each user group has specific access levels and functionality tailored to their needs."
        },
        {
          question: "Is the NHMS platform secure?",
          answer: "Yes, the NHMS platform implements robust security measures including end-to-end encryption, multi-factor authentication, role-based access controls, and comprehensive audit trails to ensure the confidentiality, integrity, and availability of sensitive health information."
        }
      ]
    },
    {
      category: "Patient Accounts",
      questions: [
        {
          question: "How do I register as a patient?",
          answer: "To register as a patient, visit the Patient Registration page and complete the form with your personal information, contact details, and basic health information. You'll need to verify your email address to activate your account."
        },
        {
          question: "Can I access my medical records from different hospitals?",
          answer: "Yes, one of the key benefits of NHMS is the centralization of health records. Once registered, you can access your medical records from all healthcare providers within the NHMS network."
        },
        {
          question: "How do I schedule an appointment with a healthcare provider?",
          answer: "You can schedule appointments through the Patient Portal. Navigate to the Appointments section, select your preferred healthcare facility and provider, choose an available time slot, and confirm your appointment."
        },
        {
          question: "What should I do if I forget my password?",
          answer: "If you forget your password, click on the 'Forgot Password' link on the login page. Enter your registered email address, and you'll receive instructions to reset your password."
        }
      ]
    },
    {
      category: "Hospital Registration",
      questions: [
        {
          question: "How can a hospital join the NHMS network?",
          answer: "Hospitals can register through the Hospital Registration page. You'll need to provide hospital details, license information, and administrator contact information. After submission, the registration will be reviewed by NHMS administrators for approval."
        },
        {
          question: "What are the benefits for hospitals joining NHMS?",
          answer: "Hospitals benefit from centralized patient records, efficient resource management, streamlined emergency coordination with police departments, comprehensive reporting tools, and improved patient engagement through the platform."
        },
        {
          question: "How do hospital administrators add staff members?",
          answer: "After hospital registration approval, administrators can add staff members through the Staff Management section of the Hospital Dashboard. Staff members must already have patient accounts, which will be linked to their professional roles."
        }
      ]
    },
    {
      category: "Police Department Registration",
      questions: [
        {
          question: "How can a police department register on NHMS?",
          answer: "Police departments can register through the Police Registration page. The process requires providing department details, jurisdiction information, and administrator contact information. The registration will be reviewed by NHMS administrators for approval."
        },
        {
          question: "How does NHMS facilitate accident reporting?",
          answer: "NHMS provides a dedicated module for police officers to file comprehensive accident reports. These reports automatically alert relevant hospitals based on location, providing real-time information about incoming patients and injury details."
        },
        {
          question: "Can police officers identify accident victims through NHMS?",
          answer: "Yes, authorized police officers can search the patient database using identifying information to help identify accident victims and access critical medical information necessary for emergency response."
        }
      ]
    },
    {
      category: "Technical Support",
      questions: [
        {
          question: "What browsers are supported by NHMS?",
          answer: "NHMS supports the current and previous major releases of Chrome, Firefox, Safari, and Edge browsers. For the best experience, we recommend using the latest version of your preferred browser."
        },
        {
          question: "Is there a mobile app for NHMS?",
          answer: "Yes, NHMS is available as a mobile app for both iOS and Android devices. You can download the app from the respective app stores and log in with your existing account credentials."
        },
        {
          question: "How do I report technical issues with the platform?",
          answer: "You can report technical issues through the Support page. Provide a detailed description of the issue, including steps to reproduce it, and our technical support team will assist you."
        },
        {
          question: "How do I update my contact information?",
          answer: "You can update your contact information through your account profile. Log in, navigate to the Profile section, update your information, and save the changes."
        }
      ]
    }
  ];

  // Filter FAQs based on search query
  const filteredFAQs = searchQuery 
    ? faqCategories.map(category => ({
        ...category,
        questions: category.questions.filter(q => 
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
          q.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.questions.length > 0)
    : faqCategories;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-4 px-4 border-b">
        <div className="container max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-health-600 text-white flex items-center justify-center font-bold">
                N
              </div>
              <span className="font-semibold text-lg">NHMS Portal</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto py-8 px-4">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
            <p className="text-gray-600">Find answers to commonly asked questions about the National Hospital Management System</p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search FAQs..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Card>
            <CardContent className="p-6">
              {filteredFAQs.length > 0 ? (
                filteredFAQs.map((category, index) => (
                  <div key={index} className={index > 0 ? "mt-8" : ""}>
                    <h2 className="text-xl font-semibold mb-4">{category.category}</h2>
                    <Accordion type="single" collapsible className="w-full">
                      {category.questions.map((faq, faqIndex) => (
                        <AccordionItem key={faqIndex} value={`${category.category}-${faqIndex}`}>
                          <AccordionTrigger className="text-left">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-gray-600">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No FAQs found matching your search.</p>
                  <Button 
                    variant="link" 
                    onClick={() => setSearchQuery("")}
                    className="mt-2"
                  >
                    Clear search and show all FAQs
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="bg-health-50 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Still have questions?</h2>
            <p className="text-gray-600 mb-4">Our support team is here to help you with any questions or issues.</p>
            <Link to="/support">
              <Button>Contact Support</Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t py-6 mt-12">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} National Hospital Management System. All rights reserved.
            </div>
            <div className="flex gap-4">
              <Link to="/privacy-policy" className="text-sm text-gray-600 hover:text-health-600">Privacy Policy</Link>
              <Link to="/terms-of-service" className="text-sm text-gray-600 hover:text-health-600">Terms of Service</Link>
              <Link to="/faq" className="text-sm text-gray-600 hover:text-health-600">FAQ</Link>
              <Link to="/support" className="text-sm text-gray-600 hover:text-health-600">Support</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FAQ;

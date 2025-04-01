
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Shield, 
  Users, 
  Calendar, 
  FileMedical, 
  AlertTriangle, 
  Hospital, 
  UserPlus, 
  ChevronRight,
  UserCog,
  Building,
  BookOpen
} from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function Documentation() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                NHMS Documentation
              </h1>
              <p className="text-xl text-gray-600">
                Everything you need to know about the National Healthcare Management System
              </p>
            </div>
            
            <Tabs defaultValue="overview" className="mb-12">
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="overview" className="text-base">
                  <FileText className="mr-2 h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="users" className="text-base">
                  <Users className="mr-2 h-4 w-4" />
                  User Guides
                </TabsTrigger>
                <TabsTrigger value="api" className="text-base">
                  <Shield className="mr-2 h-4 w-4" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="faqs" className="text-base">
                  <BookOpen className="mr-2 h-4 w-4" />
                  FAQs
                </TabsTrigger>
              </TabsList>
              
              {/* Overview Tab Content */}
              <TabsContent value="overview" className="space-y-8">
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-2xl font-semibold mb-4">System Overview</h2>
                    <p className="text-gray-700 mb-4">
                      The National Healthcare Management System (NHMS) is a centralized platform designed to integrate healthcare services, emergency response, and patient data across Nigeria. Our mission is to improve healthcare outcomes through digital transformation of healthcare delivery.
                    </p>
                    <p className="text-gray-700 mb-4">
                      NHMS connects hospitals, police departments, and patients in a unified ecosystem that enables:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                      <li>Centralized electronic medical records accessible across healthcare facilities</li>
                      <li>Efficient appointment scheduling and patient management</li>
                      <li>Integrated emergency response coordination between hospitals and police</li>
                      <li>Comprehensive administrative tools for healthcare facilities</li>
                      <li>Secure patient portals for accessing medical information</li>
                    </ul>
                    
                    <h3 className="text-xl font-semibold mb-3">Key Components</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="border p-4 rounded-md">
                        <div className="flex items-center mb-2">
                          <Hospital className="h-5 w-5 text-health-600 mr-2" />
                          <h4 className="font-medium">Hospital Management</h4>
                        </div>
                        <p className="text-sm text-gray-600">
                          Complete tools for hospitals to manage staff, patients, resources, and operations.
                        </p>
                      </div>
                      
                      <div className="border p-4 rounded-md">
                        <div className="flex items-center mb-2">
                          <UserPlus className="h-5 w-5 text-health-600 mr-2" />
                          <h4 className="font-medium">Patient Portal</h4>
                        </div>
                        <p className="text-sm text-gray-600">
                          Secure access for patients to manage appointments, view medical records, and communicate with providers.
                        </p>
                      </div>
                      
                      <div className="border p-4 rounded-md">
                        <div className="flex items-center mb-2">
                          <AlertTriangle className="h-5 w-5 text-health-600 mr-2" />
                          <h4 className="font-medium">Emergency Response</h4>
                        </div>
                        <p className="text-sm text-gray-600">
                          Coordination platform for accident reporting and emergency medical services.
                        </p>
                      </div>
                      
                      <div className="border p-4 rounded-md">
                        <div className="flex items-center mb-2">
                          <Shield className="h-5 w-5 text-health-600 mr-2" />
                          <h4 className="font-medium">Police Interface</h4>
                        </div>
                        <p className="text-sm text-gray-600">
                          Tools for police to report accidents, coordinate with hospitals, and track emergency cases.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-2xl font-semibold mb-4">System Architecture</h2>
                    <p className="text-gray-700 mb-4">
                      NHMS is built on a secure, cloud-based infrastructure that ensures data privacy, high availability, and real-time access across the country. The system employs role-based access control to ensure users can only access information relevant to their responsibilities.
                    </p>
                    
                    <h3 className="text-xl font-semibold mb-3">Technology Stack</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>React frontend for responsive user interfaces</li>
                      <li>Secure API backend with comprehensive authentication</li>
                      <li>PostgreSQL database for reliable data storage</li>
                      <li>Real-time notifications for critical updates</li>
                      <li>End-to-end encryption for sensitive patient data</li>
                      <li>Responsive design for access on various devices</li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* User Guides Tab Content */}
              <TabsContent value="users" className="space-y-8">
                <Card>
                  <CardContent className="pt-6 space-y-6">
                    <div>
                      <h2 className="text-2xl font-semibold mb-3">Patient User Guide</h2>
                      <p className="text-gray-700 mb-4">
                        As a patient, you can register for an account, book appointments, view your medical records, and communicate with healthcare providers.
                      </p>
                      <div className="space-y-2 mb-4">
                        <h3 className="text-lg font-medium">Getting Started</h3>
                        <ol className="list-decimal list-inside space-y-1 text-gray-700 pl-2">
                          <li>Register for a patient account via the "Register as Patient" link</li>
                          <li>Complete your personal and medical information</li>
                          <li>Log in to access your patient dashboard</li>
                          <li>Schedule appointments and view your health records</li>
                        </ol>
                      </div>
                      <Link to="/patient-register">
                        <Button variant="outline" className="flex items-center gap-2">
                          Patient Registration Guide
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                    
                    <div className="border-t pt-6">
                      <h2 className="text-2xl font-semibold mb-3">Hospital Staff Guide</h2>
                      <p className="text-gray-700 mb-4">
                        Hospital staff can manage patient records, appointments, resources, and coordinate with other departments.
                      </p>
                      <div className="space-y-2 mb-4">
                        <h3 className="text-lg font-medium">Key Features</h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-700 pl-2">
                          <li>Comprehensive patient management</li>
                          <li>Appointment scheduling and management</li>
                          <li>Electronic medical records</li>
                          <li>Resource management</li>
                          <li>Staff coordination</li>
                        </ul>
                      </div>
                      <Link to="/documentation">
                        <Button variant="outline" className="flex items-center gap-2">
                          Hospital Staff Guide
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                    
                    <div className="border-t pt-6">
                      <h2 className="text-2xl font-semibold mb-3">Police Department Guide</h2>
                      <p className="text-gray-700 mb-4">
                        Police officers can report accidents, coordinate with hospitals, and track emergency cases.
                      </p>
                      <div className="space-y-2 mb-4">
                        <h3 className="text-lg font-medium">Key Features</h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-700 pl-2">
                          <li>Accident reporting system</li>
                          <li>Emergency coordination with hospitals</li>
                          <li>Victim tracking</li>
                          <li>Analytics and reporting</li>
                        </ul>
                      </div>
                      <Link to="/documentation">
                        <Button variant="outline" className="flex items-center gap-2">
                          Police User Guide
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                    
                    <div className="border-t pt-6">
                      <h2 className="text-2xl font-semibold mb-3">Administrator Guide</h2>
                      <p className="text-gray-700 mb-4">
                        System administrators can manage all aspects of the NHMS platform, including users, facilities, and system settings.
                      </p>
                      <div className="space-y-2 mb-4">
                        <h3 className="text-lg font-medium">Key Features</h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-700 pl-2">
                          <li>User management across all roles</li>
                          <li>Hospital and facility administration</li>
                          <li>System configuration and settings</li>
                          <li>Audit logs and security monitoring</li>
                          <li>Analytics and reporting dashboards</li>
                        </ul>
                      </div>
                      <Link to="/documentation">
                        <Button variant="outline" className="flex items-center gap-2">
                          Administrator Guide
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Security Tab Content */}
              <TabsContent value="api" className="space-y-8">
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-2xl font-semibold mb-4">Security & Privacy</h2>
                    <p className="text-gray-700 mb-4">
                      The NHMS platform prioritizes data security and patient privacy in accordance with Nigerian health data protection regulations and international standards.
                    </p>
                    
                    <h3 className="text-xl font-semibold mb-3">Security Measures</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                      <li>End-to-end encryption for sensitive patient data</li>
                      <li>Role-based access control (RBAC) system</li>
                      <li>Two-factor authentication for sensitive operations</li>
                      <li>Regular security audits and penetration testing</li>
                      <li>Comprehensive audit logging for all operations</li>
                      <li>Data backups and disaster recovery planning</li>
                    </ul>
                    
                    <h3 className="text-xl font-semibold mb-3">Privacy Compliance</h3>
                    <p className="text-gray-700 mb-4">
                      NHMS is designed to comply with Nigerian healthcare data protection regulations and incorporates principles from international standards like HIPAA and GDPR:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                      <li>Patient consent management for data sharing</li>
                      <li>Data minimization principles</li>
                      <li>Clear data retention policies</li>
                      <li>Breach notification procedures</li>
                      <li>Patient rights to access and control their data</li>
                    </ul>
                    
                    <Link to="/privacy-policy">
                      <Button className="flex items-center gap-2">
                        <Shield className="mr-2 h-4 w-4" />
                        View Full Privacy Policy
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* FAQs Tab Content */}
              <TabsContent value="faqs" className="space-y-8">
                <Card>
                  <CardContent className="pt-6 space-y-6">
                    <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
                    
                    <div className="space-y-5">
                      <div>
                        <h3 className="text-lg font-medium mb-2">How do I register as a patient?</h3>
                        <p className="text-gray-700">
                          You can register through the "Register as Patient" button on the homepage or directly navigate to the patient registration page. You'll need to provide your personal information, contact details, and basic medical information.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">How are my medical records kept secure?</h3>
                        <p className="text-gray-700">
                          All medical records are encrypted and protected through a comprehensive security system. Only authorized healthcare providers with appropriate permissions can access your records, and all access is logged and audited.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">How do I register my hospital with the system?</h3>
                        <p className="text-gray-700">
                          Hospital administrators can register their facilities through the "Hospital Registration" page. You'll need to provide hospital information, licensing details, and contact information. Once registered, you'll be able to add staff and begin using the system.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">How do police officers use the system for accident reporting?</h3>
                        <p className="text-gray-700">
                          Police officers can log in to the system and access the Accident Reporting module to document accidents, identify victims, and coordinate with nearby hospitals for emergency response. The system automatically notifies relevant hospitals based on location and severity.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Can I schedule appointments with any hospital in the system?</h3>
                        <p className="text-gray-700">
                          Yes, patients can schedule appointments with any hospital or healthcare provider registered in the system. You can search for facilities by location, specialty, or provider name and book available appointment slots directly through the portal.
                        </p>
                      </div>
                    </div>
                    
                    <div className="border-t pt-6">
                      <p className="text-gray-700 mb-4">
                        Have more questions? Visit our comprehensive FAQ page or contact support for assistance.
                      </p>
                      <div className="flex flex-wrap gap-4">
                        <Link to="/faq">
                          <Button variant="outline" className="flex items-center gap-2">
                            View All FAQs
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link to="/support">
                          <Button variant="outline" className="flex items-center gap-2">
                            Contact Support
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="bg-health-50 border border-health-200 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-3 text-health-800">Need Additional Help?</h2>
              <p className="text-gray-700 mb-4">
                Our support team is available to assist you with any questions or issues you may have about using the NHMS platform.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/support">
                  <Button className="bg-health-600 hover:bg-health-700">
                    Contact Support
                  </Button>
                </Link>
                <Link to="/faq">
                  <Button variant="outline">
                    View FAQs
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

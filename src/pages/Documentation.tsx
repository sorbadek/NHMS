
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Book, Users, Hospital, Shield, FileText, MessageSquare } from "lucide-react";

const Documentation = () => {
  const [activeTab, setActiveTab] = useState("overview");

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

      <main className="container max-w-7xl mx-auto py-8 px-4">
        <div className="flex flex-col gap-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Documentation</h1>
            <p className="text-gray-600">Comprehensive guide to the National Hospital Management System</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex">
              <div className="hidden md:block min-w-[220px] pr-8">
                <div className="sticky top-8">
                  <TabsList className="flex flex-col w-full h-auto gap-2 bg-transparent p-0">
                    <TabsTrigger
                      value="overview"
                      className="w-full justify-start data-[state=active]:bg-health-50 data-[state=active]:text-health-700"
                    >
                      <Book className="h-4 w-4 mr-2" />
                      Overview
                    </TabsTrigger>
                    <TabsTrigger
                      value="users"
                      className="w-full justify-start data-[state=active]:bg-health-50 data-[state=active]:text-health-700"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      User Roles
                    </TabsTrigger>
                    <TabsTrigger
                      value="hospitals"
                      className="w-full justify-start data-[state=active]:bg-health-50 data-[state=active]:text-health-700"
                    >
                      <Hospital className="h-4 w-4 mr-2" />
                      Hospital Portal
                    </TabsTrigger>
                    <TabsTrigger
                      value="police"
                      className="w-full justify-start data-[state=active]:bg-health-50 data-[state=active]:text-health-700"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Police Portal
                    </TabsTrigger>
                    <TabsTrigger
                      value="patients"
                      className="w-full justify-start data-[state=active]:bg-health-50 data-[state=active]:text-health-700"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Patient Portal
                    </TabsTrigger>
                    <TabsTrigger
                      value="communication"
                      className="w-full justify-start data-[state=active]:bg-health-50 data-[state=active]:text-health-700"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Communication
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>

              <div className="flex-1">
                <Card>
                  <CardContent className="p-6">
                    <TabsList className="md:hidden grid grid-cols-3 gap-2 mb-6">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="users">Users</TabsTrigger>
                      <TabsTrigger value="hospitals">Hospitals</TabsTrigger>
                      <TabsTrigger value="police">Police</TabsTrigger>
                      <TabsTrigger value="patients">Patients</TabsTrigger>
                      <TabsTrigger value="communication">Communication</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-0 space-y-4">
                      <h2 className="text-2xl font-bold">System Overview</h2>
                      <p>The National Hospital Management System (NHMS) is a comprehensive platform designed to facilitate seamless coordination between healthcare providers, police departments, and citizens.</p>
                      
                      <h3 className="text-xl font-semibold mt-6">Key Features</h3>
                      <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Centralized Health Records:</strong> Universal access to patient medical history across healthcare providers.</li>
                        <li><strong>Emergency Coordination:</strong> Direct communication between police and hospitals during emergencies.</li>
                        <li><strong>Resource Management:</strong> Real-time tracking of hospital resources and staff.</li>
                        <li><strong>Accident Reporting:</strong> Streamlined process for documenting and responding to accidents.</li>
                        <li><strong>Secure Communication:</strong> Encrypted messaging between all system users.</li>
                      </ul>
                      
                      <h3 className="text-xl font-semibold mt-6">System Architecture</h3>
                      <p>NHMS is built on a secure, cloud-based infrastructure that ensures:</p>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>High availability and reliability</li>
                        <li>End-to-end encryption for all sensitive data</li>
                        <li>Role-based access control</li>
                        <li>Comprehensive audit trails</li>
                        <li>Scalable performance to accommodate growing user base</li>
                      </ul>
                    </TabsContent>

                    <TabsContent value="users" className="mt-0 space-y-4">
                      <h2 className="text-2xl font-bold">User Roles and Permissions</h2>
                      <p>The NHMS implements a sophisticated role-based access control system to ensure users can only access information relevant to their responsibilities.</p>
                      
                      <div className="space-y-4 mt-6">
                        <h3 className="text-xl font-semibold">Patient</h3>
                        <p>Every citizen is registered as a patient in the system, establishing a universal health identity.</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>View personal medical records</li>
                          <li>Schedule appointments</li>
                          <li>Communicate with healthcare providers</li>
                          <li>Manage emergency contact information</li>
                          <li>Access personal accident reports</li>
                        </ul>
                        
                        <h3 className="text-xl font-semibold mt-4">Hospital Administrator</h3>
                        <p>Manages hospital operations and staff within the system.</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Register and manage hospital staff</li>
                          <li>Configure hospital departments and services</li>
                          <li>Monitor resource allocation</li>
                          <li>Generate hospital performance reports</li>
                          <li>Manage integration with other healthcare facilities</li>
                        </ul>
                        
                        <h3 className="text-xl font-semibold mt-4">Hospital Staff</h3>
                        <p>Healthcare professionals providing patient care.</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Create and update patient medical records</li>
                          <li>View patient history</li>
                          <li>Manage appointments</li>
                          <li>Access and update resource inventory</li>
                          <li>Communicate with patients and other staff</li>
                        </ul>
                        
                        <h3 className="text-xl font-semibold mt-4">Police Department Administrator</h3>
                        <p>Manages police department operations within the system.</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Register and manage police officers</li>
                          <li>Configure department jurisdiction and services</li>
                          <li>Monitor department activities</li>
                          <li>Generate department performance reports</li>
                        </ul>
                        
                        <h3 className="text-xl font-semibold mt-4">Police Officer</h3>
                        <p>Law enforcement personnel responsible for accident reporting and emergency response.</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Create and manage accident reports</li>
                          <li>Coordinate with hospitals during emergencies</li>
                          <li>Identify victims through the system</li>
                          <li>Track accident victims' medical status (limited access)</li>
                          <li>Generate incident reports</li>
                        </ul>
                        
                        <h3 className="text-xl font-semibold mt-4">System Administrator</h3>
                        <p>Technical personnel responsible for overall system management.</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Approve hospital and police department registrations</li>
                          <li>Manage system configurations</li>
                          <li>Monitor system performance</li>
                          <li>Implement security updates</li>
                          <li>Audit system access and usage</li>
                        </ul>
                      </div>
                    </TabsContent>

                    <TabsContent value="hospitals" className="mt-0 space-y-4">
                      <h2 className="text-2xl font-bold">Hospital Portal</h2>
                      <p>The Hospital Portal provides comprehensive tools for healthcare facilities to manage patients, staff, resources, and coordinate with other emergency services.</p>
                      
                      <h3 className="text-xl font-semibold mt-6">Hospital Registration</h3>
                      <p>Healthcare facilities can register in the NHMS by providing:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Hospital name and contact information</li>
                        <li>Location and service area</li>
                        <li>Facility type and specializations</li>
                        <li>License information</li>
                        <li>Administrator details</li>
                      </ul>
                      <p className="mt-2">Once approved, administrators can access the hospital dashboard and register staff members.</p>
                      
                      <h3 className="text-xl font-semibold mt-6">Patient Management</h3>
                      <p>Hospitals can access comprehensive patient information:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>View patient medical history from all healthcare providers</li>
                        <li>Create and update medical records</li>
                        <li>Track treatment progress</li>
                        <li>Schedule follow-up appointments</li>
                        <li>Manage patient admission and discharge</li>
                      </ul>
                      
                      <h3 className="text-xl font-semibold mt-6">Staff Management</h3>
                      <p>Tools for managing hospital personnel:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Register staff members (who must have patient accounts)</li>
                        <li>Assign departments and roles</li>
                        <li>Track qualifications and certifications</li>
                        <li>Manage schedules and availability</li>
                        <li>Monitor staff performance</li>
                      </ul>
                      
                      <h3 className="text-xl font-semibold mt-6">Resource Management</h3>
                      <p>Comprehensive inventory and resource tracking:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Track medical equipment and supplies</li>
                        <li>Monitor bed availability</li>
                        <li>Manage facility resources</li>
                        <li>Generate resource utilization reports</li>
                        <li>Share resource information during emergencies</li>
                      </ul>
                      
                      <h3 className="text-xl font-semibold mt-6">Emergency Response</h3>
                      <p>Coordination tools for emergency situations:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Receive real-time accident alerts from police</li>
                        <li>Prepare for incoming emergency patients</li>
                        <li>Coordinate with other healthcare facilities</li>
                        <li>Allocate resources during mass casualty incidents</li>
                        <li>Track emergency response metrics</li>
                      </ul>
                    </TabsContent>

                    <TabsContent value="police" className="mt-0 space-y-4">
                      <h2 className="text-2xl font-bold">Police Portal</h2>
                      <p>The Police Portal provides tools for law enforcement to report accidents, identify victims, and coordinate emergency responses with healthcare facilities.</p>
                      
                      <h3 className="text-xl font-semibold mt-6">Police Department Registration</h3>
                      <p>Law enforcement agencies can register in the NHMS by providing:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Department name and contact information</li>
                        <li>Jurisdiction and service area</li>
                        <li>Department type and specializations</li>
                        <li>Official authorization information</li>
                        <li>Administrator details</li>
                      </ul>
                      <p className="mt-2">Once approved, administrators can access the police dashboard and register officers.</p>
                      
                      <h3 className="text-xl font-semibold mt-6">Accident Reporting</h3>
                      <p>Comprehensive accident documentation system:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Create detailed accident reports</li>
                        <li>Document victim information</li>
                        <li>Upload photos and evidence</li>
                        <li>Tag relevant hospitals based on location</li>
                        <li>Generate automatic alerts to healthcare facilities</li>
                      </ul>
                      
                      <h3 className="text-xl font-semibold mt-6">Victim Identification</h3>
                      <p>Tools for identifying accident victims:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Search patient database using identifying information</li>
                        <li>Access critical medical information for emergency response</li>
                        <li>Identify emergency contacts</li>
                        <li>Track victim status through the healthcare system</li>
                      </ul>
                      
                      <h3 className="text-xl font-semibold mt-6">Officer Management</h3>
                      <p>Tools for managing police personnel:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Register officers (who must have patient accounts)</li>
                        <li>Assign units and roles</li>
                        <li>Track qualifications and certifications</li>
                        <li>Manage schedules and availability</li>
                        <li>Monitor officer performance in emergency reporting</li>
                      </ul>
                      
                      <h3 className="text-xl font-semibold mt-6">Emergency Coordination</h3>
                      <p>Tools for coordinating with healthcare facilities:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Send direct emergency notifications to hospitals</li>
                        <li>Coordinate victim transport and hospital selection</li>
                        <li>Receive real-time updates on victim status</li>
                        <li>Access hospital resource availability</li>
                        <li>Generate emergency response reports</li>
                      </ul>
                    </TabsContent>

                    <TabsContent value="patients" className="mt-0 space-y-4">
                      <h2 className="text-2xl font-bold">Patient Portal</h2>
                      <p>The Patient Portal gives citizens access to their health records, appointment scheduling, and communication with healthcare providers.</p>
                      
                      <h3 className="text-xl font-semibold mt-6">Patient Registration</h3>
                      <p>Citizens can register in the NHMS by providing:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Personal information</li>
                        <li>Contact details</li>
                        <li>National identification number</li>
                        <li>Emergency contact information</li>
                        <li>Basic health information</li>
                      </ul>
                      <p className="mt-2">Once registered, citizens can access their patient dashboard and manage their health information.</p>
                      
                      <h3 className="text-xl font-semibold mt-6">Health Records Access</h3>
                      <p>Patients can view their comprehensive health records:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>View medical history from all healthcare providers</li>
                        <li>Access diagnostic test results</li>
                        <li>Review treatment plans and medications</li>
                        <li>Track health metrics over time</li>
                        <li>Download medical documents and reports</li>
                      </ul>
                      
                      <h3 className="text-xl font-semibold mt-6">Appointment Management</h3>
                      <p>Tools for scheduling and managing healthcare appointments:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Schedule appointments with any registered healthcare facility</li>
                        <li>Receive appointment reminders</li>
                        <li>Reschedule or cancel appointments</li>
                        <li>View appointment history</li>
                        <li>Provide pre-appointment information</li>
                      </ul>
                      
                      <h3 className="text-xl font-semibold mt-6">Emergency Information</h3>
                      <p>Critical information for emergency situations:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Manage emergency contact information</li>
                        <li>Update critical health information (allergies, conditions)</li>
                        <li>Access emergency protocols</li>
                        <li>View accident reports involving the patient</li>
                      </ul>
                      
                      <h3 className="text-xl font-semibold mt-6">Healthcare Communication</h3>
                      <p>Tools for communicating with healthcare providers:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Secure messaging with healthcare providers</li>
                        <li>Request prescription refills</li>
                        <li>Ask medical questions</li>
                        <li>Receive test results and explanations</li>
                        <li>Access educational health resources</li>
                      </ul>
                    </TabsContent>

                    <TabsContent value="communication" className="mt-0 space-y-4">
                      <h2 className="text-2xl font-bold">Communication System</h2>
                      <p>The NHMS includes a sophisticated, secure communication system that facilitates real-time information sharing between patients, healthcare providers, and emergency services.</p>
                      
                      <h3 className="text-xl font-semibold mt-6">Secure Messaging</h3>
                      <p>End-to-end encrypted messaging platform for secure communications:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Patient-to-provider secure messaging</li>
                        <li>Inter-provider communication</li>
                        <li>Hospital-to-police coordination messaging</li>
                        <li>File and image sharing capabilities</li>
                        <li>Message archiving and audit trail</li>
                      </ul>
                      
                      <h3 className="text-xl font-semibold mt-6">Emergency Alerts</h3>
                      <p>Real-time notification system for emergency situations:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Automatic accident alerts from police to hospitals</li>
                        <li>Mass casualty incident coordination</li>
                        <li>Resource availability updates during emergencies</li>
                        <li>Patient status updates to authorized parties</li>
                        <li>Escalation protocols for critical situations</li>
                      </ul>
                      
                      <h3 className="text-xl font-semibold mt-6">Notification System</h3>
                      <p>Comprehensive notification system for routine communications:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Appointment reminders</li>
                        <li>Medication schedules</li>
                        <li>Follow-up care instructions</li>
                        <li>System updates and maintenance notifications</li>
                        <li>Report availability alerts</li>
                      </ul>
                      
                      <h3 className="text-xl font-semibold mt-6">Chat Integration</h3>
                      <p>Real-time chat system for immediate communication:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>AI-powered chat assistance for general inquiries</li>
                        <li>Live chat support for system navigation</li>
                        <li>Group chat functionality for team coordination</li>
                        <li>Chat history and documentation</li>
                        <li>Translation services for multilingual communication</li>
                      </ul>
                      
                      <h3 className="text-xl font-semibold mt-6">Communication Protocols</h3>
                      <p>Standardized protocols for effective communication:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Emergency communication standards</li>
                        <li>Information sharing guidelines</li>
                        <li>Privacy and confidentiality protocols</li>
                        <li>Documentation requirements</li>
                        <li>Escalation procedures</li>
                      </ul>
                    </TabsContent>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Tabs>
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

export default Documentation;

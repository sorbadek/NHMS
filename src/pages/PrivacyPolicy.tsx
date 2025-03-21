
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
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
        <Card>
          <CardContent className="p-8">
            <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
            <div className="prose max-w-none">
              <p>Last Updated: {new Date().toLocaleDateString()}</p>
              
              <h2 className="text-xl font-semibold mt-6">1. Introduction</h2>
              <p>The National Hospital Management System (NHMS) is committed to protecting your privacy and securing your personal and health information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.</p>
              
              <h2 className="text-xl font-semibold mt-6">2. Information We Collect</h2>
              <p>We collect several types of information from and about users of our platform, including:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Personal Information:</strong> Name, date of birth, gender, national identification number, contact information, and emergency contacts.</li>
                <li><strong>Health Information:</strong> Medical history, diagnoses, treatments, medications, allergies, and other health-related data.</li>
                <li><strong>Professional Information:</strong> For healthcare providers and police officers, we collect professional credentials, qualifications, and work history.</li>
                <li><strong>Usage Information:</strong> How you interact with our platform, including access times, pages viewed, and features used.</li>
                <li><strong>Device Information:</strong> Information about the devices you use to access our platform, including IP address, browser type, and operating system.</li>
              </ul>
              
              <h2 className="text-xl font-semibold mt-6">3. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Provide and maintain our healthcare management platform</li>
                <li>Process and facilitate healthcare services</li>
                <li>Coordinate emergency response and accident reporting</li>
                <li>Communicate with you about your health, appointments, and our services</li>
                <li>Improve and personalize your experience with our platform</li>
                <li>Comply with legal obligations and healthcare regulations</li>
                <li>Detect, prevent, and address technical issues or fraudulent activity</li>
              </ul>
              
              <h2 className="text-xl font-semibold mt-6">4. Information Sharing and Disclosure</h2>
              <p>We may share your information with:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Healthcare Providers:</strong> Your health information is shared with authorized healthcare providers involved in your care.</li>
                <li><strong>Emergency Services:</strong> In emergency situations, relevant information may be shared with police or emergency responders.</li>
                <li><strong>Service Providers:</strong> Third-party vendors who perform services on our behalf, such as hosting, data analysis, and customer service.</li>
                <li><strong>Legal Requirements:</strong> When required by law, court order, or governmental regulation.</li>
                <li><strong>Consent-Based Sharing:</strong> When you have given consent for specific information sharing.</li>
              </ul>
              <p>We implement role-based access controls to ensure that users can only access information necessary for their authorized functions.</p>
              
              <h2 className="text-xl font-semibold mt-6">5. Data Security</h2>
              <p>We implement appropriate technical and organizational measures to protect your personal and health information, including:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>End-to-end encryption for all sensitive data</li>
                <li>Strict authentication protocols</li>
                <li>Regular security assessments and audits</li>
                <li>Comprehensive access logs and monitoring</li>
                <li>Staff training on privacy and security practices</li>
              </ul>
              <p>While we implement safeguards, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>
              
              <h2 className="text-xl font-semibold mt-6">6. Your Rights and Choices</h2>
              <p>Depending on your location, you may have certain rights regarding your personal information:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Access to your personal information</li>
                <li>Correction of inaccurate or incomplete information</li>
                <li>Deletion of your information (subject to legal requirements for healthcare records)</li>
                <li>Restriction of processing in certain circumstances</li>
                <li>Data portability</li>
                <li>Withdrawing consent where processing is based on consent</li>
              </ul>
              <p>To exercise these rights, please contact us using the information provided in the "Contact Us" section.</p>
              
              <h2 className="text-xl font-semibold mt-6">7. Data Retention</h2>
              <p>We retain your information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. Medical records may be subject to specific retention requirements under healthcare regulations.</p>
              
              <h2 className="text-xl font-semibold mt-6">8. Children's Privacy</h2>
              <p>Our platform is not intended for children under 16 years of age. We do not knowingly collect personal information from children. If we learn we have collected personal information from a child without parental consent, we will take steps to delete that information.</p>
              
              <h2 className="text-xl font-semibold mt-6">9. Changes to Our Privacy Policy</h2>
              <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.</p>
              
              <h2 className="text-xl font-semibold mt-6">10. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Email: privacy@nhms.gov</li>
                <li>Phone: +123-456-7890</li>
                <li>Mail: NHMS Privacy Office, 123 Health Street, Capital City</li>
              </ul>
            </div>
          </CardContent>
        </Card>
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

export default PrivacyPolicy;


import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const TermsOfService = () => {
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
            <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
            <div className="prose max-w-none">
              <p>Last Updated: {new Date().toLocaleDateString()}</p>
              
              <h2 className="text-xl font-semibold mt-6">1. Acceptance of Terms</h2>
              <p>By accessing or using the National Hospital Management System (NHMS) platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not access or use the platform.</p>
              
              <h2 className="text-xl font-semibold mt-6">2. Description of Service</h2>
              <p>NHMS provides a unified healthcare management platform connecting hospitals, police departments, and citizens. The platform facilitates health record management, emergency coordination, and resource allocation.</p>
              
              <h2 className="text-xl font-semibold mt-6">3. User Accounts</h2>
              <p><strong>3.1 Registration</strong></p>
              <p>To access certain features of the platform, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.</p>
              
              <p><strong>3.2 Account Responsibilities</strong></p>
              <p>You are responsible for safeguarding your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account or any other breach of security.</p>
              
              <p><strong>3.3 Account Types</strong></p>
              <p>NHMS offers different account types (Patient, Hospital Staff, Police Officer) with varying levels of access and functionality. Each account type is subject to specific terms and responsibilities outlined during registration.</p>
              
              <h2 className="text-xl font-semibold mt-6">4. User Responsibilities</h2>
              <p><strong>4.1 Compliance with Laws</strong></p>
              <p>You agree to use the platform in compliance with all applicable laws, regulations, and healthcare standards.</p>
              
              <p><strong>4.2 Accurate Information</strong></p>
              <p>You agree to provide and maintain accurate, complete, and up-to-date information, especially regarding health information, emergency contacts, and other critical data.</p>
              
              <p><strong>4.3 Prohibited Activities</strong></p>
              <p>You agree not to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Use the platform for any illegal purpose or in violation of any laws</li>
                <li>Access data not intended for you or attempt to breach security measures</li>
                <li>Interfere with or disrupt the integrity or performance of the platform</li>
                <li>Share account credentials or allow unauthorized access to your account</li>
                <li>Upload or transmit malicious code or content</li>
                <li>Violate the privacy or confidentiality of other users</li>
              </ul>
              
              <h2 className="text-xl font-semibold mt-6">5. Intellectual Property</h2>
              <p><strong>5.1 Ownership</strong></p>
              <p>The platform, including all content, features, and functionality, is owned by NHMS and is protected by copyright, trademark, and other intellectual property laws.</p>
              
              <p><strong>5.2 Limited License</strong></p>
              <p>We grant you a limited, non-exclusive, non-transferable, revocable license to use the platform for its intended purposes subject to these Terms.</p>
              
              <h2 className="text-xl font-semibold mt-6">6. Privacy and Data Security</h2>
              <p>Your use of the platform is also governed by our Privacy Policy, which is incorporated into these Terms by reference. By using the platform, you consent to the collection, use, and sharing of your information as described in the Privacy Policy.</p>
              
              <h2 className="text-xl font-semibold mt-6">7. Medical Information Disclaimer</h2>
              <p>The platform provides access to health information and facilitates healthcare management but does not provide medical advice. Always consult with qualified healthcare professionals for medical advice, diagnosis, or treatment.</p>
              
              <h2 className="text-xl font-semibold mt-6">8. Limitation of Liability</h2>
              <p>To the maximum extent permitted by law, NHMS shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenue, arising out of or in any way connected with your access to or use of the platform.</p>
              
              <h2 className="text-xl font-semibold mt-6">9. Indemnification</h2>
              <p>You agree to indemnify, defend, and hold harmless NHMS and its officers, directors, employees, agents, and affiliates from and against any claims, liabilities, damages, losses, and expenses arising out of or in any way connected with your access to or use of the platform or your violation of these Terms.</p>
              
              <h2 className="text-xl font-semibold mt-6">10. Modifications to the Platform and Terms</h2>
              <p>We reserve the right to modify or discontinue the platform or any features at any time without notice. We may also revise these Terms from time to time. The updated Terms will be posted on the platform with a revised "Last Updated" date. Continued use of the platform after such changes constitutes acceptance of the revised Terms.</p>
              
              <h2 className="text-xl font-semibold mt-6">11. Termination</h2>
              <p>We may terminate or suspend your account and access to the platform at any time, without prior notice or liability, for any reason, including if you violate these Terms.</p>
              
              <h2 className="text-xl font-semibold mt-6">12. Governing Law</h2>
              <p>These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which NHMS is established, without regard to its conflict of law provisions.</p>
              
              <h2 className="text-xl font-semibold mt-6">13. Contact Information</h2>
              <p>For questions about these Terms, please contact us at:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Email: legal@nhms.gov</li>
                <li>Phone: +123-456-7890</li>
                <li>Mail: NHMS Legal Department, 123 Health Street, Capital City</li>
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

export default TermsOfService;

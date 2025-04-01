
import { Link } from "react-router-dom";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  ChevronRight
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1 - About */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-health-600 text-white flex items-center justify-center font-bold">
                N
              </div>
              <span className="font-bold text-xl">NHMS</span>
            </div>
            <p className="text-gray-300 mb-6">
              Nigeria's National Healthcare Management System connects hospitals, police departments, and patients through a unified digital platform.
            </p>
            <div className="flex gap-4">
              <a 
                href="#" 
                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-health-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
              <a 
                href="#" 
                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-health-600 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={16} />
              </a>
              <a 
                href="#" 
                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-health-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a 
                href="#" 
                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-health-600 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
            </div>
          </div>
          
          {/* Column 2 - Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 relative">
              Quick Links
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-health-600 -mb-2"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/documentation" className="text-gray-300 hover:text-health-400 transition-colors flex items-center gap-1">
                  <ChevronRight size={14} />
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-health-400 transition-colors flex items-center gap-1">
                  <ChevronRight size={14} />
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-300 hover:text-health-400 transition-colors flex items-center gap-1">
                  <ChevronRight size={14} />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-gray-300 hover:text-health-400 transition-colors flex items-center gap-1">
                  <ChevronRight size={14} />
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/sitemap" className="text-gray-300 hover:text-health-400 transition-colors flex items-center gap-1">
                  <ChevronRight size={14} />
                  Site Map
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 3 - User Access */}
          <div>
            <h3 className="text-lg font-semibold mb-6 relative">
              User Access
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-health-600 -mb-2"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/patient-register" className="text-gray-300 hover:text-health-400 transition-colors flex items-center gap-1">
                  <ChevronRight size={14} />
                  Patient Registration
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-gray-300 hover:text-health-400 transition-colors flex items-center gap-1">
                  <ChevronRight size={14} />
                  User Login
                </Link>
              </li>
              <li>
                <Link to="/hospital-registration" className="text-gray-300 hover:text-health-400 transition-colors flex items-center gap-1">
                  <ChevronRight size={14} />
                  Hospital Registration
                </Link>
              </li>
              <li>
                <Link to="/police-registration" className="text-gray-300 hover:text-health-400 transition-colors flex items-center gap-1">
                  <ChevronRight size={14} />
                  Police Registration
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-300 hover:text-health-400 transition-colors flex items-center gap-1">
                  <ChevronRight size={14} />
                  Support
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 4 - Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6 relative">
              Contact Us
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-health-600 -mb-2"></span>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-health-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">Federal Ministry of Health, Abuja, Nigeria</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-health-500 flex-shrink-0" />
                <span className="text-gray-300">+234 800 HEALTH (432584)</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-health-500 flex-shrink-0" />
                <a href="mailto:contact@nhms.gov.ng" className="text-gray-300 hover:text-health-400">contact@nhms.gov.ng</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            © {currentYear} National Healthcare Management System. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            A project of the Federal Ministry of Health, Nigeria
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-health-500 text-white flex items-center justify-center font-bold text-xl">
                N
              </div>
              <span className="font-bold text-xl">NHMS</span>
            </Link>
            <p className="text-gray-400 mb-4">
              National Hospital Management System - Connecting healthcare providers, police departments, and citizens in a unified platform.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-health-500">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-health-500">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.035 10.035 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482c-4.09-.193-7.715-2.157-10.148-5.126a4.926 4.926 0 001.525 6.573 4.903 4.903 0 01-2.229-.616v.06c0 2.39 1.7 4.38 3.952 4.83a4.898 4.898 0 01-2.224.085 4.929 4.929 0 004.6 3.42 9.88 9.88 0 01-6.115 2.106c-.398 0-.79-.023-1.175-.068a13.948 13.948 0 007.548 2.212c9.059 0 14.018-7.496 14.018-13.978 0-.21 0-.42-.015-.63a9.935 9.935 0 002.46-2.548l-.047-.02z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-health-500">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-health-500">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" />
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-health-500">Home</Link>
              </li>
              <li>
                <Link to="/documentation" className="text-gray-400 hover:text-health-500">Documentation</Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-health-500">FAQ</Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-400 hover:text-health-500">Support</Link>
              </li>
              <li>
                <Link to="/patient-login" className="text-gray-400 hover:text-health-500">Patient Login</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Registration</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/patient-register" className="text-gray-400 hover:text-health-500">Register as Patient</Link>
              </li>
              <li>
                <Link to="/hospital-registration" className="text-gray-400 hover:text-health-500">Hospital Registration</Link>
              </li>
              <li>
                <Link to="/police-registration" className="text-gray-400 hover:text-health-500">Police Department Registration</Link>
              </li>
              <li>
                <Link to="/staff-registration" className="text-gray-400 hover:text-health-500">Staff Registration</Link>
              </li>
              <li>
                <Link to="/officer-registration" className="text-gray-400 hover:text-health-500">Officer Registration</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms-of-service" className="text-gray-400 hover:text-health-500">Terms of Service</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-400 hover:text-health-500">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/documentation" className="text-gray-400 hover:text-health-500">Data Security</Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-health-500">Licenses</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-health-500">Compliance</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} National Hospital Management System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

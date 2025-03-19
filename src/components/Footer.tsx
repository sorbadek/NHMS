
import { ArrowUp } from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-md bg-white flex items-center justify-center">
                <span className="font-bold text-health-700">NH</span>
              </div>
              <span className="text-xl font-semibold">NHMS Nigeria</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              A unified digital platform that connects all hospitals in Nigeria, centralizing patient records and transforming healthcare delivery.
            </p>
            <div className="flex space-x-4">
              {["Twitter", "LinkedIn", "Facebook"].map((social, index) => (
                <a 
                  key={index}
                  href="#" 
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-3">
              {["Features", "Benefits", "Implementation", "Contact"].map((item, index) => (
                <li key={index}>
                  <a 
                    href={`#${item.toLowerCase()}`} 
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              {["Documentation", "Privacy Policy", "Terms of Service", "FAQ", "Support"].map((item, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-sm mb-4 md:mb-0">
            © {year} NHMS Nigeria. All rights reserved.
          </div>
          
          <button 
            onClick={scrollToTop}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors duration-300"
          >
            <ArrowUp className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

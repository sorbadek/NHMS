
import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Benefits', href: '#benefits' },
    { name: 'Implementation', href: '#implementation' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled 
        ? "bg-white/90 backdrop-blur-md shadow-sm py-2" 
        : "bg-transparent py-4"
    )}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <a 
          href="#" 
          className="flex items-center space-x-2 text-xl font-semibold"
        >
          <div className="w-10 h-10 rounded-md bg-gradient-to-br from-health-600 to-health-800 flex items-center justify-center text-white">
            <span className="font-bold">NH</span>
          </div>
          <span className="hidden sm:inline-block text-gray-900">NHMS Nigeria</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm text-gray-700 font-medium relative transition-all duration-300 hover:text-health-700 after:absolute after:bottom-0 after:left-0 after:right-full after:h-0.5 after:bg-health-600 after:transition-all hover:after:right-0"
            >
              {link.name}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Button
            variant="ghost"
            className="text-sm font-medium text-gray-700 hover:text-health-700 hover:bg-transparent"
          >
            Login
          </Button>
          <Button
            className="bg-health-600 text-white hover:bg-health-700 transition-all duration-300"
          >
            Request Demo
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden flex items-center"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-gray-900" />
          ) : (
            <Menu className="h-6 w-6 text-gray-900" />
          )}
        </button>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-effect animate-fade-down">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-health-700 hover:bg-gray-50 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="flex flex-col space-y-2 pt-2">
              <Button
                variant="ghost"
                className="justify-center text-base font-medium text-gray-700"
              >
                Login
              </Button>
              <Button
                className="justify-center bg-health-600 text-white hover:bg-health-700"
              >
                Request Demo
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

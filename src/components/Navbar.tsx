
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-health-600 text-white flex items-center justify-center font-bold text-xl">
              N
            </div>
            <span className={`font-bold text-xl transition-colors ${isScrolled ? 'text-gray-900' : 'text-gray-900'}`}>
              NHMS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="nav-link">Features</a>
            <a href="#benefits" className="nav-link">Benefits</a>
            <a href="#implementation" className="nav-link">Implementation</a>
            <a href="#contact" className="nav-link">Contact</a>
            <Link to="/patient-login">
              <Button variant="outline" className="border-health-600 text-health-600 hover:bg-health-50">
                Login
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden focus:outline-none" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-900" />
            ) : (
              <Menu className="h-6 w-6 text-gray-900" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden pt-4 pb-6">
            <nav className="flex flex-col space-y-4">
              <a href="#features" className="nav-link py-2" onClick={toggleMobileMenu}>Features</a>
              <a href="#benefits" className="nav-link py-2" onClick={toggleMobileMenu}>Benefits</a>
              <a href="#implementation" className="nav-link py-2" onClick={toggleMobileMenu}>Implementation</a>
              <a href="#contact" className="nav-link py-2" onClick={toggleMobileMenu}>Contact</a>
              <Link to="/patient-login" onClick={toggleMobileMenu}>
                <Button variant="outline" className="w-full border-health-600 text-health-600 hover:bg-health-50">
                  Login
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

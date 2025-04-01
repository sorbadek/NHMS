
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  UserPlus, 
  CalendarCheck, 
  Building, 
  ChevronRight, 
  Activity, 
  FileMedical, 
  Shield, 
  Lock, 
  HeartPulse, 
  MapPin, 
  Users
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

interface StatCount {
  hospitals: number;
  patients: number;
  staff: number;
}

export default function Index() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<StatCount>({
    hospitals: 0,
    patients: 0,
    staff: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchStatistics();
    
    const handleScroll = () => {
      const heroElement = heroRef.current;
      if (heroElement) {
        const scrollPosition = window.scrollY;
        const opacity = Math.max(0, 1 - scrollPosition / 500);
        heroElement.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
        heroElement.querySelector('.overlay')!.setAttribute('style', `opacity: ${0.6 + (1 - opacity) * 0.2}`);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchStatistics = async () => {
    try {
      setIsLoading(true);
      
      // Get hospitals count
      const { count: hospitalCount, error: hospitalError } = await supabase
        .from('hospitals')
        .select('*', { count: 'exact', head: true });
      
      // Get patients count
      const { count: patientCount, error: patientError } = await supabase
        .from('patients')
        .select('*', { count: 'exact', head: true });
      
      // Get staff count
      const { count: staffCount, error: staffError } = await supabase
        .from('hospital_staff')
        .select('*', { count: 'exact', head: true });
      
      if (!hospitalError && !patientError && !staffError) {
        setStats({
          hospitals: hospitalCount || 0,
          patients: patientCount || 0,
          staff: staffCount || 0
        });
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <div 
          ref={heroRef}
          className="relative bg-cover bg-center min-h-[600px] flex items-center" 
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format')",
            backgroundAttachment: "fixed" 
          }}
        >
          <div className="overlay absolute inset-0 bg-gradient-to-r from-health-900/90 to-health-800/70 z-0"></div>
          
          <div className="container mx-auto z-10 px-4 py-24">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-3xl"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                National Healthcare Management System
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-xl">
                Unifying healthcare data, emergency services, and patient care to save lives and improve healthcare outcomes across Nigeria.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button 
                  onClick={() => navigate('/patient-register')}
                  size="lg"
                  className="bg-white text-health-800 hover:bg-gray-100 hover:text-health-900 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 py-6 px-8 rounded-lg transform hover:scale-105"
                >
                  <UserPlus className="h-5 w-5" />
                  Register as Patient
                  <ChevronRight className="h-5 w-5 ml-1" />
                </Button>
                
                <Button 
                  onClick={() => navigate('/auth')}
                  variant="outline" 
                  size="lg"
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 flex items-center gap-2 py-6 px-8 rounded-lg"
                >
                  <Lock className="h-5 w-5" />
                  Professional Login
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Key Statistics */}
        <motion.section 
          className="py-16 bg-white"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="container mx-auto px-4">
            <motion.div variants={itemVariants} className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-3 text-gray-800">HealthLink Central Statistics</h2>
              <div className="w-24 h-1 bg-health-600 mx-auto mb-6"></div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">Real-time data from our connected healthcare network across Nigeria</p>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              <div className="bg-white rounded-xl shadow-lg p-8 text-center border-t-4 border-health-500 hover:transform hover:scale-105 transition-all duration-300">
                <div className="bg-health-50 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Building className="h-8 w-8 text-health-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Hospitals</h3>
                <p className="text-5xl font-bold text-health-600 mb-2">
                  {isLoading ? (
                    <span className="inline-block w-12 h-12 bg-gray-200 rounded-full animate-pulse"></span>
                  ) : (
                    stats.hospitals
                  )}
                </p>
                <p className="text-gray-500">Connected healthcare facilities</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-8 text-center border-t-4 border-health-500 hover:transform hover:scale-105 transition-all duration-300">
                <div className="bg-health-50 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Users className="h-8 w-8 text-health-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Patients</h3>
                <p className="text-5xl font-bold text-health-600 mb-2">
                  {isLoading ? (
                    <span className="inline-block w-12 h-12 bg-gray-200 rounded-full animate-pulse"></span>
                  ) : (
                    stats.patients
                  )}
                </p>
                <p className="text-gray-500">Registered individuals</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-8 text-center border-t-4 border-health-500 hover:transform hover:scale-105 transition-all duration-300">
                <div className="bg-health-50 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <HeartPulse className="h-8 w-8 text-health-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Healthcare Staff</h3>
                <p className="text-5xl font-bold text-health-600 mb-2">
                  {isLoading ? (
                    <span className="inline-block w-12 h-12 bg-gray-200 rounded-full animate-pulse"></span>
                  ) : (
                    stats.staff
                  )}
                </p>
                <p className="text-gray-500">Medical professionals</p>
              </div>
            </motion.div>
          </div>
        </motion.section>
        
        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold mb-3 text-gray-800">Unified Healthcare Platform</h2>
              <div className="w-24 h-1 bg-health-600 mx-auto mb-6"></div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our comprehensive system connects hospitals, police departments, and patients in a seamless digital ecosystem
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <div className="bg-health-50 p-4 rounded-full w-16 h-16 mb-6 flex items-center justify-center">
                  <FileMedical className="h-7 w-7 text-health-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Electronic Medical Records</h3>
                <p className="text-gray-600">
                  Secure, centralized medical records accessible by authorized healthcare providers across facilities.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <div className="bg-health-50 p-4 rounded-full w-16 h-16 mb-6 flex items-center justify-center">
                  <CalendarCheck className="h-7 w-7 text-health-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Appointment Scheduling</h3>
                <p className="text-gray-600">
                  Easy online booking system for patients to schedule appointments with healthcare providers.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <div className="bg-health-50 p-4 rounded-full w-16 h-16 mb-6 flex items-center justify-center">
                  <Shield className="h-7 w-7 text-health-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Emergency Response</h3>
                <p className="text-gray-600">
                  Integrated emergency reporting system connecting hospitals and police for rapid response to accidents.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <div className="bg-health-50 p-4 rounded-full w-16 h-16 mb-6 flex items-center justify-center">
                  <Activity className="h-7 w-7 text-health-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Health Monitoring</h3>
                <p className="text-gray-600">
                  Track patient health metrics and treatment progress across healthcare visits and facilities.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <div className="bg-health-50 p-4 rounded-full w-16 h-16 mb-6 flex items-center justify-center">
                  <Building className="h-7 w-7 text-health-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Hospital Management</h3>
                <p className="text-gray-600">
                  Comprehensive tools for hospitals to manage staff, resources, and patient care efficiently.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <div className="bg-health-50 p-4 rounded-full w-16 h-16 mb-6 flex items-center justify-center">
                  <MapPin className="h-7 w-7 text-health-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">National Coverage</h3>
                <p className="text-gray-600">
                  Nationwide network of healthcare facilities to ensure quality care wherever you are in Nigeria.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Call To Action */}
        <section className="py-20 bg-gradient-to-r from-health-800 to-health-600 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-3xl md:text-4xl font-bold mb-6"
              >
                Join Nigeria's National Healthcare System Today
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xl text-white/90 mb-10"
              >
                Be part of our mission to transform healthcare delivery across Nigeria through digital innovation and integration.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-wrap justify-center gap-4"
              >
                <Button 
                  onClick={() => navigate('/patient-register')}
                  size="lg"
                  className="bg-white text-health-800 hover:bg-gray-100 hover:text-health-900 transition-all py-6 flex items-center gap-2 rounded-lg"
                >
                  <UserPlus className="h-5 w-5" />
                  Register as Patient
                </Button>
                
                <Button 
                  onClick={() => navigate('/hospital-registration')}
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 py-6 flex items-center gap-2 rounded-lg"
                >
                  <Building className="h-5 w-5" />
                  Register Hospital
                </Button>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}


import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeatureSection from "@/components/FeatureSection";
import BenefitSection from "@/components/BenefitSection";
import ImplementationSection from "@/components/ImplementationSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Map, UserPlus, Building, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    fetchStatistics();
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

  const handleViewSitemap = () => {
    navigate("/sitemap");
  };

  const handlePatientRegistration = () => {
    navigate("/patient-register");
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
        <HeroSection />
        <FeatureSection />
        
        <motion.div 
          className="container mx-auto my-8 px-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">HealthLink Central Statistics</h2>
            <p className="text-gray-600">Real-time data from our connected healthcare network</p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-md p-6 text-center transform transition-transform hover:scale-105">
              <Building className="h-12 w-12 mx-auto mb-4 text-health-600" />
              <h3 className="text-xl font-semibold mb-1">Hospitals</h3>
              <p className="text-4xl font-bold text-health-700">{isLoading ? "..." : stats.hospitals}</p>
              <p className="text-gray-500 mt-2">Registered facilities</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center transform transition-transform hover:scale-105">
              <UserPlus className="h-12 w-12 mx-auto mb-4 text-health-600" />
              <h3 className="text-xl font-semibold mb-1">Patients</h3>
              <p className="text-4xl font-bold text-health-700">{isLoading ? "..." : stats.patients}</p>
              <p className="text-gray-500 mt-2">Registered individuals</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center transform transition-transform hover:scale-105">
              <Map className="h-12 w-12 mx-auto mb-4 text-health-600" />
              <h3 className="text-xl font-semibold mb-1">Healthcare Staff</h3>
              <p className="text-4xl font-bold text-health-700">{isLoading ? "..." : stats.staff}</p>
              <p className="text-gray-500 mt-2">Skilled professionals</p>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex justify-center items-center flex-col space-y-4">
            <Button 
              onClick={handlePatientRegistration}
              className="bg-health-600 hover:bg-health-700 text-white px-6 py-3 rounded-md flex items-center gap-2 transform transition-transform hover:scale-105"
              size="lg"
            >
              <UserPlus className="h-5 w-5" />
              Register as a Patient
              <ChevronRight className="h-4 w-4" />
            </Button>
            
            <Button 
              onClick={handleViewSitemap}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Map className="h-4 w-4" />
              View Complete Sitemap
            </Button>
          </motion.div>
        </motion.div>
        
        <BenefitSection />
        <ImplementationSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

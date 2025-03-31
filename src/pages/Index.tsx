
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeatureSection from "@/components/FeatureSection";
import BenefitSection from "@/components/BenefitSection";
import ImplementationSection from "@/components/ImplementationSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Map } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  const handleViewSitemap = () => {
    navigate("/sitemap");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeatureSection />
        <div className="container mx-auto my-8 px-4 text-center">
          <Button 
            onClick={handleViewSitemap}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Map className="h-4 w-4" />
            View Complete Sitemap
          </Button>
        </div>
        <BenefitSection />
        <ImplementationSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

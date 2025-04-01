
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Building, MapPin, Mail, Phone, LucideShield } from "lucide-react";
import { supabase, sendEmailNotification } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

const HospitalRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    phone: "",
    email: "",
    license_number: ""
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.name || !formData.address || !formData.email) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Insert hospital data
      const { data: hospitalData, error: hospitalError } = await supabase
        .from('hospitals')
        .insert([{
          name: formData.name,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          phone: formData.phone,
          email: formData.email,
          license_number: formData.license_number,
          status: 'active'
        }])
        .select();

      if (hospitalError) throw hospitalError;

      // Send email notification
      try {
        await sendEmailNotification(
          formData.email,
          "Hospital Registration Confirmation - HealthLink Central",
          `Dear ${formData.name} Administrator,\n\nYour hospital has been successfully registered in the HealthLink Central system.\n\nHospital Details:\nName: ${formData.name}\nAddress: ${formData.address}, ${formData.city}, ${formData.state}\nContact: ${formData.phone}\n\nYou can now add staff members and manage your hospital resources through the HealthLink Central dashboard.\n\nThank you for joining our healthcare network.\n\nRegards,\nHealthLink Central Administration`
        );
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
        // Continue anyway
      }

      toast({
        title: "Hospital registered successfully",
        description: "You can now add staff to this hospital",
      });

      // Redirect to hospital dashboard or staff registration
      navigate("/hospital-dashboard");
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred during registration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-background flex flex-col"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <motion.div variants={itemVariants}>
              <CardTitle className="text-2xl font-bold">Register Hospital</CardTitle>
              <CardDescription>
                Enter hospital details to register in the system
              </CardDescription>
            </motion.div>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="name">Hospital Name*</Label>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="name" 
                    name="name" 
                    placeholder="National Central Hospital" 
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="address">Address*</Label>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="address" 
                    name="address" 
                    placeholder="123 Health Avenue" 
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city" 
                    name="city" 
                    placeholder="Lagos" 
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input 
                    id="state" 
                    name="state" 
                    placeholder="Lagos State" 
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="phone" 
                    name="phone" 
                    placeholder="+234 800 123 4567" 
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="email">Email Address*</Label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    name="email" 
                    type="email"
                    placeholder="info@hospital.gov.ng" 
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="license_number">License Number</Label>
                <div className="flex items-center gap-2">
                  <LucideShield className="h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="license_number" 
                    name="license_number" 
                    placeholder="HC-12345-NGR" 
                    value={formData.license_number}
                    onChange={handleChange}
                  />
                </div>
              </motion.div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <motion.div variants={itemVariants} className="w-full">
                <Button 
                  type="submit" 
                  className="w-full bg-health-600 hover:bg-health-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    <>
                      <Building className="mr-2 h-4 w-4" />
                      Register Hospital
                    </>
                  )}
                </Button>
              </motion.div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </motion.div>
  );
};

export default HospitalRegistration;

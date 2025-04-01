
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LockIcon, UserIcon, Loader2, ChevronLeft, CalendarIcon, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Footer from "@/components/Footer";

const PatientRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    national_id: "",
    phone: "",
    password: "",
    confirmPassword: "",
    gender: "",
    dob: "",
    bloodType: "",
    allergies: "",
    emergency_contact_name: "",
    emergency_contact_phone: ""
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  // Check if user is already logged in
  useEffect(() => {
    if (user) {
      if (user.user_type === 'patient') {
        navigate('/patient-dashboard');
      } else {
        navigate('/auth');
      }
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName || !formData.email || !formData.password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Register user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            user_type: "patient",
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Create patient record
        const { error: patientError } = await supabase
          .from('patients')
          .insert([{
            user_id: data.user.id,
            national_id: formData.national_id,
            gender: formData.gender,
            date_of_birth: formData.dob,
            blood_type: formData.bloodType,
            allergies: formData.allergies,
            emergency_contact_name: formData.emergency_contact_name,
            emergency_contact_phone: formData.emergency_contact_phone,
            status: 'active'
          }]);

        if (patientError) {
          console.error("Error creating patient record:", patientError);
          throw patientError;
        }

        // Update users table with phone number
        if (formData.phone) {
          const { error: userUpdateError } = await supabase
            .from('users')
            .update({ phone: formData.phone })
            .eq('id', data.user.id);

          if (userUpdateError) {
            console.error("Error updating user phone:", userUpdateError);
          }
        }

        toast({
          title: "Registration Successful",
          description: "Your account has been created. Please check your email for verification.",
        });
        
        // Refresh user data in context
        await refreshUser();
        
        navigate("/patient-login");
      }
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="py-4 border-b">
        <div className="container">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-health-600 text-white flex items-center justify-center font-bold">
              N
            </div>
            <span className="font-semibold text-lg">NHMS Portal</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 py-8">
        <Card className="w-full max-w-lg shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <Link to="/patient-login" className="text-health-600 hover:text-health-700">
                <ChevronLeft className="h-4 w-4" />
              </Link>
              <CardTitle className="text-2xl font-bold">Patient Registration</CardTitle>
            </div>
            <CardDescription>
              Create your account to access health services
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="fullName" 
                    name="fullName" 
                    placeholder="John Doe" 
                    className="pl-10"
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="national_id">National ID Number</Label>
                  <Input 
                    id="national_id" 
                    name="national_id" 
                    placeholder="12345678" 
                    value={formData.national_id}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="phone" 
                      name="phone" 
                      placeholder="+1234567890" 
                      className="pl-10"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="dob" 
                      name="dob" 
                      type="date" 
                      className="pl-10"
                      value={formData.dob}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select 
                    value={formData.gender} 
                    onValueChange={(value) => handleSelectChange("gender", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bloodType">Blood Type</Label>
                  <Select 
                    value={formData.bloodType} 
                    onValueChange={(value) => handleSelectChange("bloodType", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                      <SelectItem value="unknown">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="allergies">Allergies (optional)</Label>
                <Input 
                  id="allergies" 
                  name="allergies" 
                  placeholder="List any allergies" 
                  value={formData.allergies}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
                  <Input 
                    id="emergency_contact_name" 
                    name="emergency_contact_name" 
                    placeholder="Next of kin" 
                    value={formData.emergency_contact_name}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="emergency_contact_phone">Emergency Contact Number</Label>
                  <Input 
                    id="emergency_contact_phone" 
                    name="emergency_contact_phone" 
                    placeholder="+1234567890" 
                    value={formData.emergency_contact_phone}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <LockIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="password" 
                      name="password" 
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-10"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <LockIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="confirmPassword" 
                      name="confirmPassword" 
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-10"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-health-600 hover:bg-health-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : "Create Account"}
              </Button>
              
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link 
                  to="/patient-login" 
                  className="text-health-700 hover:text-health-900 hover:underline font-medium"
                >
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default PatientRegister;

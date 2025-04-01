
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MailIcon, LockIcon, Loader2, LogIn, ChevronRight, Info, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const { user, refreshUser } = useAuth();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      redirectBasedOnUserType();
    }
  }, [user]);

  const redirectBasedOnUserType = () => {
    if (!user?.user_type) return;
    
    switch (user.user_type) {
      case 'super_admin':
      case 'admin':
        navigate('/admin-dashboard');
        break;
      case 'hospital_staff':
        navigate('/hospital-dashboard');
        break;
      case 'police':
        navigate('/police-dashboard');
        break;
      case 'patient':
        navigate('/patient-dashboard');
        break;
      default:
        navigate('/patient-dashboard');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, rememberMe: checked }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (error) throw error;
      
      toast.success("Login successful! Redirecting to your dashboard...");
      
      // Store session if "remember me" is checked
      if (formData.rememberMe && data.session) {
        localStorage.setItem('authSession', JSON.stringify(data.session));
      }
      
      // Refresh user data in the context
      await refreshUser();
      
      // Redirect now happens automatically via the auth context
      
    } catch (error: any) {
      toast.error(error.message || "Invalid credentials. Please try again.");
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

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <header className="py-4 border-b bg-white/80 backdrop-blur-sm">
        <div className="container">
          <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105">
            <div className="w-10 h-10 rounded-full bg-health-600 text-white flex items-center justify-center font-bold">
              N
            </div>
            <span className="font-semibold text-lg">NHMS Portal</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div 
          className="w-full max-w-md"
          variants={itemVariants}
        >
          <Card className="border-none shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <MailIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="email" 
                      name="email" 
                      type="email"
                      placeholder="name@example.com" 
                      className="pl-10"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link 
                      to="/forgot-password" 
                      className="text-sm text-health-700 hover:text-health-900 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
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
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember-me" 
                    checked={formData.rememberMe}
                    onCheckedChange={handleCheckboxChange}
                    disabled={isLoading}
                  />
                  <Label htmlFor="remember-me" className="text-sm font-normal cursor-pointer">
                    Remember me for 30 days
                  </Label>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  type="submit" 
                  className="w-full bg-health-600 hover:bg-health-700 transition-all duration-300 transform hover:scale-[1.02]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign in
                    </>
                  )}
                </Button>
                
                <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-800">New user?</h4>
                      <p className="text-sm text-blue-600 mt-1">
                        Create your account to access health services
                      </p>
                      <div className="mt-3">
                        <Link to="/patient-register">
                          <Button 
                            className="w-full bg-white border border-blue-300 text-blue-700 hover:bg-blue-50" 
                            variant="outline"
                          >
                            <User className="mr-2 h-4 w-4" />
                            Register as Patient
                            <ChevronRight className="h-4 w-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </main>
      
      <Footer />
    </motion.div>
  );
};

export default Auth;

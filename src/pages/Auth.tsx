
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LockIcon, UserIcon, MailIcon, ShieldIcon, Loader2, Lock, LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [adminKeyVisible, setAdminKeyVisible] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    adminKey: "",
    rememberMe: false
  });
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        redirectBasedOnUserType(data.session.user.id);
      }
    };

    checkSession();
  }, []);

  const redirectBasedOnUserType = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('user_type')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (data) {
        switch (data.user_type) {
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
      }
    } catch (error) {
      console.error('Error getting user type:', error);
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

  const handleAdminKeyClick = () => {
    setAdminKeyVisible(true);
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
      
      // Redirect based on user type
      if (data.user) {
        redirectBasedOnUserType(data.user.id);
      }
      
    } catch (error: any) {
      toast.error(error.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password || !formData.fullName) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    let userType = 'patient';
    
    // Check if admin key is provided and valid
    if (formData.adminKey) {
      if (formData.adminKey === "Mich_NHMS") {
        userType = 'super_admin';
      } else {
        toast.error("Invalid admin key");
        return;
      }
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            user_type: userType
          }
        }
      });

      if (error) throw error;
      
      toast.success("Registration successful! Please verify your email address.");
      
      // If auto-confirm email is enabled, user will be signed in automatically
      if (data.session) {
        redirectBasedOnUserType(data.user.id);
      } else {
        setActiveTab("login");
      }
      
    } catch (error: any) {
      toast.error(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
              HL
            </div>
            <span className="font-semibold text-lg">HealthLink Central</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div 
          className="w-full max-w-md"
          variants={itemVariants}
        >
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" className="data-[state=active]:bg-health-600 data-[state=active]:text-white">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-health-600 data-[state=active]:text-white">
                <UserIcon className="mr-2 h-4 w-4" />
                Register
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <motion.div variants={itemVariants}>
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
                        ) : "Sign in"}
                      </Button>
                      
                      <div className="text-center text-sm">
                        Don't have an account?{" "}
                        <button 
                          type="button"
                          onClick={() => setActiveTab("register")}
                          className="text-health-700 hover:text-health-900 hover:underline font-medium"
                        >
                          Register now
                        </button>
                      </div>
                    </CardFooter>
                  </form>
                </Card>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="register">
              <motion.div variants={itemVariants}>
                <Card className="border-none shadow-lg">
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                    <CardDescription>
                      Enter your details to create a new account
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={handleRegister}>
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
                      
                      <div className="space-y-2">
                        <Label htmlFor="register-email">Email</Label>
                        <div className="relative">
                          <MailIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="register-email" 
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
                        <Label htmlFor="register-password">Password</Label>
                        <div className="relative">
                          <LockIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="register-password" 
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
                      
                      {adminKeyVisible && (
                        <motion.div 
                          className="space-y-2"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          transition={{ duration: 0.3 }}
                        >
                          <Label htmlFor="adminKey">Admin Key</Label>
                          <div className="relative">
                            <ShieldIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              id="adminKey" 
                              name="adminKey" 
                              type="password" 
                              placeholder="Enter admin key" 
                              className="pl-10"
                              value={formData.adminKey}
                              onChange={handleChange}
                              disabled={isLoading}
                            />
                          </div>
                        </motion.div>
                      )}
                      
                      {!adminKeyVisible && (
                        <div className="flex justify-end">
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            onClick={handleAdminKeyClick}
                            className="text-xs text-muted-foreground hover:text-health-700"
                          >
                            <Lock className="mr-1 h-3 w-3" />
                            Admin
                          </Button>
                        </div>
                      )}
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
                            Creating account...
                          </>
                        ) : "Sign up"}
                      </Button>
                      
                      <div className="text-center text-sm">
                        Already have an account?{" "}
                        <button 
                          type="button"
                          onClick={() => setActiveTab("login")}
                          className="text-health-700 hover:text-health-900 hover:underline font-medium"
                        >
                          Sign in
                        </button>
                      </div>
                    </CardFooter>
                  </form>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>

      <footer className="py-4 border-t bg-white/80 backdrop-blur-sm">
        <div className="container text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} HealthLink Central - National Hospital Management System</p>
        </div>
      </footer>
    </motion.div>
  );
};

export default Auth;

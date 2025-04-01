
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LockIcon, UserIcon, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Footer from "@/components/Footer";

const PatientLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    rememberMe: false
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/patient-dashboard";
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

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, rememberMe: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.identifier || !formData.password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Check if identifier is an email or NIN
      const isEmail = formData.identifier.includes('@');
      
      // Sign in using Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: isEmail ? formData.identifier : `${formData.identifier}@nin.placeholder`, // Handle NIN as email
        password: formData.password
      });

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Login successful! Redirecting to your dashboard...",
      });
      
      // Store session if "remember me" is checked
      if (formData.rememberMe && data.session) {
        localStorage.setItem('authSession', JSON.stringify(data.session));
      }
      
      // Refresh user data in context
      await refreshUser();
      
      // Redirect to patient dashboard
      navigate('/patient-dashboard');
      
    } catch (error: any) {
      toast({
        title: "Authentication Failed",
        description: error.message || "Invalid credentials. Please try again.",
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

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Patient Login</CardTitle>
            <CardDescription>
              Enter your details to access your health records
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identifier">Email or NIN</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="identifier" 
                    name="identifier" 
                    placeholder="name@example.com or NIN number" 
                    className="pl-10"
                    value={formData.identifier}
                    onChange={handleChange}
                    disabled={isLoading}
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
                className="w-full bg-health-600 hover:bg-health-700"
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
                <Link 
                  to="/patient-register" 
                  className="text-health-700 hover:text-health-900 hover:underline font-medium"
                >
                  Register
                </Link>
              </div>
              
              <div className="text-center text-sm">
                Are you a hospital or police staff?{" "}
                <Link 
                  to="/auth" 
                  className="text-health-700 hover:text-health-900 hover:underline font-medium"
                >
                  Login here
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

export default PatientLogin;

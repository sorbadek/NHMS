
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LockIcon, UserIcon, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const PatientLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    rememberMe: false
  });
  const { toast } = useToast();
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
          case 'admin':
            navigate('/hospital-dashboard');
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
      
      // Redirect based on user type
      if (data.user) {
        redirectBasedOnUserType(data.user.id);
      }
      
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
                  Register now
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </main>

      <footer className="py-4 border-t">
        <div className="container text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} National Hospital Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PatientLogin;

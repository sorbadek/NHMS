
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PoliceDepartment {
  id: string;
  name: string;
}

const OfficerRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [departments, setDepartments] = useState<PoliceDepartment[]>([]);
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
    rank: "constable",
    badgeNumber: "",
    departmentId: ""
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const { data, error } = await supabase
        .from('police_departments')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      
      if (data) {
        setDepartments(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, departmentId: data[0].id }));
        }
      }
    } catch (error) {
      console.error("Error fetching police departments:", error);
      toast({
        title: "Failed to load departments",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.fullName || !formData.password || !formData.departmentId) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords match",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // First check if the user already exists as a patient
      const { data: existingUserData, error: existingUserError } = await supabase
        .from('users')
        .select('id, user_type')
        .eq('email', formData.email)
        .single();

      if (existingUserError && existingUserError.code !== 'PGRST116') {
        // This is an error other than "no rows returned"
        throw existingUserError;
      }

      let userId;

      if (existingUserData) {
        // User exists, use their ID
        userId = existingUserData.id;
      } else {
        // Create new user with auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              user_type: "patient", // Default type, will be updated later
            }
          }
        });

        if (authError) throw authError;
        
        if (!authData.user) {
          throw new Error("Failed to create user account");
        }
        
        userId = authData.user.id;
        
        // Create patient record for new user
        const { error: patientError } = await supabase
          .from('patients')
          .insert([{
            user_id: userId,
            status: 'active'
          }]);

        if (patientError) {
          console.error("Error creating patient record:", patientError);
          // Continue anyway, as user was created
        }
      }

      // Update user type to police
      const { error: updateUserError } = await supabase
        .from('users')
        .update({ user_type: 'police' })
        .eq('id', userId);

      if (updateUserError) throw updateUserError;

      // Create police officer record
      const { error: officerError } = await supabase
        .from('police_officers')
        .insert([{
          user_id: userId,
          department_id: formData.departmentId,
          rank: formData.rank,
          badge_number: formData.badgeNumber,
          status: 'active'
        }]);

      if (officerError) throw officerError;

      toast({
        title: "Officer registered successfully",
        description: "The police officer can now log in to access the system",
      });

      // Redirect to police dashboard
      navigate("/police-dashboard");
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
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Register Police Officer</CardTitle>
            <CardDescription>
              Add a new officer to your police department
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="departmentId">Police Department*</Label>
                <Select 
                  value={formData.departmentId} 
                  onValueChange={(value) => handleSelectChange('departmentId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name*</Label>
                <Input 
                  id="fullName" 
                  name="fullName" 
                  placeholder="Officer John Smith" 
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address*</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email"
                  placeholder="officer@police.gov.ng" 
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rank">Rank*</Label>
                  <Select 
                    value={formData.rank} 
                    onValueChange={(value) => handleSelectChange('rank', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Rank" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="constable">Constable</SelectItem>
                      <SelectItem value="corporal">Corporal</SelectItem>
                      <SelectItem value="sergeant">Sergeant</SelectItem>
                      <SelectItem value="inspector">Inspector</SelectItem>
                      <SelectItem value="superintendent">Superintendent</SelectItem>
                      <SelectItem value="commissioner">Commissioner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="badgeNumber">Badge Number</Label>
                  <Input 
                    id="badgeNumber" 
                    name="badgeNumber" 
                    placeholder="NPF-12345" 
                    value={formData.badgeNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password*</Label>
                <Input 
                  id="password" 
                  name="password" 
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password*</Label>
                <Input 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
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
                    Registering...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Register Officer
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default OfficerRegistration;

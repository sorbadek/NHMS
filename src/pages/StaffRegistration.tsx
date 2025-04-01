import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, UserPlus, Stethoscope, GraduationCap, Calendar, Award } from "lucide-react";
import { supabase, sendEmailNotification } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";

interface Hospital {
  id: string;
  name: string;
}

// Define detailed role types
interface RoleOption {
  id: string;
  label: string;
  category: string;
}

// Define department types
interface DepartmentOption {
  id: string;
  label: string;
  category: string;
}

const StaffRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [roleCategory, setRoleCategory] = useState("medical");
  const [certifications, setCertifications] = useState<string[]>([]);
  const [newCertification, setNewCertification] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
    role: "doctor",
    role_specific: "doctor",
    department: "",
    hospitalId: "",
    specialization: "",
    licenseNumber: "",
    education: "",
    yearsOfExperience: "",
    shiftPreference: "morning",
  });

  // Define roles by category
  const roles: RoleOption[] = [
    // Medical staff
    { id: "doctor", label: "Doctor", category: "medical" },
    { id: "nurse", label: "Nurse", category: "medical" },
    { id: "midwife", label: "Midwife", category: "medical" },
    { id: "paramedic", label: "Paramedic", category: "medical" },
    { id: "pharmacist", label: "Pharmacist", category: "medical" },
    { id: "lab_technician", label: "Lab Technician", category: "medical" },
    { id: "radiologist", label: "Radiologist", category: "medical" },
    
    // Administrative staff
    { id: "administrator", label: "Administrator", category: "administrative" },
    { id: "receptionist", label: "Receptionist", category: "administrative" },
    { id: "billing_specialist", label: "Billing Specialist", category: "administrative" },
    { id: "medical_records", label: "Medical Records Officer", category: "administrative" },
    { id: "hr_manager", label: "HR Manager", category: "administrative" },
    
    // Support staff
    { id: "security", label: "Security Officer", category: "support" },
    { id: "maintenance", label: "Maintenance Staff", category: "support" },
    { id: "cleaner", label: "Cleaner", category: "support" },
    { id: "driver", label: "Ambulance Driver", category: "support" },
    { id: "it_support", label: "IT Support", category: "support" }
  ];

  // Define departments
  const departments: DepartmentOption[] = [
    { id: "general_medicine", label: "General Medicine", category: "medical" },
    { id: "surgery", label: "Surgery", category: "medical" },
    { id: "pediatrics", label: "Pediatrics", category: "medical" },
    { id: "obstetrics", label: "Obstetrics & Gynecology", category: "medical" },
    { id: "cardiology", label: "Cardiology", category: "medical" },
    { id: "neurology", label: "Neurology", category: "medical" },
    { id: "orthopedics", label: "Orthopedics", category: "medical" },
    { id: "ophthalmology", label: "Ophthalmology", category: "medical" },
    { id: "dermatology", label: "Dermatology", category: "medical" },
    { id: "psychiatry", label: "Psychiatry", category: "medical" },
    { id: "radiology", label: "Radiology", category: "medical" },
    { id: "emergency", label: "Emergency", category: "medical" },
    { id: "icu", label: "Intensive Care Unit", category: "medical" },
    { id: "pharmacy", label: "Pharmacy", category: "medical" },
    { id: "laboratory", label: "Laboratory", category: "medical" },
    
    { id: "administration", label: "Administration", category: "administrative" },
    { id: "finance", label: "Finance & Billing", category: "administrative" },
    { id: "reception", label: "Reception", category: "administrative" },
    { id: "medical_records", label: "Medical Records", category: "administrative" },
    { id: "human_resources", label: "Human Resources", category: "administrative" },
    
    { id: "security", label: "Security", category: "support" },
    { id: "maintenance", label: "Maintenance", category: "support" },
    { id: "cleaning", label: "Cleaning", category: "support" },
    { id: "transport", label: "Transport", category: "support" },
    { id: "it", label: "IT Support", category: "support" }
  ];

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

  useEffect(() => {
    fetchHospitals();
    
    // Set default role based on category
    const defaultRole = roles.find(role => role.category === roleCategory)?.id || "";
    setFormData(prev => ({ 
      ...prev, 
      role: defaultRole,
      role_specific: defaultRole 
    }));
    
    // Set default department based on category
    const defaultDepartment = departments.find(dept => dept.category === roleCategory)?.id || "";
    setFormData(prev => ({ ...prev, department: defaultDepartment }));
  }, [roleCategory]);

  const fetchHospitals = async () => {
    try {
      const { data, error } = await supabase
        .from('hospitals')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      
      if (data) {
        setHospitals(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, hospitalId: data[0].id }));
        }
      }
    } catch (error) {
      console.error("Error fetching hospitals:", error);
      toast({
        title: "Failed to load hospitals",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCertification = () => {
    if (newCertification.trim() && !certifications.includes(newCertification.trim())) {
      setCertifications(prev => [...prev, newCertification.trim()]);
      setNewCertification("");
    }
  };

  const handleRemoveCertification = (cert: string) => {
    setCertifications(prev => prev.filter(c => c !== cert));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.fullName || !formData.password || !formData.hospitalId) {
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
              user_type: "hospital_staff", // Set directly to hospital_staff
            }
          }
        });

        if (authError) throw authError;
        
        if (!authData.user) {
          throw new Error("Failed to create user account");
        }
        
        userId = authData.user.id;
      }

      // Update user type to hospital_staff
      const { error: updateUserError } = await supabase
        .from('users')
        .update({ user_type: 'hospital_staff' })
        .eq('id', userId);

      if (updateUserError) throw updateUserError;

      // Parse years of experience to integer
      const yearsOfExperience = formData.yearsOfExperience ? parseInt(formData.yearsOfExperience) : null;

      // Create hospital staff record with additional fields
      const { error: staffError } = await supabase
        .from('hospital_staff')
        .insert([{
          user_id: userId,
          hospital_id: formData.hospitalId,
          role: formData.role,
          role_specific: formData.role_specific,
          department: formData.department,
          status: 'active',
          specialization: formData.specialization,
          license_number: formData.licenseNumber,
          education: formData.education,
          years_of_experience: yearsOfExperience,
          shift_preference: formData.shiftPreference,
          certification: certifications.length > 0 ? certifications : null
        }]);

      if (staffError) throw staffError;

      // Send email notification
      try {
        await sendEmailNotification(
          formData.email,
          "Welcome to HealthLink Central - Staff Registration",
          `Dear ${formData.fullName},\n\nYour staff account has been created successfully. You can now log in to access the HealthLink Central system.\n\nRole: ${formData.role}\nDepartment: ${formData.department}\n\nThank you for joining our healthcare network.\n\nRegards,\nHealthLink Central Team`
        );
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
        // Continue anyway
      }

      toast({
        title: "Staff registered successfully",
        description: "The staff member can now log in to access the system",
      });

      // Redirect to staff management
      navigate("/staff");
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
        <Card className="w-full max-w-lg shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <motion.div variants={itemVariants}>
              <CardTitle className="text-2xl font-bold">Register Hospital Staff</CardTitle>
              <CardDescription>
                Add a new staff member to your hospital
              </CardDescription>
            </motion.div>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="hospitalId">Hospital*</Label>
                <Select 
                  value={formData.hospitalId} 
                  onValueChange={(value) => handleSelectChange('hospitalId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Hospital" />
                  </SelectTrigger>
                  <SelectContent>
                    {hospitals.map((hospital) => (
                      <SelectItem key={hospital.id} value={hospital.id}>
                        {hospital.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>
              
              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="fullName">Full Name*</Label>
                <Input 
                  id="fullName" 
                  name="fullName" 
                  placeholder="Dr. Sarah Wilson" 
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </motion.div>
              
              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="email">Email Address*</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email"
                  placeholder="doctor@hospital.gov.ng" 
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Tabs 
                  value={roleCategory} 
                  onValueChange={setRoleCategory} 
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="medical">Medical</TabsTrigger>
                    <TabsTrigger value="administrative">Administrative</TabsTrigger>
                    <TabsTrigger value="support">Support</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="medical" className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="role">Role*</Label>
                        <Select 
                          value={formData.role_specific} 
                          onValueChange={(value) => {
                            handleSelectChange('role', value);
                            handleSelectChange('role_specific', value);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Role" />
                          </SelectTrigger>
                          <SelectContent>
                            {roles
                              .filter(role => role.category === 'medical')
                              .map(role => (
                                <SelectItem key={role.id} value={role.id}>
                                  {role.label}
                                </SelectItem>
                              ))
                            }
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="department">Department*</Label>
                        <Select 
                          value={formData.department} 
                          onValueChange={(value) => handleSelectChange('department', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Department" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments
                              .filter(dept => dept.category === 'medical')
                              .map(dept => (
                                <SelectItem key={dept.id} value={dept.id}>
                                  {dept.label}
                                </SelectItem>
                              ))
                            }
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="specialization">Specialization</Label>
                      <div className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="specialization" 
                          name="specialization" 
                          placeholder="Cardiology, Pediatrics, etc." 
                          value={formData.specialization}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="licenseNumber">License Number</Label>
                        <Input 
                          id="licenseNumber" 
                          name="licenseNumber" 
                          placeholder="MC-12345" 
                          value={formData.licenseNumber}
                          onChange={handleChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                        <Input 
                          id="yearsOfExperience" 
                          name="yearsOfExperience" 
                          type="number" 
                          min="0"
                          placeholder="5" 
                          value={formData.yearsOfExperience}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="education">Education</Label>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        <Textarea 
                          id="education" 
                          name="education" 
                          placeholder="MBBS from Medical University, Fellowship in Cardiology, etc." 
                          value={formData.education}
                          onChange={handleChange}
                          className="min-h-[80px]"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="shiftPreference">Preferred Shift</Label>
                      <Select 
                        value={formData.shiftPreference} 
                        onValueChange={(value) => handleSelectChange('shiftPreference', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Shift Preference" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">Morning</SelectItem>
                          <SelectItem value="afternoon">Afternoon</SelectItem>
                          <SelectItem value="evening">Evening</SelectItem>
                          <SelectItem value="night">Night</SelectItem>
                          <SelectItem value="rotating">Rotating</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Certifications</Label>
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="Add certification" 
                          value={newCertification}
                          onChange={(e) => setNewCertification(e.target.value)}
                        />
                        <Button 
                          type="button" 
                          onClick={handleAddCertification}
                          size="sm"
                          variant="outline"
                        >
                          Add
                        </Button>
                      </div>
                      {certifications.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {certifications.map((cert, index) => (
                            <span 
                              key={index} 
                              className="px-2 py-1 bg-primary/10 text-primary-foreground rounded-md text-sm flex items-center"
                            >
                              {cert}
                              <button 
                                type="button"
                                onClick={() => handleRemoveCertification(cert)}
                                className="ml-2 text-primary-foreground/70 hover:text-primary-foreground"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="administrative" className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="role">Role*</Label>
                        <Select 
                          value={formData.role_specific} 
                          onValueChange={(value) => {
                            handleSelectChange('role', value);
                            handleSelectChange('role_specific', value);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Role" />
                          </SelectTrigger>
                          <SelectContent>
                            {roles
                              .filter(role => role.category === 'administrative')
                              .map(role => (
                                <SelectItem key={role.id} value={role.id}>
                                  {role.label}
                                </SelectItem>
                              ))
                            }
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="department">Department*</Label>
                        <Select 
                          value={formData.department} 
                          onValueChange={(value) => handleSelectChange('department', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Department" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments
                              .filter(dept => dept.category === 'administrative')
                              .map(dept => (
                                <SelectItem key={dept.id} value={dept.id}>
                                  {dept.label}
                                </SelectItem>
                              ))
                            }
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="education">Education</Label>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        <Textarea 
                          id="education" 
                          name="education" 
                          placeholder="Bachelor's in Healthcare Administration, etc." 
                          value={formData.education}
                          onChange={handleChange}
                          className="min-h-[80px]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                        <Input 
                          id="yearsOfExperience" 
                          name="yearsOfExperience" 
                          type="number" 
                          min="0"
                          placeholder="5" 
                          value={formData.yearsOfExperience}
                          onChange={handleChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="shiftPreference">Preferred Shift</Label>
                        <Select 
                          value={formData.shiftPreference} 
                          onValueChange={(value) => handleSelectChange('shiftPreference', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Shift Preference" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="morning">Morning</SelectItem>
                            <SelectItem value="afternoon">Afternoon</SelectItem>
                            <SelectItem value="evening">Evening</SelectItem>
                            <SelectItem value="night">Night</SelectItem>
                            <SelectItem value="rotating">Rotating</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Certifications</Label>
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="Add certification" 
                          value={newCertification}
                          onChange={(e) => setNewCertification(e.target.value)}
                        />
                        <Button 
                          type="button" 
                          onClick={handleAddCertification}
                          size="sm"
                          variant="outline"
                        >
                          Add
                        </Button>
                      </div>
                      {certifications.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {certifications.map((cert, index) => (
                            <span 
                              key={index} 
                              className="px-2 py-1 bg-primary/10 text-primary-foreground rounded-md text-sm flex items-center"
                            >
                              {cert}
                              <button 
                                type="button"
                                onClick={() => handleRemoveCertification(cert)}
                                className="ml-2 text-primary-foreground/70 hover:text-primary-foreground"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="support" className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="role">Role*</Label>
                        <Select 
                          value={formData.role_specific} 
                          onValueChange={(value) => {
                            handleSelectChange('role', value);
                            handleSelectChange('role_specific', value);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Role" />
                          </SelectTrigger>
                          <SelectContent>
                            {roles
                              .filter(role => role.category === 'support')
                              .map(role => (
                                <SelectItem key={role.id} value={role.id}>
                                  {role.label}
                                </SelectItem>
                              ))
                            }
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="department">Department*</Label>
                        <Select 
                          value={formData.department} 
                          onValueChange={(value) => handleSelectChange('department', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Department" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments
                              .filter(dept => dept.category === 'support')
                              .map(dept => (
                                <SelectItem key={dept.id} value={dept.id}>
                                  {dept.label}
                                </SelectItem>
                              ))
                            }
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                      <Input 
                        id="yearsOfExperience" 
                        name="yearsOfExperience" 
                        type="number" 
                        min="0"
                        placeholder="5" 
                        value={formData.yearsOfExperience}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="shiftPreference">Preferred Shift</Label>
                      <Select 
                        value={formData.shiftPreference} 
                        onValueChange={(value) => handleSelectChange('shiftPreference', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Shift Preference" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">Morning</SelectItem>
                          <SelectItem value="afternoon">Afternoon</SelectItem>
                          <SelectItem value="evening">Evening</SelectItem>
                          <SelectItem value="night">Night</SelectItem>
                          <SelectItem value="rotating">Rotating</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                </Tabs>
              </motion.div>
              
              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="password">Password*</Label>
                <Input 
                  id="password" 
                  name="password" 
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </motion.div>
              
              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password*</Label>
                <Input 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
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
                      <UserPlus className="mr-2 h-4 w-4" />
                      Register Staff
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

export default StaffRegistration;

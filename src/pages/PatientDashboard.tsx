import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar, 
  Clock, 
  FileText, 
  Heart, 
  Activity, 
  Pill, 
  Calendar as CalendarIcon,
  ChevronRight,
  Plus,
  Settings,
  Bell,
  MessageSquare,
  User
} from "lucide-react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { supabase, AppointmentWithJoins } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [appointments, setAppointments] = useState<AppointmentWithJoins[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [patientProfile, setPatientProfile] = useState<any>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientData = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        // Fetch patient profile
        const { data: patientData, error: patientError } = await supabase
          .from('patients')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (patientError) throw patientError;
        if (patientData) setPatientProfile(patientData);

        // Fetch appointments with related data
        const { data: appointmentsData, error: appointmentsError } = await supabase
          .from('appointments')
          .select(`
            *,
            doctors:doctor_id(*),
            hospitals:hospital_id(*)
          `)
          .eq('patient_id', patientData.id)
          .order('appointment_date', { ascending: true });

        if (appointmentsError) throw appointmentsError;
        if (appointmentsData) {
          setAppointments(appointmentsData as AppointmentWithJoins[]);
        }

        // Fetch prescriptions with related data
        const { data: prescriptionsData, error: prescriptionsError } = await supabase
          .from('prescriptions')
          .select(`
            *,
            doctors:doctor_id(*),
            hospitals:hospital_id(*)
          `)
          .eq('patient_id', patientData.id)
          .order('created_at', { ascending: false });

        if (prescriptionsError) throw prescriptionsError;
        if (prescriptionsData) setPrescriptions(prescriptionsData);

      } catch (error: any) {
        console.error('Error fetching patient data:', error);
        toast.error(error.message || 'Failed to load patient data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientData();
  }, [user]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      hour: '2-digit', 
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  const calculateAge = (dob: string | null | undefined) => {
    if (!dob) return 'N/A';
    
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const getStatusColor = (status: string | null | undefined) => {
    if (!status) return "bg-gray-100 text-gray-800";
    
    switch(status.toLowerCase()) {
      case 'scheduled':
        return "bg-blue-100 text-blue-800";
      case 'completed':
        return "bg-green-100 text-green-800";
      case 'cancelled':
        return "bg-red-100 text-red-800";
      case 'active':
        return "bg-green-100 text-green-800";
      case 'pending':
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Process upcoming appointments
  const getUpcomingAppointments = () => {
    if (!appointments.length) return [];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return appointments
      .filter(appointment => {
        const appointmentDate = new Date(appointment.appointment_date);
        appointmentDate.setHours(0, 0, 0, 0);
        return appointmentDate >= today && appointment.status !== 'cancelled';
      })
      .sort((a, b) => {
        return new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime();
      })
      .slice(0, 5);
  };

  // Process appointment data for display
  const processedAppointments = () => {
    if (!appointments.length) return [];
    
    return appointments.map((appointment) => {
      let doctorName = 'Assigned Doctor';
      try {
        if (appointment.doctors && typeof appointment.doctors === 'object') {
          // Check if doctors is an object with expected structure 
          if (!('code' in appointment.doctors)) {
            const doctorFullName = appointment.doctors?.full_name;
            doctorName = doctorFullName ? `Dr. ${doctorFullName}` : 'Assigned Doctor';
          }
        }
      } catch (e) {
        console.error("Error processing doctor data:", e);
      }
      
      let hospitalName = 'Unknown Hospital';
      try {
        if (appointment.hospitals && typeof appointment.hospitals === 'object') {
          // Check if hospitals is an object with expected structure
          if (!('code' in appointment.hospitals)) {
            const hospitalNameValue = appointment.hospitals?.name;
            hospitalName = hospitalNameValue || 'Unknown Hospital';
          }
        }
      } catch (e) {
        console.error("Error processing hospital data:", e);
      }
      
      return {
        ...appointment,
        formattedDate: formatDate(appointment.appointment_date),
        formattedTime: formatTime(appointment.appointment_date),
        doctorName,
        hospitalName,
        statusColor: getStatusColor(appointment.status)
      };
    });
  };

  // Get recent appointments
  const getRecentAppointments = () => {
    return processedAppointments()
      .sort((a, b) => new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime())
      .slice(0, 5);
  };

  // Process prescriptions data for display
  const processedPrescriptions = () => {
    if (!prescriptions.length) return [];
    
    return prescriptions.map((prescription) => {
      let doctorName = 'Unknown Doctor';
      let hospitalName = 'Unknown Hospital';
      
      try {
        if (prescription.doctors && 
            prescription.doctors !== null && 
            typeof prescription.doctors === 'object' &&
            !('code' in prescription.doctors)) {
          const fullName = prescription.doctors.full_name;
          doctorName = fullName ? `Dr. ${fullName}` : 'Unknown Doctor';
        }
      } catch (e) {
        console.error("Error processing doctor data for prescription:", e);
      }
      
      try {
        if (prescription.hospitals && 
            prescription.hospitals !== null && 
            typeof prescription.hospitals === 'object' &&
            !('code' in prescription.hospitals)) {
          const name = prescription.hospitals.name;
          hospitalName = name || 'Unknown Hospital';
        }
      } catch (e) {
        console.error("Error processing hospital data for prescription:", e);
      }
      
      return {
        ...prescription,
        doctorName,
        hospitalName,
        formattedDate: prescription.created_at ? formatDate(prescription.created_at) : 'Unknown Date',
        statusColor: getStatusColor(prescription.status)
      };
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-health-600"></div>
          <p className="text-muted-foreground">Loading patient dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-health-600 text-white flex items-center justify-center font-bold">
              N
            </div>
            <span className="font-semibold text-lg hidden md:inline">NHMS Patient Portal</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/patient-notifications">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </Button>
            </Link>
            
            <Link to="/patient-messages">
              <Button variant="ghost" size="icon" className="relative">
                <MessageSquare className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  2
                </span>
              </Button>
            </Link>
            
            <Button 
              variant="ghost" 
              className="flex items-center gap-2"
              onClick={() => navigate("/patient-settings")}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt={user?.full_name || ""} />
                <AvatarFallback className="bg-health-100 text-health-800">
                  {user?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'P'}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-sm hidden md:inline-block">{user?.full_name}</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 mt-6">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 mb-6 md:mb-0">
            <Card className="sticky top-24">
              <CardContent className="p-0">
                <nav className="flex flex-col">
                  <Button 
                    variant={activeTab === "overview" ? "default" : "ghost"} 
                    className={`justify-start rounded-none h-12 ${activeTab === "overview" ? "bg-health-600" : ""}`}
                    onClick={() => setActiveTab("overview")}
                  >
                    <Activity className="mr-2 h-4 w-4" />
                    Overview
                  </Button>
                  <Button 
                    variant={activeTab === "appointments" ? "default" : "ghost"} 
                    className={`justify-start rounded-none h-12 ${activeTab === "appointments" ? "bg-health-600" : ""}`}
                    onClick={() => setActiveTab("appointments")}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Appointments
                  </Button>
                  <Button 
                    variant={activeTab === "prescriptions" ? "default" : "ghost"} 
                    className={`justify-start rounded-none h-12 ${activeTab === "prescriptions" ? "bg-health-600" : ""}`}
                    onClick={() => setActiveTab("prescriptions")}
                  >
                    <Pill className="mr-2 h-4 w-4" />
                    Prescriptions
                  </Button>
                  <Button 
                    variant={activeTab === "medicalRecords" ? "default" : "ghost"} 
                    className={`justify-start rounded-none h-12 ${activeTab === "medicalRecords" ? "bg-health-600" : ""}`}
                    onClick={() => setActiveTab("medicalRecords")}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Medical Records
                  </Button>
                  <Button 
                    variant={activeTab === "profile" ? "default" : "ghost"} 
                    className={`justify-start rounded-none h-12 ${activeTab === "profile" ? "bg-health-600" : ""}`}
                    onClick={() => setActiveTab("profile")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                  <Button 
                    variant={activeTab === "settings" ? "default" : "ghost"} 
                    className={`justify-start rounded-none h-12 ${activeTab === "settings" ? "bg-health-600" : ""}`}
                    onClick={() => setActiveTab("settings")}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Patient Details Card */}
                  <Card className="flex-1">
                    <CardHeader className="pb-2">
                      <CardTitle>
                        <div className="flex items-center gap-4">
                          <Avatar className="h-16 w-16">
                            <AvatarFallback className="bg-health-100 text-health-800 text-xl">
                              {user?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'P'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h2 className="text-2xl font-bold">{user?.full_name}</h2>
                            <p className="text-muted-foreground">Patient ID: {patientProfile?.id?.substring(0, 8)}</p>
                          </div>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Age</p>
                          <p className="font-medium">{calculateAge(patientProfile?.date_of_birth)} years</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Gender</p>
                          <p className="font-medium">{patientProfile?.gender || 'Not specified'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Blood Type</p>
                          <p className="font-medium">{patientProfile?.blood_type || 'Not recorded'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">National ID</p>
                          <p className="font-medium">{patientProfile?.national_id || 'Not provided'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium">{user?.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p className="font-medium">{user?.phone || 'Not provided'}</p>
                        </div>
                        {patientProfile?.allergies && (
                          <div className="col-span-2">
                            <p className="text-sm text-muted-foreground">Allergies</p>
                            <p className="font-medium">{patientProfile.allergies}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Health Stats Card */}
                  <Card className="flex-1">
                    <CardHeader>
                      <CardTitle>Health Summary</CardTitle>
                      <CardDescription>Your recent health metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex gap-2 items-center">
                            <Heart className="w-5 h-5 text-red-500" />
                            <span>Blood Pressure</span>
                          </div>
                          <span className="font-semibold">120/80 mmHg</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex gap-2 items-center">
                            <Activity className="w-5 h-5 text-blue-500" />
                            <span>Heart Rate</span>
                          </div>
                          <span className="font-semibold">72 bpm</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex gap-2 items-center">
                            <Heart className="w-5 h-5 text-purple-500" />
                            <span>Blood Glucose</span>
                          </div>
                          <span className="font-semibold">95 mg/dL</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex gap-2 items-center">
                            <Activity className="w-5 h-5 text-green-500" />
                            <span>Oxygen Saturation</span>
                          </div>
                          <span className="font-semibold">98%</span>
                        </div>
                        <div className="pt-2">
                          <p className="text-xs text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Upcoming Appointments */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Upcoming Appointments</CardTitle>
                      <CardDescription>Your scheduled appointments</CardDescription>
                    </div>
                    <Button size="sm" onClick={() => navigate("/patient-appointments")}>
                      View All
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {getUpcomingAppointments().length > 0 ? (
                        getUpcomingAppointments().map((appointment) => {
                          // Process and format doctor and hospital data with null checks
                          let doctorName = 'Assigned Doctor';
                          if (appointment.doctors && typeof appointment.doctors === 'object' && !('code' in appointment.doctors)) {
                            doctorName = appointment.doctors.full_name ? `Dr. ${appointment.doctors.full_name}` : 'Assigned Doctor';
                          }
                          
                          let hospitalName = 'Unknown Hospital';
                          if (appointment.hospitals && typeof appointment.hospitals === 'object' && !('code' in appointment.hospitals)) {
                            hospitalName = appointment.hospitals.name || 'Unknown Hospital';
                          }
                          
                          return (
                            <div 
                              key={appointment.id} 
                              className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50"
                            >
                              <div className="bg-health-100 text-health-800 p-3 rounded-full">
                                <CalendarIcon className="h-6 w-6" />
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold">
                                  {appointment.department || 'General Checkup'} with {doctorName}
                                </p>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>{formatDate(appointment.appointment_date)}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span>{formatTime(appointment.appointment_date)}</span>
                                  </div>
                                </div>
                                <p className="text-sm mt-1">{hospitalName}</p>
                              </div>
                              <Badge className={getStatusColor(appointment.status)}>
                                {appointment.status || 'Scheduled'}
                              </Badge>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-6 text-muted-foreground">
                          <p>No upcoming appointments</p>
                          <Button 
                            variant="link" 
                            className="mt-2"
                            onClick={() => navigate("/patient-appointments")}
                          >
                            Schedule an appointment
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Prescriptions */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Recent Prescriptions</CardTitle>
                      <CardDescription>Your medication prescriptions</CardDescription>
                    </div>
                    <Button size="sm" onClick={() => setActiveTab("prescriptions")}>
                      View All
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {processedPrescriptions().length > 0 ? (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Medication</TableHead>
                              <TableHead>Dosage</TableHead>
                              <TableHead className="hidden md:table-cell">Doctor</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {processedPrescriptions().slice(0, 5).map((prescription) => (
                              <TableRow key={prescription.id}>
                                <TableCell className="font-medium">{prescription.medication_name}</TableCell>
                                <TableCell>{prescription.dosage} - {prescription.frequency}</TableCell>
                                <TableCell className="hidden md:table-cell">{prescription.doctorName}</TableCell>
                                <TableCell>
                                  <Badge className={prescription.statusColor}>
                                    {prescription.status}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        <p>No recent prescriptions</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Appointments Tab */}
              <TabsContent value="appointments" className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>All Appointments</CardTitle>
                      <CardDescription>Manage your appointments</CardDescription>
                    </div>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      New Appointment
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {processedAppointments().length > 0 ? (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Time</TableHead>
                              <TableHead className="hidden md:table-cell">Doctor</TableHead>
                              <TableHead className="hidden md:table-cell">Hospital</TableHead>
                              <TableHead>Department</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {processedAppointments().map((appointment) => (
                              <TableRow key={appointment.id}>
                                <TableCell>{appointment.formattedDate}</TableCell>
                                <TableCell>{appointment.formattedTime}</TableCell>
                                <TableCell className="hidden md:table-cell">{appointment.doctorName}</TableCell>
                                <TableCell className="hidden md:table-cell">{appointment.hospitalName}</TableCell>
                                <TableCell>{appointment.department || 'General'}</TableCell>
                                <TableCell>
                                  <Badge className={appointment.statusColor}>
                                    {appointment.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button variant="ghost" size="sm">
                                    <ChevronRight className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        <p>No appointments found</p>
                        <Button variant="link" className="mt-2">Schedule your first appointment</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Prescriptions Tab */}
              <TabsContent value="prescriptions" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Medications & Prescriptions</CardTitle>
                    <CardDescription>Current and past medication prescriptions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {processedPrescriptions().length > 0 ? (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Medication</TableHead>
                              <TableHead>Dosage</TableHead>
                              <TableHead>Frequency</TableHead>
                              <TableHead className="hidden md:table-cell">Doctor</TableHead>
                              <TableHead className="hidden md:table-cell">Hospital</TableHead>
                              <TableHead className="hidden md:table-cell">Date</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {processedPrescriptions().map((prescription) => (
                              <TableRow key={prescription.id}>
                                <TableCell className="font-medium">{prescription.medication_name}</TableCell>
                                <TableCell>{prescription.dosage}</TableCell>
                                <TableCell>{prescription.frequency}</TableCell>
                                <TableCell className="hidden md:table-cell">{prescription.doctorName}</TableCell>
                                <TableCell className="hidden md:table-cell">{prescription.hospitalName}</TableCell>
                                <TableCell className="hidden md:table-cell">{prescription.formattedDate}</TableCell>
                                <TableCell>
                                  <Badge className={prescription.statusColor}>
                                    {prescription.status}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        <p>No prescriptions available</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Other tabs would be implemented here */}
              <TabsContent value="medicalRecords" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Medical Records</CardTitle>
                    <CardDescription>Your medical history and records</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-6 text-muted-foreground">
                      <p>Medical records feature coming soon</p>
                      <Button variant="link" className="mt-2" onClick={() => navigate("/patient-records")}>
                        Request Medical Records
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Patient Profile</CardTitle>
                    <CardDescription>Manage your personal information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-6 text-muted-foreground">
                      <p>Profile management feature coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage your account preferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-6 text-muted-foreground">
                      <p>Account settings feature coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <footer className="mt-12 py-8 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} National Hospital Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PatientDashboard;


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
import { Button } from "@/components/ui/button";
import { Calendar, FileText, User, Heart, Clock, Bell, Calendar as CalendarIcon } from "lucide-react";
import PatientLayout from "@/components/PatientLayout";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase, formatDate, formatTime } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

// Define types for database records
type PatientInfoType = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  nin: string;
  gender: string;
  bloodType: string;
  allergies: string[];
  chronicConditions: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phoneNumber: string;
  }
};

type MedicalRecord = {
  id: string;
  date: string;
  type: string;
  doctor: string;
  hospital: string;
  description: string;
};

type Appointment = {
  id: string;
  date: string;
  time: string;
  doctor: string;
  hospital: string;
  department: string;
  status: string;
};

type Prescription = {
  id: string;
  date: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  doctor: string;
  hospital: string;
  status: string;
};

// Define types for database responses
type HospitalResponse = {
  name: string;
};

type DoctorResponse = {
  full_name: string;
};

// Define Prescription response type
type PrescriptionResponseType = {
  id: string;
  created_at: string | null;
  medication_name: string;
  dosage: string | null;
  frequency: string | null;
  duration: string | null;
  status: string | null;
  doctors?: { full_name: string } | null;
  hospitals?: { name: string } | null;
};

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Fetch authenticated user data
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    }
  });

  // Fetch patient profile data
  const { 
    data: patientInfo, 
    isLoading: isLoadingPatient 
  } = useQuery({
    queryKey: ['patientInfo', session?.user?.id],
    enabled: !!session?.user?.id,
    queryFn: async () => {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', session!.user.id)
        .single();
      
      if (userError) throw userError;
      
      const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .select('*')
        .eq('user_id', session!.user.id)
        .single();
      
      if (patientError && patientError.code !== 'PGRST116') {
        throw patientError;
      }
      
      return {
        id: userData.id,
        name: userData.full_name,
        email: userData.email,
        phoneNumber: userData.phone || 'Not provided',
        dateOfBirth: patientData?.date_of_birth ? formatDate(patientData.date_of_birth) : 'Not provided',
        nin: patientData?.national_id || 'Not provided',
        gender: patientData?.gender || 'Not provided',
        bloodType: patientData?.blood_type || 'Not provided',
        allergies: patientData?.allergies ? patientData.allergies.split(',').map((a: string) => a.trim()) : [],
        chronicConditions: [],
        emergencyContact: {
          name: patientData?.emergency_contact_name || 'Not provided',
          relationship: 'Contact',
          phoneNumber: patientData?.emergency_contact_phone || 'Not provided'
        }
      } as PatientInfoType;
    }
  });

  // Fetch medical records
  const { 
    data: medicalRecords = [], 
    isLoading: isLoadingRecords 
  } = useQuery({
    queryKey: ['patientMedicalRecords', session?.user?.id],
    enabled: !!session?.user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medical_records')
        .select(`
          *,
          hospitals:hospital_id(name),
          staff:staff_id(*)
        `)
        .eq('patient_id', session!.user.id)
        .order('record_date', { ascending: false });
      
      if (error) throw error;
      
      return data.map((record) => {
        // Get doctor's name
        let doctorName = 'Unknown Doctor';
        if (record.staff) {
          // Format doctor name based on available data
          doctorName = `Dr. ${record.staff.specialization || ''}`;
        }
        
        return {
          id: record.id,
          date: formatDate(record.record_date),
          type: record.record_type || 'Consultation',
          doctor: doctorName,
          hospital: record.hospitals?.name || 'Unknown Hospital',
          description: record.diagnosis || record.notes || 'No description provided.',
        } as MedicalRecord;
      });
    }
  });

  // Fetch upcoming appointments
  const { 
    data: upcomingAppointments = [], 
    isLoading: isLoadingAppointments 
  } = useQuery({
    queryKey: ['patientAppointments', session?.user?.id],
    enabled: !!session?.user?.id,
    queryFn: async () => {
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('appointments')
        .select('*, hospitals:hospital_id(*), doctors:doctor_id(*)')
        .eq('patient_id', session!.user.id)
        .gte('appointment_date', now)
        .order('appointment_date', { ascending: true })
        .limit(5);
      
      if (error) throw error;
      
      return data.map((appointment) => {
        // Handle possible null or missing data safely
        let doctorName = 'Assigned Doctor';
        if (appointment.doctors && typeof appointment.doctors === 'object') {
          doctorName = appointment.doctors?.full_name ? `Dr. ${appointment.doctors.full_name}` : 'Assigned Doctor';
        }
        
        let hospitalName = 'Unknown Hospital';
        if (appointment.hospitals && typeof appointment.hospitals === 'object') {
          hospitalName = appointment.hospitals?.name || 'Unknown Hospital';
        }
        
        return {
          id: appointment.id,
          date: formatDate(appointment.appointment_date),
          time: formatTime(appointment.appointment_date),
          doctor: doctorName,
          hospital: hospitalName,
          department: appointment.department || 'General',
          status: appointment.status || 'Scheduled',
        } as Appointment;
      });
    }
  });

  // Fetch prescriptions
  const { 
    data: prescriptions = [], 
    isLoading: isLoadingPrescriptions 
  } = useQuery<Prescription[]>({
    queryKey: ['patientPrescriptions', session?.user?.id],
    enabled: !!session?.user?.id,
    queryFn: async () => {
      try {
        // Use a direct query approach instead of relying on table relationships
        const { data, error } = await supabase
          .from('prescriptions')
          .select(`
            id,
            created_at,
            medication_name,
            dosage,
            frequency,
            duration,
            status,
            doctors:doctor_id(full_name),
            hospitals:hospital_id(name)
          `)
          .eq('patient_id', session!.user.id)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error("Error fetching prescriptions:", error);
          return [];
        }
        
        return (data as PrescriptionResponseType[]).map((prescription) => {
          // Handle possible null or missing data safely
          let doctorName = 'Unknown Doctor';
          if (prescription.doctors && typeof prescription.doctors === 'object' && 'full_name' in prescription.doctors) {
            doctorName = prescription.doctors.full_name ? `Dr. ${prescription.doctors.full_name}` : 'Unknown Doctor';
          }
          
          let hospitalName = 'Unknown Hospital';
          if (prescription.hospitals && typeof prescription.hospitals === 'object' && 'name' in prescription.hospitals) {
            hospitalName = prescription.hospitals.name || 'Unknown Hospital';
          }
          
          return {
            id: prescription.id,
            date: formatDate(prescription.created_at || ''),
            medication: prescription.medication_name || 'Unknown Medication',
            dosage: prescription.dosage || 'As directed',
            frequency: prescription.frequency || 'As needed',
            duration: prescription.duration || 'As prescribed',
            doctor: doctorName,
            hospital: hospitalName,
            status: prescription.status || 'Active',
          };
        });
      } catch (error) {
        console.error("Error in prescription query:", error);
        return [];
      }
    }
  });

  useEffect(() => {
    if (patientInfo) {
      toast.success(`Welcome back, ${patientInfo.name.split(' ')[0]}!`);
    }
  }, [patientInfo]);

  const isLoading = isLoadingPatient || isLoadingRecords || isLoadingAppointments || isLoadingPrescriptions;

  if (isLoading) {
    return (
      <PatientLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-health-600"></div>
        </div>
      </PatientLayout>
    );
  }

  return (
    <PatientLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Patient Dashboard</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => toast.info("Fetching latest data...")}
            >
              <Clock className="h-4 w-4" />
              Update Records
            </Button>
            <Button 
              className="bg-health-600 hover:bg-health-700"
              onClick={() => setActiveTab("appointments")}
              asChild
            >
              <Link to="/patient-appointments">
                <Calendar className="mr-2 h-4 w-4" />
                Book Appointment
              </Link>
            </Button>
          </div>
        </div>

        {/* Patient Overview Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-500" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Full Name</span>
                  <span className="font-medium">{patientInfo?.name}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Date of Birth</span>
                  <span className="font-medium">{patientInfo?.dateOfBirth}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">NIN</span>
                  <span className="font-medium">{patientInfo?.nin}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Gender</span>
                  <span className="font-medium">{patientInfo?.gender}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Phone Number</span>
                  <span className="font-medium">{patientInfo?.phoneNumber}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="font-medium">{patientInfo?.email}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Blood Type</span>
                  <span className="font-medium">{patientInfo?.bloodType}</span>
                </div>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link to="/patient-settings">Update Information</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-500" />
                Upcoming Appointments
              </CardTitle>
              <CardDescription>
                Your scheduled appointments across all healthcare facilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingAppointments.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Doctor</TableHead>
                        <TableHead className="hidden md:table-cell">Hospital</TableHead>
                        <TableHead className="hidden md:table-cell">Department</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {upcomingAppointments.map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell>
                            <div className="font-medium">{appointment.date}</div>
                            <div className="text-sm text-muted-foreground">{appointment.time}</div>
                          </TableCell>
                          <TableCell>{appointment.doctor}</TableCell>
                          <TableCell className="hidden md:table-cell">{appointment.hospital}</TableCell>
                          <TableCell className="hidden md:table-cell">{appointment.department}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              appointment.status === "Confirmed" || appointment.status === "confirmed"
                                ? "bg-green-100 text-green-800" 
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {appointment.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No upcoming appointments</h3>
                  <p className="mt-1 text-sm text-gray-500">Book your next appointment with your healthcare provider.</p>
                  <div className="mt-6">
                    <Button asChild>
                      <Link to="/patient-appointments">Book Appointment</Link>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Medical Records */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              Medical Records
            </CardTitle>
            <CardDescription>
              Your comprehensive medical history from all healthcare facilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead className="hidden md:table-cell">Hospital</TableHead>
                    <TableHead className="hidden md:table-cell">Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {medicalRecords.length > 0 ? (
                    medicalRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>{record.type}</TableCell>
                        <TableCell>{record.doctor}</TableCell>
                        <TableCell className="hidden md:table-cell">{record.hospital}</TableCell>
                        <TableCell className="hidden md:table-cell max-w-sm truncate">{record.description}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/patient-records?id=${record.id}`}>
                              View Details
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground mb-2">No medical records found</p>
                          <p className="text-xs text-muted-foreground">Your medical history will appear here once available</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Prescriptions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Prescriptions
            </CardTitle>
            <CardDescription>
              Your current and past medication prescriptions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Medication</TableHead>
                    <TableHead>Dosage</TableHead>
                    <TableHead className="hidden md:table-cell">Frequency</TableHead>
                    <TableHead className="hidden md:table-cell">Doctor</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prescriptions.length > 0 ? (
                    prescriptions.map((prescription) => (
                      <TableRow key={prescription.id}>
                        <TableCell>{prescription.date}</TableCell>
                        <TableCell className="font-medium">{prescription.medication}</TableCell>
                        <TableCell>{prescription.dosage}</TableCell>
                        <TableCell className="hidden md:table-cell">{prescription.frequency}</TableCell>
                        <TableCell className="hidden md:table-cell">{prescription.doctor}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            prescription.status === "Active" || prescription.status === "active"
                              ? "bg-green-100 text-green-800" 
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {prescription.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <Heart className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground mb-2">No prescriptions found</p>
                          <p className="text-xs text-muted-foreground">Your prescriptions will appear here once available</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </PatientLayout>
  );
};

export default PatientDashboard;

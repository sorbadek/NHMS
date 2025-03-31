
import { useState } from "react";
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, UserPlus, X, CalendarDays, Clock, Check, Calendar as CalendarIcon } from "lucide-react";
import PatientLayout from "@/components/PatientLayout";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

const PatientAppointments = () => {
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [appointmentReason, setAppointmentReason] = useState("");
  const queryClient = useQueryClient();
  
  // Get current user
  const { data: currentUser, isLoading: isLoadingUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error("Not authenticated");
        
        // Get user profile data
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (userError) throw userError;
        
        // Get patient data
        const { data: patientData, error: patientError } = await supabase
          .from('patients')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        
        if (patientError && patientError.code !== 'PGRST116') {
          throw patientError;
        }
        
        return { 
          ...session.user,
          ...userData,
          patient: patientData || null
        };
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Failed to fetch user information");
        return null;
      }
    }
  });
  
  // Get available hospitals
  const { data: availableHospitals = [], isLoading: isLoadingHospitals } = useQuery({
    queryKey: ['hospitals'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('hospitals')
          .select('*')
          .eq('status', 'active');
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Error fetching hospitals:", error);
        toast.error("Failed to fetch available hospitals");
        return [];
      }
    }
  });
  
  // Get upcoming appointments
  const { data: upcomingAppointments = [], isLoading: isLoadingUpcoming } = useQuery({
    queryKey: ['upcomingAppointments'],
    queryFn: async () => {
      if (!currentUser?.patient?.id) return [];
      
      const today = new Date().toISOString();
      
      try {
        // Using any for now to work around type issues
        const { data, error } = await supabase
          .from('appointments')
          .select(`
            *,
            hospitals:hospital_id(*),
            doctors:doctor_id(*)
          `)
          .eq('patient_id', currentUser.patient.id)
          .gte('appointment_date', today)
          .order('appointment_date', { ascending: true });
        
        if (error) {
          console.error("Error fetching upcoming appointments:", error);
          return [];
        }
        
        return data || [];
      } catch (err) {
        console.error("Error fetching upcoming appointments:", err);
        toast.error("Failed to fetch upcoming appointments");
        return [];
      }
    },
    enabled: !!currentUser?.patient?.id
  });
  
  // Get past appointments
  const { data: pastAppointments = [], isLoading: isLoadingPast } = useQuery({
    queryKey: ['pastAppointments'],
    queryFn: async () => {
      if (!currentUser?.patient?.id) return [];
      
      const today = new Date().toISOString();
      
      try {
        // Using any for now to work around type issues
        const { data, error } = await supabase
          .from('appointments')
          .select(`
            *,
            hospitals:hospital_id(*),
            doctors:doctor_id(*)
          `)
          .eq('patient_id', currentUser.patient.id)
          .lt('appointment_date', today)
          .order('appointment_date', { ascending: false });
        
        if (error) {
          console.error("Error fetching past appointments:", error);
          return [];
        }
        
        return data || [];
      } catch (err) {
        console.error("Error fetching past appointments:", err);
        toast.error("Failed to fetch past appointments");
        return [];
      }
    },
    enabled: !!currentUser?.patient?.id
  });
  
  // Book appointment mutation
  const bookAppointmentMutation = useMutation({
    mutationFn: async (appointmentData: {
      hospitalId: string;
      department: string;
      date: string;
      time: string;
      reason: string;
    }) => {
      if (!currentUser?.patient?.id) {
        throw new Error("Patient profile not found");
      }
      
      try {
        const { data, error } = await supabase
          .from('appointments')
          .insert([{
            patient_id: currentUser.patient.id,
            hospital_id: appointmentData.hospitalId,
            department: appointmentData.department,
            appointment_date: new Date(`${appointmentData.date}T${appointmentData.time}`).toISOString(),
            reason: appointmentData.reason,
            status: 'pending'
          }]);
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.error("Error booking appointment:", error);
        throw error;
      }
    },
    onSuccess: () => {
      // Use the correct invalidation format
      queryClient.invalidateQueries({ queryKey: ['upcomingAppointments'] });
      toast.success("Appointment request submitted successfully!");
      setShowBookingDialog(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(`Failed to book appointment: ${error instanceof Error ? error.message : String(error)}`);
    }
  });
  
  // Cancel appointment mutation
  const cancelAppointmentMutation = useMutation({
    mutationFn: async (appointmentId: string) => {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .update({ status: 'cancelled' })
          .eq('id', appointmentId);
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.error("Error cancelling appointment:", error);
        throw error;
      }
    },
    onSuccess: () => {
      // Use the correct invalidation format
      queryClient.invalidateQueries({ queryKey: ['upcomingAppointments'] });
      toast.success("Appointment cancelled successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to cancel appointment: ${error instanceof Error ? error.message : String(error)}`);
    }
  });
  
  const handleBookAppointment = () => {
    if (!selectedHospital || !selectedDepartment || !appointmentDate || !appointmentTime) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    bookAppointmentMutation.mutate({
      hospitalId: selectedHospital,
      department: selectedDepartment,
      date: appointmentDate,
      time: appointmentTime,
      reason: appointmentReason
    });
  };
  
  const handleCancelAppointment = (appointmentId: string) => {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      cancelAppointmentMutation.mutate(appointmentId);
    }
  };
  
  const resetForm = () => {
    setSelectedHospital("");
    setSelectedDepartment("");
    setAppointmentDate("");
    setAppointmentTime("");
    setAppointmentReason("");
  };
  
  // Format date for display
  const formatDate = (dateString?: string) => {
    try {
      if (!dateString) return '';
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy');
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString || '';
    }
  };
  
  // Format time for display
  const formatTime = (dateString?: string) => {
    try {
      if (!dateString) return '';
      const date = new Date(dateString);
      return format(date, 'hh:mm a');
    } catch (error) {
      console.error("Error formatting time:", error);
      return '';
    }
  };

  // Loading state for the entire page
  const isLoading = isLoadingUser || isLoadingHospitals || isLoadingUpcoming || isLoadingPast;

  if (isLoading) {
    return (
      <PatientLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </PatientLayout>
    );
  }

  // If no patient profile is found
  if (!currentUser?.patient && !isLoadingUser) {
    return (
      <PatientLayout>
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl font-bold mb-4">Patient Profile Not Found</h1>
          <p className="mb-4">You need to complete your patient profile before booking appointments.</p>
          <Button onClick={() => window.location.href = '/patient-dashboard'}>Go to Dashboard</Button>
        </div>
      </PatientLayout>
    );
  }

  return (
    <PatientLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">My Appointments</h1>
          <Button 
            className="bg-health-600 hover:bg-health-700"
            onClick={() => setShowBookingDialog(true)}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Book New Appointment
          </Button>
        </div>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-blue-500" />
              Upcoming Appointments
            </CardTitle>
            <CardDescription>
              Your scheduled appointments across all healthcare facilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingUpcoming ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : upcomingAppointments.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Hospital</TableHead>
                      <TableHead className="hidden md:table-cell">Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingAppointments.map((appointment: any) => (
                      <TableRow key={appointment.id}>
                        <TableCell>
                          <div className="font-medium">{formatDate(appointment?.appointment_date)}</div>
                          <div className="text-sm text-muted-foreground">{formatTime(appointment?.appointment_date)}</div>
                        </TableCell>
                        <TableCell>{appointment?.doctors?.full_name || 'Not assigned'}</TableCell>
                        <TableCell>{appointment?.hospitals?.name || 'Unknown'}</TableCell>
                        <TableCell className="hidden md:table-cell">{appointment?.department || 'General'}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            appointment?.status === "confirmed" 
                              ? "bg-green-100 text-green-800" 
                              : appointment?.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {appointment?.status 
                              ? (appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)) 
                              : 'Unknown'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleCancelAppointment(appointment.id)}
                              disabled={appointment?.status === 'cancelled'}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                            <Button variant="outline" size="sm">
                              <Clock className="h-4 w-4 mr-1" />
                              Reschedule
                            </Button>
                          </div>
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
                  <Button onClick={() => setShowBookingDialog(true)}>Book Appointment</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Past Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              Past Appointments
            </CardTitle>
            <CardDescription>
              Your appointment history across all healthcare facilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingPast ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : pastAppointments.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead className="hidden md:table-cell">Hospital</TableHead>
                      <TableHead className="hidden md:table-cell">Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pastAppointments.map((appointment: any) => (
                      <TableRow key={appointment.id}>
                        <TableCell>
                          <div className="font-medium">{formatDate(appointment?.appointment_date)}</div>
                          <div className="text-sm text-muted-foreground">{formatTime(appointment?.appointment_date)}</div>
                        </TableCell>
                        <TableCell>{appointment?.doctors?.full_name || 'Not assigned'}</TableCell>
                        <TableCell className="hidden md:table-cell">{appointment?.hospitals?.name || 'Unknown'}</TableCell>
                        <TableCell className="hidden md:table-cell">{appointment?.department || 'General'}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            appointment?.status === "completed" 
                              ? "bg-green-100 text-green-800" 
                              : appointment?.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {appointment?.status 
                              ? (appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)) 
                              : 'Unknown'}
                          </span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{appointment?.notes || 'No notes available'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">No past appointments</h3>
                <p className="mt-1 text-sm text-gray-500">Your appointment history will appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Book Appointment Dialog */}
        <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Book New Appointment</DialogTitle>
              <DialogDescription>
                Fill out the form below to request a new appointment with a healthcare provider.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="hospital" className="text-right">
                  Hospital
                </Label>
                <select 
                  id="hospital" 
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={selectedHospital}
                  onChange={(e) => setSelectedHospital(e.target.value)}
                >
                  <option value="">Select a hospital</option>
                  {availableHospitals.map((hospital) => (
                    <option key={hospital.id} value={hospital.id}>{hospital.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="department" className="text-right">
                  Department
                </Label>
                <select 
                  id="department" 
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  disabled={!selectedHospital}
                >
                  <option value="">Select a department</option>
                  <option value="General Medicine">General Medicine</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="Oncology">Oncology</option>
                  <option value="Gynecology">Gynecology</option>
                </select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Preferred Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  className="col-span-3"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time" className="text-right">
                  Preferred Time
                </Label>
                <Input
                  id="time"
                  type="time"
                  className="col-span-3"
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reason" className="text-right">
                  Reason
                </Label>
                <textarea
                  id="reason"
                  className="col-span-3 min-h-[80px] flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Briefly describe your reason for the appointment"
                  value={appointmentReason}
                  onChange={(e) => setAppointmentReason(e.target.value)}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowBookingDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleBookAppointment}
                disabled={bookAppointmentMutation.isPending}
              >
                {bookAppointmentMutation.isPending ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Request Appointment
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PatientLayout>
  );
};

export default PatientAppointments;

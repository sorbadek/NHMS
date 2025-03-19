
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

// Mock past appointments
const pastAppointments = [
  { id: "AP-2023-001", date: "15/05/2023", time: "09:15 AM", doctor: "Dr. James Wilson", hospital: "Central Hospital", department: "General Medicine", status: "Completed", notes: "Follow-up in 3 months." },
  { id: "AP-2023-002", date: "10/04/2023", time: "11:30 AM", doctor: "Dr. Lisa Chen", hospital: "Community Healthcare", department: "Immunology", status: "Completed", notes: "Vaccinations up to date." },
  { id: "AP-2023-003", date: "05/03/2023", time: "02:00 PM", doctor: "Dr. Samantha Lee", hospital: "Central Hospital", department: "Cardiology", status: "Cancelled", notes: "Rescheduled for next week." },
  { id: "AP-2023-004", date: "20/02/2023", time: "10:45 AM", doctor: "Dr. Michael Brown", hospital: "National Medical Center", department: "Radiology", status: "Completed", notes: "No further imaging required." },
];

// Mock upcoming appointments
const upcomingAppointments = [
  { id: "AP-2023-005", date: "20/07/2023", time: "10:30 AM", doctor: "Dr. James Wilson", hospital: "Central Hospital", department: "General Medicine", status: "Confirmed" },
  { id: "AP-2023-006", date: "05/08/2023", time: "02:15 PM", doctor: "Dr. Samantha Lee", hospital: "Central Hospital", department: "Cardiology", status: "Pending" },
];

// Mock available hospitals for booking
const availableHospitals = [
  { id: "H1", name: "Central Hospital", departments: ["General Medicine", "Cardiology", "Neurology", "Pediatrics", "Orthopedics"] },
  { id: "H2", name: "Community Healthcare", departments: ["General Medicine", "Immunology", "Dermatology", "ENT"] },
  { id: "H3", name: "National Medical Center", departments: ["General Medicine", "Radiology", "Oncology", "Urology"] },
];

const PatientAppointments = () => {
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  
  const handleBookAppointment = () => {
    // In a real app, this would send the booking request to the server
    toast.success("Appointment request submitted successfully!");
    setShowBookingDialog(false);
    
    // Reset form
    setSelectedHospital("");
    setSelectedDepartment("");
  };

  const handleCancelAppointment = (appointmentId: string) => {
    // In a real app, this would send a cancellation request to the server
    toast.success("Appointment cancelled successfully!");
  };

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
            {upcomingAppointments.length > 0 ? (
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
                    {upcomingAppointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>
                          <div className="font-medium">{appointment.date}</div>
                          <div className="text-sm text-muted-foreground">{appointment.time}</div>
                        </TableCell>
                        <TableCell>{appointment.doctor}</TableCell>
                        <TableCell>{appointment.hospital}</TableCell>
                        <TableCell className="hidden md:table-cell">{appointment.department}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            appointment.status === "Confirmed" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {appointment.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleCancelAppointment(appointment.id)}
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
                  {pastAppointments.map((appointment) => (
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
                          appointment.status === "Completed" 
                            ? "bg-green-100 text-green-800" 
                            : appointment.status === "Cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {appointment.status}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{appointment.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
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
                  {availableHospitals.map(hospital => (
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
                  {selectedHospital && availableHospitals.find(h => h.id === selectedHospital)?.departments.map(department => (
                    <option key={department} value={department}>{department}</option>
                  ))}
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
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowBookingDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleBookAppointment}>
                <UserPlus className="mr-2 h-4 w-4" />
                Request Appointment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PatientLayout>
  );
};

export default PatientAppointments;

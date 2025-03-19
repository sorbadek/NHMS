
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

// Mock patient data
const patientInfo = {
  id: "P-2023-004",
  name: "Sarah Williams",
  dateOfBirth: "19/09/1995",
  nin: "45678901234",
  gender: "Female",
  phoneNumber: "08045678901",
  email: "sarah.williams@example.com",
  bloodType: "O+",
  allergies: ["Penicillin", "Peanuts"],
  chronicConditions: ["Asthma"],
  emergencyContact: {
    name: "John Williams",
    relationship: "Husband",
    phoneNumber: "08045678902"
  }
};

// Mock medical records
const medicalRecords = [
  { id: "MR-2023-001", date: "15/05/2023", type: "Consultation", doctor: "Dr. James Wilson", hospital: "Central Hospital", description: "Annual check-up. Blood pressure normal, advised on diet and exercise." },
  { id: "MR-2023-002", date: "10/04/2023", type: "Vaccination", doctor: "Dr. Lisa Chen", hospital: "Community Healthcare", description: "Flu shot administered." },
  { id: "MR-2023-003", date: "05/03/2023", type: "Laboratory", doctor: "Dr. Samantha Lee", hospital: "Central Hospital", description: "Blood test results within normal range." },
  { id: "MR-2023-004", date: "20/02/2023", type: "Radiology", doctor: "Dr. Michael Brown", hospital: "National Medical Center", description: "Chest X-ray shows no abnormalities." },
];

// Mock upcoming appointments
const upcomingAppointments = [
  { id: "AP-2023-001", date: "20/07/2023", time: "10:30 AM", doctor: "Dr. James Wilson", hospital: "Central Hospital", department: "General Medicine", status: "Confirmed" },
  { id: "AP-2023-002", date: "05/08/2023", time: "02:15 PM", doctor: "Dr. Samantha Lee", hospital: "Central Hospital", department: "Cardiology", status: "Pending" },
];

// Mock prescriptions
const prescriptions = [
  { id: "PR-2023-001", date: "15/05/2023", medication: "Amoxicillin", dosage: "500mg", frequency: "3 times daily", duration: "7 days", doctor: "Dr. James Wilson", hospital: "Central Hospital", status: "Active" },
  { id: "PR-2023-002", date: "15/05/2023", medication: "Ibuprofen", dosage: "400mg", frequency: "As needed", duration: "PRN", doctor: "Dr. James Wilson", hospital: "Central Hospital", status: "Active" },
  { id: "PR-2023-003", date: "10/04/2023", medication: "Loratadine", dosage: "10mg", frequency: "Once daily", duration: "30 days", doctor: "Dr. Lisa Chen", hospital: "Community Healthcare", status: "Completed" },
];

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  useEffect(() => {
    // Simulate loading patient data
    toast.success("Welcome back, Sarah!");
  }, []);

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
            >
              <Calendar className="mr-2 h-4 w-4" />
              Book Appointment
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
                  <span className="font-medium">{patientInfo.name}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Date of Birth</span>
                  <span className="font-medium">{patientInfo.dateOfBirth}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">NIN</span>
                  <span className="font-medium">{patientInfo.nin}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Gender</span>
                  <span className="font-medium">{patientInfo.gender}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Phone Number</span>
                  <span className="font-medium">{patientInfo.phoneNumber}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="font-medium">{patientInfo.email}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Blood Type</span>
                  <span className="font-medium">{patientInfo.bloodType}</span>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Update Information
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
                              appointment.status === "Confirmed" 
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
                    <Button>Book Appointment</Button>
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
                  {medicalRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.type}</TableCell>
                      <TableCell>{record.doctor}</TableCell>
                      <TableCell className="hidden md:table-cell">{record.hospital}</TableCell>
                      <TableCell className="hidden md:table-cell max-w-sm truncate">{record.description}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Active Prescriptions */}
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
                  {prescriptions.map((prescription) => (
                    <TableRow key={prescription.id}>
                      <TableCell>{prescription.date}</TableCell>
                      <TableCell className="font-medium">{prescription.medication}</TableCell>
                      <TableCell>{prescription.dosage}</TableCell>
                      <TableCell className="hidden md:table-cell">{prescription.frequency}</TableCell>
                      <TableCell className="hidden md:table-cell">{prescription.doctor}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          prescription.status === "Active" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {prescription.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
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


import { useState } from "react";
import HospitalLayout from "@/components/HospitalLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Activity, 
  Users, 
  Bed, 
  UserCheck, 
  Clock, 
  AlertCircle 
} from "lucide-react";

const HospitalDashboard = () => {
  // Mock data for the dashboard
  const stats = [
    { title: "Total Patients", value: "1,234", icon: Users, color: "text-blue-500" },
    { title: "Available Beds", value: "42/100", icon: Bed, color: "text-green-500" },
    { title: "On Duty Staff", value: "48", icon: UserCheck, color: "text-purple-500" },
    { title: "Critical Cases", value: "7", icon: AlertCircle, color: "text-red-500" },
  ];

  const recentPatients = [
    { id: "P-2023-001", name: "John Doe", status: "Admitted", time: "2 hours ago", department: "Cardiology" },
    { id: "P-2023-002", name: "Jane Smith", status: "Discharged", time: "5 hours ago", department: "Orthopedics" },
    { id: "P-2023-003", name: "Robert Johnson", status: "Admitted", time: "1 day ago", department: "Neurology" },
    { id: "P-2023-004", name: "Sarah Williams", status: "Emergency", time: "30 minutes ago", department: "ER" },
    { id: "P-2023-005", name: "Michael Brown", status: "Outpatient", time: "3 hours ago", department: "Dermatology" },
  ];

  const appointmentsToday = [
    { id: "A-2023-051", name: "Alice Johnson", time: "10:00 AM", doctor: "Dr. Sarah Wilson", department: "Cardiology" },
    { id: "A-2023-052", name: "Bob Smith", time: "11:30 AM", doctor: "Dr. James Brown", department: "Neurology" },
    { id: "A-2023-053", name: "Carol Williams", time: "1:15 PM", doctor: "Dr. Emily Davis", department: "Orthopedics" },
    { id: "A-2023-054", name: "David Miller", time: "3:00 PM", doctor: "Dr. Michael Lee", department: "Ophthalmology" },
  ];

  return (
    <HospitalLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Hospital Dashboard</h1>
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <span className="text-muted-foreground">
              {new Date().toLocaleString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Activity Chart and Patients Table */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Overview */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-muted-foreground" />
                Hospital Activity
              </CardTitle>
              <CardDescription>Patient admissions and discharges in the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center bg-muted/10 rounded-md border border-dashed">
                <span className="text-muted-foreground">Activity chart will be displayed here</span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Patients */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Recent Patients</CardTitle>
              <CardDescription>Latest patient activities</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Department</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.id}</TableCell>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          patient.status === "Emergency" 
                            ? "bg-red-100 text-red-800" 
                            : patient.status === "Admitted" 
                            ? "bg-blue-100 text-blue-800" 
                            : patient.status === "Discharged" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {patient.status}
                        </span>
                      </TableCell>
                      <TableCell>{patient.department}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Today's Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Appointments</CardTitle>
            <CardDescription>Scheduled appointments for today</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Appointment ID</TableHead>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Department</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointmentsToday.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="font-medium">{appointment.id}</TableCell>
                    <TableCell>{appointment.name}</TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>{appointment.doctor}</TableCell>
                    <TableCell>{appointment.department}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </HospitalLayout>
  );
};

export default HospitalDashboard;

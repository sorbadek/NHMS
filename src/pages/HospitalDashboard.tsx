
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Calendar,
  Users,
  Bed,
  Activity,
  FileText,
  User,
  BadgeAlert,
  RefreshCw,
  HardDrive,
  CheckCircle2,
  ClipboardList,
} from "lucide-react";
import HospitalLayout from "@/components/HospitalLayout";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

const HospitalDashboard = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");
  
  // Get current hospital
  const { data: currentHospitalId } = useQuery({
    queryKey: ['currentHospitalId'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");
      
      // Get hospital staff record for current user
      const { data: staffData, error: staffError } = await supabase
        .from('hospital_staff')
        .select('hospital_id')
        .eq('user_id', session.user.id)
        .single();
      
      if (staffError) throw staffError;
      return staffData.hospital_id;
    }
  });
  
  // Get hospital resources
  const { data: resources = [] } = useQuery({
    queryKey: ['hospitalResources', currentHospitalId],
    queryFn: async () => {
      if (!currentHospitalId) return [];
      
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('hospital_id', currentHospitalId);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!currentHospitalId
  });
  
  // Get total beds and available beds
  const totalBeds = resources
    .filter(resource => resource.type === 'bed')
    .reduce((sum, bed) => sum + (bed.quantity || 0), 0);
  
  const availableBeds = resources
    .filter(resource => resource.type === 'bed' && resource.status === 'available')
    .reduce((sum, bed) => sum + (bed.quantity || 0), 0);
  
  // Get registered patients
  const { data: registeredPatients = [] } = useQuery({
    queryKey: ['registeredPatients', currentHospitalId],
    queryFn: async () => {
      if (!currentHospitalId) return [];
      
      // Get unique patients that have had appointments at this hospital
      const { data, error } = await supabase
        .from('appointments')
        .select('patient_id')
        .eq('hospital_id', currentHospitalId)
        .is('patient_id', 'not.null');
      
      if (error) throw error;
      
      // Get unique patient IDs
      const uniquePatientIds = [...new Set(data.map(record => record.patient_id))];
      return uniquePatientIds || [];
    },
    enabled: !!currentHospitalId
  });
  
  // Get recent medical records
  const { data: recentMedicalRecords = [] } = useQuery({
    queryKey: ['recentMedicalRecords', currentHospitalId],
    queryFn: async () => {
      if (!currentHospitalId) return [];
      
      const { data, error } = await supabase
        .from('medical_records')
        .select('*')
        .eq('hospital_id', currentHospitalId)
        .order('record_date', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!currentHospitalId
  });
  
  // Get upcoming appointments
  const { data: upcomingAppointments = [] } = useQuery({
    queryKey: ['upcomingHospitalAppointments', currentHospitalId],
    queryFn: async () => {
      if (!currentHospitalId) return [];
      
      const today = new Date().toISOString();
      
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select(`
            *,
            patients:patient_id(*),
            doctors:doctor_id(*)
          `)
          .eq('hospital_id', currentHospitalId)
          .gte('appointment_date', today)
          .order('appointment_date', { ascending: true })
          .limit(5);
        
        if (error) throw error;
        return data || [];
      } catch (err) {
        console.error("Error fetching hospital appointments:", err);
        return [];
      }
    },
    enabled: !!currentHospitalId
  });
  
  // Get hospital staff count
  const { data: staffCount = 0 } = useQuery({
    queryKey: ['hospitalStaffCount', currentHospitalId],
    queryFn: async () => {
      if (!currentHospitalId) return 0;
      
      const { count, error } = await supabase
        .from('hospital_staff')
        .select('*', { count: 'exact', head: true })
        .eq('hospital_id', currentHospitalId);
      
      if (error) throw error;
      return count || 0;
    },
    enabled: !!currentHospitalId
  });

  // Format date for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy');
    } catch (error) {
      return dateString;
    }
  };
  
  // Format time for display
  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'hh:mm a');
    } catch (error) {
      return '';
    }
  };

  // Mock data for charts
  const patientAdmissionData = [
    { name: "Mon", count: 35 },
    { name: "Tue", count: 42 },
    { name: "Wed", count: 38 },
    { name: "Thu", count: 47 },
    { name: "Fri", count: 51 },
    { name: "Sat", count: 33 },
    { name: "Sun", count: 29 },
  ];

  const resourceUtilizationData = [
    { name: "Beds", value: 85 },
    { name: "Medicines", value: 60 },
    { name: "Equipment", value: 72 },
    { name: "Staff", value: 90 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <HospitalLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Hospital Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Data
            </Button>
            <Button className="bg-health-600 hover:bg-health-700">
              <Calendar className="mr-2 h-4 w-4" />
              View Calendar
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Registered Patients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{registeredPatients.length}</div>
                <Users className="h-6 w-6 text-health-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                +12% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Available Beds
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{availableBeds} <span className="text-sm font-normal text-muted-foreground">of {totalBeds}</span></div>
                <Bed className="h-6 w-6 text-health-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {Math.round((availableBeds / totalBeds) * 100)}% availability rate
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Critical Cases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">8</div>
                <Activity className="h-6 w-6 text-health-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                -3% from last week
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Staff Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{staffCount}</div>
                <User className="h-6 w-6 text-health-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                +2 new members this month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Patient Flow Chart & Resource Utilization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="col-span-1">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Patient Admissions</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant={selectedTimeframe === "week" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTimeframe("week")}
                  >
                    Week
                  </Button>
                  <Button
                    variant={selectedTimeframe === "month" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTimeframe("month")}
                  >
                    Month
                  </Button>
                </div>
              </div>
              <CardDescription>
                Number of patients admitted over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={patientAdmissionData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: 0,
                      bottom: 20,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar
                      dataKey="count"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                      name="Patients"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Resource Utilization</CardTitle>
              <CardDescription>
                Current usage of hospital resources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={resourceUtilizationData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {resourceUtilizationData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={40} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Medical Records */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              Recent Medical Records
            </CardTitle>
            <CardDescription>
              Latest medical records across all patients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Record Type</TableHead>
                    <TableHead className="hidden md:table-cell">Diagnosis</TableHead>
                    <TableHead className="hidden md:table-cell">Treatment</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentMedicalRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{formatDate(record.record_date)}</TableCell>
                      <TableCell>{record.record_type}</TableCell>
                      <TableCell className="hidden md:table-cell max-w-sm truncate">{record.diagnosis}</TableCell>
                      <TableCell className="hidden md:table-cell max-w-sm truncate">{record.treatment}</TableCell>
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

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-500" />
              Upcoming Appointments
            </CardTitle>
            <CardDescription>
              Recently scheduled appointments at this hospital
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead className="hidden md:table-cell">Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        <div className="font-medium">{formatDate(appointment.appointment_date)}</div>
                        <div className="text-sm text-muted-foreground">{formatTime(appointment.appointment_date)}</div>
                      </TableCell>
                      <TableCell>{appointment.patients?.full_name || 'Unknown'}</TableCell>
                      <TableCell>{appointment.doctors?.full_name || 'Not assigned'}</TableCell>
                      <TableCell className="hidden md:table-cell">{appointment.department}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          appointment.status === "confirmed" 
                            ? "bg-green-100 text-green-800" 
                            : appointment.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {appointment.status ? (appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)) : 'Unknown'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-auto py-4 flex flex-col justify-center items-center gap-2">
            <User className="h-5 w-5" />
            <span>Admit Patient</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex flex-col justify-center items-center gap-2">
            <BadgeAlert className="h-5 w-5" />
            <span>Report Emergency</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex flex-col justify-center items-center gap-2">
            <HardDrive className="h-5 w-5" />
            <span>Update Resources</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex flex-col justify-center items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            <span>Generate Report</span>
          </Button>
        </div>
      </div>
    </HospitalLayout>
  );
};

export default HospitalDashboard;

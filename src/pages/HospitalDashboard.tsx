
import { useState, useEffect } from "react";
import HospitalLayout from "@/components/HospitalLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Activity, 
  Users, 
  Bed, 
  UserCheck, 
  Clock, 
  AlertCircle, 
  Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const HospitalDashboard = () => {
  // Get current hospital staff info
  const { 
    data: staffInfo,
    isLoading: isLoadingStaffInfo 
  } = useQuery({
    queryKey: ['currentHospitalStaff'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");
      
      // Get user profile data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (userError) throw userError;
      
      // Get staff data
      const { data: staffData, error: staffError } = await supabase
        .from('hospital_staff')
        .select('*, hospitals(*)')
        .eq('user_id', session.user.id)
        .single();
      
      if (staffError) throw staffError;
      
      return {
        ...userData,
        ...staffData
      };
    }
  });
  
  // Get hospital stats
  const { 
    data: hospitalStats,
    isLoading: isLoadingStats 
  } = useQuery({
    queryKey: ['hospitalStats', staffInfo?.hospital_id],
    queryFn: async () => {
      if (!staffInfo?.hospital_id) throw new Error("Hospital not found");
      
      // Get total patients
      const { count: totalPatients, error: patientsError } = await supabase
        .from('medical_records')
        .select('patient_id', { count: 'exact', head: true })
        .eq('hospital_id', staffInfo.hospital_id)
        .is('discharge_date', null);
      
      if (patientsError) throw patientsError;
      
      // Get beds info
      const { data: bedsData, error: bedsError } = await supabase
        .from('resources')
        .select('*')
        .eq('hospital_id', staffInfo.hospital_id)
        .eq('type', 'bed')
        .single();
      
      const totalBeds = bedsData?.quantity || 100;
      const availableBeds = bedsData?.available || (totalBeds - (totalPatients || 0));
      
      if (bedsError && bedsError.code !== 'PGRST116') throw bedsError;
      
      // Get total staff
      const { count: totalStaff, error: staffError } = await supabase
        .from('hospital_staff')
        .select('id', { count: 'exact', head: true })
        .eq('hospital_id', staffInfo.hospital_id)
        .eq('status', 'active');
      
      if (staffError) throw staffError;
      
      // Get critical cases
      const { count: criticalCases, error: criticalError } = await supabase
        .from('medical_records')
        .select('id', { count: 'exact', head: true })
        .eq('hospital_id', staffInfo.hospital_id)
        .eq('severity', 'critical')
        .is('discharge_date', null);
      
      if (criticalError) throw criticalError;
      
      return {
        totalPatients: totalPatients || 0,
        availableBeds: `${availableBeds}/${totalBeds}`,
        totalStaff: totalStaff || 0,
        criticalCases: criticalCases || 0
      };
    },
    enabled: !!staffInfo?.hospital_id
  });
  
  // Get recent patients
  const { 
    data: recentPatients = [],
    isLoading: isLoadingPatients 
  } = useQuery({
    queryKey: ['recentPatients', staffInfo?.hospital_id],
    queryFn: async () => {
      if (!staffInfo?.hospital_id) return [];
      
      const { data, error } = await supabase
        .from('medical_records')
        .select(`
          id,
          record_date,
          severity,
          record_type,
          diagnosis,
          patients:patient_id(*)
        `)
        .eq('hospital_id', staffInfo.hospital_id)
        .order('record_date', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      
      return data.map(record => ({
        id: record.id,
        name: record.patients?.full_name || 'Unknown',
        status: record.severity || (record.record_type === 'admission' ? 'Admitted' : 'Outpatient'),
        time: new Date(record.record_date).toLocaleString(),
        department: record.diagnosis || 'General'
      }));
    },
    enabled: !!staffInfo?.hospital_id
  });
  
  // Get today's appointments
  const { 
    data: appointmentsToday = [],
    isLoading: isLoadingAppointments 
  } = useQuery({
    queryKey: ['todayAppointments', staffInfo?.hospital_id],
    queryFn: async () => {
      if (!staffInfo?.hospital_id) return [];
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          appointment_date,
          department,
          status,
          patients:patient_id(*),
          doctors:doctor_id(*)
        `)
        .eq('hospital_id', staffInfo.hospital_id)
        .gte('appointment_date', today.toISOString())
        .lt('appointment_date', tomorrow.toISOString())
        .order('appointment_date');
      
      if (error) throw error;
      
      return data.map(appointment => ({
        id: appointment.id,
        name: appointment.patients?.full_name || 'Unknown',
        time: new Date(appointment.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        doctor: appointment.doctors?.full_name || 'Unassigned',
        department: appointment.department || 'General'
      }));
    },
    enabled: !!staffInfo?.hospital_id
  });
  
  // Activity data for the chart
  const { 
    data: activityData = [],
    isLoading: isLoadingActivity 
  } = useQuery({
    queryKey: ['hospitalActivity', staffInfo?.hospital_id],
    queryFn: async () => {
      if (!staffInfo?.hospital_id) return [];
      
      // Get the last 7 days
      const dates = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push({
          date: date.toISOString().split('T')[0],
          label: date.toLocaleDateString('en-US', { weekday: 'short' })
        });
      }
      
      // For each day, get admissions and discharges
      const result = [];
      
      for (const { date, label } of dates) {
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);
        
        // Get admissions
        const { count: admissions, error: admissionsError } = await supabase
          .from('medical_records')
          .select('id', { count: 'exact', head: true })
          .eq('hospital_id', staffInfo.hospital_id)
          .eq('record_type', 'admission')
          .gte('record_date', startDate.toISOString())
          .lte('record_date', endDate.toISOString());
        
        if (admissionsError) throw admissionsError;
        
        // Get discharges
        const { count: discharges, error: dischargesError } = await supabase
          .from('medical_records')
          .select('id', { count: 'exact', head: true })
          .eq('hospital_id', staffInfo.hospital_id)
          .not('discharge_date', 'is', null)
          .gte('discharge_date', startDate.toISOString())
          .lte('discharge_date', endDate.toISOString());
        
        if (dischargesError) throw dischargesError;
        
        result.push({
          name: label,
          admissions: admissions || 0,
          discharges: discharges || 0
        });
      }
      
      return result;
    },
    enabled: !!staffInfo?.hospital_id
  });
  
  // Stats for the dashboard
  const stats = [
    { 
      title: "Total Patients", 
      value: isLoadingStats ? "Loading..." : hospitalStats?.totalPatients.toString() || "0", 
      icon: Users, 
      color: "text-blue-500" 
    },
    { 
      title: "Available Beds", 
      value: isLoadingStats ? "Loading..." : hospitalStats?.availableBeds || "0/0", 
      icon: Bed, 
      color: "text-green-500" 
    },
    { 
      title: "On Duty Staff", 
      value: isLoadingStats ? "Loading..." : hospitalStats?.totalStaff.toString() || "0", 
      icon: UserCheck, 
      color: "text-purple-500" 
    },
    { 
      title: "Critical Cases", 
      value: isLoadingStats ? "Loading..." : hospitalStats?.criticalCases.toString() || "0", 
      icon: AlertCircle, 
      color: "text-red-500" 
    },
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

        {/* Welcome card */}
        {isLoadingStaffInfo ? (
          <Card>
            <CardContent className="p-6 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-health-600" />
            </CardContent>
          </Card>
        ) : staffInfo ? (
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">Welcome, {staffInfo.full_name || 'Staff Member'}</h2>
                  <p className="text-muted-foreground mt-1">
                    {staffInfo.hospitals?.name || 'Hospital'} • {staffInfo.role || 'Staff'} • {staffInfo.department || 'Department'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}

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
              {isLoadingActivity ? (
                <div className="h-[200px] flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-health-600" />
                </div>
              ) : activityData.length > 0 ? (
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={activityData}
                      margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="admissions" name="Admissions" fill="#4f46e5" />
                      <Bar dataKey="discharges" name="Discharges" fill="#22c55e" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[200px] flex items-center justify-center bg-muted/10 rounded-md border border-dashed">
                  <span className="text-muted-foreground">No activity data available</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Patients */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Recent Patients</CardTitle>
              <CardDescription>Latest patient activities</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingPatients ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="h-8 w-8 animate-spin text-health-600" />
                </div>
              ) : recentPatients.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Department</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentPatients.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell className="font-medium">{patient.name}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            patient.status === "critical" 
                              ? "bg-red-100 text-red-800" 
                              : patient.status === "Admitted" 
                              ? "bg-blue-100 text-blue-800" 
                              : patient.status === "Discharged" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {typeof patient.status === 'string' ? 
                              patient.status.charAt(0).toUpperCase() + patient.status.slice(1) : 
                              'Unknown'}
                          </span>
                        </TableCell>
                        <TableCell>{patient.department}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No recent patients</p>
                </div>
              )}
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
            {isLoadingAppointments ? (
              <div className="flex justify-center py-6">
                <Loader2 className="h-8 w-8 animate-spin text-health-600" />
              </div>
            ) : appointmentsToday.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Department</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointmentsToday.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell className="font-medium">{appointment.name}</TableCell>
                      <TableCell>{appointment.time}</TableCell>
                      <TableCell>{appointment.doctor}</TableCell>
                      <TableCell>{appointment.department}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No appointments scheduled for today</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </HospitalLayout>
  );
};

export default HospitalDashboard;

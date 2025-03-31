
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Building, User, Shield, Users, Settings, FileText, BarChart, Lock } from "lucide-react";
import { toast } from "sonner";
import { supabase, UserRole } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

// Simple admin layout component
const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Lock className="h-6 w-6 text-purple-600" />
            <h1 className="text-xl font-bold">Super Admin Dashboard</h1>
          </div>
          <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 md:grid-cols-7 gap-2">
            <TabsTrigger value="dashboard">Overview</TabsTrigger>
            <TabsTrigger value="hospitals">Hospitals</TabsTrigger>
            <TabsTrigger value="police">Police</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {children}
        </Tabs>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  // Check if user is super admin
  const { data: userRole, isLoading } = useQuery({
    queryKey: ['adminUserRole'],
    queryFn: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error("Not authenticated");
        
        const { data: userData, error } = await supabase
          .from('users')
          .select('user_type')
          .eq('id', session.user.id)
          .single();
        
        if (error) throw error;
        return userData.user_type;
      } catch (error) {
        console.error("Error fetching user role:", error);
        return null;
      }
    }
  });

  // If not super admin, redirect
  if (!isLoading && userRole !== 'admin' && userRole !== 'super_admin') {
    toast.error("You don't have permission to access this page");
    navigate("/auth");
    return null;
  }

  // Mock statistics for the dashboard
  const stats = [
    { title: "Registered Hospitals", value: 148, icon: <Building className="h-5 w-5 text-blue-500" /> },
    { title: "Police Departments", value: 52, icon: <Shield className="h-5 w-5 text-indigo-500" /> },
    { title: "Total Users", value: "15,427", icon: <Users className="h-5 w-5 text-green-500" /> },
    { title: "Active Patients", value: "12,892", icon: <User className="h-5 w-5 text-amber-500" /> },
  ];

  return (
    <AdminLayout>
      <TabsContent value="dashboard" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Registrations</CardTitle>
              <CardDescription>
                Recently registered organizations and users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-blue-500" />
                    <span>Central Community Hospital</span>
                  </div>
                  <span className="text-sm text-muted-foreground">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-indigo-500" />
                    <span>North Division Police Department</span>
                  </div>
                  <span className="text-sm text-muted-foreground">1 day ago</span>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-blue-500" />
                    <span>Children's Medical Center</span>
                  </div>
                  <span className="text-sm text-muted-foreground">2 days ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-indigo-500" />
                    <span>Highway Patrol Division</span>
                  </div>
                  <span className="text-sm text-muted-foreground">3 days ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>
                Important system notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <FileText className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-yellow-800">Database backup scheduled</p>
                      <p className="text-sm text-yellow-700 mt-1">Today at 02:00 AM</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Settings className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">System update completed</p>
                      <p className="text-sm text-green-700 mt-1">Yesterday at 11:30 PM</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <BarChart className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-blue-800">Monthly usage report ready</p>
                      <p className="text-sm text-blue-700 mt-1">Generated on June 1, 2023</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="hospitals">
        <Card>
          <CardHeader>
            <CardTitle>Hospital Management</CardTitle>
            <CardDescription>
              Register and manage hospitals in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center py-8 text-muted-foreground">
              This section allows super admins to manage all registered hospitals.
              <br />
              Please implement the detailed hospital management interface based on requirements.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="police">
        <Card>
          <CardHeader>
            <CardTitle>Police Department Management</CardTitle>
            <CardDescription>
              Register and manage police departments in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center py-8 text-muted-foreground">
              This section allows super admins to manage all police departments.
              <br />
              Please implement the detailed police department management interface based on requirements.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="users">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Manage all users across the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center py-8 text-muted-foreground">
              This section allows super admins to manage all users across the platform.
              <br />
              Please implement the detailed user management interface based on requirements.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="reports">
        <Card>
          <CardHeader>
            <CardTitle>System Reports</CardTitle>
            <CardDescription>
              View and generate system reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center py-8 text-muted-foreground">
              This section allows super admins to view and generate system-wide reports.
              <br />
              Please implement the detailed reporting interface based on requirements.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="audit">
        <Card>
          <CardHeader>
            <CardTitle>Audit Logs</CardTitle>
            <CardDescription>
              View system audit logs and activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center py-8 text-muted-foreground">
              This section allows super admins to view all system audit logs and activity.
              <br />
              Please implement the detailed audit log interface based on requirements.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="settings">
        <Card>
          <CardHeader>
            <CardTitle>System Settings</CardTitle>
            <CardDescription>
              Configure system-wide settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center py-8 text-muted-foreground">
              This section allows super admins to configure system-wide settings.
              <br />
              Please implement the detailed settings interface based on requirements.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </AdminLayout>
  );
};

export default AdminDashboard;

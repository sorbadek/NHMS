
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, User, Shield, Users, FileText, BarChart, AlertTriangle, Bell, Settings, Activity } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Mock statistics for the dashboard
  const stats = [
    { title: "Registered Hospitals", value: 148, icon: <Building className="h-5 w-5 text-blue-500" /> },
    { title: "Police Departments", value: 52, icon: <Shield className="h-5 w-5 text-indigo-500" /> },
    { title: "Total Users", value: "15,427", icon: <Users className="h-5 w-5 text-green-500" /> },
    { title: "Active Patients", value: "12,892", icon: <User className="h-5 w-5 text-amber-500" /> },
  ];

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <AdminLayout activeTab={activeTab} onTabChange={handleTabChange}>
      <TabContent activeTab={activeTab} stats={stats} />
    </AdminLayout>
  );
};

interface TabContentProps {
  activeTab: string;
  stats: Array<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
  }>;
}

const TabContent = ({ activeTab, stats }: TabContentProps) => {
  switch (activeTab) {
    case "dashboard":
      return <DashboardTab stats={stats} />;
    case "hospitals":
      return <HospitalsTab />;
    case "police":
      return <PoliceTab />;
    case "users":
      return <UsersTab />;
    case "reports":
      return <ReportsTab />;
    case "audit":
      return <AuditTab />;
    case "settings":
      return <SettingsTab />;
    default:
      return <DashboardTab stats={stats} />;
  }
};

const DashboardTab = ({ stats }: { stats: TabContentProps["stats"] }) => (
  <>
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

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
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
  </>
);

const HospitalsTab = () => (
  <Card>
    <CardHeader>
      <CardTitle>Hospital Management</CardTitle>
      <CardDescription>
        Register and manage hospitals in the system
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex justify-end mb-4">
        <Button>
          <Building className="mr-2 h-4 w-4" />
          Register New Hospital
        </Button>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Count</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[1, 2, 3, 4, 5].map((item) => (
              <tr key={item}>
                <td className="px-4 py-4 whitespace-nowrap">General Hospital {item}</td>
                <td className="px-4 py-4 whitespace-nowrap">Lagos, Nigeria</td>
                <td className="px-4 py-4 whitespace-nowrap">{Math.floor(Math.random() * 100) + 20}</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Button variant="ghost" size="sm">View</Button>
                  <Button variant="ghost" size="sm">Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
);

const PoliceTab = () => (
  <Card>
    <CardHeader>
      <CardTitle>Police Department Management</CardTitle>
      <CardDescription>
        Register and manage police departments in the system
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex justify-end mb-4">
        <Button>
          <Shield className="mr-2 h-4 w-4" />
          Register New Department
        </Button>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jurisdiction</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Officer Count</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[1, 2, 3, 4, 5].map((item) => (
              <tr key={item}>
                <td className="px-4 py-4 whitespace-nowrap">Central Division {item}</td>
                <td className="px-4 py-4 whitespace-nowrap">Abuja, Nigeria</td>
                <td className="px-4 py-4 whitespace-nowrap">{Math.floor(Math.random() * 50) + 10}</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Button variant="ghost" size="sm">View</Button>
                  <Button variant="ghost" size="sm">Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
);

const UsersTab = () => (
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
);

const ReportsTab = () => (
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
);

const AuditTab = () => (
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
);

const SettingsTab = () => (
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
);

export default AdminDashboard;


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HospitalLayout from "@/components/HospitalLayout";
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
import { Input } from "@/components/ui/input";
import { 
  Search, 
  UserPlus, 
  Edit, 
  Trash2, 
  UserCog,
  BadgeCheck,
  Clock,
  Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface Staff {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  status: string;
}

const StaffManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentHospitalId, setCurrentHospitalId] = useState<string | null>(null);
  
  useEffect(() => {
    const checkSession = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session?.user) {
        setCurrentUserId(sessionData.session.user.id);
        
        // Get user's hospital
        const { data } = await supabase
          .from('hospital_staff')
          .select('hospital_id')
          .eq('user_id', sessionData.session.user.id)
          .single();
        
        if (data) {
          setCurrentHospitalId(data.hospital_id);
        }
      } else {
        // Redirect to login if not authenticated
        navigate('/auth');
      }
    };
    
    checkSession();
  }, [navigate]);

  // Fetch staff data
  const { data: staffData, isLoading, error } = useQuery({
    queryKey: ['staff', currentHospitalId],
    queryFn: async () => {
      if (!currentHospitalId) return [];
      
      const { data, error } = await supabase
        .from('hospital_staff')
        .select(`
          id,
          role,
          department,
          status,
          user_id,
          users:user_id (
            full_name,
            email,
            phone
          )
        `)
        .eq('hospital_id', currentHospitalId);
      
      if (error) throw error;
      
      return data.map(staff => ({
        id: staff.id,
        name: staff.users?.full_name || 'Unknown',
        role: staff.role || 'Undefined',
        department: staff.department || 'General',
        email: staff.users?.email || 'N/A',
        phone: staff.users?.phone || 'N/A',
        status: staff.status || 'Unknown'
      }));
    },
    enabled: !!currentHospitalId
  });

  // Filter staff based on search term
  const filteredStaff = staffData?.filter(staff => 
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.department.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Count staff by role
  const roleCount = staffData?.reduce((acc: Record<string, number>, staff) => {
    const role = staff.role.includes("doctor") ? "Doctors" : 
               staff.role.includes("nurse") ? "Nurses" : "Other Staff";
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {}) || {};

  // Navigate to staff registration page
  const handleAddStaff = () => {
    navigate('/staff-registration');
  };

  if (error) {
    return (
      <HospitalLayout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-800">
            Error loading staff data. Please try again later.
          </div>
        </div>
      </HospitalLayout>
    );
  }

  return (
    <HospitalLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
          <Button 
            className="bg-health-600 hover:bg-health-700"
            onClick={handleAddStaff}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add New Staff
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Staff
              </CardTitle>
              <UserCog className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{staffData?.length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Across all departments
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Doctors
              </CardTitle>
              <BadgeCheck className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{roleCount["Doctors"] || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Specialists and general practitioners
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Nurses
              </CardTitle>
              <BadgeCheck className="h-5 w-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{roleCount["Nurses"] || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Nursing staff across all departments
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Currently On Duty
              </CardTitle>
              <Clock className="h-5 w-5 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {staffData?.filter(s => s.status === "active").length || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Staff currently working
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Staff Directory</CardTitle>
            <CardDescription>Manage hospital staff, view shifts, and assign roles</CardDescription>
            <div className="mt-4 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, role, or department..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="hidden md:table-cell">Department</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead className="hidden md:table-cell">Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center h-24">
                        <div className="flex justify-center items-center">
                          <Loader2 className="h-8 w-8 animate-spin text-health-600" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredStaff.length > 0 ? (
                    filteredStaff.map((staff) => (
                      <TableRow key={staff.id}>
                        <TableCell className="font-medium">{staff.id.substring(0, 8)}</TableCell>
                        <TableCell>{staff.name}</TableCell>
                        <TableCell>{staff.role}</TableCell>
                        <TableCell className="hidden md:table-cell">{staff.department}</TableCell>
                        <TableCell className="hidden md:table-cell">{staff.email}</TableCell>
                        <TableCell className="hidden md:table-cell">{staff.phone}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            staff.status === "active" 
                              ? "bg-green-100 text-green-800" 
                              : staff.status === "inactive"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-amber-100 text-amber-800"
                          }`}>
                            {staff.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon" title="Edit Staff">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="text-red-500 hover:text-red-700" title="Delete Staff">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center h-24">
                        No staff members found matching your search criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </HospitalLayout>
  );
};

export default StaffManagement;


import { useState } from "react";
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
  Clock
} from "lucide-react";

const StaffManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock data for staff
  const staffMembers = [
    { id: "S-2023-001", name: "Dr. Sarah Wilson", role: "Cardiologist", department: "Cardiology", email: "sarah.wilson@nhms.gov.ng", phone: "08012345678", status: "On Duty" },
    { id: "S-2023-002", name: "Dr. James Brown", role: "Neurologist", department: "Neurology", email: "james.brown@nhms.gov.ng", phone: "08023456789", status: "On Duty" },
    { id: "S-2023-003", name: "Dr. Emily Davis", role: "Orthopedic Surgeon", department: "Orthopedics", email: "emily.davis@nhms.gov.ng", phone: "08034567890", status: "Off Duty" },
    { id: "S-2023-004", name: "Dr. Michael Lee", role: "Ophthalmologist", department: "Ophthalmology", email: "michael.lee@nhms.gov.ng", phone: "08045678901", status: "On Duty" },
    { id: "S-2023-005", name: "Nurse Janet Adeyemi", role: "Head Nurse", department: "Nursing", email: "janet.adeyemi@nhms.gov.ng", phone: "08056789012", status: "On Duty" },
    { id: "S-2023-006", name: "Nurse Peter Okafor", role: "Staff Nurse", department: "Emergency", email: "peter.okafor@nhms.gov.ng", phone: "08067890123", status: "On Duty" },
    { id: "S-2023-007", name: "Tech David Nwachukwu", role: "Lab Technician", department: "Laboratory", email: "david.nwachukwu@nhms.gov.ng", phone: "08078901234", status: "On Leave" },
    { id: "S-2023-008", name: "Pharm. Funmi Bassey", role: "Pharmacist", department: "Pharmacy", email: "funmi.bassey@nhms.gov.ng", phone: "08089012345", status: "On Duty" },
  ];

  // Filter staff based on search term
  const filteredStaff = staffMembers.filter(staff => 
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Count staff by role
  const roleCount = staffMembers.reduce((acc, staff) => {
    const role = staff.role.includes("Dr.") ? "Doctors" : 
                staff.role.includes("Nurse") ? "Nurses" : "Other Staff";
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <HospitalLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
          <Button className="bg-health-600 hover:bg-health-700">
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
              <div className="text-2xl font-bold">{staffMembers.length}</div>
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
                {staffMembers.filter(s => s.status === "On Duty").length}
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
                  {filteredStaff.length > 0 ? (
                    filteredStaff.map((staff) => (
                      <TableRow key={staff.id}>
                        <TableCell className="font-medium">{staff.id}</TableCell>
                        <TableCell>{staff.name}</TableCell>
                        <TableCell>{staff.role}</TableCell>
                        <TableCell className="hidden md:table-cell">{staff.department}</TableCell>
                        <TableCell className="hidden md:table-cell">{staff.email}</TableCell>
                        <TableCell className="hidden md:table-cell">{staff.phone}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            staff.status === "On Duty" 
                              ? "bg-green-100 text-green-800" 
                              : staff.status === "Off Duty"
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

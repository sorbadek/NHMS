
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
  FileText, 
  Edit, 
  Trash2, 
  Heart, 
  Calendar 
} from "lucide-react";

const PatientManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock data for patients
  const patients = [
    { id: "P-2023-001", name: "John Doe", dateOfBirth: "15/05/1985", nin: "12345678901", gender: "Male", phoneNumber: "08012345678", lastVisit: "10/06/2023", status: "Active" },
    { id: "P-2023-002", name: "Jane Smith", dateOfBirth: "22/11/1990", nin: "23456789012", gender: "Female", phoneNumber: "08023456789", lastVisit: "05/06/2023", status: "Active" },
    { id: "P-2023-003", name: "Robert Johnson", dateOfBirth: "08/03/1978", nin: "34567890123", gender: "Male", phoneNumber: "08034567890", lastVisit: "01/06/2023", status: "Active" },
    { id: "P-2023-004", name: "Sarah Williams", dateOfBirth: "19/09/1995", nin: "45678901234", gender: "Female", phoneNumber: "08045678901", lastVisit: "15/05/2023", status: "Inactive" },
    { id: "P-2023-005", name: "Michael Brown", dateOfBirth: "30/12/1982", nin: "56789012345", gender: "Male", phoneNumber: "08056789012", lastVisit: "20/05/2023", status: "Active" },
    { id: "P-2023-006", name: "Emily Davis", dateOfBirth: "25/07/1988", nin: "67890123456", gender: "Female", phoneNumber: "08067890123", lastVisit: "18/05/2023", status: "Active" },
    { id: "P-2023-007", name: "Daniel Wilson", dateOfBirth: "14/02/1975", nin: "78901234567", gender: "Male", phoneNumber: "08078901234", lastVisit: "12/05/2023", status: "Inactive" },
    { id: "P-2023-008", name: "Olivia Taylor", dateOfBirth: "03/06/1992", nin: "89012345678", gender: "Female", phoneNumber: "08089012345", lastVisit: "08/05/2023", status: "Active" },
  ];

  // Filter patients based on search term
  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.nin.includes(searchTerm)
  );

  return (
    <HospitalLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Patient Management</h1>
          <Button className="bg-health-600 hover:bg-health-700">
            <UserPlus className="mr-2 h-4 w-4" />
            Add New Patient
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Patients Directory</CardTitle>
            <CardDescription>Manage patient records, view medical history, and schedule appointments</CardDescription>
            <div className="mt-4 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, ID or NIN..."
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
                    <TableHead>Patient ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Date of Birth</TableHead>
                    <TableHead className="hidden md:table-cell">NIN</TableHead>
                    <TableHead className="hidden md:table-cell">Gender</TableHead>
                    <TableHead className="hidden md:table-cell">Phone Number</TableHead>
                    <TableHead className="hidden md:table-cell">Last Visit</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell className="font-medium">{patient.id}</TableCell>
                        <TableCell>{patient.name}</TableCell>
                        <TableCell className="hidden md:table-cell">{patient.dateOfBirth}</TableCell>
                        <TableCell className="hidden md:table-cell">{patient.nin}</TableCell>
                        <TableCell className="hidden md:table-cell">{patient.gender}</TableCell>
                        <TableCell className="hidden md:table-cell">{patient.phoneNumber}</TableCell>
                        <TableCell className="hidden md:table-cell">{patient.lastVisit}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            patient.status === "Active" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {patient.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon" title="View Medical Records">
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" title="Schedule Appointment">
                              <Calendar className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" title="Edit Patient">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="text-red-500 hover:text-red-700" title="Delete Patient">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center h-24">
                        No patients found matching your search criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Patients
              </CardTitle>
              <Users className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{patients.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {patients.filter(p => p.status === "Active").length} active
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                New Patients (This Month)
              </CardTitle>
              <UserPlus className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground mt-1">
                +12% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Average Patient Age
              </CardTitle>
              <Heart className="h-5 w-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">36.5</div>
              <p className="text-xs text-muted-foreground mt-1">
                Based on all registered patients
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </HospitalLayout>
  );
};

export default PatientManagement;

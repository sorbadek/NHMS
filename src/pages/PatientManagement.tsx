import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
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
  Calendar,
  Users,
  RefreshCcw,
  UploadCloud,
  Loader2
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { supabase, PatientRow, UserRow } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface PatientWithUser extends PatientRow {
  users?: UserRow | null;
}

const PatientManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [nationalSearchTerm, setNationalSearchTerm] = useState("");
  const [showNationalSearch, setShowNationalSearch] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientWithUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<PatientWithUser | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const { user } = useAuth();
  
  const { data: patients, isLoading: isLoadingPatients, error: patientsError, refetch: refetchPatients } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('patients')
        .select(`
          *,
          users:user_id(full_name, email, phone)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  const { data: nationalPatients, isLoading: isLoadingNational, isError: isNationalError, refetch: refetchNational } = useQuery({
    queryKey: ['nationalPatients', nationalSearchTerm],
    queryFn: async () => {
      const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
      await delay(1000);
      
      const mockNationalPatients = [
        { id: "N-2023-001", name: "Mohammed Ibrahim", dateOfBirth: "12/03/1980", nin: "20345678901", gender: "Male", phoneNumber: "08112345678", lastVisit: "15/05/2023", status: "Active" },
        { id: "N-2023-002", name: "Chioma Okafor", dateOfBirth: "07/09/1992", nin: "30456789012", gender: "Female", phoneNumber: "08223456789", lastVisit: "20/04/2023", status: "Active" },
        { id: "N-2023-003", name: "Emeka Eze", dateOfBirth: "23/11/1975", nin: "40567890123", gender: "Male", phoneNumber: "09034567890", lastVisit: "05/06/2023", status: "Inactive" },
        { id: "N-2023-004", name: "Aisha Mohammed", dateOfBirth: "15/08/1988", nin: "50678901234", gender: "Female", phoneNumber: "07045678901", lastVisit: "10/06/2023", status: "Active" },
        { id: "N-2023-005", name: "Oluwaseun Adeleke", dateOfBirth: "30/01/1990", nin: "60789012345", gender: "Male", phoneNumber: "08056789012", lastVisit: "01/06/2023", status: "Active" },
      ];
      
      if (!nationalSearchTerm) return mockNationalPatients;
      
      return mockNationalPatients.filter(patient => 
        patient.name.toLowerCase().includes(nationalSearchTerm.toLowerCase()) ||
        patient.id.toLowerCase().includes(nationalSearchTerm.toLowerCase()) ||
        patient.nin.includes(nationalSearchTerm)
      );
    },
    enabled: showNationalSearch,
  });

  const filteredPatients = patients ? patients.filter((patient: any) => {
    const patientName = patient.users?.full_name || '';
    const patientEmail = patient.users?.email || '';
    const patientPhone = patient.users?.phone || '';
    const patientNationalId = patient.national_id || '';
    
    return patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           patientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
           patientPhone.includes(searchTerm) ||
           patientNationalId.includes(searchTerm);
  }) : [];

  const addPatientFromNationalDb = async (patient: any) => {
    try {
      const { data: existingPatients, error: checkError } = await supabase
        .from('patients')
        .select('*')
        .eq('national_id', patient.nin);
      
      if (checkError) throw checkError;
      
      if (existingPatients && existingPatients.length > 0) {
        toast.error(`Patient ${patient.name} already exists in your records.`);
        return;
      }

      const email = `${patient.nin}@nationaldb.placeholder`;
      const password = `${patient.nin}${patient.dateOfBirth.replace(/\//g, '')}`;
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: patient.name,
            user_type: 'patient'
          }
        }
      });
      
      if (authError) throw authError;
      
      if (!authData.user) {
        toast.error("Failed to create user account");
        return;
      }
      
      const { error: patientError } = await supabase
        .from('patients')
        .insert([{
          user_id: authData.user.id,
          national_id: patient.nin,
          gender: patient.gender.toLowerCase(),
          date_of_birth: convertDateFormat(patient.dateOfBirth),
          status: patient.status.toLowerCase(),
        }]);
      
      if (patientError) throw patientError;
      
      if (patient.phoneNumber) {
        await supabase
          .from('users')
          .update({ phone: patient.phoneNumber })
          .eq('id', authData.user.id);
      }
      
      toast.success(`Patient ${patient.name} successfully added to your records.`);
      refetchPatients();
    } catch (error: any) {
      toast.error(`Error adding patient: ${error.message}`);
      console.error("Error adding patient from national database:", error);
    }
  };

  const convertDateFormat = (dateString: string): string => {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  };

  const updatePatientStatus = (patient: PatientWithUser) => {
    setSelectedPatient(patient);
    setShowStatusDialog(true);
  };

  const handleStatusUpdate = async (status: string) => {
    if (!selectedPatient) return;
    
    setIsUpdating(true);
    
    try {
      const { error } = await supabase
        .from('patients')
        .update({ 
          status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedPatient.id);
      
      if (error) throw error;
      
      toast.success(`Patient status updated successfully to ${status}`);
      refetchPatients();
    } catch (error: any) {
      console.error("Error updating patient status:", error);
      toast.error(`Failed to update status: ${error.message}`);
    } finally {
      setIsUpdating(false);
      setShowStatusDialog(false);
      setSelectedPatient(null);
    }
  };

  const handleDeleteClick = (patient: PatientWithUser) => {
    setPatientToDelete(patient);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!patientToDelete) return;
    
    setIsDeleting(true);
    
    try {
      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select('id')
        .eq('patient_id', patientToDelete.id)
        .limit(1);
        
      if (appointmentsError) throw appointmentsError;
      
      if (appointments && appointments.length > 0) {
        toast.error("Cannot delete patient with existing appointments");
        return;
      }
      
      const { error: deleteError } = await supabase
        .from('patients')
        .delete()
        .eq('id', patientToDelete.id);
        
      if (deleteError) throw deleteError;
      
      toast.success("Patient deleted successfully");
      refetchPatients();
    } catch (error: any) {
      console.error("Error deleting patient:", error);
      toast.error(`Failed to delete patient: ${error.message}`);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
      setPatientToDelete(null);
    }
  };

  const calculateStats = () => {
    if (!patients) return { total: 0, active: 0, averageAge: 0 };
    
    const total = patients.length;
    
    const active = patients.filter((p: PatientRow) => 
      p.status === "active"
    ).length;
    
    let totalAge = 0;
    let count = 0;
    
    patients.forEach((patient: PatientRow) => {
      if (patient.date_of_birth) {
        const birthDate = new Date(patient.date_of_birth);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        
        totalAge += age;
        count++;
      }
    });
    
    const averageAge = count > 0 ? (totalAge / count).toFixed(1) : 0;
    
    return { total, active, averageAge };
  };

  const stats = calculateStats();
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  const getPatientName = (patient: PatientWithUser) => {
    return patient.users?.full_name || 'Unknown';
  };

  const getPatientEmail = (patient: PatientWithUser) => {
    return patient.users?.email || 'N/A';
  };

  const getPatientPhone = (patient: PatientWithUser) => {
    return patient.users?.phone || 'N/A';
  };

  return (
    <HospitalLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Patient Management</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => setShowNationalSearch(!showNationalSearch)}
              className="flex items-center gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              {showNationalSearch ? "Hide National Search" : "Search National Database"}
            </Button>
            <Button className="bg-health-600 hover:bg-health-700">
              <UserPlus className="mr-2 h-4 w-4" />
              Add New Patient
            </Button>
          </div>
        </div>

        {showNationalSearch && (
          <Card>
            <CardHeader>
              <CardTitle>National Patient Database</CardTitle>
              <CardDescription>Search for patients in the national healthcare database</CardDescription>
              <div className="mt-4 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, ID or NIN..."
                  className="pl-10"
                  value={nationalSearchTerm}
                  onChange={(e) => setNationalSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>National ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">Date of Birth</TableHead>
                      <TableHead className="hidden md:table-cell">NIN</TableHead>
                      <TableHead className="hidden md:table-cell">Gender</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingNational ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center h-24">
                          <div className="flex justify-center items-center">
                            <Loader2 className="h-6 w-6 animate-spin mr-2" />
                            <span>Loading patients from national database...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : isNationalError ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center h-24">
                          <Alert variant="destructive">
                            <AlertDescription>
                              Error connecting to the national database. Please try again.
                            </AlertDescription>
                          </Alert>
                        </TableCell>
                      </TableRow>
                    ) : nationalPatients?.length > 0 ? (
                      nationalPatients.map((patient) => (
                        <TableRow key={patient.id}>
                          <TableCell className="font-medium">{patient.id}</TableCell>
                          <TableCell>{patient.name}</TableCell>
                          <TableCell className="hidden md:table-cell">{patient.dateOfBirth}</TableCell>
                          <TableCell className="hidden md:table-cell">{patient.nin}</TableCell>
                          <TableCell className="hidden md:table-cell">{patient.gender}</TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => addPatientFromNationalDb(patient)}
                              className="flex items-center gap-1"
                            >
                              <UploadCloud className="h-4 w-4" />
                              Import
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center h-24">
                          No patients found in the national database matching your search criteria.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Patients Directory</CardTitle>
            <CardDescription>Manage patient records, view medical history, and schedule appointments</CardDescription>
            <div className="mt-4 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, phone or NIN..."
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
                    <TableHead>Patient</TableHead>
                    <TableHead className="hidden md:table-cell">Date of Birth</TableHead>
                    <TableHead className="hidden md:table-cell">Gender</TableHead>
                    <TableHead className="hidden md:table-cell">NIN</TableHead>
                    <TableHead className="hidden md:table-cell">Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingPatients ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center h-24">
                        <div className="flex justify-center items-center">
                          <Loader2 className="h-6 w-6 animate-spin mr-2" />
                          <span>Loading patients...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : patientsError ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center h-24">
                        <Alert variant="destructive">
                          <AlertDescription>
                            Error loading patients. Please try again.
                          </AlertDescription>
                        </Alert>
                      </TableCell>
                    </TableRow>
                  ) : filteredPatients.length > 0 ? (
                    filteredPatients.map((patient: any) => (
                      <TableRow key={patient.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{getPatientName(patient)}</p>
                            <p className="text-sm text-muted-foreground">{getPatientEmail(patient)}</p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{patient.date_of_birth ? formatDate(patient.date_of_birth) : 'N/A'}</TableCell>
                        <TableCell className="hidden md:table-cell">{patient.gender ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1) : 'N/A'}</TableCell>
                        <TableCell className="hidden md:table-cell">{patient.national_id || 'N/A'}</TableCell>
                        <TableCell className="hidden md:table-cell">{getPatientPhone(patient)}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            patient.status === "active" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {patient.status ? patient.status.charAt(0).toUpperCase() + patient.status.slice(1) : 'Unknown'}
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
                            <Button 
                              variant="outline" 
                              size="icon" 
                              title="Update Status"
                              onClick={() => updatePatientStatus(patient)}
                            >
                              <UploadCloud className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" title="Edit Patient">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="text-red-500 hover:text-red-700" 
                              title="Delete Patient"
                              onClick={() => handleDeleteClick(patient)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center h-24">
                        <p>No patients found matching your search criteria.</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Patient Status</DialogTitle>
              <DialogDescription>
                Update the status of this patient in the system
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {selectedPatient && (
                <>
                  <h4 className="font-semibold">Patient: {selectedPatient.users?.full_name || 'Unknown'}</h4>
                  <p className="text-sm text-muted-foreground">ID: {selectedPatient.national_id || 'N/A'}</p>
                  <p className="text-sm mt-2">Current Status: 
                    <span className={selectedPatient.status === 'active' ? 'text-green-600 ml-1' : 'text-gray-600 ml-1'}>
                      {selectedPatient.status ? selectedPatient.status.charAt(0).toUpperCase() + selectedPatient.status.slice(1) : 'Unknown'}
                    </span>
                  </p>
                  
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium">Select New Status:</p>
                    <div className="flex gap-2">
                      <Button 
                        variant={selectedPatient.status === 'active' ? 'secondary' : 'outline'} 
                        size="sm"
                        onClick={() => handleStatusUpdate('active')}
                        disabled={isUpdating}
                      >
                        Active
                      </Button>
                      <Button 
                        variant={selectedPatient.status === 'inactive' ? 'secondary' : 'outline'} 
                        size="sm"
                        onClick={() => handleStatusUpdate('inactive')}
                        disabled={isUpdating}
                      >
                        Inactive
                      </Button>
                      <Button 
                        variant={selectedPatient.status === 'transferred' ? 'secondary' : 'outline'} 
                        size="sm"
                        onClick={() => handleStatusUpdate('transferred')}
                        disabled={isUpdating}
                      >
                        Transferred
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowStatusDialog(false)} disabled={isUpdating}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Patient</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this patient? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {patientToDelete && (
                <>
                  <h4 className="font-semibold">Patient: {patientToDelete.users?.full_name || 'Unknown'}</h4>
                  <p className="text-sm text-muted-foreground">ID: {patientToDelete.national_id || 'N/A'}</p>
                  <Alert variant="destructive" className="mt-4">
                    <AlertDescription>
                      Deleting this patient will permanently remove all their records from the system.
                    </AlertDescription>
                  </Alert>
                </>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={isDeleting}>Cancel</Button>
              </DialogClose>
              <Button 
                variant="destructive" 
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : "Delete Patient"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Patients
              </CardTitle>
              <Users className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.active} active
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
              <div className="text-2xl font-bold">
                {isLoadingPatients ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  patients?.filter((p: any) => {
                    const createdAt = new Date(p.created_at);
                    const now = new Date();
                    return createdAt.getMonth() === now.getMonth() && 
                           createdAt.getFullYear() === now.getFullYear();
                  }).length || 0
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {isLoadingPatients ? "Calculating..." : "From last 30 days"}
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
              <div className="text-2xl font-bold">{stats.averageAge}</div>
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

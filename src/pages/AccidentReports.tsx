
import { useState } from "react";
import PoliceLayout from "@/components/PoliceLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  AlertTriangle, 
  Search, 
  Plus, 
  FileText, 
  MapPin, 
  Calendar, 
  Info, 
  Loader2,
  Car,
  User,
  Hospital,
  Shield
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Accident report interface
interface AccidentReport {
  id: string;
  report_number: string;
  location: string;
  accident_date: string;
  accident_type: string;
  description: string;
  severity: string;
  reported_by: string;
  hospital_id: string;
  police_department_id: string;
  status: string;
  created_at: string;
}

const AccidentReports = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReport, setSelectedReport] = useState<AccidentReport | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newReport, setNewReport] = useState({
    location: "",
    accident_date: new Date().toISOString().split('T')[0],
    accident_type: "Vehicle Collision",
    description: "",
    severity: "Moderate",
    status: "open"
  });
  
  // Fetch accident reports
  const { 
    data: accidentReports = [], 
    isLoading: isLoadingReports 
  } = useQuery({
    queryKey: ['accidentReports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('accident_reports')
        .select(`
          *,
          hospital:hospitals(name),
          police_department:police_departments(name),
          reporter:users(full_name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch hospitals for dropdown
  const { 
    data: hospitals = []
  } = useQuery({
    queryKey: ['hospitals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hospitals')
        .select('id, name');
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch police departments for dropdown
  const { 
    data: policeDepartments = []
  } = useQuery({
    queryKey: ['policeDepartments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('police_departments')
        .select('id, name');
      
      if (error) throw error;
      return data || [];
    }
  });

  // Add new accident report
  const addReportMutation = useMutation({
    mutationFn: async (reportData: any) => {
      // Get current user
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) throw new Error("User not authenticated");
      
      // Get user's police department
      const { data: officerData, error: officerError } = await supabase
        .from('police_officers')
        .select('department_id')
        .eq('user_id', sessionData.session.user.id)
        .single();
      
      if (officerError && officerError.code !== 'PGRST116') {
        throw officerError;
      }
      
      // Prepare the report data
      const newReportData = {
        ...reportData,
        reported_by: sessionData.session.user.id,
        police_department_id: officerData?.department_id || null,
        report_number: `ACC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
      };
      
      const { data, error } = await supabase
        .from('accident_reports')
        .insert([newReportData])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accidentReports'] });
      setIsAddDialogOpen(false);
      setNewReport({
        location: "",
        accident_date: new Date().toISOString().split('T')[0],
        accident_type: "Vehicle Collision",
        description: "",
        severity: "Moderate",
        status: "open"
      });
      toast({
        title: "Accident report created",
        description: "The accident report has been successfully created",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error creating report",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Update accident report status
  const updateReportStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const { data, error } = await supabase
        .from('accident_reports')
        .update({ status })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accidentReports'] });
      setIsDetailDialogOpen(false);
      setSelectedReport(null);
      toast({
        title: "Report status updated",
        description: "The accident report status has been updated",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Filter reports based on search and status
  const filteredReports = accidentReports.filter((report: any) => 
    (report.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     report.accident_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     report.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     report.report_number?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === 'all' || report.status === statusFilter)
  );

  // Handle viewing report details
  const handleViewDetails = (report: any) => {
    setSelectedReport(report);
    setIsDetailDialogOpen(true);
  };

  // Handle form submission
  const handleAddReport = (e: React.FormEvent) => {
    e.preventDefault();
    addReportMutation.mutate(newReport);
  };

  // Handle status update
  const handleUpdateStatus = (id: string, status: string) => {
    updateReportStatusMutation.mutate({ id, status });
  };

  return (
    <PoliceLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Accident Reports</h1>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Accident Report
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Accident Reports</CardTitle>
            <CardDescription>View and manage accident reports</CardDescription>
            
            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by location, type, or description..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Reports</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingReports ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2 text-lg">Loading reports...</span>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report #</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="hidden md:table-cell">Location</TableHead>
                      <TableHead className="hidden md:table-cell">Severity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.length > 0 ? (
                      filteredReports.map((report: any) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">{report.report_number || report.id.substring(0, 8)}</TableCell>
                          <TableCell>{new Date(report.accident_date || report.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>{report.accident_type || "Unknown"}</TableCell>
                          <TableCell className="hidden md:table-cell">{report.location || "N/A"}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              report.severity === "Minor" 
                                ? "bg-green-100 text-green-800" 
                                : report.severity === "Moderate"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                            }`}>
                              {report.severity || "Unknown"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              report.status === "open" 
                                ? "bg-amber-100 text-amber-800" 
                                : "bg-green-100 text-green-800"
                            }`}>
                              {report.status === "open" ? "Open" : "Closed"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(report)}
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center h-24">
                          <div className="flex flex-col items-center justify-center">
                            <AlertTriangle className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-muted-foreground">No accident reports found matching your criteria.</p>
                            <Button 
                              variant="outline" 
                              className="mt-4"
                              onClick={() => setIsAddDialogOpen(true)}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Create a new report
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Report Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Accident Report</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddReport}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="accident-date">Date of Accident</Label>
                  <Input
                    id="accident-date"
                    type="date"
                    value={newReport.accident_date}
                    onChange={(e) => setNewReport({ ...newReport, accident_date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accident-type">Accident Type</Label>
                  <Select 
                    value={newReport.accident_type} 
                    onValueChange={(value) => setNewReport({ ...newReport, accident_type: value })}
                  >
                    <SelectTrigger id="accident-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Vehicle Collision">Vehicle Collision</SelectItem>
                      <SelectItem value="Motorcycle Accident">Motorcycle Accident</SelectItem>
                      <SelectItem value="Pedestrian Accident">Pedestrian Accident</SelectItem>
                      <SelectItem value="Bicycle Accident">Bicycle Accident</SelectItem>
                      <SelectItem value="Public Transport Accident">Public Transport Accident</SelectItem>
                      <SelectItem value="Work Related">Work Related</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newReport.location}
                  onChange={(e) => setNewReport({ ...newReport, location: e.target.value })}
                  placeholder="Enter the accident location"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="severity">Severity</Label>
                  <Select 
                    value={newReport.severity} 
                    onValueChange={(value) => setNewReport({ ...newReport, severity: value })}
                  >
                    <SelectTrigger id="severity">
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Minor">Minor</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="Severe">Severe</SelectItem>
                      <SelectItem value="Fatal">Fatal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hospital">Hospital Involved</Label>
                  <Select 
                    onValueChange={(value) => setNewReport({ ...newReport, hospital_id: value })}
                  >
                    <SelectTrigger id="hospital">
                      <SelectValue placeholder="Select hospital" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {hospitals.map((hospital: any) => (
                        <SelectItem key={hospital.id} value={hospital.id}>
                          {hospital.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newReport.description}
                  onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                  placeholder="Describe the accident in detail"
                  rows={4}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={addReportMutation.isPending}>
                {addReportMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Report
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Report Details Dialog */}
      {selectedReport && (
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Accident Report Details</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold">{selectedReport.report_number || selectedReport.id.substring(0, 8)}</h2>
                  <p className="text-sm text-muted-foreground">
                    Created: {new Date(selectedReport.created_at).toLocaleString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedReport.status === "open" 
                    ? "bg-amber-100 text-amber-800" 
                    : "bg-green-100 text-green-800"
                }`}>
                  {selectedReport.status === "open" ? "Open" : "Closed"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Date of Accident
                  </p>
                  <p className="text-base">
                    {new Date(selectedReport.accident_date || selectedReport.created_at).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center">
                    <Car className="h-4 w-4 mr-2" />
                    Accident Type
                  </p>
                  <p className="text-base">{selectedReport.accident_type || "Unknown"}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Location
                  </p>
                  <p className="text-base">{selectedReport.location || "Not specified"}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Severity
                  </p>
                  <p className="text-base">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedReport.severity === "Minor" 
                        ? "bg-green-100 text-green-800" 
                        : selectedReport.severity === "Moderate"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {selectedReport.severity || "Unknown"}
                    </span>
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Reported By
                  </p>
                  <p className="text-base">{selectedReport.reporter?.full_name || "Unknown"}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    Police Department
                  </p>
                  <p className="text-base">{selectedReport.police_department?.name || "Not assigned"}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center">
                    <Hospital className="h-4 w-4 mr-2" />
                    Hospital
                  </p>
                  <p className="text-base">{selectedReport.hospital?.name || "None involved"}</p>
                </div>
              </div>

              <div className="space-y-1 mb-6">
                <p className="text-sm font-medium text-muted-foreground flex items-center">
                  <Info className="h-4 w-4 mr-2" />
                  Description
                </p>
                <div className="text-base p-3 bg-gray-50 rounded-md">
                  {selectedReport.description || "No description provided"}
                </div>
              </div>

              <div className="border-t pt-4 flex justify-between">
                <Button 
                  variant="outline"
                  onClick={() => setIsDetailDialogOpen(false)}
                >
                  Close
                </Button>
                
                {selectedReport.status === "open" ? (
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleUpdateStatus(selectedReport.id, "closed")}
                    disabled={updateReportStatusMutation.isPending}
                  >
                    {updateReportStatusMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Mark as Closed
                  </Button>
                ) : (
                  <Button 
                    className="bg-amber-600 hover:bg-amber-700"
                    onClick={() => handleUpdateStatus(selectedReport.id, "open")}
                    disabled={updateReportStatusMutation.isPending}
                  >
                    {updateReportStatusMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Reopen Case
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </PoliceLayout>
  );
};

export default AccidentReports;

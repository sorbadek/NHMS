
import { useState } from "react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  FileText, 
  Search, 
  Download,
  FilePlus2,
  FileX2,
  Calendar,
  Printer
} from "lucide-react";
import PatientLayout from "@/components/PatientLayout";
import { toast } from "sonner";

// Mock medical records
const medicalRecords = [
  { id: "MR-2023-001", date: "15/05/2023", type: "Consultation", doctor: "Dr. James Wilson", hospital: "Central Hospital", description: "Annual check-up. Blood pressure normal, advised on diet and exercise.", fileAvailable: true },
  { id: "MR-2023-002", date: "10/04/2023", type: "Vaccination", doctor: "Dr. Lisa Chen", hospital: "Community Healthcare", description: "Flu shot administered.", fileAvailable: true },
  { id: "MR-2023-003", date: "05/03/2023", type: "Laboratory", doctor: "Dr. Samantha Lee", hospital: "Central Hospital", description: "Blood test results within normal range.", fileAvailable: true },
  { id: "MR-2023-004", date: "20/02/2023", type: "Radiology", doctor: "Dr. Michael Brown", hospital: "National Medical Center", description: "Chest X-ray shows no abnormalities.", fileAvailable: true },
  { id: "MR-2023-005", date: "15/01/2023", type: "Surgery", doctor: "Dr. Jennifer Garcia", hospital: "Central Hospital", description: "Appendectomy performed. Patient responded well to treatment.", fileAvailable: true },
  { id: "MR-2023-006", date: "10/12/2022", type: "Consultation", doctor: "Dr. James Wilson", hospital: "Central Hospital", description: "Patient complained of abdominal pain. Referred for diagnostic testing.", fileAvailable: true },
  { id: "MR-2023-007", date: "05/11/2022", type: "Laboratory", doctor: "Dr. Samantha Lee", hospital: "Central Hospital", description: "Complete blood count and liver function tests.", fileAvailable: true },
  { id: "MR-2023-008", date: "20/10/2022", type: "Emergency", doctor: "Dr. Robert Johnson", hospital: "National Medical Center", description: "Patient presented with severe abdominal pain. Diagnosed with appendicitis.", fileAvailable: true }
];

const PatientRecords = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [viewDetailDialog, setViewDetailDialog] = useState(false);
  
  // Filter records based on search term
  const filteredRecords = medicalRecords.filter(record => 
    record.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setViewDetailDialog(true);
  };

  const handleDownloadRecord = (recordId) => {
    toast.success("Medical record downloaded successfully");
  };

  const handleRequestAccess = () => {
    toast.success("Access request sent to healthcare provider");
  };

  return (
    <PatientLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Medical Records</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleRequestAccess}
            >
              <FilePlus2 className="h-4 w-4" />
              Request Additional Records
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => toast.info("Printing all records...")}
            >
              <Printer className="h-4 w-4" />
              Print All
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              Medical Records Archive
            </CardTitle>
            <CardDescription>
              Your comprehensive medical history from all healthcare facilities
            </CardDescription>
            <div className="mt-4 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by type, doctor, hospital or description..."
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
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="hidden md:table-cell">Doctor</TableHead>
                    <TableHead className="hidden md:table-cell">Hospital</TableHead>
                    <TableHead className="hidden md:table-cell">Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>{record.type}</TableCell>
                        <TableCell className="hidden md:table-cell">{record.doctor}</TableCell>
                        <TableCell className="hidden md:table-cell">{record.hospital}</TableCell>
                        <TableCell className="hidden md:table-cell max-w-sm truncate">{record.description}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(record)}
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            {record.fileAvailable && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownloadRecord(record.id)}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center h-24">
                        <div className="flex flex-col items-center justify-center">
                          <FileX2 className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">No medical records found matching your search criteria.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* View Record Detail Dialog */}
        {selectedRecord && (
          <Dialog open={viewDetailDialog} onOpenChange={setViewDetailDialog}>
            <DialogContent className="sm:max-w-[650px]">
              <DialogHeader>
                <DialogTitle>Medical Record Details</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Record ID</h4>
                    <p className="text-base font-medium">{selectedRecord.id}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Date</h4>
                    <p className="text-base font-medium">{selectedRecord.date}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Type</h4>
                    <p className="text-base font-medium">{selectedRecord.type}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Doctor</h4>
                    <p className="text-base font-medium">{selectedRecord.doctor}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Hospital</h4>
                    <p className="text-base font-medium">{selectedRecord.hospital}</p>
                  </div>
                  <div className="col-span-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                    <p className="text-base">{selectedRecord.description}</p>
                  </div>
                </div>

                <div className="mt-6 border-t pt-4">
                  <h3 className="text-base font-semibold mb-2">Notes</h3>
                  <p className="text-sm">Additional clinical notes and observations by healthcare provider.</p>
                  
                  <div className="mt-4 p-3 bg-gray-50 rounded-md text-sm">
                    <p>Patient presented with symptoms as described. Physical examination was normal. Vital signs within normal range. Patient was advised on appropriate treatment and follow-up care.</p>
                  </div>
                </div>

                <div className="mt-4 flex justify-between">
                  <Button variant="outline" className="flex items-center gap-2" onClick={() => toast.info("Scheduling follow-up...")}>
                    <Calendar className="h-4 w-4" />
                    Schedule Follow-up
                  </Button>
                  
                  {selectedRecord.fileAvailable && (
                    <Button className="flex items-center gap-2" onClick={() => handleDownloadRecord(selectedRecord.id)}>
                      <Download className="h-4 w-4" />
                      Download Record
                    </Button>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </PatientLayout>
  );
};

export default PatientRecords;

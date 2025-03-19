
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
  PlusCircle, 
  Edit, 
  Trash2, 
  Bed, 
  Stethoscope,
  Syringe,
  Ambulance
} from "lucide-react";

const ResourceManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [resourceType, setResourceType] = useState("all");
  
  // Mock data for resources
  const resources = [
    { id: "R-2023-001", name: "Hospital Bed", type: "Equipment", location: "Ward A", status: "Available", quantity: 20, lastMaintenance: "15/05/2023" },
    { id: "R-2023-002", name: "ICU Bed", type: "Equipment", location: "ICU", status: "In Use", quantity: 8, lastMaintenance: "10/06/2023" },
    { id: "R-2023-003", name: "MRI Machine", type: "Equipment", location: "Radiology", status: "Under Maintenance", quantity: 1, lastMaintenance: "01/06/2023" },
    { id: "R-2023-004", name: "Ambulance", type: "Vehicle", location: "Emergency Bay", status: "Available", quantity: 3, lastMaintenance: "20/05/2023" },
    { id: "R-2023-005", name: "Ventilator", type: "Equipment", location: "ICU", status: "In Use", quantity: 5, lastMaintenance: "05/06/2023" },
    { id: "R-2023-006", name: "Surgical Kit", type: "Supply", location: "OR Storage", status: "Available", quantity: 15, lastMaintenance: "N/A" },
    { id: "R-2023-007", name: "Blood Pressure Monitor", type: "Equipment", location: "Various", status: "Available", quantity: 25, lastMaintenance: "18/05/2023" },
    { id: "R-2023-008", name: "Paracetamol", type: "Medication", location: "Pharmacy", status: "Low Stock", quantity: 100, lastMaintenance: "N/A" },
  ];

  // Filter resources based on search and type filters
  const filteredResources = resources.filter(resource => 
    (resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.location.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (resourceType === "all" || resource.type === resourceType)
  );

  // Count resources by status
  const statusCount = resources.reduce((acc, resource) => {
    acc[resource.status] = (acc[resource.status] || 0) + resource.quantity;
    return acc;
  }, {} as Record<string, number>);

  return (
    <HospitalLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Resource Management</h1>
          <Button className="bg-health-600 hover:bg-health-700">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Resource
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Beds
              </CardTitle>
              <Bed className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {resources.filter(r => r.name.includes("Bed")).reduce((acc, r) => acc + r.quantity, 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {resources.filter(r => r.name.includes("Bed") && r.status === "Available").reduce((acc, r) => acc + r.quantity, 0)} available
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Medical Equipment
              </CardTitle>
              <Stethoscope className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {resources.filter(r => r.type === "Equipment").reduce((acc, r) => acc + r.quantity, 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {resources.filter(r => r.type === "Equipment" && r.status === "Under Maintenance").reduce((acc, r) => acc + r.quantity, 0)} under maintenance
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Medications
              </CardTitle>
              <Syringe className="h-5 w-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {resources.filter(r => r.type === "Medication").reduce((acc, r) => acc + r.quantity, 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {resources.filter(r => r.type === "Medication" && r.status === "Low Stock").length} items low in stock
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Vehicles
              </CardTitle>
              <Ambulance className="h-5 w-5 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {resources.filter(r => r.type === "Vehicle").reduce((acc, r) => acc + r.quantity, 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {resources.filter(r => r.type === "Vehicle" && r.status === "Available").reduce((acc, r) => acc + r.quantity, 0)} available for dispatch
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Resources Inventory</CardTitle>
            <CardDescription>Manage hospital equipment, supplies, and other resources</CardDescription>
            
            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search resources..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant={resourceType === "all" ? "default" : "outline"} 
                  className={resourceType === "all" ? "bg-health-600 hover:bg-health-700" : ""}
                  onClick={() => setResourceType("all")}
                >
                  All
                </Button>
                <Button 
                  variant={resourceType === "Equipment" ? "default" : "outline"} 
                  className={resourceType === "Equipment" ? "bg-health-600 hover:bg-health-700" : ""}
                  onClick={() => setResourceType("Equipment")}
                >
                  Equipment
                </Button>
                <Button 
                  variant={resourceType === "Supply" ? "default" : "outline"} 
                  className={resourceType === "Supply" ? "bg-health-600 hover:bg-health-700" : ""}
                  onClick={() => setResourceType("Supply")}
                >
                  Supplies
                </Button>
                <Button 
                  variant={resourceType === "Medication" ? "default" : "outline"} 
                  className={resourceType === "Medication" ? "bg-health-600 hover:bg-health-700" : ""}
                  onClick={() => setResourceType("Medication")}
                >
                  Medications
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resource ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="hidden md:table-cell">Location</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Last Maintenance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResources.length > 0 ? (
                    filteredResources.map((resource) => (
                      <TableRow key={resource.id}>
                        <TableCell className="font-medium">{resource.id}</TableCell>
                        <TableCell>{resource.name}</TableCell>
                        <TableCell>{resource.type}</TableCell>
                        <TableCell className="hidden md:table-cell">{resource.location}</TableCell>
                        <TableCell>{resource.quantity}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            resource.status === "Available" 
                              ? "bg-green-100 text-green-800" 
                              : resource.status === "In Use"
                              ? "bg-blue-100 text-blue-800"
                              : resource.status === "Under Maintenance"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {resource.status}
                          </span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{resource.lastMaintenance}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon" title="Edit Resource">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="text-red-500 hover:text-red-700" title="Delete Resource">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center h-24">
                        No resources found matching your search criteria.
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

export default ResourceManagement;

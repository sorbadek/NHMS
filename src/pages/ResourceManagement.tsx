import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HospitalLayout from "@/components/HospitalLayout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
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
  Ambulance,
  Loader2
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Resource type definition
interface Resource {
  id: string;
  name: string;
  type: string;
  location: string;
  quantity: number;
  status: string;
  hospital_id: string | null;
  last_maintenance: string;
  created_at: string;
}

// Database resource (matches actual database schema)
interface DbResource {
  id: string;
  name: string;
  type: string | null;
  quantity: number | null;
  status: string | null;
  hospital_id: string | null;
  last_maintenance: string | null;
  created_at: string | null;
  updated_at: string | null;
}

// New resource form default values
const defaultResource = {
  name: "",
  type: "Equipment",
  location: "",
  quantity: 1,
  status: "Available",
  last_maintenance: new Date().toISOString().split('T')[0],
  hospital_id: null as string | null
};

const ResourceManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Form states
  const [searchTerm, setSearchTerm] = useState("");
  const [resourceType, setResourceType] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newResource, setNewResource] = useState(defaultResource);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [deletingResourceId, setDeletingResourceId] = useState<string | null>(null);
  
  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        toast({
          title: "Authentication required",
          description: "Please login to access this page",
          variant: "destructive"
        });
        navigate("/");
      }
    };
    
    checkAuth();
  }, [navigate, toast]);

  // Fetch resources
  const { data: resources, isLoading, isError } = useQuery({
    queryKey: ['resources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resources')
        .select('*');
      
      if (error) throw error;

      // Transform the data to match our Resource interface
      return (data as DbResource[]).map(resource => ({
        id: resource.id,
        name: resource.name,
        type: resource.type || "",
        location: resource.location || "", // Add missing field with default value
        quantity: resource.quantity || 0,
        status: resource.status || "",
        hospital_id: resource.hospital_id,
        last_maintenance: resource.last_maintenance || "",
        created_at: resource.created_at || ""
      })) as Resource[];
    }
  });

  // Add resource mutation
  const addResourceMutation = useMutation({
    mutationFn: async (resource: Omit<Resource, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('resources')
        .insert([resource])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      setIsAddDialogOpen(false);
      setNewResource(defaultResource);
      toast({
        title: "Resource added",
        description: "The resource has been added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error adding resource",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Update resource mutation
  const updateResourceMutation = useMutation({
    mutationFn: async (resource: Resource) => {
      const { id, ...updatedFields } = resource;
      const { data, error } = await supabase
        .from('resources')
        .update(updatedFields)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      setIsEditDialogOpen(false);
      setEditingResource(null);
      toast({
        title: "Resource updated",
        description: "The resource has been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating resource",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Delete resource mutation
  const deleteResourceMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      setIsDeleteDialogOpen(false);
      setDeletingResourceId(null);
      toast({
        title: "Resource deleted",
        description: "The resource has been deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting resource",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Handle form submissions
  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    // Get current hospital ID from session or use default
    const getCurrentHospitalId = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        const { data: staffData } = await supabase
          .from('hospital_staff')
          .select('hospital_id')
          .eq('user_id', data.session.user.id)
          .single();
        
        return staffData?.hospital_id || null;
      }
      return null;
    };

    getCurrentHospitalId().then(hospitalId => {
      const resourceToAdd = {
        ...newResource,
        hospital_id: hospitalId || newResource.hospital_id
      };
      addResourceMutation.mutate(resourceToAdd);
    });
  };

  const handleUpdateResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingResource) {
      updateResourceMutation.mutate(editingResource);
    }
  };

  const handleDeleteResource = () => {
    if (deletingResourceId) {
      deleteResourceMutation.mutate(deletingResourceId);
    }
  };

  // Open edit dialog
  const openEditDialog = (resource: Resource) => {
    setEditingResource(resource);
    setIsEditDialogOpen(true);
  };

  // Open delete dialog
  const openDeleteDialog = (id: string) => {
    setDeletingResourceId(id);
    setIsDeleteDialogOpen(true);
  };

  // Filter resources based on search and type filters
  const filteredResources = resources?.filter(resource => 
    (resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.location.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (resourceType === "all" || resource.type.toLowerCase() === resourceType.toLowerCase())
  ) || [];

  // Count resources by status
  const statusCount = resources?.reduce((acc, resource) => {
    const status = resource.status || "Unknown";
    acc[status] = (acc[status] || 0) + resource.quantity;
    return acc;
  }, {} as Record<string, number>) || {};

  // Count beds
  const bedCount = resources?.filter(r => r.name.toLowerCase().includes('bed'))
    .reduce((acc, r) => acc + r.quantity, 0) || 0;
  
  // Count available beds
  const availableBedCount = resources?.filter(r => 
    r.name.toLowerCase().includes('bed') && 
    r.status.toLowerCase() === 'available'
  ).reduce((acc, r) => acc + r.quantity, 0) || 0;

  // Count equipment
  const equipmentCount = resources?.filter(r => r.type.toLowerCase() === 'equipment')
    .reduce((acc, r) => acc + r.quantity, 0) || 0;
  
  // Count maintenance equipment
  const maintenanceEquipmentCount = resources?.filter(r => 
    r.type.toLowerCase() === 'equipment' && 
    r.status.toLowerCase() === 'under maintenance'
  ).reduce((acc, r) => acc + r.quantity, 0) || 0;

  // Count medications
  const medicationCount = resources?.filter(r => r.type.toLowerCase() === 'medication')
    .reduce((acc, r) => acc + r.quantity, 0) || 0;
  
  // Count low stock medications
  const lowStockMedicationCount = resources?.filter(r => 
    r.type.toLowerCase() === 'medication' && 
    r.status.toLowerCase() === 'low stock'
  ).length || 0;

  // Count vehicles
  const vehicleCount = resources?.filter(r => r.type.toLowerCase() === 'vehicle')
    .reduce((acc, r) => acc + r.quantity, 0) || 0;
  
  // Count available vehicles
  const availableVehicleCount = resources?.filter(r => 
    r.type.toLowerCase() === 'vehicle' && 
    r.status.toLowerCase() === 'available'
  ).reduce((acc, r) => acc + r.quantity, 0) || 0;

  if (isError) {
    return (
      <HospitalLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Error loading resources</h2>
          <p className="text-gray-600 mb-4">There was a problem fetching the resource data.</p>
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['resources'] })}>
            Retry
          </Button>
        </div>
      </HospitalLayout>
    );
  }

  return (
    <HospitalLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Resource Management</h1>
          <Button className="bg-health-600 hover:bg-health-700" onClick={() => setIsAddDialogOpen(true)}>
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
              <div className="text-2xl font-bold">{bedCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {availableBedCount} available
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
              <div className="text-2xl font-bold">{equipmentCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {maintenanceEquipmentCount} under maintenance
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
              <div className="text-2xl font-bold">{medicationCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {lowStockMedicationCount} items low in stock
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
              <div className="text-2xl font-bold">{vehicleCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {availableVehicleCount} available for dispatch
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
              
              <div className="flex gap-2 flex-wrap">
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
                <Button 
                  variant={resourceType === "Vehicle" ? "default" : "outline"} 
                  className={resourceType === "Vehicle" ? "bg-health-600 hover:bg-health-700" : ""}
                  onClick={() => setResourceType("Vehicle")}
                >
                  Vehicles
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-health-600" />
                <span className="ml-2 text-lg">Loading resources...</span>
              </div>
            ) : (
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
                          <TableCell className="font-medium">{resource.id.substring(0, 8)}</TableCell>
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
                          <TableCell className="hidden md:table-cell">
                            {resource.last_maintenance ? new Date(resource.last_maintenance).toLocaleDateString() : 'N/A'}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="icon" 
                                title="Edit Resource"
                                onClick={() => openEditDialog(resource)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="text-red-500 hover:text-red-700" 
                                title="Delete Resource"
                                onClick={() => openDeleteDialog(resource.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center h-24">
                          <div className="flex flex-col items-center justify-center">
                            <p className="text-muted-foreground">No resources found matching your search criteria.</p>
                            {resources?.length === 0 && (
                              <Button 
                                variant="outline" 
                                className="mt-4"
                                onClick={() => setIsAddDialogOpen(true)}
                              >
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add your first resource
                              </Button>
                            )}
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

      {/* Add Resource Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Resource</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddResource}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Resource Name</Label>
                  <Input
                    id="name"
                    value={newResource.name}
                    onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
                    placeholder="Enter resource name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select 
                    value={newResource.type} 
                    onValueChange={(value) => setNewResource({ ...newResource, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Equipment">Equipment</SelectItem>
                      <SelectItem value="Supply">Supply</SelectItem>
                      <SelectItem value="Medication">Medication</SelectItem>
                      <SelectItem value="Vehicle">Vehicle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newResource.location}
                    onChange={(e) => setNewResource({ ...newResource, location: e.target.value })}
                    placeholder="Resource location"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={newResource.quantity}
                    onChange={(e) => setNewResource({ ...newResource, quantity: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={newResource.status} 
                    onValueChange={(value) => setNewResource({ ...newResource, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="In Use">In Use</SelectItem>
                      <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
                      <SelectItem value="Low Stock">Low Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maintenance">Last Maintenance Date</Label>
                  <Input
                    id="maintenance"
                    type="date"
                    value={newResource.last_maintenance}
                    onChange={(e) => setNewResource({ ...newResource, last_maintenance: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-health-600 hover:bg-health-700" disabled={addResourceMutation.isPending}>
                {addResourceMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Resource
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Resource Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Resource</DialogTitle>
          </DialogHeader>
          {editingResource && (
            <form onSubmit={handleUpdateResource}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Resource Name</Label>
                    <Input
                      id="edit-name"
                      value={editingResource.name}
                      onChange={(e) => setEditingResource({ ...editingResource, name: e.target.value })}
                      placeholder="Enter resource name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-type">Type</Label>
                    <Select 
                      value={editingResource.type} 
                      onValueChange={(value) => setEditingResource({ ...editingResource, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Equipment">Equipment</SelectItem>
                        <SelectItem value="Supply">Supply</SelectItem>
                        <SelectItem value="Medication">Medication</SelectItem>
                        <SelectItem value="Vehicle">Vehicle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-location">Location</Label>
                    <Input
                      id="edit-location"
                      value={editingResource.location}
                      onChange={(e) => setEditingResource({ ...editingResource, location: e.target.value })}
                      placeholder="Resource location"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-quantity">Quantity</Label>
                    <Input
                      id="edit-quantity"
                      type="number"
                      min="1"
                      value={editingResource.quantity}
                      onChange={(e) => setEditingResource({ ...editingResource, quantity: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <Select 
                      value={editingResource.status} 
                      onValueChange={(value) => setEditingResource({ ...editingResource, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="In Use">In Use</SelectItem>
                        <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
                        <SelectItem value="Low Stock">Low Stock</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-maintenance">Last Maintenance Date</Label>
                    <Input
                      id="edit-maintenance"
                      type="date"
                      value={editingResource.last_maintenance ? new Date(editingResource.last_maintenance).toISOString().split('T')[0] : ''}
                      onChange={(e) => setEditingResource({ ...editingResource, last_maintenance: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-health-600 hover:bg-health-700" disabled={updateResourceMutation.isPending}>
                  {updateResourceMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update Resource
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this resource? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDeleteResource}
              disabled={deleteResourceMutation.isPending}
            >
              {deleteResourceMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Resource
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </HospitalLayout>
  );
};

export default ResourceManagement;

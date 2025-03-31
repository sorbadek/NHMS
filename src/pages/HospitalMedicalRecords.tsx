
import { useState } from "react";
import HospitalLayout from "@/components/HospitalLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

const HospitalMedicalRecords = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <HospitalLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Medical Records</h1>
          <Button 
            className="bg-health-600 hover:bg-health-700"
            onClick={() => {}}
          >
            <FileText className="mr-2 h-4 w-4" />
            Create New Record
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Hospital Medical Records</CardTitle>
            <CardDescription>
              Access and manage patient medical records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center p-12">
              <div className="text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-semibold">Medical Records Management</h3>
                <p className="mt-1 text-gray-500 max-w-md mx-auto">
                  This page will allow hospital staff to create, view, and update patient medical records.
                  The full implementation will include record searching, filtering, and secure access controls.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </HospitalLayout>
  );
};

export default HospitalMedicalRecords;

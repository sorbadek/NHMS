
import { useState } from "react";
import HospitalLayout from "@/components/HospitalLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pill } from "lucide-react";

const HospitalPharmacy = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <HospitalLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Pharmacy Management</h1>
          <Button 
            className="bg-health-600 hover:bg-health-700"
            onClick={() => {}}
          >
            <Pill className="mr-2 h-4 w-4" />
            Add Medication
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Hospital Pharmacy</CardTitle>
            <CardDescription>
              Manage medications and prescriptions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center p-12">
              <div className="text-center">
                <Pill className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-semibold">Pharmacy System</h3>
                <p className="mt-1 text-gray-500 max-w-md mx-auto">
                  This page will allow pharmacists to manage medications, prescriptions, and inventory.
                  The full implementation will include inventory tracking, prescription verification, and patient medication history.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </HospitalLayout>
  );
};

export default HospitalPharmacy;

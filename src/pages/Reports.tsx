
import { useState } from "react";
import HospitalLayout from "@/components/HospitalLayout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  FileText, 
  Download, 
  LineChart,
  PieChart,
  BarChart3,
  Calendar,
  Filter
} from "lucide-react";

const Reports = () => {
  const [reportPeriod, setReportPeriod] = useState("month");
  
  const periodOptions = [
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "quarter", label: "This Quarter" },
    { value: "year", label: "This Year" },
  ];

  const reportCards = [
    { 
      title: "Patient Demographics", 
      description: "Age, gender, and location distribution of patients",
      icon: PieChart,
      lastUpdated: "Today at 09:15 AM" 
    },
    { 
      title: "Hospital Occupancy", 
      description: "Bed utilization and department capacity",
      icon: BarChart3,
      lastUpdated: "Today at 10:30 AM" 
    },
    { 
      title: "Disease Prevalence", 
      description: "Most common diagnoses and treatments",
      icon: LineChart,
      lastUpdated: "Yesterday at 04:45 PM" 
    },
    { 
      title: "Staff Performance", 
      description: "Productivity and patient satisfaction metrics",
      icon: BarChart,
      lastUpdated: "Today at 08:00 AM" 
    },
    { 
      title: "Resource Utilization", 
      description: "Equipment usage and inventory status",
      icon: PieChart,
      lastUpdated: "Yesterday at 02:30 PM" 
    },
    { 
      title: "Financial Summary", 
      description: "Revenue, expenses, and budget analysis",
      icon: LineChart,
      lastUpdated: "Today at 11:45 AM" 
    },
  ];

  return (
    <HospitalLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          
          <div className="flex flex-wrap gap-2">
            {periodOptions.map((option) => (
              <Button 
                key={option.value}
                variant={reportPeriod === option.value ? "default" : "outline"} 
                className={reportPeriod === option.value ? "bg-health-600 hover:bg-health-700" : ""}
                onClick={() => setReportPeriod(option.value)}
              >
                {option.label}
              </Button>
            ))}
            
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Custom Range
            </Button>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportCards.map((report, index) => {
            const Icon = report.icon;
            
            return (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">{report.title}</CardTitle>
                  <Icon className="h-5 w-5 text-health-600" />
                </CardHeader>
                <CardDescription className="px-6">{report.description}</CardDescription>
                
                <CardContent className="p-6">
                  <div className="aspect-[4/3] bg-muted/10 rounded-md border border-dashed flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">Chart visualization</span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-muted-foreground">
                      Last updated: {report.lastUpdated}
                    </span>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-8">
                        <FileText className="h-3.5 w-3.5 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="h-8">
                        <Download className="h-3.5 w-3.5 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Data Export and Custom Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Data Export & Custom Reports</CardTitle>
            <CardDescription>Generate custom reports and export data for analysis</CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 rounded-md border p-6">
                  <h3 className="text-lg font-medium mb-4">Generate Health Ministry Report</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Compile standardized reports required by the Federal Ministry of Health.
                  </p>
                  
                  <div className="flex gap-2 mt-6">
                    <Button variant="outline" className="w-full sm:w-auto">
                      <Filter className="mr-2 h-4 w-4" />
                      Customize
                    </Button>
                    <Button className="w-full sm:w-auto bg-health-600 hover:bg-health-700">
                      <FileText className="mr-2 h-4 w-4" />
                      Generate
                    </Button>
                  </div>
                </div>
                
                <div className="flex-1 rounded-md border p-6">
                  <h3 className="text-lg font-medium mb-4">Raw Data Export</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Export anonymized data in various formats for external analysis.
                  </p>
                  
                  <div className="flex gap-2 mt-6">
                    <Button variant="outline" className="w-full sm:w-auto">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter Data
                    </Button>
                    <Button className="w-full sm:w-auto bg-health-600 hover:bg-health-700">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="rounded-md border p-6">
                <h3 className="text-lg font-medium mb-4">Scheduled Reports</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Configure reports to be automatically generated and delivered on a schedule.
                </p>
                
                <div className="rounded-md bg-muted/20 p-4">
                  <div className="text-sm mb-2">Currently Scheduled Reports:</div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span>Weekly Patient Intake Summary</span>
                      <span className="text-muted-foreground">Every Monday at 8:00 AM</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Monthly Financial Report</span>
                      <span className="text-muted-foreground">1st day of month at 6:00 AM</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Quarterly Disease Prevalence Analysis</span>
                      <span className="text-muted-foreground">Every 3 months</span>
                    </li>
                  </ul>
                </div>
                
                <Button className="mt-4 bg-health-600 hover:bg-health-700">
                  Configure Scheduled Reports
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </HospitalLayout>
  );
};

export default Reports;

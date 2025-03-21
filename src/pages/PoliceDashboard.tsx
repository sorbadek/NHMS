
import { useState, useEffect } from "react";
import PoliceLayout from "@/components/PoliceLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { 
  AlertTriangle, 
  Car, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  BarChart3,
  FileText,
  Users
} from "lucide-react";
import { Link } from "react-router-dom";
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const PoliceDashboard = () => {
  const { toast } = useToast();
  const [officerInfo, setOfficerInfo] = useState<any>(null);

  const { 
    data: accidentReports = [], 
    isLoading: isLoadingReports 
  } = useQuery({
    queryKey: ['accidentReports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('accident_reports')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Get officer information
  useEffect(() => {
    const getOfficerInfo = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      try {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (userError) throw userError;

        const { data: officerData, error: officerError } = await supabase
          .from('police_officers')
          .select('*, police_departments(*)')
          .eq('user_id', session.user.id)
          .single();

        if (officerError && officerError.code !== 'PGRST116') {
          throw officerError;
        }

        setOfficerInfo({
          ...userData,
          ...(officerData || {})
        });
      } catch (error: any) {
        console.error('Error fetching officer info:', error);
        toast({
          title: "Error loading profile",
          description: error.message,
          variant: "destructive"
        });
      }
    };

    getOfficerInfo();
  }, [toast]);

  // Prepare data for charts
  const accidentsByType = accidentReports.reduce((acc: any, report: any) => {
    const type = report.accident_type || 'Other';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const accidentTypeData = Object.entries(accidentsByType).map(([name, value]) => ({
    name,
    value
  }));

  const accidentsBySeverity = accidentReports.reduce((acc: any, report: any) => {
    const severity = report.severity || 'Unknown';
    acc[severity] = (acc[severity] || 0) + 1;
    return acc;
  }, {});

  const accidentSeverityData = Object.entries(accidentsBySeverity).map(([name, value]) => ({
    name,
    value
  }));

  // Calculate statistics
  const totalAccidents = accidentReports.length;
  const openAccidents = accidentReports.filter((report: any) => report.status === 'open').length;
  const recentAccidents = accidentReports.filter((report: any) => {
    const reportDate = new Date(report.created_at);
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    return reportDate >= lastWeek;
  }).length;

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <PoliceLayout>
      <div className="space-y-6">
        {/* Welcome banner */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Welcome, {officerInfo?.full_name || 'Officer'}</h2>
                <p className="text-muted-foreground mt-1">
                  {officerInfo?.police_departments?.name || 'Police Department'} • {officerInfo?.rank || 'Officer'}
                </p>
              </div>
              <div className="flex gap-2">
                <Button asChild>
                  <Link to="/accident-reports">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    View Accident Reports
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Accidents</CardTitle>
              <Car className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAccidents}</div>
              <p className="text-xs text-muted-foreground mt-1">
                All time reported accidents
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Open Cases</CardTitle>
              <AlertCircle className="h-5 w-5 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{openAccidents}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Accidents pending resolution
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Recent Accidents</CardTitle>
              <Clock className="h-5 w-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentAccidents}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Reported in the last 7 days
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Closed Cases</CardTitle>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAccidents - openAccidents}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Successfully resolved cases
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Quick Access</CardTitle>
              <CardDescription>Navigate to important sections</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700" asChild>
                <Link to="/accident-reports">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Accident Reports
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link to="/police-directory">
                  <Users className="mr-2 h-5 w-5" />
                  Police Directory
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link to="/police-reports">
                  <FileText className="mr-2 h-5 w-5" />
                  Generate Reports
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link to="/police-reports">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Statistics
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Charts */}
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle>Accident Statistics</CardTitle>
              <CardDescription>Overview of accident reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-[200px]">
                  <h3 className="text-sm font-medium mb-2 text-center">Accidents by Type</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={accidentTypeData}
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {accidentTypeData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="h-[200px]">
                  <h3 className="text-sm font-medium mb-2 text-center">Accidents by Severity</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={accidentSeverityData}
                      margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Accident Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Accident Reports</CardTitle>
            <CardDescription>Latest reported accidents</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingReports ? (
              <div className="flex justify-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : accidentReports.length > 0 ? (
              <div className="space-y-4">
                {accidentReports.slice(0, 5).map((report: any) => (
                  <Card key={report.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">
                            {report.accident_type || 'Accident'} - {report.report_number || report.id.substring(0, 8)}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {report.location || 'Unknown location'} • {new Date(report.accident_date || report.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-sm mt-2 line-clamp-2">{report.description || 'No description available'}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          report.status === 'open' 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {report.status === 'open' ? 'Open' : 'Closed'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <div className="flex justify-center mt-4">
                  <Button variant="outline" asChild>
                    <Link to="/accident-reports">View all accident reports</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-3" />
                <h3 className="font-medium text-lg">No accident reports</h3>
                <p className="text-muted-foreground">There are no accident reports in the system yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PoliceLayout>
  );
};

export default PoliceDashboard;

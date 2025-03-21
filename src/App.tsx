
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import PatientLogin from "./pages/PatientLogin";
import HospitalDashboard from "./pages/HospitalDashboard";
import PatientManagement from "./pages/PatientManagement";
import StaffManagement from "./pages/StaffManagement";
import ResourceManagement from "./pages/ResourceManagement";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";
import PatientDashboard from "./pages/PatientDashboard";
import PatientAppointments from "./pages/PatientAppointments";
import PatientRecords from "./pages/PatientRecords";
import PoliceDashboard from "./pages/PoliceDashboard";
import AccidentReports from "./pages/AccidentReports";
import HospitalRegistration from "./pages/HospitalRegistration";
import PoliceRegistration from "./pages/PoliceRegistration";
import StaffRegistration from "./pages/StaffRegistration";
import OfficerRegistration from "./pages/OfficerRegistration";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/patient-login" element={<PatientLogin />} />
          
          {/* Hospital routes */}
          <Route path="/hospital-dashboard" element={<HospitalDashboard />} />
          <Route path="/patients" element={<PatientManagement />} />
          <Route path="/staff" element={<StaffManagement />} />
          <Route path="/resources" element={<ResourceManagement />} />
          <Route path="/reports" element={<Reports />} />
          
          {/* Patient routes */}
          <Route path="/patient-dashboard" element={<PatientDashboard />} />
          <Route path="/patient-appointments" element={<PatientAppointments />} />
          <Route path="/patient-records" element={<PatientRecords />} />
          
          {/* Police routes */}
          <Route path="/police-dashboard" element={<PoliceDashboard />} />
          <Route path="/accident-reports" element={<AccidentReports />} />
          <Route path="/police-directory" element={<PoliceDashboard />} />
          <Route path="/police-reports" element={<PoliceDashboard />} />
          <Route path="/police-profile" element={<PoliceDashboard />} />
          
          {/* Registration routes */}
          <Route path="/hospital-registration" element={<HospitalRegistration />} />
          <Route path="/police-registration" element={<PoliceRegistration />} />
          <Route path="/staff-registration" element={<StaffRegistration />} />
          <Route path="/officer-registration" element={<OfficerRegistration />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

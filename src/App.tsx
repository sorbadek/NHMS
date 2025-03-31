
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import PatientLogin from "./pages/PatientLogin";
import PatientRegister from "./pages/PatientRegister";
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
import Documentation from "./pages/Documentation";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import FAQ from "./pages/FAQ";
import Support from "./pages/Support";
import SiteMap from "./components/SiteMap";

// Additional routes based on sitemap
import AdminDashboard from "./pages/AdminDashboard";
import HospitalAppointments from "./pages/HospitalAppointments";
import HospitalMedicalRecords from "./pages/HospitalMedicalRecords";
import HospitalPharmacy from "./pages/HospitalPharmacy";
import HospitalEmergency from "./pages/HospitalEmergency";

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
          <Route path="/patient-register" element={<PatientRegister />} />
          <Route path="/sitemap" element={<SiteMap />} />
          
          {/* Hospital routes */}
          <Route path="/hospital-dashboard" element={<HospitalDashboard />} />
          <Route path="/patients" element={<PatientManagement />} />
          <Route path="/staff" element={<StaffManagement />} />
          <Route path="/resources" element={<ResourceManagement />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/hospital/appointments" element={<HospitalAppointments />} />
          <Route path="/hospital/medical-records" element={<HospitalMedicalRecords />} />
          <Route path="/hospital/pharmacy" element={<HospitalPharmacy />} />
          <Route path="/hospital/emergency" element={<HospitalEmergency />} />
          
          {/* Patient routes */}
          <Route path="/patient-dashboard" element={<PatientDashboard />} />
          <Route path="/patient-appointments" element={<PatientAppointments />} />
          <Route path="/patient-records" element={<PatientRecords />} />
          <Route path="/patient-prescriptions" element={<PatientDashboard />} />
          <Route path="/patient-messages" element={<PatientDashboard />} />
          <Route path="/patient-settings" element={<PatientDashboard />} />
          <Route path="/patient-notifications" element={<PatientDashboard />} />
          
          {/* Police routes */}
          <Route path="/police-dashboard" element={<PoliceDashboard />} />
          <Route path="/accident-reports" element={<AccidentReports />} />
          <Route path="/police-directory" element={<PoliceDashboard />} />
          <Route path="/police-reports" element={<PoliceDashboard />} />
          <Route path="/police-profile" element={<PoliceDashboard />} />
          <Route path="/traffic-violations" element={<PoliceDashboard />} />
          <Route path="/emergency-alerts" element={<PoliceDashboard />} />
          
          {/* Admin routes */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/hospitals" element={<AdminDashboard />} />
          <Route path="/admin/police" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminDashboard />} />
          <Route path="/admin/reports" element={<AdminDashboard />} />
          <Route path="/admin/audit-logs" element={<AdminDashboard />} />
          <Route path="/admin/settings" element={<AdminDashboard />} />
          
          {/* Registration routes */}
          <Route path="/hospital-registration" element={<HospitalRegistration />} />
          <Route path="/police-registration" element={<PoliceRegistration />} />
          <Route path="/staff-registration" element={<StaffRegistration />} />
          <Route path="/officer-registration" element={<OfficerRegistration />} />
          
          {/* Information pages */}
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/support" element={<Support />} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

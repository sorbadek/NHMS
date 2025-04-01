
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, ProtectedRoute } from "./contexts/AuthContext";
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/patient-login" element={<PatientLogin />} />
          <Route path="/patient-register" element={<PatientRegister />} />
          <Route path="/sitemap" element={<SiteMap />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/support" element={<Support />} />
          
          {/* Hospital Registration - Publicly available */}
          <Route path="/hospital-registration" element={<HospitalRegistration />} />
          <Route path="/police-registration" element={<PoliceRegistration />} />
          
          {/* Staff Registration - Only accessible by admins & hospital staff admins */}
          <Route path="/staff-registration" element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin', 'hospital_staff']}>
              <StaffRegistration />
            </ProtectedRoute>
          } />
          
          {/* Officer Registration - Only accessible by admins & police admins */}
          <Route path="/officer-registration" element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin', 'police']}>
              <OfficerRegistration />
            </ProtectedRoute>
          } />
          
          {/* Protected routes - Hospital */}
          <Route path="/hospital-dashboard" element={
            <ProtectedRoute allowedRoles={['hospital_staff', 'admin', 'super_admin']}>
              <HospitalDashboard />
            </ProtectedRoute>
          } />
          <Route path="/patients" element={
            <ProtectedRoute allowedRoles={['hospital_staff', 'admin', 'super_admin']}>
              <PatientManagement />
            </ProtectedRoute>
          } />
          <Route path="/staff" element={
            <ProtectedRoute allowedRoles={['hospital_staff', 'admin', 'super_admin']}>
              <StaffManagement />
            </ProtectedRoute>
          } />
          <Route path="/resources" element={
            <ProtectedRoute allowedRoles={['hospital_staff', 'admin', 'super_admin']}>
              <ResourceManagement />
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute allowedRoles={['hospital_staff', 'admin', 'super_admin']}>
              <Reports />
            </ProtectedRoute>
          } />
          <Route path="/hospital/appointments" element={
            <ProtectedRoute allowedRoles={['hospital_staff', 'admin', 'super_admin']}>
              <HospitalAppointments />
            </ProtectedRoute>
          } />
          <Route path="/hospital/medical-records" element={
            <ProtectedRoute allowedRoles={['hospital_staff', 'admin', 'super_admin']}>
              <HospitalMedicalRecords />
            </ProtectedRoute>
          } />
          <Route path="/hospital/pharmacy" element={
            <ProtectedRoute allowedRoles={['hospital_staff', 'admin', 'super_admin']}>
              <HospitalPharmacy />
            </ProtectedRoute>
          } />
          <Route path="/hospital/emergency" element={
            <ProtectedRoute allowedRoles={['hospital_staff', 'admin', 'super_admin']}>
              <HospitalEmergency />
            </ProtectedRoute>
          } />
          
          {/* Protected routes - Patient */}
          <Route path="/patient-dashboard" element={
            <ProtectedRoute allowedRoles={['patient', 'admin', 'super_admin']}>
              <PatientDashboard />
            </ProtectedRoute>
          } />
          <Route path="/patient-appointments" element={
            <ProtectedRoute allowedRoles={['patient', 'admin', 'super_admin']}>
              <PatientAppointments />
            </ProtectedRoute>
          } />
          <Route path="/patient-records" element={
            <ProtectedRoute allowedRoles={['patient', 'admin', 'super_admin']}>
              <PatientRecords />
            </ProtectedRoute>
          } />
          <Route path="/patient-prescriptions" element={
            <ProtectedRoute allowedRoles={['patient', 'admin', 'super_admin']}>
              <PatientDashboard />
            </ProtectedRoute>
          } />
          <Route path="/patient-messages" element={
            <ProtectedRoute allowedRoles={['patient', 'admin', 'super_admin']}>
              <PatientDashboard />
            </ProtectedRoute>
          } />
          <Route path="/patient-settings" element={
            <ProtectedRoute allowedRoles={['patient', 'admin', 'super_admin']}>
              <PatientDashboard />
            </ProtectedRoute>
          } />
          <Route path="/patient-notifications" element={
            <ProtectedRoute allowedRoles={['patient', 'admin', 'super_admin']}>
              <PatientDashboard />
            </ProtectedRoute>
          } />
          
          {/* Protected routes - Police */}
          <Route path="/police-dashboard" element={
            <ProtectedRoute allowedRoles={['police', 'admin', 'super_admin']}>
              <PoliceDashboard />
            </ProtectedRoute>
          } />
          <Route path="/accident-reports" element={
            <ProtectedRoute allowedRoles={['police', 'admin', 'super_admin']}>
              <AccidentReports />
            </ProtectedRoute>
          } />
          <Route path="/police-directory" element={
            <ProtectedRoute allowedRoles={['police', 'admin', 'super_admin']}>
              <PoliceDashboard />
            </ProtectedRoute>
          } />
          <Route path="/police-reports" element={
            <ProtectedRoute allowedRoles={['police', 'admin', 'super_admin']}>
              <PoliceDashboard />
            </ProtectedRoute>
          } />
          <Route path="/police-profile" element={
            <ProtectedRoute allowedRoles={['police', 'admin', 'super_admin']}>
              <PoliceDashboard />
            </ProtectedRoute>
          } />
          <Route path="/traffic-violations" element={
            <ProtectedRoute allowedRoles={['police', 'admin', 'super_admin']}>
              <PoliceDashboard />
            </ProtectedRoute>
          } />
          <Route path="/emergency-alerts" element={
            <ProtectedRoute allowedRoles={['police', 'admin', 'super_admin']}>
              <PoliceDashboard />
            </ProtectedRoute>
          } />
          
          {/* Protected routes - Admin */}
          <Route path="/admin-dashboard" element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/hospitals" element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/police" element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/reports" element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/audit-logs" element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

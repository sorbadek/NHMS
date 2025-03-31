
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Building, 
  User, 
  Users, 
  Shield, 
  Stethoscope, 
  Clipboard, 
  Calendar, 
  FileText, 
  Settings, 
  Bell, 
  Pill, 
  Activity, 
  LineChart,
  FileCog,
  UserCog,
  BarChart4,
  Microscope,
  BadgeAlert
} from "lucide-react";

const SiteMap = () => {
  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">HealthLink Central - Sitemap</h1>
        <p className="text-muted-foreground">
          National Health Management System - Complete Navigation Structure
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Public Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-500" />
              Public Pages
            </CardTitle>
            <CardDescription>
              Accessible to all users without authentication
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-4 w-4 text-blue-600" />
                </span>
                <span>/ - Landing Page</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-4 w-4 text-blue-600" />
                </span>
                <span>/auth - Authentication Page</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-blue-600" />
                </span>
                <span>/documentation - System Documentation</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-blue-600" />
                </span>
                <span>/privacy-policy - Privacy Policy</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-blue-600" />
                </span>
                <span>/terms-of-service - Terms of Service</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-blue-600" />
                </span>
                <span>/faq - Frequently Asked Questions</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <Bell className="h-4 w-4 text-blue-600" />
                </span>
                <span>/support - Contact Support</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Registration Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="h-5 w-5 text-green-500" />
              Registration & Authentication
            </CardTitle>
            <CardDescription>
              User registration and authentication pathways
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <User className="h-4 w-4 text-green-600" />
                </span>
                <span>/patient-register - Patient Registration</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <User className="h-4 w-4 text-green-600" />
                </span>
                <span>/patient-login - Patient Login</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <Building className="h-4 w-4 text-green-600" />
                </span>
                <span>/hospital-registration - Hospital Registration</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-green-600" />
                </span>
                <span>/police-registration - Police Department Registration</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <Users className="h-4 w-4 text-green-600" />
                </span>
                <span>/staff-registration - Hospital Staff Registration</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <Users className="h-4 w-4 text-green-600" />
                </span>
                <span>/officer-registration - Police Officer Registration</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        {/* Super Admin Dashboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-purple-500" />
              Super Admin Dashboard
            </CardTitle>
            <CardDescription>
              System administration for government officials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                  <Activity className="h-4 w-4 text-purple-600" />
                </span>
                <span>/admin-dashboard - Main Dashboard</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                  <Building className="h-4 w-4 text-purple-600" />
                </span>
                <span>/admin/hospitals - Hospital Management</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-purple-600" />
                </span>
                <span>/admin/police - Police Department Management</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                  <Users className="h-4 w-4 text-purple-600" />
                </span>
                <span>/admin/users - User Management</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                  <BarChart4 className="h-4 w-4 text-purple-600" />
                </span>
                <span>/admin/reports - System Reports</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                  <FileCog className="h-4 w-4 text-purple-600" />
                </span>
                <span>/admin/audit-logs - System Audit Logs</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                  <Settings className="h-4 w-4 text-purple-600" />
                </span>
                <span>/admin/settings - System Configuration</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Hospital Admin Dashboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-500" />
              Hospital Administration
            </CardTitle>
            <CardDescription>
              Hospital management dashboards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <Activity className="h-4 w-4 text-blue-600" />
                </span>
                <span>/hospital-dashboard - Hospital Overview</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-600" />
                </span>
                <span>/patients - Patient Management</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-600" />
                </span>
                <span>/staff - Staff Management</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </span>
                <span>/hospital/appointments - Appointment Management</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <Clipboard className="h-4 w-4 text-blue-600" />
                </span>
                <span>/hospital/medical-records - Medical Records</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <Pill className="h-4 w-4 text-blue-600" />
                </span>
                <span>/hospital/pharmacy - Pharmacy Management</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <BadgeAlert className="h-4 w-4 text-blue-600" />
                </span>
                <span>/hospital/emergency - Emergency Services</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <LineChart className="h-4 w-4 text-blue-600" />
                </span>
                <span>/reports - Hospital Reports</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <Clipboard className="h-4 w-4 text-blue-600" />
                </span>
                <span>/resources - Resource Management</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Hospital Staff Dashboards */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-teal-500" />
              Hospital Staff Dashboards
            </CardTitle>
            <CardDescription>
              Role-specific dashboards for hospital staff
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 font-medium text-teal-700">
                Doctor Dashboard
              </li>
              <li className="flex items-center gap-2 pl-4">
                <span className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-teal-600" />
                </span>
                <span>/doctor/appointments - Patient Appointments</span>
              </li>
              <li className="flex items-center gap-2 pl-4">
                <span className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center">
                  <Clipboard className="h-4 w-4 text-teal-600" />
                </span>
                <span>/doctor/patients - My Patients</span>
              </li>
              
              <Separator className="my-2" />
              
              <li className="flex items-center gap-2 font-medium text-teal-700">
                Nurse Dashboard
              </li>
              <li className="flex items-center gap-2 pl-4">
                <span className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center">
                  <Activity className="h-4 w-4 text-teal-600" />
                </span>
                <span>/nurse/vitals - Patient Vitals</span>
              </li>
              <li className="flex items-center gap-2 pl-4">
                <span className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center">
                  <Clipboard className="h-4 w-4 text-teal-600" />
                </span>
                <span>/nurse/care-plans - Care Plans</span>
              </li>
              
              <Separator className="my-2" />
              
              <li className="flex items-center gap-2 font-medium text-teal-700">
                Lab Technician Dashboard
              </li>
              <li className="flex items-center gap-2 pl-4">
                <span className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center">
                  <Microscope className="h-4 w-4 text-teal-600" />
                </span>
                <span>/lab/tests - Test Orders</span>
              </li>
              <li className="flex items-center gap-2 pl-4">
                <span className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center">
                  <Clipboard className="h-4 w-4 text-teal-600" />
                </span>
                <span>/lab/results - Test Results</span>
              </li>
              
              <Separator className="my-2" />
              
              <li className="flex items-center gap-2 font-medium text-teal-700">
                Pharmacist Dashboard
              </li>
              <li className="flex items-center gap-2 pl-4">
                <span className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center">
                  <Pill className="h-4 w-4 text-teal-600" />
                </span>
                <span>/pharmacy/prescriptions - Prescriptions</span>
              </li>
              <li className="flex items-center gap-2 pl-4">
                <span className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center">
                  <Clipboard className="h-4 w-4 text-teal-600" />
                </span>
                <span>/pharmacy/inventory - Medication Inventory</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Police Dashboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-indigo-500" />
              Police Department
            </CardTitle>
            <CardDescription>
              Police department dashboards and features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Activity className="h-4 w-4 text-indigo-600" />
                </span>
                <span>/police-dashboard - Police Dashboard</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                  <BadgeAlert className="h-4 w-4 text-indigo-600" />
                </span>
                <span>/accident-reports - Accident Reports</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Users className="h-4 w-4 text-indigo-600" />
                </span>
                <span>/police-directory - Police Directory</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                  <BarChart4 className="h-4 w-4 text-indigo-600" />
                </span>
                <span>/police-reports - Police Reports & Statistics</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                  <User className="h-4 w-4 text-indigo-600" />
                </span>
                <span>/police-profile - Officer Profile</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Clipboard className="h-4 w-4 text-indigo-600" />
                </span>
                <span>/traffic-violations - Traffic Violations</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Bell className="h-4 w-4 text-indigo-600" />
                </span>
                <span>/emergency-alerts - Emergency Alerts</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Patient Dashboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-amber-500" />
              Patient Features
            </CardTitle>
            <CardDescription>
              Features available to registered patients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                  <Activity className="h-4 w-4 text-amber-600" />
                </span>
                <span>/patient-dashboard - Patient Dashboard</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-amber-600" />
                </span>
                <span>/patient-appointments - My Appointments</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-amber-600" />
                </span>
                <span>/patient-records - Medical Records</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                  <Pill className="h-4 w-4 text-amber-600" />
                </span>
                <span>/patient-prescriptions - My Prescriptions</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-amber-600" />
                </span>
                <span>/patient-messages - Messages</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                  <Settings className="h-4 w-4 text-amber-600" />
                </span>
                <span>/patient-settings - Account Settings</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                  <Bell className="h-4 w-4 text-amber-600" />
                </span>
                <span>/patient-notifications - Notifications</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* API Documentation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCog className="h-5 w-5 text-gray-500" />
              System API & Documentation
            </CardTitle>
            <CardDescription>
              API documentation and integration resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-gray-600" />
                </span>
                <span>/api/documentation - API Documentation</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-gray-600" />
                </span>
                <span>/api/sandbox - API Testing Sandbox</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-gray-600" />
                </span>
                <span>/integrations - Third-party Integrations</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-gray-600" />
                </span>
                <span>/developer - Developer Resources</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-gray-600" />
                </span>
                <span>/webhooks - Webhook Configuration</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10 border p-6 rounded-lg bg-gray-50">
        <h2 className="text-xl font-bold mb-4">Email Notification System</h2>
        <p className="mb-4">The system sends email notifications for the following events:</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-md border">
            <h3 className="font-medium mb-2">Patient Notifications</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Appointment confirmations</li>
              <li>Appointment reminders (24h before)</li>
              <li>Prescription renewals</li>
              <li>Medical record updates</li>
              <li>Account activity alerts</li>
            </ul>
          </div>
          
          <div className="bg-white p-4 rounded-md border">
            <h3 className="font-medium mb-2">Hospital Staff Notifications</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>New patient registrations</li>
              <li>Emergency admissions</li>
              <li>Schedule changes</li>
              <li>Inventory alerts</li>
              <li>Staff meeting reminders</li>
            </ul>
          </div>
          
          <div className="bg-white p-4 rounded-md border">
            <h3 className="font-medium mb-2">Police Department Notifications</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>New accident reports</li>
              <li>Case status updates</li>
              <li>Emergency broadcasts</li>
              <li>Department announcements</li>
              <li>Shift schedule changes</li>
            </ul>
          </div>
          
          <div className="bg-white p-4 rounded-md border">
            <h3 className="font-medium mb-2">Admin Notifications</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>New organization registrations</li>
              <li>System performance alerts</li>
              <li>Security alerts</li>
              <li>User activity reports</li>
              <li>Database backup confirmations</li>
            </ul>
          </div>
          
          <div className="bg-white p-4 rounded-md border">
            <h3 className="font-medium mb-2">System Notifications</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Account creation and verification</li>
              <li>Password reset requests</li>
              <li>Privacy policy updates</li>
              <li>System maintenance alerts</li>
              <li>New feature announcements</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteMap;

import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Users,
  Bed,
  Activity,
  FileText,
  User,
  Shield,
  HelpCircle,
  Settings,
  AlertTriangle,
  Bell,
  Lock,
  FileQuestion,
  Building,
  Pill,
  Ambulance,
  MessageSquare,
  LayoutDashboard,
  BarChart3
} from 'lucide-react';

const SiteMap = () => {
  const siteStructure = [
    {
      title: "Main Pages",
      links: [
        { name: "Home", path: "/", icon: <Building size={16} /> },
        { name: "Authentication", path: "/auth", icon: <Lock size={16} /> },
        { name: "Patient Login", path: "/patient-login", icon: <User size={16} /> },
        { name: "Patient Register", path: "/patient-register", icon: <User size={16} /> },
      ]
    },
    {
      title: "Hospital Portal",
      links: [
        { name: "Dashboard", path: "/hospital-dashboard", icon: <LayoutDashboard size={16} /> },
        { name: "Patient Management", path: "/patients", icon: <Users size={16} /> },
        { name: "Staff Management", path: "/staff", icon: <Users size={16} /> },
        { name: "Resource Management", path: "/resources", icon: <Bed size={16} /> },
        { name: "Reports", path: "/reports", icon: <FileText size={16} /> },
        { name: "Appointments", path: "/hospital/appointments", icon: <Calendar size={16} /> },
        { name: "Medical Records", path: "/hospital/medical-records", icon: <FileText size={16} /> },
        { name: "Pharmacy", path: "/hospital/pharmacy", icon: <Pill size={16} /> },
        { name: "Emergency", path: "/hospital/emergency", icon: <Ambulance size={16} /> },
      ]
    },
    {
      title: "Patient Portal",
      links: [
        { name: "Dashboard", path: "/patient-dashboard", icon: <LayoutDashboard size={16} /> },
        { name: "Appointments", path: "/patient-appointments", icon: <Calendar size={16} /> },
        { name: "Medical Records", path: "/patient-records", icon: <FileText size={16} /> },
        { name: "Prescriptions", path: "/patient-prescriptions", icon: <Pill size={16} /> },
        { name: "Messages", path: "/patient-messages", icon: <MessageSquare size={16} /> },
        { name: "Settings", path: "/patient-settings", icon: <Settings size={16} /> },
        { name: "Notifications", path: "/patient-notifications", icon: <Bell size={16} /> },
      ]
    },
    {
      title: "Police Portal",
      links: [
        { name: "Dashboard", path: "/police-dashboard", icon: <LayoutDashboard size={16} /> },
        { name: "Accident Reports", path: "/accident-reports", icon: <AlertTriangle size={16} /> },
        { name: "Police Directory", path: "/police-directory", icon: <Shield size={16} /> },
        { name: "Reports & Statistics", path: "/police-reports", icon: <BarChart3 size={16} /> },
        { name: "Officer Profile", path: "/police-profile", icon: <User size={16} /> },
        { name: "Traffic Violations", path: "/traffic-violations", icon: <AlertTriangle size={16} /> },
        { name: "Emergency Alerts", path: "/emergency-alerts", icon: <Bell size={16} /> },
      ]
    },
    {
      title: "Admin Portal",
      links: [
        { name: "Dashboard", path: "/admin-dashboard", icon: <LayoutDashboard size={16} /> },
        { name: "Hospital Management", path: "/admin/hospitals", icon: <Building size={16} /> },
        { name: "Police Management", path: "/admin/police", icon: <Shield size={16} /> },
        { name: "User Management", path: "/admin/users", icon: <Users size={16} /> },
        { name: "Reports", path: "/admin/reports", icon: <FileText size={16} /> },
        { name: "Audit Logs", path: "/admin/audit-logs", icon: <Activity size={16} /> },
        { name: "System Settings", path: "/admin/settings", icon: <Settings size={16} /> },
      ]
    },
    {
      title: "Registration",
      links: [
        { name: "Hospital Registration", path: "/hospital-registration", icon: <Building size={16} /> },
        { name: "Police Registration", path: "/police-registration", icon: <Shield size={16} /> },
        { name: "Staff Registration", path: "/staff-registration", icon: <User size={16} /> },
        { name: "Officer Registration", path: "/officer-registration", icon: <User size={16} /> },
      ]
    },
    {
      title: "Information",
      links: [
        { name: "Documentation", path: "/documentation", icon: <FileText size={16} /> },
        { name: "Privacy Policy", path: "/privacy-policy", icon: <Lock size={16} /> },
        { name: "Terms of Service", path: "/terms-of-service", icon: <FileText size={16} /> },
        { name: "FAQ", path: "/faq", icon: <FileQuestion size={16} /> },
        { name: "Support", path: "/support", icon: <HelpCircle size={16} /> },
      ]
    }
  ];

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Site Map</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {siteStructure.map((section, index) => (
          <div key={index} className="border rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
            <ul className="space-y-2">
              {section.links.map((link, linkIndex) => (
                <li key={linkIndex}>
                  <Link 
                    to={link.path} 
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline py-1"
                  >
                    {link.icon}
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SiteMap;

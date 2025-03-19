
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  Settings, 
  Bell, 
  LogOut, 
  Menu, 
  X, 
  Sun, 
  Moon,
  Heart,
  MessageSquare,
  HelpCircle
} from "lucide-react";

const PatientLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const navItems = [
    { path: "/patient-dashboard", name: "Dashboard", icon: LayoutDashboard },
    { path: "/patient-appointments", name: "Appointments", icon: Calendar },
    { path: "/patient-records", name: "Medical Records", icon: FileText },
    { path: "/patient-prescriptions", name: "Prescriptions", icon: Heart },
    { path: "/patient-messages", name: "Messages", icon: MessageSquare },
    { path: "/patient-settings", name: "Settings", icon: Settings }
  ];

  return (
    <div className={`min-h-screen bg-background flex ${darkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 transition-all duration-300 ease-in-out ${
          sidebarOpen ? "w-64" : "w-20"
        } bg-sidebar-background text-sidebar-foreground shadow-md`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between h-16 px-4 py-4 border-b border-sidebar-border">
            <Link to="/patient-dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-health-600 text-white flex items-center justify-center font-bold text-xl">
                N
              </div>
              {sidebarOpen && <span className="font-bold text-xl">NHMS</span>}
            </Link>
            <button 
              onClick={toggleSidebar} 
              className="p-1 rounded-md hover:bg-sidebar-accent"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 py-4 px-2 overflow-y-auto">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                        isActive
                          ? "bg-sidebar-accent text-sidebar-primary font-medium"
                          : "hover:bg-sidebar-accent/50"
                      }`}
                    >
                      <Icon size={20} className="shrink-0" />
                      {sidebarOpen && <span className="ml-3">{item.name}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Notifications */}
          {sidebarOpen && (
            <div className="p-4 border-t border-sidebar-border">
              <div className="bg-blue-50 text-blue-700 p-3 rounded-md flex items-start gap-3">
                <Bell className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium">Upcoming Appointment</p>
                  <p className="mt-1">You have an appointment with Dr. James Wilson on July 20, 2023 at 10:30 AM.</p>
                </div>
              </div>
            </div>
          )}

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center justify-between">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-md hover:bg-sidebar-accent transition-colors"
                title="Toggle Dark Mode"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <button
                className="p-2 rounded-md hover:bg-sidebar-accent transition-colors"
                title="Help"
              >
                <HelpCircle size={20} />
              </button>

              <Link
                to="/"
                className="flex items-center space-x-2 text-red-500 hover:text-red-600 transition-colors p-2"
                title="Logout"
              >
                <LogOut size={20} />
                {sidebarOpen && <span>Logout</span>}
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        {/* Header for Mobile */}
        <header className="bg-white dark:bg-gray-800 shadow-sm px-4 py-2 sticky top-0 z-30 md:hidden">
          <div className="flex items-center justify-between">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-health-600 text-white flex items-center justify-center font-bold text-xl">
                N
              </div>
              <span className="font-bold text-xl">NHMS</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="px-4 py-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default PatientLayout;

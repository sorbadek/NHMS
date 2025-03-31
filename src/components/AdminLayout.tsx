
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building, 
  User, 
  Shield, 
  Users, 
  Settings, 
  FileText, 
  BarChart, 
  Lock,
  LogOut,
  Bell,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (value: string) => void;
}

const AdminLayout = ({ children, activeTab = "dashboard", onTabChange }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notificationCount, setNotificationCount] = useState(3);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          toast.error("You must be logged in to access this page");
          navigate("/auth");
          return;
        }
        
        const { data: userData, error } = await supabase
          .from('users')
          .select('user_type, full_name')
          .eq('id', session.user.id)
          .single();
        
        if (error) throw error;
        
        if (userData.user_type !== 'admin' && userData.user_type !== 'super_admin') {
          toast.error("You don't have permission to access this page");
          navigate("/auth");
          return;
        }

        setUserRole(userData.user_type);
        setUserName(userData.full_name);
      } catch (error) {
        console.error("Error checking admin access:", error);
        toast.error("An error occurred while checking your access rights");
        navigate("/auth");
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAccess();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/auth");
  };

  const handleTabChange = (value: string) => {
    if (onTabChange) onTabChange(value);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          <p className="text-muted-foreground animate-pulse">Checking access...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-gray-50"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div 
            className="flex items-center space-x-2"
            variants={itemVariants}
          >
            <Lock className="h-6 w-6 text-purple-600" />
            <h1 className="text-xl font-bold">
              {userRole === 'super_admin' ? 'Super Admin Dashboard' : 'Admin Dashboard'}
            </h1>
          </motion.div>
          <motion.div 
            className="flex items-center space-x-4"
            variants={itemVariants}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-4 font-medium">Notifications</div>
                <div className="border-t border-gray-100">
                  <div className="p-4 hover:bg-gray-50 cursor-pointer">
                    <p className="font-medium text-sm">New hospital registration</p>
                    <p className="text-muted-foreground text-xs mt-1">University Medical Center has registered</p>
                    <p className="text-xs text-gray-400 mt-1">10 minutes ago</p>
                  </div>
                  <div className="p-4 hover:bg-gray-50 cursor-pointer border-t border-gray-100">
                    <p className="font-medium text-sm">Staff account created</p>
                    <p className="text-muted-foreground text-xs mt-1">Dr. James Wilson was added to Central Hospital</p>
                    <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
                  </div>
                  <div className="p-4 hover:bg-gray-50 cursor-pointer border-t border-gray-100">
                    <p className="font-medium text-sm">System update</p>
                    <p className="text-muted-foreground text-xs mt-1">Emergency module has been updated</p>
                    <p className="text-xs text-gray-400 mt-1">Yesterday</p>
                  </div>
                </div>
                <div className="p-2 border-t border-gray-100">
                  <Button variant="ghost" size="sm" className="w-full text-center">
                    View all notifications
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt={userName || ""} />
                    <AvatarFallback className="bg-purple-100 text-purple-800">
                      {userName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'A'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-sm hidden md:inline-block">{userName}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate("/admin/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/admin/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <motion.div variants={itemVariants}>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
            <div className="relative">
              <TabsList className="hidden md:grid grid-cols-7 gap-2">
                <TabsTrigger 
                  value="dashboard" 
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  <BarChart className="mr-2 h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="hospitals" 
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  <Building className="mr-2 h-4 w-4" />
                  Hospitals
                </TabsTrigger>
                <TabsTrigger 
                  value="police" 
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Police
                </TabsTrigger>
                <TabsTrigger 
                  value="users" 
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Users
                </TabsTrigger>
                <TabsTrigger 
                  value="reports" 
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Reports
                </TabsTrigger>
                <TabsTrigger 
                  value="audit" 
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Audit Logs
                </TabsTrigger>
                <TabsTrigger 
                  value="settings" 
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </TabsTrigger>
              </TabsList>

              {/* Mobile Menu */}
              <div className="md:hidden">
                <Button 
                  variant="outline" 
                  className="w-full flex justify-between items-center mb-4"
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                >
                  <span className="flex items-center">
                    {activeTab === "dashboard" && <BarChart className="mr-2 h-4 w-4" />}
                    {activeTab === "hospitals" && <Building className="mr-2 h-4 w-4" />}
                    {activeTab === "police" && <Shield className="mr-2 h-4 w-4" />}
                    {activeTab === "users" && <Users className="mr-2 h-4 w-4" />}
                    {activeTab === "reports" && <FileText className="mr-2 h-4 w-4" />}
                    {activeTab === "audit" && <Lock className="mr-2 h-4 w-4" />}
                    {activeTab === "settings" && <Settings className="mr-2 h-4 w-4" />}
                    {activeTab === "dashboard" && "Overview"}
                    {activeTab === "hospitals" && "Hospitals"}
                    {activeTab === "police" && "Police"}
                    {activeTab === "users" && "Users"}
                    {activeTab === "reports" && "Reports"}
                    {activeTab === "audit" && "Audit Logs"}
                    {activeTab === "settings" && "Settings"}
                  </span>
                  {showMobileMenu ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
                
                <AnimatePresence>
                  {showMobileMenu && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-white shadow-md rounded-md mb-6 overflow-hidden"
                    >
                      <div className="p-2 space-y-1">
                        <Button 
                          variant={activeTab === "dashboard" ? "default" : "ghost"} 
                          className={`w-full justify-start ${activeTab === "dashboard" ? "bg-purple-600" : ""}`}
                          onClick={() => {
                            handleTabChange("dashboard");
                            setShowMobileMenu(false);
                          }}
                        >
                          <BarChart className="mr-2 h-4 w-4" />
                          Overview
                        </Button>
                        <Button 
                          variant={activeTab === "hospitals" ? "default" : "ghost"} 
                          className={`w-full justify-start ${activeTab === "hospitals" ? "bg-purple-600" : ""}`}
                          onClick={() => {
                            handleTabChange("hospitals");
                            setShowMobileMenu(false);
                          }}
                        >
                          <Building className="mr-2 h-4 w-4" />
                          Hospitals
                        </Button>
                        <Button 
                          variant={activeTab === "police" ? "default" : "ghost"} 
                          className={`w-full justify-start ${activeTab === "police" ? "bg-purple-600" : ""}`}
                          onClick={() => {
                            handleTabChange("police");
                            setShowMobileMenu(false);
                          }}
                        >
                          <Shield className="mr-2 h-4 w-4" />
                          Police
                        </Button>
                        <Button 
                          variant={activeTab === "users" ? "default" : "ghost"} 
                          className={`w-full justify-start ${activeTab === "users" ? "bg-purple-600" : ""}`}
                          onClick={() => {
                            handleTabChange("users");
                            setShowMobileMenu(false);
                          }}
                        >
                          <Users className="mr-2 h-4 w-4" />
                          Users
                        </Button>
                        <Button 
                          variant={activeTab === "reports" ? "default" : "ghost"} 
                          className={`w-full justify-start ${activeTab === "reports" ? "bg-purple-600" : ""}`}
                          onClick={() => {
                            handleTabChange("reports");
                            setShowMobileMenu(false);
                          }}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          Reports
                        </Button>
                        <Button 
                          variant={activeTab === "audit" ? "default" : "ghost"} 
                          className={`w-full justify-start ${activeTab === "audit" ? "bg-purple-600" : ""}`}
                          onClick={() => {
                            handleTabChange("audit");
                            setShowMobileMenu(false);
                          }}
                        >
                          <Lock className="mr-2 h-4 w-4" />
                          Audit Logs
                        </Button>
                        <Button 
                          variant={activeTab === "settings" ? "default" : "ghost"} 
                          className={`w-full justify-start ${activeTab === "settings" ? "bg-purple-600" : ""}`}
                          onClick={() => {
                            handleTabChange("settings");
                            setShowMobileMenu(false);
                          }}
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <motion.div
              variants={itemVariants}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              {children}
            </motion.div>
          </Tabs>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminLayout;

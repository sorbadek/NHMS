
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  FileText,
  Home,
  LogOut,
  Menu,
  Shield,
  User,
  Users,
  X,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  isActive: boolean;
}

const NavItem = ({ href, icon, title, isActive }: NavItemProps) => (
  <Link
    to={href}
    className={cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
      isActive
        ? "bg-muted text-primary font-medium"
        : "text-muted-foreground"
    )}
  >
    {icon}
    <span>{title}</span>
  </Link>
);

interface PoliceLayoutProps {
  children: React.ReactNode;
}

const PoliceLayout = ({ children }: PoliceLayoutProps) => {
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        navigate("/auth");
        return;
      }

      // Get user details
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.session.user.id)
        .single();

      if (userError || !userData) {
        console.error("Error fetching user:", userError);
        return;
      }

      setUser(userData);

      // Check if user is a police officer
      if (userData.user_type !== "police") {
        toast({
          title: "Access denied",
          description: "You don't have permission to access this area",
          variant: "destructive",
        });
        navigate("/auth");
      }
    };

    getSession();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_OUT") {
          navigate("/auth");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out successfully",
    });
    navigate("/auth");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-full max-w-xs transform transition duration-300 ease-in-out lg:hidden",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-xl">Police Portal</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            <NavItem
              href="/police-dashboard"
              icon={<Home className="h-5 w-5" />}
              title="Dashboard"
              isActive={location.pathname === "/police-dashboard"}
            />
            <NavItem
              href="/accident-reports"
              icon={<AlertTriangle className="h-5 w-5" />}
              title="Accident Reports"
              isActive={location.pathname === "/accident-reports"}
            />
            <NavItem
              href="/police-directory"
              icon={<Users className="h-5 w-5" />}
              title="Police Directory"
              isActive={location.pathname === "/police-directory"}
            />
            <NavItem
              href="/police-reports"
              icon={<FileText className="h-5 w-5" />}
              title="Reports & Statistics"
              isActive={location.pathname === "/police-reports"}
            />
            <NavItem
              href="/police-profile"
              icon={<User className="h-5 w-5" />}
              title="My Profile"
              isActive={location.pathname === "/police-profile"}
            />
          </nav>
          <div className="border-t px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{user?.full_name || "Officer"}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email || ""}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                title="Sign out"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden border-r bg-muted/40 lg:block lg:w-60">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link
              to="/police-dashboard"
              className="flex items-center gap-2 font-semibold"
            >
              <Shield className="h-6 w-6 text-blue-600" />
              <span>Police Portal</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-2 text-sm font-medium">
              <NavItem
                href="/police-dashboard"
                icon={<Home className="h-5 w-5" />}
                title="Dashboard"
                isActive={location.pathname === "/police-dashboard"}
              />
              <NavItem
                href="/accident-reports"
                icon={<AlertTriangle className="h-5 w-5" />}
                title="Accident Reports"
                isActive={location.pathname === "/accident-reports"}
              />
              <NavItem
                href="/police-directory"
                icon={<Users className="h-5 w-5" />}
                title="Police Directory"
                isActive={location.pathname === "/police-directory"}
              />
              <NavItem
                href="/police-reports"
                icon={<BarChart3 className="h-5 w-5" />}
                title="Reports & Statistics"
                isActive={location.pathname === "/police-reports"}
              />
              <NavItem
                href="/police-profile"
                icon={<User className="h-5 w-5" />}
                title="My Profile"
                isActive={location.pathname === "/police-profile"}
              />
            </nav>
          </div>
          <div className="mt-auto p-4 border-t">
            <div className="flex items-center gap-2 rounded-lg px-3 py-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{user?.full_name || "Officer"}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email || ""}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                title="Sign out"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="w-full flex-1">
            <h1 className="font-semibold text-lg md:text-xl">
              {location.pathname === "/police-dashboard" && "Dashboard"}
              {location.pathname === "/accident-reports" && "Accident Reports"}
              {location.pathname === "/police-directory" && "Police Directory"}
              {location.pathname === "/police-reports" && "Reports & Statistics"}
              {location.pathname === "/police-profile" && "My Profile"}
            </h1>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
};

export default PoliceLayout;

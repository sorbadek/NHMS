
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase, UserRow } from '@/integrations/supabase/client';
import { toast } from "sonner";

type UserType = 'patient' | 'admin' | 'super_admin' | 'hospital_staff' | 'police' | null;

interface AuthContextType {
  user: UserRow | null;
  userType: UserType;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserRow | null>(null);
  const [userType, setUserType] = useState<UserType>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setUser(null);
        setUserType(null);
        return;
      }
      
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (error) throw error;
      
      if (userData) {
        setUser(userData);
        setUserType(userData.user_type as UserType);
      }
    } catch (error: any) {
      console.error("Error refreshing user data:", error.message);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setIsLoading(true);
        if (session) {
          // Defer fetching additional user data to avoid supabase deadlocks
          setTimeout(() => {
            refreshUser().finally(() => setIsLoading(false));
          }, 0);
        } else {
          setUser(null);
          setUserType(null);
          setIsLoading(false);
        }
      }
    );

    // Check for existing session
    refreshUser().finally(() => setIsLoading(false));

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setUserType(null);
      toast.success("Signed out successfully");
    } catch (error: any) {
      toast.error(`Error signing out: ${error.message}`);
    }
  };

  const value = {
    user,
    userType,
    isLoading,
    signOut,
    refreshUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserType[];
}

export const ProtectedRoute = ({ children, allowedRoles = [] }: ProtectedRouteProps) => {
  const { user, userType, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-health-600"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && userType && !allowedRoles.includes(userType)) {
    // Redirect based on user type if they don't have the required role
    switch (userType) {
      case 'patient':
        return <Navigate to="/patient-dashboard" replace />;
      case 'hospital_staff':
        return <Navigate to="/hospital-dashboard" replace />;
      case 'police':
        return <Navigate to="/police-dashboard" replace />;
      case 'admin':
      case 'super_admin':
        return <Navigate to="/admin-dashboard" replace />;
      default:
        return <Navigate to="/auth" replace />;
    }
  }

  return <>{children}</>;
};

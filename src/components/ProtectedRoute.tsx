
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

type ProtectedRouteProps = {
  children: React.ReactNode;
  userType?: 'guest' | 'host' | 'admin';
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, userType }) => {
  const { user, loading } = useAuth();
  const { toast } = useToast();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', user.id)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Show loading state
  if (loading || (user && profileLoading)) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  // Not logged in, redirect to sign in
  if (!user) {
    toast({
      title: "Authentication required",
      description: "Please sign in to access this page",
    });
    return <Navigate to="/sign-in" replace />;
  }

  // If userType is specified, check if the user has the required role
  if (userType && profile && profile.user_type !== userType) {
    toast({
      title: "Access denied",
      description: `You need to be a ${userType} to access this page`,
      variant: "destructive",
    });
    
    // Redirect based on user type
    if (profile.user_type === 'host') {
      return <Navigate to="/host-dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;

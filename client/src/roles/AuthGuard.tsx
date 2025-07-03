import React from 'react';
import { Redirect, Route, RouteProps as WouterRouteProps, Params } from 'wouter';
import { useAuth } from '../features/auth/AuthContext';
import { UserRole } from '../types/auth';
import { hasRole } from '../constants/roles';

interface AuthGuardProps<P extends Params = Params> extends WouterRouteProps<P> {
  allowedRoles?: UserRole[];
  requiredRole?: UserRole;
  fallbackRoute?: string;
}

const AuthGuard = <P extends Params = Params>({ 
  allowedRoles, 
  requiredRole,
  fallbackRoute = '/',
  ...props 
}: AuthGuardProps<P>) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  if (isAuthenticated && user) {
    // Check specific required role using hierarchy
    if (requiredRole && !hasRole(user.role, requiredRole)) {
      return <Redirect to={fallbackRoute} />;
    }
    
    // Check allowed roles list
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Redirect to={fallbackRoute} />;
    }
  }

  return <Route {...props} />;
};

export default AuthGuard; 

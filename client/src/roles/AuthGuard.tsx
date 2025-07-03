import React from 'react';
import { Redirect, Route, RouteProps as WouterRouteProps, Params } from 'wouter';
import { useAuth } from '@/features/auth/AuthContext';

interface AuthGuardProps<P extends Params = Params> extends WouterRouteProps<P> {
  allowedRoles?: string[];
}

const AuthGuard = <P extends Params = Params>({ allowedRoles, ...props }: AuthGuardProps<P>) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  if (isAuthenticated && allowedRoles && user) {
    if (!allowedRoles.includes(user.role)) {
      return <Redirect to="/" />;
    }
  }

  return <Route {...props} />;
};

export default AuthGuard; 

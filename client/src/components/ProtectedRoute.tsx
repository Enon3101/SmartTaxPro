import React from 'react';
import { Redirect, Route, RouteProps as WouterRouteProps, Params } from 'wouter';

import { useAuth } from '@/context/AuthContext';

// Make ProtectedRouteProps generic, extending Wouter's generic RouteProps
interface ProtectedRouteProps<P extends Params = Params> extends WouterRouteProps<P> {
  allowedRoles?: string[];
}

const ProtectedRoute = <P extends Params = Params>({ allowedRoles, ...props }: ProtectedRouteProps<P>) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // Optional: Show a loading spinner or a blank page while auth state is being determined
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // If not authenticated, redirect to the login page
    // You can also pass the current location to redirect back after login
    // e.g., <Redirect to={`/login?redirect=${props.path}`} />
    return <Redirect to="/login" />;
  }

  // If authenticated, check roles if specified
  if (isAuthenticated && allowedRoles && user) {
    if (!allowedRoles.includes(user.role)) {
      // User is authenticated but does not have the required role
      // Redirect to an unauthorized page, or home, or show a message component
      // For simplicity, redirecting to home. A dedicated /unauthorized page would be better.
      return <Redirect to="/" />; 
    }
  }

  // If authenticated and (no specific roles required OR user has the required role), render the component
  return <Route {...props} />;
};

export default ProtectedRoute;

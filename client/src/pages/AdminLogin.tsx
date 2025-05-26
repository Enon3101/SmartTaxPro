import { Shield, User } from "lucide-react";
import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  // Auto-login with default credentials function
  const autoLoginWithDefault = async () => {
    setUsername('admin');
    setPassword('admin');
    setIsLoading(true);
      
    try {
      // Try the dev-admin-login endpoint first for automatic login
      const response = await fetch("/api/auth/dev-admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: 'admin',
          password: 'admin'
        })
      });
        
      const data = await response.json();
        
      if (!response.ok) {
        throw new Error(data.message || "Auto login failed");
      }
        
      // For dev-admin-login, create a simple token structure
      const authData = {
        token: data.accessToken || 'dev-admin-token',
        refreshToken: data.refreshToken || 'dev-admin-refresh',
        user: data.user || { id: 0, username: 'admin', role: 'admin' },
      };
        
      // Store admin session data
      localStorage.setItem('adminAuth', JSON.stringify(authData));
        
      // Redirect to admin dashboard
      setLocation("/admin");
    } catch (error) {
      console.error("Auto login error:", error);
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        console.error("Detailed Fetch Error: This usually means the server is not reachable or a CORS issue is preventing the request. Check if the server is running and the endpoint /api/auth/dev-admin-login is correct.");
        toast({
          title: "Auto Login Failed",
          description: "Could not connect to the server. Please ensure the server is running.",
          variant: "destructive",
        });
      } else if (error instanceof Error) {
         toast({
          title: "Auto Login Error",
          description: error.message || "An unexpected error occurred during auto-login.",
          variant: "destructive",
        });
      } else {
         toast({
          title: "Auto Login Error",
          description: "An unknown error occurred.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }
  };

  // Check if already logged in
  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuth');
    if (adminAuth) {
      try {
        const parsedAuth = JSON.parse(adminAuth);
        if (parsedAuth && parsedAuth.token) {
          // Verify the token is still valid by checking with the server
          verifyAdminAuth(parsedAuth.token);
        }
      } catch (error) {
        console.error("Error parsing admin auth data:", error);
        localStorage.removeItem('adminAuth');
      }
    } else {
      // If no existing login, try auto-login with default credentials
      autoLoginWithDefault();
    }
  }, []);
  
  // Verify admin token
  const verifyAdminAuth = async (token: string) => {
    try {
      const response = await fetch("/api/auth/verify-admin", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        // Still logged in, redirect to admin dashboard
        setLocation("/admin");
      } else {
        // Token invalid/expired, remove it
        localStorage.removeItem('adminAuth');
      }
    } catch (error) {
      console.error("Error verifying admin token:", error);
      localStorage.removeItem('adminAuth');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!username || !password) {
      toast({
        title: "Missing fields",
        description: "Please enter both username and password",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Check if we're in development and trying to login with admin/admin
      let response;
      
      if (username === 'admin' && password === 'admin') {
        // Try the dev-admin-login endpoint first
        response = await fetch("/api/auth/dev-admin-login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username,
            password
          })
        });
        
        // If that fails, try the regular endpoint
        if (!response.ok) {
          response = await fetch("/api/auth/admin-login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              username,
              password
            })
          });
        }
      } else {
        // Normal login flow
        response = await fetch("/api/auth/admin-login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username,
            password
          })
        });
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
      
      // For dev-admin-login, create a simple token structure
      const authData = {
        token: data.accessToken || 'dev-admin-token',
        refreshToken: data.refreshToken || 'dev-admin-refresh',
        user: data.user || { id: 0, username: 'admin', role: 'admin' },
      };
      
      // Store admin session data
      localStorage.setItem('adminAuth', JSON.stringify(authData));
      
      toast({
        title: "Login successful",
        description: "Welcome to admin dashboard",
      });
      
      // Redirect to admin dashboard
      setLocation("/admin");
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            {isLoading ? "Attempting automatic login..." : "Enter your credentials to access the admin dashboard"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            {!isLoading && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="admin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="bg-blue-50 p-3 rounded-md text-sm border border-blue-100">
                  <p className="flex items-center text-blue-800">
                    <User className="h-4 w-4 mr-2" />
                    Default admin credentials: username: <strong className="mx-1">admin</strong> password: <strong className="mx-1">admin</strong>
                  </p>
                </div>
              </>
            )}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-6">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
                <p className="text-muted-foreground">Attempting to log in automatically...</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            {!isLoading && (
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                Login to Dashboard
              </Button>
            )}
            {isLoading && (
              <div className="w-full">
                <Button 
                  type="button"
                  variant="outline" 
                  className="w-full"
                  onClick={() => setLocation('/admin')}
                >
                  Try Direct Access to Dashboard
                </Button>
              </div>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

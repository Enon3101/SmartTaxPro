import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UserCheck } from "lucide-react";
import { useState } from "react"; // Keep useState for isLoading
import { useForm } from "react-hook-form";
import { FiUser, FiLock } from "react-icons/fi";
import { useLocation } from "wouter";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/features/auth/AuthContext";
import { useToast } from "@/hooks/use-toast";

// import WelcomeDialog from "@/components/modals/WelcomeDialog"; // Removed, AuthContext will handle WelcomeUser

// Define Zod schema for the login form
const loginFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }), // Min 1, as backend handles length
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { login } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (formData: LoginFormValues) => {
    setIsLoading(true);
    try {
      // Using fetch as in the original code, can be swapped with apiRequest if preferred
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
        // credentials: "include", // Keep if session cookies are used, otherwise optional for JWT in header
      });
      
      const responseData = await response.json();

      if (!response.ok) {
        // responseData might contain a message field from the backend
        throw new Error(responseData.message || "Invalid credentials");
      }
      
      // responseData should be { user, accessToken, refreshToken }
      // The login function in AuthContext now expects this structure.
      login(responseData); 
      
      toast({
        title: "Success",
        description: "You have successfully logged in",
      });
      
      // AuthContext will now handle showing the welcome message via WelcomeUser component
      // setShowWelcome(true); // Removed
      
      // After successful login and context update, typically navigate away or rely on AuthProvider to show welcome
      // For now, let's assume AuthContext's WelcomeUser is sufficient and no immediate navigation here.
      // If navigation is desired here, it would be: navigate('/'); or navigate('/dashboard');
    } catch (error) {
      let errorMessage = "An error occurred during login";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto max-w-md py-10">
      <Card className="border shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 text-white space-y-1">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription className="text-blue-100">
            Login to access your account and manage your tax filing
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                  <FiUser className="h-4 w-4" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                  className="pl-10"
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                  <FiLock className="h-4 w-4" />
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password")}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <UserCheck className="mr-2 h-4 w-4" />
                  Login
                </>
              )}
            </Button>
            
            <div className="text-center text-sm text-muted-foreground">
              <span>Don't have an account? </span>
              <Button 
                variant="link" 
                className="p-0 h-auto" 
                onClick={() => navigate('/register')}
              >
                Register here
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
      
      {/* Welcome Dialog rendering removed, AuthContext handles WelcomeUser */}
    </div>
  );
}

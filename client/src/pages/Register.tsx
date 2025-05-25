import React, { useState } from 'react'; // Keep useState for isLoading
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from 'wouter';
import { useAuth } from "@/context/AuthContext"; // Import useAuth
import GoogleLoginButton from '../components/GoogleLoginButton';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// Define Zod schema for the form
const registerFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string().min(8, { message: "Please confirm your password." }),
  username: z.string().min(3, "Username must be at least 3 characters.").optional().or(z.literal('')), // Allow empty string for optional
  phone: z.string().regex(/^(\+?91)?[6-9]\d{9}$/, "Invalid Indian phone number.").optional().or(z.literal('')),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ["confirmPassword"], // Error will be shown on confirmPassword field
});

type RegisterFormValues = z.infer<typeof registerFormSchema>;

const Register: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { login } = useAuth(); // Get login function from AuthContext

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      username: '',
      phone: ''
    }
  });

  const onSubmit = async (formData: RegisterFormValues) => { // Renamed data to formData for clarity
    setIsLoading(true);
    try {
      const payload: {email: string; password: string; username?: string; phone?: string} = { // Explicit type for payload
        email: formData.email,
        password: formData.password,
      };
      if (formData.username) payload.username = formData.username;
      if (formData.phone) payload.phone = formData.phone;


      const response = await apiRequest('POST', '/api/auth/register', { // Assuming apiRequest returns a Response-like object
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const responseData = await response.json(); // Parse JSON once

      if (!response.ok) {
        throw new Error(responseData.message || 'Registration failed');
      }
      
      // Use AuthContext to handle login and token storage
      // responseData should be { user, accessToken, refreshToken }
      login(responseData);
      
      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully",
      });
      
      // Redirect to home or dashboard
      setLocation('/');
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Failed to register",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
          <CardDescription className="text-center">
            Register with your email and password.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email<span className="text-red-500">*</span></Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                disabled={isLoading}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password<span className="text-red-500">*</span></Label>
              <Input
                id="password"
                type="password"
                placeholder="Choose a password"
                {...register("password")}
                disabled={isLoading}
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password<span className="text-red-500">*</span></Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                {...register("confirmPassword")}
                disabled={isLoading}
              />
              {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
            </div>
            {/* Optional Fields Below */}
            <div className="space-y-2">
              <Label htmlFor="username">Username (Optional)</Label>
              <Input
                id="username"
                placeholder="Choose a username"
                {...register("username")}
                disabled={isLoading}
              />
              {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (Optional, Indian)</Label>
              <Input
                id="phone"
                placeholder="Enter your phone number"
                {...register("phone")}
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Registering...' : 'Register'}
            </Button>
          </form>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          
          <div className="flex justify-center">
            <GoogleLoginButton 
              size="large"
              theme="filled_blue"
              text="signup_with"
              width="100%"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center">
            Already have an account?{' '}
            <a 
              href="/login" 
              className="text-primary underline hover:text-primary/80"
              onClick={(e) => {
                e.preventDefault();
                setLocation('/login');
              }}
            >
              Login
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { FiPhone, FiLogIn, FiArrowLeft } from "react-icons/fi";
import { Loader2 } from "lucide-react";
import GoogleLoginButton from "./GoogleLoginButton";

interface LoginDialogProps {
  onLoginSuccess?: (user: any) => void;
  buttonText?: string;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  className?: string;
  onOpenChange?: (open: boolean) => void;
}

export default function LoginDialog({
  onLoginSuccess,
  buttonText = "Login",
  buttonVariant = "default",
  className = "",
  onOpenChange,
}: LoginDialogProps) {
  const handleOpenChange = (open: boolean) => {
    setStep("phone");
    setShowAdminLogin(false);
    setPhone("");
    setOtp("");
    setUsername("");
    setPassword("");
    setAdminUsername("");
    setAdminPassword("");
    
    if (onOpenChange) {
      onOpenChange(open);
    }
  };

  const [step, setStep] = useState<"phone" | "otp" | "credentials">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const sendOtpMutation = useMutation({
    mutationFn: async () => {
      if (!phone || !phone.match(/^[6-9]\d{9}$/)) {
        throw new Error("Please enter a valid Indian mobile number");
      }

      try {
        const response = await fetch("/api/auth/send-otp", {
          method: "POST",
          body: JSON.stringify({ phone }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to send OTP");
        }
        
        return await response.json();
      } catch (error) {
        console.error("Send OTP error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      setStep("otp");
      toast({
        title: "OTP Sent",
        description: `Verification code has been sent to +91 ${phone}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Send OTP",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      if (!otp || otp.length !== 6) {
        throw new Error("Please enter a valid 6-digit OTP");
      }

      try {
        const response = await fetch("/api/auth/login-with-otp", {
          method: "POST",
          body: JSON.stringify({ phone, otp }),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include"
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "OTP verification failed");
        }
        
        return await response.json();
      } catch (error) {
        console.error("Verify OTP error:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      toast({
        title: "Login Successful",
        description: "You have been logged in successfully",
      });
      
      if (onLoginSuccess) {
        onLoginSuccess(data.user);
      }
      
      handleOpenChange(false);
      
      // Reset form
      setOtp("");
      
      // Update cache
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
    onError: (error: Error) => {
      toast({
        title: "OTP Verification Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    sendOtpMutation.mutate();
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    verifyOtpMutation.mutate();
  };
  
  // Username/password login mutation
  const loginWithCredentialsMutation = useMutation({
    mutationFn: async () => {
      if (!username || !password) {
        throw new Error("Please enter both username and password");
      }

      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ username, password }),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include"
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Invalid credentials");
        }
        
        return await response.json();
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      toast({
        title: "Login Successful",
        description: "You have been logged in successfully",
      });
      
      if (onLoginSuccess) {
        onLoginSuccess(data.user);
      }
      
      handleOpenChange(false);
      
      // Reset form
      setUsername("");
      setPassword("");
      
      // Update cache
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleCredentialsLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginWithCredentialsMutation.mutate();
  };

  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const adminLoginMutation = useMutation({
    mutationFn: async () => {
      if (!adminUsername || !adminPassword) {
        throw new Error("Please enter both username and password");
      }

      try {
        const response = await fetch("/api/auth/dev-admin-login", {
          method: "POST",
          body: JSON.stringify({ username: adminUsername, password: adminPassword }),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include"
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Invalid admin credentials");
        }
        
        return await response.json();
      } catch (error) {
        console.error("Admin login error:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      toast({
        title: "Admin Login Successful",
        description: "Welcome to the admin dashboard",
      });
      
      if (onLoginSuccess) {
        onLoginSuccess(data.user);
      }
      
      handleOpenChange(false);
      
      // Redirect to admin dashboard
      window.location.href = "/admin";
    },
    onError: (error: Error) => {
      toast({
        title: "Admin Login Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAdminLogin = () => {
    adminLoginMutation.mutate();
  };

  const handleAdminLoginClick = () => {
    setShowAdminLogin(true);
  };

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} className={className}>
          {buttonText}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-0 shadow-2xl rounded-xl">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <DialogHeader className="text-left space-y-2">
            <DialogTitle className="text-2xl font-bold tracking-tight">
              {showAdminLogin 
                ? "Admin Access" 
                : (step === "phone" 
                   ? "Welcome Back" 
                   : step === "otp" 
                     ? "Verify Your Identity" 
                     : "Login with Credentials")}
            </DialogTitle>
            <DialogDescription className="text-blue-100 opacity-90">
              {showAdminLogin
                ? "Enter your credentials to access the dashboard"
                : (step === "phone"
                  ? "Choose your preferred login method"
                  : step === "otp"
                    ? `Enter the verification code sent to +91 ${phone}`
                    : "Enter your username and password to continue")}
            </DialogDescription>
          </DialogHeader>
        </div>
        
        {/* Content body with form */}
        <div className="p-6">
          {showAdminLogin ? (
            // Admin Login Form
            <form onSubmit={(e) => { e.preventDefault(); handleAdminLogin(); }}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="adminUsername" className="text-sm font-medium">
                    Username
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <Input
                      id="adminUsername"
                      className="pl-10"
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      placeholder="Admin username"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="adminPassword" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    </div>
                    <Input
                      id="adminPassword"
                      type="password"
                      className="pl-10"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Admin password"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white shadow-md transition-all duration-200 transform hover:scale-[1.01] py-6"
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                      <polyline points="10 17 15 12 10 7"></polyline>
                      <line x1="15" y1="12" x2="3" y2="12"></line>
                    </svg>
                    <span>Login as Admin</span>
                  </div>
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowAdminLogin(false)}
                >
                  <div className="flex items-center justify-center gap-2">
                    <FiArrowLeft className="h-4 w-4" /> 
                    <span>Back to User Login</span>
                  </div>
                </Button>
              </div>
            </form>
          ) : step === "credentials" ? (
            // Username/Password Login Form
            <form onSubmit={handleCredentialsLogin}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">
                    Username
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <Input
                      id="username"
                      className="pl-10"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Your username"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Your password"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <Button 
                  type="submit" 
                  disabled={loginWithCredentialsMutation.isPending}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-md transition-all duration-200 transform hover:scale-[1.01] py-6"
                >
                  {loginWithCredentialsMutation.isPending ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Logging in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                        <polyline points="10 17 15 12 10 7"></polyline>
                        <line x1="15" y1="12" x2="3" y2="12"></line>
                      </svg>
                      <span>Login</span>
                    </div>
                  )}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setStep("phone")}
                >
                  <div className="flex items-center justify-center gap-2">
                    <FiArrowLeft className="h-4 w-4" /> 
                    <span>Back to Login Options</span>
                  </div>
                </Button>
              </div>
            </form>
          ) : step === "phone" ? (
            // Phone Form
            <form onSubmit={handleSendOtp}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Mobile Number
                  </Label>
                  <div className="relative">
                    <div className="flex">
                      <span className="inline-flex items-center px-4 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground font-medium">
                        +91
                      </span>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').substring(0, 10);
                          setPhone(value);
                        }}
                        className="rounded-l-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="10-digit mobile number"
                        autoComplete="tel"
                        maxLength={10}
                        pattern="[6-9][0-9]{9}"
                        title="Please enter a valid Indian mobile number"
                        required
                      />
                    </div>
                    {phone && phone.length > 0 && phone.length < 10 && (
                      <div className="text-xs text-red-600 mt-1">
                        Please enter a complete 10-digit number
                      </div>
                    )}
                    {phone && !phone.match(/^[6-9]\d{9}$/) && phone.length === 10 && (
                      <div className="text-xs text-red-600 mt-1">
                        Indian mobile numbers should start with 6, 7, 8, or 9
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button 
                    type="submit" 
                    disabled={sendOtpMutation.isPending || !phone.match(/^[6-9]\d{9}$/)}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-md transition-all duration-200 transform hover:scale-[1.01] py-6"
                  >
                    {sendOtpMutation.isPending ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Sending OTP...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <FiPhone className="h-5 w-5" />
                        <span>Continue with Mobile</span>
                      </div>
                    )}
                  </Button>
                </div>
                
                {/* Divider */}
                <div className="relative flex py-5 items-center">
                  <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-white dark:bg-gray-800 text-muted-foreground">
                      OR CONTINUE WITH
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {/* Username/Password Login */}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => setStep("credentials")}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                      <span>Continue with Username</span>
                    </div>
                  </Button>
                  
                  {/* Google Login */}
                  <GoogleLoginButton 
                    size="large"
                    theme="outline"
                    text="signin_with"
                    width="100%"
                  />
                  
                  {/* Admin Login (Development only) */}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-dashed"
                    onClick={handleAdminLoginClick}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                      <span>Admin Login (Dev Only)</span>
                    </div>
                  </Button>
                </div>
              </div>
            </form>
          ) : (
            // OTP Form
            <form onSubmit={handleVerifyOtp}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-sm font-medium">
                    Verification Code
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').substring(0, 6);
                      setOtp(value);
                    }}
                    className="text-center text-xl tracking-widest font-medium"
                    placeholder="000000"
                    required
                    maxLength={6}
                    inputMode="numeric"
                    autoFocus
                  />
                </div>
                
                <div className="mt-6 space-y-3">
                  <Button 
                    type="submit" 
                    disabled={verifyOtpMutation.isPending || otp.length !== 6}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-md transition-all duration-200 transform hover:scale-[1.01] py-6"
                  >
                    {verifyOtpMutation.isPending ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Verifying...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <FiCheck className="h-5 w-5" />
                        <span>Verify and Continue</span>
                      </div>
                    )}
                  </Button>
                  
                  <div className="flex justify-between items-center text-sm">
                    <button 
                      type="button" 
                      className="text-blue-600 hover:text-blue-700 hover:underline"
                      onClick={() => setStep("phone")}
                    >
                      Use different number
                    </button>
                    
                    <button 
                      type="button" 
                      disabled={sendOtpMutation.isPending}
                      className="text-blue-600 hover:text-blue-700 hover:underline disabled:opacity-50" 
                      onClick={() => sendOtpMutation.mutate()}
                    >
                      {sendOtpMutation.isPending ? "Sending..." : "Resend OTP"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
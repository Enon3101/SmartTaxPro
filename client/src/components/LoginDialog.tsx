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
  const [isOpen, setIsOpen] = useState(false);
  
  // Handle open state changes and call the onOpenChange prop if provided
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
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
        throw new Error("Please enter a valid 10-digit mobile number");
      }

      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        body: JSON.stringify({ phone }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include"
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send OTP");
      }

      return await response.json();
    },
    onSuccess: () => {
      setStep("otp");
      toast({
        title: "OTP Sent",
        description: `OTP has been sent to your mobile number ${phone}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to send OTP",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      if (!otp || !otp.match(/^\d{6}$/)) {
        throw new Error("Please enter a valid 6-digit OTP");
      }

      try {
        const response = await fetch("/api/auth/verify-otp", {
          method: "POST",
          body: JSON.stringify({ phone, otp }),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include"
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Invalid OTP");
        }
        
        return await response.json();
      } catch (error) {
        console.error("OTP verification error:", error);
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
      setStep("phone");
      setPhone("");
      setOtp("");
      
      // Update cache
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Verification Failed",
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
    verifyOtpMutation.mutate(undefined);
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
  
  const handleAdminLoginClick = () => {
    setShowAdminLogin(true);
  };
  
  const handleAdminLogin = async () => {
    try {
      // Validate inputs
      if (!adminUsername || !adminPassword) {
        toast({
          title: "Missing Credentials",
          description: "Please enter both username and password",
          variant: "destructive",
        });
        return;
      }
      
      const response = await fetch("/api/auth/dev-admin-login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: adminUsername,
          password: adminPassword
        })
      });
      
      if (!response.ok) {
        throw new Error("Admin login failed");
      }
      
      const data = await response.json();
      if (data.user) {
        // Store admin session data in localStorage
        const authData = {
          token: data.accessToken || 'dev-admin-token',
          refreshToken: data.refreshToken || 'dev-admin-refresh',
          user: data.user || { id: 0, username: 'admin', role: 'admin' },
        };
        
        localStorage.setItem('adminAuth', JSON.stringify(authData));
        
        if (onLoginSuccess) {
          onLoginSuccess(data.user);
        }
        
        handleOpenChange(false);
        
        toast({
          title: "Admin Login Successful",
          description: "You are now logged in as Admin",
        });
        
        // Redirect to admin dashboard
        window.location.href = "/admin";
      }
    } catch (error) {
      toast({
        title: "Admin Login Failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
    } finally {
      // Reset the form
      setAdminUsername("");
      setAdminPassword("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} className={className}>
          <FiLogIn className="mr-2 h-4 w-4" />
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
              </div>
              
              <div className="mt-6 space-y-3">
                <Button
                  type="submit"
                  disabled={!phone || phone.length !== 10 || !phone.match(/^[6-9]\d{9}$/) || sendOtpMutation.isPending}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-md transition-all duration-200 transform hover:scale-[1.01] py-6"
                >
                  {sendOtpMutation.isPending ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Sending OTP...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                      <span>Get Verification OTP</span>
                    </div>
                  )}
                </Button>
                
                {/* Alternative login methods */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                  </div>
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
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="M8 11h.01M12 11h.01M16 11h.01" />
                      </svg>
                    </div>
                    <Input
                      id="otp"
                      className="pl-10 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg tracking-widest font-medium"
                      value={otp}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').substring(0, 6);
                        setOtp(value);
                      }}
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      pattern="\d{6}"
                      inputMode="numeric"
                      title="Please enter a valid 6-digit OTP"
                      autoComplete="one-time-code"
                      required
                    />
                  </div>
                  {otp && otp.length > 0 && otp.length < 6 && (
                    <div className="text-xs text-red-600 mt-1">
                      Please enter all 6 digits of the OTP
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-3 text-sm">
                <Button
                  variant="link"
                  type="button"
                  onClick={() => {
                    setStep("phone");
                    setOtp("");
                  }}
                  className="p-0 h-auto text-blue-600 hover:text-blue-800"
                >
                  <div className="flex items-center">
                    <FiArrowLeft className="mr-1 h-3 w-3" />
                    <span>Change phone number</span>
                  </div>
                </Button>
                <Button
                  variant="link"
                  type="button"
                  onClick={() => sendOtpMutation.mutate()}
                  disabled={sendOtpMutation.isPending}
                  className="p-0 h-auto text-blue-600 hover:text-blue-800"
                >
                  {sendOtpMutation.isPending ? "Sending..." : "Resend OTP"}
                </Button>
              </div>
              
              <div className="mt-6">
                <Button 
                  type="submit"
                  disabled={!otp || otp.length !== 6 || verifyOtpMutation.isPending}
                  className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-md transition-all duration-200 transform hover:scale-[1.01] py-6"
                >
                  {verifyOtpMutation.isPending ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Verifying OTP...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      <span>Verify & Continue</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
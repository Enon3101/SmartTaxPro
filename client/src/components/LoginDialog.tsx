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
import { FiPhone, FiLogIn } from "react-icons/fi";
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
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
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
      <DialogContent className="sm:max-w-[425px]" aria-describedby="login-dialog-description">
        <DialogHeader>
          <DialogTitle>
            {showAdminLogin 
              ? "Admin Login" 
              : (step === "phone" ? "Login with Mobile" : "Enter OTP")}
          </DialogTitle>
          <DialogDescription id="login-dialog-description">
            {showAdminLogin
              ? "Enter your admin credentials to access the admin panel."
              : (step === "phone"
                ? "Enter your mobile number to receive a one-time password."
                : "Enter the OTP sent to your mobile phone.")}
          </DialogDescription>
        </DialogHeader>

        {showAdminLogin ? (
          // Admin Login Form
          <form onSubmit={(e) => { e.preventDefault(); handleAdminLogin(); }}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="adminUsername" className="text-right">
                  Username
                </Label>
                <div className="col-span-3 relative">
                  <Input
                    id="adminUsername"
                    className="pl-9"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    placeholder="Admin username"
                    required
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="adminPassword" className="text-right">
                  Password
                </Label>
                <div className="col-span-3 relative">
                  <Input
                    id="adminPassword"
                    type="password"
                    className="pl-9"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Admin password"
                    required
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">
                Login as Admin
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full mt-2"
                onClick={() => setShowAdminLogin(false)}
              >
                Back to User Login
              </Button>
            </DialogFooter>
          </form>
        ) : step === "phone" ? (
          <form onSubmit={handleSendOtp}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Mobile
                </Label>
                <div className="col-span-3 relative">
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                      +91
                    </span>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        // Only allow digits and limit to 10 characters
                        const value = e.target.value.replace(/\D/g, '').substring(0, 10);
                        setPhone(value);
                      }}
                      className="rounded-l-none"
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
            <DialogFooter>
              <Button
                type="submit"
                disabled={sendOtpMutation.isPending}
                className="w-full"
              >
                {sendOtpMutation.isPending ? "Sending..." : "Get OTP"}
                <FiPhone className="ml-2 h-4 w-4" />
              </Button>
              
              {/* Alternative login methods */}
              <div className="w-full mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex flex-col gap-2">
                  {/* Google Login */}
                  <div className="w-full">
                    <GoogleLoginButton 
                      size="large"
                      theme="outline"
                      text="signin_with"
                      width="100%"
                    />
                  </div>
                  
                  {/* Admin Login (Development only) */}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleAdminLoginClick}
                  >
                    <FiLogIn className="mr-2 h-4 w-4" /> Admin Login (Dev Only)
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="otp" className="text-right">
                  OTP
                </Label>
                <div className="col-span-3 relative">
                  <Input
                    id="otp"
                    className="pl-9"
                    value={otp}
                    onChange={(e) => {
                      // Only allow digits and limit to 6 characters
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
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="M8 11h.01M12 11h.01M16 11h.01" />
                    </svg>
                  </div>
                </div>
              </div>
              {otp && otp.length > 0 && otp.length < 6 && (
                <div className="col-span-4 text-center text-xs text-red-600 mt-1">
                  Please enter all 6 digits of the OTP
                </div>
              )}
              <div className="col-span-4 text-center text-sm">
                <Button
                  variant="link"
                  type="button"
                  onClick={() => {
                    setStep("phone");
                    setOtp("");
                  }}
                  className="text-sm p-0 h-auto"
                >
                  Change phone number
                </Button>
                <span className="px-2">•</span>
                <Button
                  variant="link"
                  type="button"
                  onClick={() => sendOtpMutation.mutate()}
                  disabled={sendOtpMutation.isPending}
                  className="text-sm p-0 h-auto"
                >
                  {sendOtpMutation.isPending ? "Sending..." : "Resend OTP"}
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={verifyOtpMutation.isPending}
                className="w-full"
              >
                {verifyOtpMutation.isPending ? "Verifying..." : "Verify & Login"}
              </Button>
              
              {/* Alternative login methods */}
              <div className="w-full mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex flex-col gap-2">
                  {/* Google Login */}
                  <div className="w-full">
                    <GoogleLoginButton 
                      size="large"
                      theme="outline"
                      text="signin_with"
                      width="100%"
                    />
                  </div>
                  
                  {/* Admin Login (Development only) */}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleAdminLoginClick}
                  >
                    <FiLogIn className="mr-2 h-4 w-4" /> Admin Login (Dev Only)
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
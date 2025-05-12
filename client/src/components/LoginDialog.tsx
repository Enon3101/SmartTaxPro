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
import { queryClient, apiRequest } from "@/lib/queryClient";
import { FiPhone, FiLogIn } from "react-icons/fi";

interface LoginDialogProps {
  onLoginSuccess?: (user: any) => void;
  buttonText?: string;
  buttonVariant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary";
  className?: string;
  onOpenChange?: (open: boolean) => void;
}

export function LoginDialog({
  onLoginSuccess,
  buttonText = "Login",
  buttonVariant = "default",
  className,
  onOpenChange,
}: LoginDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const { toast } = useToast();

  interface SendOtpResponse {
    message: string;
    phone: string;
    otp?: string;
  }

  // Send OTP mutation
  const sendOtpMutation = useMutation({
    mutationFn: async () => {
      return apiRequest<SendOtpResponse>("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      });
    },
    onSuccess: (data) => {
      setStep("otp");
      toast({
        title: "OTP Sent",
        description: "Check your phone for the OTP code",
      });
      
      // For development, auto-fill OTP if provided in response
      if (data.otp) {
        setOtp(data.otp);
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to send OTP",
        variant: "destructive",
      });
    },
  });

  interface VerifyOtpResponse {
    message: string;
    user: {
      id: number;
      username: string;
      phone: string;
      role: string;
    };
  }

  // Verify OTP mutation
  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      return apiRequest<VerifyOtpResponse>("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, otp }),
      });
    },
    onSuccess: (data: VerifyOtpResponse) => {
      toast({
        title: "Login Successful",
        description: "You are now logged in",
      });
      
      // Set user in localStorage for persistent login
      if (data.user) {
        localStorage.setItem("taxUser", JSON.stringify(data.user));
        
        // Invalidate queries that might depend on auth status
        queryClient.invalidateQueries();
        
        // Call the onLoginSuccess callback if provided
        if (onLoginSuccess) {
          onLoginSuccess(data.user);
        }
      }
      
      // Close the dialog
      setIsOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Invalid OTP",
        variant: "destructive",
      });
    },
  });

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }
    
    sendOtpMutation.mutate();
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      toast({
        title: "Invalid Input",
        description: "Please enter the OTP sent to your phone",
        variant: "destructive",
      });
      return;
    }
    
    verifyOtpMutation.mutate();
  };

  const resetForm = () => {
    setPhone("");
    setOtp("");
    setStep("phone");
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset form when dialog is closed
      resetForm();
    }
    // Also call the external onOpenChange callback if provided
    if (onOpenChange) {
      onOpenChange(open);
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {step === "phone" ? "Login with Mobile" : "Enter OTP"}
          </DialogTitle>
          <DialogDescription>
            {step === "phone"
              ? "Enter your mobile number to receive a one-time password."
              : "Enter the OTP sent to your mobile phone."}
          </DialogDescription>
        </DialogHeader>

        {step === "phone" ? (
          <form onSubmit={handleSendOtp}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Mobile
                </Label>
                <div className="col-span-3 flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                    +91
                  </span>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="rounded-l-none"
                    placeholder="10-digit mobile number"
                    autoComplete="tel"
                    required
                  />
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
              
              {/* TEMPORARY: Admin login for development only */}
              <div className="w-full mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={async () => {
                    try {
                      const response = await apiRequest("/api/auth/dev-admin-login", {
                        method: "POST",
                      });
                      
                      if (response && response.user) {
                        if (onLoginSuccess) {
                          onLoginSuccess(response.user);
                        }
                        setIsOpen(false);
                        toast({
                          title: "Admin Login Successful",
                          description: "You are now logged in as Admin",
                        });
                      }
                    } catch (error) {
                      toast({
                        title: "Admin Login Failed",
                        description: "Could not log in as admin",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  <FiLogIn className="mr-2 h-4 w-4" /> Admin Login (Dev Only)
                </Button>
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
                <Input
                  id="otp"
                  className="col-span-3"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  maxLength={6}
                  required
                />
              </div>
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
              
              {/* TEMPORARY: Admin login for development only */}
              <div className="w-full mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={async () => {
                    try {
                      const response = await apiRequest("/api/auth/dev-admin-login", {
                        method: "POST",
                      });
                      
                      if (response && response.user) {
                        if (onLoginSuccess) {
                          onLoginSuccess(response.user);
                        }
                        setIsOpen(false);
                        toast({
                          title: "Admin Login Successful",
                          description: "You are now logged in as Admin",
                        });
                      }
                    } catch (error) {
                      toast({
                        title: "Admin Login Failed",
                        description: "Could not log in as admin",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  <FiLogIn className="mr-2 h-4 w-4" /> Admin Login (Dev Only)
                </Button>
              </div>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
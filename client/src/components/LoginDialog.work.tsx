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
}

export default function LoginDialog({
  onLoginSuccess,
  buttonText = "Login",
  buttonVariant = "default",
  className = "",
}: LoginDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
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
    },
    onSuccess: (data) => {
      toast({
        title: "Login Successful",
        description: "You have been logged in successfully",
      });
      
      if (onLoginSuccess) {
        onLoginSuccess(data.user);
      }
      
      setIsOpen(false);
      
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
    verifyOtpMutation.mutate();
  };

  const handleAdminLogin = async () => {
    try {
      const response = await fetch("/api/auth/dev-admin-login", {
        method: "POST",
        credentials: "include"
      });
      
      if (!response.ok) {
        throw new Error("Admin login failed");
      }
      
      const data = await response.json();
      if (data.user) {
        if (onLoginSuccess) {
          onLoginSuccess(data.user);
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
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                    onClick={handleAdminLogin}
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
                    onClick={handleAdminLogin}
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

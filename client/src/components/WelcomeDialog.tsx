import { motion } from "framer-motion";
import { 
  FileText, 
  User, 
  Calculator, 
  Clock, 
  FileQuestion, 
  ChevronRight 
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface WelcomeDialogProps {
  user: {
    username: string;
    firstName?: string;
    lastName?: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function WelcomeDialog({ user, open, onOpenChange }: WelcomeDialogProps) {
  const [, navigate] = useLocation();
  
  // Get the appropriate greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };
  
  // Get the name to display (first name, full name, or username)
  const getDisplayName = () => {
    if (user.firstName) {
      return user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName;
    }
    return user.username;
  };
  
  // Quick actions that will be displayed to the user
  const quickActions = [
    {
      id: 'start-filing',
      title: 'Start Filing ITR',
      description: 'Begin your income tax return for 2026-27',
      icon: <FileText className="h-10 w-10 text-blue-500" />,
      onClick: () => {
        navigate('/itr-wizard');
        onOpenChange(false);
      }
    },
    {
      id: 'view-profile',
      title: 'Your Profile',
      description: 'View and update your personal information',
      icon: <User className="h-10 w-10 text-green-500" />,
      onClick: () => {
        navigate('/profile');
        onOpenChange(false);
      }
    },
    {
      id: 'calculate-tax',
      title: 'Tax Calculator',
      description: 'Estimate your tax liability for this year',
      icon: <Calculator className="h-10 w-10 text-orange-500" />,
      onClick: () => {
        navigate('/calculators/income-tax');
        onOpenChange(false);
      }
    },
    {
      id: 'tax-expert',
      title: 'Ask Tax Expert',
      description: 'Get answers to your tax-related queries',
      icon: <FileQuestion className="h-10 w-10 text-purple-500" />,
      onClick: () => {
        navigate('/tax-expert');
        onOpenChange(false);
      }
    }
  ];
  
  // Auto close after some time
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onOpenChange(false);
      }, 30000); // Close after 30 seconds
      
      return () => clearTimeout(timer);
    }
  }, [open, onOpenChange]);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden border-0 shadow-2xl rounded-xl">
        <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
          <DialogTitle className="text-2xl font-bold tracking-tight">
            {getGreeting()}, {getDisplayName()}!
          </DialogTitle>
          <DialogDescription className="text-blue-100 opacity-90">
            Welcome to TaxEasy - Your intelligent tax filing assistant
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">What would you like to do today?</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <motion.div
                  key={action.id}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  onClick={action.onClick}
                  className="flex items-start space-x-4 p-4 rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300 hover:bg-blue-50/50"
                >
                  <div className="mt-1">{action.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{action.title}</h4>
                    <p className="text-sm text-gray-500">{action.description}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </motion.div>
              ))}
            </div>
            
            <div className="mt-6 bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-blue-500" />
                <h4 className="font-medium text-blue-700">Recent Activity</h4>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                You haven't performed any actions yet. Your recent activities will appear here.
              </p>
            </div>
          </div>
        </div>
        
        <DialogFooter className="bg-gray-50 px-6 py-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={() => {
            navigate('/itr-wizard');
            onOpenChange(false);
          }}>
            Start Filing Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
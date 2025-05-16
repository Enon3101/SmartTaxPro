import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  User, 
  Calculator, 
  TrendingUp, 
  Clock, 
  FileQuestion, 
  Briefcase,
  ChevronRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

interface WelcomeUserProps {
  user: {
    username: string;
    firstName?: string;
    lastName?: string;
    role?: string;
  };
  onClose?: () => void;
}

export default function WelcomeUser({ user, onClose }: WelcomeUserProps) {
  const [showWelcome, setShowWelcome] = useState(true);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
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
      onClick: () => setLocation('/itr-wizard')
    },
    {
      id: 'view-profile',
      title: 'Your Profile',
      description: 'View and update your personal information',
      icon: <User className="h-10 w-10 text-green-500" />,
      onClick: () => setLocation('/profile')
    },
    {
      id: 'calculate-tax',
      title: 'Tax Calculator',
      description: 'Estimate your tax liability for this year',
      icon: <Calculator className="h-10 w-10 text-orange-500" />,
      onClick: () => setLocation('/calculators/income-tax')
    },
    {
      id: 'tax-expert',
      title: 'Ask Tax Expert',
      description: 'Get answers to your tax-related queries',
      icon: <FileQuestion className="h-10 w-10 text-purple-500" />,
      onClick: () => setLocation('/tax-expert')
    }
  ];
  
  // Hide welcome screen after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, 30000); // Automatically close after 30 seconds
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  if (!showWelcome) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <Card className="w-full max-w-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
          <CardTitle className="text-2xl">
            {getGreeting()}, {getDisplayName()}!
          </CardTitle>
          <CardDescription className="text-blue-100">
            Welcome to TaxEasy - Your intelligent tax filing assistant
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
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
            
            <div className="mt-2 bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <h4 className="font-medium text-green-700">Filing Status</h4>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                You haven't started filing your tax return for assessment year 2026-27 yet.
              </p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between bg-gray-50 px-6 py-4">
          <Button variant="outline" onClick={() => setShowWelcome(false)}>
            Close
          </Button>
          <Button onClick={() => {
            setShowWelcome(false);
            setLocation('/itr-wizard');
          }}>
            Start Filing Now
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
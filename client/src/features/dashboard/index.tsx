import React from 'react';
import { Link } from 'wouter'; // For navigation links

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/features/auth/AuthContext'; // Assuming AuthContext provides user info


const Dashboard: React.FC = () => {
  const { user } = useAuth(); // Get user from AuthContext

  if (!user) {
    // This should ideally be handled by a protected route redirecting to login
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading user data or not authenticated...</p>
        <Link href="/login">
          <Button variant="link">Go to Login</Button>
        </Link>
      </div>
    );
  }

  // Determine user's name for display
  // user.email is not available in the User type from AuthContext
  const displayName = user.firstName || user.username || 'Valued User';

  return (
    <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6">
      {/* Welcome Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl sm:text-2xl font-bold text-blue-800 dark:text-blue-200">
            Welcome back, {displayName}!
          </CardTitle>
          <CardDescription className="text-blue-600 dark:text-blue-300">
            Here's an overview of your tax filing journey.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Main Grid - Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Filing Status Card */}
        <Card className="h-fit">
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">Filing Status</CardTitle>
            <CardDescription className="text-sm">Assessment Year: 2024-2025 (Placeholder)</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <p className="text-lg font-semibold text-blue-600">Not Filed Yet (Placeholder)</p>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Due date: July 31, 2025</p>
                <p>• Status: Pending</p>
                <p>• Form type: ITR-1 (Recommended)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card className="h-fit">
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <Button 
              className="w-full min-h-[48px] text-base font-medium touch-manipulation" 
              onClick={() => alert('Navigate to File New Return (Not Implemented)')}
            >
              File a New Return
            </Button>
            <Button 
              variant="outline" 
              className="w-full min-h-[48px] text-base font-medium touch-manipulation" 
              onClick={() => alert('Navigate to Upload Documents (Not Implemented)')}
            >
              Upload Documents
            </Button>
            <Button 
              variant="outline" 
              className="w-full min-h-[48px] text-base font-medium touch-manipulation" 
              onClick={() => alert('Navigate to Add Family Member (Not Implemented)')}
            >
              Add Family Member
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Pending Tasks Card */}
        <Card className="h-fit">
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">Pending Tasks & Reminders</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="text-sm">
                  <p className="font-medium text-orange-800 dark:text-orange-200">Upload Form-16</p>
                  <p className="text-orange-600 dark:text-orange-300">Autofill salary details (Placeholder)</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="text-sm">
                  <p className="font-medium text-blue-800 dark:text-blue-200">E-Verify Return</p>
                  <p className="text-blue-600 dark:text-blue-300">Complete last year's verification (Placeholder)</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="text-sm">
                  <p className="font-medium text-red-800 dark:text-red-200">Filing Deadline</p>
                  <p className="text-red-600 dark:text-red-300">July 31st approaching (Placeholder)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Articles/Tips Card */}
        <Card className="h-fit">
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">Tax Tips & News</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <Link href="/blog/sample-tip-1" className="block group">
                  <h4 className="font-medium text-blue-600 group-hover:text-blue-800 transition-colors">
                    5 Tips to Save Tax in 2025 (Placeholder)
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Learn about the latest tax-saving strategies...
                  </p>
                </Link>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4 py-2">
                <Link href="/blog/sample-tip-2" className="block group">
                  <h4 className="font-medium text-green-600 group-hover:text-green-800 transition-colors">
                    Understanding New Tax Regime Changes (Placeholder)
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Compare old vs new tax regime benefits...
                  </p>
                </Link>
              </div>
              
              <Button 
                variant="link" 
                className="px-0 h-auto text-sm font-medium mt-4" 
                onClick={() => alert('Navigate to Blog (Not Implemented)')}
              >
                View all articles →
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

import React from 'react';
import { Link } from 'wouter'; // For navigation links

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext'; // Assuming AuthContext provides user info


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
    <div className="container mx-auto px-4 py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Welcome back, {displayName}!</CardTitle>
          <CardDescription>Here's an overview of your tax filing journey.</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Filing Status Card */}
        <Card>
          <CardHeader>
            <CardTitle>Filing Status</CardTitle>
            <CardDescription>Assessment Year: 2024-2025 (Placeholder)</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-blue-600">Not Filed Yet (Placeholder)</p>
            {/* More details can be added here */}
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" onClick={() => alert('Navigate to File New Return (Not Implemented)')}>
              File a New Return
            </Button>
            <Button variant="outline" className="w-full" onClick={() => alert('Navigate to Upload Documents (Not Implemented)')}>
              Upload Documents
            </Button>
            <Button variant="outline" className="w-full" onClick={() => alert('Navigate to Add Family Member (Not Implemented)')}>
              Add Family Member
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Pending Tasks Card */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Tasks & Reminders</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Upload Form-16 to autofill salary details (Placeholder)</li>
              <li>E-Verify your last year’s return (Placeholder)</li>
              <li>Tax filing deadline: July 31st (Placeholder)</li>
            </ul>
          </CardContent>
        </Card>

        {/* Recent Articles/Tips Card */}
        <Card>
          <CardHeader>
            <CardTitle>Tax Tips & News</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/blog/sample-tip-1" className="text-blue-600 hover:underline">
                  5 Tips to Save Tax in 2025 (Placeholder)
                </Link>
              </li>
              <li>
                <Link href="/blog/sample-tip-2" className="text-blue-600 hover:underline">
                  Understanding New Tax Regime Changes (Placeholder)
                </Link>
              </li>
            </ul>
            <Button variant="link" className="mt-2 px-0" onClick={() => alert('Navigate to Blog (Not Implemented)')}>
              View all articles...
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

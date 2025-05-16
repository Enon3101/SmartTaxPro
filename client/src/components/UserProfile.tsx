import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { Skeleton } from '@/components/ui/skeleton';

interface UserProfileProps {
  userId?: number | string;
  token?: string;
  hideLogout?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId, token, hideLogout = false }) => {
  const { user: authUser, isAuthenticated, logout } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  useEffect(() => {
    // If we have a userId and token, fetch the user data
    if (userId && token) {
      setLoading(true);
      fetchUserById(userId, token);
    } else if (authUser) {
      // Otherwise use the authenticated user
      setUser(authUser);
    }
  }, [userId, token, authUser]);
  
  const fetchUserById = async (id: number | string, authToken: string) => {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        headers: {
          "Authorization": `Bearer ${authToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user:", error);
      toast({
        title: "Error",
        description: "Failed to load user data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast({
      title: 'Logged Out',
      description: 'You have been logged out successfully.'
    });
    setLocation('/');
  };

  // Show loading state
  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    );
  }
  
  // If user ID was provided but no user data found
  if (userId && !user) {
    return (
      <Card className="w-full max-w-md mx-auto bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-600">User Not Found</CardTitle>
          <CardDescription>The requested user profile could not be loaded.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Please check the user ID and try again, or contact support if this issue persists.</p>
        </CardContent>
      </Card>
    );
  }
  
  // If no user is provided or authenticated
  if (!userId && (!isAuthenticated || !user)) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Please Sign In</CardTitle>
          <CardDescription>You need to be logged in to view your profile</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4 py-6">
          <p className="text-center text-muted-foreground">Sign in to access your profile, view your tax forms, and manage your account.</p>
          <div className="flex gap-4">
            <Button 
              onClick={() => setLocation('/login')}
              variant="default"
            >
              Sign In
            </Button>
            <Button 
              onClick={() => setLocation('/register')}
              variant="outline"
            >
              Create Account
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get initials for avatar fallback
  const getInitials = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    } else if (user.firstName) {
      return user.firstName.charAt(0);
    } else if (user.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4 pb-2 border-b">
        <Avatar className="h-16 w-16 border-2 border-primary/20">
          {user.profileImageUrl && (
            <AvatarImage src={user.profileImageUrl} alt={user.username} />
          )}
          <AvatarFallback className="text-xl bg-primary/10 text-primary">{getInitials()}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-xl text-primary">
            {user.firstName ? `${user.firstName} ${user.lastName || ''}` : user.username}
          </CardTitle>
          <CardDescription className="flex items-center gap-1">
            {user.email}
            {user.googleId && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full inline-flex items-center ml-2">
                Google
              </span>
            )}
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="py-4">
        <div className="grid grid-cols-3 gap-y-3 gap-x-4">
          <div className="col-span-1 text-muted-foreground text-sm">PAN</div>
          <div className="col-span-2 font-medium">
            {user.panNumber ? user.panNumber : 
             <span className="text-muted-foreground italic text-sm">Not added</span>}
          </div>
          
          <div className="col-span-1 text-muted-foreground text-sm">Phone</div>
          <div className="col-span-2 font-medium">
            {user.phone ? user.phone : 
             <span className="text-muted-foreground italic text-sm">Not added</span>}
          </div>
          
          <div className="col-span-1 text-muted-foreground text-sm">Account Type</div>
          <div className="col-span-2 font-medium">
            {user.googleId ? 'Google Account' : 'Standard Account'}
          </div>
          
          {user.role && (
            <>
              <div className="col-span-1 text-muted-foreground text-sm">Role</div>
              <div className="col-span-2">
                <span className={`capitalize px-2 py-0.5 rounded-full text-xs font-medium ${
                  user.role === 'admin' ? 'bg-red-100 text-red-800' : 
                  user.role === 'tax_expert' ? 'bg-amber-100 text-amber-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {user.role}
                </span>
              </div>
            </>
          )}
          
          <div className="col-span-1 text-muted-foreground text-sm">Member Since</div>
          <div className="col-span-2 font-medium">
            {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }) : 'N/A'}
          </div>
        </div>
      </CardContent>
      
      {!hideLogout && (
        <CardFooter className="border-t pt-4 flex gap-2">
          <Button 
            onClick={() => setLocation('/start-filing')} 
            className="flex-1"
          >
            File Taxes
          </Button>
          <Button 
            onClick={handleLogout} 
            variant="outline" 
            className="flex-1"
          >
            Sign Out
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default UserProfile;
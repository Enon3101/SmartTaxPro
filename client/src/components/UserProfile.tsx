import React, { useState, useEffect } from 'react';
import useGoogleAuth from '@/hooks/useGoogleAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';

interface UserProfileProps {
  userId?: number | string;
  token?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId, token }) => {
  const { user: authUser, isAuthenticated, logout } = useGoogleAuth();
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
      <div className="p-4 flex flex-col items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <p className="mt-2 text-sm text-muted-foreground">Loading user data...</p>
      </div>
    );
  }
  
  // If user ID was provided but no user data found
  if (userId && !user) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">User not found or data could not be loaded.</p>
      </div>
    );
  }
  
  // If no user is provided or authenticated
  if (!userId && (!isAuthenticated || !user)) {
    return (
      <div className="p-4">
        <p>You are not logged in.</p>
        <Button 
          onClick={() => setLocation('/login')}
          className="mt-2"
        >
          Login
        </Button>
      </div>
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
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="h-16 w-16">
          {user.profileImageUrl && (
            <AvatarImage src={user.profileImageUrl} alt={user.username} />
          )}
          <AvatarFallback className="text-xl">{getInitials()}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{user.firstName ? `${user.firstName} ${user.lastName || ''}` : user.username}</CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-2 gap-1">
          <span className="text-muted-foreground">Username:</span>
          <span>{user.username}</span>
          
          {user.email && (
            <>
              <span className="text-muted-foreground">Email:</span>
              <span>{user.email}</span>
            </>
          )}
          
          <span className="text-muted-foreground">Account Type:</span>
          <span>{user.googleId ? 'Google Account' : 'Standard Account'}</span>
          
          <span className="text-muted-foreground">Role:</span>
          <span className="capitalize">{user.role}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleLogout} variant="outline" className="w-full">
          Logout
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UserProfile;
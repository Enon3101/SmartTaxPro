import React from 'react';
import useGoogleAuth from '@/hooks/useGoogleAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';

const UserProfile: React.FC = () => {
  const { user, isAuthenticated, logout } = useGoogleAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleLogout = async () => {
    await logout();
    toast({
      title: 'Logged Out',
      description: 'You have been logged out successfully.'
    });
    setLocation('/');
  };

  if (!isAuthenticated || !user) {
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
import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useToast } from "@/hooks/use-toast";

interface GoogleLoginButtonProps {
  onSuccess?: (credentialResponse: any) => void;
  onError?: () => void;
  text?: string;
  shape?: 'rectangular' | 'pill' | 'circle' | 'square';
  size?: 'large' | 'medium' | 'small';
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  width?: string;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  onSuccess,
  onError,
  text = 'signin_with',
  shape = 'rectangular',
  size = 'large',
  theme = 'filled_blue',
  width = '100%',
}) => {
  const { toast } = useToast();

  const handleSuccess = (credentialResponse: any) => {
    // Call the parent component's onSuccess handler if provided
    if (onSuccess) {
      onSuccess(credentialResponse);
    } else {
      // Default success handler
      handleGoogleLogin(credentialResponse);
    }
  };

  const handleError = () => {
    toast({
      title: "Google Sign-In Failed",
      description: "An error occurred during Google sign-in. Please try again.",
      variant: "destructive",
    });

    // Call the parent component's onError handler if provided
    if (onError) {
      onError();
    }
  };

  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential: credentialResponse.credential,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Google authentication failed');
      }

      // Store the authentication data
      localStorage.setItem('authToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      toast({
        title: "Sign-In Successful",
        description: "You have successfully signed in with Google.",
      });

      // Redirect to home or dashboard
      window.location.href = '/';
    } catch (error) {
      console.error('Google authentication error:', error);
      toast({
        title: "Authentication Failed",
        description: error instanceof Error ? error.message : "Failed to authenticate with Google",
        variant: "destructive",
      });
    }
  };

  return (
    <div style={{ width }}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        text={text as "signin_with" | "continue_with" | "signup_with" | "signin" | undefined}
        shape={shape}
        size={size}
        theme={theme}
        useOneTap
      />
    </div>
  );
};

export default GoogleLoginButton;
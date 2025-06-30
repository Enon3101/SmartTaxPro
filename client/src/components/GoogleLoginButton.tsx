import { useGoogleLogin, GoogleLogin } from '@react-oauth/google';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';

import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';


interface GoogleLoginButtonProps {
  text?: 'signin_with' | 'signup_with' | 'continue_with';
  size?: 'medium' | 'large';
  shape?: 'rectangular' | 'pill' | 'circle' | 'square';
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  width?: string;
  onLoginSuccess?: (user: any) => void;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  text = 'signin_with',
  size = 'large',
  shape = 'rectangular',
  theme = 'filled_blue',
  width = 'auto',
  onLoginSuccess
}) => {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [renderMode, setRenderMode] = useState<'default' | 'fallback'>('default');
  
  useEffect(() => {
    // Always use the fallback button for now as we're having issues with the Google API
    console.log("Using fallback Google login button");
    setRenderMode('fallback');
    
    // This code is kept but commented out in case we want to revert to checking Google API
    /*
    const timer = setTimeout(() => {
      console.log("Checking if Google API is available...");
      if (!(window as any).google) {
        console.warn("Google API not available, using fallback button");
        setRenderMode('fallback');
      }
    }, 2000);
    
    return () => clearTimeout(timer);
    */
  }, []);
  
  // Handle Google Login success
  const handleSuccess = async (credentialResponse: any) => {
    try {
      console.log("Google login success:", credentialResponse);
      
      // Get the token - either credential (from GoogleLogin component) or access_token (from useGoogleLogin hook)
      const credential = credentialResponse.credential || credentialResponse.access_token;
      const tokenType = credentialResponse.credential ? 'id_token' : credentialResponse.token_type || 'Bearer';
      
      if (!credential) {
        throw new Error("No credential received from Google");
      }
      
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        body: JSON.stringify({
          credential,
          token_type: tokenType
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Google authentication failed');
      }
      
      const data = await response.json();
      
      // Save auth data to localStorage
      localStorage.setItem('authToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      toast({
        title: "Login Successful",
        description: "You have been logged in with Google successfully",
      });
      
      // Call login success callback if provided
      if (onLoginSuccess) {
        onLoginSuccess(data.user);
      }
      
      // Redirect to home
      setLocation('/');
    } catch (error) {
      console.error('Google auth error:', error);
      toast({
        title: "Google Sign-In Failed",
        description: error instanceof Error ? error.message : "Failed to sign in with Google",
        variant: "destructive",
      });
    }
  };
  
  // For direct Google login integration
  const handleGoogleLogin = useGoogleLogin({
    scope: 'openid email profile',
    onSuccess: handleSuccess,
    onError: (errorResponse) => {
      console.error('Google login error:', errorResponse);
      toast({
        title: "Google Sign-In Failed",
        description: "Failed to sign in with Google. Please try again.",
        variant: "destructive",
      });
    },
    flow: 'implicit'
  });
  
  // For Google hosted login button
  if (renderMode === 'default') {
    return (
      <div style={{ width, display: 'flex', justifyContent: 'center' }}>
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => {
            console.error('Google login failed');
            toast({
              title: "Google Sign-In Failed",
              description: "Failed to sign in with Google. Please try again.",
              variant: "destructive",
            });
          }}
          useOneTap
          theme="filled_blue"
          text={text}
          size="large"
          width={width === 'auto' ? undefined : width}
        />
      </div>
    );
  }
  
  // Modern, enhanced fallback button if Google API doesn't load properly
  return (
    <button
      onClick={() => handleGoogleLogin()}
      className={`flex items-center justify-center gap-3 px-4 py-3 border transition-all duration-300 transform hover:scale-[1.02] shadow-md ${
        theme === 'outline' 
          ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50' 
          : theme === 'filled_black'
            ? 'bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white border-transparent'
            : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white border-transparent'
      } ${
        size === 'large' ? 'text-base py-4' : 'text-sm py-3'
      } ${
        shape === 'pill' ? 'rounded-full' : 
        shape === 'square' ? 'rounded-sm' :
        shape === 'circle' ? 'rounded-full aspect-square p-0 justify-center' : 
        'rounded-lg'
      }`}
      style={{ width: width }}
      type="button"
      aria-label="Sign in with Google"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 48 48" 
        width={size === 'large' ? '28' : '22'} 
        height={size === 'large' ? '28' : '22'}
        className="flex-shrink-0"
      >
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
      </svg>

      {shape !== 'circle' && (
        <span className="font-medium">
          {text === 'signin_with' && "Sign in with Google"}
          {text === 'signup_with' && "Sign up with Google"}
          {text === 'continue_with' && "Continue with Google"}
        </span>
      )}
    </button>
  );
};

export default GoogleLoginButton;
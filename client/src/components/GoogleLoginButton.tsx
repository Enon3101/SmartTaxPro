import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';

interface GoogleLoginButtonProps {
  text?: 'signin_with' | 'signup_with' | 'continue_with';
  size?: 'medium' | 'large';
  shape?: 'rectangular' | 'pill' | 'circle' | 'square';
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  width?: string;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  text = 'signin_with',
  size = 'large',
  shape = 'rectangular',
  theme = 'filled_blue',
  width = 'auto'
}) => {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        // Exchange the code for tokens on your backend
        const response = await apiRequest('POST', '/api/auth/google', {
          body: JSON.stringify({
            credential: codeResponse.access_token
          }),
          headers: {
            'Content-Type': 'application/json'
          }
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
    },
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
  
  return (
    <button
      onClick={() => handleGoogleLogin()}
      className={`flex items-center justify-center gap-2 px-4 py-2 border rounded-md ${
        theme === 'outline' 
          ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50' 
          : theme === 'filled_black'
            ? 'border-gray-800 bg-gray-800 text-white hover:bg-gray-700'
            : 'border-blue-600 bg-blue-600 text-white hover:bg-blue-500'
      } ${
        size === 'large' ? 'text-base py-2.5' : 'text-sm'
      } ${
        shape === 'pill' ? 'rounded-full' : 
        shape === 'square' ? 'rounded-sm' :
        shape === 'circle' ? 'rounded-full aspect-square p-0 justify-center' : 
        'rounded-md'
      }`}
      style={{ width: width }}
      type="button"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 48 48" 
        width={size === 'large' ? '24' : '20'} 
        height={size === 'large' ? '24' : '20'}
      >
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
      </svg>

      {shape !== 'circle' && (
        <span>
          {text === 'signin_with' && "Sign in with Google"}
          {text === 'signup_with' && "Sign up with Google"}
          {text === 'continue_with' && "Continue with Google"}
        </span>
      )}
    </button>
  );
};

export default GoogleLoginButton;
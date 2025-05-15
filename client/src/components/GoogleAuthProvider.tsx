import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

interface GoogleAuthContextType {
  isInitialized: boolean;
}

const GoogleAuthContext = createContext<GoogleAuthContextType>({
  isInitialized: false,
});

export const useGoogleAuth = () => useContext(GoogleAuthContext);

interface GoogleAuthProviderProps {
  children: ReactNode;
}

const GoogleAuthProvider: React.FC<GoogleAuthProviderProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if Google API is loaded successfully
    if (import.meta.env.VITE_GOOGLE_CLIENT_ID) {
      setIsInitialized(true);
    } else {
      console.warn('Google Client ID not found. Google authentication will not work.');
    }
  }, []);

  return (
    <GoogleAuthContext.Provider value={{ isInitialized }}>
      {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          {children}
        </GoogleOAuthProvider>
      ) : (
        // Render children even if Google auth is not configured
        // This allows the app to function without Google Sign-In
        children
      )}
    </GoogleAuthContext.Provider>
  );
};

export default GoogleAuthProvider;
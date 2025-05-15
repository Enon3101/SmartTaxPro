import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

interface GoogleAuthContextType {
  isInitialized: boolean;
  clientId: string | null;
}

const GoogleAuthContext = createContext<GoogleAuthContextType>({
  isInitialized: false,
  clientId: null
});

export const useGoogleAuth = () => useContext(GoogleAuthContext);

interface GoogleAuthProviderProps {
  children: ReactNode;
}

const GoogleAuthProvider: React.FC<GoogleAuthProviderProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [clientId, setClientId] = useState<string | null>(null);
  
  useEffect(() => {
    // Check if Google API is loaded successfully
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (googleClientId) {
      console.log("GoogleAuthProvider: Google Client ID is available");
      setClientId(googleClientId);
      setIsInitialized(true);
    } else {
      console.warn('GoogleAuthProvider: Google Client ID not found. Google authentication will not work.');
    }
  }, []);

  return (
    <GoogleAuthContext.Provider value={{ isInitialized, clientId }}>
      {clientId ? (
        <GoogleOAuthProvider clientId={clientId}>
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
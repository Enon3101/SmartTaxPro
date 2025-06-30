import { GoogleOAuthProvider } from '@react-oauth/google';
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

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
    // First try to get VITE_GOOGLE_CLIENT_ID from environment
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    
    // If that's not available, fetch it from the server which has access to the regular environment variables
    if (!googleClientId) {
      fetch('/api/config/google-client-id')
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Failed to get Google Client ID');
        })
        .then(data => {
          if (data.clientId) {
            console.log("GoogleAuthProvider: Google Client ID retrieved from server");
            setClientId(data.clientId);
            setIsInitialized(true);
          } else {
            console.warn('GoogleAuthProvider: Server did not return a valid Google Client ID');
          }
        })
        .catch(error => {
          console.warn('GoogleAuthProvider: Failed to retrieve Google Client ID from server', error);
        });
    } else {
      console.log("GoogleAuthProvider: Google Client ID is available from environment");
      setClientId(googleClientId);
      setIsInitialized(true);
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
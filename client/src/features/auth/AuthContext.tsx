import { useQuery } from "@tanstack/react-query";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

import WelcomeUser from "@/components/WelcomeUser";
import { apiRequest } from "@/lib/queryClient";

interface User {
  id: number;
  username: string;
  phone?: string;
  role: string;
  firstName?: string;
  lastName?: string;
}

interface AuthResponseData {
  user: User;
  accessToken: string;
  refreshToken: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean; // This will reflect session validation loading
  isAuthenticated: boolean;
  login: (authData: AuthResponseData) => void; // Updated signature
  logout: () => void;
  showWelcome: boolean;
  setShowWelcome: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  showWelcome: false,
  setShowWelcome: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem("authToken"));

  // Effect to update authToken state if localStorage changes (e.g. from another tab, though less common for auth tokens)
  useEffect(() => {
    const handleStorageChange = () => {
      setAuthToken(localStorage.getItem("authToken"));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  // Try to load user from localStorage on initial mount if authToken exists
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("taxUser");
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as User;
        // Basic validation
        if (parsedUser && parsedUser.id && parsedUser.username && parsedUser.role) {
          setUser(parsedUser);
          setAuthToken(token);
        } else {
          // Invalid stored user, clear everything
          localStorage.removeItem("taxUser");
          localStorage.removeItem("authToken");
          localStorage.removeItem("refreshToken");
          setAuthToken(null);
        }
      } catch (error) {
        console.error("Error parsing stored user on initial load:", error);
        localStorage.removeItem("taxUser");
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        setAuthToken(null);
      }
    }
  }, []);

  // Validate the user session with the server if an auth token exists
  const { 
    data: sessionUser, 
    isLoading, 
    isError, 
    error: sessionError, 
    isSuccess 
  } = useQuery<User | null, Error, User | null, [string]>({ // Updated types
    queryKey: ["currentUser"], // Simpler key, re-fetches if queryClient invalidates it
    queryFn: async (): Promise<User | null> => {
      const currentToken = localStorage.getItem("authToken"); // Get fresh token
      if (!currentToken) return null;

      // apiRequest should be configured to automatically send the authToken
      // If not, headers must be set manually here.
      const response = await apiRequest("GET", "/api/auth/user"); // No userId needed
      
      if (!response.ok) {
        // If token is invalid (e.g. expired, server returns 401), this will throw
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `User validation failed: ${response.status}`);
      }
      
      const data: User = await response.json();
      return data;
    },
    enabled: !!authToken, // Query enabled only if authToken exists
    retry: (failureCount, error) => {
      // Don't retry on 401/403 errors, as token is likely invalid
      if (error.message.includes("401") || error.message.includes("403")) {
        return false;
      }
      return failureCount < 2; // Retry other errors (e.g. network) twice
    },
  });

  useEffect(() => {
    if (isSuccess && sessionUser) {
      setUser(sessionUser); // Update user with fresh data from server
      localStorage.setItem("taxUser", JSON.stringify(sessionUser)); // Keep localStorage in sync
    }
  }, [isSuccess, sessionUser]);

  useEffect(() => {
    if (isError) {
      console.error("Session validation error:", sessionError?.message);
      logout(); // If session validation fails (e.g. token expired), log out
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError, sessionError]); // logout is stable

  const login = (authData: AuthResponseData) => {
    setUser(authData.user);
    localStorage.setItem("taxUser", JSON.stringify(authData.user));
    localStorage.setItem("authToken", authData.accessToken);
    localStorage.setItem("refreshToken", authData.refreshToken);
    setAuthToken(authData.accessToken); // Update state for query re-trigger
    setShowWelcome(true);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("taxUser");
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    setAuthToken(null); // Update state for query re-trigger
    setShowWelcome(false);
    // Optionally, redirect to login page or home page
    // window.location.href = '/login'; // Or use wouter's setLocation
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        showWelcome,
        setShowWelcome
      }}
    >
      {children}
      {user && showWelcome && (
        <WelcomeUser user={user} onClose={() => setShowWelcome(false)} />
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

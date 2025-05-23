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

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (userData: User) => void;
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
  
  // Try to get stored user from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("taxUser");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Validate the structure of the parsed user object
        if (
          parsedUser &&
          typeof parsedUser.id === "number" &&
          typeof parsedUser.username === "string" &&
          typeof parsedUser.role === "string" 
          // Add checks for other non-optional fields if necessary
        ) {
          setUser(parsedUser as User);
        } else {
          console.error(
            "Invalid user data found in localStorage. Clearing data:",
            parsedUser
          );
          localStorage.removeItem("taxUser");
        }
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("taxUser");
      }
    }
  }, []);
  
  interface UserResponse {
    id: number;
    username: string;
    phone?: string;
    role: string;
  }

  // Validate the user session if we have a stored user
  const { 
    data: sessionData, 
    isLoading, 
    isError, 
    error: sessionError, 
    isSuccess 
  } = useQuery<
    UserResponse | null,      // TQueryFnData: Type returned by queryFn
    Error,                    // TError: Type of error
    UserResponse | null,      // TData: Type of the data property
    [string, number | undefined] // TQueryKey: Type of the queryKey
  >({
    queryKey: ["user", user?.id],
    queryFn: async (): Promise<UserResponse | null> => {
      if (!user?.id) return null;
      
      // Assuming apiRequest returns a Promise that resolves to a standard Response object
      // based on the TypeScript error.
      const response: Response = await apiRequest("GET", `/api/auth/me?userId=${user.id}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`User validation failed: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      const data: UserResponse = await response.json();
      return data;
    },
    enabled: !!user?.id,
    retry: false,
    // onSuccess and onError are handled by useEffect below
  });

  useEffect(() => {
    if (isSuccess && sessionData) {
      // Update user data. UserResponse is compatible with User.
      setUser(sessionData as User);
    }
  }, [isSuccess, sessionData]); // Removed setUser from deps as it's from useState and stable

  useEffect(() => {
    if (isError) {
      console.error("Session validation error:", sessionError);
      // If validation fails, log out
      logout();
    }
  }, [isError, sessionError]); // Removed logout from deps as it's stable

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("taxUser", JSON.stringify(userData));
    // Show welcome screen on successful login
    setShowWelcome(true);
  };

  const logout = () => {
    setUser(null);
    setShowWelcome(false);
    localStorage.removeItem("taxUser");
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

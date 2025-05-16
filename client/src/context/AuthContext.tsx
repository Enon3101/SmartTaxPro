import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import WelcomeUser from "@/components/WelcomeUser";

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
        setUser(parsedUser);
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
  const { isLoading } = useQuery({
    queryKey: ["user", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      return apiRequest<UserResponse>("GET", `/api/auth/me?userId=${user.id}`);
    },
    enabled: !!user?.id,
    retry: false,
    onSuccess: (data: UserResponse | null) => {
      if (data) {
        // Update user data
        setUser(data);
      }
    },
    onError: () => {
      // If validation fails, log out
      logout();
    },
  } as any);

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
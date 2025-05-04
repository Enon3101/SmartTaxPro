import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface User {
  id: number;
  username: string;
  phone?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  
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
      return apiRequest<UserResponse>(`/api/auth/me?userId=${user.id}`);
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
  };

  const logout = () => {
    setUser(null);
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
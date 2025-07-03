import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  roles: Array<{
    role: {
      name: string;
    };
  }>;
  permissions: Array<{
    name: string;
    resource: string;
    action: string;
  }>;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    username?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  checkAuth: () => Promise<void>;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
}

// Configure axios defaults
axios.defaults.baseURL = '/api';
axios.defaults.withCredentials = true;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await axios.post('/auth/login', { email, password });
          const { user, accessToken } = response.data;
          
          set({
            user,
            accessToken,
            isAuthenticated: true,
            isLoading: false,
          });

          // Set axios authorization header
          axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          const response = await axios.post('/auth/register', data);
          const { user, accessToken } = response.data;
          
          set({
            user,
            accessToken,
            isAuthenticated: true,
            isLoading: false,
          });

          // Set axios authorization header
          axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await axios.post('/auth/logout');
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
          });
          
          // Remove authorization header
          delete axios.defaults.headers.common['Authorization'];
        }
      },

      refreshToken: async () => {
        try {
          const response = await axios.post('/auth/refresh');
          const { accessToken } = response.data;
          
          set({ accessToken });
          
          // Update axios authorization header
          axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        } catch (error) {
          // If refresh fails, logout
          get().logout();
          throw error;
        }
      },

      checkAuth: async () => {
        const token = get().accessToken;
        if (!token) {
          set({ isAuthenticated: false });
          return;
        }

        set({ isLoading: true });
        try {
          // Set authorization header
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          const response = await axios.get('/auth/me');
          set({
            user: response.data,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          // Token might be expired, try to refresh
          try {
            await get().refreshToken();
            const response = await axios.get('/auth/me');
            set({
              user: response.data,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (refreshError) {
            set({
              user: null,
              accessToken: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        }
      },

      hasRole: (role: string) => {
        const user = get().user;
        if (!user) return false;
        
        return user.roles.some((ur) => ur.role.name === role);
      },

      hasPermission: (permission: string) => {
        const user = get().user;
        if (!user) return false;
        
        return user.permissions.some((p) => p.name === permission);
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        accessToken: state.accessToken,
      }),
    }
  )
);

// Axios interceptor to handle token expiration
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        await useAuthStore.getState().refreshToken();
        return axios(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
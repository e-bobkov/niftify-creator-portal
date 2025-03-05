
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL, API_ENDPOINTS, getApiUrl } from "@/config/api";

interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setAuthData: (user: any, token: string) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        const requestBody = JSON.stringify({ email, password });
        console.log('Login Request Body:', requestBody);

        try {
          const loginUrl = getApiUrl(API_ENDPOINTS.AUTH.LOGIN);
          console.log('Sending login request to:', loginUrl);
          const response = await fetch(loginUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: requestBody,
          });

          console.log('Login response status:', response.status);
          console.log('Login response headers:', Object.fromEntries(response.headers.entries()));
          
          const responseText = await response.text();
          console.log('Raw login response body:', responseText);
          
          let data;
          try {
            data = JSON.parse(responseText);
            console.log('Parsed login response data:', data);
          } catch (e) {
            console.error('Failed to parse login response as JSON:', e);
            throw new Error('Invalid JSON response from server');
          }

          if (!response.ok) {
            console.error('Login failed with status:', response.status);
            throw new Error(data.error || 'Failed to login');
          }

          // Set the authenticated user and token
          if (data.session) {
            console.log('Login successful, setting auth state');
            set({
              user: data.session.user,
              token: data.session.access_token,
              isAuthenticated: true,
            });
          } else {
            throw new Error('No session data received from server');
          }
        } catch (error) {
          console.error('Login error:', error);
          throw error;
        }
      },

      register: async (email: string, password: string) => {
        const requestBody = `{"email":"${email}","password":"${password}"}`;
        console.log('Register Request Body:', requestBody);

        try {
          const registerUrl = getApiUrl(API_ENDPOINTS.AUTH.REGISTER);
          console.log('Sending register request to:', registerUrl);
          const response = await fetch(registerUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: requestBody,
          });

          console.log('Response status:', response.status);
          console.log('Response headers:', Object.fromEntries(response.headers.entries()));
          
          const responseText = await response.text();
          console.log('Raw response body:', responseText);
          
          let data;
          try {
            data = JSON.parse(responseText);
            console.log('Parsed response data:', data);
          } catch (e) {
            console.error('Failed to parse response as JSON:', e);
            throw new Error('Invalid JSON response from server');
          }

          if (!response.ok) {
            console.error('Registration failed with status:', response.status);
            throw new Error(data.error || 'Failed to register');
          }
        } catch (error) {
          console.error('Registration error:', error);
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem('auth-storage');
      },
      
      // New method to directly set auth data (used by auto-authentication)
      setAuthData: (user: any, token: string) => {
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

// Utility hook to use auth state with toast
export const useAuthWithToast = () => {
  const authState = useAuth();
  const { toast } = useToast();
  
  return {
    ...authState,
    loginWithToast: async (email: string, password: string) => {
      try {
        await authState.login(email, password);
        toast({
          title: "Login successful",
          description: "You have been successfully logged in.",
        });
        return true;
      } catch (error) {
        toast({
          title: "Login failed",
          description: error instanceof Error ? error.message : "Failed to login. Please check your credentials.",
          variant: "destructive",
        });
        return false;
      }
    }
  };
};

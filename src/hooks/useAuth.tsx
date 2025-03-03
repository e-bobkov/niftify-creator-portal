
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useToast } from "@/hooks/use-toast";

interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
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
          console.log('Sending login request to:', 'https://test.ftsoa.art/login');
          const response = await fetch('https://test.ftsoa.art/login', {
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
          console.log('Sending register request to:', 'https://test.ftsoa.art/register');
          const response = await fetch('https://test.ftsoa.art/register', {
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

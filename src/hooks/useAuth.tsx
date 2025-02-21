
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

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
        try {
          const response = await fetch('https://test.ftsoa.art/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Failed to login');
          }

          set({
            user: data.session.user,
            token: data.session.access_token,
            isAuthenticated: true,
          });

          toast.success('Successfully logged in!');
        } catch (error) {
          toast.error(error instanceof Error ? error.message : 'Failed to login');
          throw error;
        }
      },

      register: async (email: string, password: string) => {
        try {
          const response = await fetch('https://test.ftsoa.art/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Failed to register');
          }

          toast.success(data.message);
        } catch (error) {
          toast.error(error instanceof Error ? error.message : 'Failed to register');
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        toast.success('Successfully logged out!');
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

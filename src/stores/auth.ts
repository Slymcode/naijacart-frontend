import { create } from "zustand";
import { User } from "@/types";
import { apiClient } from "@/api/client";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  hasCheckedAuth: boolean;

  // Actions
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone?: string,
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  hasCheckedAuth: false,

  signUp: async (email, password, firstName, lastName, phone) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.signUp({
        email,
        password,
        firstName,
        lastName,
        phone,
      });

      const { user, accessToken } = response.data;
      apiClient.setToken(accessToken);

      set({
        user,
        token: accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Sign up failed",
        isLoading: false,
      });
      throw error;
    }
  },

  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.signIn({ email, password });

      const { user, accessToken } = response.data;
      apiClient.setToken(accessToken);

      set({
        user,
        token: accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Sign in failed",
        isLoading: false,
      });
      throw error;
    }
  },

  logout: () => {
    apiClient.clearToken();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  setUser: (user) => {
    set({ user });
  },

  checkAuth: async () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      apiClient.setToken(token);
      try {
        const response = await apiClient.getUserProfile();
        set({
          user: response.data,
          token,
          isAuthenticated: true,
          hasCheckedAuth: true,
        });
      } catch (error) {
        // Token invalid, clear it
        localStorage.removeItem("authToken");
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          hasCheckedAuth: true,
        });
      }
    } else {
      set({ token: null, isAuthenticated: false, hasCheckedAuth: true });
    }
  },
}));

import { useAuthStore } from "@/stores/auth";

export const useAuth = () => {
  const store = useAuthStore();
  return {
    user: store.user,
    token: store.token,
    isAuthenticated: store.isAuthenticated,
    hasCheckedAuth: store.hasCheckedAuth,
    isLoading: store.isLoading,
    error: store.error,
    signUp: store.signUp,
    signIn: store.signIn,
    logout: store.logout,
    setUser: store.setUser,
  };
};

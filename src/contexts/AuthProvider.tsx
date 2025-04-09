import { useState } from "react";
import { toast } from "react-toastify";

import { login, logout, signUp } from "../services/authService";
import { AuthContext } from "./AuthContext";

interface LoginParams {
  email: string;
  password: string;
}

interface SignUpParams {
  email: string;
  password: string;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<{ username: string; role: string } | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);  // Loading state

  // Handle login
  const handleLogin = async ({ email, password }: LoginParams) => {
    setLoading(true);  // Start loading
    try {
      const userData = await login({ email, password });
      toast.success("Successfully signed In!");
      setUser(userData);
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);  // End loading
    }
  };

  // Handle sign-up
  const handleSignUp = async ({ email, password }: SignUpParams) => {
    setLoading(true);  // Start loading
    try {
      const status = await signUp({ email, password });
      
      if (status) {
        toast.success("Successfully signed up! Now, log in with your new credentials.");
        return true;
      }

      return false;
    } catch (error) {
      toast.error("Sign-up failed. Please try again later.");
      console.error("Sign-up failed:", error);
      return false;
    } finally {
      setLoading(false);  // End loading
    }
  };

  // Handle logout
  const handleLogout = () => {
    setLoading(true);  // Start loading
    logout();
    setUser(null);
    setLoading(false);  // End loading
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login: handleLogin,
        logout: handleLogout,
        signup: handleSignUp,
        loading,  // Expose loading state to the context
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

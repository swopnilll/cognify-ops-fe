import { useState } from "react";
import { login, logout } from "../services/authService";
import { AuthContext } from "./AuthContext";

interface LoginParams {
  email: string;
  password: string;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<{ username: string; role: string } | null>(
    null
  );

  const handleLogin = async ({ email, password }: LoginParams) => {
    try {
      const userData = await login({ email, password });
      setUser(userData);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login: handleLogin,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

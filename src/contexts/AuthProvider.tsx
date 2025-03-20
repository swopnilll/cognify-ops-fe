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

  const handleLogin = ({ email, password }: LoginParams) => {
    try {
      const userData = login({ email, password }); // Call the login function

      setUser(userData);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const handleLogout = () => {
    logout();

    setUser(null); // Clear user data
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

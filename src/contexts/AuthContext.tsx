import { createContext } from "react";

interface LoginParams {
  email: string;
  password: string;
}

interface AuthContextType {
  user: { username: string; role: string } | null;
  login: (credentials: LoginParams) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

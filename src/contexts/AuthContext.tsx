import { createContext } from "react";

interface LoginParams {
  email: string;
  password: string;
}

interface AuthContextType {
  user: { username: string; role: string } | null;
  login: (credentials: LoginParams) => void;
  signup: (credentials: LoginParams) => Promise<boolean>;
  logout: () => void;
  loading: boolean; // Loading state
}

export const AuthContext = createContext<AuthContextType | null>(null);

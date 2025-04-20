// src/providers/AuthProviderV2.tsx

import  {
  createContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  ReactNode
} from "react";
import { router } from "../router";


interface User {
  id: string;
  email: string;
  nickname: string;
  picture: string
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean; // To track initial auth check
  error: string | null;
}

export interface AuthContextValue extends AuthState {
  signIn: (authData: { user: User }) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (credentials: any) => Promise<void>; // Define credentials type
  checkAuthStatus: () => Promise<void>;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: true,
  error: null,
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(initialState);

  // Function to check auth status on initial load
  const checkAuthStatus = useCallback(async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    try {
      setAuthState((prev) => ({
        ...prev,
        isAuthenticated: false,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Auth check failed:", error);
      setAuthState({
        ...initialState,
        isLoading: false,
        error: "Authentication check failed",
      });
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const signIn = useCallback(
    async (authData: { user: User }) => {

      console.log("Sign in attempt with:", authData);

      setAuthState({
        user: authData.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      // Invalidate router state AFTER context update to ensure guards see new state
      await router.invalidate();
    },
    [setAuthState, router]
  );

  const signOut = useCallback(async () => {
    setAuthState({...initialState, isLoading: false }); // Reset state

    // Invalidate router state AFTER context update
    await router.invalidate();
  }, [setAuthState, router]);

  const signUp = useCallback(async (credentials: any) => {
    // On success, potentially call signIn or require manual login
    console.log("Sign up attempt with:", credentials);

    console.log("Sign up successful, redirecting to login...");
    // Example: Assume success requires login
  }, []);

  const value = useMemo(
    () => ({
      ...authState,
      signIn,
      signOut,
      signUp,
      checkAuthStatus
    }),
    [authState, signIn, signOut, signUp]
  );

  // Render children only after initial loading is complete
  // Or show a global loading indicator
  if (authState.isLoading) {
    return <div>Loading Application...</div>; // Or a proper loading spinner component
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

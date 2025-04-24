import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";

import { ToastContainer } from "react-toastify";
import GlobalLoader from "./components/ui/GlobalLoader";

import queryClient from "./queryClient";

import { router } from './router'; // Import the router instance
import { useAuth } from "./hooks/useAuthV2";

import "./styles/index.css";
import { AuthProvider } from "./providers/AuthProviderV2";

// Inner component to access context hooks before passing to RouterProvider
function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <AppProviders />
        <GlobalLoader />
        <ToastContainer />
        <ReactQueryDevtools initialIsOpen={true} />  {/* Ensure this is inside QueryClientProvider */}
      </QueryClientProvider>
    </AuthProvider>
  );
}

// Moving the Auth logic here to make sure `useAuth` is within `AuthProvider` context
function AppProviders() {
  const auth = useAuth(); 

  if (!auth) return null;
  
  return <RouterProvider router={router} context={{ auth, queryClient }} />;
}

export default App;

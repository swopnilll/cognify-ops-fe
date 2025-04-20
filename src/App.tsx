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
function AppProviders() {
  const auth = useAuth(); 

  return <RouterProvider router={router} context={{ auth, queryClient }} />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppProviders />
        <GlobalLoader />
        <ToastContainer />
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  );
}

export default App;

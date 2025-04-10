import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./styles/index.css";

import { routeTree } from "./routeTree.gen";
import { AuthProvider } from "./contexts/AuthProvider";
import { ToastContainer } from "react-toastify";
import GlobalLoader from "./components/ui/GlobalLoader";

const router = createRouter({ routeTree });

// Registering the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <GlobalLoader />
        <ToastContainer />
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  );
}

export default App;

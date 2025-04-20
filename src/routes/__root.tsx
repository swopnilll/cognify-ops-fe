import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";


import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Header from "../components/Header";

import type { AuthContextValue } from "../providers/AuthProviderV2"; // Import the context type
import type { QueryClient } from "@tanstack/react-query"; // Import QueryClient type

interface RouterContext {
  auth: AuthContextValue;
  queryClient: QueryClient;
}


const RootComponent = () => {
  return (
    <>
      <Header />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent, 
});



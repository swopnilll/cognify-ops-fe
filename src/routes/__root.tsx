import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";

import Header from "../components/Header";
import type { AuthContextValue } from "../providers/AuthProviderV2";

interface RouterContext {
  auth: AuthContextValue;
  queryClient: QueryClient;
}

// The header is 3.5rem (h-14) tall; pages below it fill the rest of the screen.
const RootComponent = () => {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex min-h-0 flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  );
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

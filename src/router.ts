// src/router.ts
import { createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen'; 


export const router = createRouter({
  routeTree,
  context: {
    auth: undefined!, // Will be provided via RouterProvider
    queryClient: undefined!, // Will be provided via RouterProvider
  },
  defaultPreload: 'intent', // Optional: Preload on hover/touch
  defaultStaleTime: 0, // Optional: Default data staleness
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
// src/main.tsx (or a dedicated queryClient.ts file [38])
import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes [38]
      gcTime: 1000 * 60 * 30, // Garbage collect inactive data after 30 minutes
      refetchOnWindowFocus: false, // Optional: Disable auto-refetch on window focus [38]
      retry: 1, // Retry failed requests once
    },
    mutations: {
      // Default options for mutations if needed
      // Example: networkMode: 'offlineFirst' 
    }
  },
});

export default queryClient;
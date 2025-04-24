import { createFileRoute, Outlet, ParsedLocation, redirect } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query';

import { AuthContextValue } from '../../providers/AuthProviderV2';


// Define the context expected by this route and its children
interface AuthenticatedRouteContext {
    auth: AuthContextValue;
    queryClient: QueryClient;
  }
  

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({context, location}: {context: AuthenticatedRouteContext, location: ParsedLocation}) => {
    
    console.log('Checking auth in _authenticated beforeLoad:', context.auth.isAuthenticated);

    if (!context.auth.isAuthenticated) {
        console.log('Redirecting to /login');
        
        throw redirect({
            to: '/login',
            search: {
                redirect: location.href
            },
            replace: true,
             
        })
    }

  },
  component: AuthenticatedLayoutWrapper,
})

function AuthenticatedLayoutWrapper() {
  return (
    <Outlet />
  )
}

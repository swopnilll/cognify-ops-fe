// src/hooks/useAuthV2.ts

import { useContext } from 'react';

import { AuthContext, AuthContextValue } from '../providers/AuthProviderV2'; // Adjust path

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === undefined) {
    // This error message guides developers to correctly place the AuthProvider
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
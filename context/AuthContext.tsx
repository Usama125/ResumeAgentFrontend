"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginRequest, RegisterRequest, APIError } from '@/types';
import AuthService from '@/services/auth';
import UserService from '@/services/user';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: APIError | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  googleLogin: (idToken: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<APIError | null>(null);

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  // Set up proactive token refresh check
  useEffect(() => {
    let tokenCheckInterval: NodeJS.Timeout;

    if (user) {
      // Check token validity every 2 minutes when user is authenticated
      tokenCheckInterval = setInterval(async () => {
        try {
          const isTokenValid = await AuthService.ensureValidToken();
          if (!isTokenValid) {
            console.log('🚨 Token refresh failed, logging out user');
            logout();
          }
        } catch (error) {
          console.error('🚨 Token check failed:', error);
          logout();
        }
      }, 2 * 60 * 1000); // 2 minutes
    }

    return () => {
      if (tokenCheckInterval) {
        clearInterval(tokenCheckInterval);
      }
    };
  }, [user]);

  // Handle visibility change - refresh token when user returns to tab
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (!document.hidden && user) {
        try {
          console.log('🔍 Tab became visible, checking token validity...');
          const isTokenValid = await AuthService.ensureValidToken();
          if (!isTokenValid) {
            console.log('🚨 Token invalid after returning to tab, logging out user');
            logout();
          }
        } catch (error) {
          console.error('🚨 Token check on visibility change failed:', error);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user]);

  const initializeAuth = async () => {
    try {
      setLoading(true);
      console.log('🔍 AUTH CONTEXT - Initializing auth...');
      
      // Check if user is authenticated
      if (AuthService.isAuthenticated()) {
        console.log('🔍 AUTH CONTEXT - User has valid token');
        
        // Get stored user data first for immediate display
        const storedUser = AuthService.getStoredUser();
        if (storedUser) {
          console.log('🔍 AUTH CONTEXT - Setting stored user data:', { 
            userId: storedUser.id, 
            onboarding_completed: storedUser.onboarding_completed,
            progress_completed: storedUser.onboarding_progress?.completed
          });
          setUser(storedUser);
          // Don't set loading to false here - let the finally block handle it
          // This prevents multiple loading state changes
        }
        
        // Refresh user data from backend in background to ensure consistency
        // Use a timeout to prevent hanging
        try {
          console.log('🔍 AUTH CONTEXT - Refreshing user data from backend...');
          
          // Create a timeout promise
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Request timeout')), 10000); // 10 second timeout
          });
          
          // Race between API call and timeout
          const currentUser = await Promise.race([
            UserService.getCurrentUser(),
            timeoutPromise
          ]) as User;
          
          console.log('🔍 AUTH CONTEXT - Backend user data received:', { 
            userId: currentUser.id, 
            onboarding_completed: currentUser.onboarding_completed,
            progress_completed: currentUser.onboarding_progress?.completed
          });
          
          // Preserve any frontend-only updates (like onboarding completion)
          const preservedUpdates: Partial<User> = {};
          if (storedUser?.onboarding_completed && !currentUser.onboarding_completed) {
            preservedUpdates.onboarding_completed = true;
            console.log('🔍 AUTH CONTEXT - Preserving frontend onboarding completion status');
          }
          
          const mergedUser = { ...currentUser, ...preservedUpdates };
          setUser(mergedUser);
          
          // Update stored user data
          if (typeof window !== 'undefined') {
            localStorage.setItem('user_data', JSON.stringify(mergedUser));
          }
        } catch (err: any) {
          console.error('🚨 AUTH CONTEXT - Failed to refresh user data:', err);
          
          // Only clear auth if it's an auth error (401), not other errors
          if (err.status === 401 || err.type === 'AUTH_ERROR') {
            console.log('🚨 AUTH CONTEXT - Token invalid, clearing auth');
            AuthService.logout();
            setUser(null);
          } else {
            // For other errors (including timeout), keep the stored user data
            console.log('🔍 AUTH CONTEXT - Network error or timeout, keeping stored user data');
            // Set loading to false immediately if we have stored user data
            if (storedUser) {
              console.log('🔍 AUTH CONTEXT - Using stored user data due to network issues');
            }
          }
        }
      } else {
        console.log('🔍 AUTH CONTEXT - No valid token found');
        setUser(null);
      }
    } catch (err) {
      console.error('🚨 AUTH CONTEXT - Auth initialization error:', err);
      setError(err as APIError);
    } finally {
      // Always set loading to false after initialization attempt
      // This ensures loading state is properly cleared
      console.log('🔍 AUTH CONTEXT - Auth initialization complete');
      setLoading(false);
    }
  };

  const login = async (credentials: LoginRequest) => {
    try {
      setLoading(true);
      setError(null);
      
      const authResponse = await AuthService.login(credentials);
      
      // Store authentication data
      AuthService.storeAuth(authResponse);
      setUser(authResponse.user);
      
      console.log('✅ [AUTH CONTEXT] Login successful', {
        userId: authResponse.user.id,
        onboarding_completed: authResponse.user.onboarding_completed
      });
      
      // Smart navigation based on onboarding status
      if (typeof window !== 'undefined') {
        if (!authResponse.user.onboarding_completed) {
          console.log('🔄 [AUTH CONTEXT] Redirecting to onboarding (incomplete)');
          window.location.href = '/onboarding';
        } else {
          console.log('🔄 [AUTH CONTEXT] Redirecting to profile (onboarding complete)');
          window.location.href = '/profile';
        }
      }
      
    } catch (err) {
      setError(err as APIError);
      setLoading(false); // Only set to false on error
      throw err;
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      setLoading(true);
      setError(null);
      
      const authResponse = await AuthService.register(userData);
      
      // Store authentication data
      AuthService.storeAuth(authResponse);
      setUser(authResponse.user);
      
      // Don't set loading to false - let the auth flow handle it
      
    } catch (err) {
      setError(err as APIError);
      setLoading(false); // Only set to false on error
      throw err;
    }
  };

  const googleLogin = async (idToken: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚀 [AUTH CONTEXT] Google login initiated');
      
      const authResponse = await AuthService.googleLogin(idToken);
      
      // Store authentication data
      AuthService.storeAuth(authResponse);
      setUser(authResponse.user);
      
      console.log('✅ [AUTH CONTEXT] Google login successful', {
        userId: authResponse.user.id,
        onboarding_completed: authResponse.user.onboarding_completed
      });
      
      // Smart navigation based on onboarding status
      if (typeof window !== 'undefined') {
        if (!authResponse.user.onboarding_completed) {
          console.log('🔄 [AUTH CONTEXT] Redirecting to onboarding (incomplete)');
          window.location.href = '/onboarding';
        } else {
          console.log('🔄 [AUTH CONTEXT] Redirecting to profile (onboarding complete)');
          window.location.href = '/profile';
        }
      }
      
    } catch (err) {
      console.error('❌ [AUTH CONTEXT] Google login failed:', err);
      setError(err as APIError);
      setLoading(false); // Only set to false on error
      throw err;
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    setError(null);
    
    // Redirect to home page after logout
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      
      // Update stored user data
      if (typeof window !== 'undefined') {
        localStorage.setItem('user_data', JSON.stringify(updatedUser));
      }
      
      // Ensure loading is set to false after user update
      // This is especially important after onboarding completion
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    if (!AuthService.isAuthenticated()) return;
    
    try {
      const currentUser = await UserService.getCurrentUser();
      
      // Preserve any frontend-only updates (like onboarding completion)
      const preservedUpdates: Partial<User> = {};
      if (user?.onboarding_completed && !currentUser.onboarding_completed) {
        preservedUpdates.onboarding_completed = true;
        console.log('🔍 AUTH CONTEXT - Preserving frontend onboarding completion status');
      }
      
      const mergedUser = { ...currentUser, ...preservedUpdates };
      setUser(mergedUser);
      
      // Update stored user data
      if (typeof window !== 'undefined') {
        localStorage.setItem('user_data', JSON.stringify(mergedUser));
      }
      
      // Ensure loading is false after successful refresh
      setLoading(false);
    } catch (err) {
      console.error('Failed to refresh user:', err);
      // Don't set error here as this is a background operation
      // Keep loading false even on error to prevent infinite loading
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    register,
    googleLogin,
    logout,
    updateUser,
    clearError,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
import { publicAPI, apiClient } from '@/lib/secure-api-client';
import { LoginRequest, RegisterRequest, AuthResponse, RefreshTokenRequest, RefreshTokenResponse } from '@/types';

// Authentication service
export class AuthService {
  
  // User registration
  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    return publicAPI.post<AuthResponse>('/auth/register', userData);
  }

  // User login
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    return publicAPI.post<AuthResponse>('/auth/login', credentials);
  }

  // Google OAuth login
  static async googleLogin(idToken: string): Promise<AuthResponse> {
    return publicAPI.post<AuthResponse>('/auth/google-oauth', { id_token: idToken });
  }

  // Store authentication data
  static storeAuth(authData: AuthResponse): void {
    apiClient.setStoredToken(authData.access_token);
    
    // Store refresh token if provided
    if (authData.refresh_token && typeof window !== 'undefined') {
      localStorage.setItem('refresh_token', authData.refresh_token);
    }
    
    // Store user data in localStorage for quick access
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_data', JSON.stringify(authData.user));
    }
  }

  // Get stored user data
  static getStoredUser(): any | null {
    if (typeof window === 'undefined') return null;
    
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  // Clear authentication data
  static logout(): void {
    apiClient.removeStoredToken();
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user_data');
      localStorage.removeItem('refresh_token');
    }
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return !!apiClient.getStoredToken();
  }

  // Get current auth token
  static getToken(): string | null {
    return apiClient.getStoredToken();
  }

  // Get stored refresh token
  static getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refresh_token');
  }

  // Refresh access token
  static async refreshToken(): Promise<AuthResponse | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return null;

    try {
      const response = await publicAPI.post<RefreshTokenResponse>('/auth/refresh', {
        refresh_token: refreshToken
      });

      // Update stored access token
      apiClient.setStoredToken(response.access_token);
      
      // Update stored user data
      if (typeof window !== 'undefined') {
        localStorage.setItem('user_data', JSON.stringify(response.user));
      }

      return {
        user: response.user,
        access_token: response.access_token,
        token_type: response.token_type
      };
    } catch (error) {
      // If refresh fails, clear all auth data
      this.logout();
      return null;
    }
  }

  // Check if token needs refresh (called periodically)
  static async ensureValidToken(): Promise<boolean> {
    const currentToken = this.getToken();
    if (!currentToken) return false;

    try {
      // Try to decode token to check expiration
      const tokenPayload = JSON.parse(atob(currentToken.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = tokenPayload.exp - currentTime;

      // Refresh if token expires within next 5 minutes (300 seconds)
      if (timeUntilExpiry < 300) {
        console.log('🔄 Token expiring soon, attempting refresh...');
        const refreshResult = await this.refreshToken();
        return refreshResult !== null;
      }

      return true;
    } catch (error) {
      console.error('🚨 Token validation failed:', error);
      // If we can't decode the token, try to refresh it
      const refreshResult = await this.refreshToken();
      return refreshResult !== null;
    }
  }
}

export default AuthService;
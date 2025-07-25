import { APIError } from '@/types';
import { DeviceFingerprintCollector } from '@/utils/deviceFingerprint';

// Secure API Client for AI Resume Builder
// Handles HMAC signature generation and secure requests

class SecureAPIClient {
  private baseURL: string;
  private frontendSecret: string;
  private clientSecretRotationInterval: number = 60 * 60 * 1000; // 1 hour
  private lastSecretGeneration: number = 0;
  private currentClientSecret: string = '';

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    this.frontendSecret = process.env.NEXT_PUBLIC_API_SECRET || '';
    
    if (!this.frontendSecret) {
      console.warn('Frontend secret not configured - secure features will not work');
    }
  }

  // Generate rotating client secret (changes every hour)
  private generateClientSecret(): string {
    const now = Date.now();
    
    if (now - this.lastSecretGeneration < this.clientSecretRotationInterval && this.currentClientSecret) {
      return this.currentClientSecret;
    }
    
    const hour = Math.floor(now / this.clientSecretRotationInterval);
    this.currentClientSecret = `CLIENT_${hour}_${this.frontendSecret.slice(-8)}`;
    this.lastSecretGeneration = now;
    
    return this.currentClientSecret;
  }

  // Generate HMAC signature for secure endpoints
  private async generateSignature(
    method: string,
    endpoint: string,
    timestamp: string,
    nonce: string,
    bodyHash: string = ''
  ): Promise<string> {
    const clientSecret = this.generateClientSecret();
    const message = `${method}|${endpoint}|${timestamp}|${nonce}|${bodyHash}`;
    
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(clientSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
    return btoa(String.fromCharCode(...new Uint8Array(signature)));
  }

  // Generate nonce (unique per request)
  private generateNonce(): string {
    return crypto.randomUUID();
  }

  // Hash request body for signature
  private async hashBody(body: any): Promise<string> {
    if (!body) return '';
    
    let bodyData: Uint8Array;
    
    if (body instanceof FormData) {
      // For FormData, we'll use a simplified hash approach
      // In production, you might want to serialize FormData deterministically
      const formEntries: string[] = [];
      for (const [key, value] of body.entries()) {
        if (value instanceof File) {
          formEntries.push(`${key}:file:${value.name}:${value.size}`);
        } else {
          formEntries.push(`${key}:${value}`);
        }
      }
      const formString = formEntries.sort().join('|');
      bodyData = new TextEncoder().encode(formString);
    } else {
      const bodyString = typeof body === 'string' ? body : JSON.stringify(body);
      bodyData = new TextEncoder().encode(bodyString);
    }
    
    const hashBuffer = await crypto.subtle.digest('SHA-256', bodyData);
    return btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
  }

  // Handle API errors consistently
  private handleError(response: Response, data: any): APIError {
    console.error('🚨 API Error Details:', {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      responseData: data
    });

    // If it's a validation error, log the details  
    if (response.status === 422 && data?.detail && Array.isArray(data.detail)) {
      console.error('📋 Validation Errors:');
      data.detail.forEach((error: any, index: number) => {
        console.error(`  ${index + 1}. Field: ${error.loc?.join('.')} - ${error.msg} (Type: ${error.type})`);
      });
    }

    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      
      // Check if backend sends detailed rate limit data
      let rateLimitData;
      if (data.detail && typeof data.detail === 'object') {
        rateLimitData = {
          remaining: data.detail.remaining || 0,
          resetInSeconds: data.detail.reset_in_seconds || (retryAfter ? parseInt(retryAfter) : 3600),
          isAuthenticated: data.detail.is_authenticated || false,
          rateLimitType: data.detail.rate_limit_type || 'unknown'
        };
      }
      
      return {
        type: 'RATE_LIMIT',
        message: (data.detail && typeof data.detail === 'object' ? data.detail.message : data.detail) || data.error || 'Rate limit exceeded',
        retryAfter: retryAfter ? parseInt(retryAfter) : undefined,
        action: 'RETRY',
        rateLimitData
      };
    }
    
    if (response.status === 401) {
      return {
        type: 'AUTH_ERROR',
        message: data.detail || data.error || 'Authentication failed',
        action: 'REDIRECT_TO_LOGIN'
      };
    }
    
    if (response.status === 422) {
      return {
        type: 'VALIDATION_ERROR',
        message: data.detail || data.error || 'Validation failed',
        detail: data.detail,
        errors: data.detail // Add this for our error handling
      };
    }
    
    return {
      type: 'GENERIC_ERROR',
      message: data.detail || data.error || 'An error occurred',
      detail: data.detail
    };
  }

  // Public request (no authentication needed)
  async publicRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Don't set Content-Type for FormData (let browser set it with boundary)
    const headers: Record<string, string> = {
      'Origin': process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
      ...DeviceFingerprintCollector.getFingerprintHeaders(), // Add device fingerprinting
      ...options.headers as Record<string, string>,
    };

    // Only set JSON content-type if not FormData
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw this.handleError(response, data);
    }
    
    return data;
  }

  // Authenticated request (JWT token required)
  async authenticatedRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    token?: string,
    isRetry: boolean = false
  ): Promise<T> {
    const authToken = token || this.getStoredToken();
    
    if (!authToken) {
      throw {
        type: 'AUTH_ERROR',
        message: 'No authentication token found',
        action: 'REDIRECT_TO_LOGIN'
      } as APIError;
    }

    const url = `${this.baseURL}${endpoint}`;
    
    // Don't set Content-Type for FormData (let browser set it with boundary)
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${authToken}`,
      ...DeviceFingerprintCollector.getFingerprintHeaders(), // Add device fingerprinting
      'Origin': process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
      ...options.headers as Record<string, string>,
    };

    // Only set JSON content-type if not FormData
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();
    
    if (!response.ok) {
      // If 401 error and not already a retry, attempt token refresh
      if (response.status === 401 && !isRetry && endpoint !== '/auth/refresh') {
        console.log('🔄 401 error received, attempting token refresh...');
        
        // Dynamically import to avoid circular dependency
        const { default: AuthService } = await import('@/services/auth');
        const refreshResult = await AuthService.refreshToken();
        
        if (refreshResult) {
          console.log('🔄 Token refreshed successfully, retrying request...');
          // Retry the request with new token
          return this.authenticatedRequest(endpoint, options, refreshResult.access_token, true);
        } else {
          console.log('🚨 Token refresh failed, user needs to re-login');
        }
      }
      
      throw this.handleError(response, data);
    }
    
    return data;
  }

  // Secure request (HMAC signature required)
  async secureRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    token?: string,
    isRetry: boolean = false
  ): Promise<T> {
    if (!this.frontendSecret) {
      throw {
        type: 'GENERIC_ERROR',
        message: 'Secure requests not configured - missing frontend secret'
      } as APIError;
    }

    const authToken = token || this.getStoredToken();
    const method = options.method || 'GET';
    const timestamp = Date.now().toString();
    const nonce = this.generateNonce();
    const bodyHash = await this.hashBody(options.body);
    
    const signature = await this.generateSignature(
      method,
      endpoint,
      timestamp,
      nonce,
      bodyHash
    );

    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Origin': process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
      'X-API-Key': 'AIR_2024_FRONTEND_KEY_$ecur3_K3y_H3r3',
      'X-Timestamp': timestamp,
      'X-Signature': signature,
      ...DeviceFingerprintCollector.getFingerprintHeaders(), // Add device fingerprinting
      ...options.headers as Record<string, string>,
    };

    // Only set JSON content-type if not FormData
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();
    
    if (!response.ok) {
      // If 401 error and not already a retry, attempt token refresh
      if (response.status === 401 && !isRetry && endpoint !== '/auth/refresh') {
        console.log('🔄 401 error received in secure request, attempting token refresh...');
        
        // Dynamically import to avoid circular dependency
        const { default: AuthService } = await import('@/services/auth');
        const refreshResult = await AuthService.refreshToken();
        
        if (refreshResult) {
          console.log('🔄 Token refreshed successfully, retrying secure request...');
          // Retry the request with new token
          return this.secureRequest(endpoint, options, refreshResult.access_token, true);
        } else {
          console.log('🚨 Token refresh failed for secure request, user needs to re-login');
        }
      }
      
      throw this.handleError(response, data);
    }
    
    return data;
  }

  // Token management
  getStoredToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  setStoredToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('auth_token', token);
  }

  removeStoredToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth_token');
  }

  // File upload helper
  async uploadFile<T>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, any>,
    token?: string,
    isSecure: boolean = false
  ): Promise<T> {
    console.log('🚀 API Upload Debug:', {
      endpoint,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      isSecure,
      hasToken: !!token,
      additionalData
    });

    const formData = new FormData();
    formData.append('file', file);
    
    // Debug FormData contents
    console.log('📄 FormData contents:');
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
    }
    
    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        const value = additionalData[key];
        if (value !== undefined && value !== null) {
          formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
        }
      });
    }

    const options: RequestInit = {
      method: 'POST',
      body: formData,
      headers: {
        'Origin': process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
      }
    };

    console.log('🌐 Making request to:', `${this.baseURL}${endpoint}`);
    
    if (isSecure) {
      return this.secureRequest<T>(endpoint, options, token);
    } else {
      return this.authenticatedRequest<T>(endpoint, options, token);
    }
  }
}

// Export singleton instance
export const apiClient = new SecureAPIClient();

// Export utility functions for easy use
export const publicAPI = {
  get: <T>(endpoint: string) => apiClient.publicRequest<T>(endpoint),
  post: <T>(endpoint: string, data: any) => apiClient.publicRequest<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
};

export const authAPI = {
  get: <T>(endpoint: string, token?: string) => 
    apiClient.authenticatedRequest<T>(endpoint, { method: 'GET' }, token),
  
  post: <T>(endpoint: string, data: any, token?: string) => 
    apiClient.authenticatedRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    }, token),
  
  put: <T>(endpoint: string, data: any, token?: string) => 
    apiClient.authenticatedRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    }, token),
  
  delete: <T>(endpoint: string, token?: string) => 
    apiClient.authenticatedRequest<T>(endpoint, { method: 'DELETE' }, token),
};

export const secureAPI = {
  get: <T>(endpoint: string, token?: string) => 
    apiClient.secureRequest<T>(endpoint, { method: 'GET' }, token),
  
  post: <T>(endpoint: string, data: any, token?: string) => 
    apiClient.secureRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    }, token),
};

export default apiClient;
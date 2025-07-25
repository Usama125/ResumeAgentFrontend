import { APIError } from '@/types';

// Centralized error handling utility
export class ErrorHandler {
  
  // Format error message for display
  static formatErrorMessage(error: APIError): string {
    switch (error.type) {
      case 'RATE_LIMIT':
        const waitTime = error.retryAfter ? `${error.retryAfter} seconds` : 'a moment';
        return `Rate limit exceeded. Please wait ${waitTime} before trying again.`;
      
      case 'AUTH_ERROR':
        return 'Authentication failed. Please sign in again.';
      
      case 'VALIDATION_ERROR':
        const detail = Array.isArray(error.detail) 
          ? error.detail.map(err => err.msg || err).join(', ') 
          : error.detail;
        return detail || error.message || 'Please check your input and try again.';
      
      case 'GENERIC_ERROR':
      default:
        return error.message || 'An unexpected error occurred. Please try again.';
    }
  }

  // Get error severity level
  static getErrorSeverity(error: APIError): 'low' | 'medium' | 'high' {
    switch (error.type) {
      case 'RATE_LIMIT':
        return 'low';
      case 'VALIDATION_ERROR':
        return 'medium';
      case 'AUTH_ERROR':
      case 'GENERIC_ERROR':
        return 'high';
      default:
        return 'medium';
    }
  }

  // Get recommended action for error
  static getRecommendedAction(error: APIError): string {
    switch (error.action) {
      case 'REDIRECT_TO_LOGIN':
        return 'Please sign in to continue.';
      case 'RETRY':
        return 'Please try again.';
      case 'CONTACT_SUPPORT':
        return 'If this problem persists, please contact support.';
      default:
        return 'Please try again or refresh the page.';
    }
  }

  // Handle errors with automatic actions
  static handleError(error: APIError, router?: any): void {
    console.error('API Error:', error);
    
    // Automatic actions based on error type
    switch (error.action) {
      case 'REDIRECT_TO_LOGIN':
        if (router) {
          router.push('/auth');
        } else if (typeof window !== 'undefined') {
          window.location.href = '/auth';
        }
        break;
      
      default:
        // For other errors, just log them
        break;
    }
  }

  // Check if error is retryable
  static isRetryable(error: APIError): boolean {
    return error.type === 'RATE_LIMIT' || error.type === 'GENERIC_ERROR';
  }

  // Get retry delay for retryable errors
  static getRetryDelay(error: APIError): number {
    if (error.type === 'RATE_LIMIT' && error.retryAfter) {
      return error.retryAfter * 1000; // Convert to milliseconds
    }
    return 3000; // Default 3 second delay
  }

  // Create error from Response object
  static async createErrorFromResponse(response: Response): Promise<APIError> {
    let data: any = {};
    
    try {
      data = await response.json();
    } catch {
      // If response doesn't have JSON, use default message
    }

    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      
      // Handle new rate limit structure
      if (data.detail && typeof data.detail === 'object') {
        return {
          type: 'RATE_LIMIT',
          message: data.detail.message || 'Rate limit exceeded',
          retryAfter: data.detail.reset_in_seconds || (retryAfter ? parseInt(retryAfter) : undefined),
          action: 'RETRY',
          rateLimitData: {
            remaining: data.detail.remaining || 0,
            resetInSeconds: data.detail.reset_in_seconds || 0,
            isAuthenticated: data.detail.is_authenticated || false,
            rateLimitType: data.detail.rate_limit_type || 'unknown'
          }
        };
      }
      
      // Fallback to old structure
      return {
        type: 'RATE_LIMIT',
        message: data.detail || data.error || 'Rate limit exceeded',
        retryAfter: retryAfter ? parseInt(retryAfter) : undefined,
        action: 'RETRY'
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
        detail: data.detail
      };
    }
    
    return {
      type: 'GENERIC_ERROR',
      message: data.detail || data.error || 'An error occurred',
      detail: data.detail
    };
  }
}

// Hook for easy error handling in components
export function useErrorHandler() {
  const handleError = (error: APIError, router?: any) => {
    ErrorHandler.handleError(error, router);
  };

  const formatError = (error: APIError) => {
    return ErrorHandler.formatErrorMessage(error);
  };

  const isRetryable = (error: APIError) => {
    return ErrorHandler.isRetryable(error);
  };

  return {
    handleError,
    formatError,
    isRetryable,
    getRetryDelay: ErrorHandler.getRetryDelay,
    getSeverity: ErrorHandler.getErrorSeverity,
    getAction: ErrorHandler.getRecommendedAction,
  };
}

export default ErrorHandler;
"use client";

import { useState, useCallback } from 'react';
import { APIError, RateLimitData } from '@/types';

interface RateLimitState {
  isOpen: boolean;
  message: string;
  resetInSeconds: number;
  isAuthenticated: boolean;
  rateLimitType: 'job_matching' | 'chat' | 'content_generation';
}

export function useRateLimit() {
  const [rateLimitState, setRateLimitState] = useState<RateLimitState>({
    isOpen: false,
    message: '',
    resetInSeconds: 0,
    isAuthenticated: false,
    rateLimitType: 'job_matching'
  });

  const showRateLimitModal = useCallback((error: APIError) => {
    if (error.type === 'RATE_LIMIT' && error.rateLimitData) {
      const { rateLimitData } = error;
      setRateLimitState({
        isOpen: true,
        message: error.message,
        resetInSeconds: rateLimitData.resetInSeconds,
        isAuthenticated: rateLimitData.isAuthenticated,
        rateLimitType: rateLimitData.rateLimitType as 'job_matching' | 'chat' | 'content_generation'
      });
    } else if (error.type === 'RATE_LIMIT') {
      // Fallback for old rate limit format
      const resetTime = error.retryAfter || 3600;
      setRateLimitState({
        isOpen: true,
        message: error.message,
        resetInSeconds: resetTime,
        isAuthenticated: false,
        rateLimitType: 'job_matching'
      });
    }
  }, []);

  const hideRateLimitModal = useCallback(() => {
    setRateLimitState(prev => ({ ...prev, isOpen: false }));
  }, []);

  return {
    showRateLimitModal,
    hideRateLimitModal,
    rateLimitState,
    isRateLimitModalOpen: rateLimitState.isOpen
  };
}

export default useRateLimit;
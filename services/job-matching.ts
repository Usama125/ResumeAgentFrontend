import { secureAPI } from '@/lib/secure-api-client';
import { JobMatchingRequest, JobMatchingResponse } from '@/types';

// Job matching service (HMAC secured)
export class JobMatchingService {
  
  // Search for job matches using AI
  static async searchJobs(
    matchingRequest: JobMatchingRequest, 
    token?: string
  ): Promise<JobMatchingResponse> {
    return secureAPI.post<JobMatchingResponse>('/job-matching/search', matchingRequest, token);
  }

  // Get job matches for current user (based on their profile)
  static async getPersonalizedJobs(token?: string): Promise<JobMatchingResponse> {
    return secureAPI.get<JobMatchingResponse>('/job-matching/personalized', token);
  }

  // Rate limiting info for job matching (3 requests per day)
  static getRateLimitInfo(): { remaining: number; resetTime: number } | null {
    if (typeof window === 'undefined') return null;
    
    const limitInfo = localStorage.getItem('job_matching_rate_limit');
    return limitInfo ? JSON.parse(limitInfo) : null;
  }

  // Store rate limiting info
  static storeRateLimitInfo(remaining: number, resetTime: number): void {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem('job_matching_rate_limit', JSON.stringify({
      remaining,
      resetTime
    }));
  }

  // Check if user can make job matching request
  static canMakeRequest(): boolean {
    const limitInfo = this.getRateLimitInfo();
    
    if (!limitInfo) return true;
    
    // If reset time has passed, user can make requests again
    if (Date.now() > limitInfo.resetTime) {
      this.clearRateLimitInfo();
      return true;
    }
    
    return limitInfo.remaining > 0;
  }

  // Clear rate limiting info
  static clearRateLimitInfo(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('job_matching_rate_limit');
  }
}

export default JobMatchingService;
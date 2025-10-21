// Profile loading optimization utilities
// These help reduce API calls and improve profile page performance

interface CachedProfileData {
  data: any;
  timestamp: number;
  ttl: number;
}

class ProfileOptimizer {
  private static readonly CACHE_PREFIX = 'profile_cache_';
  private static readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  // Cache profile data
  static cacheProfileData(key: string, data: any, ttl: number = this.DEFAULT_TTL): void {
    if (typeof window === 'undefined') return;
    
    // Check if localStorage is available
    if (!this.isLocalStorageAvailable()) return;
    
    const cacheKey = `${this.CACHE_PREFIX}${key}`;
    const cacheData: CachedProfileData = {
      data,
      timestamp: Date.now(),
      ttl
    };
    
    try {
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to cache profile data:', error);
    }
  }

  // Check if localStorage is available
  private static isLocalStorageAvailable(): boolean {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Get cached profile data
  static getCachedProfileData(key: string): any | null {
    if (typeof window === 'undefined') return null;
    if (!this.isLocalStorageAvailable()) return null;
    
    const cacheKey = `${this.CACHE_PREFIX}${key}`;
    
    try {
      const cached = localStorage.getItem(cacheKey);
      if (!cached) return null;
      
      const { data, timestamp, ttl }: CachedProfileData = JSON.parse(cached);
      
      // Check if cache is still valid
      if (Date.now() - timestamp < ttl) {
        return data;
      }
      
      // Remove expired cache
      localStorage.removeItem(cacheKey);
      return null;
    } catch (error) {
      console.warn('Failed to get cached profile data:', error);
      return null;
    }
  }

  // Clear profile cache
  static clearProfileCache(key?: string): void {
    if (typeof window === 'undefined') return;
    
    if (key) {
      const cacheKey = `${this.CACHE_PREFIX}${key}`;
      localStorage.removeItem(cacheKey);
    } else {
      // Clear all profile caches
      const keys = Object.keys(localStorage);
      keys.forEach(k => {
        if (k.startsWith(this.CACHE_PREFIX)) {
          localStorage.removeItem(k);
        }
      });
    }
  }

  // Preload profile data in background
  static async preloadProfile(username: string): Promise<void> {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';
      const response = await fetch(`${API_BASE_URL}/users/username/${username}`, {
        headers: {
          'Cache-Control': 'max-age=300',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        this.cacheProfileData(username, data);
      }
    } catch (error) {
      // Silently fail - this is just preloading
      console.warn('Failed to preload profile:', error);
    }
  }

  // Optimized fetch with cache and timeout
  static async fetchProfileWithOptimization(
    username: string,
    timeout: number = 10000
  ): Promise<any> {
    // Check cache first
    const cached = this.getCachedProfileData(username);
    if (cached) {
      return cached;
    }

    // Fetch with timeout
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(`${API_BASE_URL}/users/username/${username}`, {
        signal: controller.signal,
        headers: {
          'Cache-Control': 'max-age=300',
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Preserve EXACT original error behavior
        throw new Error('Failed to fetch user');
      }

      const data = await response.json();
      
      // Cache the result only if it's valid
      if (data && typeof data === 'object') {
        this.cacheProfileData(username, data);
      }
      
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      // Re-throw with original error message for compatibility
      throw error;
    }
  }

  // Generate cache key for different profile types
  static generateCacheKey(type: 'username' | 'id' | 'current', identifier: string): string {
    return `${type}_${identifier}`;
  }

  // Check if profile data is fresh (less than 1 minute old)
  static isProfileDataFresh(key: string): boolean {
    if (typeof window === 'undefined') return false;
    
    const cacheKey = `${this.CACHE_PREFIX}${key}`;
    
    try {
      const cached = localStorage.getItem(cacheKey);
      if (!cached) return false;
      
      const { timestamp }: CachedProfileData = JSON.parse(cached);
      return Date.now() - timestamp < 60 * 1000; // 1 minute
    } catch (error) {
      return false;
    }
  }
}

export default ProfileOptimizer;

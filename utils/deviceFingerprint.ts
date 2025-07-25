/**
 * Device Fingerprinting Utility
 * Collects additional client information to enhance rate limiting accuracy
 * and prevent bypass attempts through browser/VPN switching
 */

export interface DeviceFingerprint {
  screenInfo: string;
  timezone: string;
  language: string;
  platform: string;
  cookiesEnabled: boolean;
  doNotTrack: string;
  colorDepth: number;
  pixelRatio: number;
}

export class DeviceFingerprintCollector {
  
  /**
   * Collect comprehensive device fingerprint
   */
  static getDeviceFingerprint(): DeviceFingerprint {
    if (typeof window === 'undefined') {
      // Server-side rendering fallback
      return {
        screenInfo: '',
        timezone: '',
        language: '',
        platform: '',
        cookiesEnabled: false,
        doNotTrack: '',
        colorDepth: 0,
        pixelRatio: 1
      };
    }

    return {
      screenInfo: this.getScreenInfo(),
      timezone: this.getTimezone(),
      language: this.getLanguage(),
      platform: this.getPlatform(),
      cookiesEnabled: this.getCookiesEnabled(),
      doNotTrack: this.getDoNotTrack(),
      colorDepth: this.getColorDepth(),
      pixelRatio: this.getPixelRatio()
    };
  }

  /**
   * Get screen information (resolution, available space)
   */
  private static getScreenInfo(): string {
    try {
      const screen = window.screen;
      return `${screen.width}x${screen.height}x${screen.colorDepth}`;
    } catch {
      return '';
    }
  }

  /**
   * Get timezone information
   */
  private static getTimezone(): string {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return new Date().getTimezoneOffset().toString();
    }
  }

  /**
   * Get language preferences
   */
  private static getLanguage(): string {
    try {
      return navigator.language || navigator.languages?.join(',') || '';
    } catch {
      return '';
    }
  }

  /**
   * Get platform information
   */
  private static getPlatform(): string {
    try {
      return navigator.platform || '';
    } catch {
      return '';
    }
  }

  /**
   * Check if cookies are enabled
   */
  private static getCookiesEnabled(): boolean {
    try {
      return navigator.cookieEnabled;
    } catch {
      return false;
    }
  }

  /**
   * Get Do Not Track setting
   */
  private static getDoNotTrack(): string {
    try {
      return navigator.doNotTrack || (window as any).doNotTrack || '';
    } catch {
      return '';
    }
  }

  /**
   * Get color depth
   */
  private static getColorDepth(): number {
    try {
      return screen.colorDepth || 0;
    } catch {
      return 0;
    }
  }

  /**
   * Get pixel ratio
   */
  private static getPixelRatio(): number {
    try {
      return window.devicePixelRatio || 1;
    } catch {
      return 1;
    }
  }

  /**
   * Create a simple canvas fingerprint
   * Note: This is a basic implementation. More sophisticated canvas fingerprinting
   * can be implemented if needed, but be aware of privacy implications.
   */
  static getCanvasFingerprint(): string {
    if (typeof window === 'undefined') return '';
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return '';
      
      // Draw some text and shapes to create a unique fingerprint
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Device fingerprint test 🔒', 2, 2);
      
      ctx.fillStyle = '#f60';
      ctx.fillRect(100, 5, 80, 20);
      
      // Get the canvas data and hash it
      const dataURL = canvas.toDataURL();
      return this.simpleHash(dataURL);
    } catch {
      return '';
    }
  }

  /**
   * Simple hash function for canvas fingerprint
   */
  private static simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }

  /**
   * Convert fingerprint to HTTP headers for API requests
   */
  static getFingerprintHeaders(): Record<string, string> {
    const fingerprint = this.getDeviceFingerprint();
    const canvasFingerprint = this.getCanvasFingerprint();
    
    return {
      'X-Screen-Info': fingerprint.screenInfo,
      'X-Timezone': fingerprint.timezone,
      'X-Canvas-Fp': canvasFingerprint,
      'X-Device-Info': JSON.stringify({
        platform: fingerprint.platform,
        colorDepth: fingerprint.colorDepth,
        pixelRatio: fingerprint.pixelRatio,
        cookiesEnabled: fingerprint.cookiesEnabled,
        doNotTrack: fingerprint.doNotTrack
      })
    };
  }

  /**
   * Check if the device has characteristics of a bot or automated tool
   */
  static detectAutomation(): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      // Check for common automation indicators
      const indicators = [
        // Check for webdriver property
        !!(window as any).webdriver,
        
        // Check for automation-related properties
        !!(window as any).callPhantom,
        !!(window as any)._phantom,
        !!(window as any).phantom,
        
        // Check for unusual navigator properties
        navigator.webdriver === true,
        
        // Check for missing properties that real browsers have
        !navigator.languages || navigator.languages.length === 0,
        
        // Check for suspicious user agent
        /HeadlessChrome|PhantomJS|SlimerJS/.test(navigator.userAgent)
      ];
      
      return indicators.some(Boolean);
    } catch {
      return false;
    }
  }

  /**
   * Generate a unique session identifier
   * This helps track users across page reloads within the same session
   */
  static getSessionId(): string {
    if (typeof window === 'undefined') return '';
    
    const sessionKey = 'device_session_id';
    let sessionId = sessionStorage.getItem(sessionKey);
    
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem(sessionKey, sessionId);
    }
    
    return sessionId;
  }
}

export default DeviceFingerprintCollector;
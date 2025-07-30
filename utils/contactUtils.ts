/**
 * Utility functions for handling contact links and URLs
 */

/**
 * Formats LinkedIn URL to ensure it's a valid LinkedIn profile URL
 */
export function formatLinkedInUrl(url: string): string {
  if (!url) return '';
  
  // If it's already a full LinkedIn URL, return as is
  if (url.startsWith('https://www.linkedin.com/') || url.startsWith('https://linkedin.com/')) {
    return url;
  }
  
  // If it's just a LinkedIn username/profile path, add the base URL
  if (url.startsWith('in/') || url.includes('linkedin.com/in/')) {
    return `https://www.linkedin.com/${url.replace('linkedin.com/in/', 'in/')}`;
  }
  
  // If it's a username without the path, add the full path
  return `https://www.linkedin.com/in/${url}`;
}

/**
 * Formats GitHub URL to ensure it's a valid GitHub profile URL
 */
export function formatGitHubUrl(url: string): string {
  if (!url) return '';
  
  // If it's already a full GitHub URL, return as is
  if (url.startsWith('https://github.com/')) {
    return url;
  }
  
  // If it's just a username, add the base URL
  return `https://github.com/${url}`;
}

/**
 * Formats portfolio URL to ensure it's a valid URL
 */
export function formatPortfolioUrl(url: string, username?: string): string {
  if (!url) return '';
  
  // If it's already a full URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If it's just a domain without protocol, add https
  if (url.includes('.') && !url.startsWith('http')) {
    return `https://${url}`;
  }
  
  // If it's a relative path or just a name, it might be a local profile
  // For now, return the original URL and let the component handle it
  return url;
}

/**
 * Formats Twitter URL to ensure it's a valid Twitter profile URL
 */
export function formatTwitterUrl(url: string): string {
  if (!url) return '';
  
  // If it's already a full Twitter URL, return as is
  if (url.startsWith('https://twitter.com/') || url.startsWith('https://x.com/')) {
    return url;
  }
  
  // If it's just a username, add the base URL
  return `https://twitter.com/${url.replace('@', '')}`;
}

/**
 * Formats website URL to ensure it's a valid URL
 */
export function formatWebsiteUrl(url: string): string {
  if (!url) return '';
  
  // If it's already a full URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If it's just a domain without protocol, add https
  if (url.includes('.') && !url.startsWith('http')) {
    return `https://${url}`;
  }
  
  return url;
}

/**
 * Checks if a URL is a local profile URL (our platform)
 */
export function isLocalProfileUrl(url: string): boolean {
  return url.includes('localhost:3000/profile/') || url.includes('profile/');
}

/**
 * Gets the platform logo SVG for portfolio links
 */
export function getPlatformLogoSvg(): string {
  return `<svg class="relative w-5 h-5 text-[#10a37f] group-hover:text-[#0d8f6f] transition-colors" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
  </svg>`;
} 
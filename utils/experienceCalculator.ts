import { ExperienceDetail } from '@/types';

/**
 * Calculate total experience from experience details
 * @param experienceDetails Array of work experience details
 * @returns Formatted experience string (e.g., "5 years", "2.5 years")
 */
export function calculateTotalExperience(experienceDetails: ExperienceDetail[]): string {
  if (!experienceDetails || experienceDetails.length === 0) {
    return '';
  }

  let totalMonths = 0;

  experienceDetails.forEach(experience => {
    const months = parseDurationToMonths(experience.duration);
    totalMonths += months;
  });

  return formatExperienceFromMonths(totalMonths);
}

/**
 * Parse duration string to months
 * @param duration Duration string like "Jan 2020 - Dec 2022", "2 years", "6 months", etc.
 * @returns Number of months
 */
function parseDurationToMonths(duration: string): number {
  if (!duration) return 0;

  const cleanDuration = duration.toLowerCase().trim();

  // Handle "current" or "present"
  const isCurrentJob = cleanDuration.includes('current') || cleanDuration.includes('present');

  // Handle date ranges like "Jan 2020 - Dec 2022" or "Jan 2020 - Present"
  const dateRangeMatch = cleanDuration.match(/(\w+\s+\d{4})\s*[-–]\s*(\w+\s+\d{4}|present|current)/);
  if (dateRangeMatch) {
    const startDate = parseDate(dateRangeMatch[1]);
    const endDate = isCurrentJob ? new Date() : parseDate(dateRangeMatch[2]);
    
    if (startDate && endDate) {
      const diffTime = endDate.getTime() - startDate.getTime();
      const diffMonths = Math.round(diffTime / (1000 * 60 * 60 * 24 * 30.44)); // Average days per month
      return Math.max(0, diffMonths);
    }
  }

  // Handle "X years Y months" format
  const yearsMonthsMatch = cleanDuration.match(/(\d+(?:\.\d+)?)\s*years?\s*(?:(\d+)\s*months?)?/);
  if (yearsMonthsMatch) {
    const years = parseFloat(yearsMonthsMatch[1]) || 0;
    const months = parseInt(yearsMonthsMatch[2]) || 0;
    return Math.round(years * 12 + months);
  }

  // Handle "X months" format
  const monthsMatch = cleanDuration.match(/(\d+(?:\.\d+)?)\s*months?/);
  if (monthsMatch) {
    return Math.round(parseFloat(monthsMatch[1]));
  }

  // Handle "X years" format
  const yearsMatch = cleanDuration.match(/(\d+(?:\.\d+)?)\s*years?/);
  if (yearsMatch) {
    return Math.round(parseFloat(yearsMatch[1]) * 12);
  }

  // Default fallback - assume 1 year if we can't parse
  return 12;
}

/**
 * Parse date string to Date object
 * @param dateStr Date string like "Jan 2020", "January 2020"
 * @returns Date object or null if parsing fails
 */
function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;

  const months = {
    'jan': 0, 'january': 0,
    'feb': 1, 'february': 1,
    'mar': 2, 'march': 2,
    'apr': 3, 'april': 3,
    'may': 4,
    'jun': 5, 'june': 5,
    'jul': 6, 'july': 6,
    'aug': 7, 'august': 7,
    'sep': 8, 'september': 8,
    'oct': 9, 'october': 9,
    'nov': 10, 'november': 10,
    'dec': 11, 'december': 11
  };

  const parts = dateStr.toLowerCase().trim().split(/\s+/);
  if (parts.length === 2) {
    const monthName = parts[0];
    const year = parseInt(parts[1]);
    
    if (months.hasOwnProperty(monthName) && !isNaN(year)) {
      return new Date(year, months[monthName], 1);
    }
  }

  return null;
}

/**
 * Format total months into a readable experience string
 * @param totalMonths Total months of experience
 * @returns Formatted string like "5 years", "2.5 years"
 */
function formatExperienceFromMonths(totalMonths: number): string {
  if (totalMonths === 0) return '';
  
  if (totalMonths < 12) {
    return `${totalMonths} month${totalMonths === 1 ? '' : 's'}`;
  }

  const years = totalMonths / 12;
  
  if (years === Math.floor(years)) {
    // Whole years
    return `${Math.floor(years)} year${Math.floor(years) === 1 ? '' : 's'}`;
  } else {
    // Decimal years
    return `${years.toFixed(1)} years`;
  }
}

/**
 * Get experience level based on total years
 * @param experienceString Experience string like "5 years"
 * @returns Experience level
 */
export function getExperienceLevel(experienceString: string): string {
  if (!experienceString) return 'Entry Level';
  
  const yearsMatch = experienceString.match(/(\d+(?:\.\d+)?)/);
  if (!yearsMatch) return 'Entry Level';
  
  const years = parseFloat(yearsMatch[1]);
  
  if (years < 2) return 'Entry Level';
  if (years < 5) return 'Mid Level';
  if (years < 10) return 'Senior Level';
  return 'Expert Level';
}
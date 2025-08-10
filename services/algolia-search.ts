import algoliasearch from 'algoliasearch/lite';
import { SearchParams, AlgoliaSearchResponse, PublicUser } from '@/types';

// Algolia Search Service for direct frontend search
export class AlgoliaSearchService {
  private searchClient;
  private index;
  
  constructor() {
    // Use search-only key for frontend (read-only)
    this.searchClient = algoliasearch(
      'NIQXR0065F', // Application ID
      '35e6909c47fc60a52be842d593de7967' // Search-only key
    );
    this.index = this.searchClient.initIndex('users');
  }

  /**
   * Search users with Algolia
   */
  async searchUsers(params: SearchParams & { 
    page?: number; 
    filters?: string; 
  } = {}): Promise<AlgoliaSearchResponse> {
    try {
      const {
        q = '',
        skills,
        location,
        looking_for_job,
        limit = 11,
        skip = 0,
        page,
        filters
      } = params;

      // Calculate page number for Algolia
      const algoliaPage = page !== undefined ? page : Math.floor(skip / limit);

      // Build search query
      let searchQuery = q || '';
      
      // Add skills to search query if provided
      if (skills) {
        const skillsArray = skills.split(',').map(s => s.trim());
        // Use OR operator for skills to find profiles with any of the skills
        if (skillsArray.length > 0) {
          searchQuery = searchQuery ? `${searchQuery} ${skillsArray.join(' OR ')}` : skillsArray.join(' OR ');
        }
      }

      // Build filters
      const filterParts: string[] = [];
      
      if (looking_for_job !== undefined) {
        filterParts.push(`is_looking_for_job:${looking_for_job}`);
      }
      
      if (location) {
        // Use partial matching for location
        filterParts.push(`location:"${location}"`);
      }

      // Add custom filters if provided
      if (filters) {
        filterParts.push(filters);
      }

      const searchParams: any = {
        hitsPerPage: limit,
        page: algoliaPage,
        attributesToRetrieve: [
          'user_id', 'name', 'username', 'designation', 'profession',
          'location', 'summary', 'experience', 'is_looking_for_job',
          'profile_picture', 'rating', 'profile_score', 'skills', 'email'
        ],
        typoTolerance: true,
        ignorePlurals: true,
        removeStopWords: true,
      };

      if (filterParts.length > 0) {
        searchParams.filters = filterParts.join(' AND ');
      }

      const results = await this.index.search(searchQuery, searchParams);

      console.log(`🔍 [ALGOLIA_SEARCH] searchUsers with query "${searchQuery}":`, {
        nbHits: results.nbHits,
        hitsLength: results.hits.length,
        page: results.page,
        nbPages: results.nbPages,
        searchParams: JSON.stringify(searchParams, null, 2)
      });

      // Format results to match PublicUser interface
      const formattedHits: PublicUser[] = results.hits.map((hit: any) => ({
        id: hit.user_id || hit.objectID,
        name: hit.name || '',
        username: hit.username || '',
        designation: hit.designation || '',
        profession: hit.profession || '',
        location: hit.location || '',
        summary: hit.summary || '',
        experience: hit.experience || '',
        is_looking_for_job: hit.is_looking_for_job || false,
        profile_picture: hit.profile_picture || null,
        rating: hit.rating || 4.5,
        profile_score: hit.profile_score || 0,
        // Convert Algolia skills (string array) back to Skill objects for frontend compatibility
        skills: hit.skills ? hit.skills.map((skillName: string) => ({
          name: skillName,
          level: 'Intermediate' as const, // Default level since Algolia only stores names
          years: 1 // Default years since this info is not in Algolia
        })) : [],
        email: hit.email || '',
      }));

      return {
        hits: formattedHits,
        total: results.nbHits || 0,
        page: results.page || 0,
        pages: results.nbPages || 0,
        hitsPerPage: results.hitsPerPage || limit,
        processingTimeMS: results.processingTimeMS || 0,
      };

    } catch (error) {
      console.error('❌ [ALGOLIA_SEARCH] Search failed:', error);
      
      return {
        hits: [],
        total: 0,
        page: 0,
        pages: 0,
        hitsPerPage: limit || 11,
        processingTimeMS: 0,
        error: error instanceof Error ? error.message : 'Search failed',
      };
    }
  }

  /**
   * Search by specific skills
   */
  async searchBySkills(skills: string[], limit: number = 20): Promise<PublicUser[]> {
    const response = await this.searchUsers({
      skills: skills.join(','),
      limit
    });
    return response.hits;
  }

  /**
   * Search by location
   */
  async searchByLocation(location: string, limit: number = 20): Promise<PublicUser[]> {
    const response = await this.searchUsers({
      location,
      limit
    });
    return response.hits;
  }

  /**
   * Search only job seekers
   */
  async searchJobSeekers(params: Omit<SearchParams, 'looking_for_job'>): Promise<PublicUser[]> {
    const response = await this.searchUsers({
      ...params,
      looking_for_job: true
    });
    return response.hits;
  }

  /**
   * Get all users (for homepage/explore) with pagination
   * Sorted by profile_score descending (highest scores first)
   */
  async getAllUsers(limit: number = 11, page: number = 0): Promise<AlgoliaSearchResponse> {
    console.log(`🔍 [ALGOLIA_SEARCH] getAllUsers called with limit: ${limit}, page: ${page}`);
    
    // Use the existing searchUsers method with empty query
    // This ensures consistent behavior and formatting
    return this.searchUsers({
      q: '', // Empty query to get all users
      limit,
      page,
      // Don't add filters here - let it work with whatever is in the index
    });
  }

  /**
   * Load more results (for pagination)
   */
  async loadMore(params: SearchParams & { page: number }): Promise<AlgoliaSearchResponse> {
    return this.searchUsers(params);
  }

  /**
   * Test method to verify Algolia connection and data
   */
  async testConnection(): Promise<void> {
    try {
      console.log('🔍 [ALGOLIA_SEARCH] Testing Algolia connection...');
      console.log('🔍 [ALGOLIA_SEARCH] App ID:', 'NIQXR0065F');
      console.log('🔍 [ALGOLIA_SEARCH] Index name:', 'users');
      
      // Try to get index settings
      const settings = await this.index.getSettings();
      console.log('🔍 [ALGOLIA_SEARCH] Index settings:', settings);
      
      // Try a simple search
      const results = await this.index.search('', {
        hitsPerPage: 5,
        page: 0
      });
      
      console.log('🔍 [ALGOLIA_SEARCH] Simple search results:', {
        nbHits: results.nbHits,
        hitsLength: results.hits.length,
        firstHit: results.hits[0] ? {
          objectID: results.hits[0].objectID,
          name: results.hits[0].name || 'NO_NAME',
          hasProfileScore: 'profile_score' in results.hits[0]
        } : null
      });
      
    } catch (error) {
      console.error('❌ [ALGOLIA_SEARCH] Connection test failed:', error);
    }
  }

  /**
   * Search with advanced options (for complex queries)
   */
  async advancedSearch(options: {
    query?: string;
    skills?: string[];
    location?: string;
    lookingForJob?: boolean;
    minProfileScore?: number;
    professions?: string[];
    limit?: number;
    page?: number;
  }): Promise<AlgoliaSearchResponse> {
    const { 
      query = '',
      skills = [],
      location,
      lookingForJob,
      minProfileScore,
      professions = [],
      limit = 11,
      page = 0
    } = options;

    // Build advanced search query
    let searchQuery = query;
    
    // Add skills to search
    if (skills.length > 0) {
      const skillsQuery = skills.join(' OR ');
      searchQuery = searchQuery ? `${searchQuery} ${skillsQuery}` : skillsQuery;
    }

    // Add professions to search
    if (professions.length > 0) {
      const professionsQuery = professions.join(' OR ');
      searchQuery = searchQuery ? `${searchQuery} ${professionsQuery}` : professionsQuery;
    }

    // Build filters
    const filters: string[] = [];
    
    if (lookingForJob !== undefined) {
      filters.push(`is_looking_for_job:${lookingForJob}`);
    }
    
    if (location) {
      filters.push(`location:"${location}"`);
    }

    if (minProfileScore !== undefined) {
      filters.push(`profile_score >= ${minProfileScore}`);
    }

    return this.searchUsers({
      q: searchQuery,
      limit,
      page,
      filters: filters.join(' AND ')
    });
  }
}

// Singleton instance for use across the app
export const algoliaSearchService = new AlgoliaSearchService();
export default AlgoliaSearchService;
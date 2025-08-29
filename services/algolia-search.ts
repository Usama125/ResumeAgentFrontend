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
   * Get facets for filters with counts
   */
  async getFacets(): Promise<{
    locations: Array<{value: string, count: number}>;
    professions: Array<{value: string, count: number}>;
    skills: Array<{value: string, count: number}>;
  }> {
    try {
      const results = await this.index.search('', {
        hitsPerPage: 0,
        facets: ['location', 'profession', 'skills'],
        maxValuesPerFacet: 100
      });

      return {
        locations: Object.entries(results.facets?.location || {}).map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count),
        professions: Object.entries(results.facets?.profession || {}).map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count),
        skills: Object.entries(results.facets?.skills || {}).map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count)
      };
    } catch (error) {
      console.error('Failed to fetch facets:', error);
      return {
        locations: [],
        professions: [],
        skills: []
      };
    }
  }

  /**
   * Search users with Algolia
   */
  async searchUsers(params: SearchParams & { 
    page?: number; 
    filters?: string;
    advancedFilters?: {
      locations?: string[];
      professions?: string[];
      skills?: string[];
      minProfileScore?: number;
      is_looking_for_job?: boolean;
    };
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
        filters,
        advancedFilters
      } = params;

      // Calculate page number for Algolia
      const algoliaPage = page !== undefined ? page : Math.floor(skip / limit);

      // Build search query with smart preprocessing
      let searchQuery = q || '';
      let skillSearchTerms: string[] = [];
      
      // Smart query preprocessing for better search results
      if (searchQuery) {
        // Extract potential skill terms before removing job titles
        const potentialSkills = searchQuery.match(/\b(React|Vue|Angular|Node|Python|Java|JavaScript|TypeScript|PHP|Ruby|Go|Rust|Swift|Kotlin|C\+\+|C#|Django|Flask|Laravel|Spring|Express|MongoDB|PostgreSQL|MySQL|Redis|Docker|Kubernetes|AWS|Azure|GCP|Git|GraphQL|REST|API|HTML|CSS|Sass|Less|Bootstrap|Tailwind|Webpack|Vite|Jest|Cypress|Selenium|Jenkins|Terraform|Ansible|Linux|Ubuntu|Windows|macOS|Android|iOS|Unity|Unreal|Figma|Sketch|Adobe|Photoshop|Illustrator|After Effects|Premiere|Blender|Maya|3ds Max|AutoCAD|SolidWorks|MATLAB|R|SPSS|Tableau|Power BI|Excel|Word|PowerPoint|Outlook|Salesforce|HubSpot|Mailchimp|Shopify|WordPress|Drupal|Joomla|Magento|WooCommerce|Square|Stripe|PayPal|Twilio|SendGrid|Zoom|Slack|Discord|Notion|Asana|Trello|Jira|Confluence|GitHub|GitLab|Bitbucket|SVN|Mercurial)\b/gi);
        
        if (potentialSkills && potentialSkills.length > 0) {
          skillSearchTerms = potentialSkills.map(skill => skill.toLowerCase());
        }
        
        // Remove common job title words that might limit results
        searchQuery = searchQuery
          .replace(/\b(developers?|engineers?|specialists?|experts?|professionals?)\b/gi, '')
          .replace(/\s+/g, ' ')
          .trim();
      }
      
      // Add skills to search query if provided (from legacy SearchParams)
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

      // Add advanced filters
      if (advancedFilters) {
        if (advancedFilters.locations && advancedFilters.locations.length > 0) {
          const locationFilters = advancedFilters.locations.map(loc => `location:"${loc}"`).join(' OR ');
          filterParts.push(`(${locationFilters})`);
        }
        
        if (advancedFilters.professions && advancedFilters.professions.length > 0) {
          const professionFilters = advancedFilters.professions.map(prof => `profession:"${prof}"`).join(' OR ');
          filterParts.push(`(${professionFilters})`);
        }
        
        if (advancedFilters.skills && advancedFilters.skills.length > 0) {
          // For skills in filters, use AND logic - user must have ALL selected skills
          const skillFilters = advancedFilters.skills.map(skill => `skills:"${skill}"`).join(' AND ');
          filterParts.push(`(${skillFilters})`);
        }
        
        if (advancedFilters.minProfileScore !== undefined) {
          filterParts.push(`profile_score >= ${advancedFilters.minProfileScore}`);
        }
        
        if (advancedFilters.is_looking_for_job !== undefined) {
          filterParts.push(`is_looking_for_job:${advancedFilters.is_looking_for_job}`);
        }
      }

      const searchParams: any = {
        hitsPerPage: limit,
        page: algoliaPage,
        attributesToRetrieve: [
          'user_id', 'name', 'username', 'designation', 'profession',
          'location', 'summary', 'experience', 'is_looking_for_job',
          'profile_picture', 'rating', 'profile_score', 'skills', 'email'
        ],
        // Use custom ranking to sort by profile_score descending (highest first)
        ranking: [
          'typo',
          'geo',
          'words',
          'filters',
          'proximity',
          'attribute',
          'exact',
          'custom'
        ],
        typoTolerance: true,
        ignorePlurals: true,
        removeStopWords: true,
      };

      // If we detected skill terms in the search query, use a more precise approach
      if (skillSearchTerms.length > 0) {
        // Instead of relying on text search, convert skill terms to skill filters for precision
        const detectedSkillFilters = skillSearchTerms.map(skill => {
          // Match common skill variations
          const skillVariations = [
            skill,
            skill.toLowerCase(),
            skill + '.js',
            skill + 'js',
            skill.replace('js', '.js'),
            skill.replace('.js', 'js')
          ];
          
          // Create an OR filter for all variations of this skill
          return skillVariations.map(variation => `skills:"${variation}"`).join(' OR ');
        });
        
        // Add the skill filters to our existing filters
        if (detectedSkillFilters.length > 0) {
          filterParts.push(`(${detectedSkillFilters.join(' OR ')})`);
          // Clear the search query since we're using filters instead for better precision
          searchQuery = '';
          console.log('🔍 [ALGOLIA_SEARCH] Converted skill search to skill filters:', detectedSkillFilters);
        }
      }

      if (filterParts.length > 0) {
        searchParams.filters = filterParts.join(' AND ');
      }

      const results = await this.index.search(searchQuery, searchParams);

      console.log(`🔍 [ALGOLIA_SEARCH] searchUsers with query "${searchQuery}":`, {
        originalQuery: params.q,
        finalSearchQuery: searchQuery,
        nbHits: results.nbHits,
        hitsLength: results.hits.length,
        page: results.page,
        nbPages: results.nbPages,
        appliedFilters: filterParts.join(' AND '),
        advancedFilters: params.advancedFilters,
        searchParams: JSON.stringify(searchParams, null, 2)
      });

      // Debug: Log first few results to understand the data
      if (results.hits.length > 0) {
        console.log('🔍 [ALGOLIA_SEARCH] Sample results:');
        results.hits.slice(0, 3).forEach((hit: any, index: number) => {
          console.log(`   ${index + 1}. Name: ${hit.name}, Skills: ${hit.skills ? hit.skills.join(', ') : 'None'}, Location: ${hit.location}, Profession: ${hit.profession}`);
        });
      }

      // Debug: Log profile scores of first few results to verify sorting
      if (results.hits.length > 0) {
        console.log('🔍 [ALGOLIA_SEARCH] First 5 results profile scores:');
        results.hits.slice(0, 5).forEach((hit: any, index: number) => {
          console.log(`   ${index + 1}. ${hit.name || 'Unknown'} - Profile Score: ${hit.profile_score || 'N/A'}`);
        });
      }

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
      
      // Check searchable attributes configuration
      const settings = await this.index.getSettings();
      console.log('🔍 [ALGOLIA_SEARCH] Index settings:', {
        searchableAttributes: settings.searchableAttributes,
        attributesForFaceting: settings.attributesForFaceting,
        ranking: settings.ranking,
        customRanking: settings.customRanking
      });
      
      // Try a simple search to see all data
      const allResults = await this.index.search('', {
        hitsPerPage: 5,
        page: 0
      });
      
      console.log('🔍 [ALGOLIA_SEARCH] All users sample:', {
        nbHits: allResults.nbHits,
        hitsLength: allResults.hits.length,
        sampleData: allResults.hits.slice(0, 2).map((hit: any) => ({
          name: hit.name,
          skills: hit.skills,
          profession: hit.profession,
          designation: hit.designation,
          location: hit.location
        }))
      });

      // Test exact user issue - "React developers" search
      const reactResults = await this.index.search('React developers', {
        hitsPerPage: 24,
        page: 0
      });
      
      console.log('🔍 [ALGOLIA_SEARCH] "React developers" search (user issue):', {
        nbHits: reactResults.nbHits,
        hitsLength: reactResults.hits.length,
        query: 'React developers',
        sampleResults: reactResults.hits.slice(0, 5).map((hit: any) => ({
          name: hit.name,
          skills: hit.skills,
          profession: hit.profession,
          designation: hit.designation,
          location: hit.location
        }))
      });

      // Test just "React" search
      const reactOnlyResults = await this.index.search('React', {
        hitsPerPage: 24,
        page: 0
      });
      
      console.log('🔍 [ALGOLIA_SEARCH] Just "React" search:', {
        nbHits: reactOnlyResults.nbHits,
        hitsLength: reactOnlyResults.hits.length,
        sampleResults: reactOnlyResults.hits.slice(0, 5).map((hit: any) => ({
          name: hit.name,
          skills: hit.skills,
          profession: hit.profession,
          designation: hit.designation,
          location: hit.location
        }))
      });

      // Test location filter specifically  
      const locationResults = await this.index.search('', {
        hitsPerPage: 10,
        page: 0,
        filters: 'location:"San Francisco, CA, US"'
      });
      
      console.log('🔍 [ALGOLIA_SEARCH] San Francisco filter results:', {
        nbHits: locationResults.nbHits,
        hitsLength: locationResults.hits.length,
        sampleData: locationResults.hits.slice(0, 3).map((hit: any) => ({
          name: hit.name,
          skills: hit.skills,
          profession: hit.profession,
          designation: hit.designation,
          location: hit.location
        }))
      });

      // Test combined search + filter (the exact user scenario)
      const combinedResults = await this.index.search('React developers', {
        hitsPerPage: 24,
        page: 0,
        filters: 'location:"San Francisco, CA, US"'
      });
      
      console.log('🔍 [ALGOLIA_SEARCH] Combined "React developers" + San Francisco (user scenario):', {
        nbHits: combinedResults.nbHits,
        hitsLength: combinedResults.hits.length,
        sampleData: combinedResults.hits.slice(0, 3).map((hit: any) => ({
          name: hit.name,
          skills: hit.skills,
          profession: hit.profession,
          designation: hit.designation,
          location: hit.location
        }))
      });

      // Test different skill search patterns
      const skillInArraySearch = await this.index.search('', {
        hitsPerPage: 10,
        page: 0,
        filters: 'skills:"React"'
      });
      
      console.log('🔍 [ALGOLIA_SEARCH] Skills filter "React":', {
        nbHits: skillInArraySearch.nbHits,
        hitsLength: skillInArraySearch.hits.length,
        sampleData: skillInArraySearch.hits.slice(0, 3).map((hit: any) => ({
          name: hit.name,
          skills: hit.skills,
          profession: hit.profession,
          designation: hit.designation,
          location: hit.location
        }))
      });
      
    } catch (error) {
      console.error('❌ [ALGOLIA_SEARCH] Connection test failed:', error);
    }
  }

  /**
   * Manual debug test for browser console
   * Run: window.algoliaDebugTest()
   */
  async manualDebugTest(): Promise<void> {
    console.clear();
    console.log('🚀 MANUAL DEBUG TEST - User reported issues');
    console.log('===================================================');
    
    try {
      // Test 1: "React developers" search (user reported only 4 results)
      console.log('\n📋 TEST 1: "React developers" search (should show more than 4 results)');
      const test1 = await this.index.search('React developers', {
        hitsPerPage: 24,
        page: 0
      });
      console.log(`Result: ${test1.nbHits} total hits, ${test1.hits.length} returned`);
      console.log('Sample names:', test1.hits.slice(0, 5).map(hit => hit.name));

      // Test 2: Just "React" search to compare
      console.log('\n📋 TEST 2: Just "React" search (for comparison)');
      const test2 = await this.index.search('React', {
        hitsPerPage: 24,
        page: 0
      });
      console.log(`Result: ${test2.nbHits} total hits, ${test2.hits.length} returned`);
      console.log('Sample names:', test2.hits.slice(0, 5).map(hit => hit.name));

      // Test 3: Location filter only (San Francisco)
      console.log('\n📋 TEST 3: San Francisco location filter only');
      const test3 = await this.index.search('', {
        hitsPerPage: 24,
        page: 0,
        filters: 'location:"San Francisco, CA, US"'
      });
      console.log(`Result: ${test3.nbHits} total hits, ${test3.hits.length} returned`);
      console.log('Sample names & locations:', test3.hits.slice(0, 5).map(hit => ({ name: hit.name, location: hit.location })));

      // Test 4: Combined React + San Francisco (user reported wrong results)
      console.log('\n📋 TEST 4: "React developers" + San Francisco filter (user issue)');
      const test4 = await this.index.search('React developers', {
        hitsPerPage: 24,
        page: 0,
        filters: 'location:"San Francisco, CA, US"'
      });
      console.log(`Result: ${test4.nbHits} total hits, ${test4.hits.length} returned`);
      console.log('Sample results:', test4.hits.slice(0, 3).map(hit => ({
        name: hit.name,
        skills: hit.skills,
        location: hit.location
      })));

      console.log('\n✅ Manual debug test completed. Check results above.');
      
    } catch (error) {
      console.error('❌ Manual debug test failed:', error);
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
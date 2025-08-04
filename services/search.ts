import { publicAPI } from '@/lib/secure-api-client';
import { SearchParams, SearchResponse, PublicUser } from '@/types';

// Search service
export class SearchService {
  
  // Search users with filters
  static async searchUsers(params: SearchParams, listing_only: boolean = false): Promise<PublicUser[]> {
    const endpoint = '/api/v1/search/users';
    const queryParams = new URLSearchParams();
    
    if (params.q) queryParams.append('q', params.q);
    if (params.skills) queryParams.append('skills', params.skills);
    if (params.location) queryParams.append('location', params.location);
    if (params.looking_for_job !== undefined) queryParams.append('looking_for_job', params.looking_for_job.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.skip) queryParams.append('skip', params.skip.toString());
    if (listing_only) queryParams.append('listing_only', 'true');
    
    const fullEndpoint = queryParams.toString() ? `${endpoint}?${queryParams.toString()}` : endpoint;
    
    return publicAPI.get<PublicUser[]>(fullEndpoint);
  }

  // Get all users (for featured section)
  static async getAllUsers(limit: number = 12, skip: number = 0, listing_only: boolean = false): Promise<PublicUser[]> {
    const queryParams = new URLSearchParams();
    queryParams.append('limit', limit.toString());
    queryParams.append('skip', skip.toString());
    if (listing_only) queryParams.append('listing_only', 'true');
    
    return publicAPI.get<PublicUser[]>(`/api/v1/users/?${queryParams.toString()}`);
  }

  // Search by specific skills
  static async searchBySkills(skills: string[], limit: number = 20, listing_only: boolean = false): Promise<PublicUser[]> {
    return this.searchUsers({
      skills: skills.join(','),
      limit
    }, listing_only);
  }

  // Search by location
  static async searchByLocation(location: string, limit: number = 20, listing_only: boolean = false): Promise<PublicUser[]> {
    return this.searchUsers({
      location,
      limit
    }, listing_only);
  }

  // Search only job seekers
  static async searchJobSeekers(params: Omit<SearchParams, 'looking_for_job'>): Promise<PublicUser[]> {
    return this.searchUsers({
      ...params,
      looking_for_job: true
    });
  }
}

export default SearchService;
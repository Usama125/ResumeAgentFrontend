import { publicAPI } from '@/lib/secure-api-client';
import { SearchParams, SearchResponse, PublicUser } from '@/types';

// Search service
export class SearchService {
  
  // Search users with filters
  static async searchUsers(params: SearchParams): Promise<PublicUser[]> {
    const queryParams = new URLSearchParams();
    
    if (params.q) queryParams.set('q', params.q);
    if (params.skills) queryParams.set('skills', params.skills);
    if (params.location) queryParams.set('location', params.location);
    if (params.looking_for_job !== undefined) {
      queryParams.set('looking_for_job', params.looking_for_job.toString());
    }
    if (params.limit) queryParams.set('limit', params.limit.toString());
    if (params.skip) queryParams.set('skip', params.skip.toString());
    
    const queryString = queryParams.toString();
    const endpoint = `/search/users${queryString ? `?${queryString}` : ''}`;
    
    return publicAPI.get<PublicUser[]>(endpoint);
  }

  // Get all users (for featured section)
  static async getAllUsers(limit: number = 12, skip: number = 0): Promise<PublicUser[]> {
    return publicAPI.get<PublicUser[]>(`/users/?limit=${limit}&skip=${skip}`);
  }

  // Search by specific skills
  static async searchBySkills(skills: string[], limit: number = 20): Promise<PublicUser[]> {
    return this.searchUsers({
      skills: skills.join(','),
      limit
    });
  }

  // Search by location
  static async searchByLocation(location: string, limit: number = 20): Promise<PublicUser[]> {
    return this.searchUsers({
      location,
      limit
    });
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
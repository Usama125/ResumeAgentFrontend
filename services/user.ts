import { authAPI, apiClient, publicAPI } from '@/lib/secure-api-client';
import { User, PublicUser, ProfileUpdateData } from '@/types';

// User management service
export class UserService {
  
  // Get current user profile (authenticated)
  static async getCurrentUser(token?: string): Promise<User> {
    return authAPI.get<User>('/users/me', token);
  }

  // Get public user profile by ID
  static async getUserById(userId: string): Promise<PublicUser> {
    return publicAPI.get<PublicUser>(`/users/${userId}`);
  }

  // Update current user profile
  static async updateProfile(updateData: ProfileUpdateData, token?: string): Promise<User> {
    // Handle file upload separately if profile picture is included
    if (updateData.profile_picture) {
      const { profile_picture, ...otherData } = updateData;
      
      // Upload profile picture first
      await apiClient.uploadFile<any>(
        '/users/me/profile-picture',
        profile_picture,
        {},
        token,
        false // Not a secure endpoint
      );
      
      // Update other data
      if (Object.keys(otherData).length > 0) {
        return authAPI.put<User>('/users/me', otherData, token);
      } else {
        // If only uploading picture, fetch updated user
        return this.getCurrentUser(token);
      }
    } else {
      // Update without file upload
      return authAPI.put<User>('/users/me', updateData, token);
    }
  }

  // Update user's work preferences
  static async updateWorkPreferences(workPreferences: any, token?: string): Promise<User> {
    return authAPI.put<User>('/users/me', { work_preferences: workPreferences }, token);
  }

  // Upload profile picture
  static async uploadProfilePicture(file: File, token?: string): Promise<{ success: boolean; profile_picture_url: string }> {
    return apiClient.uploadFile<{ success: boolean; profile_picture_url: string }>(
      '/users/me/profile-picture',
      file,
      {},
      token,
      false // Not a secure endpoint
    );
  }

  // Delete profile picture
  static async deleteProfilePicture(token?: string): Promise<{ success: boolean; message: string }> {
    return authAPI.delete<{ success: boolean; message: string }>(
      '/users/me/profile-picture',
      token
    );
  }

  // Toggle job seeking status
  static async toggleJobSeeking(isLookingForJob: boolean, token?: string): Promise<User> {
    return authAPI.put<User>('/users/me', { is_looking_for_job: isLookingForJob }, token);
  }

  // Get featured users (public endpoint)
  static async getFeaturedUsers(limit: number = 12, skip: number = 0, listing_only: boolean = false): Promise<PublicUser[]> {
    const queryParams = new URLSearchParams();
    queryParams.append('limit', limit.toString());
    queryParams.append('skip', skip.toString());
    if (listing_only) queryParams.append('listing_only', 'true');
    
    return publicAPI.get<PublicUser[]>(`/users/?${queryParams.toString()}`);
  }

  // Update specific profile section
  static async updateProfileSection(sectionName: string, updateData: any, token?: string): Promise<User> {
    return authAPI.put<User>(`/users/me/sections/${sectionName}`, updateData, token);
  }

  // Reorder skills
  static async reorderSkills(skillIds: string[], token?: string): Promise<User> {
    return authAPI.put<User>(`/users/me/skills/reorder`, { skill_ids: skillIds }, token);
  }

  // Reorder sections
  static async reorderSections(sectionOrder: string[], token?: string): Promise<User> {
    console.log('🔧 UserService - sending section order request body');
    console.log('🔧 UserService - sending:', { section_order: sectionOrder });
    
    // Send request body with section_order field as expected by backend
    return authAPI.put<User>(`/users/me/sections/reorder`, { section_order: sectionOrder }, token);
  }

  // Delete specific profile section
  static async deleteProfileSection(sectionName: string, token?: string): Promise<User> {
    return authAPI.delete<User>(`/users/me/sections/${sectionName}`, token);
  }
}

// Export individual functions for easier imports
export const updateProfileSection = UserService.updateProfileSection;
export const deleteProfileSection = UserService.deleteProfileSection;
export const reorderSkills = UserService.reorderSkills;
export const reorderSections = UserService.reorderSections;
export const getCurrentUser = UserService.getCurrentUser;
export const getUserById = UserService.getUserById;
export const updateProfile = UserService.updateProfile;
export const updateWorkPreferences = UserService.updateWorkPreferences;
export const uploadProfilePicture = UserService.uploadProfilePicture;
export const deleteProfilePicture = UserService.deleteProfilePicture;
export const toggleJobSeeking = UserService.toggleJobSeeking;
export const getFeaturedUsers = UserService.getFeaturedUsers;

export default UserService;
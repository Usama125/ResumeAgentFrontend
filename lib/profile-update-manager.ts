// Centralized profile update management system
// This ensures all profile updates are handled consistently across the app

import ProfileOptimizer from './profile-optimization';

interface ProfileUpdateOptions {
  clearCache?: boolean;
  refreshAuthContext?: boolean;
  updateLocalStorage?: boolean;
  notifyCallbacks?: boolean;
}

class ProfileUpdateManager {
  private static instance: ProfileUpdateManager;
  private updateCallbacks: Set<(user: any) => void> = new Set();

  static getInstance(): ProfileUpdateManager {
    if (!ProfileUpdateManager.instance) {
      ProfileUpdateManager.instance = new ProfileUpdateManager();
    }
    return ProfileUpdateManager.instance;
  }

  // Register a callback to be notified when profile is updated
  registerUpdateCallback(callback: (user: any) => void): () => void {
    this.updateCallbacks.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.updateCallbacks.delete(callback);
    };
  }

  // Notify all registered callbacks of profile update
  private notifyUpdateCallbacks(user: any) {
    this.updateCallbacks.forEach(callback => {
      try {
        callback(user);
      } catch (error) {
        console.error('Error in profile update callback:', error);
      }
    });
  }

  // Centralized profile update handler
  async handleProfileUpdate(
    updatedUser: any, 
    options: ProfileUpdateOptions = {}
  ): Promise<void> {
    const {
      clearCache = true,
      refreshAuthContext = true,
      updateLocalStorage = true,
      notifyCallbacks = true
    } = options;

    try {
      // Clear profile cache if requested
      if (clearCache && updatedUser?.username) {
        ProfileOptimizer.clearProfileCache(updatedUser.username);
      }

      // Update localStorage if requested
      if (updateLocalStorage && typeof window !== 'undefined') {
        localStorage.setItem('user_data', JSON.stringify(updatedUser));
      }

      // Note: AuthContext refresh is handled by the components that register callbacks
      // The profile update manager notifies all registered callbacks with the updated user data

      // Notify all registered callbacks if requested
      if (notifyCallbacks) {
        this.notifyUpdateCallbacks(updatedUser);
      }

      // Force a small delay to ensure all components have time to process the update
      // This helps with theme changes and mobile/desktop transitions
      await new Promise(resolve => setTimeout(resolve, 10));

      console.log('✅ Profile update handled successfully:', {
        userId: updatedUser?.id,
        username: updatedUser?.username,
        clearCache,
        refreshAuthContext,
        updateLocalStorage,
        notifyCallbacks
      });

    } catch (error) {
      console.error('❌ Error handling profile update:', error);
    }
  }

  // Clear all profile caches for a user
  clearUserCaches(username: string): void {
    if (username) {
      ProfileOptimizer.clearProfileCache(username);
    }
  }

  // Force refresh all profile data
  async forceRefreshProfile(user: any): Promise<void> {
    if (user?.username) {
      // Clear all caches
      this.clearUserCaches(user.username);
      
      // Notify all callbacks with current user data
      this.notifyUpdateCallbacks(user);
    }
  }
}

// Export singleton instance
export const profileUpdateManager = ProfileUpdateManager.getInstance();

// Export class for testing
export { ProfileUpdateManager };

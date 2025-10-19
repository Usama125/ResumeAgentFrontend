import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

/**
 * Centralized hook for managing onboarding status and routing logic
 * This replaces the scattered onboarding checks across different components
 */
export const useOnboardingStatus = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  // Calculate onboarding status
  const onboardingStatus = useMemo(() => {
    if (!user) {
      return {
        needsOnboarding: false,
        isCompleted: false,
        isSkipped: false,
        shouldRedirect: false,
        redirectPath: null
      };
    }

    const isCompleted = user.onboarding_completed === true;
    const isSkipped = user.onboarding_skipped === true;
    const needsOnboarding = !isCompleted && !isSkipped;

    return {
      needsOnboarding,
      isCompleted,
      isSkipped,
      shouldRedirect: needsOnboarding,
      redirectPath: needsOnboarding ? '/onboarding' : '/profile'
    };
  }, [user]);

  // Auto-redirect logic (only for authenticated users)
  useEffect(() => {
    if (!loading && isAuthenticated && user && onboardingStatus.shouldRedirect) {
      console.log('🔄 [ONBOARDING STATUS] Redirecting to onboarding:', {
        userId: user.id,
        onboarding_completed: user.onboarding_completed,
        onboarding_skipped: user.onboarding_skipped,
        redirectPath: onboardingStatus.redirectPath
      });
      router.push(onboardingStatus.redirectPath!);
    }
  }, [loading, isAuthenticated, user, onboardingStatus.shouldRedirect, onboardingStatus.redirectPath, router]);

  return {
    ...onboardingStatus,
    user,
    isAuthenticated,
    loading
  };
};

/**
 * Hook for checking if user can access profile features
 * This is separate from onboarding status and focuses on profile completion
 */
export const useProfileAccess = () => {
  const { user } = useAuth();

  const canAccessProfile = useMemo(() => {
    if (!user) return false;
    
    // User can access profile if they've completed OR skipped onboarding
    return user.onboarding_completed || user.onboarding_skipped;
  }, [user]);

  const canAccessFeatures = useMemo(() => {
    if (!user) return false;
    
    // Features require both onboarding completion/skip AND profile completion
    // This is where the 50% profile score check should be applied
    return canAccessProfile;
  }, [user, canAccessProfile]);

  return {
    canAccessProfile,
    canAccessFeatures,
    user
  };
};

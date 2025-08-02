"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { UserService } from "@/services/user"
import { User as UserType } from "@/types"
import { useAuth } from "@/context/AuthContext"
import AuthService from "@/services/auth"
import EditProfileModal from "@/components/EditProfileModal"
import EditProfileModalMobile from "@/components/EditProfileModalMobile"
import EditPhotoModal from "@/components/EditPhotoModal"
import EditPhotoModalMobile from "@/components/EditPhotoModalMobile"
import Header from "@/components/Header"
import { useTheme } from "@/context/ThemeContext"
import { getThemeClasses } from "@/utils/theme"
import DesktopProfileView from "@/components/profile/DesktopProfileView"
import MobileProfileView from "@/components/profile/MobileProfileView"
import EditModeToggle from "@/components/EditModeToggle"
import AboutSectionEditModal from "@/components/AboutSectionEditModal"
import SkillsSectionEditModal from "@/components/SkillsSectionEditModal"
import useRateLimit from '@/hooks/useRateLimit'
import RateLimitModal from "@/components/RateLimitModal"


// Generate suggested questions based on user data
const generateSuggestedQuestions = (user: UserType): string[] => {
  const firstName = user.name.split(' ')[0];
  const topSkill = (user.skills && user.skills.length > 0) ? user.skills[0].name : 'technology';
  
  return [
    `What are my strongest technical skills?`,
    `Tell me about my experience with ${topSkill}`,
    `How can I improve my profile?`,
    `What kind of opportunities would suit me?`,
    `What makes me stand out as a candidate?`,
  ];
};

export default function CurrentUserProfilePage() {
  const [message, setMessage] = useState("")
  const [chatHistory, setChatHistory] = useState<Array<{ type: "user" | "ai"; content: string }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [profileLoading, setProfileLoading] = useState(true)
  const [user, setUser] = useState<UserType | null>(null)
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isEditPhotoModalOpen, setIsEditPhotoModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isAboutEditModalOpen, setIsAboutEditModalOpen] = useState(false)
  const [isSkillsEditModalOpen, setIsSkillsEditModalOpen] = useState(false)
  const [sectionOrder, setSectionOrder] = useState<string[]>([])
  const [isMounted, setIsMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [authTimeout, setAuthTimeout] = useState(false)
  const router = useRouter()
  const { user: authUser, isAuthenticated, loading: authLoading, refreshUser, updateUser } = useAuth()
  const { isDark } = useTheme()
  const { showRateLimitModal, hideRateLimitModal, rateLimitState } = useRateLimit();

  // Handle client-side mounting to prevent hydration issues
  useEffect(() => {
    setIsMounted(true)
    
    // Simple mobile detection
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Add timeout for auth loading to prevent indefinite waiting
  useEffect(() => {
    if (authLoading) {
      const timeout = setTimeout(() => {
        console.log('🕐 PROFILE PAGE - Auth loading timeout after 8 seconds');
        setAuthTimeout(true);
      }, 8000); // 8 second timeout

      return () => clearTimeout(timeout);
    } else {
      setAuthTimeout(false);
    }
  }, [authLoading])

  // Protect route - redirect to auth if not authenticated
  useEffect(() => {
    console.log('🔍 PROFILE PAGE - Auth check useEffect triggered', {
      authLoading,
      isAuthenticated,
      userExists: !!authUser,
      userId: authUser?.id
    });
    
    // Don't redirect while auth is still loading (unless timeout occurred)
    if (authLoading && !authTimeout) {
      console.log('🔍 PROFILE PAGE - Auth still loading, waiting...');
      return;
    }

    if (authTimeout) {
      console.log('🕐 PROFILE PAGE - Auth loading timeout, proceeding with available data');
    }
    
    if (!isAuthenticated) {
      console.log('🚨 PROFILE PAGE - User not authenticated, redirecting to auth page');
      router.push("/auth")
      return
    }
    
    console.log('🔍 PROFILE PAGE - User is authenticated');
  }, [authLoading, authTimeout, isAuthenticated, router])

  // Protect route - redirect to onboarding if not completed
  useEffect(() => {
    console.log('🔍 PROFILE PAGE - Onboarding check useEffect triggered', {
      authLoading,
      isAuthenticated,
      userExists: !!authUser,
      onboarding_completed: authUser?.onboarding_completed,
      progress_completed: authUser?.onboarding_progress?.completed,
      userId: authUser?.id
    });
    
    // Don't check onboarding while auth is still loading (unless timeout occurred)
    if (authLoading && !authTimeout) {
      console.log('🔍 PROFILE PAGE - Auth still loading, skipping onboarding check...');
      return;
    }
    
    if (isAuthenticated && authUser) {
      // Check if user completed onboarding (either top-level field or progress.completed)
      const isOnboardingCompleted = authUser.onboarding_completed || authUser.onboarding_progress?.completed;
      
      console.log('🔍 PROFILE PAGE - Onboarding completion check:', { isOnboardingCompleted });
      
      if (!isOnboardingCompleted) {
        console.log('🚨 PROFILE PAGE - User onboarding not completed, redirecting to onboarding');
        router.push("/onboarding")
        return
      }
      
      console.log('🔍 PROFILE PAGE - User onboarding completed, staying on profile page');
    } else if (!authLoading) {
      console.log('🔍 PROFILE PAGE - Not authenticated or no user data (auth loading complete)');
    }
  }, [authLoading, authTimeout, isAuthenticated, authUser, router])

  // Optimized user data fetching - use auth context data directly to avoid duplicate API calls
  useEffect(() => {
    const initializeUserData = () => {
      if (!isAuthenticated || !authUser) {
        return;
      }
      
      console.log('🔄 PROFILE PAGE - Initializing user data from auth context...', {
        authLoading,
        authTimeout,
        userExists: !!authUser,
        onboardingCompleted: authUser.onboarding_completed
      });
      
      // Use auth context data directly since it's already fresh from AuthContext
      console.log('✅ PROFILE PAGE - Using auth context user data (avoiding duplicate API calls)');
      setUser(authUser)
      setSuggestedQuestions(generateSuggestedQuestions(authUser))
      setProfileLoading(false)
    }

    // Initialize user data when auth is ready (including timeout scenario)
    if (isAuthenticated && authUser && (!authLoading || authTimeout)) {
      initializeUserData()
    }
  }, [isAuthenticated, authUser, authLoading, authTimeout])

  // Optimized loading check - minimize loading states and flicker
  const isOnboardingCompleted = authUser?.onboarding_completed || authUser?.onboarding_progress?.completed;
  
  // Only show loading if:
  // 1. Component hasn't mounted yet
  // 2. Auth is loading AND we haven't timed out
  // 3. We have a valid user but profile data is still loading
  const shouldShowLoading = !isMounted || 
    (authLoading && !authTimeout) || 
    (!isAuthenticated && !authTimeout) ||
    (isAuthenticated && authUser && isOnboardingCompleted && profileLoading && !user);

  console.log('🔍 PROFILE PAGE - Loading state calculation:', {
    isMounted,
    authLoading,
    authTimeout,
    isAuthenticated,
    profileLoading,
    hasUser: !!user,
    hasAuthUser: !!authUser,
    isOnboardingCompleted,
    shouldShowLoading
  });
  
  if (shouldShowLoading) {
    // CSS-based theme-aware loading screen that works immediately
    return (
      <div className="loading-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-[#10a37f]/30 border-t-[#10a37f] rounded-full animate-spin"></div>
          <p className="loading-text">
            {!isMounted ? "Initializing..." 
             : authLoading ? "Loading..." 
             : !isAuthenticated ? "Checking authentication..." 
             : (authUser && !isOnboardingCompleted) ? "Redirecting..." 
             : "Loading your profile..."}
          </p>
        </div>
      </div>
    )
  }
  
  // Don't render content if user data is not available yet
  if (!user) {
    return null;
  }


  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || message
    if (!textToSend.trim() || !user) return

    setIsLoading(true)
    setChatHistory((prev) => [...prev, { type: "user", content: textToSend }])
    setMessage("")

    try {
      // Call the current user chat API
      const token = AuthService.getToken()
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch(`/api/chat/current-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: textToSend }),
      })

      if (!response.ok) {
        // Try to parse rate limit error
        if (response.status === 429) {
          const errorData = await response.json().catch(() => ({}));
          const rateLimitError: import('@/types').APIError = {
            type: 'RATE_LIMIT',
            message: errorData.detail?.message || errorData.message || 'Rate limit exceeded',
            rateLimitData: {
              remaining: errorData.detail?.remaining || 0,
              resetInSeconds: errorData.detail?.reset_in_seconds || 3600,
              isAuthenticated: errorData.detail?.is_authenticated || false,
              rateLimitType: errorData.detail?.rate_limit_type || 'chat'
            }
          };
          showRateLimitModal(rateLimitError);
          setIsLoading(false);
          return;
        }
        throw new Error('Failed to get chat response')
      }

      const data = await response.json()
      setChatHistory((prev) => [...prev, { type: "ai", content: data.response }])
    } catch (error) {
      console.error('Error sending message:', error)
      setChatHistory((prev) => [
        ...prev,
        { type: "ai", content: "I'm sorry, I'm having trouble responding right now. Please try again later." }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhotoUpdate = (newPhotoUrl: string | null) => {
    if (user) {
      // Update local state
      setUser({
        ...user,
        profile_picture: newPhotoUrl
      })
      
      // Update global auth context
      updateUser({ profile_picture: newPhotoUrl })
    }
  }

  const handleAboutUpdate = (newSummary: string) => {
    if (user) {
      // Update local state
      setUser({
        ...user,
        summary: newSummary
      })
      
      // Update global auth context
      updateUser({ summary: newSummary })
    }
  }

  const handleSkillsUpdate = (newSkills: any[]) => {
    if (user) {
      // Update local state
      setUser({
        ...user,
        skills: newSkills
      })
      
      // Update global auth context
      updateUser({ skills: newSkills })
    }
  }

  const handleEditModeToggle = (newEditMode: boolean) => {
    setIsEditMode(newEditMode)
  }

  const handleSectionOrderChange = async (newSectionOrder: string[]) => {
    if (!user) return
    
    console.log('🔧 Attempting to update section order:', newSectionOrder)
    
    try {
      // Save to backend first, then update local state
      await UserService.reorderSections(newSectionOrder)
      
      // Update both local state and auth context
      setSectionOrder(newSectionOrder)
      updateUser({ section_order: newSectionOrder })
      
      console.log('✅ Section order updated successfully:', newSectionOrder)
    } catch (error: any) {
      console.error('❌ Error updating section order:', error)
      console.error('❌ Full error details:', error)
      
      // Log the exact request and response for debugging
      if (error.detail) {
        console.error('❌ Backend error detail:', error.detail)
      }
      if (error.responseData) {
        console.error('❌ Backend response:', error.responseData)
      }
      
      // Let's try to inspect the exact array we're sending
      console.error('❌ Exact array sent:', JSON.stringify(newSectionOrder))
      console.error('❌ Array length:', newSectionOrder.length)
      newSectionOrder.forEach((section, index) => {
        console.error(`❌ Section ${index}: "${section}" (length: ${section.length})`)
      })
    }
  }

  const handleAddSection = (sectionId: string) => {
    console.log('Add section:', sectionId)
    
    // Add the section to the user's section order if it doesn't exist
    if (user) {
      const currentOrder = user.section_order || ['about', 'skills', 'experience', 'projects', 'education', 'awards', 'languages', 'publications', 'volunteer', 'interests']
      if (!currentOrder.includes(sectionId)) {
        const newOrder = [...currentOrder, sectionId]
        setSectionOrder(newOrder)
        
        // Save to backend
        UserService.reorderSections(newOrder).then(() => {
          updateUser({ section_order: newOrder })
          console.log(`Section ${sectionId} added to profile`)
        }).catch(error => {
          console.error('Error updating section order:', error)
        })
      }
    }
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#212121] text-white' : 'bg-gray-50 text-gray-900'} overflow-x-hidden`}>
      <Header 
        variant="profile"
        showBackButton={true}
        onEditProfile={() => setIsEditModalOpen(true)}
        profileData={{
          name: user?.name || '',
          profile_picture: user?.profile_picture || '',
          is_looking_for_job: user?.is_looking_for_job
        }}
      />

      {/* Main Content */}
      {isMobile ? (
        <MobileProfileView
          user={user}
          chatHistory={chatHistory}
          setChatHistory={setChatHistory}
          suggestedQuestions={suggestedQuestions}
          message={message}
          setMessage={setMessage}
          isLoading={isLoading}
          handleSendMessage={handleSendMessage}
          isCurrentUser={true}
          onEditPhoto={() => setIsEditPhotoModalOpen(true)}
          isEditMode={isEditMode}
          onEditAbout={() => setIsAboutEditModalOpen(true)}
          onEditSkills={() => setIsSkillsEditModalOpen(true)}
          onEditModeToggle={handleEditModeToggle}
          onSectionOrderChange={handleSectionOrderChange}
          onAddSection={handleAddSection}
        />
      ) : (
        <DesktopProfileView
          user={user}
          chatHistory={chatHistory}
          setChatHistory={setChatHistory}
          suggestedQuestions={suggestedQuestions}
          message={message}
          setMessage={setMessage}
          isLoading={isLoading}
          handleSendMessage={handleSendMessage}
          isCurrentUser={true}
          onEditPhoto={() => setIsEditPhotoModalOpen(true)}
          isEditMode={isEditMode}
          onEditAbout={() => setIsAboutEditModalOpen(true)}
          onEditSkills={() => setIsSkillsEditModalOpen(true)}
          onEditModeToggle={handleEditModeToggle}
          onSectionOrderChange={handleSectionOrderChange}
          onAddSection={handleAddSection}
        />
      )}

      {/* Edit Profile Modal - Responsive */}
      {isMobile ? (
        <EditProfileModalMobile 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
        />
      ) : (
        <EditProfileModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
        />
      )}

      {/* Edit Photo Modal - Responsive */}
      {isMobile ? (
        <EditPhotoModalMobile
          isOpen={isEditPhotoModalOpen}
          onClose={() => setIsEditPhotoModalOpen(false)}
          currentPhotoUrl={user?.profile_picture}
          onPhotoUpdate={handlePhotoUpdate}
        />
      ) : (
        <EditPhotoModal
          isOpen={isEditPhotoModalOpen}
          onClose={() => setIsEditPhotoModalOpen(false)}
          currentPhotoUrl={user?.profile_picture}
          onPhotoUpdate={handlePhotoUpdate}
        />
      )}

      {/* About Section Edit Modal */}
      <AboutSectionEditModal
        isOpen={isAboutEditModalOpen}
        onClose={() => setIsAboutEditModalOpen(false)}
        currentSummary={user?.summary || ''}
        onUpdate={handleAboutUpdate}
      />

      {/* Skills Section Edit Modal */}
      <SkillsSectionEditModal
        isOpen={isSkillsEditModalOpen}
        onClose={() => setIsSkillsEditModalOpen(false)}
        currentSkills={user?.skills || []}
        onUpdate={handleSkillsUpdate}
      />

      <RateLimitModal
        isOpen={rateLimitState.isOpen}
        onClose={hideRateLimitModal}
        message={rateLimitState.message}
        resetInSeconds={rateLimitState.resetInSeconds}
        isAuthenticated={rateLimitState.isAuthenticated}
        rateLimitType={rateLimitState.rateLimitType}
      />
    </div>
  )
}

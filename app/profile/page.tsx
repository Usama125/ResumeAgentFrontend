"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { UserService } from "@/services/user"
import { User as UserType } from "@/types"
import { useAuth } from "@/context/AuthContext"
import AuthService from "@/services/auth"
import EditProfileModal from "@/components/EditProfileModal"
import EditProfileModalMobile from "@/components/EditProfileModalMobile"
import Header from "@/components/Header"
import { useTheme } from "@/context/ThemeContext"
import { getThemeClasses } from "@/utils/theme"
import DesktopProfileView from "@/components/profile/DesktopProfileView"
import MobileProfileView from "@/components/profile/MobileProfileView"


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
  const [isMounted, setIsMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [authTimeout, setAuthTimeout] = useState(false)
  const router = useRouter()
  const { user: authUser, isAuthenticated, loading: authLoading, refreshUser } = useAuth()
  const { isDark } = useTheme()

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

  // Optimized user data fetching with prefetch detection
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!isAuthenticated || !authUser) {
        return;
      }
      
      console.log('🔄 PROFILE PAGE - Fetching user data...', {
        authLoading,
        authTimeout,
        userExists: !!authUser
      });
      
      try {
        setProfileLoading(true)
        
        // Try to use authUser data first if it's complete and recent
        if (authUser && authUser.onboarding_completed) {
          console.log('✅ PROFILE PAGE - Using auth context user data (onboarding completed)');
          setUser(authUser)
          setSuggestedQuestions(generateSuggestedQuestions(authUser))
          setProfileLoading(false)
          
          // Optionally refresh in background for latest data
          UserService.getCurrentUser().then(freshData => {
            console.log('🔄 PROFILE PAGE - Background refresh completed');
            setUser(freshData)
            setSuggestedQuestions(generateSuggestedQuestions(freshData))
          }).catch(error => {
            console.log('⚠️ PROFILE PAGE - Background refresh failed, keeping existing data');
          })
          
          return;
        }
        
        // Fallback to API call if auth context data is incomplete
        console.log('📡 PROFILE PAGE - Fetching fresh user data from API...');
        const userData = await UserService.getCurrentUser()
        setUser(userData)
        setSuggestedQuestions(generateSuggestedQuestions(userData))
        
      } catch (error) {
        console.error('❌ PROFILE PAGE - Error fetching user data:', error)
        // If API fails but we have auth data, use it
        if (authUser) {
          console.log('🔄 PROFILE PAGE - Using fallback auth context data');
          setUser(authUser)
          setSuggestedQuestions(generateSuggestedQuestions(authUser))
        }
      } finally {
        setProfileLoading(false)
      }
    }

    // Fetch user data when auth is ready (including timeout scenario)
    if (isAuthenticated && authUser && (!authLoading || authTimeout)) {
      fetchCurrentUser()
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


  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#212121] text-white' : 'bg-gray-50 text-gray-900'} overflow-x-hidden`}>
      <Header 
        variant="profile"
        showBackButton={true}
        onEditProfile={() => setIsEditModalOpen(true)}
        profileData={{
          name: user?.name,
          profile_picture: user?.profile_picture,
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
    </div>
  )
}

"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PublicUser, APIError } from "@/types"
import { useTheme } from "@/context/ThemeContext"
import { useRateLimit } from "@/hooks/useRateLimit"
import { RateLimitModal } from "@/components/RateLimitModal"
import { getThemeClasses } from "@/utils/theme"
import Header from "@/components/Header"
import DesktopPublicProfileView from "@/components/profile/DesktopPublicProfileView"
import MobilePublicProfileView from "@/components/profile/MobilePublicProfileView"
import { AuthService } from "@/services/auth"
import Image from "next/image"
import { useAIChat } from "@/hooks/useAIChat"
import { validateProfileScore } from "@/utils/profileScoreValidation"
import ProfileDeadState from "@/components/ProfileDeadState"
import ProfileNotFound from "@/components/ProfileNotFound"
import ProfileOptimizer from "@/lib/profile-optimization"

// Generate suggested questions based on user data
const generateSuggestedQuestions = (user: PublicUser): string[] => {
  const firstName = user.name.split(' ')[0];
  const topSkill = user.skills && user.skills.length > 0 ? user.skills[0].name : 'technology';
  
  return [
    `Tell me about ${firstName}'s experience with ${topSkill}`,
    "What are their strongest technical skills?",
    user.expected_salary ? "How does their salary expectation compare to market rates?" : "What is their experience level?",
    "What kind of projects have they worked on?",
    "Are they available for remote work?",
  ];
};

export default function UsernameProfilePage() {
  const [chatSuggestionsLoading, setChatSuggestionsLoading] = useState(false)
  const [profileLoading, setProfileLoading] = useState(true)
  const [user, setUser] = useState<PublicUser | null>(null)
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()
  const params = useParams()
  const username = params.username as string
  const { isDark } = useTheme()
  const theme = getThemeClasses(isDark)
  const { showRateLimitModal, hideRateLimitModal, rateLimitState } = useRateLimit()

  // Initialize AI Chat Hook for recruiter context
  const {
    chatHistory,
    setChatHistory,
    input: message,
    setInput: setMessage,
    isLoading,
    handleSendMessage,
    clearChat,
    messageCount,
    messageLimit,
    currentStreamingMessage,
    isStreaming,
    showMessageLimitModal,
    handleMessageLimitModalConfirm,
    handleMessageLimitModalCancel
  } = useAIChat({
    profileData: user,
    context: 'recruiter',
    username: username,
    token: AuthService.getToken() || undefined,
    showRateLimitModal
  })

  // Check if device is mobile and fetch user data
  useEffect(() => {
    // Simple mobile detection
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    const fetchUser = async () => {
      if (!username) return;
      
      try {
        setProfileLoading(true)
        
        // Use optimized profile fetching
        const userData = await ProfileOptimizer.fetchProfileWithOptimization(username, 10000)
        
        setUser(userData)
        setSuggestedQuestions(generateSuggestedQuestions(userData))
      } catch (error: any) {
        console.error('Error fetching user:', error)
        
        // Handle timeout errors gracefully but preserve original behavior
        if (error.name === 'AbortError') {
          console.error('Request timeout - server may be slow')
        }
        
        // Preserve original behavior - NO redirect, just show error state
        // The component will show loading state forever, which is the original behavior
      } finally {
        setProfileLoading(false)
      }
    }

    fetchUser()
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [username, router])

  // Show loading state
  if (profileLoading) {
    return (
      <div className={`min-h-screen ${theme.bg.primary} ${theme.text.primary} flex items-center justify-center`}>
        <div className="text-center">
          <div className={`w-16 h-16 ${theme.skeleton.primary} rounded-full animate-pulse mx-auto mb-4`}></div>
          <p className={theme.text.tertiary}>Loading profile...</p>
        </div>
      </div>
    )
  }

  // Show beautiful error state if user not found
  if (!user) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#212121] text-white' : 'bg-gray-50 text-gray-900'} overflow-x-hidden`}>
        <RateLimitModal
          isOpen={rateLimitState.isOpen}
          onClose={hideRateLimitModal}
          message={rateLimitState.message}
          resetInSeconds={rateLimitState.resetInSeconds}
          isAuthenticated={rateLimitState.isAuthenticated}
          rateLimitType={rateLimitState.rateLimitType}
        />
        {/* Header with back button */}
        <Header 
          variant="profile" 
          showBackButton={true}
          profileData={{
            name: username || "Profile",
            profile_picture: undefined,
            is_looking_for_job: false
          }}
          isCurrentUserProfile={false}
        />
        {/* Beautiful profile not found page */}
        <ProfileNotFound username={username} isDark={isDark} />
      </div>
    )
  }

  // Check if profile has sufficient data for full access (simplified for public users)
  const hasFullAccess = user && (
    (user.summary && user.summary.trim().length > 0) ||
    (user.skills && user.skills.length > 0) ||
    (user.experience_details && user.experience_details.length > 0)
  )

  const autoResizeTextarea = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto'
    const newHeight = Math.min(textarea.scrollHeight, 120)
    textarea.style.height = newHeight + 'px'
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
    autoResizeTextarea(e.target)
  }

  // Create wrapper functions for the components that expect different setter types
  const setMessageWrapper = (value: string | ((prev: string) => string)) => {
    if (typeof value === 'function') {
      setMessage(value(message))
    } else {
      setMessage(value)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Chat function is now handled by useAIChat hook

  const handleQuestionClick = (question: string) => {
    handleSendMessage(question)
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#212121] text-white' : 'bg-gray-50 text-gray-900'} overflow-x-hidden`}>
      <RateLimitModal
        isOpen={rateLimitState.isOpen}
        onClose={hideRateLimitModal}
        message={rateLimitState.message}
        resetInSeconds={rateLimitState.resetInSeconds}
        isAuthenticated={rateLimitState.isAuthenticated}
        rateLimitType={rateLimitState.rateLimitType}
      />
      {/* Header with Profile Info */}
      <Header 
        variant="profile" 
        showBackButton={true}
          profileData={{
            name: user.name,
            profile_picture: user.profile_picture || undefined,
            is_looking_for_job: user.is_looking_for_job
          }}
        isCurrentUserProfile={false}
      />

      {/* Main Content */}
      {!hasFullAccess ? (
        // Show simple message for incomplete profiles
        <div className={`min-h-[calc(100vh-56px)] flex items-center justify-center p-8 ${isDark ? 'bg-[#212121]' : 'bg-gray-50'}`}>
          <div className={`max-w-2xl w-full rounded-3xl p-12 text-center ${isDark ? 'bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border border-gray-700/50' : 'bg-white border border-gray-200 shadow-2xl'}`}>
            <div className="w-20 h-20 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full mx-auto mb-6 flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Profile Incomplete
            </h2>
            <p className={`text-lg mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              This profile is still being set up. Check back later to see more details.
            </p>
            <Button
              onClick={() => router.push("/explore")}
              className="bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#0a7a5f] text-white px-8 py-3 rounded-xl"
            >
              Explore Other Profiles
            </Button>
          </div>
        </div>
      ) : isMobile ? (
        // Show full mobile profile view
        <MobilePublicProfileView
          user={user}
          chatHistory={chatHistory}
          setChatHistory={setChatHistory}
          suggestedQuestions={suggestedQuestions}
          message={message}
          setMessage={setMessageWrapper}
          isLoading={isLoading}
          handleSendMessage={handleSendMessage}
          currentStreamingMessage={currentStreamingMessage}
          isStreaming={isStreaming}
          messageCount={messageCount}
          messageLimit={messageLimit}
          showMessageLimitModal={showMessageLimitModal}
          handleMessageLimitModalConfirm={handleMessageLimitModalConfirm}
          handleMessageLimitModalCancel={handleMessageLimitModalCancel}
          clearChat={clearChat}
        />
      ) : (
        // Show full desktop profile view
        <DesktopPublicProfileView
          user={user}
          chatHistory={chatHistory}
          setChatHistory={setChatHistory}
          suggestedQuestions={suggestedQuestions}
          message={message}
          setMessage={setMessageWrapper}
          isLoading={isLoading}
          handleSendMessage={handleSendMessage}
          currentStreamingMessage={currentStreamingMessage}
          isStreaming={isStreaming}
          messageCount={messageCount}
          messageLimit={messageLimit}
          showMessageLimitModal={showMessageLimitModal}
          handleMessageLimitModalConfirm={handleMessageLimitModalConfirm}
          handleMessageLimitModalCancel={handleMessageLimitModalCancel}
          clearChat={clearChat}
        />
      )}
    </div>
  )
}
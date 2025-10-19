"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
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

// Generate suggested questions based on user data
const generateSuggestedQuestions = (user: PublicUser): string[] => {
  const firstName = user.name.split(' ')[0];
  const topSkill = user.skills.length > 0 ? user.skills[0].name : 'technology';
  
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
    token: AuthService.getToken(),
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
        
        // Fetch user by username
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'
        const response = await fetch(`${API_BASE_URL}/users/username/${username}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            router.push('/') // Redirect to home if user not found
            return
          }
          throw new Error('Failed to fetch user')
        }
        
        const userData = await response.json()
        setUser(userData)
        setSuggestedQuestions(generateSuggestedQuestions(userData))
      } catch (error) {
        console.error('Error fetching user:', error)
        router.push('/') // Redirect to home if user not found
      } finally {
        setProfileLoading(false)
      }
    }

    fetchUser()
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [username, router])

  // Don't render anything if still loading or user not found
  if (profileLoading || !user) {
    return (
      <div className={`min-h-screen ${theme.bg.primary} ${theme.text.primary} flex items-center justify-center`}>
        <div className="text-center">
          <div className={`w-16 h-16 ${theme.skeleton.primary} rounded-full animate-pulse mx-auto mb-4`}></div>
          <p className={theme.text.tertiary}>Loading profile...</p>
        </div>
      </div>
    )
  }

  // Check if profile score is sufficient for full access
  const profileValidation = validateProfileScore(user)
  const hasFullAccess = profileValidation.isValid

  const autoResizeTextarea = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto'
    const newHeight = Math.min(textarea.scrollHeight, 120)
    textarea.style.height = newHeight + 'px'
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
    autoResizeTextarea(e.target)
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
          profile_picture: user.profile_picture,
          is_looking_for_job: user.is_looking_for_job
        }}
        isCurrentUserProfile={false}
      />

      {/* Main Content */}
      {!hasFullAccess ? (
        // Show dead state for incomplete profiles
        <ProfileDeadState
          user={user}
          isDark={isDark}
          variant={isMobile ? 'mobile' : 'desktop'}
        />
      ) : isMobile ? (
        // Show full mobile profile view
        <MobilePublicProfileView
          user={user}
          chatHistory={chatHistory}
          setChatHistory={setChatHistory}
          suggestedQuestions={suggestedQuestions}
          message={message}
          setMessage={setMessage}
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
          setMessage={setMessage}
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
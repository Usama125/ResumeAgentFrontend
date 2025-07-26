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
import ThemeToggle from "@/components/ThemeToggle"
import DesktopPublicProfileView from "@/components/profile/DesktopPublicProfileView"
import MobilePublicProfileView from "@/components/profile/MobilePublicProfileView"
import { AuthService } from "@/services/auth"

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
  const [message, setMessage] = useState("")
  const [chatHistory, setChatHistory] = useState<Array<{ type: "user" | "ai"; content: string }>>([])
  const [isLoading, setIsLoading] = useState(false)
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
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
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

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || message
    if (!textToSend.trim() || !user) return

    setIsLoading(true)
    setChatHistory((prev) => [...prev, { type: "user", content: textToSend }])
    setMessage("")

    try {
      // Get auth token for authenticated users
      const token = AuthService.getToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      // Add authorization header if user is authenticated
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Call the chat API with username instead of user ID
      const response = await fetch(`/api/chat/username/${username}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ message: textToSend }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Handle rate limit errors
        if (response.status === 429) {
          const rateLimitError: APIError = {
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
          return; // Don't add error message to chat
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
      <header className="sticky top-0 z-40 w-full relative">
        {/* Background gradients */}
        <div className={`absolute inset-0 transition-all duration-500 ${isDark ? 'bg-gradient-to-r from-[#1a1a1a] via-[#2f2f2f] to-[#1a1a1a]' : 'bg-gradient-to-r from-gray-50 via-white to-gray-50'}`}></div>
        <div className={`absolute inset-0 transition-all duration-700 ${isDark ? 'bg-gradient-to-br from-[#10a37f]/8 via-transparent to-[#10a37f]/4' : 'bg-gradient-to-br from-[#10a37f]/4 via-transparent to-[#10a37f]/2'}`}></div>
        <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#10a37f]/40 to-transparent`}></div>

        <div className="relative backdrop-blur-sm overflow-hidden">
          <div className="w-full px-2 sm:px-4 lg:px-6">
            <div className="flex justify-between items-center h-14 min-w-0">
              
              {/* Left side content */}
              <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
                {/* Back button */}
                <button
                  onClick={() => router.push("/")}
                  className={`mr-2 flex items-center ${isDark ? 'text-gray-300 hover:text-white hover:bg-[#40414f]' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} p-2 rounded-lg transition-colors`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline ml-2 text-sm">Back to Home</span>
                </button>

                {/* Profile info */}
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                  <img
                    src={user.profile_picture || "/logo_updated.png"}
                    alt={user.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover flex-shrink-0"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/logo_updated.png";
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <h1 className={`text-sm sm:text-lg font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {user.name}
                    </h1>
                    {user.username && (
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} truncate`}>
                        @{user.username}
                      </p>
                    )}
                  </div>
                  {user.is_looking_for_job && (
                    <Badge className="bg-green-500 hover:bg-green-500 text-white text-xs px-1.5 py-0.5 hidden sm:inline-flex">
                      Open to work
                    </Badge>
                  )}
                </div>
              </div>

              {/* Right side content */}
              <div className="flex items-center space-x-1 sm:space-x-3 flex-shrink-0">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {isMobile ? (
        <MobilePublicProfileView
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
        <DesktopPublicProfileView
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
    </div>
  )
}
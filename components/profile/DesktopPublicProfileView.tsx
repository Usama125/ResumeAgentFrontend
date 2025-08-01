"use client"

import { useState, useRef, memo, useMemo, useCallback } from "react"
import {
  Send,
  MapPin,
  Briefcase,
  Award,
  Code,
  MessageCircle,
  User,
  Mail,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PublicUser } from "@/types"
import { useTheme } from "@/context/ThemeContext"
import { getThemeClasses } from "@/utils/theme"
import { calculateTotalExperience } from "@/utils/experienceCalculator"
import ResizableSplitPane from "@/components/ResizableSplitPane"
import { PublicChatPanel } from "./PublicChatPanel"

interface DesktopPublicProfileViewProps {
  user: PublicUser
  chatHistory: Array<{ type: "user" | "ai"; content: string }>
  setChatHistory: React.Dispatch<React.SetStateAction<Array<{ type: "user" | "ai"; content: string }>>>
  suggestedQuestions: string[]
  message: string
  setMessage: React.Dispatch<React.SetStateAction<string>>
  isLoading: boolean
  handleSendMessage: (messageText?: string) => Promise<void>
}

import { getImageUrl } from '@/utils/imageUtils';
import { formatLinkedInUrl, isLocalProfileUrl } from '@/utils/contactUtils';
import ProfileSections from '@/components/ProfileSections';

// Memoized Portfolio Section Component
const PortfolioSection = memo<{
  user: PublicUser
  isChatVisible: boolean
  isDark: boolean
  onChatToggle: () => void
}>(function PortfolioSection({
  user,
  isChatVisible,
  isDark,
  onChatToggle
}) {
  return (
    <div className={`${isDark ? 'bg-[#212121]' : 'bg-gray-50'} h-full overflow-y-auto relative scrollbar-hide`}>
        
        {/* Toggle Button - Inside Portfolio Section */}
        <div className="absolute top-4 right-4 z-50">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <button
              onClick={onChatToggle}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 backdrop-blur-sm border ${
                isDark 
                  ? 'bg-[#2f2f2f]/90 border-[#565869]/60 text-white hover:bg-[#40414f]/90 hover:border-[#10a37f]/40' 
                  : 'bg-white/90 border-gray-300 text-gray-900 hover:bg-gray-50 hover:border-[#10a37f]/40'
              } shadow-lg hover:shadow-2xl hover:scale-105`}
              title={isChatVisible ? "View Profile Full Screen" : "Show Chat"}
            >
              {isChatVisible ? (
                <>
                  <svg className="w-4 h-4 text-[#10a37f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12V10m0 0l3 3m-3-3l-3 3" />
                  </svg>
                  <span className="text-sm font-medium">Full Screen View</span>
                  <svg className="w-4 h-4 ml-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-1 transition-transform duration-300 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <MessageCircle className="w-4 h-4 text-[#10a37f]" />
                  <span className="text-sm font-medium">Show Chat</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#10a37f]/5 via-transparent to-[#10a37f]/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#10a37f]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0d8f6f]/5 rounded-full blur-2xl"></div>
        
        {/* Content Container */}
        <div className="h-full overflow-y-auto relative z-10 scrollbar-hide">
          <div className={`${isChatVisible ? 'p-8' : 'p-12 max-w-4xl mx-auto'} space-y-6`}>
            {/* Hero Section */}
            <div className="text-center space-y-6">
              {/* Profile Picture */}
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full blur-lg opacity-30"></div>
                <img
                  src={getImageUrl(user.profile_picture)}
                  alt={user.name}
                  className="relative w-32 h-32 rounded-full object-cover border-4 border-[#10a37f]/30 shadow-2xl"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder-user.jpg";
                  }}
                />
                {user.is_looking_for_job && (
                  <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs px-3 py-1 rounded-full border-2 border-[#0a0a0a] font-semibold">
                    Available
                  </div>
                )}
              </div>

              {/* Name & Title */}
              <div className="space-y-2">
                <h1 className={`text-3xl font-bold ${isDark ? 'bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent' : 'text-gray-900'}`}>
                  {user.name}
                </h1>
                <p className="text-xl text-[#10a37f] font-medium">{user.designation}</p>
                <div className={`flex items-center justify-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{user.location}</span>
                </div>
              </div>

              {/* Contact Information & Social Links */}
              {user.contact_info && Object.values(user.contact_info).some(value => value) && (
                <div className="flex flex-wrap justify-center gap-3 mt-6">
                  {user.contact_info.email && (
                    <a
                      href={`mailto:${user.contact_info.email}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group relative p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
                        isDark 
                          ? 'bg-[#2a2a2a]/80 border border-[#10a37f]/20 hover:bg-[#10a37f]/20 hover:border-[#10a37f]/40' 
                          : 'bg-white/80 border border-gray-200 hover:bg-[#10a37f]/10 hover:border-[#10a37f]/40'
                      } shadow-lg hover:shadow-2xl`}
                      title={`Email: ${user.contact_info.email}`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                      <svg className="relative w-5 h-5 text-[#10a37f] group-hover:text-[#0d8f6f] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </a>
                  )}
                  {user.contact_info.phone && (
                    <a
                      href={`tel:${user.contact_info.phone}`}
                      className={`group relative p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
                        isDark 
                          ? 'bg-[#2a2a2a]/80 border border-[#10a37f]/20 hover:bg-[#10a37f]/20 hover:border-[#10a37f]/40' 
                          : 'bg-white/80 border border-gray-200 hover:bg-[#10a37f]/10 hover:border-[#10a37f]/40'
                      } shadow-lg hover:shadow-2xl`}
                      title={`Call: ${user.contact_info.phone}`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                      <svg className="relative w-5 h-5 text-[#10a37f] group-hover:text-[#0d8f6f] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </a>
                  )}
                  {user.contact_info.linkedin && (
                    <a
                      href={formatLinkedInUrl(user.contact_info.linkedin)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group relative p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
                        isDark 
                          ? 'bg-[#2a2a2a]/80 border border-[#10a37f]/20 hover:bg-[#10a37f]/20 hover:border-[#10a37f]/40' 
                          : 'bg-white/80 border border-gray-200 hover:bg-[#10a37f]/10 hover:border-[#10a37f]/40'
                      } shadow-lg hover:shadow-2xl`}
                      title="LinkedIn Profile"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                      <svg className="relative w-5 h-5 text-[#10a37f] group-hover:text-[#0d8f6f] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  )}
                  {user.contact_info.github && (
                    <a
                      href={user.contact_info.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group relative p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
                        isDark 
                          ? 'bg-[#2a2a2a]/80 border border-[#10a37f]/20 hover:bg-[#10a37f]/20 hover:border-[#10a37f]/40' 
                          : 'bg-white/80 border border-gray-200 hover:bg-[#10a37f]/10 hover:border-[#10a37f]/40'
                      } shadow-lg hover:shadow-2xl`}
                      title="GitHub Profile"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                      <svg className="relative w-5 h-5 text-[#10a37f] group-hover:text-[#0d8f6f] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                  )}
                  {user.contact_info.portfolio && (
                    isLocalProfileUrl(user.contact_info.portfolio) && !user.username ? null : (
                      <a
                        href={isLocalProfileUrl(user.contact_info.portfolio) ? `/profile/${user.username}` : user.contact_info.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group relative p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
                          isDark 
                            ? 'bg-[#2a2a2a]/80 border border-[#10a37f]/20 hover:bg-[#10a37f]/20 hover:border-[#10a37f]/40' 
                            : 'bg-white/80 border border-gray-200 hover:bg-[#10a37f]/10 hover:border-[#10a37f]/40'
                        } shadow-lg hover:shadow-2xl`}
                        title={isLocalProfileUrl(user.contact_info.portfolio) ? "View Profile" : "Portfolio Website"}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                        {isLocalProfileUrl(user.contact_info.portfolio) ? (
                          <svg className="relative w-5 h-5 text-[#10a37f] group-hover:text-[#0d8f6f] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                          </svg>
                        ) : (
                          <svg className="relative w-5 h-5 text-[#10a37f] group-hover:text-[#0d8f6f] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                          </svg>
                        )}
                      </a>
                    )
                  )}
                  {user.contact_info.twitter && (
                    <a
                      href={user.contact_info.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group relative p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
                        isDark 
                          ? 'bg-[#2a2a2a]/80 border border-[#10a37f]/20 hover:bg-[#10a37f]/20 hover:border-[#10a37f]/40' 
                          : 'bg-white/80 border border-gray-200 hover:bg-[#10a37f]/10 hover:border-[#10a37f]/40'
                      } shadow-lg hover:shadow-2xl`}
                      title="Twitter Profile"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                      <svg className="relative w-5 h-5 text-[#10a37f] group-hover:text-[#0d8f6f] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </a>
                  )}
                  {user.contact_info.website && (
                    <a
                      href={user.contact_info.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group relative p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
                        isDark 
                          ? 'bg-[#2a2a2a]/80 border border-[#10a37f]/20 hover:bg-[#10a37f]/20 hover:border-[#10a37f]/40' 
                          : 'bg-white/80 border border-gray-200 hover:bg-[#10a37f]/10 hover:border-[#10a37f]/40'
                      } shadow-lg hover:shadow-2xl`}
                      title="Personal Website"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                      <svg className="relative w-5 h-5 text-[#10a37f] group-hover:text-[#0d8f6f] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                      </svg>
                    </a>
                  )}
                </div>
              )}



              {/* Stats Row */}
              <div className="flex justify-center space-x-8">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getThemeClasses(isDark).text.primary}`}>
                    {(() => {
                      if (user.experience && user.experience.trim() !== '') {
                        return user.experience;
                      }
                      const calculatedExp = calculateTotalExperience(user.experience_details || []);
                      return calculatedExp || 'N/A';
                    })()}
                  </div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Experience</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getThemeClasses(isDark).text.primary}`}>{(user.skills || []).length}</div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Skills</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getThemeClasses(isDark).text.primary}`}>{(user.projects || []).length}</div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Projects</div>
                </div>
              </div>
            </div>

            {/* Sections Container - Using ProfileSections component for consistency */}
            <div className="space-y-6">
              <ProfileSections
                user={{
                  ...user,
                  email: user.email || 'public@example.com',
                  expected_salary: user.expected_salary || null,
                  current_salary: null,
                  additional_info: null,
                  work_preferences: null,
                  onboarding_completed: false,
                  onboarding_progress: {
                    step_1_pdf_upload: 'completed',
                    step_2_profile_info: 'completed',
                    step_3_work_preferences: 'completed',
                    step_4_salary_availability: 'completed',
                    current_step: 4,
                    completed: true
                  },
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                }}
                isEditMode={false}
                onEditAbout={undefined}
                onEditSkills={undefined}
                onSectionOrderChange={undefined}
                onAddSection={undefined}
              />
            </div>
          </div>
        </div>
    </div>
  )
})

// Memoized Chat Section Component
const ChatSection = memo<{
  user: PublicUser
  chatHistory: Array<{ type: "user" | "ai"; content: string }>
  setChatHistory: React.Dispatch<React.SetStateAction<Array<{ type: "user" | "ai"; content: string }>>>
  suggestedQuestions: string[]
  message: string
  setMessage: React.Dispatch<React.SetStateAction<string>>
  isLoading: boolean
  handleSendMessage: (messageText?: string) => Promise<void>
}>(function ChatSection({
  user,
  chatHistory,
  setChatHistory,
  suggestedQuestions,
  message,
  setMessage,
  isLoading,
  handleSendMessage
}) {
  return (
    <PublicChatPanel
      user={user}
      chatHistory={chatHistory}
      setChatHistory={setChatHistory}
      suggestedQuestions={suggestedQuestions}
      message={message}
      setMessage={setMessage}
      isLoading={isLoading}
      handleSendMessage={handleSendMessage}
      className="h-full"
    />
  )
})

export default function DesktopPublicProfileView({
  user,
  chatHistory,
  setChatHistory,
  suggestedQuestions,
  message,
  setMessage,
  isLoading,
  handleSendMessage
}: DesktopPublicProfileViewProps) {
  const [isChatVisible, setIsChatVisible] = useState(true)
  const { isDark } = useTheme()

  // Memoized handlers to prevent unnecessary re-renders
  const handleChatToggle = useCallback(() => {
    setIsChatVisible(!isChatVisible)
  }, [isChatVisible])

  // Memoized props to prevent unnecessary re-renders
  const portfolioSectionProps = useMemo(() => ({
    user,
    isChatVisible,
    isDark,
    onChatToggle: handleChatToggle
  }), [user, isChatVisible, isDark, handleChatToggle])

  const chatSectionProps = useMemo(() => ({
    user,
    chatHistory,
    setChatHistory,
    suggestedQuestions,
    message,
    setMessage,
    isLoading,
    handleSendMessage
  }), [user, chatHistory, setChatHistory, suggestedQuestions, message, setMessage, isLoading, handleSendMessage])

  return (
    <div className="h-[calc(100vh-56px)] sm:h-[calc(100vh-64px)] relative w-full">
      <ResizableSplitPane
        isVisible={isChatVisible}
        defaultLeftWidth={65}
        minLeftWidth={30}
        maxLeftWidth={70}
      >
        <PortfolioSection {...portfolioSectionProps} />
        <ChatSection {...chatSectionProps} />
      </ResizableSplitPane>
    </div>
  )
}
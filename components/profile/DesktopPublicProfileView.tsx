"use client"

import { useState, useRef } from "react"
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

  const PortfolioSection = () => (
    <div className={`${isDark ? 'bg-[#212121]' : 'bg-gray-50'} h-full overflow-y-auto relative scrollbar-hide`}>
        
        {/* Toggle Button - Inside Portfolio Section */}
        <div className="absolute top-4 right-4 z-50">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <button
              onClick={() => setIsChatVisible(!isChatVisible)}
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
        
        {/* Full Screen Indicator */}
        {!isChatVisible && (
          <div className="absolute top-4 left-4 z-40">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-lg blur opacity-20"></div>
              <div className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg ${isDark ? 'bg-[#2f2f2f]/80' : 'bg-white/80'} backdrop-blur-sm border ${isDark ? 'border-[#10a37f]/30' : 'border-[#10a37f]/30'}`}>
                <div className="w-2 h-2 bg-[#10a37f] rounded-full animate-pulse"></div>
                <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Full Screen View</span>
              </div>
            </div>
          </div>
        )}

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
                  <div className={`text-2xl font-bold ${getThemeClasses().text}`}>
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
                  <div className={`text-2xl font-bold ${getThemeClasses().text}`}>{(user.skills || []).length}</div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Skills</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getThemeClasses().text}`}>{(user.projects || []).length}</div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Projects</div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className={`${isDark ? 'bg-gradient-to-br from-[#1a1a1a]/80 to-[#2a2a2a]/60' : 'bg-white/80'} backdrop-blur-sm rounded-2xl p-6 border ${isDark ? 'border-[#10a37f]/20' : 'border-gray-200'}`}>
              <h2 className={`text-xl font-bold ${getThemeClasses().text} mb-4 flex items-center`}>
                <User className="w-5 h-5 mr-2 text-[#10a37f]" />
                About
              </h2>
              <div className="relative">
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed ${user.summary && user.summary.length > 200 ? 'line-clamp-3' : ''}`}>
                  {user.summary || 'No summary available.'}
                </p>
                {user.summary && user.summary.length > 200 && (
                  <div className="relative inline-block mt-2">
                    <span className="text-[#10a37f] hover:text-[#0d8f6f] text-sm font-medium transition-colors cursor-pointer group">
                      See More
                      <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-[99999] transform-gpu top-full left-0 mt-2">
                        <div className={`${isDark ? 'bg-[#2a2a2a] border-[#10a37f]/30' : 'bg-white border-gray-200'} border rounded-lg p-4 shadow-2xl max-w-md w-96`}>
                          <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed text-sm`}>
                            {user.summary}
                          </p>
                        </div>
                      </div>
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Skills Showcase */}
            <div className={`${isDark ? 'bg-gradient-to-br from-[#1a1a1a]/80 to-[#2a2a2a]/60' : 'bg-white/80'} backdrop-blur-sm rounded-2xl p-6 border ${isDark ? 'border-[#10a37f]/20' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-bold ${getThemeClasses().text} flex items-center`}>
                  <Code className="w-5 h-5 mr-2 text-[#10a37f]" />
                  Skills & Expertise
                </h2>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {(user.skills || []).length} skills
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#10a37f]/30 pr-2">
                {(user.skills || [])
                  .slice()
                  .sort((a, b) => {
                    const getPriority = (level) => {
                      switch(level) {
                        case 'Expert': return 1;
                        case 'Advanced': return 2;
                        case 'Intermediate': return 3;
                        default: return 4;
                      }
                    };
                    return getPriority(a.level) - getPriority(b.level);
                  })
                  .map((skill, index) => (
                  <div key={index} className={`${isDark ? 'bg-[#2a2a2a]/50' : 'bg-gray-50/80'} rounded-lg p-3 border ${isDark ? 'border-[#10a37f]/10 hover:border-[#10a37f]/30' : 'border-gray-200 hover:border-[#10a37f]/50'} transition-all duration-300 group`}>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`${getThemeClasses().text} font-medium text-sm group-hover:text-[#10a37f] transition-colors truncate`}>
                          {skill.name}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2 ${
                          skill.level === "Expert" 
                            ? "bg-green-500 text-white" 
                            : skill.level === "Advanced"
                            ? "bg-blue-500 text-white"
                            : skill.level === "Intermediate"
                            ? "bg-gray-500 text-white"
                            : "bg-gray-400 text-white"
                        }`}>
                          {skill.level}
                        </span>
                      </div>
                      <div className={`w-full ${isDark ? 'bg-[#1a1a1a]' : 'bg-gray-200'} rounded-full h-1.5`}>
                        <div 
                          className={`h-1.5 rounded-full transition-all duration-500 ${
                            skill.level === "Expert" 
                              ? "bg-green-500 w-11/12" 
                              : skill.level === "Advanced"
                              ? "bg-blue-500 w-4/5"
                              : skill.level === "Intermediate"
                              ? "bg-gray-500 w-3/5"
                              : "bg-gray-400 w-1/4"
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Skills Legend */}
              <div className={`mt-4 pt-4 border-t ${isDark ? 'border-[#10a37f]/20' : 'border-gray-200'}`}>
                <div className="flex items-center justify-center gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Expert</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Advanced</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Intermediate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Beginner</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Experience Timeline */}
            <div className={`${isDark ? 'bg-gradient-to-br from-[#1a1a1a]/80 to-[#2a2a2a]/60' : 'bg-white/80'} backdrop-blur-sm rounded-2xl p-6 border ${isDark ? 'border-[#10a37f]/20' : 'border-gray-200'}`}>
              <h2 className={`text-xl font-bold ${getThemeClasses().text} mb-6 flex items-center`}>
                <Briefcase className="w-5 h-5 mr-2 text-[#10a37f]" />
                Professional Experience
              </h2>
              <div className="space-y-6">
                {(user.experience_details || []).length > 0 ? (
                  (user.experience_details || []).map((exp, index) => (
                    <div key={index} className="relative pl-8 border-l-2 border-[#10a37f]/30">
                      <div className={`absolute -left-2 top-0 w-4 h-4 bg-[#10a37f] rounded-full border-2 ${isDark ? 'border-[#0a0a0a]' : 'border-white'}`}></div>
                      <div className="space-y-2">
                        <h3 className={`text-lg font-semibold ${getThemeClasses().text}`}>{exp.position}</h3>
                        <p className="text-[#10a37f] font-medium">{exp.company}</p>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{exp.duration}</p>
                        <div className="relative">
                          <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed ${exp.description && exp.description.length > 100 ? 'line-clamp-2' : ''}`}>
                            {exp.description}
                          </p>
                          {exp.description && exp.description.length > 100 && (
                            <div className="relative inline-block mt-2">
                              <span className="text-[#10a37f] hover:text-[#0d8f6f] text-sm font-medium transition-colors cursor-pointer group">
                                See More
                                <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-[99999] transform-gpu top-full left-0 mt-2">
                                  <div className={`${isDark ? 'bg-[#2a2a2a] border-[#10a37f]/30' : 'bg-white border-gray-200'} border rounded-lg p-4 shadow-2xl max-w-md w-96`}>
                                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed text-sm`}>
                                      {exp.description}
                                    </p>
                                  </div>
                                </div>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-center py-4`}>No experience details available.</p>
                )}
              </div>
            </div>

            {/* Projects Showcase */}
            <div className={`${isDark ? 'bg-gradient-to-br from-[#1a1a1a]/80 to-[#2a2a2a]/60' : 'bg-white/80'} backdrop-blur-sm rounded-2xl p-6 border ${isDark ? 'border-[#10a37f]/20' : 'border-gray-200'}`}>
              <h2 className={`text-xl font-bold ${getThemeClasses().text} mb-6 flex items-center`}>
                <Award className="w-5 h-5 mr-2 text-[#10a37f]" />
                Featured Projects
              </h2>
              <div className="grid gap-6">
                {(user.projects || []).length > 0 ? (
                  (user.projects || []).map((project, index) => (
                    <div key={index} className={`${isDark ? 'bg-[#2a2a2a]/50' : 'bg-gray-50/80'} rounded-xl p-5 border ${isDark ? 'border-[#10a37f]/10 hover:border-[#10a37f]/30' : 'border-gray-200 hover:border-[#10a37f]/50'} transition-all duration-300`}>
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <h3 className={`text-lg font-semibold ${getThemeClasses(isDark).text.primary} group-hover:text-[#10a37f] transition-colors`}>
                            {project.name}
                          </h3>
                          <div className="flex gap-2">
                            {project.github_url && (
                              <a
                                href={project.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl"
                                title="View GitHub Repository"
                              >
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                                GitHub
                              </a>
                            )}
                            {project.url && (
                              <a
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 px-3 py-1.5 bg-[#10a37f] hover:bg-[#0d8f6f] text-white text-sm rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl"
                                title="Visit Live Demo"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                Visit
                              </a>
                            )}
                          </div>
                        </div>
                        <div className="relative">
                          <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed ${project.description && project.description.length > 100 ? 'line-clamp-2' : ''}`}>
                            {project.description}
                          </p>
                          {project.description && project.description.length > 100 && (
                            <div className="relative inline-block mt-2">
                              <span className="text-[#10a37f] hover:text-[#0d8f6f] text-sm font-medium transition-colors cursor-pointer group">
                                See More
                                <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-[99999] transform-gpu top-full left-0 mt-2">
                                  <div className={`${isDark ? 'bg-[#2a2a2a] border-[#10a37f]/30' : 'bg-white border-gray-200'} border rounded-lg p-4 shadow-2xl max-w-md w-96`}>
                                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed text-sm`}>
                                      {project.description}
                                    </p>
                                  </div>
                                </div>
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.slice(0, 2).map((tech, techIndex) => (
                            <span 
                              key={techIndex} 
                              className="inline-flex items-center px-3 py-1 bg-[#10a37f]/20 text-[#10a37f] text-sm rounded-full border border-[#10a37f]/30 max-w-[150px] truncate whitespace-nowrap"
                              title={tech}
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 2 && (
                            <div className="relative inline-block">
                              <span className="inline-flex items-center px-3 py-1 bg-[#10a37f]/20 text-[#10a37f] text-sm rounded-full border border-[#10a37f]/30 cursor-pointer hover:bg-[#10a37f]/30 transition-colors group whitespace-nowrap">
                                +{project.technologies.length - 2} More
                                <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-[99999] transform-gpu top-full left-0 mt-2">
                                  <div className={`${isDark ? 'bg-[#2a2a2a] border-[#10a37f]/30' : 'bg-white border-gray-200'} border rounded-lg p-3 shadow-2xl min-w-[400px] max-w-[500px]`}>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                      {project.technologies.slice(2).map((tech, techIndex) => (
                                        <span 
                                          key={techIndex + 2} 
                                          className="inline-flex items-center px-3 py-1 bg-[#10a37f]/20 text-[#10a37f] text-sm rounded-full border border-[#10a37f]/30 whitespace-nowrap "
                                          title={tech}
                                        >
                                          {tech.length > 12 ? `${tech.substring(0, 12)}...` : tech}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-center py-4`}>No projects available.</p>
                )}
              </div>
            </div>



            {/* Education */}
            {(user.education || []).length > 0 && (
              <div className={`${isDark ? 'bg-gradient-to-br from-[#1a1a1a]/80 to-[#2a2a2a]/60' : 'bg-white/80'} backdrop-blur-sm rounded-2xl p-6 border ${isDark ? 'border-[#10a37f]/20' : 'border-gray-200'}`}>
                <h2 className={`text-xl font-bold ${getThemeClasses(isDark).text.primary} mb-6 flex items-center`}>
                  <svg className="w-5 h-5 mr-2 text-[#10a37f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                  Education
                </h2>
                <div className="space-y-4">
                  {(user.education || []).map((edu, index) => (
                    <div key={index} className={`${isDark ? 'bg-[#2a2a2a]/50' : 'bg-gray-50/80'} rounded-xl p-5 border ${isDark ? 'border-[#10a37f]/10 hover:border-[#10a37f]/30' : 'border-gray-200 hover:border-[#10a37f]/50'} transition-all duration-300`}>
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className={`text-lg font-semibold ${getThemeClasses(isDark).text.primary}`}>
                              {edu.degree}
                            </h3>
                            <p className="text-[#10a37f] font-medium">{edu.institution}</p>
                            {edu.field_of_study && (
                              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                {edu.field_of_study}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            {edu.start_date && edu.end_date && (
                              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                {edu.start_date} - {edu.end_date}
                              </span>
                            )}
                            {edu.grade && (
                              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                                Grade: {edu.grade}
                              </div>
                            )}
                          </div>
                        </div>
                        {edu.description && (
                          <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                            {edu.description}
                          </p>
                        )}
                        {edu.activities && (
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            <span className="font-medium">Activities:</span> {edu.activities}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {(user.languages || []).length > 0 && (
              <div className={`${isDark ? 'bg-gradient-to-br from-[#1a1a1a]/80 to-[#2a2a2a]/60' : 'bg-white/80'} backdrop-blur-sm rounded-2xl p-6 border ${isDark ? 'border-[#10a37f]/20' : 'border-gray-200'}`}>
                <h2 className={`text-xl font-bold ${getThemeClasses(isDark).text.primary} mb-6 flex items-center`}>
                  <svg className="w-5 h-5 mr-2 text-[#10a37f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  Languages
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {(user.languages || []).map((lang, index) => (
                    <div key={index} className={`${isDark ? 'bg-[#2a2a2a]/50' : 'bg-gray-50/80'} rounded-lg p-4 border ${isDark ? 'border-[#10a37f]/10 hover:border-[#10a37f]/30' : 'border-gray-200 hover:border-[#10a37f]/50'} transition-all duration-300 text-center`}>
                      <div className="space-y-2">
                        <h3 className={`font-semibold ${getThemeClasses(isDark).text.primary}`}>
                          {lang.name}
                        </h3>
                        {lang.proficiency && (
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            lang.proficiency === "Native" 
                              ? "bg-green-500 text-white" 
                              : lang.proficiency === "Fluent"
                              ? "bg-blue-500 text-white"
                              : lang.proficiency === "Advanced"
                              ? "bg-purple-500 text-white"
                              : lang.proficiency === "Intermediate"
                              ? "bg-gray-500 text-white"
                              : "bg-gray-400 text-white"
                          }`}>
                            {lang.proficiency}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Awards & Recognition */}
            {(user.awards || []).length > 0 && (
              <div className={`${isDark ? 'bg-gradient-to-br from-[#1a1a1a]/80 to-[#2a2a2a]/60' : 'bg-white/80'} backdrop-blur-sm rounded-2xl p-6 border ${isDark ? 'border-[#10a37f]/20' : 'border-gray-200'}`}>
                <h2 className={`text-xl font-bold ${getThemeClasses(isDark).text.primary} mb-6 flex items-center`}>
                  <Award className="w-5 h-5 mr-2 text-[#10a37f]" />
                  Awards & Recognition
                </h2>
                <div className="space-y-4">
                  {(user.awards || []).map((award, index) => (
                    <div key={index} className={`${isDark ? 'bg-[#2a2a2a]/50' : 'bg-gray-50/80'} rounded-xl p-5 border ${isDark ? 'border-[#10a37f]/10 hover:border-[#10a37f]/30' : 'border-gray-200 hover:border-[#10a37f]/50'} transition-all duration-300`}>
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className={`text-lg font-semibold ${getThemeClasses(isDark).text.primary}`}>
                              {award.title}
                            </h3>
                            {award.issuer && (
                              <p className="text-[#10a37f] font-medium">{award.issuer}</p>
                            )}
                          </div>
                          {award.date && (
                            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              {award.date}
                            </span>
                          )}
                        </div>
                        {award.description && (
                          <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                            {award.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Publications */}
            {(user.publications || []).length > 0 && (
              <div className={`${isDark ? 'bg-gradient-to-br from-[#1a1a1a]/80 to-[#2a2a2a]/60' : 'bg-white/80'} backdrop-blur-sm rounded-2xl p-6 border ${isDark ? 'border-[#10a37f]/20' : 'border-gray-200'}`}>
                <h2 className={`text-xl font-bold ${getThemeClasses(isDark).text.primary} mb-6 flex items-center`}>
                  <svg className="w-5 h-5 mr-2 text-[#10a37f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 5.477 5.754 5 7.5 5s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 5.477 18.246 5 16.5 5c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Publications
                </h2>
                <div className="space-y-4">
                  {(user.publications || []).map((pub, index) => (
                    <div key={index} className={`${isDark ? 'bg-[#2a2a2a]/50' : 'bg-gray-50/80'} rounded-xl p-5 border ${isDark ? 'border-[#10a37f]/10 hover:border-[#10a37f]/30' : 'border-gray-200 hover:border-[#10a37f]/50'} transition-all duration-300`}>
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className={`text-lg font-semibold ${getThemeClasses(isDark).text.primary}`}>
                              {pub.title}
                            </h3>
                            {pub.publisher && (
                              <p className="text-[#10a37f] font-medium">{pub.publisher}</p>
                            )}
                          </div>
                          {pub.date && (
                            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              {pub.date}
                            </span>
                          )}
                        </div>
                        {pub.description && (
                          <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                            {pub.description}
                          </p>
                        )}
                        {pub.url && (
                          <a 
                            href={pub.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[#10a37f] hover:text-[#0d8f6f] transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Read Publication
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Volunteer Experience */}
            {(user.volunteer_experience || []).length > 0 && (
              <div className={`${isDark ? 'bg-gradient-to-br from-[#1a1a1a]/80 to-[#2a2a2a]/60' : 'bg-white/80'} backdrop-blur-sm rounded-2xl p-6 border ${isDark ? 'border-[#10a37f]/20' : 'border-gray-200'}`}>
                <h2 className={`text-xl font-bold ${getThemeClasses(isDark).text.primary} mb-6 flex items-center`}>
                  <svg className="w-5 h-5 mr-2 text-[#10a37f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Volunteer Experience
                </h2>
                <div className="space-y-4">
                  {(user.volunteer_experience || []).map((vol, index) => (
                    <div key={index} className={`${isDark ? 'bg-[#2a2a2a]/50' : 'bg-gray-50/80'} rounded-xl p-5 border ${isDark ? 'border-[#10a37f]/10 hover:border-[#10a37f]/30' : 'border-gray-200 hover:border-[#10a37f]/50'} transition-all duration-300`}>
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className={`text-lg font-semibold ${getThemeClasses(isDark).text.primary}`}>
                              {vol.role}
                            </h3>
                            <p className="text-[#10a37f] font-medium">{vol.organization}</p>
                          </div>
                          {(vol.start_date || vol.end_date) && (
                            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              {vol.start_date} {vol.end_date && `- ${vol.end_date}`}
                            </span>
                          )}
                        </div>
                        {vol.description && (
                          <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                            {vol.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interests */}
            {(user.interests || []).length > 0 && (
              <div className={`${isDark ? 'bg-gradient-to-br from-[#1a1a1a]/80 to-[#2a2a2a]/60' : 'bg-white/80'} backdrop-blur-sm rounded-2xl p-6 border ${isDark ? 'border-[#10a37f]/20' : 'border-gray-200'}`}>
                <h2 className={`text-xl font-bold ${getThemeClasses(isDark).text.primary} mb-6 flex items-center`}>
                  <svg className="w-5 h-5 mr-2 text-[#10a37f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Interests & Hobbies
                </h2>
                <div className="flex flex-wrap gap-3">
                  {(user.interests || []).map((interest, index) => (
                    <span 
                      key={index} 
                      className="px-4 py-2 bg-[#10a37f]/20 text-[#10a37f] text-sm rounded-full border border-[#10a37f]/30 hover:bg-[#10a37f]/30 transition-all duration-300"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {(user.certifications || []).length > 0 && (
              <div className={`${isDark ? 'bg-gradient-to-br from-[#1a1a1a]/80 to-[#2a2a2a]/60' : 'bg-white/80'} backdrop-blur-sm rounded-2xl p-6 border ${isDark ? 'border-[#10a37f]/20' : 'border-gray-200'}`}>
                <h2 className={`text-xl font-bold ${getThemeClasses(isDark).text.primary} mb-6 flex items-center`}>
                  <Award className="w-5 h-5 mr-2 text-[#10a37f]" />
                  Certifications
                </h2>
                <div className="grid gap-3">
                  {(user.certifications || []).map((cert, index) => (
                    <div key={index} className={`flex items-center p-3 ${isDark ? 'bg-[#2a2a2a]/50' : 'bg-gray-50/80'} rounded-lg border ${isDark ? 'border-[#10a37f]/10' : 'border-gray-200'}`}>
                      <div className="w-2 h-2 bg-[#10a37f] rounded-full mr-3"></div>
                      <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
    </div>
  )

  const ChatSection = () => (
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

  return (
    <div className="h-[calc(100vh-56px)] sm:h-[calc(100vh-64px)] relative w-full">
      <ResizableSplitPane
        isVisible={isChatVisible}
        defaultLeftWidth={50}
        minLeftWidth={30}
        maxLeftWidth={70}
      >
        <PortfolioSection />
        <ChatSection />
      </ResizableSplitPane>
    </div>
  )
}
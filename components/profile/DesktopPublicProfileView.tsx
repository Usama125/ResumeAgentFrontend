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
              } shadow-lg hover:shadow-xl hover:scale-105`}
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

              {/* Contact & Availability */}
              <div className="flex justify-center items-center gap-4">
                {user.is_looking_for_job && (
                  <Badge className="bg-green-500 hover:bg-green-500 text-white">
                    Available for Work
                  </Badge>
                )}
                {user.expected_salary && (
                  <Badge variant="outline" className="border-[#10a37f] text-[#10a37f]">
                    ${user.expected_salary}
                  </Badge>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#10a37f] text-[#10a37f] hover:bg-[#10a37f] hover:text-white"
                  onClick={() => window.location.href = `mailto:${user.email}`}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Contact
                </Button>
              </div>

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
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                {user.summary || 'No summary available.'}
              </p>
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
                        <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>{exp.description}</p>
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
                    <div key={index} className={`${isDark ? 'bg-[#2a2a2a]/50' : 'bg-gray-50/80'} rounded-xl p-5 border ${isDark ? 'border-[#10a37f]/10 hover:border-[#10a37f]/30' : 'border-gray-200 hover:border-[#10a37f]/50'} transition-all duration-300 group`}>
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
                                className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
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
                                className="flex items-center gap-1 px-3 py-1.5 bg-[#10a37f] hover:bg-[#0d8f6f] text-white text-sm rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
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
                        <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>{project.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, techIndex) => (
                            <span 
                              key={techIndex} 
                              className="px-3 py-1 bg-[#10a37f]/20 text-[#10a37f] text-sm rounded-full border border-[#10a37f]/30"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-center py-4`}>No projects available.</p>
                )}
              </div>
            </div>

            {/* Certifications */}
            {(user.certifications || []).length > 0 && (
              <div className={`${isDark ? 'bg-gradient-to-br from-[#1a1a1a]/80 to-[#2a2a2a]/60' : 'bg-white/80'} backdrop-blur-sm rounded-2xl p-6 border ${isDark ? 'border-[#10a37f]/20' : 'border-gray-200'}`}>
                <h2 className={`text-xl font-bold ${getThemeClasses().text} mb-6 flex items-center`}>
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
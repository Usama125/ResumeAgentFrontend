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

interface MobilePublicProfileViewProps {
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

export default function MobilePublicProfileView({
  user,
  chatHistory,
  setChatHistory,
  suggestedQuestions,
  message,
  setMessage,
  isLoading,
  handleSendMessage
}: MobilePublicProfileViewProps) {
  const [mobileView, setMobileView] = useState<'profile' | 'chat'>('profile')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const bottomTextareaRef = useRef<HTMLTextAreaElement>(null)
  const { isDark } = useTheme()

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

  const handleQuestionClick = (question: string) => {
    handleSendMessage(question)
  }

  return (
    <div className="flex h-[calc(100vh-56px)] relative w-full">
      {/* Mobile Floating Button */}
      <div>
        {mobileView === 'profile' && (
          <button
            onClick={() => setMobileView('chat')}
            className="fixed bottom-6 right-6 w-14 h-14 bg-[#10a37f] hover:bg-[#0d8f6f] rounded-full shadow-lg z-50 flex items-center justify-center transition-colors"
            title="Start Chat"
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </button>
        )}
        {mobileView === 'chat' && (
          <button
            onClick={() => setMobileView('profile')}
            className="fixed bottom-6 right-6 w-14 h-14 bg-[#10a37f] hover:bg-[#0d8f6f] rounded-full shadow-lg z-50 flex items-center justify-center transition-colors"
            title="View Profile"
          >
            <User className="w-6 h-6 text-white" />
          </button>
        )}
      </div>

      {/* Profile View */}
      <div className={`${
        mobileView === 'profile' ? 'w-full' : 'hidden'
      } ${isDark ? 'bg-[#212121]' : 'bg-gray-50'} h-full overflow-y-auto`}>
        
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#10a37f]/5 via-transparent to-[#10a37f]/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#10a37f]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0d8f6f]/5 rounded-full blur-2xl"></div>

        {/* Content Container */}
        <div className="h-full overflow-y-auto">
          <div className="p-4 space-y-6">
            {/* Hero Section */}
            <div className="text-center space-y-6">
              {/* Profile Picture */}
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full blur-lg opacity-30"></div>
                <img
                  src={getImageUrl(user.profile_picture)}
                  alt={user.name}
                  className="relative w-24 h-24 rounded-full object-cover border-4 border-[#10a37f]/30 shadow-2xl"
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
                <h1 className={`text-2xl font-bold ${isDark ? 'bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent' : 'text-gray-900'}`}>
                  {user.name}
                </h1>
                <p className="text-lg text-[#10a37f] font-medium">{user.designation}</p>
                <div className={`flex items-center justify-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{user.location}</span>
                </div>
              </div>

              {/* Contact & Availability */}
              <div className="flex flex-col items-center gap-3">
                <div className="flex flex-wrap justify-center gap-2">
                  {user.is_looking_for_job && (
                    <Badge className="bg-green-500 hover:bg-green-500 text-white text-xs">
                      Available for Work
                    </Badge>
                  )}
                  {user.expected_salary && (
                    <Badge variant="outline" className="border-[#10a37f] text-[#10a37f] text-xs">
                      ${user.expected_salary}
                    </Badge>
                  )}
                </div>
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
              <div className="flex justify-center space-x-4">
                <div className="text-center">
                  <div className={`text-lg font-bold ${getThemeClasses().text}`}>
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
                  <div className={`text-lg font-bold ${getThemeClasses().text}`}>{(user.skills || []).length}</div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Skills</div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-bold ${getThemeClasses().text}`}>{(user.projects || []).length}</div>
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
              
              <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#10a37f]/30 pr-2">
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
                          <div className="flex gap-1">
                            {project.github_url && (
                              <a
                                href={project.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 px-2 py-1 bg-gray-800 hover:bg-gray-700 text-white text-xs rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                                title="View GitHub Repository"
                              >
                                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
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
                                className="flex items-center gap-1 px-2 py-1 bg-[#10a37f] hover:bg-[#0d8f6f] text-white text-xs rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                                title="Visit Live Demo"
                              >
                                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Chat View */}
      <div className={`${
        mobileView === 'chat' ? 'w-full' : 'hidden'
      } ${isDark ? 'bg-[#1a1a1a]' : 'bg-white'} h-full flex flex-col`}>
        
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto relative">
          {chatHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              {/* Welcome Message */}
              <div className="mb-8">
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-[#10a37f]/30 shadow-lg shadow-[#10a37f]/20">
                    <img src="/placeholder-user.jpg" alt="AI Resume Builder" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-2xl opacity-20 blur"></div>
                </div>
                <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent' : 'text-gray-900'}`}>
                  Learn About {user.name.split(' ')[0]}
                </h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm max-w-sm mx-auto leading-relaxed`}>
                  Ask questions about their experience, skills, projects, or availability.
                </p>
              </div>

              {/* Centered Input Area */}
              <div className="w-full max-w-2xl mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-2xl blur opacity-20"></div>
                  <div className={`relative ${isDark ? 'bg-[#2f2f2f]/80' : 'bg-white/90'} backdrop-blur-sm rounded-2xl border ${isDark ? 'border-[#565869]/60' : 'border-gray-300'}`}>
                    <div className="relative flex items-end">
                      <textarea
                        ref={textareaRef}
                        placeholder={`Ask about ${user.name.split(' ')[0]}'s background, skills, or experience...`}
                        value={message}
                        onChange={handleTextareaChange}
                        onKeyPress={handleKeyPress}
                        className={`w-full bg-transparent border-0 ${getThemeClasses().text} ${isDark ? 'placeholder-gray-400' : 'placeholder-gray-500'} focus:ring-0 focus:outline-none py-3 px-6 pr-14 text-base rounded-2xl resize-none`}
                        disabled={isLoading}
                        rows={1}
                        style={{
                          height: '48px',
                          minHeight: '48px',
                          maxHeight: '120px',
                          scrollbarWidth: 'thin',
                          scrollbarColor: '#565869 transparent'
                        }}
                      />
                      <Button
                        onClick={() => handleSendMessage()}
                        disabled={!message.trim() || isLoading}
                        className={`absolute right-0 top-1/2 -translate-y-1/2 bg-transparent hover:bg-[#10a37f]/10 text-[#10a37f] ${isDark ? 'hover:text-white' : 'hover:text-[#10a37f]'} rounded-xl px-2 py-1 transition-all duration-300 backdrop-blur-sm shadow-lg shadow-[#10a37f]/20 hover:shadow-[#10a37f]/30 border border-[#10a37f]/20 hover:border-[#10a37f]/40 disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Action Chips */}
              <div className="w-full max-w-2xl">
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>Or try these quick questions:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {suggestedQuestions.map((question, index) => (
                    <div key={index} className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#40414f]/80 to-[#40414f]/60 rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                      <button
                        onClick={() => handleQuestionClick(question)}
                        className={`relative ${isDark ? 'bg-[#40414f]/80 border-[#565869]/60 text-gray-300 hover:bg-[#565869]/80 hover:text-white' : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200 hover:text-gray-900'} backdrop-blur-sm border hover:border-[#10a37f]/50 text-xs px-3 py-1.5 rounded-full transition-all duration-300 hover:scale-105 text-center flex items-center justify-center`}
                      >
                        {question}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 space-y-4 pb-20">
              {chatHistory.map((chat, index) => (
                <div key={index} className={`flex ${chat.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`relative max-w-[80%]`}>
                    {chat.type === "user" && (
                      <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-xl blur opacity-20"></div>
                    )}
                    <div
                      className={`relative p-4 rounded-xl ${
                        chat.type === "user" 
                          ? "bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] text-white shadow-lg shadow-[#10a37f]/25" 
                          : isDark 
                            ? "bg-[#40414f]/80 backdrop-blur-sm text-gray-100 border border-[#565869]/60"
                            : "bg-white/90 backdrop-blur-sm text-gray-900 border border-gray-300 shadow-sm"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{chat.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className={`${isDark ? 'bg-[#40414f]/80 text-gray-100 border-[#565869]/60' : 'bg-white/90 text-gray-900 border-gray-300'} backdrop-blur-sm p-4 rounded-xl border`}>
                    <div className="flex space-x-1">
                      <div className={`w-2 h-2 ${isDark ? 'bg-gray-400' : 'bg-gray-500'} rounded-full animate-bounce`}></div>
                      <div
                        className={`w-2 h-2 ${isDark ? 'bg-gray-400' : 'bg-gray-500'} rounded-full animate-bounce`}
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className={`w-2 h-2 ${isDark ? 'bg-gray-400' : 'bg-gray-500'} rounded-full animate-bounce`}
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Fixed Input at Bottom - Only show when chat is active */}
        {chatHistory.length > 0 && (
          <div className={`absolute bottom-0 left-0 right-0 ${isDark ? 'bg-[#2f2f2f]/95' : 'bg-white/95'} backdrop-blur-sm border-t ${getThemeClasses().border} p-2`}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-xl blur opacity-20"></div>
              <div className={`relative ${isDark ? 'bg-[#40414f]/80 border-[#565869]/60' : 'bg-white/90 border-gray-300'} backdrop-blur-sm rounded-xl border`}>
                <div className="relative flex items-end">
                  <textarea
                    ref={bottomTextareaRef}
                    placeholder="Continue the conversation..."
                    value={message}
                    onChange={handleTextareaChange}
                    onKeyPress={handleKeyPress}
                    className={`w-full bg-transparent border-0 ${getThemeClasses().text} ${isDark ? 'placeholder-gray-400' : 'placeholder-gray-500'} focus:ring-0 focus:outline-none py-2 px-4 pr-12 text-sm rounded-xl resize-none`}
                    disabled={isLoading}
                    rows={1}
                    style={{
                      height: '32px',
                      minHeight: '32px',
                      maxHeight: '120px',
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#565869 transparent'
                    }}
                  />
                  <Button
                    onClick={() => handleSendMessage()}
                    disabled={!message.trim() || isLoading}
                    className={`absolute right-1 bottom-1 bg-transparent hover:bg-[#10a37f]/10 text-[#10a37f] ${isDark ? 'hover:text-white' : 'hover:text-[#10a37f]'} rounded-lg px-2 py-1 transition-all duration-300 backdrop-blur-sm shadow-lg shadow-[#10a37f]/20 hover:shadow-[#10a37f]/30 border border-[#10a37f]/20 hover:border-[#10a37f]/40 disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
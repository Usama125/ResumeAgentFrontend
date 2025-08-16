"use client"

import { User, Quote, Sparkles, BookOpen, Target, Lightbulb, Star } from "lucide-react"
import { User as UserType } from "@/types"
import { useTheme } from "@/context/ThemeContext"
import { getThemeClasses } from "@/utils/theme"
import { useState } from "react"

interface AdvancedAboutSectionProps {
  user: UserType
  isEditMode?: boolean
  onEdit?: () => void
  onDelete?: () => void
}

export default function AdvancedAboutSection({
  user,
  isEditMode = false,
  onEdit,
  onDelete
}: AdvancedAboutSectionProps) {
  const { isDark } = useTheme()
  const theme = getThemeClasses(isDark)
  const [isExpanded, setIsExpanded] = useState(false)

  // Check if section has data
  const hasData = !!(user.summary && user.summary.trim())

  // Don't render if no data and not in edit mode
  if (!hasData && !isEditMode) {
    return null
  }

  // Show only 5 lines when collapsed, approximately 50 characters per line = 250 characters
  const shouldTruncate = user.summary && user.summary.length > 250
  const displayText = shouldTruncate && !isExpanded && user.summary ? user.summary.substring(0, 250) + "..." : (user.summary || "")

  return (
    <div className={`group relative rounded-2xl overflow-hidden ${
      isDark 
        ? 'bg-gradient-to-br from-[#2a2a2a]/60 via-[#1a1a1a]/80 to-[#2a2a2a]/60 border-2 border-[#10a37f]/30' 
        : 'bg-gradient-to-br from-white/80 via-gray-50/90 to-white/80 border-2 border-[#10a37f]/20'
    } backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:border-[#10a37f]/50`}>
      
      {/* Advanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#10a37f]/8 to-transparent rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#0d8f6f]/6 to-transparent rounded-full blur-xl"></div>
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-[#10a37f]/20 rounded-full animate-pulse"></div>
        <div className="absolute top-1/4 right-1/3 w-1 h-1 bg-[#10a37f]/30 rounded-full animate-ping"></div>
      </div>

      {/* Premium Border Glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#10a37f]/10 via-[#0d8f6f]/5 to-[#10a37f]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>

      <div className="relative z-10 p-4 sm:p-8">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-xl opacity-20 animate-pulse"></div>
              <div className="relative p-2 sm:p-3 rounded-xl bg-gradient-to-br from-[#10a37f]/20 to-[#0d8f6f]/20 backdrop-blur-sm">
                <User className="w-4 h-4 sm:w-6 sm:h-6 text-[#10a37f]" />
              </div>
            </div>
            <div>
              <h3 className={`text-lg sm:text-2xl font-bold bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] bg-clip-text text-transparent`}>
                About Me
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <BookOpen className="w-3 h-3 text-[#10a37f]/60" />
                <span className={`text-xs ${theme.text.tertiary}`}>Professional Summary</span>
              </div>
            </div>
          </div>
          
          {isEditMode && (
            <div className="flex items-center gap-2">
              {onEdit && (
                <button
                  onClick={onEdit}
                  className={`group/btn p-3 rounded-xl transition-all duration-300 ${
                    isDark 
                      ? 'bg-[#1a1a1a]/60 hover:bg-[#10a37f]/20 border border-[#10a37f]/20 hover:border-[#10a37f]/40' 
                      : 'bg-white/60 hover:bg-[#10a37f]/10 border border-[#10a37f]/15 hover:border-[#10a37f]/30'
                  } backdrop-blur-sm hover:scale-105 hover:shadow-lg`}
                  title="Edit About Section"
                >
                  <svg className="w-4 h-4 text-[#10a37f] group-hover/btn:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              )}
              {hasData && onDelete && (
                <button
                  onClick={onDelete}
                  className={`group/btn p-3 rounded-xl transition-all duration-300 ${
                    isDark 
                      ? 'bg-[#1a1a1a]/60 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40' 
                      : 'bg-white/60 hover:bg-red-500/10 border border-red-300/20 hover:border-red-400/30'
                  } backdrop-blur-sm hover:scale-105 hover:shadow-lg`}
                  title="Delete About Section"
                >
                  <svg className="w-4 h-4 text-red-400 group-hover/btn:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Enhanced Content */}
        {hasData ? (
          <div className="space-y-4">
            {/* Quote with enhanced styling */}
            <div className="relative">
              <Quote className="z-10 w-6 h-6 sm:w-8 sm:h-8 text-[#10a37f]/20 absolute -top-1 -left-1 sm:-top-2 sm:-left-2 transform rotate-12" />
              <div className={`relative pl-4 sm:pl-6 pr-2 sm:pr-4 py-3 sm:py-4 rounded-xl ${
                isDark 
                  ? 'bg-[#1a1a1a]/30 border-l-4 border-[#10a37f]/50' 
                  : 'bg-white/40 border-l-4 border-[#10a37f]/60'
              } backdrop-blur-sm`}>
                <p className={`${theme.text.primary} text-sm sm:text-lg leading-relaxed font-medium`}>
                  {displayText}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
              {shouldTruncate && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className={`group flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl transition-all duration-300 ${
                    isDark 
                      ? 'bg-[#1a1a1a]/50 hover:bg-[#10a37f]/20 border border-[#10a37f]/20 hover:border-[#10a37f]/40' 
                      : 'bg-white/50 hover:bg-[#10a37f]/10 border border-[#10a37f]/15 hover:border-[#10a37f]/30'
                  } backdrop-blur-sm hover:scale-105 hover:shadow-md`}
                >
                  <span className="text-[#10a37f] font-medium text-xs sm:text-sm">
                    {isExpanded ? 'Show Less' : 'Read More'}
                  </span>
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-[#10a37f] group-hover:animate-spin" />
                </button>
              )}

              {/* Professional indicators */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className={`flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full ${
                  isDark 
                    ? 'bg-[#10a37f]/10 border border-[#10a37f]/20' 
                    : 'bg-[#10a37f]/5 border border-[#10a37f]/15'
                } backdrop-blur-sm`}>
                  <Target className="w-3 h-3 text-[#10a37f]" />
                  <span className="text-[#10a37f] text-xs font-medium">Professional</span>
                </div>
                
                <div className={`flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full ${
                  isDark 
                    ? 'bg-[#0d8f6f]/10 border border-[#0d8f6f]/20' 
                    : 'bg-[#0d8f6f]/5 border border-[#0d8f6f]/15'
                } backdrop-blur-sm`}>
                  <Lightbulb className="w-3 h-3 text-[#0d8f6f]" />
                  <span className="text-[#0d8f6f] text-xs font-medium">Verified</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <div className="relative mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full bg-gradient-to-br from-[#10a37f]/20 to-[#0d8f6f]/20 flex items-center justify-center backdrop-blur-sm">
                <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-[#10a37f]" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 bg-[#10a37f] rounded-full flex items-center justify-center">
                <Sparkles className="w-2 h-2 sm:w-3 sm:h-3 text-white animate-pulse" />
              </div>
            </div>
            
            <h4 className={`text-base sm:text-lg font-semibold ${theme.text.primary} mb-2`}>
              Tell Your Story
            </h4>
            <p className={`${theme.text.secondary} text-xs sm:text-sm mb-4 sm:mb-6 max-w-md mx-auto`}>
              Share your professional journey, goals, and what makes you unique. A compelling about section helps you stand out.
            </p>
            
            {isEditMode && onEdit && (
              <button
                onClick={onEdit}
                className="group inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#10a37f] text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl backdrop-blur-sm text-sm sm:text-base"
              >
                <Star className="w-3 h-3 sm:w-4 sm:h-4 group-hover:animate-spin" />
                Create About Section
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 group-hover:animate-pulse" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
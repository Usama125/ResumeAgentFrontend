"use client"

import { User, Quote, Sparkles } from "lucide-react"
import { User as UserType } from "@/types"
import { useTheme } from "@/context/ThemeContext"
import { getThemeClasses } from "@/utils/theme"
import { useState } from "react"

interface CompactAboutSectionProps {
  user: UserType
  isEditMode?: boolean
  onEdit?: () => void
  onDelete?: () => void
}

export default function CompactAboutSection({
  user,
  isEditMode = false,
  onEdit,
  onDelete
}: CompactAboutSectionProps) {
  const { isDark } = useTheme()
  const theme = getThemeClasses(isDark)
  const [isExpanded, setIsExpanded] = useState(false)

  // Check if section has data
  const hasData = !!(user.summary && user.summary.trim())

  // Don't render if no data and not in edit mode
  if (!hasData && !isEditMode) {
    return null
  }

  return (
    <div className={`relative rounded-xl overflow-hidden ${
      isDark 
        ? 'bg-[#2a2a2a]/40 border border-[#10a37f]/20' 
        : 'bg-white/60 border border-[#10a37f]/15'
    } backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#10a37f]/10 to-transparent rounded-full blur-xl"></div>
      </div>

      <div className="relative z-10 p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#10a37f]/20">
              <User className="w-4 h-4 text-[#10a37f]" />
            </div>
            <h3 className={`text-sm font-semibold ${theme.text.primary}`}>About</h3>
          </div>
          {isEditMode && (
            <div className="flex items-center gap-1">
              {onEdit && (
                <button
                  onClick={onEdit}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isDark 
                      ? 'hover:bg-[#10a37f]/20 text-gray-400 hover:text-[#10a37f]' 
                      : 'hover:bg-[#10a37f]/10 text-gray-500 hover:text-[#10a37f]'
                  }`}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              )}
              {hasData && onDelete && (
                <button
                  onClick={onDelete}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isDark 
                      ? 'hover:bg-red-500/20 text-gray-400 hover:text-red-400' 
                      : 'hover:bg-red-500/10 text-gray-500 hover:text-red-500'
                  }`}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        {hasData ? (
          <div className="relative">
            <Quote className="w-3 h-3 text-[#10a37f]/40 absolute -top-1 -left-1" />
            <p className={`${theme.text.secondary} text-sm leading-relaxed pl-2 ${
              user.summary && user.summary.length > 150 && !isExpanded ? 'line-clamp-2' : ''
            }`}>
              {user.summary}
            </p>
            {user.summary && user.summary.length > 150 && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-[#10a37f] hover:text-[#0d8f6f] text-xs font-medium mt-1 transition-colors group"
              >
                {isExpanded ? 'Show less' : 'Read more'}
                <Sparkles className="w-2.5 h-2.5 inline ml-1 group-hover:animate-pulse" />
              </button>
            )}
          </div>
        ) : (
          <div className="text-center py-2">
            <p className={`${theme.text.tertiary} text-xs italic`}>
              Add a brief summary about yourself
            </p>
            {isEditMode && onEdit && (
              <button
                onClick={onEdit}
                className="text-[#10a37f] hover:text-[#0d8f6f] text-xs font-medium mt-1 transition-colors"
              >
                Add summary
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
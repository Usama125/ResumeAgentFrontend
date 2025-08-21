"use client"

import { useState } from "react"
import { Briefcase, Edit, Trash2, Calendar, MapPin, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { User as UserType } from "@/types"
import { useTheme } from "@/context/ThemeContext"
import { getThemeClasses } from "@/utils/theme"

interface CompactExperienceSectionProps {
  user: UserType
  isEditMode?: boolean
  onEdit?: () => void
  onDelete?: () => void
  onEditExperience?: (index: number) => void
  onDeleteExperience?: (index: number) => void
  onAddExperience?: () => void
}

export default function CompactExperienceSection({
  user,
  isEditMode = false,
  onEdit,
  onDelete,
  onEditExperience,
  onDeleteExperience,
  onAddExperience
}: CompactExperienceSectionProps) {
  const { isDark } = useTheme()
  const theme = getThemeClasses(isDark)
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())

  // Check if section has data
  const hasData = !!(user.experience_details && user.experience_details.length > 0)

  // Don't render if no data and not in edit mode
  if (!hasData && !isEditMode) {
    return null
  }

  const toggleExpand = (index: number) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  return (
    <div className={`relative rounded-xl ${
      isDark 
        ? 'bg-[#2a2a2a]/40 border border-[#10a37f]/20' 
        : 'bg-white/60 border border-[#10a37f]/15'
    } backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300`}
    style={{ overflow: 'visible' }}>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#10a37f]/10 to-transparent rounded-full blur-xl"></div>
      </div>

      <div className="relative z-10 p-4 overflow-hidden rounded-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#10a37f]/20">
              <Briefcase className="w-4 h-4 text-[#10a37f]" />
            </div>
            <h3 className={`text-sm font-semibold ${theme.text.primary}`}>Professional Experience</h3>
          </div>
          
          {isEditMode && (
            <div className="flex items-center gap-1">
              {onAddExperience && (
                <button
                  onClick={onAddExperience}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isDark 
                      ? 'hover:bg-[#10a37f]/20 text-gray-400 hover:text-[#10a37f]' 
                      : 'hover:bg-[#10a37f]/10 text-gray-500 hover:text-[#10a37f]'
                  }`}
                  title="Add Experience"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
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
                  title="Delete All Experience"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        {hasData ? (
          <div className="space-y-3">
            {user.experience_details.map((exp, index) => {
              const isExpanded = expandedItems.has(index)
              const shouldTruncate = exp.description && exp.description.length > 200
              
              return (
                <div 
                  key={index} 
                  className={`relative p-3 rounded-lg border ${
                    isDark 
                      ? 'bg-[#1a1a1a]/30 border-[#10a37f]/20' 
                      : 'bg-white/40 border-[#10a37f]/15'
                  } backdrop-blur-sm hover:border-[#10a37f]/30 transition-all duration-200`}
                  style={{ overflow: 'visible' }}
                >
                  {/* Timeline dot */}
                  <div className="absolute -left-1 top-4 w-2 h-2 bg-[#10a37f] rounded-full"></div>
                  
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      {/* Position and Company */}
                      <div className="flex items-start gap-2 mb-1">
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-medium text-sm ${theme.text.primary} truncate`}>
                            {exp.position}
                          </h4>
                          <p className="text-[#10a37f] text-sm font-medium truncate">
                            {exp.company}
                          </p>
                        </div>
                      </div>
                      
                      {/* Duration */}
                      <div className="flex items-center gap-1 mb-2">
                        <Calendar className="w-3 h-3 text-[#10a37f]/60" />
                        <span className={`text-xs ${theme.text.tertiary}`}>
                          {exp.duration}
                        </span>
                      </div>
                      
                      {/* Description */}
                      {exp.description && (
                        <div className="relative">
                          <p className={`${theme.text.secondary} text-xs leading-relaxed ${
                            shouldTruncate && !isExpanded ? 'line-clamp-2' : ''
                          }`}>
                            {exp.description}
                          </p>
                          
                          {shouldTruncate && (
                            <button 
                              onClick={() => toggleExpand(index)}
                              className="text-[#10a37f] hover:text-[#0d8f6f] text-xs font-medium mt-1 transition-colors group"
                            >
                              {isExpanded ? 'Show less' : 'Read more'}
                              <Sparkles className="w-2.5 h-2.5 inline ml-1 group-hover:animate-pulse" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Edit Actions */}
                    {isEditMode && (onEditExperience || onDeleteExperience) && (
                      <div className="flex gap-1 ml-2 flex-shrink-0">
                        {onEditExperience && (
                          <button
                            onClick={() => onEditExperience(index)}
                            className={`p-1 rounded transition-colors ${
                              isDark 
                                ? 'hover:bg-[#10a37f]/20 text-gray-400 hover:text-[#10a37f]' 
                                : 'hover:bg-[#10a37f]/10 text-gray-500 hover:text-[#10a37f]'
                            }`}
                            title="Edit Experience"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                        )}
                        {onDeleteExperience && (
                          <button
                            onClick={() => onDeleteExperience(index)}
                            className={`p-1 rounded transition-colors ${
                              isDark 
                                ? 'hover:bg-red-500/20 text-gray-400 hover:text-red-400' 
                                : 'hover:bg-red-500/10 text-gray-500 hover:text-red-500'
                            }`}
                            title="Delete Experience"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-2">
            <p className={`${theme.text.tertiary} text-xs italic mb-2`}>
              Add your professional experience to showcase your career journey
            </p>
            {isEditMode && onAddExperience && (
              <button
                onClick={onAddExperience}
                className="text-[#10a37f] hover:text-[#0d8f6f] text-xs font-medium transition-colors"
              >
                Add experience
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
"use client"

import { useState } from "react"
import { 
  Briefcase, 
  Edit, 
  Trash2, 
  Calendar, 
  Building2, 
  Award, 
  Sparkles, 
  ChevronDown, 
  ChevronUp,
  Star,
  Target,
  Plus,
  Trophy
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { User as UserType } from "@/types"
import { useTheme } from "@/context/ThemeContext"
import { getThemeClasses } from "@/utils/theme"

interface AdvancedExperienceSectionProps {
  user: UserType
  isEditMode?: boolean
  onEdit?: () => void
  onDelete?: () => void
  onEditExperience?: (index: number) => void
  onDeleteExperience?: (index: number) => void
  onAddExperience?: () => void
}

export default function AdvancedExperienceSection({
  user,
  isEditMode = false,
  onEdit,
  onDelete,
  onEditExperience,
  onDeleteExperience,
  onAddExperience
}: AdvancedExperienceSectionProps) {
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

      <div className="relative z-10 p-8">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-xl opacity-20 animate-pulse"></div>
              <div className="relative p-3 rounded-xl bg-gradient-to-br from-[#10a37f]/20 to-[#0d8f6f]/20 backdrop-blur-sm">
                <Briefcase className="w-6 h-6 text-[#10a37f]" />
              </div>
            </div>
            <div>
              <h3 className={`text-2xl font-bold bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] bg-clip-text text-transparent`}>
                Professional Experience
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Trophy className="w-3 h-3 text-[#10a37f]/60" />
                <span className={`text-xs ${theme.text.tertiary}`}>Career Journey</span>
                {hasData && (
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#10a37f]/10 border border-[#10a37f]/20">
                    <Star className="w-2.5 h-2.5 text-[#10a37f]" />
                    <span className="text-[#10a37f] text-xs font-medium">{user.experience_details.length} Role{user.experience_details.length !== 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {isEditMode && (
            <div className="flex items-center gap-2">
              {onAddExperience && (
                <button
                  onClick={onAddExperience}
                  className={`group/btn p-3 rounded-xl transition-all duration-300 ${
                    isDark 
                      ? 'bg-[#1a1a1a]/60 hover:bg-[#10a37f]/20 border border-[#10a37f]/20 hover:border-[#10a37f]/40' 
                      : 'bg-white/60 hover:bg-[#10a37f]/10 border border-[#10a37f]/15 hover:border-[#10a37f]/30'
                  } backdrop-blur-sm hover:scale-105 hover:shadow-lg`}
                  title="Add Experience"
                >
                  <Plus className="w-4 h-4 text-[#10a37f] group-hover/btn:animate-pulse" />
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
                  title="Delete All Experience"
                >
                  <Trash2 className="w-4 h-4 text-red-400 group-hover/btn:animate-pulse" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Enhanced Content */}
        {hasData ? (
          <div className="space-y-6">
            {user.experience_details.map((exp, index) => {
              const isExpanded = expandedItems.has(index)
              const shouldTruncate = exp.description && exp.description.length > 300
              
              return (
                <div 
                  key={index} 
                  className={`group/item relative overflow-hidden rounded-2xl border-2 ${
                    isDark 
                      ? 'bg-gradient-to-br from-[#1a1a1a]/80 via-[#2a2a2a]/60 to-[#1a1a1a]/80 border-[#10a37f]/20 hover:border-[#10a37f]/40' 
                      : 'bg-gradient-to-br from-white/80 via-gray-50/60 to-white/80 border-[#10a37f]/15 hover:border-[#10a37f]/30'
                  } backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-[#10a37f]/10`}
                >
                  {/* Experience Item Background Effects */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#10a37f]/5 to-transparent rounded-full blur-xl"></div>
                  </div>
                  
                  {/* Timeline Connection */}
                  {index < user.experience_details.length - 1 && (
                    <div className="absolute -bottom-6 left-8 w-0.5 h-12 bg-gradient-to-b from-[#10a37f]/30 to-transparent"></div>
                  )}
                  
                  {/* Timeline Dot */}
                  <div className="absolute -left-3 top-6 w-6 h-6 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full border-2 border-white dark:border-[#1a1a1a] shadow-lg z-20"></div>
                  
                  <div className="relative z-10 p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        {/* Position and Company Header */}
                        <div className="flex items-start gap-4 mb-4">
                          <div className="flex-1 min-w-0">
                            <h4 className={`text-xl font-bold ${theme.text.primary} mb-1`}>
                              {exp.position}
                            </h4>
                            <div className="flex items-center gap-2 mb-2">
                              <Building2 className="w-4 h-4 text-[#10a37f]" />
                              <p className="text-[#10a37f] text-lg font-semibold">
                                {exp.company}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Duration with enhanced styling */}
                        <div className="flex items-center gap-2 mb-4">
                          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                            isDark 
                              ? 'bg-[#10a37f]/10 border border-[#10a37f]/20' 
                              : 'bg-[#10a37f]/5 border border-[#10a37f]/15'
                          } backdrop-blur-sm`}>
                            <Calendar className="w-3 h-3 text-[#10a37f]" />
                            <span className={`text-sm font-medium ${theme.text.secondary}`}>
                              {exp.duration}
                            </span>
                          </div>
                        </div>
                        
                        {/* Enhanced Description */}
                        {exp.description && (
                          <div className="relative">
                            <div className={`relative p-4 rounded-xl ${
                              isDark 
                                ? 'bg-[#1a1a1a]/40 border-l-4 border-[#10a37f]/50' 
                                : 'bg-white/50 border-l-4 border-[#10a37f]/60'
                            } backdrop-blur-sm ${shouldTruncate ? 'mb-3' : 'mb-0'}`}>
                              <p className={`${theme.text.primary} text-base leading-relaxed font-medium ${
                                shouldTruncate && !isExpanded ? 'line-clamp-3' : ''
                              }`}>
                                {exp.description}
                              </p>
                            </div>
                            
                            {shouldTruncate && (
                              <div className="flex items-center justify-between pt-3 border-t border-[#10a37f]/20">
                                <button
                                  onClick={() => toggleExpand(index)}
                                  className={`group flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                                    isDark 
                                      ? 'bg-[#1a1a1a]/50 hover:bg-[#10a37f]/20 border border-[#10a37f]/20 hover:border-[#10a37f]/40' 
                                      : 'bg-white/50 hover:bg-[#10a37f]/10 border border-[#10a37f]/15 hover:border-[#10a37f]/30'
                                  } backdrop-blur-sm hover:scale-105 hover:shadow-md`}
                                >
                                  <span className="text-[#10a37f] font-medium text-sm">
                                    {isExpanded ? 'Show Less' : 'Read More'}
                                  </span>
                                  {isExpanded ? (
                                    <ChevronUp className="w-4 h-4 text-[#10a37f] group-hover:animate-bounce" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4 text-[#10a37f] group-hover:animate-bounce" />
                                  )}
                                </button>
                                
                                {/* Professional indicator */}
                                <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                                  isDark 
                                    ? 'bg-[#10a37f]/10 border border-[#10a37f]/20' 
                                    : 'bg-[#10a37f]/5 border border-[#10a37f]/15'
                                } backdrop-blur-sm`}>
                                  <Award className="w-3 h-3 text-[#10a37f]" />
                                  <span className="text-[#10a37f] text-xs font-medium">Professional</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Enhanced Edit Actions */}
                      {isEditMode && (onEditExperience || onDeleteExperience) && (
                        <div className="flex gap-2 ml-4 flex-shrink-0">
                          {onEditExperience && (
                            <button
                              onClick={() => onEditExperience(index)}
                              className={`group/btn p-3 rounded-xl transition-all duration-300 ${
                                isDark 
                                  ? 'bg-[#1a1a1a]/60 hover:bg-[#10a37f]/20 border border-[#10a37f]/20 hover:border-[#10a37f]/40' 
                                  : 'bg-white/60 hover:bg-[#10a37f]/10 border border-[#10a37f]/15 hover:border-[#10a37f]/30'
                              } backdrop-blur-sm hover:scale-105 hover:shadow-lg`}
                              title="Edit Experience"
                            >
                              <Edit className="w-4 h-4 text-[#10a37f] group-hover/btn:animate-pulse" />
                            </button>
                          )}
                          {onDeleteExperience && (
                            <button
                              onClick={() => onDeleteExperience(index)}
                              className={`group/btn p-3 rounded-xl transition-all duration-300 ${
                                isDark 
                                  ? 'bg-[#1a1a1a]/60 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40' 
                                  : 'bg-white/60 hover:bg-red-500/10 border border-red-300/20 hover:border-red-400/30'
                              } backdrop-blur-sm hover:scale-105 hover:shadow-lg`}
                              title="Delete Experience"
                            >
                              <Trash2 className="w-4 h-4 text-red-400 group-hover/btn:animate-pulse" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="relative mb-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#10a37f]/20 to-[#0d8f6f]/20 flex items-center justify-center backdrop-blur-sm">
                <Briefcase className="w-10 h-10 text-[#10a37f]" />
              </div>
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-[#10a37f] rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white animate-pulse" />
              </div>
            </div>
            
            <h4 className={`text-xl font-semibold ${theme.text.primary} mb-3`}>
              Share Your Professional Journey
            </h4>
            <p className={`${theme.text.secondary} text-sm mb-6 max-w-md mx-auto`}>
              Add your work experience to showcase your career progression, achievements, and the value you've brought to organizations.
            </p>
            
            {isEditMode && onAddExperience && (
              <button
                onClick={onAddExperience}
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#10a37f] text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl backdrop-blur-sm"
              >
                <Trophy className="w-4 h-4 group-hover:animate-spin" />
                Add Experience
                <Target className="w-4 h-4 group-hover:animate-pulse" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
"use client"

import { useState } from "react"
import { Briefcase, Edit, Trash2, Calendar, Building2, Plus, Trophy, Star, Target, Sparkles, ChevronUp, ChevronDown, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { User as UserType } from "@/types"
import { useTheme } from "@/context/ThemeContext"
import { getThemeClasses } from "@/utils/theme"
import BaseSection from "../BaseSection"

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
    <BaseSection
      id="experience"
      title="Professional Experience"
      icon={<Briefcase className="w-5 h-5 text-[#10a37f]" />}
      isEditMode={isEditMode}
      onDelete={hasData ? onDelete : undefined}
      onAdd={isEditMode ? onAddExperience : undefined}
    >
      <div className="space-y-4 sm:space-y-6">
        {hasData ? (
          user.experience_details.map((exp, index) => {
            const isExpanded = expandedItems.has(index)
            const shouldTruncate = exp.description && exp.description.length > 250
            
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
                
                <div className="relative z-10 p-4 sm:p-6">
                  {/* Edit/Delete buttons - Floating on mobile, inline on desktop */}
                  {isEditMode && (onEditExperience || onDeleteExperience) && (
                    <div className="absolute top-2 right-2 sm:hidden flex items-center gap-1">
                      {onEditExperience && (
                        <button
                          onClick={() => onEditExperience(index)}
                          className={`group/btn p-1.5 rounded-lg transition-all duration-300 ${
                            isDark 
                              ? 'bg-[#1a1a1a]/80 hover:bg-[#10a37f]/20 border border-[#10a37f]/20 hover:border-[#10a37f]/40' 
                              : 'bg-white/80 hover:bg-[#10a37f]/10 border border-[#10a37f]/15 hover:border-[#10a37f]/30'
                          } backdrop-blur-sm hover:scale-105 hover:shadow-lg`}
                          title="Edit Experience"
                        >
                          <Edit className="w-3 h-3 text-[#10a37f] group-hover/btn:animate-pulse" />
                        </button>
                      )}
                      {onDeleteExperience && (
                        <button
                          onClick={() => onDeleteExperience(index)}
                          className={`group/btn p-1.5 rounded-lg transition-all duration-300 ${
                            isDark 
                              ? 'bg-[#1a1a1a]/80 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40' 
                              : 'bg-white/80 hover:bg-red-500/10 border border-red-300/20 hover:border-red-400/30'
                          } backdrop-blur-sm hover:scale-105 hover:shadow-lg`}
                          title="Delete Experience"
                        >
                          <Trash2 className="w-3 h-3 text-red-400 group-hover/btn:animate-pulse" />
                        </button>
                      )}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    {/* Position and Company Header */}
                    <div className="flex items-start gap-2 sm:gap-4 mb-3 sm:mb-4">
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-base sm:text-xl font-bold ${theme.text.primary} mb-1`}>
                          {exp.position}
                        </h4>
                        <div className="flex items-center gap-2 mb-2">
                          <Building2 className="w-3 h-3 sm:w-4 sm:h-4 text-[#10a37f]" />
                          <p className="text-[#10a37f] text-sm sm:text-lg font-semibold">
                            {exp.company}
                          </p>
                        </div>
                      </div>
                      
                      {/* Desktop Edit/Delete buttons - Inline with header */}
                      {isEditMode && (onEditExperience || onDeleteExperience) && (
                        <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                          {onEditExperience && (
                            <button
                              onClick={() => onEditExperience(index)}
                              className={`group/btn p-2 rounded-xl transition-all duration-300 ${
                                isDark 
                                  ? 'bg-[#1a1a1a]/80 hover:bg-[#10a37f]/20 border border-[#10a37f]/20 hover:border-[#10a37f]/40' 
                                  : 'bg-white/80 hover:bg-[#10a37f]/10 border border-[#10a37f]/15 hover:border-[#10a37f]/30'
                              } backdrop-blur-sm hover:scale-105 hover:shadow-lg`}
                              title="Edit Experience"
                            >
                              <Edit className="w-4 h-4 text-[#10a37f] group-hover/btn:animate-pulse" />
                            </button>
                          )}
                          {onDeleteExperience && (
                            <button
                              onClick={() => onDeleteExperience(index)}
                              className={`group/btn p-2 rounded-xl transition-all duration-300 ${
                                isDark 
                                  ? 'bg-[#1a1a1a]/80 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40' 
                                  : 'bg-white/80 hover:bg-red-500/10 border border-red-300/20 hover:border-red-400/30'
                              } backdrop-blur-sm hover:scale-105 hover:shadow-lg`}
                              title="Delete Experience"
                            >
                              <Trash2 className="w-4 h-4 text-red-400 group-hover/btn:animate-pulse" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Duration with enhanced styling */}
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <div className={`flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full ${
                        isDark 
                          ? 'bg-[#10a37f]/10 border border-[#10a37f]/20' 
                          : 'bg-[#10a37f]/5 border border-[#10a37f]/15'
                      } backdrop-blur-sm`}>
                        <Calendar className="w-3 h-3 text-[#10a37f]" />
                        <span className={`text-xs sm:text-sm font-medium ${theme.text.secondary}`}>
                          {exp.duration}
                        </span>
                      </div>
                    </div>
                    
                    {/* Enhanced Description */}
                    {exp.description && (
                      <div className="relative">
                        <div className={`relative p-3 sm:p-4 rounded-xl ${
                          isDark 
                            ? 'bg-[#1a1a1a]/40 border-l-4 border-[#10a37f]/50' 
                            : 'bg-white/50 border-l-4 border-[#10a37f]/60'
                        } backdrop-blur-sm ${shouldTruncate ? 'mb-3' : 'mb-0'}`}>
                          <p className={`${theme.text.primary} text-sm sm:text-base leading-relaxed font-medium ${
                            shouldTruncate && !isExpanded ? 'line-clamp-3' : ''
                          }`}>
                            {exp.description}
                          </p>
                        </div>
                        
                        {shouldTruncate && (
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 pt-3 border-t border-[#10a37f]/20">
                            <button
                              onClick={() => toggleExpand(index)}
                              className={`group flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl transition-all duration-300 ${
                                isDark 
                                  ? 'bg-[#1a1a1a]/50 hover:bg-[#10a37f]/20 border border-[#10a37f]/20 hover:border-[#10a37f]/40' 
                                  : 'bg-white/50 hover:bg-[#10a37f]/10 border border-[#10a37f]/15 hover:border-[#10a37f]/30'
                              } backdrop-blur-sm hover:scale-105 hover:shadow-md`}
                            >
                              <span className="text-[#10a37f] font-medium text-xs sm:text-sm">
                                {isExpanded ? 'Show Less' : 'Read More'}
                              </span>
                              {isExpanded ? (
                                <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4 text-[#10a37f] group-hover:animate-bounce" />
                              ) : (
                                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-[#10a37f] group-hover:animate-bounce" />
                              )}
                            </button>
                            
                            {/* Professional indicator */}
                            <div className={`flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full ${
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
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-8 sm:py-12">
            <div className="relative mb-4 sm:mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gradient-to-br from-[#10a37f]/20 to-[#0d8f6f]/20 flex items-center justify-center backdrop-blur-sm">
                <Briefcase className="w-8 h-8 sm:w-10 sm:h-10 text-[#10a37f]" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 bg-[#10a37f] rounded-full flex items-center justify-center">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white animate-pulse" />
              </div>
            </div>
            
            <h4 className={`text-lg sm:text-xl font-semibold ${theme.text.primary} mb-2 sm:mb-3`}>
              Share Your Professional Journey
            </h4>
            <p className={`${theme.text.secondary} text-xs sm:text-sm mb-4 sm:mb-6 max-w-md mx-auto`}>
              Add your work experience to showcase your career progression, achievements, and the value you've brought to organizations.
            </p>
            
            {isEditMode && onAddExperience && (
              <button
                onClick={onAddExperience}
                className="group inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#10a37f] text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl backdrop-blur-sm text-sm sm:text-base"
              >
                <Trophy className="w-3 h-3 sm:w-4 sm:h-4 group-hover:animate-spin" />
                Add Experience
                <Target className="w-3 h-3 sm:w-4 sm:h-4 group-hover:animate-pulse" />
              </button>
            )}
          </div>
        )}
      </div>
    </BaseSection>
  )
}
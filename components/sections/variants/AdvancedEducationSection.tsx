"use client"

import { useState } from "react"
import { BookOpen, Edit, Trash2, Calendar, MapPin, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { User as UserType } from "@/types"
import { useTheme } from "@/context/ThemeContext"
import { getThemeClasses } from "@/utils/theme"
import BaseSection from "../BaseSection"

interface AdvancedEducationSectionProps {
  user: UserType
  isEditMode?: boolean
  onEdit?: () => void
  onDelete?: () => void
  onEditEducation?: (index: number) => void
  onDeleteEducation?: (index: number) => void
  onAddEducation?: () => void
}

export default function AdvancedEducationSection({
  user,
  isEditMode = false,
  onEdit,
  onDelete,
  onEditEducation,
  onDeleteEducation,
  onAddEducation
}: AdvancedEducationSectionProps) {
  const { isDark } = useTheme()
  const theme = getThemeClasses(isDark)

  // Check if section has data
  const hasData = !!(user.education && user.education.length > 0)

  // Don't render if no data and not in edit mode
  if (!hasData && !isEditMode) {
    return null
  }

  return (
    <BaseSection
      id="education"
      title="Education"
      icon={<BookOpen className="w-5 h-5 text-[#10a37f]" />}
      isEditMode={isEditMode}
      onDelete={hasData ? onDelete : undefined}
      onAdd={isEditMode ? onAddEducation : undefined}
    >
      <div className="space-y-4 sm:space-y-6">
        {hasData ? (
          user.education.map((education, index) => (
            <div 
              key={index} 
              className={`group/education relative overflow-hidden rounded-2xl border-2 transition-all duration-500 ${
                isDark 
                  ? 'bg-gradient-to-br from-[#1a1a1a]/80 via-[#2a2a2a]/60 to-[#1a1a1a]/80 border-[#10a37f]/20 hover:border-[#10a37f]/40' 
                  : 'bg-gradient-to-br from-white/80 via-gray-50/60 to-white/80 border-[#10a37f]/15 hover:border-[#10a37f]/30'
              } backdrop-blur-sm hover:shadow-lg hover:shadow-[#10a37f]/10`}
            >
              {/* Education Background Effects */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#10a37f]/5 to-transparent rounded-full blur-xl"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-[#0d8f6f]/5 to-transparent rounded-full blur-lg"></div>
              </div>
              
              <div className="relative z-10 p-4 sm:p-6">
                {/* Edit/Delete buttons - Floating on mobile, inline on desktop */}
                {isEditMode && (onEditEducation || onDeleteEducation) && (
                  <div className="absolute top-2 right-2 sm:relative sm:top-0 sm:right-0 flex items-center gap-1 sm:gap-2 flex-shrink-0 mb-2 sm:mb-0">
                    {onEditEducation && (
                      <button
                        onClick={() => onEditEducation(index)}
                        className={`group/btn p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all duration-300 ${
                          isDark 
                            ? 'bg-[#1a1a1a]/80 hover:bg-[#10a37f]/20 border border-[#10a37f]/20 hover:border-[#10a37f]/40' 
                            : 'bg-white/80 hover:bg-[#10a37f]/10 border border-[#10a37f]/15 hover:border-[#10a37f]/30'
                        } backdrop-blur-sm hover:scale-105 hover:shadow-lg`}
                        title="Edit education"
                      >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4 text-[#10a37f] group-hover/btn:animate-pulse" />
                      </button>
                    )}
                    {onDeleteEducation && (
                      <button
                        onClick={() => onDeleteEducation(index)}
                        className={`group/btn p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all duration-300 ${
                          isDark 
                            ? 'bg-[#1a1a1a]/80 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40' 
                            : 'bg-white/80 hover:bg-red-500/10 border border-red-300/20 hover:border-red-400/30'
                        } backdrop-blur-sm hover:scale-105 hover:shadow-lg`}
                        title="Delete education"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-red-400 group-hover/btn:animate-pulse" />
                      </button>
                    )}
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  {/* Header with Degree and Institution */}
                  <div className="mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#10a37f]/20 to-[#0d8f6f]/20 rounded-xl shadow-lg backdrop-blur-sm">
                        <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-[#10a37f]" />
                      </div>
                      <div>
                        <h3 className={`text-base sm:text-xl font-bold ${theme.text.primary} group-hover/education:text-[#10a37f] transition-colors mb-1`}>
                          {education.degree}
                        </h3>
                        {education.institution && (
                          <p className="text-[#10a37f] font-semibold text-sm sm:text-lg">
                            {education.institution}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Field of Study */}
                  {education.field_of_study && (
                    <div className="mb-3 sm:mb-4">
                      <h4 className={`font-semibold text-sm sm:text-base ${theme.text.primary} mb-2 flex items-center gap-2`}>
                        <div className="w-1 h-3 sm:h-4 bg-gradient-to-b from-[#10a37f] to-[#0d8f6f] rounded-full"></div>
                        Field of Study
                      </h4>
                      <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed text-sm sm:text-base`}>
                        {education.field_of_study}
                      </p>
                    </div>
                  )}
                  
                  {/* Education Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {/* Duration */}
                    {education.duration && (
                      <div className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl ${
                        isDark ? 'bg-[#1a1a1a]/60 border border-[#10a37f]/20' : 'bg-white/60 border border-[#10a37f]/20'
                      }`}>
                        <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-[#10a37f]/20 rounded-lg">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-[#10a37f]" />
                        </div>
                        <div>
                          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Duration</p>
                          <p className={`font-medium text-sm sm:text-base ${theme.text.primary}`}>{education.duration}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Location */}
                    {education.location && (
                      <div className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl ${
                        isDark ? 'bg-[#1a1a1a]/60 border border-[#10a37f]/20' : 'bg-white/60 border border-[#10a37f]/20'
                      }`}>
                        <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-[#10a37f]/20 rounded-lg">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-[#10a37f]" />
                        </div>
                        <div>
                          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Location</p>
                          <p className={`font-medium text-sm sm:text-base ${theme.text.primary}`}>{education.location}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Description */}
                  {education.description && (
                    <div className="mt-3 sm:mt-4">
                      <h4 className={`font-semibold text-sm sm:text-base ${theme.text.primary} mb-2 flex items-center gap-2`}>
                        <div className="w-1 h-3 sm:h-4 bg-gradient-to-b from-[#10a37f] to-[#0d8f6f] rounded-full"></div>
                        Description
                      </h4>
                      <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed text-sm sm:text-base`}>
                        {education.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={`text-center py-8 sm:py-12 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-[#10a37f]/20 to-[#0d8f6f]/20 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-[#10a37f]" />
              </div>
              <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 bg-[#10a37f]/30 rounded-full blur-sm"></div>
            </div>
            <h3 className={`text-base sm:text-lg font-semibold ${theme.text.primary} mb-2`}>
              No Education Added
            </h3>
            <p className="text-xs sm:text-sm mb-1">Add your educational background to showcase your academic achievements.</p>
            <p className="text-xs">Include degrees, institutions, and relevant academic details.</p>
          </div>
        )}
      </div>
    </BaseSection>
  )
}

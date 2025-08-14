"use client"

import { useState } from "react"
import { BookOpen, Edit, Trash2, Calendar, GraduationCap, Award, MapPin, Clock } from "lucide-react"
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
      title="Education & Academic Background"
      icon={<BookOpen className="w-5 h-5 text-[#10a37f]" />}
      isEditMode={isEditMode}
      onDelete={hasData ? onDelete : undefined}
      onAdd={isEditMode ? onAddEducation : undefined}
    >
      <div className="space-y-6">
        {hasData ? (
          user.education.map((edu, index) => (
            <div 
              key={index} 
              className={`relative overflow-hidden rounded-2xl border transition-all duration-500 ${
                isDark 
                  ? 'bg-gradient-to-br from-[#2a2a2a]/90 via-[#2a2a2a]/80 to-[#1a1a1a]/90 border-[#10a37f]/30 hover:border-[#10a37f]/50' 
                  : 'bg-gradient-to-br from-white/95 via-white/90 to-gray-50/95 border-[#10a37f]/20 hover:border-[#10a37f]/40'
              } shadow-xl hover:shadow-2xl backdrop-blur-sm`}
            >
              {/* Enhanced Background Effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#10a37f]/10 via-transparent to-[#0d8f6f]/5"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#10a37f]/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#0d8f6f]/5 rounded-full blur-xl"></div>
              
              {/* Content */}
              <div className="relative z-10 p-6">
                <div className="flex items-start justify-between gap-6">
                  {/* Left side - Education details */}
                  <div className="flex-1 min-w-0">
                    {/* Header with Degree and Institution */}
                    <div className="mb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#10a37f] to-[#0d8f6f] rounded-xl shadow-lg">
                          <GraduationCap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className={`text-xl font-bold ${theme.text.primary} mb-1`}>
                            {edu.degree}
                          </h3>
                          <p className="text-[#10a37f] font-semibold text-lg">
                            {edu.institution}
                          </p>
                        </div>
                      </div>
                      
                      {edu.field_of_study && (
                        <div className="flex items-center gap-2 mb-4">
                          <Award className="w-4 h-4 text-[#10a37f]" />
                          <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            {edu.field_of_study}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Timeline and Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {edu.start_date && edu.end_date && (
                        <div className={`flex items-center gap-3 p-3 rounded-xl ${
                          isDark ? 'bg-[#1a1a1a]/60 border border-[#10a37f]/20' : 'bg-white/60 border border-[#10a37f]/20'
                        }`}>
                          <div className="flex items-center justify-center w-8 h-8 bg-[#10a37f]/20 rounded-lg">
                            <Calendar className="w-4 h-4 text-[#10a37f]" />
                          </div>
                          <div>
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Duration</p>
                            <p className={`font-medium ${theme.text.primary}`}>
                              {edu.start_date} - {edu.end_date}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {edu.grade && (
                        <div className={`flex items-center gap-3 p-3 rounded-xl ${
                          isDark ? 'bg-[#1a1a1a]/60 border border-[#10a37f]/20' : 'bg-white/60 border border-[#10a37f]/20'
                        }`}>
                          <div className="flex items-center justify-center w-8 h-8 bg-[#10a37f]/20 rounded-lg">
                            <Award className="w-4 h-4 text-[#10a37f]" />
                          </div>
                          <div>
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Grade</p>
                            <p className={`font-medium ${theme.text.primary}`}>{edu.grade}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Description */}
                    {edu.description && (
                      <div className="mb-4">
                        <h4 className={`font-semibold ${theme.text.primary} mb-2 flex items-center gap-2`}>
                          <div className="w-1 h-4 bg-gradient-to-b from-[#10a37f] to-[#0d8f6f] rounded-full"></div>
                          Description
                        </h4>
                        <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                          {edu.description}
                        </p>
                      </div>
                    )}
                    
                    {/* Activities */}
                    {edu.activities && (
                      <div>
                        <h4 className={`font-semibold ${theme.text.primary} mb-2 flex items-center gap-2`}>
                          <div className="w-1 h-4 bg-gradient-to-b from-[#10a37f] to-[#0d8f6f] rounded-full"></div>
                          Activities & Achievements
                        </h4>
                        <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                          {edu.activities}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Right side - Edit/Delete buttons */}
                  {isEditMode && (onEditEducation || onDeleteEducation) && (
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      {onDeleteEducation && (
                        <Button
                          onClick={() => onDeleteEducation(index)}
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:text-red-600 hover:bg-red-500/10 p-2 h-10 w-10"
                          title="Delete education"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                      {onEditEducation && (
                        <Button
                          onClick={() => onEditEducation(index)}
                          size="sm"
                          variant="ghost"
                          className="text-[#10a37f] hover:text-[#0d8f6f] hover:bg-[#10a37f]/10 p-2 h-10 w-10"
                          title="Edit education"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <div className="relative">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#10a37f]/20 to-[#0d8f6f]/20 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-[#10a37f]" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#10a37f]/30 rounded-full blur-sm"></div>
            </div>
            <h3 className={`text-lg font-semibold ${theme.text.primary} mb-2`}>
              No Education Details Available
            </h3>
            <p className="text-sm mb-1">Add your educational background to showcase your academic achievements.</p>
            <p className="text-xs">Include degrees, institutions, grades, and academic activities.</p>
          </div>
        )}
      </div>
    </BaseSection>
  )
}

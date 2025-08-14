"use client"

import { useState } from "react"
import { BookOpen, Edit, Trash2, Calendar, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { User as UserType } from "@/types"
import { useTheme } from "@/context/ThemeContext"
import { getThemeClasses } from "@/utils/theme"
import BaseSection from "../BaseSection"

interface CompactEducationSectionProps {
  user: UserType
  isEditMode?: boolean
  onEdit?: () => void
  onDelete?: () => void
  onEditEducation?: (index: number) => void
  onDeleteEducation?: (index: number) => void
  onAddEducation?: () => void
}

export default function CompactEducationSection({
  user,
  isEditMode = false,
  onEdit,
  onDelete,
  onEditEducation,
  onDeleteEducation,
  onAddEducation
}: CompactEducationSectionProps) {
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
      <div className="space-y-3">
        {hasData ? (
          user.education.map((edu, index) => (
            <div 
              key={index} 
              className={`relative overflow-hidden rounded-xl border transition-all duration-300 ${
                isDark 
                  ? 'bg-[#2a2a2a]/60 border-[#10a37f]/20 hover:border-[#10a37f]/40' 
                  : 'bg-white/80 border-gray-200 hover:border-[#10a37f]/40'
              } shadow-sm hover:shadow-md`}
            >
              {/* Background Effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#10a37f]/5 via-transparent to-[#10a37f]/10"></div>
              
              {/* Content */}
              <div className="relative z-10 p-4">
                <div className="flex items-start justify-between gap-3">
                  {/* Left side - Education details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <GraduationCap className="w-4 h-4 text-[#10a37f] flex-shrink-0" />
                      <h3 className={`font-semibold ${theme.text.primary} truncate`}>
                        {edu.degree}
                      </h3>
                    </div>
                    
                    <p className="text-[#10a37f] font-medium text-sm mb-1 truncate">
                      {edu.institution}
                    </p>
                    
                    {edu.field_of_study && (
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2 truncate`}>
                        {edu.field_of_study}
                      </p>
                    )}
                    
                    {/* Date and Grade */}
                    <div className="flex items-center gap-4 text-xs">
                      {edu.start_date && edu.end_date && (
                        <div className={`flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          <Calendar className="w-3 h-3" />
                          <span>{edu.start_date} - {edu.end_date}</span>
                        </div>
                      )}
                      {edu.grade && (
                        <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Grade: {edu.grade}
                        </div>
                      )}
                    </div>
                    
                    {/* Description and Activities */}
                    {edu.description && (
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-2 line-clamp-2`}>
                        {edu.description}
                      </p>
                    )}
                    
                    {edu.activities && (
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1 line-clamp-1`}>
                        <span className="font-medium">Activities:</span> {edu.activities}
                      </p>
                    )}
                  </div>
                  
                  {/* Right side - Edit/Delete buttons */}
                  {isEditMode && (onEditEducation || onDeleteEducation) && (
                    <div className="flex flex-col gap-1 flex-shrink-0">
                      {onDeleteEducation && (
                        <Button
                          onClick={() => onDeleteEducation(index)}
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:text-red-600 hover:bg-red-500/10 p-1.5 h-8 w-8"
                          title="Delete education"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                      {onEditEducation && (
                        <Button
                          onClick={() => onEditEducation(index)}
                          size="sm"
                          variant="ghost"
                          className="text-[#10a37f] hover:text-[#0d8f6f] hover:bg-[#10a37f]/10 p-1.5 h-8 w-8"
                          title="Edit education"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-sm">No education details available.</p>
            <p className="text-xs mt-1">Add your educational background to showcase your academic achievements.</p>
          </div>
        )}
      </div>
    </BaseSection>
  )
}

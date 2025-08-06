"use client"

import { memo } from "react"
import { BookOpen, Edit, Trash2 } from "lucide-react"
import { User as UserType } from "@/types"
import { useTheme } from "@/context/ThemeContext"
import { getThemeClasses } from "@/utils/theme"
import BaseSection from "./BaseSection"
import { Button } from "@/components/ui/button"

interface EducationSectionProps {
  user: UserType
  isEditMode?: boolean
  isCollapsible?: boolean
  isExpanded?: boolean
  onEdit?: () => void
  onDelete?: () => void
  onToggleExpand?: () => void
  showDragHandle?: boolean
  dragHandleProps?: any
  onEditEducation?: (index: number) => void
  onDeleteEducation?: (index: number) => void
  onAddEducation?: () => void
}

const EducationSection = memo(function EducationSection({
  user,
  isEditMode = false,
  isCollapsible = false,
  isExpanded = true,
  onEdit,
  onDelete,
  onToggleExpand,
  showDragHandle = false,
  dragHandleProps = {},
  onEditEducation,
  onDeleteEducation,
  onAddEducation
}: EducationSectionProps) {
  const { isDark } = useTheme()

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
      icon={
        <svg className="w-5 h-5 text-[#10a37f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
      }
      isEditMode={isEditMode}
      isCollapsible={isCollapsible}
      isExpanded={isExpanded}
      onDelete={hasData ? onDelete : undefined}
      onAdd={isEditMode ? onAddEducation : undefined}
      onToggleExpand={onToggleExpand}
      showDragHandle={showDragHandle}
      dragHandleProps={dragHandleProps}
    >
      <div className="space-y-4">
        {hasData ? (
          user.education.map((edu, index) => (
            <div key={index} className={`${isDark ? 'bg-[#2a2a2a]/50' : 'bg-gray-50/80'} rounded-xl p-5 border ${isDark ? 'border-[#10a37f]/10 hover:border-[#10a37f]/30' : 'border-gray-200 hover:border-[#10a37f]/50'} transition-all duration-300`}>
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold ${getThemeClasses(isDark).text.primary}`}>
                      {edu.degree}
                    </h3>
                    <p className="text-[#10a37f] font-medium">{edu.institution}</p>
                    {edu.field_of_study && (
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {edu.field_of_study}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex gap-2">
                      {isEditMode && (onEditEducation || onDeleteEducation) && (
                        <>
                          {onDeleteEducation && (
                            <Button
                              onClick={() => onDeleteEducation(index)}
                              size="sm"
                              variant="ghost"
                              className="text-red-500 hover:text-red-600 hover:bg-red-500/10 p-2"
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
                              className="text-[#10a37f] hover:text-[#0d8f6f] hover:bg-[#10a37f]/10 p-2"
                              title="Edit education"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                    <div className="text-right">
                      {edu.start_date && edu.end_date && (
                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {edu.start_date} - {edu.end_date}
                        </span>
                      )}
                      {edu.grade && (
                        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                          Grade: {edu.grade}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {edu.description && (
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed break-all overflow-hidden`}>
                    {edu.description}
                  </p>
                )}
                {edu.activities && (
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} break-all overflow-hidden`}>
                    <span className="font-medium">Activities:</span> {edu.activities}
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} italic text-center py-4`}>
            No education details available. Add your educational background.
          </p>
        )}
      </div>
    </BaseSection>
  )
})

export default EducationSection
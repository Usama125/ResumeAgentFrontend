"use client"

import { Briefcase, Edit, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { User as UserType } from "@/types"
import { useTheme } from "@/context/ThemeContext"
import { getThemeClasses } from "@/utils/theme"
import BaseSection from "./BaseSection"

interface ExperienceSectionProps {
  user: UserType
  isEditMode?: boolean
  isCollapsible?: boolean
  isExpanded?: boolean
  onEdit?: () => void
  onDelete?: () => void
  onToggleExpand?: () => void
  showDragHandle?: boolean
  dragHandleProps?: any
  onEditExperience?: (index: number) => void
  onDeleteExperience?: (index: number) => void
  onAddExperience?: () => void
}

export default function ExperienceSection({
  user,
  isEditMode = false,
  isCollapsible = false,
  isExpanded = true,
  onEdit,
  onDelete,
  onToggleExpand,
  showDragHandle = false,
  dragHandleProps = {},
  onEditExperience,
  onDeleteExperience,
  onAddExperience
}: ExperienceSectionProps) {
  const { isDark } = useTheme()

  // Check if section has data
  const hasData = !!(user.experience_details && user.experience_details.length > 0)

  // Don't render if no data and not in edit mode
  if (!hasData && !isEditMode) {
    return null
  }

  return (
    <BaseSection
      id="experience"
      title="Professional Experience"
      icon={<Briefcase className="w-5 h-5 text-[#10a37f]" />}
      isEditMode={isEditMode}
      isCollapsible={isCollapsible}
      isExpanded={isExpanded}
      onDelete={hasData ? onDelete : undefined}
      onAdd={isEditMode ? onAddExperience : undefined}
      onToggleExpand={onToggleExpand}
      showDragHandle={showDragHandle}
      dragHandleProps={dragHandleProps}
    >
      <div className="space-y-6">
        {hasData ? (
          user.experience_details.map((exp, index) => (
            <div key={index} className="relative pl-8 border-l-2 border-[#10a37f]/30">
              <div className={`absolute -left-2 top-0 w-4 h-4 bg-[#10a37f] rounded-full border-2 ${isDark ? 'border-[#0a0a0a]' : 'border-white'}`}></div>
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold ${getThemeClasses(isDark).text.primary}`}>{exp.position}</h3>
                    <p className="text-[#10a37f] font-medium">{exp.company}</p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{exp.duration}</p>
                    <div className="relative">
                      <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed ${exp.description && exp.description.length > 100 ? 'line-clamp-2' : ''}`}>
                        {exp.description}
                      </p>
                      {exp.description && exp.description.length > 100 && (
                        <div className="relative inline-block mt-2">
                          <span className="text-[#10a37f] hover:text-[#0d8f6f] text-sm font-medium transition-colors cursor-pointer group">
                            See More
                            <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-[99999] transform-gpu top-full left-0 mt-2">
                              <div className={`${isDark ? 'bg-[#2a2a2a] border-[#10a37f]/30' : 'bg-white border-gray-200'} border rounded-lg p-4 shadow-2xl max-w-md w-96`}>
                                <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed text-sm`}>
                                  {exp.description}
                                </p>
                              </div>
                            </div>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {isEditMode && (onEditExperience || onDeleteExperience) && (
                    <div className="flex gap-2 ml-4">
                      {onDeleteExperience && (
                        <Button
                          onClick={() => onDeleteExperience(index)}
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:text-red-600 hover:bg-red-500/10 p-2"
                          title="Delete experience"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                      {onEditExperience && (
                        <Button
                          onClick={() => onEditExperience(index)}
                          size="sm"
                          variant="ghost"
                          className="text-[#10a37f] hover:text-[#0d8f6f] hover:bg-[#10a37f]/10 p-2"
                          title="Edit experience"
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
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} italic text-center py-4`}>
            No experience details available. Add your work experience to showcase your professional journey.
          </p>
        )}
      </div>
    </BaseSection>
  )
}
"use client"

import { Heart, Edit, Trash2 } from "lucide-react"
import { User as UserType } from "@/types"
import { useTheme } from "@/context/ThemeContext"
import { getThemeClasses } from "@/utils/theme"
import { Button } from "@/components/ui/button"
import BaseSection from "./BaseSection"

interface VolunteerSectionProps {
  user: UserType
  isEditMode?: boolean
  isCollapsible?: boolean
  isExpanded?: boolean
  onEdit?: () => void
  onDelete?: () => void
  onToggleExpand?: () => void
  showDragHandle?: boolean
  dragHandleProps?: any
  onEditVolunteerExperience?: (index: number) => void
  onDeleteVolunteerExperience?: (index: number) => void
  onAddVolunteerExperience?: () => void
}

export default function VolunteerSection({
  user,
  isEditMode = false,
  isCollapsible = false,
  isExpanded = true,
  onEdit,
  onDelete,
  onToggleExpand,
  showDragHandle = false,
  dragHandleProps = {},
  onEditVolunteerExperience,
  onDeleteVolunteerExperience,
  onAddVolunteerExperience
}: VolunteerSectionProps) {
  const { isDark } = useTheme()

  // Check if section has data
  const hasData = !!(user.volunteer_experience && user.volunteer_experience.length > 0)

  // Don't render if no data and not in edit mode
  if (!hasData && !isEditMode) {
    return null
  }

  return (
    <BaseSection
      id="volunteer"
      title="Volunteer Experience"
      icon={
        <svg className="w-5 h-5 text-[#10a37f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      }
      isEditMode={isEditMode}
      isCollapsible={isCollapsible}
      isExpanded={isExpanded}
      onEdit={undefined}
      onDelete={hasData ? onDelete : undefined}
      onAdd={isEditMode ? onAddVolunteerExperience : undefined}
      onToggleExpand={onToggleExpand}
      showDragHandle={showDragHandle}
      dragHandleProps={dragHandleProps}
      hideEditIconsOnMobile={true}
    >
      <div className="space-y-4">
        {hasData ? (
          user.volunteer_experience.map((vol, index) => (
            <div key={index} className={`${isDark ? 'bg-[#2a2a2a]/50' : 'bg-gray-50/80'} rounded-xl p-5 border ${isDark ? 'border-[#10a37f]/10 hover:border-[#10a37f]/30' : 'border-gray-200 hover:border-[#10a37f]/50'} transition-all duration-300 relative`}>
              <div className="space-y-3">
                <div>
                  <h3 className={`text-base sm:text-lg font-semibold ${getThemeClasses(isDark).text.primary}`}>
                    {vol.role}
                  </h3>
                  <p className="text-[#10a37f] font-medium text-sm sm:text-base">{vol.organization}</p>
                </div>
                {vol.description && (
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed break-all overflow-hidden`}>
                    {vol.description}
                  </p>
                )}
                {/* Bottom row with date and edit/delete buttons */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex-1"></div>
                  <div className="flex items-center gap-3">
                    {(vol.start_date || vol.end_date) && (
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {vol.start_date} {vol.end_date && `- ${vol.end_date}`}
                      </span>
                    )}
                    {/* Edit/Delete buttons - only show in edit mode */}
                    {isEditMode && (onEditVolunteerExperience || onDeleteVolunteerExperience) && (
                      <div className="flex gap-1">
                        {onEditVolunteerExperience && (
                          <Button
                            onClick={() => onEditVolunteerExperience(index)}
                            size="sm"
                            variant="ghost"
                            className="text-[#10a37f] hover:text-[#0d8f6f] hover:bg-[#10a37f]/10 p-1 h-6 w-6"
                            title="Edit volunteer experience"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                        )}
                        {onDeleteVolunteerExperience && (
                          <Button
                            onClick={() => onDeleteVolunteerExperience(index)}
                            size="sm"
                            variant="ghost"
                            className="text-red-500 hover:text-red-600 hover:bg-red-500/10 p-1 h-6 w-6"
                            title="Delete volunteer experience"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} italic text-center py-4`}>
            No volunteer experience added. Add your community service and volunteer work.
          </p>
        )}
      </div>
    </BaseSection>
  )
}
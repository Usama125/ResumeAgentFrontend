"use client"

import { Award, Edit, Trash2 } from "lucide-react"
import { User as UserType } from "@/types"
import { useTheme } from "@/context/ThemeContext"
import { getThemeClasses } from "@/utils/theme"
import BaseSection from "./BaseSection"
import { Button } from "@/components/ui/button"

interface AwardsSectionProps {
  user: UserType
  isEditMode?: boolean
  isCollapsible?: boolean
  isExpanded?: boolean
  onEdit?: () => void
  onDelete?: () => void
  onToggleExpand?: () => void
  showDragHandle?: boolean
  dragHandleProps?: any
  onEditAward?: (index: number) => void
  onDeleteAward?: (index: number) => void
  onAddAward?: () => void
}

export default function AwardsSection({
  user,
  isEditMode = false,
  isCollapsible = false,
  isExpanded = true,
  onEdit,
  onDelete,
  onToggleExpand,
  showDragHandle = false,
  dragHandleProps = {},
  onEditAward,
  onDeleteAward,
  onAddAward
}: AwardsSectionProps) {
  console.log('AwardsSection: Received handlers:', {
    isEditMode,
    onDelete: !!onDelete,
    onAddAward: !!onAddAward,
    onEditAward: !!onEditAward,
    onDeleteAward: !!onDeleteAward,
    hasData: !!(user.awards && user.awards.length > 0)
  })
  const { isDark } = useTheme()

  // Check if section has data
  const hasData = !!(user.awards && user.awards.length > 0)

  // Don't render if no data and not in edit mode
  if (!hasData && !isEditMode) {
    return null
  }

  console.log('AwardsSection: BaseSection props:', {
    isEditMode,
    hasData,
    onDelete: !!onDelete,
    onAddAward: !!onAddAward,
    onAdd: !!(isEditMode ? onAddAward : undefined)
  })
  
  return (
    <BaseSection
      id="awards"
      title="Awards & Recognition"
      icon={<Award className="w-5 h-5 text-[#10a37f]" />}
      isEditMode={isEditMode}
      isCollapsible={isCollapsible}
      isExpanded={isExpanded}
      onDelete={hasData ? onDelete : undefined}
      onAdd={isEditMode ? onAddAward : undefined}
      onToggleExpand={onToggleExpand}
      showDragHandle={showDragHandle}
      dragHandleProps={dragHandleProps}
    >
      <div className="space-y-4">
        {hasData ? (
          user.awards.map((award, index) => (
            <div key={index} className={`${isDark ? 'bg-[#2a2a2a]/50' : 'bg-gray-50/80'} rounded-xl p-5 border ${isDark ? 'border-[#10a37f]/10 hover:border-[#10a37f]/30' : 'border-gray-200 hover:border-[#10a37f]/50'} transition-all duration-300 relative`}>
              <div className="space-y-3">
                <div>
                  <h3 className={`text-lg font-semibold ${getThemeClasses(isDark).text.primary}`}>
                    {award.title}
                  </h3>
                  {award.issuer && (
                    <p className="text-[#10a37f] font-medium">{award.issuer}</p>
                  )}
                </div>
                {award.description && (
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed break-all overflow-hidden`}>
                    {award.description}
                  </p>
                )}
                {/* Bottom row with date and edit/delete buttons */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex-1"></div>
                  <div className="flex items-center gap-3">
                    {award.date && (
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {award.date}
                      </span>
                    )}
                    {/* Edit/Delete buttons - only show in edit mode */}
                    {isEditMode && (onEditAward || onDeleteAward) && (
                      <div className="flex gap-1">
                        {onEditAward && (
                          <Button
                            onClick={() => onEditAward(index)}
                            size="sm"
                            variant="ghost"
                            className="text-[#10a37f] hover:text-[#0d8f6f] hover:bg-[#10a37f]/10 p-1 h-6 w-6"
                            title="Edit award"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                        )}
                        {onDeleteAward && (
                          <Button
                            onClick={() => onDeleteAward(index)}
                            size="sm"
                            variant="ghost"
                            className="text-red-500 hover:text-red-600 hover:bg-red-500/10 p-1 h-6 w-6"
                            title="Delete award"
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
            No awards or recognition added. Add your achievements and recognitions.
          </p>
        )}
      </div>
    </BaseSection>
  )
}
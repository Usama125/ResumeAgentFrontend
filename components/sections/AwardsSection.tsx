"use client"

import { Award } from "lucide-react"
import { User as UserType } from "@/types"
import { useTheme } from "@/context/ThemeContext"
import { getThemeClasses } from "@/utils/theme"
import BaseSection from "./BaseSection"

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
  dragHandleProps = {}
}: AwardsSectionProps) {
  const { isDark } = useTheme()

  // Check if section has data
  const hasData = !!(user.awards && user.awards.length > 0)

  // Don't render if no data and not in edit mode
  if (!hasData && !isEditMode) {
    return null
  }

  return (
    <BaseSection
      id="awards"
      title="Awards & Recognition"
      icon={<Award className="w-5 h-5 text-[#10a37f]" />}
      isEditMode={isEditMode}
      isCollapsible={isCollapsible}
      isExpanded={isExpanded}
      onEdit={onEdit}
      onDelete={onDelete}
      onToggleExpand={onToggleExpand}
      showDragHandle={showDragHandle}
      dragHandleProps={dragHandleProps}
    >
      <div className="space-y-4">
        {hasData ? (
          user.awards.map((award, index) => (
            <div key={index} className={`${isDark ? 'bg-[#2a2a2a]/50' : 'bg-gray-50/80'} rounded-xl p-5 border ${isDark ? 'border-[#10a37f]/10 hover:border-[#10a37f]/30' : 'border-gray-200 hover:border-[#10a37f]/50'} transition-all duration-300`}>
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold ${getThemeClasses(isDark).text.primary}`}>
                      {award.title}
                    </h3>
                    {award.issuer && (
                      <p className="text-[#10a37f] font-medium">{award.issuer}</p>
                    )}
                  </div>
                  {award.date && (
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {award.date}
                    </span>
                  )}
                </div>
                {award.description && (
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                    {award.description}
                  </p>
                )}
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
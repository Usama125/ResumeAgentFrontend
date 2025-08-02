"use client"

import { Heart, Edit, Trash2 } from "lucide-react"
import { User as UserType } from "@/types"
import { useTheme } from "@/context/ThemeContext"
import { getThemeClasses } from "@/utils/theme"
import { Button } from "@/components/ui/button"
import BaseSection from "./BaseSection"

interface InterestsSectionProps {
  user: UserType
  isEditMode?: boolean
  isCollapsible?: boolean
  isExpanded?: boolean
  onEdit?: () => void
  onDelete?: () => void
  onToggleExpand?: () => void
  showDragHandle?: boolean
  dragHandleProps?: any
  onEditInterests?: () => void
  onDeleteInterests?: () => void
  onAddInterests?: () => void
}

export default function InterestsSection({
  user,
  isEditMode = false,
  isCollapsible = false,
  isExpanded = true,
  onEdit,
  onDelete,
  onToggleExpand,
  showDragHandle = false,
  dragHandleProps = {},
  onEditInterests,
  onDeleteInterests,
  onAddInterests
}: InterestsSectionProps) {
  const { isDark } = useTheme()

  // Check if section has data
  const hasData = !!(user.interests && user.interests.length > 0)

  // Don't render if no data and not in edit mode
  if (!hasData && !isEditMode) {
    return null
  }

  return (
    <BaseSection
      id="interests"
      title="Interests & Hobbies"
      icon={
        <svg className="w-5 h-5 text-[#10a37f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      }
      isEditMode={isEditMode}
      isCollapsible={isCollapsible}
      isExpanded={isExpanded}
      onEdit={onEdit}
      onDelete={hasData ? onDelete : undefined}
      onAdd={isEditMode ? onAddInterests : undefined}
      onToggleExpand={onToggleExpand}
      showDragHandle={showDragHandle}
      dragHandleProps={dragHandleProps}
    >
      <div className="flex flex-wrap gap-3">
        {hasData ? (
          user.interests.map((interest, index) => (
            <span 
              key={index} 
              className="px-4 py-2 bg-[#10a37f]/20 text-[#10a37f] text-sm rounded-full border border-[#10a37f]/30 hover:bg-[#10a37f]/30 transition-all duration-300"
            >
              {interest}
            </span>
          ))
        ) : (
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} italic text-center py-4 w-full`}>
            No interests added. Add your hobbies and interests.
          </p>
        )}
      </div>
    </BaseSection>
  )
}
"use client"

import React, { useState } from "react"
import { User } from "lucide-react"
import { User as UserType } from "@/types"
import { useTheme } from "@/context/ThemeContext"
import BaseSection from "./BaseSection"

interface AboutSectionProps {
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

export default function AboutSection({
  user,
  isEditMode = false,
  isCollapsible = false,
  isExpanded = true,
  onEdit,
  onDelete,
  onToggleExpand,
  showDragHandle = false,
  dragHandleProps = {}
}: AboutSectionProps) {
  const { isDark } = useTheme()
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)

  // Check if section has data
  const hasData = !!(user.summary && user.summary.trim())

  // Don't render if no data and not in edit mode
  if (!hasData && !isEditMode) {
    return null
  }

  return (
    <BaseSection
      id="about"
      title="About Me"
      icon={<User className="w-5 h-5 text-[#10a37f]" />}
      isEditMode={isEditMode}
      isCollapsible={isCollapsible}
      isExpanded={isExpanded}
      onEdit={onEdit}
      onDelete={hasData ? onDelete : undefined}
      onToggleExpand={onToggleExpand}
      showDragHandle={showDragHandle}
      dragHandleProps={dragHandleProps}
    >
      <div className="relative">
        {hasData ? (
          <>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed break-all overflow-hidden ${user.summary && user.summary.length > 200 && !isDescriptionExpanded ? 'line-clamp-3' : ''}`}>
              {user.summary}
            </p>
            {user.summary && user.summary.length > 200 && (
              <button
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="text-[#10a37f] hover:text-[#0d8f6f] text-sm font-medium transition-colors mt-2"
              >
                {isDescriptionExpanded ? 'See Less' : 'See More'}
              </button>
            )}
          </>
        ) : (
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} italic`}>
            You haven't added a summary yet. Consider adding one to tell others about your professional background and goals.
          </p>
        )}
      </div>
    </BaseSection>
  )
}
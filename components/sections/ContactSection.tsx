"use client"

import { User } from "lucide-react"
import { User as UserType } from "@/types"
import { useTheme } from "@/context/ThemeContext"
import BaseSection from "./BaseSection"

interface ContactSectionProps {
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

export default function ContactSection({
  user,
  isEditMode = false,
  isCollapsible = false,
  isExpanded = true,
  onEdit,
  onDelete,
  onToggleExpand,
  showDragHandle = false,
  dragHandleProps = {}
}: ContactSectionProps) {
  const { isDark } = useTheme()

  // Check if section has data
  const hasData = !!(user.contact_info && Object.values(user.contact_info).some(value => value))

  // Don't render if no data and not in edit mode
  if (!hasData && !isEditMode) {
    return null
  }

  return (
    <BaseSection
      id="contact"
      title="Contact Information"
      icon={<User className="w-5 h-5 text-[#10a37f]" />}
      isEditMode={isEditMode}
      isCollapsible={isCollapsible}
      isExpanded={isExpanded}
      onEdit={onEdit}
      onDelete={onDelete}
      onToggleExpand={onToggleExpand}
      showDragHandle={showDragHandle}
      dragHandleProps={dragHandleProps}
    >
      <div className="relative">
        {hasData ? (
          <div className="space-y-2">
            {user.contact_info?.email && (
              <div className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <span className="font-medium">Email:</span> {user.contact_info.email}
              </div>
            )}
            {user.contact_info?.phone && (
              <div className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <span className="font-medium">Phone:</span> {user.contact_info.phone}
              </div>
            )}
            {user.contact_info?.linkedin && (
              <div className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <span className="font-medium">LinkedIn:</span> {user.contact_info.linkedin}
              </div>
            )}
            {user.contact_info?.website && (
              <div className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <span className="font-medium">Website:</span> {user.contact_info.website}
              </div>
            )}
          </div>
        ) : (
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} italic`}>
            You haven't added contact information yet.
          </p>
        )}
      </div>
    </BaseSection>
  )
}
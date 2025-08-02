"use client"

import { FileText } from "lucide-react"
import { User as UserType } from "@/types"
import { useTheme } from "@/context/ThemeContext"
import { getThemeClasses } from "@/utils/theme"
import BaseSection from "./BaseSection"

interface PublicationsSectionProps {
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

export default function PublicationsSection({
  user,
  isEditMode = false,
  isCollapsible = false,
  isExpanded = true,
  onEdit,
  onDelete,
  onToggleExpand,
  showDragHandle = false,
  dragHandleProps = {}
}: PublicationsSectionProps) {
  const { isDark } = useTheme()

  // Check if section has data
  const hasData = !!(user.publications && user.publications.length > 0)

  // Don't render if no data and not in edit mode
  if (!hasData && !isEditMode) {
    return null
  }

  return (
    <BaseSection
      id="publications"
      title="Publications"
      icon={
        <svg className="w-5 h-5 text-[#10a37f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 5.477 5.754 5 7.5 5s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 5.477 18.246 5 16.5 5c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      }
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
          user.publications.map((pub, index) => (
            <div key={index} className={`${isDark ? 'bg-[#2a2a2a]/50' : 'bg-gray-50/80'} rounded-xl p-5 border ${isDark ? 'border-[#10a37f]/10 hover:border-[#10a37f]/30' : 'border-gray-200 hover:border-[#10a37f]/50'} transition-all duration-300`}>
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold ${getThemeClasses(isDark).text.primary}`}>
                      {pub.title}
                    </h3>
                    {pub.publisher && (
                      <p className="text-[#10a37f] font-medium">{pub.publisher}</p>
                    )}
                  </div>
                  {pub.date && (
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {pub.date}
                    </span>
                  )}
                </div>
                {pub.description && (
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                    {pub.description}
                  </p>
                )}
                {pub.url && (
                  <a 
                    href={pub.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#10a37f] hover:text-[#0d8f6f] transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Read Publication
                  </a>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} italic text-center py-4`}>
            No publications added. Add your research papers and articles.
          </p>
        )}
      </div>
    </BaseSection>
  )
}
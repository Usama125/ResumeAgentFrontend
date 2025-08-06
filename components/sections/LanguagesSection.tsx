"use client"

import { Globe, Edit, Trash2 } from "lucide-react"
import { User as UserType } from "@/types"
import { useTheme } from "@/context/ThemeContext"
import { getThemeClasses } from "@/utils/theme"
import BaseSection from "./BaseSection"
import { Button } from "@/components/ui/button"

interface LanguagesSectionProps {
  user: UserType
  isEditMode?: boolean
  isCollapsible?: boolean
  isExpanded?: boolean
  onEdit?: () => void
  onDelete?: () => void
  onToggleExpand?: () => void
  showDragHandle?: boolean
  dragHandleProps?: any
  onEditLanguage?: (index: number) => void
  onDeleteLanguage?: (index: number) => void
  onAddLanguage?: () => void
}

export default function LanguagesSection({
  user,
  isEditMode = false,
  isCollapsible = false,
  isExpanded = true,
  onEdit,
  onDelete,
  onToggleExpand,
  showDragHandle = false,
  dragHandleProps = {},
  onEditLanguage,
  onDeleteLanguage,
  onAddLanguage
}: LanguagesSectionProps) {
  const { isDark } = useTheme()

  // Check if section has data
  const hasData = !!(user.languages && user.languages.length > 0)

  // Don't render if no data and not in edit mode
  if (!hasData && !isEditMode) {
    return null
  }

  return (
    <BaseSection
      id="languages"
      title="Languages"
      icon={
        <svg className="w-5 h-5 text-[#10a37f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      }
      isEditMode={isEditMode}
      isCollapsible={isCollapsible}
      isExpanded={isExpanded}
      onDelete={hasData ? onDelete : undefined}
      onAdd={isEditMode ? onAddLanguage : undefined}
      onToggleExpand={onToggleExpand}
      showDragHandle={showDragHandle}
      dragHandleProps={dragHandleProps}
    >
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {hasData ? (
          user.languages.map((lang, index) => (
            <div key={index} className={`${isDark ? 'bg-[#2a2a2a]/50' : 'bg-gray-50/80'} rounded-lg p-4 border ${isDark ? 'border-[#10a37f]/10 hover:border-[#10a37f]/30' : 'border-gray-200 hover:border-[#10a37f]/50'} transition-all duration-300 text-center relative`}>
              {/* Edit/Delete buttons - only show in edit mode */}
              {isEditMode && (onEditLanguage || onDeleteLanguage) && (
                <div className="absolute top-2 right-2 flex gap-1">
                  {onEditLanguage && (
                    <Button
                      onClick={() => onEditLanguage(index)}
                      size="sm"
                      variant="ghost"
                      className="text-[#10a37f] hover:text-[#0d8f6f] hover:bg-[#10a37f]/10 p-1 h-6 w-6"
                      title="Edit language"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                  )}
                  {onDeleteLanguage && (
                    <Button
                      onClick={() => onDeleteLanguage(index)}
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-600 hover:bg-red-500/10 p-1 h-6 w-6"
                      title="Delete language"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              )}
              <div className="space-y-2">
                <h3 className={`font-semibold ${getThemeClasses(isDark).text.primary}`}>
                  {lang.name}
                </h3>
                {lang.proficiency && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    lang.proficiency === "Native" 
                      ? "bg-[#10a37f] text-white" 
                      : lang.proficiency === "Fluent"
                      ? "bg-blue-500 text-white"
                      : lang.proficiency === "Advanced"
                      ? "bg-purple-500 text-white"
                      : lang.proficiency === "Intermediate"
                      ? "bg-gray-500 text-white"
                      : "bg-gray-400 text-white"
                  }`}>
                    {lang.proficiency}
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full">
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} italic text-center py-4`}>
              No languages added. Add the languages you speak.
            </p>
          </div>
        )}
      </div>
    </BaseSection>
  )
}
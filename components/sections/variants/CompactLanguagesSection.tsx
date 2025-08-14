"use client"

import { useState } from "react"
import { Globe, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { User as UserType } from "@/types"
import { useTheme } from "@/context/ThemeContext"
import { getThemeClasses } from "@/utils/theme"
import BaseSection from "../BaseSection"

interface CompactLanguagesSectionProps {
  user: UserType
  isEditMode?: boolean
  onEdit?: () => void
  onDelete?: () => void
  onEditLanguage?: (index: number) => void
  onDeleteLanguage?: (index: number) => void
  onAddLanguage?: () => void
}

export default function CompactLanguagesSection({
  user,
  isEditMode = false,
  onEdit,
  onDelete,
  onEditLanguage,
  onDeleteLanguage,
  onAddLanguage
}: CompactLanguagesSectionProps) {
  const { isDark } = useTheme()
  const theme = getThemeClasses(isDark)

  // Check if section has data
  const hasData = !!(user.languages && user.languages.length > 0)

  // Don't render if no data and not in edit mode
  if (!hasData && !isEditMode) {
    return null
  }

  // Get proficiency badge styling
  const getProficiencyStyle = (proficiency: string) => {
    switch(proficiency) {
      case 'Native':
        return 'bg-[#10a37f] text-white'
      case 'Fluent':
        return 'bg-blue-500 text-white'
      case 'Advanced':
        return 'bg-purple-500 text-white'
      case 'Intermediate':
        return 'bg-gray-500 text-white'
      default:
        return 'bg-gray-400 text-white'
    }
  }

  return (
    <BaseSection
      id="languages"
      title="Languages"
      icon={<Globe className="w-5 h-5 text-[#10a37f]" />}
      isEditMode={isEditMode}
      onDelete={hasData ? onDelete : undefined}
      onAdd={isEditMode ? onAddLanguage : undefined}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {hasData ? (
          user.languages.map((lang, index) => (
            <div 
              key={index} 
              className={`group relative overflow-hidden rounded-xl border transition-all duration-300 ${
                isDark 
                  ? 'bg-[#2a2a2a]/60 border-[#10a37f]/20 hover:border-[#10a37f]/40 hover:bg-[#2a2a2a]/80' 
                  : 'bg-white/80 border-gray-200 hover:border-[#10a37f]/40 hover:bg-white/95'
              } shadow-sm hover:shadow-md`}
            >
              {/* Background Effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#10a37f]/5 via-transparent to-[#10a37f]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Content */}
              <div className="relative z-10 p-4">
                <div className="flex items-center justify-between gap-3">
                  {/* Left side - Language details */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${
                      isDark ? 'bg-[#10a37f]/20 group-hover:bg-[#10a37f]/30' : 'bg-[#10a37f]/10 group-hover:bg-[#10a37f]/20'
                    }`}>
                      <Globe className="w-5 h-5 text-[#10a37f]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-bold text-base ${theme.text.primary} group-hover:text-[#10a37f] transition-colors truncate`}>
                        {lang.name}
                      </h3>
                      {lang.proficiency && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getProficiencyStyle(lang.proficiency)}`}>
                            {lang.proficiency}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Right side - Edit/Delete buttons */}
                  {isEditMode && (onEditLanguage || onDeleteLanguage) && (
                    <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {onEditLanguage && (
                        <Button
                          onClick={() => onEditLanguage(index)}
                          size="sm"
                          variant="ghost"
                          className="text-[#10a37f] hover:text-[#0d8f6f] hover:bg-[#10a37f]/10 p-1.5 h-8 w-8"
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
                          className="text-red-500 hover:text-red-600 hover:bg-red-500/10 p-1.5 h-8 w-8"
                          title="Delete language"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={`col-span-full text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#10a37f]/10 to-[#0d8f6f]/10 rounded-2xl flex items-center justify-center">
              <Globe className="w-8 h-8 text-[#10a37f]" />
            </div>
            <p className="text-sm font-medium">No languages added</p>
            <p className="text-xs mt-1">Add the languages you speak to showcase your communication skills.</p>
          </div>
        )}
      </div>
    </BaseSection>
  )
}

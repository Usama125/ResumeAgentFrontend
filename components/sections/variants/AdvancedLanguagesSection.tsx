"use client"

import { useState } from "react"
import { Globe, Edit, Trash2, Award, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { User as UserType } from "@/types"
import { useTheme } from "@/context/ThemeContext"
import { getThemeClasses } from "@/utils/theme"
import BaseSection from "../BaseSection"

interface AdvancedLanguagesSectionProps {
  user: UserType
  isEditMode?: boolean
  onEdit?: () => void
  onDelete?: () => void
  onEditLanguage?: (index: number) => void
  onDeleteLanguage?: (index: number) => void
  onAddLanguage?: () => void
}

export default function AdvancedLanguagesSection({
  user,
  isEditMode = false,
  onEdit,
  onDelete,
  onEditLanguage,
  onDeleteLanguage,
  onAddLanguage
}: AdvancedLanguagesSectionProps) {
  const { isDark } = useTheme()
  const theme = getThemeClasses(isDark)

  // Check if section has data
  const hasData = !!(user.languages && user.languages.length > 0)

  // Don't render if no data and not in edit mode
  if (!hasData && !isEditMode) {
    return null
  }

  // Get proficiency badge styling and icon
  const getProficiencyStyle = (proficiency: string) => {
    switch(proficiency) {
      case 'Native':
        return {
          bg: 'bg-gradient-to-r from-[#10a37f] to-[#0d8f6f]',
          text: 'text-white',
          icon: <Star className="w-4 h-4" />
        }
      case 'Fluent':
        return {
          bg: 'bg-gradient-to-r from-blue-500 to-blue-600',
          text: 'text-white',
          icon: <Award className="w-4 h-4" />
        }
      case 'Advanced':
        return {
          bg: 'bg-gradient-to-r from-purple-500 to-purple-600',
          text: 'text-white',
          icon: <Award className="w-4 h-4" />
        }
      case 'Intermediate':
        return {
          bg: 'bg-gradient-to-r from-gray-500 to-gray-600',
          text: 'text-white',
          icon: <Globe className="w-4 h-4" />
        }
      default:
        return {
          bg: 'bg-gradient-to-r from-gray-400 to-gray-500',
          text: 'text-white',
          icon: <Globe className="w-4 h-4" />
        }
    }
  }

  return (
    <BaseSection
      id="languages"
      title="Languages & Communication Skills"
      icon={<Globe className="w-5 h-5 text-[#10a37f]" />}
      isEditMode={isEditMode}
      onDelete={hasData ? onDelete : undefined}
      onAdd={isEditMode ? onAddLanguage : undefined}
    >
      <div className="space-y-6">
        {hasData ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {user.languages.map((lang, index) => {
              const proficiencyStyle = getProficiencyStyle(lang.proficiency || '')
              
              return (
                <div 
                  key={index} 
                  className={`group/language relative overflow-hidden rounded-2xl border-2 transition-all duration-500 ${
                    isDark 
                      ? 'bg-gradient-to-br from-[#1a1a1a]/80 via-[#2a2a2a]/60 to-[#1a1a1a]/80 border-[#10a37f]/20 hover:border-[#10a37f]/40' 
                      : 'bg-gradient-to-br from-white/80 via-gray-50/60 to-white/80 border-[#10a37f]/15 hover:border-[#10a37f]/30'
                  } backdrop-blur-sm hover:shadow-lg hover:shadow-[#10a37f]/10`}
                >
                  {/* Language Background Effects */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#10a37f]/5 to-transparent rounded-full blur-xl"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-[#0d8f6f]/5 to-transparent rounded-full blur-lg"></div>
                  </div>
                  
                  <div className="relative z-10 p-6">
                    <div className="flex items-start justify-between gap-4">
                      {/* Left side - Language details */}
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#10a37f]/20 to-[#0d8f6f]/20 rounded-xl shadow-lg backdrop-blur-sm group-hover/language:scale-110 transition-transform duration-300">
                          <Globe className="w-7 h-7 text-[#10a37f]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-xl font-bold ${theme.text.primary} group-hover/language:text-[#10a37f] transition-colors mb-3`}>
                            {lang.name}
                          </h3>
                          {lang.proficiency && (
                            <div className="space-y-2">
                              <div className={`flex items-center gap-3 px-4 py-2 rounded-xl ${proficiencyStyle.bg} ${proficiencyStyle.text} shadow-md`}>
                                {proficiencyStyle.icon}
                                <span className="font-semibold text-sm">{lang.proficiency}</span>
                              </div>
                              <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Proficiency Level
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Right side - Edit/Delete buttons */}
                      {isEditMode && (onEditLanguage || onDeleteLanguage) && (
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {onEditLanguage && (
                            <button
                              onClick={() => onEditLanguage(index)}
                              className={`group/btn p-3 rounded-xl transition-all duration-300 ${
                                isDark 
                                  ? 'bg-[#1a1a1a]/60 hover:bg-[#10a37f]/20 border border-[#10a37f]/20 hover:border-[#10a37f]/40' 
                                  : 'bg-white/60 hover:bg-[#10a37f]/10 border border-[#10a37f]/15 hover:border-[#10a37f]/30'
                              } backdrop-blur-sm hover:scale-105 hover:shadow-lg`}
                              title="Edit language"
                            >
                              <Edit className="w-4 h-4 text-[#10a37f] group-hover/btn:animate-pulse" />
                            </button>
                          )}
                          {onDeleteLanguage && (
                            <button
                              onClick={() => onDeleteLanguage(index)}
                              className={`group/btn p-3 rounded-xl transition-all duration-300 ${
                                isDark 
                                  ? 'bg-[#1a1a1a]/60 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40' 
                                  : 'bg-white/60 hover:bg-red-500/10 border border-red-300/20 hover:border-red-400/30'
                              } backdrop-blur-sm hover:scale-105 hover:shadow-lg`}
                              title="Delete language"
                            >
                              <Trash2 className="w-4 h-4 text-red-400 group-hover/btn:animate-pulse" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <div className="relative">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#10a37f]/20 to-[#0d8f6f]/20 rounded-2xl flex items-center justify-center">
                <Globe className="w-10 h-10 text-[#10a37f]" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#10a37f]/30 rounded-full blur-sm"></div>
            </div>
            <h3 className={`text-lg font-semibold ${theme.text.primary} mb-2`}>
              No Languages Added
            </h3>
            <p className="text-sm mb-1">Add the languages you speak to showcase your communication skills.</p>
            <p className="text-xs">Include proficiency levels to demonstrate your language capabilities.</p>
          </div>
        )}
      </div>
    </BaseSection>
  )
}

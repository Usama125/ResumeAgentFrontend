"use client"

import React, { useState } from "react"
import { Heart, Edit, Trash2, Plus } from "lucide-react"
import { User as UserType } from "@/types"
import { useTheme } from "@/context/ThemeContext"
import { Button } from "@/components/ui/button"
import BaseSection from "../BaseSection"

interface AdvancedVolunteerSectionProps {
  user: UserType
  isEditMode?: boolean
  onEditVolunteerExperience?: (index: number) => void
  onDeleteVolunteerExperience?: (index: number) => void
  onAddVolunteerExperience?: () => void
  onDelete?: () => void
}

export default function AdvancedVolunteerSection({
  user,
  isEditMode = false,
  onEditVolunteerExperience,
  onDeleteVolunteerExperience,
  onAddVolunteerExperience,
  onDelete
}: AdvancedVolunteerSectionProps) {
  const { isDark } = useTheme()
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<number>>(new Set())

  // Check if section has data
  const hasData = !!(user.volunteer_experience && user.volunteer_experience.length > 0)

  const toggleDescription = (index: number) => {
    setExpandedDescriptions(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  return (
    <BaseSection
      id="volunteer"
      title="Volunteer Experience"
      icon={<Heart className="w-5 h-5 text-[#10a37f]" />}
      isEditMode={isEditMode}
      onDelete={hasData ? onDelete : undefined}
      onAdd={isEditMode ? onAddVolunteerExperience : undefined}
    >
      <div className="space-y-4 sm:space-y-6">
        {hasData ? (
          user.volunteer_experience.map((vol, index) => (
            <div 
              key={index} 
              className={`group/volunteer relative overflow-hidden rounded-2xl border-2 transition-all duration-500 ${
                isDark 
                  ? 'bg-gradient-to-br from-[#1a1a1a]/80 via-[#2a2a2a]/60 to-[#1a1a1a]/80 border-[#10a37f]/20 hover:border-[#10a37f]/40' 
                  : 'bg-white/80 hover:bg-[#10a37f]/10 border border-[#10a37f]/15 hover:border-[#10a37f]/30'
              } backdrop-blur-sm hover:shadow-lg hover:shadow-[#10a37f]/10`}
            >
              {/* Volunteer Background Effects */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#10a37f]/5 to-transparent rounded-full blur-xl"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-[#0d8f6f]/5 to-transparent rounded-full blur-lg"></div>
              </div>
              
              <div className="relative z-10 p-4 sm:p-6">
                {/* Edit/Delete buttons - Floating on mobile, inline on desktop */}
                {isEditMode && (onEditVolunteerExperience || onDeleteVolunteerExperience) && (
                  <div className="absolute top-2 right-2 sm:relative sm:top-0 sm:right-0 flex items-center gap-1 sm:gap-2 flex-shrink-0 mb-2 sm:mb-0">
                    {onEditVolunteerExperience && (
                      <button
                        onClick={() => onEditVolunteerExperience(index)}
                        className={`group/btn p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all duration-300 ${
                          isDark 
                            ? 'bg-[#1a1a1a]/80 hover:bg-[#10a37f]/20 border border-[#10a37f]/20 hover:border-[#10a37f]/40' 
                            : 'bg-white/80 hover:bg-[#10a37f]/10 border border-[#10a37f]/15 hover:border-[#10a37f]/30'
                        } backdrop-blur-sm hover:scale-105 hover:shadow-lg`}
                        title="Edit volunteer experience"
                      >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4 text-[#10a37f] group-hover/btn:animate-pulse" />
                      </button>
                    )}
                    {onDeleteVolunteerExperience && (
                      <button
                        onClick={() => onDeleteVolunteerExperience(index)}
                        className={`group/btn p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all duration-300 ${
                          isDark 
                            ? 'bg-[#1a1a1a]/80 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40' 
                            : 'bg-white/80 hover:bg-red-500/10 border border-red-500/15 hover:border-red-500/30'
                        } backdrop-blur-sm hover:scale-105 hover:shadow-lg`}
                        title="Delete volunteer experience"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 group-hover/btn:animate-pulse" />
                      </button>
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="space-y-3 sm:space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-base sm:text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} leading-tight`}>
                        {vol.role}
                      </h3>
                      <p className="text-[#10a37f] font-medium text-sm sm:text-base mt-1">
                        {vol.organization}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  {vol.description && (
                    <div className="space-y-2">
                      <div className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm sm:text-base leading-relaxed`}>
                        {expandedDescriptions.has(index) ? (
                          <span>{vol.description}</span>
                        ) : (
                          <span>
                            {vol.description.length > 150 
                              ? `${vol.description.substring(0, 150)}...` 
                              : vol.description
                            }
                          </span>
                        )}
                      </div>
                      {vol.description.length > 150 && (
                        <button
                          onClick={() => toggleDescription(index)}
                          className={`text-sm font-medium transition-colors ${
                            isDark 
                              ? 'text-[#10a37f] hover:text-[#0d8f6f]' 
                              : 'text-[#10a37f] hover:text-[#0d8f6f]'
                          }`}
                        >
                          {expandedDescriptions.has(index) ? 'See Less' : 'See More'}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Date */}
                  {(vol.start_date || vol.end_date) && (
                    <div className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} font-medium`}>
                      {vol.start_date} {vol.end_date && `- ${vol.end_date}`}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={`text-center py-8 sm:py-12 rounded-2xl border-2 border-dashed ${
            isDark 
              ? 'border-[#10a37f]/20 bg-[#1a1a1a]/40 text-gray-400' 
              : 'border-[#10a37f]/30 bg-gray-50/50 text-gray-600'
          }`}>
            <Heart className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-[#10a37f]/40' : 'text-[#10a37f]/30'}`} />
            <p className="text-sm sm:text-base font-medium mb-2">No volunteer experience added</p>
            <p className="text-xs sm:text-sm opacity-75">Add your volunteer work and community service</p>
          </div>
        )}
      </div>
    </BaseSection>
  )
}

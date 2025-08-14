"use client"

import { useState } from "react"
import { Award, Edit, Trash2, Calendar, Star, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { User as UserType } from "@/types"
import { useTheme } from "@/context/ThemeContext"
import { getThemeClasses } from "@/utils/theme"
import BaseSection from "../BaseSection"

interface AdvancedAwardsSectionProps {
  user: UserType
  isEditMode?: boolean
  onEdit?: () => void
  onDelete?: () => void
  onEditAward?: (index: number) => void
  onDeleteAward?: (index: number) => void
  onAddAward?: () => void
}

export default function AdvancedAwardsSection({
  user,
  isEditMode = false,
  onEdit,
  onDelete,
  onEditAward,
  onDeleteAward,
  onAddAward
}: AdvancedAwardsSectionProps) {
  const { isDark } = useTheme()
  const theme = getThemeClasses(isDark)

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
      onDelete={hasData ? onDelete : undefined}
      onAdd={isEditMode ? onAddAward : undefined}
    >
      <div className="space-y-6">
        {hasData ? (
          user.awards.map((award, index) => (
            <div 
              key={index} 
              className={`group/award relative overflow-hidden rounded-2xl border-2 transition-all duration-500 ${
                isDark 
                  ? 'bg-gradient-to-br from-[#1a1a1a]/80 via-[#2a2a2a]/60 to-[#1a1a1a]/80 border-[#10a37f]/20 hover:border-[#10a37f]/40' 
                  : 'bg-gradient-to-br from-white/80 via-gray-50/60 to-white/80 border-[#10a37f]/15 hover:border-[#10a37f]/30'
              } backdrop-blur-sm hover:shadow-lg hover:shadow-[#10a37f]/10`}
            >
              {/* Award Background Effects */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#10a37f]/5 to-transparent rounded-full blur-xl"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-[#0d8f6f]/5 to-transparent rounded-full blur-lg"></div>
              </div>
              
              <div className="relative z-10 p-6">
                <div className="flex items-start justify-between gap-6">
                  {/* Left side - Award details */}
                  <div className="flex-1 min-w-0">
                    {/* Header with Award Title and Issuer */}
                    <div className="mb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#10a37f]/20 to-[#0d8f6f]/20 rounded-xl shadow-lg backdrop-blur-sm">
                          <Trophy className="w-6 h-6 text-[#10a37f]" />
                        </div>
                        <div>
                          <h3 className={`text-xl font-bold ${theme.text.primary} group-hover/award:text-[#10a37f] transition-colors mb-1`}>
                            {award.title}
                          </h3>
                          {award.issuer && (
                            <p className="text-[#10a37f] font-semibold text-lg">
                              {award.issuer}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Award Description */}
                    {award.description && (
                      <div className="mb-4">
                        <h4 className={`font-semibold ${theme.text.primary} mb-2 flex items-center gap-2`}>
                          <div className="w-1 h-4 bg-gradient-to-b from-[#10a37f] to-[#0d8f6f] rounded-full"></div>
                          Description
                        </h4>
                        <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                          {award.description}
                        </p>
                      </div>
                    )}
                    
                    {/* Award Date */}
                    {award.date && (
                      <div className={`flex items-center gap-3 p-3 rounded-xl ${
                        isDark ? 'bg-[#1a1a1a]/60 border border-[#10a37f]/20' : 'bg-white/60 border border-[#10a37f]/20'
                      }`}>
                        <div className="flex items-center justify-center w-8 h-8 bg-[#10a37f]/20 rounded-lg">
                          <Calendar className="w-4 h-4 text-[#10a37f]" />
                        </div>
                        <div>
                          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Award Date</p>
                          <p className={`font-medium ${theme.text.primary}`}>{award.date}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Right side - Edit/Delete buttons */}
                  {isEditMode && (onEditAward || onDeleteAward) && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {onEditAward && (
                        <button
                          onClick={() => onEditAward(index)}
                          className={`group/btn p-3 rounded-xl transition-all duration-300 ${
                            isDark 
                              ? 'bg-[#1a1a1a]/60 hover:bg-[#10a37f]/20 border border-[#10a37f]/20 hover:border-[#10a37f]/40' 
                              : 'bg-white/60 hover:bg-[#10a37f]/10 border border-[#10a37f]/15 hover:border-[#10a37f]/30'
                          } backdrop-blur-sm hover:scale-105 hover:shadow-lg`}
                          title="Edit award"
                        >
                          <Edit className="w-4 h-4 text-[#10a37f] group-hover/btn:animate-pulse" />
                        </button>
                      )}
                      {onDeleteAward && (
                        <button
                          onClick={() => onDeleteAward(index)}
                          className={`group/btn p-3 rounded-xl transition-all duration-300 ${
                            isDark 
                              ? 'bg-[#1a1a1a]/60 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40' 
                              : 'bg-white/60 hover:bg-red-500/10 border border-red-300/20 hover:border-red-400/30'
                          } backdrop-blur-sm hover:scale-105 hover:shadow-lg`}
                          title="Delete award"
                        >
                          <Trash2 className="w-4 h-4 text-red-400 group-hover/btn:animate-pulse" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <div className="relative">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#10a37f]/20 to-[#0d8f6f]/20 rounded-2xl flex items-center justify-center">
                <Award className="w-10 h-10 text-[#10a37f]" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#10a37f]/30 rounded-full blur-sm"></div>
            </div>
            <h3 className={`text-lg font-semibold ${theme.text.primary} mb-2`}>
              No Awards & Recognition Added
            </h3>
            <p className="text-sm mb-1">Add your achievements and recognitions to showcase your accomplishments.</p>
            <p className="text-xs">Include awards, certificates, and other professional recognitions.</p>
          </div>
        )}
      </div>
    </BaseSection>
  )
}

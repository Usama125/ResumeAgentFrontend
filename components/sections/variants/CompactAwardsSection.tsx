"use client"

import { useState } from "react"
import { Award, Edit, Trash2, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { User as UserType } from "@/types"
import { useTheme } from "@/context/ThemeContext"
import { getThemeClasses } from "@/utils/theme"
import BaseSection from "../BaseSection"

interface CompactAwardsSectionProps {
  user: UserType
  isEditMode?: boolean
  onEdit?: () => void
  onDelete?: () => void
  onEditAward?: (index: number) => void
  onDeleteAward?: (index: number) => void
  onAddAward?: () => void
}

export default function CompactAwardsSection({
  user,
  isEditMode = false,
  onEdit,
  onDelete,
  onEditAward,
  onDeleteAward,
  onAddAward
}: CompactAwardsSectionProps) {
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
      <div className="space-y-3">
        {hasData ? (
          user.awards.map((award, index) => (
            <div 
              key={index} 
              className={`relative overflow-hidden rounded-xl border transition-all duration-300 ${
                isDark 
                  ? 'bg-[#2a2a2a]/60 border-[#10a37f]/20 hover:border-[#10a37f]/40' 
                  : 'bg-white/80 border-gray-200 hover:border-[#10a37f]/40'
              } shadow-sm hover:shadow-md`}
            >
              {/* Background Effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#10a37f]/5 via-transparent to-[#10a37f]/10"></div>
              
              {/* Content */}
              <div className="relative z-10 p-4">
                <div className="flex items-start justify-between gap-3">
                  {/* Left side - Award details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center justify-center w-6 h-6 bg-[#10a37f]/20 rounded-lg flex-shrink-0">
                        <Award className="w-3 h-3 text-[#10a37f]" />
                      </div>
                      <h3 className={`font-semibold ${theme.text.primary} truncate`}>
                        {award.title}
                      </h3>
                    </div>
                    
                    {award.issuer && (
                      <p className="text-[#10a37f] font-medium text-sm mb-1 truncate">
                        {award.issuer}
                      </p>
                    )}
                    
                    {award.description && (
                      <p className={`${theme.text.secondary} text-xs leading-relaxed line-clamp-2`}>
                        {award.description}
                      </p>
                    )}
                    
                    {award.date && (
                      <div className="flex items-center gap-1 mt-2 text-xs">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {award.date}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Right side - Edit/Delete buttons */}
                  {isEditMode && (onEditAward || onDeleteAward) && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {onEditAward && (
                        <Button
                          onClick={() => onEditAward(index)}
                          size="sm"
                          variant="ghost"
                          className="text-[#10a37f] hover:text-[#0d8f6f] hover:bg-[#10a37f]/10 p-1.5 h-8 w-8"
                          title="Edit award"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                      )}
                      {onDeleteAward && (
                        <Button
                          onClick={() => onDeleteAward(index)}
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:text-red-600 hover:bg-red-500/10 p-1.5 h-8 w-8"
                          title="Delete award"
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
          <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <Award className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-sm">No awards or recognition added.</p>
            <p className="text-xs mt-1">Add your achievements and recognitions to showcase your accomplishments.</p>
          </div>
        )}
      </div>
    </BaseSection>
  )
}

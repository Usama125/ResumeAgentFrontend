"use client"

import React from "react"
import { Heart, Edit, Trash2, Plus } from "lucide-react"
import { User as UserType } from "@/types"
import { useTheme } from "@/context/ThemeContext"
import { Button } from "@/components/ui/button"
import BaseSection from "../BaseSection"

interface AdvancedInterestsSectionProps {
  user: UserType
  isEditMode?: boolean
  onEditInterests?: () => void
  onDeleteInterests?: () => void
  onAddInterests?: () => void
  onDelete?: () => void
}

export default function AdvancedInterestsSection({
  user,
  isEditMode = false,
  onEditInterests,
  onDeleteInterests,
  onAddInterests,
  onDelete
}: AdvancedInterestsSectionProps) {
  const { isDark } = useTheme()

  // Check if section has data
  const hasData = !!(user.interests && user.interests.length > 0)

  return (
    <BaseSection
      id="interests"
      title="Interests & Hobbies"
      icon={<Heart className="w-5 h-5 text-[#10a37f]" />}
      isEditMode={isEditMode}
      onDelete={hasData ? onDelete : undefined}
      onAdd={isEditMode ? onAddInterests : undefined}
    >
      <div className="space-y-4 sm:space-y-6">
        {hasData ? (
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {user.interests.map((interest, index) => (
              <span 
                key={index} 
                className={`px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-xl border-2 transition-all duration-300 ${
                  isDark 
                    ? 'bg-[#10a37f]/20 text-[#10a37f] border-[#10a37f]/30 hover:bg-[#10a37f]/30 hover:border-[#10a37f]/50' 
                    : 'bg-[#10a37f]/10 text-[#10a37f] border-[#10a37f]/20 hover:bg-[#10a37f]/20 hover:border-[#10a37f]/40'
                } hover:scale-105 hover:shadow-lg hover:shadow-[#10a37f]/20 backdrop-blur-sm`}
              >
                {interest}
              </span>
            ))}
          </div>
        ) : (
          <div className={`text-center py-8 sm:py-12 rounded-2xl border-2 border-dashed ${
            isDark 
              ? 'border-[#10a37f]/20 bg-[#1a1a1a]/40 text-gray-400' 
              : 'border-[#10a37f]/30 bg-gray-50/50 text-gray-600'
          }`}>
            <Heart className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-[#10a37f]/40' : 'text-[#10a37f]/30'}`} />
            <p className="text-sm sm:text-base font-medium mb-2">No interests added</p>
            <p className="text-xs sm:text-sm opacity-75">Add your hobbies and interests</p>
          </div>
        )}
      </div>
    </BaseSection>
  )
}

"use client"

import React from "react"
import { User as UserType } from "@/types"
import { useTheme } from "@/context/ThemeContext"
import { calculateProfileCompletion } from "@/utils/profileCompletion"
import { Plus, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProfileCompletionSectionProps {
  user: UserType
  isEditMode?: boolean
  onEditAbout?: () => void
  onEditSkills?: () => void
  onEditExperience?: () => void
  onEditProject?: () => void
  onEditEducation?: () => void
  onEditContact?: () => void
  onAddLanguage?: () => void
  onAddAward?: () => void
  onAddPublication?: () => void
  onAddVolunteerExperience?: () => void
  onAddInterests?: () => void
  onEditPreferences?: () => void
}

export default function ProfileCompletionSection({
  user,
  isEditMode = false,
  onEditAbout,
  onEditSkills,
  onEditExperience,
  onEditProject,
  onEditEducation,
  onEditContact,
  onAddLanguage,
  onAddAward,
  onAddPublication,
  onAddVolunteerExperience,
  onAddInterests,
  onEditPreferences
}: ProfileCompletionSectionProps) {
  const { isDark } = useTheme()
  const completionData = calculateProfileCompletion(user)

  // Check if work preferences is completed
  const hasWorkPreferences = user.work_preferences && (
    user.work_preferences.preferred_work_mode?.length > 0 ||
    user.work_preferences.preferred_employment_type?.length > 0 ||
    user.work_preferences.preferred_location ||
    user.work_preferences.notice_period ||
    user.work_preferences.availability ||
    user.current_salary ||
    user.expected_salary
  )

  // Check if about section is completed
  const hasAbout = user.summary && user.summary.trim()

  // Check if about section is already in the empty sections from main calculation
  const aboutAlreadyInEmpty = completionData.emptySections.some(section => section.id === 'about')

  // Add work preferences to empty sections if not completed
  const allEmptySections = [...completionData.emptySections]
  if (!hasWorkPreferences) {
    allEmptySections.push({
      id: 'preferences',
      title: 'Work Preferences',
      field: 'work_preferences'
    })
  }

  // Add about section to empty sections if not completed and not already in the list
  if (!hasAbout && !aboutAlreadyInEmpty) {
    allEmptySections.push({
      id: 'about',
      title: 'About Me',
      field: 'summary'
    })
  }

  // Calculate adjusted percentage including work preferences and about
  // If about is missing and not already counted, it should be added to total but not to completed
  // If work preferences is missing, it should be added to total but not to completed
  const missingWorkPreferences = hasWorkPreferences ? 0 : 1
  const missingAbout = hasAbout ? 0 : (aboutAlreadyInEmpty ? 0 : 1)
  const missingSections = missingWorkPreferences + missingAbout
  const adjustedTotalSections = completionData.totalSections + missingSections
  const adjustedCompletedSections = completionData.completedSections
  const adjustedPercentage = Math.round((adjustedCompletedSections / adjustedTotalSections) * 100)


  // Don't show if no empty sections or not in edit mode
  if (allEmptySections.length === 0 || !isEditMode) {
    return null
  }

  const getAddHandler = (sectionId: string) => {
    switch (sectionId) {
      case 'about':
        return onEditAbout
      case 'skills':
        return onEditSkills
      case 'experience':
        return onEditExperience
      case 'projects':
        return onEditProject
      case 'education':
        return onEditEducation
      case 'contact':
        return onEditContact
      case 'languages':
        return onAddLanguage
      case 'awards':
        return onAddAward
      case 'publications':
        return onAddPublication
      case 'volunteer':
        return onAddVolunteerExperience
      case 'interests':
        return onAddInterests
      case 'preferences':
        return onEditPreferences
      default:
        return undefined
    }
  }

  const radius = 40
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (adjustedPercentage / 100) * circumference

  return (
    <div className={`relative overflow-hidden rounded-2xl border ${
      isDark 
        ? 'bg-[#2a2a2a]/80 border-[#565869]/60' 
        : 'bg-white/80 border-gray-200'
    } shadow-lg backdrop-blur-sm`}>
      
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#10a37f]/5 via-transparent to-[#10a37f]/10"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#10a37f]/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#0d8f6f]/5 rounded-full blur-lg"></div>
      
      {/* Content */}
      <div className="relative z-10 p-6">
        <div className="flex items-start justify-between gap-6">
          {/* Left side - Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-[#10a37f] flex-shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Complete Your Profile
              </h3>
            </div>
            
            <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Add information to these sections to make your profile more complete and professional.
            </p>
            
            <div className="flex flex-wrap gap-3">
              {allEmptySections.map((section) => {
                const addHandler = getAddHandler(section.id)
                
                return (
                  <Button
                    key={section.id}
                    onClick={addHandler}
                    variant="outline"
                    size="sm"
                    className={`flex items-center gap-2 ${
                      isDark 
                        ? 'bg-[#2f2f2f]/60 border-[#565869]/40 text-white hover:bg-[#40414f]/60 hover:border-[#10a37f]/40' 
                        : 'bg-gray-50/60 border-gray-200 text-gray-700 hover:bg-gray-100/60 hover:border-[#10a37f]/40'
                    } transition-colors`}
                  >
                    <Plus className="w-4 h-4 text-[#10a37f]" />
                    <span>Add {section.title}</span>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Right side - Circular Progress */}
          <div className="flex-shrink-0">
            <div className="relative w-28 h-28">
              {/* Background circle */}
              <svg 
                className="w-28 h-28 transform -rotate-90" 
                viewBox="0 0 100 100"
                style={{ width: '112px', height: '112px' }}
              >
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke={isDark ? '#374151' : '#e5e7eb'}
                  strokeWidth="8"
                  fill="transparent"
                  strokeLinecap="round"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="#10a37f"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              
              {/* Percentage text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {adjustedPercentage}%
                  </div>
                  <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Complete
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
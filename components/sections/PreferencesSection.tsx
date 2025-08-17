"use client"

import React, { useState } from "react"
import { User as UserType } from "@/types"
import { useTheme } from "@/context/ThemeContext"
import { Edit, Settings, AlertCircle, MapPin, DollarSign, Clock, Briefcase, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { WORK_MODES, EMPLOYMENT_TYPES, AVAILABILITY_OPTIONS } from "@/types"
import PreferencesEditModal from "../PreferencesEditModal"

interface PreferencesSectionProps {
  user: UserType
  isEditMode?: boolean
}

export default function PreferencesSection({
  user,
  isEditMode = false
}: PreferencesSectionProps) {
  const { isDark } = useTheme()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Don't show if not in edit mode
  if (!isEditMode) {
    return null
  }

  const workPreferences = user.work_preferences
  const hasPreferences = workPreferences && (
    workPreferences.preferred_work_mode?.length > 0 ||
    workPreferences.preferred_employment_type?.length > 0 ||
    workPreferences.preferred_location ||
    workPreferences.notice_period ||
    workPreferences.availability ||
    user.current_salary ||
    user.expected_salary
  )

  const getWorkModeLabel = (modeId: string) => {
    const mode = WORK_MODES.find(m => m.id === modeId)
    return mode?.label || modeId
  }

  const getEmploymentTypeLabel = (typeId: string) => {
    const type = EMPLOYMENT_TYPES.find(t => t.id === typeId)
    return type?.label || typeId
  }

  const handleEditPreferences = () => {
    setIsEditModalOpen(true)
  }

  return (
    <>
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
        <div className="relative z-10 p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="text-[#10a37f] flex-shrink-0">
                <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <h3 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Work Preferences
              </h3>
            </div>
            
            {isEditMode && (
              <Button
                onClick={handleEditPreferences}
                variant="ghost"
                size="sm"
                className="text-[#10a37f] hover:text-[#0d8f6f] hover:bg-[#10a37f]/10 p-1.5 sm:p-2"
                title="Edit Work Preferences"
              >
                <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Button>
            )}
          </div>

          {/* Disclaimer */}
          <div className={`mb-6 sm:mb-8 p-3 sm:p-4 rounded-xl border ${
            isDark 
              ? 'bg-[#1a1a1a]/60 border-[#565869]/40' 
              : 'bg-gray-50/60 border-gray-200'
          }`}>
            <div className="flex items-start gap-2 sm:gap-3">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#10a37f] flex-shrink-0 mt-0.5" />
              <div>
                <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
                  Private Information
                </p>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  This information is only visible to you and helps recruiters understand your preferences and requirements. 
                  It will not be displayed on your public profile but assists in matching you with suitable opportunities.
                </p>
              </div>
            </div>
          </div>

          {/* Preferences Content */}
          {hasPreferences ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {/* Work Modes */}
              {workPreferences?.preferred_work_mode && workPreferences.preferred_work_mode.length > 0 && (
                <div className="bg-gradient-to-r from-[#10a37f]/5 to-transparent rounded-xl p-3 sm:p-4 border border-[#10a37f]/10">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#10a37f]" />
                    <h4 className={`text-xs sm:text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                      Work Modes
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {workPreferences.preferred_work_mode.map((mode) => (
                      <Badge
                        key={mode}
                        className={`${
                          isDark 
                            ? 'bg-[#10a37f]/20 text-[#10a37f] border-[#10a37f]/30' 
                            : 'bg-[#10a37f]/10 text-[#10a37f] border-[#10a37f]/30'
                        } px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-medium`}
                      >
                        {getWorkModeLabel(mode)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Employment Types */}
              {workPreferences?.preferred_employment_type && workPreferences.preferred_employment_type.length > 0 && (
                <div className="bg-gradient-to-r from-[#10a37f]/5 to-transparent rounded-xl p-3 sm:p-4 border border-[#10a37f]/10">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#10a37f]" />
                    <h4 className={`text-xs sm:text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                      Employment
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {workPreferences.preferred_employment_type.map((type) => (
                      <Badge
                        key={type}
                        className={`${
                          isDark 
                            ? 'bg-[#10a37f]/20 text-[#10a37f] border-[#10a37f]/30' 
                            : 'bg-[#10a37f]/10 text-[#10a37f] border-[#10a37f]/30'
                        } px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-medium`}
                      >
                        {getEmploymentTypeLabel(type)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Location */}
              {workPreferences?.preferred_location && (
                <div className="bg-gradient-to-r from-[#10a37f]/5 to-transparent rounded-xl p-3 sm:p-4 border border-[#10a37f]/10">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#10a37f]" />
                    <h4 className={`text-xs sm:text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                      Location
                    </h4>
                  </div>
                  <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'} font-medium`}>
                    {workPreferences.preferred_location}
                  </p>
                </div>
              )}

              {/* Salary Information */}
              {(user.current_salary || user.expected_salary) && (
                <div className="bg-gradient-to-r from-[#10a37f]/5 to-transparent rounded-xl p-3 sm:p-4 border border-[#10a37f]/10">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#10a37f]" />
                    <h4 className={`text-xs sm:text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                      Salary
                    </h4>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    {user.current_salary && (
                      <div className="flex items-center justify-between">
                        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Current</span>
                        <span className={`text-xs sm:text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {user.current_salary}
                        </span>
                      </div>
                    )}
                    {user.expected_salary && (
                      <div className="flex items-center justify-between">
                        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Expected</span>
                        <span className={`text-xs sm:text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {user.expected_salary}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Notice Period */}
              {workPreferences?.notice_period && (
                <div className="bg-gradient-to-r from-[#10a37f]/5 to-transparent rounded-xl p-3 sm:p-4 border border-[#10a37f]/10">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#10a37f]" />
                    <h4 className={`text-xs sm:text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                      Notice Period
                    </h4>
                  </div>
                  <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'} font-medium`}>
                    {workPreferences.notice_period}
                  </p>
                </div>
              )}

              {/* Availability */}
              {workPreferences?.availability && (
                <div className="bg-gradient-to-r from-[#10a37f]/5 to-transparent rounded-xl p-3 sm:p-4 border border-[#10a37f]/10">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#10a37f]" />
                    <h4 className={`text-xs sm:text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                      Availability
                    </h4>
                  </div>
                  <Badge
                    className={`${
                      isDark 
                        ? 'bg-[#10a37f]/20 text-[#10a37f] border-[#10a37f]/30' 
                        : 'bg-[#10a37f]/10 text-[#10a37f] border-[#10a37f]/30'
                    } px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-medium capitalize`}
                  >
                    {workPreferences.availability}
                  </Badge>
                </div>
              )}
            </div>
          ) : (
            <div className={`text-center pb-8 sm:pb-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <Settings className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 opacity-50" />
              <p className="text-base sm:text-lg font-medium mb-1.5 sm:mb-2">No Work Preferences Set</p>
              <p className="text-xs sm:text-sm">Add your preferences to help recruiters find better matches</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <PreferencesEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
      />
    </>
  )
} 
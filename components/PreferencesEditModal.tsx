"use client"

import React, { useState, useEffect } from "react"
import { User as UserType } from "@/types"
import { useTheme } from "@/context/ThemeContext"
import { getThemeClasses } from "@/utils/theme"
import { X, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { WORK_MODES, EMPLOYMENT_TYPES, AVAILABILITY_OPTIONS } from "@/types"
import { UserService } from "@/services/user"
import { useAuth } from "@/context/AuthContext"
import { useErrorHandler } from "@/utils/errorHandler"

interface PreferencesEditModalProps {
  isOpen: boolean
  onClose: () => void
  user: UserType
}

interface PreferencesFormData {
  preferred_work_mode: string[]
  preferred_employment_type: string[]
  preferred_location: string
  current_salary: string
  expected_salary: string
  notice_period: string
  availability: string
}

export default function PreferencesEditModal({
  isOpen,
  onClose,
  user
}: PreferencesEditModalProps) {
  const { refreshUser } = useAuth()
  const { handleError } = useErrorHandler()
  const { isDark } = useTheme()
  const themeClasses = getThemeClasses(isDark)

  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<PreferencesFormData>({
    preferred_work_mode: [],
    preferred_employment_type: [],
    preferred_location: "",
    current_salary: "",
    expected_salary: "",
    notice_period: "",
    availability: ""
  })

  // Load user data into form when modal opens
  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        preferred_work_mode: user.work_preferences?.preferred_work_mode || [],
        preferred_employment_type: user.work_preferences?.preferred_employment_type || [],
        preferred_location: user.work_preferences?.preferred_location || "",
        current_salary: user.current_salary || "",
        expected_salary: user.expected_salary || "",
        notice_period: user.work_preferences?.notice_period || "",
        availability: user.work_preferences?.availability || ""
      })
    }
  }, [isOpen, user])

  const handleSavePreferences = async () => {
    try {
      setIsLoading(true)

      const updateData = {
        work_preferences: {
          preferred_work_mode: formData.preferred_work_mode,
          preferred_employment_type: formData.preferred_employment_type,
          current_employment_mode: [],
          preferred_location: formData.preferred_location,
          notice_period: formData.notice_period,
          availability: formData.availability
        },
        current_salary: formData.current_salary,
        expected_salary: formData.expected_salary
      }

      await UserService.updateProfile(updateData)
      await refreshUser()
      onClose()
    } catch (err: any) {
      handleError(err)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleWorkMode = (modeId: string) => {
    setFormData(prev => ({
      ...prev,
      preferred_work_mode: prev.preferred_work_mode.includes(modeId)
        ? prev.preferred_work_mode.filter(m => m !== modeId)
        : [...prev.preferred_work_mode, modeId]
    }))
  }

  const toggleEmploymentType = (typeId: string) => {
    setFormData(prev => ({
      ...prev,
      preferred_employment_type: prev.preferred_employment_type.includes(typeId)
        ? prev.preferred_employment_type.filter(t => t !== typeId)
        : [...prev.preferred_employment_type, typeId]
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={true}>
      <DialogContent 
        className={`max-w-4xl relative overflow-hidden ${themeClasses.text.primary} h-[90vh] p-0 flex flex-col border-0 [&>button]:hidden`}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 50
        }}
      >
        {/* Background gradients */}
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-[#1a1a1a] via-[#212121] to-[#1a1a1a]' : 'bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100'}`}></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#10a37f]/10 via-transparent to-[#10a37f]/5"></div>
        
        {/* Decorative floating elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#10a37f]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#10a37f]/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Content wrapper */}
        <div className="relative z-10 w-full h-full flex flex-col">
          {/* Header */}
          <div className={`shrink-0 p-6 border-b ${themeClasses.border.primary}`}>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className={`${themeClasses.text.primary} text-xl font-semibold`}>
                  Edit Work Preferences
                </DialogTitle>
                <button
                  onClick={onClose}
                  className={`${themeClasses.text.tertiary} hover:${themeClasses.text.primary} transition-colors p-2 rounded-lg hover:bg-gray-100/10`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </DialogHeader>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-8">
              {/* Work Modes */}
              <div className="space-y-4">
                <Label className={`${themeClasses.text.primary} text-lg font-semibold`}>
                  Preferred Work Modes
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {WORK_MODES.map((mode) => (
                    <div
                      key={mode.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        formData.preferred_work_mode.includes(mode.id)
                          ? "border-[#10a37f] bg-[#10a37f]/10"
                          : `${themeClasses.border.primary} ${themeClasses.bg.tertiary}/30 ${themeClasses.border.hover} hover:${themeClasses.bg.tertiary}/50`
                      }`}
                      onClick={() => toggleWorkMode(mode.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className={`${themeClasses.text.primary} font-medium text-sm`}>{mode.label}</p>
                          <p className={`${themeClasses.text.tertiary} text-xs mt-1`}>{mode.description}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ml-3 shrink-0 ${
                          formData.preferred_work_mode.includes(mode.id)
                            ? "border-[#10a37f] bg-[#10a37f]"
                            : `${isDark ? 'border-gray-400' : 'border-gray-300'} bg-transparent`
                        }`}>
                          {formData.preferred_work_mode.includes(mode.id) && (
                            <div className="w-2 h-2 rounded-full bg-white mx-auto"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Employment Types */}
              <div className="space-y-4">
                <Label className={`${themeClasses.text.primary} text-lg font-semibold`}>
                  Employment Types
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {EMPLOYMENT_TYPES.map((type) => (
                    <div
                      key={type.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        formData.preferred_employment_type.includes(type.id)
                          ? "border-[#10a37f] bg-[#10a37f]/10"
                          : `${themeClasses.border.primary} ${themeClasses.bg.tertiary}/30 ${themeClasses.border.hover} hover:${themeClasses.bg.tertiary}/50`
                      }`}
                      onClick={() => toggleEmploymentType(type.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className={`${themeClasses.text.primary} font-medium text-sm`}>{type.label}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ml-3 shrink-0 ${
                          formData.preferred_employment_type.includes(type.id)
                            ? "border-[#10a37f] bg-[#10a37f]"
                            : `${isDark ? 'border-gray-400' : 'border-gray-300'} bg-transparent`
                        }`}>
                          {formData.preferred_employment_type.includes(type.id) && (
                            <div className="w-2 h-2 rounded-full bg-white mx-auto"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location and Salary Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label className={`${themeClasses.text.primary} text-lg font-semibold`}>
                    Preferred Location
                  </Label>
                  <Input
                    value={formData.preferred_location}
                    onChange={(e) => setFormData(prev => ({ ...prev, preferred_location: e.target.value }))}
                    className={`pl-4 pr-4 py-3 ${themeClasses.bg.input} backdrop-blur-sm ${themeClasses.text.primary} ${themeClasses.placeholder} focus:ring-[#10a37f] rounded-xl transition-all duration-300 ${themeClasses.border.hover} focus:${themeClasses.bg.input}`}
                    placeholder="e.g. San Francisco, CA"
                  />
                </div>

                <div className="space-y-4">
                  <Label className={`${themeClasses.text.primary} text-lg font-semibold`}>
                    Current Salary <span className="text-sm font-normal text-gray-500">(Optional)</span>
                  </Label>
                  <div className="space-y-2">
                    <Input
                      value={formData.current_salary}
                      onChange={(e) => setFormData(prev => ({ ...prev, current_salary: e.target.value }))}
                      className={`pl-4 pr-4 py-3 ${themeClasses.bg.input} backdrop-blur-sm ${themeClasses.text.primary} ${themeClasses.placeholder} focus:ring-[#10a37f] rounded-xl transition-all duration-300 ${themeClasses.border.hover} focus:${themeClasses.bg.input}`}
                      placeholder="e.g. $75,000"
                    />
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} italic`}>
                      Sharing your current salary helps recruiters provide more accurate opportunities, but it's completely optional.
                    </p>
                  </div>
                </div>
              </div>

              {/* Expected Salary and Notice Period Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label className={`${themeClasses.text.primary} text-lg font-semibold`}>
                    Expected Salary
                  </Label>
                  <Input
                    value={formData.expected_salary}
                    onChange={(e) => setFormData(prev => ({ ...prev, expected_salary: e.target.value }))}
                    className={`pl-4 pr-4 py-3 ${themeClasses.bg.input} backdrop-blur-sm ${themeClasses.text.primary} ${themeClasses.placeholder} focus:ring-[#10a37f] rounded-xl transition-all duration-300 ${themeClasses.border.hover} focus:${themeClasses.bg.input}`}
                    placeholder="e.g. $80k - $120k"
                  />
                </div>

                <div className="space-y-4">
                  <Label className={`${themeClasses.text.primary} text-lg font-semibold`}>
                    Notice Period
                  </Label>
                  <Input
                    value={formData.notice_period}
                    onChange={(e) => setFormData(prev => ({ ...prev, notice_period: e.target.value }))}
                    className={`pl-4 pr-4 py-3 ${themeClasses.bg.input} backdrop-blur-sm ${themeClasses.text.primary} ${themeClasses.placeholder} focus:ring-[#10a37f] rounded-xl transition-all duration-300 ${themeClasses.border.hover} focus:${themeClasses.bg.input}`}
                    placeholder="e.g. 2 weeks, 1 month"
                  />
                </div>
              </div>

              {/* Availability */}
              <div className="space-y-4">
                <Label className={`${themeClasses.text.primary} text-lg font-semibold`}>
                  Availability
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {AVAILABILITY_OPTIONS.map((option) => (
                    <div
                      key={option}
                      className={`p-4 rounded-lg border cursor-pointer transition-all text-center ${
                        formData.availability === option
                          ? "border-[#10a37f] bg-[#10a37f]/10"
                          : `${themeClasses.border.primary} ${themeClasses.bg.tertiary}/30 ${themeClasses.border.hover} hover:${themeClasses.bg.tertiary}/50`
                      }`}
                      onClick={() => {
                        const newValue = formData.availability === option ? "" : option
                        setFormData(prev => ({ ...prev, availability: newValue }))
                      }}
                    >
                      <p className={`${themeClasses.text.primary} font-medium text-sm capitalize`}>{option}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className={`shrink-0 p-6 border-t ${themeClasses.border.primary} ${themeClasses.bg.secondary}`}>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={onClose}
                className={`bg-transparent ${themeClasses.border.primary} ${themeClasses.text.secondary} hover:${themeClasses.bg.tertiary} hover:${themeClasses.text.primary} hover:border-[#10a37f]/50 px-6 py-2 rounded-lg transition-colors`}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSavePreferences}
                disabled={isLoading}
                className="bg-[#10a37f] hover:bg-[#0d8f6f] text-white px-8 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-4 h-4 bg-white/60 rounded animate-pulse mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 
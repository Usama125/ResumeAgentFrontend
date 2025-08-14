"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { getThemeClasses } from '@/utils/theme'
import { ProfileVariant, PROFILE_VARIANTS, User } from '@/types'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Settings,
  Palette,
  CheckCircle,
  X,
  Save,
  Loader2,
} from "lucide-react"

interface ProfileSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  user: User
  onVariantChange: (variant: ProfileVariant) => void
}

export default function ProfileSettingsModal({
  isOpen,
  onClose,
  user,
  onVariantChange
}: ProfileSettingsModalProps) {
  const { isDark } = useTheme()
  const theme = getThemeClasses(isDark)
  const [selectedVariant, setSelectedVariant] = useState<ProfileVariant>(
    (user.profile_variant as ProfileVariant) || "default"
  )
  const [isLoading, setIsLoading] = useState(false)

  const handleVariantSelect = (variant: ProfileVariant) => {
    setSelectedVariant(variant)
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await onVariantChange(selectedVariant)
      onClose()
    } catch (error) {
      console.error('Error updating profile variant:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setSelectedVariant((user.profile_variant as ProfileVariant) || "default")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        className={`relative w-full max-w-6xl max-h-[90vh] flex flex-col border-0 rounded-2xl shadow-2xl`}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 50
        }}
      >
        {/* Background gradients */}
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-[#1a1a1a] via-[#212121] to-[#1a1a1a]' : 'bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100'} rounded-2xl`}></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#10a37f]/10 via-transparent to-[#10a37f]/5 rounded-2xl"></div>
        
        {/* Decorative floating elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#10a37f]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#10a37f]/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-32 right-20 w-24 h-24 bg-[#10a37f]/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        
        {/* Content wrapper */}
        <div className="relative z-10 w-full h-full flex flex-col rounded-2xl overflow-hidden">
          {/* Header */}
          <div className={`shrink-0 p-4 border-b ${isDark ? 'border-[#10a37f]/20' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <h2 className={`text-lg font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                <Settings className="w-5 h-5 text-[#10a37f]" />
                Profile Settings
              </h2>
              <button
                onClick={onClose}
                className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'} transition-colors p-1.5 rounded-lg hover:bg-gray-100/10`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Sidebar */}
            <div className={`w-1/4 ${isDark ? 'bg-[#1a1a1a]/50' : 'bg-gray-100/50'} p-4 border-r ${isDark ? 'border-[#10a37f]/20' : 'border-gray-200'} backdrop-blur-sm`}>
              {/* Settings Options */}
              <div className="space-y-1">
                <div 
                  className={`flex items-center gap-2 p-3 rounded-lg transition-all duration-300 ${
                    isDark 
                      ? 'bg-[#2a2a2a]/80 border border-[#10a37f]/30 text-white shadow-lg' 
                      : 'bg-white/80 border border-[#10a37f]/30 text-gray-900 shadow-lg'
                  } backdrop-blur-sm`}
                >
                  <Palette className="w-4 h-4 text-[#10a37f]" />
                  <span className="font-medium text-sm">Portfolio Variants</span>
                  <Badge className="bg-[#10a37f] text-white text-xs px-1.5 py-0.5 ml-auto">
                    Active
                  </Badge>
                </div>
              </div>
            </div>

            {/* Right Content Area */}
            <div className="flex-1 flex flex-col">
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="mb-4">
                  <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                    Portfolio Variants
                  </h3>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
                    Choose how your profile appears to visitors. Each variant offers a different layout and presentation style.
                  </p>
                </div>

                {/* Variant Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {PROFILE_VARIANTS.map((variant) => (
                    <Card
                      key={variant.id}
                      className={`cursor-pointer transition-all duration-300 border-2 ${
                        selectedVariant === variant.id
                          ? 'border-[#10a37f] shadow-lg shadow-[#10a37f]/20 scale-105'
                          : `${isDark ? 'border-[#10a37f]/20 hover:border-[#10a37f]/50' : 'border-gray-200 hover:border-[#10a37f]/50'}`
                      } ${isDark ? 'bg-[#2a2a2a]/50' : 'bg-white/50'} hover:shadow-lg transform hover:scale-105 backdrop-blur-sm`}
                      onClick={() => handleVariantSelect(variant.id)}
                    >
                      <CardContent className="p-4">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-3">
                          <h4 className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {variant.name}
                          </h4>
                          {selectedVariant === variant.id && (
                            <CheckCircle className="w-5 h-5 text-[#10a37f]" />
                          )}
                        </div>

                        {/* Description */}
                        <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-3 text-xs leading-relaxed`}>
                          {variant.description}
                        </p>

                        {/* Preview Placeholder */}
                        <div className={`h-24 rounded-lg ${
                          isDark ? 'bg-[#1a1a1a]/80' : 'bg-gray-100/80'
                        } border ${isDark ? 'border-[#10a37f]/20' : 'border-gray-200'} flex items-center justify-center backdrop-blur-sm`}>
                          <div className="text-center">
                            <div className={`w-6 h-6 rounded-full ${
                              variant.id === 'default' ? 'bg-blue-500' :
                              variant.id === 'compact' ? 'bg-green-500' : 
                              'bg-purple-500'
                            } mx-auto mb-1 shadow-lg`}></div>
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              {variant.name} Preview
                            </p>
                          </div>
                        </div>

                        {/* Current Badge */}
                        {user.profile_variant === variant.id && (
                          <Badge className="bg-[#10a37f] text-white text-xs px-2 py-1 mt-2 w-full justify-center">
                            Current
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className={`shrink-0 p-4 border-t ${isDark ? 'border-[#10a37f]/20 bg-[#212121]/50' : 'border-gray-200 bg-gray-50/50'} backdrop-blur-sm`}>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className={`bg-transparent ${isDark ? 'border-[#10a37f]/30 text-gray-300 hover:bg-[#10a37f]/10 hover:text-white hover:border-[#10a37f]/50' : 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-400'} disabled:opacity-50 disabled:cursor-not-allowed px-4 py-1.5 text-sm rounded-lg transition-colors`}
              >
                <X className="w-3 h-3 mr-1.5" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isLoading || selectedVariant === user.profile_variant}
                className="bg-[#10a37f] hover:bg-[#0d8f6f] text-white px-6 py-1.5 text-sm rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-3 h-3 mr-1.5" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
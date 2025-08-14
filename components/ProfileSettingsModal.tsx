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
  Sparkles,
  Eye,
  Smartphone,
  Monitor,
  Zap,
  Star,
  ArrowRight,
  Play,
  Pause,
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
  const [hoveredVariant, setHoveredVariant] = useState<ProfileVariant | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleVariantSelect = (variant: ProfileVariant) => {
    if (isAnimating) return
    setIsAnimating(true)
    setSelectedVariant(variant)
    setTimeout(() => setIsAnimating(false), 300)
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

  const getVariantIcon = (variantId: string) => {
    switch (variantId) {
      case 'default':
        return <Monitor className="w-5 h-5" />
      case 'compact':
        return <Smartphone className="w-5 h-5" />
      case 'advanced':
        return <Zap className="w-5 h-5" />
      default:
        return <Palette className="w-5 h-5" />
    }
  }

  const getVariantColor = (variantId: string) => {
    switch (variantId) {
      case 'default':
        return 'from-blue-500 to-blue-600'
      case 'compact':
        return 'from-green-500 to-green-600'
      case 'advanced':
        return 'from-purple-500 to-purple-600'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  const getVariantFeatures = (variantId: string) => {
    switch (variantId) {
      case 'default':
        return ['Classic layout', 'Full content display', 'Traditional design']
      case 'compact':
        return ['Space-efficient', 'Mobile-optimized', 'Quick scanning']
      case 'advanced':
        return ['Premium visuals', 'Enhanced animations', 'Rich interactions']
      default:
        return ['Balanced design', 'Good readability', 'Professional look']
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div 
        className={`relative w-full max-w-7xl max-h-[95vh] flex flex-col border-0 rounded-3xl shadow-2xl overflow-hidden`}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 50
        }}
      >
        {/* Enhanced Background */}
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a]' : 'bg-gradient-to-br from-white via-gray-50 to-white'} rounded-3xl`}></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#10a37f]/20 via-transparent to-[#10a37f]/10 rounded-3xl"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-r from-[#10a37f]/30 to-[#0d8f6f]/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-gradient-to-r from-[#10a37f]/20 to-[#0d8f6f]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-[#10a37f]/10 to-[#0d8f6f]/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Content wrapper */}
        <div className="relative z-10 w-full h-full flex flex-col rounded-3xl overflow-hidden">
          {/* Enhanced Header */}
          <div className={`shrink-0 p-6 border-b ${isDark ? 'border-[#10a37f]/20 bg-[#1a1a1a]/80' : 'border-gray-200 bg-white/80'} backdrop-blur-sm`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-xl blur opacity-30"></div>
                  <div className={`relative p-2 rounded-xl ${isDark ? 'bg-[#2a2a2a]' : 'bg-white'} border border-[#10a37f]/30`}>
                    <Settings className="w-6 h-6 text-[#10a37f]" />
                  </div>
                </div>
                <div>
                  <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Profile Settings
                  </h2>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Customize your profile appearance and layout
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-xl transition-all duration-300 ${
                  isDark 
                    ? 'text-gray-400 hover:text-white hover:bg-[#2a2a2a]' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Sidebar - Enhanced */}
            <div className={`w-1/3 ${isDark ? 'bg-[#1a1a1a]/60' : 'bg-gray-50/60'} p-6 border-r ${isDark ? 'border-[#10a37f]/20' : 'border-gray-200'} backdrop-blur-sm`}>
              <div className="space-y-4">
                <div className="mb-6">
                  <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                    Customization Options
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Choose from different profile layouts and styles
                  </p>
                </div>

                {/* Active Option */}
                <div 
                  className={`flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 ${
                    isDark 
                      ? 'bg-gradient-to-r from-[#10a37f]/20 to-[#0d8f6f]/20 border border-[#10a37f]/40 text-white shadow-lg' 
                      : 'bg-gradient-to-r from-[#10a37f]/10 to-[#0d8f6f]/10 border border-[#10a37f]/30 text-gray-900 shadow-lg'
                  } backdrop-blur-sm`}
                >
                  <div className={`p-2 rounded-xl ${isDark ? 'bg-[#2a2a2a]' : 'bg-white'} border border-[#10a37f]/30`}>
                    <Palette className="w-5 h-5 text-[#10a37f]" />
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-sm">Portfolio Variants</span>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Layout & Design Options
                    </p>
                  </div>
                  <Badge className="bg-[#10a37f] text-white text-xs px-2 py-1">
                    Active
                  </Badge>
                </div>

                {/* Coming Soon Options */}
                <div className="space-y-2">
                  <div className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 opacity-50 ${
                    isDark ? 'bg-[#2a2a2a]/50' : 'bg-gray-100/50'
                  }`}>
                    <div className={`p-2 rounded-lg ${isDark ? 'bg-[#1a1a1a]' : 'bg-white'}`}>
                      <Sparkles className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        AI Customization
                      </span>
                      <p className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-500'}`}>
                        Coming Soon
                      </p>
                    </div>
                  </div>

                  <div className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 opacity-50 ${
                    isDark ? 'bg-[#2a2a2a]/50' : 'bg-gray-100/50'
                  }`}>
                    <div className={`p-2 rounded-lg ${isDark ? 'bg-[#1a1a1a]' : 'bg-white'}`}>
                      <Star className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        Premium Themes
                      </span>
                      <p className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-500'}`}>
                        Coming Soon
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content Area - Enhanced */}
            <div className="flex-1 flex flex-col">
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="mb-8">
                  <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>
                    Choose Your Profile Style
                  </h3>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-base leading-relaxed`}>
                    Select a variant that best represents your professional style. Each option offers a unique layout and visual experience.
                  </p>
                </div>

                {/* Enhanced Variant Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {PROFILE_VARIANTS.map((variant) => (
                    <div
                      key={variant.id}
                      className={`relative group cursor-pointer transition-all duration-500 ${
                        selectedVariant === variant.id
                          ? 'scale-105'
                          : 'hover:scale-102'
                      }`}
                      onClick={() => handleVariantSelect(variant.id)}
                      onMouseEnter={() => setHoveredVariant(variant.id)}
                      onMouseLeave={() => setHoveredVariant(null)}
                    >
                      {/* Card Background */}
                      <div className={`absolute inset-0 rounded-3xl transition-all duration-500 ${
                        selectedVariant === variant.id
                          ? 'bg-gradient-to-br from-[#10a37f]/20 to-[#0d8f6f]/20 border-2 border-[#10a37f] shadow-2xl shadow-[#10a37f]/20'
                          : hoveredVariant === variant.id
                          ? 'bg-gradient-to-br from-[#10a37f]/10 to-[#0d8f6f]/10 border border-[#10a37f]/30 shadow-xl'
                          : `${isDark ? 'bg-[#2a2a2a]/50 border border-[#10a37f]/20' : 'bg-white/50 border border-gray-200'} shadow-lg`
                      } backdrop-blur-sm`}></div>

                      {/* Card Content */}
                      <div className="relative p-6 h-full">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-2xl transition-all duration-300 ${
                              selectedVariant === variant.id
                                ? 'bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] text-white shadow-lg'
                                : `${isDark ? 'bg-[#1a1a1a]' : 'bg-white'} border border-[#10a37f]/30`
                            }`}>
                              {getVariantIcon(variant.id)}
                            </div>
                            <div>
                              <h4 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {variant.name}
                              </h4>
                              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                {variant.id === 'default' ? 'Classic' : variant.id === 'compact' ? 'Modern' : 'Premium'}
                              </p>
                            </div>
                          </div>
                          {selectedVariant === variant.id && (
                            <div className="relative">
                              <div className="absolute inset-0 bg-[#10a37f] rounded-full blur opacity-30 animate-pulse"></div>
                              <CheckCircle className="w-6 h-6 text-[#10a37f] relative z-10" />
                            </div>
                          )}
                        </div>

                        {/* Description */}
                        <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4 text-sm leading-relaxed`}>
                          {variant.description}
                        </p>

                        {/* Features List */}
                        <div className="mb-4">
                          <ul className="space-y-1">
                            {getVariantFeatures(variant.id).map((feature, index) => (
                              <li key={index} className={`flex items-center gap-2 text-xs ${
                                isDark ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                <div className="w-1 h-1 rounded-full bg-[#10a37f]"></div>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Interactive Preview */}
                        <div className={`h-32 rounded-2xl transition-all duration-300 ${
                          selectedVariant === variant.id
                            ? 'bg-gradient-to-br from-[#10a37f]/10 to-[#0d8f6f]/10 border border-[#10a37f]/30'
                            : `${isDark ? 'bg-[#1a1a1a]/80' : 'bg-gray-100/80'} border ${isDark ? 'border-[#10a37f]/20' : 'border-gray-200'}`
                        } flex items-center justify-center backdrop-blur-sm group-hover:border-[#10a37f]/40`}>
                          <div className="text-center">
                            <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getVariantColor(variant.id)} mx-auto mb-2 shadow-lg flex items-center justify-center`}>
                              {getVariantIcon(variant.id)}
                            </div>
                            <p className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                              {variant.name} Preview
                            </p>
                          </div>
                        </div>

                        {/* Current Badge */}
                        {user.profile_variant === variant.id && (
                          <div className="mt-4">
                            <Badge className="bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] text-white text-xs px-3 py-1 w-full justify-center font-medium">
                              Currently Active
                            </Badge>
                          </div>
                        )}

                        {/* Selection Indicator */}
                        {selectedVariant === variant.id && (
                          <div className="absolute top-4 right-4">
                            <div className="w-3 h-3 bg-[#10a37f] rounded-full animate-pulse"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Live Preview Section */}
                <div className="mt-8 p-6 rounded-3xl border border-[#10a37f]/20 bg-gradient-to-br from-[#10a37f]/5 to-transparent">
                  <div className="flex items-center gap-3 mb-4">
                    <Eye className="w-5 h-5 text-[#10a37f]" />
                    <h4 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Live Preview
                    </h4>
                  </div>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm mb-4`}>
                    Your profile will look like this when visitors view it. Changes are applied immediately after saving.
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#10a37f] rounded-full animate-pulse"></div>
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Preview updates in real-time
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Footer */}
          <div className={`shrink-0 p-6 border-t ${isDark ? 'border-[#10a37f]/20 bg-[#1a1a1a]/80' : 'border-gray-200 bg-white/80'} backdrop-blur-sm`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${selectedVariant === user.profile_variant ? 'bg-gray-400' : 'bg-[#10a37f]'} animate-pulse`}></div>
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {selectedVariant === user.profile_variant ? 'No changes to save' : 'Ready to apply changes'}
                </span>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className={`px-6 py-2 rounded-xl transition-all duration-300 ${
                    isDark 
                      ? 'border-[#10a37f]/30 text-gray-300 hover:bg-[#10a37f]/10 hover:text-white hover:border-[#10a37f]/50' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-400'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isLoading || selectedVariant === user.profile_variant}
                  className="bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#0a7a5f] text-white px-8 py-2 rounded-xl transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Applying Changes...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Apply Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
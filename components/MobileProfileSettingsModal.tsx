"use client"

import { useState } from "react"
import { X, Monitor, Smartphone, Zap, Star, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/context/ThemeContext"
import { ProfileVariant } from "@/types"

interface MobileProfileSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  currentVariant?: ProfileVariant
  onVariantChange?: (variant: ProfileVariant) => void
}

const variants = [
  {
    id: 'default',
    name: 'Default',
    subtitle: 'Classic',
    icon: Monitor,
    description: 'Standard portfolio layout with all sections displayed clearly',
    features: ['Classic layout', 'Full content display', 'Traditional design'],
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'compact',
    name: 'Compact',
    subtitle: 'Minimal',
    icon: Smartphone,
    description: 'Streamlined design with essential information highlighted',
    features: ['Condensed layout', 'Quick scanning', 'Mobile optimized'],
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'advanced',
    name: 'Advanced',
    subtitle: 'Premium',
    icon: Zap,
    description: 'Enhanced visual design with premium styling and animations',
    features: ['Premium styling', 'Rich animations', 'Enhanced visuals'],
    color: 'from-purple-500 to-purple-600'
  }
]

export default function MobileProfileSettingsModal({
  isOpen,
  onClose,
  currentVariant = 'default',
  onVariantChange
}: MobileProfileSettingsModalProps) {
  const { isDark } = useTheme()
  const [selectedVariant, setSelectedVariant] = useState<ProfileVariant>(currentVariant)

  const handleVariantSelect = (variantId: ProfileVariant) => {
    setSelectedVariant(variantId)
  }

  const handleApplyChanges = () => {
    if (onVariantChange && selectedVariant !== currentVariant) {
      onVariantChange(selectedVariant)
    }
    onClose()
  }

  const hasChanges = selectedVariant !== currentVariant

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative w-full max-w-sm mx-4 my-4 rounded-2xl shadow-2xl max-h-[85vh] overflow-hidden ${
        isDark 
          ? 'bg-[#1a1a1a] border border-[#333]' 
          : 'bg-white border border-gray-200'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#10a37f]/20">
              <Monitor className="w-5 h-5 text-[#10a37f]" />
            </div>
            <div>
              <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Profile Settings
              </h2>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Choose your profile style
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDark 
                ? 'hover:bg-[#333] text-gray-400 hover:text-white' 
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(85vh-200px)]">
          {/* Variants */}
          <div className="space-y-4">
            <h3 className={`text-base font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Profile Variants
            </h3>
            <div className="space-y-3">
              {variants.map((variant) => {
                const Icon = variant.icon
                const isSelected = selectedVariant === variant.id
                const isCurrent = currentVariant === variant.id
                
                return (
                                     <button
                     key={variant.id}
                     onClick={() => handleVariantSelect(variant.id as ProfileVariant)}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                      isSelected
                        ? 'border-[#10a37f] bg-[#10a37f]/10'
                        : isCurrent
                        ? 'border-[#10a37f]/50 bg-[#10a37f]/5'
                        : isDark
                        ? 'border-[#333] bg-[#2a2a2a] hover:border-[#444]'
                        : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        isSelected 
                          ? 'bg-[#10a37f] text-white' 
                          : isDark 
                          ? 'bg-[#333] text-gray-400' 
                          : 'bg-white text-gray-500'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {variant.name}
                          </h4>
                          {isCurrent && (
                            <span className="px-2 py-1 text-xs bg-[#10a37f] text-white rounded-full">
                              Current
                            </span>
                          )}
                          {isSelected && !isCurrent && (
                            <Check className="w-4 h-4 text-[#10a37f]" />
                          )}
                        </div>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {variant.subtitle}
                        </p>
                        <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                          {variant.description}
                        </p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Coming Soon Features */}
          <div className="space-y-4">
            <h3 className={`text-base font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Coming Soon
            </h3>
            <div className="space-y-3">
              <div className={`p-4 rounded-xl border-2 ${
                isDark 
                  ? 'border-[#333] bg-[#2a2a2a]' 
                  : 'border-gray-200 bg-gray-50'
              } opacity-60`}>
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    isDark ? 'bg-[#333] text-gray-500' : 'bg-white text-gray-400'
                  }`}>
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      AI Customization
                    </h4>
                    <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      Coming Soon
                    </p>
                  </div>
                </div>
              </div>
              <div className={`p-4 rounded-xl border-2 ${
                isDark 
                  ? 'border-[#333] bg-[#2a2a2a]' 
                  : 'border-gray-200 bg-gray-50'
              } opacity-60`}>
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    isDark ? 'bg-[#333] text-gray-500' : 'bg-white text-gray-400'
                  }`}>
                    <Star className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Premium Themes
                    </h4>
                    <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      Coming Soon
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200/10">
          <Button
            variant="outline"
            onClick={onClose}
            className={`${
              isDark 
                ? 'border-[#333] text-gray-300 hover:bg-[#333]' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Cancel
          </Button>
          <Button
            onClick={handleApplyChanges}
            disabled={!hasChanges}
            className={`${
              hasChanges
                ? 'bg-[#10a37f] hover:bg-[#0d8f6f] text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Apply Changes
          </Button>
        </div>
      </div>
    </div>
  )
}

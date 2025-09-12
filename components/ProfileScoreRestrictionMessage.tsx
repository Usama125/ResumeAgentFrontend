import React from 'react'
import { User as UserType } from '@/types'
import { validateProfileScore } from '@/utils/profileScoreValidation'
import { Lock, TrendingUp, ArrowRight } from 'lucide-react'

interface ProfileScoreRestrictionMessageProps {
  user: UserType
  featureName: string
  className?: string
  variant?: 'default' | 'compact' | 'inline'
  showIcon?: boolean
  isDark?: boolean
}

/**
 * Consistent UI component for showing profile score restriction messages
 * Used across all components that require minimum profile score validation
 */
export default function ProfileScoreRestrictionMessage({
  user,
  featureName,
  className = "",
  variant = 'default',
  showIcon = true,
  isDark = false
}: ProfileScoreRestrictionMessageProps) {
  const validation = validateProfileScore(user)
  const { message, score } = validation

  if (validation.isValid) {
    return null // Don't show anything if user meets requirements
  }

  const baseClasses = isDark 
    ? 'bg-gradient-to-r from-amber-900/20 to-orange-900/20 border border-amber-500/30 text-amber-100' 
    : 'bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-800'

  const iconClasses = isDark ? 'text-amber-400' : 'text-amber-600'

  if (variant === 'compact') {
    return (
      <div className={`rounded-lg p-3 ${baseClasses} ${className}`}>
        <div className="flex items-center gap-2">
          {showIcon && <Lock className={`w-4 h-4 ${iconClasses} shrink-0`} />}
          <p className="text-sm font-medium">
            Complete your profile to access {featureName}
          </p>
        </div>
        <p className="text-xs mt-1 opacity-90">
          {message}
        </p>
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs ${baseClasses} ${className}`}>
        {showIcon && <Lock className={`w-3 h-3 ${iconClasses}`} />}
        <span className="font-medium">Profile {score}% - Complete to unlock</span>
      </div>
    )
  }

  // Default variant
  return (
    <div className={`rounded-xl p-4 ${baseClasses} ${className}`}>
      <div className="flex items-start gap-3">
        {showIcon && (
          <div className={`p-2 rounded-lg ${isDark ? 'bg-amber-500/20' : 'bg-amber-100'}`}>
            <Lock className={`w-5 h-5 ${iconClasses}`} />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className={`font-semibold ${isDark ? 'text-amber-100' : 'text-amber-900'}`}>
              Profile Completion Required
            </h3>
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-amber-500/20 text-amber-200' : 'bg-amber-200 text-amber-800'}`}>
              <TrendingUp className="w-3 h-3" />
              {score}%
            </div>
          </div>
          
          <p className={`text-sm mb-3 ${isDark ? 'text-amber-200' : 'text-amber-700'}`}>
            To access <strong>{featureName}</strong>, you need to complete your profile to at least 50%.
          </p>
          
          <p className={`text-sm mb-4 ${isDark ? 'text-amber-200/80' : 'text-amber-600'}`}>
            {message}
          </p>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.location.href = '/profile?edit=true'}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isDark 
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg hover:shadow-xl' 
                  : 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              <span>Complete Profile</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <div className={`text-xs ${isDark ? 'text-amber-300' : 'text-amber-600'}`}>
              Need {50 - score}% more
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Hook for easy profile score validation in components
 */
export const useProfileScoreValidation = (user: UserType) => {
  return validateProfileScore(user)
}

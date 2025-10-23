"use client"

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Sparkles, TrendingUp, TrendingDown, X, CheckCircle, AlertCircle, Star, Briefcase, Target, Users, Award, Clock } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'
import { UserService } from '@/services/user'
import { useRateLimit } from '@/hooks/useRateLimit'
import { RateLimitModal } from '@/components/RateLimitModal'
import { APIError } from '@/types'
import { profileUpdateManager } from '@/lib/profile-update-manager'

interface ProfessionalAnalysisData {
  professional_assessment: string
  key_strengths: string[]
  areas_for_improvement: string[]
  professional_fit_score: number
  fit_score_reasoning: string
  hiring_recommendation: string
  recommendation_reasoning: string
}

interface ProfessionalAnalysisModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  userName: string
  userDesignation?: string
}

const getThemeClasses = (isDark: boolean) => ({
  background: isDark ? 'bg-[#2a2a2a]/95' : 'bg-white/95',
  text: {
    primary: isDark ? 'text-white' : 'text-gray-900',
    secondary: isDark ? 'text-gray-300' : 'text-gray-600',
    muted: isDark ? 'text-gray-400' : 'text-gray-500'
  },
  border: isDark ? 'border-[#565869]/60' : 'border-gray-300/60',
  card: isDark ? 'bg-[#2f2f2f]/80' : 'bg-white/80',
  hover: isDark ? 'hover:bg-[#2f2f2f]' : 'hover:bg-white'
})

const getRecommendationColor = (recommendation: string, isDark: boolean) => {
  switch (recommendation.toLowerCase()) {
    case 'strong yes':
      return isDark 
        ? 'text-green-400 bg-green-900/30 border-green-500/50' 
        : 'text-green-700 bg-green-100 border-green-300'
    case 'yes':
      return isDark 
        ? 'text-green-400 bg-green-900/20 border-green-500/40' 
        : 'text-green-600 bg-green-50 border-green-200'
    case 'maybe':
      return isDark 
        ? 'text-yellow-400 bg-yellow-900/30 border-yellow-500/50' 
        : 'text-yellow-700 bg-yellow-100 border-yellow-300'
    case 'no':
      return isDark 
        ? 'text-red-400 bg-red-900/30 border-red-500/50' 
        : 'text-red-700 bg-red-100 border-red-300'
    default:
      return isDark 
        ? 'text-gray-400 bg-gray-900/30 border-gray-500/50' 
        : 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

const getScoreColor = (score: number, isDark: boolean) => {
  if (score >= 8) {
    return isDark ? 'text-green-600' : 'text-green-700'
  }
  if (score >= 6) {
    return isDark ? 'text-yellow-600' : 'text-yellow-700'
  }
  return isDark ? 'text-red-600' : 'text-red-700'
}

const getScoreLabel = (score: number) => {
  if (score >= 8) return 'Excellent Fit'
  if (score >= 6) return 'Good Fit'
  if (score >= 4) return 'Moderate Fit'
  return 'Poor Fit'
}

const getScoreBadgeClasses = (score: number, isDark: boolean) => {
  if (score >= 8) {
    return isDark 
      ? 'text-green-400 bg-green-900/30 border-green-500/50' 
      : 'text-green-700 bg-green-100 border-green-300'
  }
  if (score >= 6) {
    return isDark 
      ? 'text-yellow-400 bg-yellow-900/30 border-yellow-500/50' 
      : 'text-yellow-700 bg-yellow-100 border-yellow-300'
  }
  return isDark 
    ? 'text-red-400 bg-red-900/30 border-red-500/50' 
    : 'text-red-700 bg-red-100 border-red-300'
}

export default function ProfessionalAnalysisModal({
  isOpen,
  onClose,
  userId,
  userName,
  userDesignation
}: ProfessionalAnalysisModalProps) {
  const { isDark } = useTheme()
  const { user: currentUser } = useAuth()
  const { showRateLimitModal, hideRateLimitModal, rateLimitState } = useRateLimit()
  
  const [analysisData, setAnalysisData] = useState<ProfessionalAnalysisData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Listen for profile updates to ensure professional analysis shows fresh data
  useEffect(() => {
    const unsubscribe = profileUpdateManager.registerUpdateCallback((updatedUser) => {
      if (updatedUser && updatedUser.id === currentUser?.id) {
        // Clear analysis data to force refresh with new profile data
        setAnalysisData(null);
        setError(null);
      }
    });

    return unsubscribe;
  }, [currentUser?.id]);
  
  const themeClasses = getThemeClasses(isDark)

  useEffect(() => {
    if (isOpen && userId) {
      fetchProfessionalAnalysis()
    }
  }, [isOpen, userId])

  const fetchProfessionalAnalysis = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await UserService.getProfessionalAnalysis(`/users/${userId}/professional-analysis`)
      setAnalysisData(response)
    } catch (err: any) {
      console.error('Error fetching professional analysis:', err)
      
      // Check if it's a rate limit error
      if (err && typeof err === 'object' && 'type' in err && err.type === 'RATE_LIMIT') {
        showRateLimitModal(err as APIError)
      } else {
        setError(err?.message || 'Failed to load professional analysis')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose} modal={true}>
        <DialogContent 
          className={`max-w-4xl relative overflow-hidden ${themeClasses.text.primary} h-[85vh] p-0 flex flex-col border-0 [&>button[data-radix-collection-item]]:hidden [&>button]:!hidden`}
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 50
          }}
        >
          {/* Inline style to hide default close button */}
          <style dangerouslySetInnerHTML={{
            __html: `
              [data-radix-dialog-content] > button[aria-label="Close"],
              [data-radix-dialog-content] > button:first-child,
              .dialog-close-button {
                display: none !important;
              }
            `
          }} />
          {/* Background gradients - exactly like EditProfileModal */}
          <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-[#1a1a1a] via-[#212121] to-[#1a1a1a]' : 'bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100'}`}></div>
          <div className="absolute inset-0 bg-gradient-to-br from-[#10a37f]/10 via-transparent to-[#10a37f]/5"></div>
          
          {/* Decorative floating elements - exactly like EditProfileModal */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-[#10a37f]/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#10a37f]/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
          
          {/* Content wrapper - exactly like EditProfileModal */}
          <div className="relative z-10 flex flex-col h-full">
            {/* Header */}
            <div className={`flex items-center justify-between p-6 border-b ${themeClasses.border}`}>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full blur-sm opacity-60"></div>
                  <Briefcase className="relative w-6 h-6 text-[#10a37f]" />
                </div>
                <div>
                  <h2 className={`text-2xl font-bold ${themeClasses.text.primary}`}>
                    AI Fit Analysis
                  </h2>
                  <p className={`text-sm ${themeClasses.text.secondary}`}>
                    {userName}'s professional assessment for {userDesignation || 'their role'}
                  </p>
                </div>
              </div>
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className={`hover:bg-white/10 ${themeClasses.text.secondary}`}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className={`w-16 h-16 border-4 border-[#10a37f]/20 border-t-[#10a37f] rounded-full animate-spin mx-auto mb-4`}></div>
                    <p className={`text-lg ${themeClasses.text.secondary}`}>Analyzing professional fit...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <AlertCircle className={`w-16 h-16 ${themeClasses.text.muted} mx-auto mb-4`} />
                    <p className={`text-lg ${themeClasses.text.secondary}`}>{error}</p>
                    <Button onClick={fetchProfessionalAnalysis} className="mt-4">
                      Try Again
                    </Button>
                  </div>
                </div>
              ) : analysisData ? (
                <div className="space-y-6">
                  {/* Professional Assessment */}
                  <div className={`${themeClasses.card} backdrop-blur-sm rounded-xl p-6 border ${themeClasses.border}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <Target className="w-6 h-6 text-[#10a37f]" />
                      <h3 className={`text-xl font-semibold ${themeClasses.text.primary}`}>
                        Professional Assessment
                      </h3>
                    </div>
                    <p className={`text-base leading-relaxed ${themeClasses.text.secondary}`}>
                      {analysisData.professional_assessment}
                    </p>
                  </div>

                  {/* Professional Fit Score */}
                  <div className={`${themeClasses.card} backdrop-blur-sm rounded-xl p-6 border ${themeClasses.border}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Star className="w-6 h-6 text-[#10a37f]" />
                        <h3 className={`text-xl font-semibold ${themeClasses.text.primary}`}>
                          Professional Fit Score
                        </h3>
                      </div>
                      <Badge className={`${getScoreBadgeClasses(analysisData.professional_fit_score, isDark)}`}>
                        {getScoreLabel(analysisData.professional_fit_score)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`text-4xl font-bold ${getScoreColor(analysisData.professional_fit_score, isDark)}`}>
                        {analysisData.professional_fit_score}/10
                      </div>
                      <div className="flex-1">
                        <Progress 
                          value={analysisData.professional_fit_score * 10} 
                          className="h-3"
                        />
                      </div>
                    </div>
                    
                    <p className={`text-sm ${themeClasses.text.secondary}`}>
                      {analysisData.fit_score_reasoning}
                    </p>
                  </div>

                  {/* Hiring Recommendation */}
                  <div className={`${themeClasses.card} backdrop-blur-sm rounded-xl p-6 border ${themeClasses.border}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <Users className="w-6 h-6 text-[#10a37f]" />
                      <h3 className={`text-xl font-semibold ${themeClasses.text.primary}`}>
                        Hiring Recommendation
                      </h3>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <Badge className={`text-lg px-4 py-2 border-2 ${getRecommendationColor(analysisData.hiring_recommendation, isDark)}`}>
                        {analysisData.hiring_recommendation}
                      </Badge>
                    </div>
                    
                    <p className={`text-sm ${themeClasses.text.secondary}`}>
                      {analysisData.recommendation_reasoning}
                    </p>
                  </div>

                  {/* Key Strengths */}
                  {analysisData.key_strengths.length > 0 && (
                    <div className={`${themeClasses.card} backdrop-blur-sm rounded-xl p-6 border ${themeClasses.border}`}>
                      <div className="flex items-center gap-3 mb-4">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                        <h3 className={`text-xl font-semibold ${themeClasses.text.primary}`}>
                          Key Strengths
                        </h3>
                      </div>
                      <div className="space-y-3">
                        {analysisData.key_strengths.map((strength, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <p className={`${themeClasses.text.secondary}`}>{strength}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Areas for Improvement */}
                  {analysisData.areas_for_improvement.length > 0 && (
                    <div className={`${themeClasses.card} backdrop-blur-sm rounded-xl p-6 border ${themeClasses.border}`}>
                      <div className="flex items-center gap-3 mb-4">
                        <TrendingDown className="w-6 h-6 text-red-600" />
                        <h3 className={`text-xl font-semibold ${themeClasses.text.primary}`}>
                          Areas for Improvement
                        </h3>
                      </div>
                      <div className="space-y-3">
                        {analysisData.areas_for_improvement.map((area, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                            <p className={`${themeClasses.text.secondary}`}>{area}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {/* Footer */}
            <div className={`flex justify-end gap-3 p-6 border-t ${themeClasses.border}`}>
              <Button
                onClick={onClose}
                variant="outline"
                className={`${themeClasses.border} ${themeClasses.text.primary}`}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <RateLimitModal
        isOpen={rateLimitState.isOpen}
        onClose={hideRateLimitModal}
        message={rateLimitState.message}
        resetInSeconds={rateLimitState.resetInSeconds}
        isAuthenticated={rateLimitState.isAuthenticated}
        rateLimitType={rateLimitState.rateLimitType}
      />
    </>
  )
}

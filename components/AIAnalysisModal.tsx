"use client"

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Sparkles, TrendingUp, TrendingDown, X, CheckCircle, AlertCircle, Star, Award, BookOpen, Briefcase, GraduationCap, Code, Globe, Heart } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'
import { UserService } from '@/services/user'
import { AuthService } from '@/services/auth'
import { useRateLimit } from '@/hooks/useRateLimit'
import { RateLimitModal } from '@/components/RateLimitModal'
import { APIError } from '@/types'

interface AIAnalysisData {
  // New OpenAI format for /profile
  profile_score?: number
  overall_assessment?: string
  recommendations?: string[]
  
  // Legacy format for backwards compatibility
  score?: number
  strengths: string[]
  weaknesses?: string[]
  areas_for_improvement?: string[]
  
  // Professional analysis format
  professional_assessment?: string
  key_strengths?: string[]
  professional_fit_score?: number
  hiring_recommendation?: string
  
  // Section scores (legacy)
  section_scores?: {
    basic_info: number
    contact_info: number
    skills: number
    experience: number
    education: number
    projects: number
    certifications: number
    languages: number
    additional_sections: number
  }
}

// Section weights from the backend scoring system
const SECTION_WEIGHTS = {
  basic_info: 15,
  contact_info: 10,
  skills: 12,
  experience: 20,
  education: 12,
  projects: 15,
  certifications: 6,
  languages: 5,
  additional_sections: 5
}

interface AIAnalysisModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  userName: string
  isOwnProfile?: boolean
  onImproveProfile?: () => void
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

const getSectionIcon = (section: string) => {
  const icons = {
    basic_info: Star,
    contact_info: Globe,
    skills: Code,
    experience: Briefcase,
    education: GraduationCap,
    projects: Award,
    certifications: BookOpen,
    languages: Globe,
    additional_sections: Heart
  }
  return icons[section as keyof typeof icons] || Star
}

const getSectionName = (section: string) => {
  const names = {
    basic_info: 'Basic Information',
    contact_info: 'Contact Information',
    skills: 'Skills',
    experience: 'Experience',
    education: 'Education',
    projects: 'Projects',
    certifications: 'Certifications',
    languages: 'Languages',
    additional_sections: 'Additional Sections'
  }
  return names[section as keyof typeof names] || section
}

export default function AIAnalysisModal({
  isOpen,
  onClose,
  userId,
  userName,
  isOwnProfile = false,
  onImproveProfile
}: AIAnalysisModalProps) {
  const { isDark } = useTheme()
  const { user: currentUser } = useAuth()
  const { showRateLimitModal, hideRateLimitModal, rateLimitState } = useRateLimit()
  
  const [analysisData, setAnalysisData] = useState<AIAnalysisData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const themeClasses = getThemeClasses(isDark)

  useEffect(() => {
    if (isOpen && userId) {
      fetchAnalysis()
    }
  }, [isOpen, userId])

  const fetchAnalysis = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Determine the endpoint based on whether it's own profile or another user's
      const endpoint = isOwnProfile ? '/users/me/ai-analysis' : `/users/${userId}/ai-analysis`
      
      // Get authentication token for own profile analysis
      const token = isOwnProfile ? AuthService.getToken() : undefined
      
      const response = await UserService.getAIAnalysis(endpoint, token)
      setAnalysisData(response)
    } catch (err: any) {
      console.error('Error fetching AI analysis:', err)
      
      // Check if it's a rate limit error
      if (err && typeof err === 'object' && 'type' in err && err.type === 'RATE_LIMIT') {
        showRateLimitModal(err as APIError)
      } else {
        setError(err?.message || 'Failed to load AI analysis')
      }
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Needs Improvement'
  }

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
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
                  <Sparkles className="relative w-6 h-6 text-[#10a37f]" />
                </div>
                <div>
                  <h2 className={`text-2xl font-bold ${themeClasses.text.primary}`}>
                    AI Profile Analysis
                  </h2>
                  <p className={`text-sm ${themeClasses.text.secondary}`}>
                    {isOwnProfile ? 'Your profile analysis' : `${userName}'s profile analysis`}
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
                    <p className={`text-lg ${themeClasses.text.secondary}`}>Analyzing profile...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <AlertCircle className={`w-16 h-16 ${themeClasses.text.muted} mx-auto mb-4`} />
                    <p className={`text-lg ${themeClasses.text.secondary}`}>{error}</p>
                    <Button onClick={fetchAnalysis} className="mt-4">
                      Try Again
                    </Button>
                  </div>
                </div>
              ) : analysisData ? (
                <div className="space-y-6">
                  {/* Overall Assessment - New OpenAI format */}
                  {analysisData.overall_assessment && (
                    <div className={`${themeClasses.card} backdrop-blur-sm rounded-xl p-6 border ${themeClasses.border}`}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full blur-sm opacity-60"></div>
                          <Sparkles className="relative w-6 h-6 text-[#10a37f]" />
                        </div>
                        <h3 className={`text-xl font-semibold ${themeClasses.text.primary}`}>
                          AI Profile Assessment
                        </h3>
                      </div>
                      <p className={`text-base leading-relaxed ${themeClasses.text.primary} mb-4`}>
                        {analysisData.overall_assessment}
                      </p>
                      {(analysisData.profile_score || analysisData.score) && (
                        <div className="flex items-center gap-4">
                          <div className="text-3xl font-bold text-[#10a37f]">
                            {analysisData.profile_score || analysisData.score}/100
                          </div>
                          <div className="flex-1">
                            <Progress 
                              value={analysisData.profile_score || analysisData.score || 0} 
                              className="h-3"
                            />
                          </div>
                          <Badge className={`${getScoreColor(analysisData.profile_score || analysisData.score || 0)} bg-opacity-10 border ${getScoreColor(analysisData.profile_score || analysisData.score || 0)}`}>
                            {getScoreLabel(analysisData.profile_score || analysisData.score || 0)}
                          </Badge>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Legacy Overall Score - for backward compatibility */}
                  {!analysisData.overall_assessment && (analysisData.score || analysisData.professional_fit_score) && (
                    <div className={`${themeClasses.card} backdrop-blur-sm rounded-xl p-6 border ${themeClasses.border}`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-xl font-semibold ${themeClasses.text.primary}`}>
                          Overall Profile Score
                        </h3>
                        <Badge className={`${getScoreColor(analysisData.score || analysisData.professional_fit_score || 0)} bg-opacity-10 border ${getScoreColor(analysisData.score || analysisData.professional_fit_score || 0)}`}>
                          {getScoreLabel(analysisData.score || analysisData.professional_fit_score || 0)}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 mb-4">
                        <div className="text-4xl font-bold text-[#10a37f]">
                          {analysisData.score || analysisData.professional_fit_score}/100
                        </div>
                        <div className="flex-1">
                          <Progress 
                            value={analysisData.score || analysisData.professional_fit_score || 0} 
                            className="h-3"
                          />
                        </div>
                      </div>
                      
                      <p className={`text-sm ${themeClasses.text.secondary}`}>
                        {isOwnProfile 
                          ? "This score reflects how complete and compelling your profile is to potential employers."
                          : "This score reflects how complete and compelling this profile is to potential employers."
                        }
                      </p>
                    </div>
                  )}

                                           {/* Section Scores */}
                         <div className={`${themeClasses.card} backdrop-blur-sm rounded-xl p-6 border ${themeClasses.border}`}>
                           <h3 className={`text-xl font-semibold mb-4 ${themeClasses.text.primary}`}>
                             Section Breakdown
                           </h3>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             {Object.entries(analysisData.section_scores).map(([section, score]) => {
                               const Icon = getSectionIcon(section)
                               const sectionName = getSectionName(section)
                               const maxScore = SECTION_WEIGHTS[section as keyof typeof SECTION_WEIGHTS] || 0
                               const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0
                               
                               return (
                                 <div key={section} className={`p-4 rounded-lg border ${themeClasses.border} ${themeClasses.hover} transition-colors`}>
                                   <div className="flex items-center gap-3 mb-3">
                                     <Icon className={`w-5 h-5 ${getScoreColor(percentage)}`} />
                                     <span className={`font-medium ${themeClasses.text.primary}`}>
                                       {sectionName}
                                     </span>
                                   </div>
                                   <div className="flex items-center gap-3 mb-2">
                                     <span className={`text-2xl font-bold ${getScoreColor(percentage)}`}>
                                       {Math.round(percentage)}%
                                     </span>
                                     <div className="flex-1">
                                       <Progress 
                                         value={percentage} 
                                         className="h-2"
                                       />
                                     </div>
                                   </div>
                                   <p className={`text-xs ${themeClasses.text.muted}`}>
                                     {score.toFixed(1)}/{maxScore} points
                                   </p>
                                 </div>
                               )
                             })}
                           </div>
                         </div>

                  {/* Recommendations - New OpenAI format */}
                  {analysisData.recommendations && analysisData.recommendations.length > 0 && (
                    <div className={`${themeClasses.card} backdrop-blur-sm rounded-xl p-6 border ${themeClasses.border}`}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-sm opacity-60"></div>
                          <BookOpen className="relative w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className={`text-xl font-semibold ${themeClasses.text.primary}`}>
                          Recommended Actions
                        </h3>
                      </div>
                      <div className="space-y-4">
                        {analysisData.recommendations.map((recommendation, index) => (
                          <div key={index} className={`p-4 rounded-lg ${isDark ? 'bg-blue-500/10' : 'bg-blue-50'} border ${isDark ? 'border-blue-500/20' : 'border-blue-200'}`}>
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                {index + 1}
                              </div>
                              <p className={`${themeClasses.text.primary} font-medium`}>{recommendation}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Strengths */}
                  {(analysisData.strengths || analysisData.key_strengths) && (analysisData.strengths?.length > 0 || analysisData.key_strengths?.length > 0) && (
                    <div className={`${themeClasses.card} backdrop-blur-sm rounded-xl p-6 border ${themeClasses.border}`}>
                      <div className="flex items-center gap-3 mb-4">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                        <h3 className={`text-xl font-semibold ${themeClasses.text.primary}`}>
                          Key Strengths
                        </h3>
                      </div>
                      <div className="space-y-3">
                        {(analysisData.strengths || analysisData.key_strengths || []).map((strength, index) => (
                          <div key={index} className={`p-3 rounded-lg ${isDark ? 'bg-green-500/10' : 'bg-green-50'} border ${isDark ? 'border-green-500/20' : 'border-green-200'}`}>
                            <div className="flex items-start gap-3">
                              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <p className={`${themeClasses.text.primary}`}>{strength}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Weaknesses / Areas for Improvement */}
                  {(analysisData.weaknesses || analysisData.areas_for_improvement) && ((analysisData.weaknesses?.length || 0) > 0 || (analysisData.areas_for_improvement?.length || 0) > 0) && (
                    <div className={`${themeClasses.card} backdrop-blur-sm rounded-xl p-6 border ${themeClasses.border}`}>
                      <div className="flex items-center gap-3 mb-4">
                        <TrendingDown className="w-6 h-6 text-orange-600" />
                        <h3 className={`text-xl font-semibold ${themeClasses.text.primary}`}>
                          Areas for Improvement
                        </h3>
                      </div>
                      <div className="space-y-3">
                        {(analysisData.weaknesses || analysisData.areas_for_improvement || []).map((weakness, index) => (
                          <div key={index} className={`p-3 rounded-lg ${isDark ? 'bg-orange-500/10' : 'bg-orange-50'} border ${isDark ? 'border-orange-500/20' : 'border-orange-200'}`}>
                            <div className="flex items-start gap-3">
                              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                              <p className={`${themeClasses.text.primary}`}>{weakness}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Professional Assessment - for public profiles */}
                  {analysisData.professional_assessment && (
                    <div className={`${themeClasses.card} backdrop-blur-sm rounded-xl p-6 border ${themeClasses.border}`}>
                      <div className="flex items-center gap-3 mb-4">
                        <Briefcase className="w-6 h-6 text-purple-600" />
                        <h3 className={`text-xl font-semibold ${themeClasses.text.primary}`}>
                          Professional Assessment
                        </h3>
                      </div>
                      <p className={`text-base leading-relaxed ${themeClasses.text.primary} mb-4`}>
                        {analysisData.professional_assessment}
                      </p>
                      {analysisData.hiring_recommendation && (
                        <div className={`p-4 rounded-lg ${isDark ? 'bg-purple-500/10' : 'bg-purple-50'} border ${isDark ? 'border-purple-500/20' : 'border-purple-200'}`}>
                          <p className={`font-semibold ${themeClasses.text.primary} mb-1`}>Hiring Recommendation:</p>
                          <p className={`${themeClasses.text.secondary}`}>{analysisData.hiring_recommendation}</p>
                        </div>
                      )}
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
              {isOwnProfile && onImproveProfile && (
                <Button
                  onClick={() => {
                    onClose()
                    onImproveProfile()
                  }}
                  className="bg-[#10a37f] hover:bg-[#0d8f6f] text-white"
                >
                  Improve Profile
                </Button>
              )}
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

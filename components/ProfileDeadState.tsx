import React from 'react'
import { User as UserType } from '@/types'
import { validateProfileScore } from '@/utils/profileScoreValidation'
import { 
  Lock, 
  User, 
  MessageCircle, 
  FileText, 
  Sparkles, 
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Users,
  Briefcase,
  Mail
} from 'lucide-react'
import { GradientAvatar } from '@/components/ui/avatar'

interface ProfileDeadStateProps {
  user: UserType
  isDark?: boolean
  variant?: 'desktop' | 'mobile'
}

/**
 * Beautiful dead state component for public profiles when profile score < 50%
 * Shows a professional message indicating the profile is incomplete
 */
export default function ProfileDeadState({
  user,
  isDark = false,
  variant = 'desktop'
}: ProfileDeadStateProps) {
  const validation = validateProfileScore(user)
  const { score } = validation

  const containerClasses = variant === 'desktop' 
    ? 'min-h-[calc(100vh-56px)] flex items-center justify-center p-8'
    : 'min-h-[calc(100vh-56px)] flex items-center justify-center p-6'

  const cardClasses = variant === 'desktop'
    ? `max-w-2xl w-full rounded-3xl p-12 text-center ${
        isDark 
          ? 'bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border border-gray-700/50' 
          : 'bg-white border border-gray-200 shadow-2xl'
      }`
    : `max-w-md w-full rounded-2xl p-8 text-center ${
        isDark 
          ? 'bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border border-gray-700/50' 
          : 'bg-white border border-gray-200 shadow-2xl'
      }`

  return (
    <div className={`${containerClasses} ${isDark ? 'bg-[#212121]' : 'bg-gray-50'}`}>
      <div className={cardClasses}>
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#10a37f]/5 via-transparent to-[#10a37f]/10 rounded-3xl"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#10a37f]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#10a37f]/5 rounded-full blur-2xl"></div>
        
        <div className="relative z-10">
          {/* Profile Avatar */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full blur-lg opacity-30"></div>
              <GradientAvatar
                user={user}
                size={variant === 'desktop' ? 120 : 100}
                className="relative border-4 border-white/20 shadow-2xl"
              />
            </div>
          </div>

          {/* Profile Info */}
          <div className="mb-8">
            <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {user.name}
            </h1>
            {user.profession && (
              <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {user.profession}
              </p>
            )}
            {user.location && (
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                📍 {user.location}
              </p>
            )}
          </div>

          {/* Dead State Message */}
          <div className={`rounded-2xl p-8 mb-8 ${
            isDark 
              ? 'bg-gradient-to-r from-amber-900/20 to-orange-900/20 border border-amber-500/30' 
              : 'bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200'
          }`}>
            <div className="flex justify-center mb-4">
              <div className={`p-3 rounded-full ${
                isDark ? 'bg-amber-500/20' : 'bg-amber-100'
              }`}>
                <Lock className={`w-8 h-8 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
              </div>
            </div>
            
            <h2 className={`text-xl font-bold mb-3 ${
              isDark ? 'text-amber-100' : 'text-amber-900'
            }`}>
              Profile Under Construction
            </h2>
            
            <p className={`text-base mb-4 ${
              isDark ? 'text-amber-200' : 'text-amber-700'
            }`}>
              This profile is currently {score}% complete. {user.name} is still working on building their professional profile.
            </p>

            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              isDark ? 'bg-amber-500/20 text-amber-200' : 'bg-amber-200 text-amber-800'
            }`}>
              <TrendingUp className="w-4 h-4" />
              {score}% Complete
            </div>
          </div>

          {/* Features Preview */}
          <div className="mb-8">
            <h3 className={`text-lg font-semibold mb-4 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Coming Soon
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className={`flex items-center gap-3 p-4 rounded-xl ${
                isDark ? 'bg-gray-800/50' : 'bg-gray-100/50'
              }`}>
                <div className={`p-2 rounded-lg ${
                  isDark ? 'bg-[#10a37f]/20' : 'bg-[#10a37f]/10'
                }`}>
                  <MessageCircle className={`w-5 h-5 ${isDark ? 'text-[#10a37f]' : 'text-[#10a37f]'}`} />
                </div>
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    AI Chat
                  </p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Interactive Q&A
                  </p>
                </div>
              </div>

              <div className={`flex items-center gap-3 p-4 rounded-xl ${
                isDark ? 'bg-gray-800/50' : 'bg-gray-100/50'
              }`}>
                <div className={`p-2 rounded-lg ${
                  isDark ? 'bg-[#10a37f]/20' : 'bg-[#10a37f]/10'
                }`}>
                  <FileText className={`w-5 h-5 ${isDark ? 'text-[#10a37f]' : 'text-[#10a37f]'}`} />
                </div>
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    AI Writer
                  </p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Cover Letters
                  </p>
                </div>
              </div>

              <div className={`flex items-center gap-3 p-4 rounded-xl ${
                isDark ? 'bg-gray-800/50' : 'bg-gray-100/50'
              }`}>
                <div className={`p-2 rounded-lg ${
                  isDark ? 'bg-[#10a37f]/20' : 'bg-[#10a37f]/10'
                }`}>
                  <Sparkles className={`w-5 h-5 ${isDark ? 'text-[#10a37f]' : 'text-[#10a37f]'}`} />
                </div>
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    AI Analysis
                  </p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Profile Insights
                  </p>
                </div>
              </div>

              <div className={`flex items-center gap-3 p-4 rounded-xl ${
                isDark ? 'bg-gray-800/50' : 'bg-gray-100/50'
              }`}>
                <div className={`p-2 rounded-lg ${
                  isDark ? 'bg-[#10a37f]/20' : 'bg-[#10a37f]/10'
                }`}>
                  <Briefcase className={`w-5 h-5 ${isDark ? 'text-[#10a37f]' : 'text-[#10a37f]'}`} />
                </div>
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Full Profile
                  </p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Complete Details
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information (if available) */}
          {(user.contact_info?.linkedin || user.contact_info?.email) && (
            <div className={`rounded-xl p-6 mb-8 ${
              isDark ? 'bg-gray-800/30' : 'bg-gray-100/50'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Get in Touch
              </h3>
              
              <div className="flex flex-wrap gap-3 justify-center">
                {user.contact_info?.linkedin && (
                  <a
                    href={formatLinkedInUrl(user.contact_info.linkedin)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      isDark 
                        ? 'bg-blue-600/20 text-blue-300 hover:bg-blue-600/30' 
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <span className="text-sm font-medium">LinkedIn</span>
                  </a>
                )}
                
                {user.contact_info?.email && (
                  <a
                    href={`mailto:${user.contact_info.email}`}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      isDark 
                        ? 'bg-green-600/20 text-green-300 hover:bg-green-600/30' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    <Mail className="w-4 h-4" />
                    <span className="text-sm font-medium">Email</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Footer Message */}
          <div className={`text-center ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <p className="text-sm">
              This profile will be fully accessible once it reaches 50% completion.
            </p>
            <p className="text-xs mt-1">
              Check back soon to see {user.name}'s complete professional profile!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to format LinkedIn URL
function formatLinkedInUrl(url: string): string {
  if (!url) return ''
  if (url.startsWith('http')) return url
  if (url.startsWith('linkedin.com')) return `https://${url}`
  if (url.startsWith('/')) return `https://linkedin.com${url}`
  return `https://linkedin.com/in/${url}`
}

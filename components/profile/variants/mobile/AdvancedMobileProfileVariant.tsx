"use client"

import React, { memo, useState } from 'react'
import {
  MapPin,
  Briefcase,
  Award,
  Calendar,
  Star,
  Edit3,
  Camera,
  Sparkles,
  Globe,
  Users,
  TrendingUp,
  Zap,
  Crown,
  Shield,
  Target,
  Trophy,
  Rocket,
  Mail,
  Phone,
  Settings,
  Share2,
  FileText
} from "lucide-react"
import { User as UserType } from "@/types"
import { useTheme } from "@/context/ThemeContext"
import { getThemeClasses } from "@/utils/theme"
import { getImageUrl } from '@/utils/imageUtils'
import { formatLinkedInUrl, isLocalProfileUrl } from '@/utils/contactUtils'
import { calculateTotalExperience } from "@/utils/experienceCalculator"
import VariantAwareProfileSections from "@/components/sections/variants/VariantAwareProfileSections"
import MobileProfileCompletionSection from "@/components/sections/MobileProfileCompletionSection"
import EditModeToggle from "@/components/EditModeToggle"
import { Button } from "@/components/ui/button"

interface AdvancedMobileProfileVariantProps {
  user: UserType
  isEditMode?: boolean
  isCurrentUser?: boolean
  onEditPhoto?: () => void
  onEditAbout?: () => void
  onEditSkills?: () => void
  onEditExperience?: () => void
  onEditSingleExperience?: (index: number) => void
  onDeleteSingleExperience?: (index: number) => void
  onEditProject?: () => void
  onEditSingleProject?: (index: number) => void
  onDeleteSingleProject?: (index: number) => void
  onDeleteAbout?: () => void
  onDeleteSkills?: () => void
  onDeleteExperience?: () => void
  onDeleteProjects?: () => void
  onEditEducation?: () => void
  onEditSingleEducation?: (index: number) => void
  onDeleteSingleEducation?: (index: number) => void
  onDeleteEducation?: () => void
  onEditContact?: () => void
  onDeleteContact?: () => void
  onEditLanguage?: (index: number) => void
  onDeleteLanguage?: (index: number) => void
  onAddLanguage?: () => void
  onDeleteLanguages?: () => void
  onEditAward?: (index: number) => void
  onDeleteAward?: (index: number) => void
  onAddAward?: () => void
  onDeleteAwards?: () => void
  onEditPublication?: (index: number) => void
  onDeletePublication?: (index: number) => void
  onAddPublication?: () => void
  onDeletePublications?: () => void
  onEditVolunteerExperience?: (index: number) => void
  onDeleteVolunteerExperience?: (index: number) => void
  onAddVolunteerExperience?: () => void
  onDeleteVolunteerExperiences?: () => void
  onEditInterests?: () => void
  onDeleteInterests?: () => void
  onAddInterests?: () => void
  onEditPreferences?: () => void
  onSectionOrderChange?: (sections: any[]) => void
  onAddSection?: (sectionId: string) => void
  onOpenAIAnalysis?: () => void
  onOpenSettings?: () => void
  onEditModeToggle?: (editMode: boolean) => void
  onOpenShare?: () => void
}

const AdvancedMobileProfileVariant = memo(function AdvancedMobileProfileVariant({
  user,
  isEditMode = false,
  isCurrentUser = false,
  onEditPhoto,
  onOpenAIAnalysis,
  onOpenSettings,
  onEditModeToggle,
  onOpenShare,
  ...otherProps
}: AdvancedMobileProfileVariantProps) {
  const { isDark } = useTheme()
  const theme = getThemeClasses(isDark)
  const [isHovered, setIsHovered] = useState(false)

  const totalExperience = calculateTotalExperience(user.experience_details || [])

  return (
    <div className={`${isDark ? 'bg-[#212121]' : 'bg-gray-50'} min-h-screen`}>
      {/* Enhanced Mobile Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#10a37f]/8 via-[#10a37f]/3 to-[#10a37f]/6"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#10a37f]/15 to-[#0d8f6f]/10 rounded-full blur-3xl animate-pulse opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#0d8f6f]/10 to-[#10a37f]/12 rounded-full blur-2xl animate-pulse delay-1000 opacity-60"></div>
      </div>

      {/* Premium Mobile Header with Edit Toggle, Settings, and Share */}
      {isCurrentUser && (onEditModeToggle || onOpenSettings || onOpenShare) && (
        <div className="sticky top-0 z-50 bg-gradient-to-b from-[#212121]/95 via-[#212121]/80 to-transparent backdrop-blur-md border-b border-gray-700/20 py-4 px-4 shadow-lg">
          <div className="flex justify-center gap-2">
            {onEditModeToggle && (
              <EditModeToggle
                isEditMode={isEditMode}
                onToggle={onEditModeToggle}
                className="scale-90"
              />
            )}
            {onOpenSettings && (
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <Button
                  onClick={onOpenSettings}
                  size="sm"
                  className={`relative flex items-center justify-center px-4 py-2 rounded-xl transition-all duration-300 backdrop-blur-sm border h-auto scale-90 ${
                    isDark 
                      ? 'bg-[#2f2f2f]/90 border-[#565869]/60 text-white hover:bg-[#40414f]/90 hover:border-[#10a37f]/40' 
                      : 'bg-white/90 border-gray-300 text-gray-900 hover:bg-gray-50 hover:border-[#10a37f]/40'
                  } shadow-lg hover:shadow-xl hover:scale-105`}
                  title="Profile Settings"
                >
                  <Settings className="w-4 h-4 text-[#10a37f]" />
                </Button>
              </div>
            )}
            {onOpenShare && (
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <Button
                  onClick={onOpenShare}
                  size="sm"
                  className={`relative flex items-center justify-center px-4 py-2 rounded-xl transition-all duration-300 backdrop-blur-sm border h-auto scale-90 ${
                    isDark 
                      ? 'bg-[#2f2f2f]/90 border-[#565869]/60 text-white hover:bg-[#40414f]/90 hover:border-[#10a37f]/40' 
                      : 'bg-white/90 border-gray-300 text-gray-900 hover:bg-gray-50 hover:border-[#10a37f]/40'
                  } shadow-lg hover:shadow-xl hover:scale-105`}
                  title="Share Profile"
                >
                  <Share2 className="w-4 h-4 text-[#10a37f]" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Advanced Profile Hero Card */}
      <div className="relative z-10 p-4">
        <div 
          className={`relative overflow-hidden rounded-3xl ${
            isDark 
              ? 'bg-gradient-to-br from-[#2a2a2a]/90 via-[#1a1a1a]/95 to-[#2a2a2a]/90 border-2 border-[#10a37f]/30' 
              : 'bg-gradient-to-br from-white/90 via-gray-50/95 to-white/90 border-2 border-[#10a37f]/20'
          } backdrop-blur-xl shadow-2xl transition-all duration-700`}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
        >
          {/* Premium Border Glow */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#10a37f]/20 via-[#0d8f6f]/15 to-[#10a37f]/20 blur-sm opacity-30"></div>
          
          {/* Inner Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#10a37f]/8 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#0d8f6f]/8 to-transparent rounded-full blur-xl"></div>

          <div className="relative z-10 p-6">
            {/* Profile Picture and Name Section */}
            <div className="flex flex-col items-center text-center">
              {/* Enhanced Profile Picture */}
              <div className="relative mb-4 group/photo">
                {/* Animated Ring */}
                <div className="absolute -inset-3 bg-gradient-to-r from-[#10a37f] via-[#0d8f6f] to-[#10a37f] rounded-full blur opacity-20 animate-spin-slow"></div>
                <div className="absolute -inset-2 bg-gradient-to-r from-[#10a37f]/40 via-[#0d8f6f]/25 to-[#10a37f]/40 rounded-full animate-pulse"></div>
                
                <div className="relative">
                  <img
                    src={getImageUrl(user.profile_picture)}
                    alt={user.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white/20 shadow-2xl"
                  />
                  
                  {/* Premium Badge */}
                  <div className="absolute -bottom-2 -right-2">
                    <div className={`w-10 h-10 bg-gradient-to-br from-[#10a37f] to-[#0d8f6f] rounded-full flex items-center justify-center shadow-xl border-2 ${
                      isDark ? 'border-[#2a2a2a]/50' : 'border-white/50'
                    }`}>
                      <Crown className="w-5 h-5 text-white animate-pulse" />
                    </div>
                  </div>
                  
                  {/* Edit Photo Button */}
                  {isEditMode && onEditPhoto && (
                    <button
                      onClick={onEditPhoto}
                      className="absolute inset-0 w-32 h-32 rounded-full bg-black/50 opacity-0 active:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                    >
                      <Camera className="w-8 h-8 text-white" />
                    </button>
                  )}
                </div>
              </div>

              {/* Name and Title */}
              <div className="mb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <h2 className={`text-2xl font-bold bg-gradient-to-r from-[#10a37f] via-[#0d8f6f] to-[#10a37f] bg-clip-text text-transparent`}>
                    {user.name}
                  </h2>
                </div>
                
                {user.designation && (
                  <div className="flex items-center justify-center gap-2">
                    <Shield className="w-4 h-4 text-[#10a37f]" />
                    <h3 className={`text-lg font-medium ${theme.text.primary} opacity-90`}>
                      {user.designation}
                    </h3>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#10a37f]/10 border border-[#10a37f]/20">
                      <Target className="w-3 h-3 text-[#10a37f]" />
                      <span className="text-xs font-medium text-[#10a37f]">Pro</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Location - Below Profession */}
            {user.location && (
              <div className="flex items-center justify-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-[#10a37f]" />
                <span className={`text-sm ${theme.text.secondary}`}>{user.location}</span>
              </div>
            )}

            {/* Stats Grid - Experience, Skills, Projects */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {/* Experience */}
              <div className={`text-center p-3 rounded-2xl ${
                isDark 
                  ? 'bg-gradient-to-br from-[#2a2a2a]/50 to-[#1a1a1a]/50 border border-[#10a37f]/20' 
                  : 'bg-gradient-to-br from-white/50 to-gray-50/50 border border-[#10a37f]/15'
              } backdrop-blur-sm`}>
                <div className="p-2 mx-auto rounded-lg bg-[#10a37f]/20 w-fit mb-2">
                  <Briefcase className="w-4 h-4 text-[#10a37f]" />
                </div>
                <div className={`text-xs font-medium ${theme.text.secondary} mb-1`}>Experience</div>
                <div className={`text-base sm:text-sm font-semibold ${theme.text.primary}`}>
                  {(() => {
                    if (user.experience && user.experience.trim() !== '') {
                      return user.experience;
                    }
                    return totalExperience || 'N/A';
                  })()}
                </div>
              </div>

              {/* Skills */}
              <div className={`text-center p-3 rounded-2xl ${
                isDark 
                  ? 'bg-gradient-to-br from-[#2a2a2a]/50 to-[#1a1a1a]/50 border border-[#10a37f]/20' 
                  : 'bg-gradient-to-br from-white/50 to-gray-50/50 border border-[#10a37f]/15'
              } backdrop-blur-sm`}>
                <div className="p-2 mx-auto rounded-lg bg-[#10a37f]/20 w-fit mb-2">
                  <Zap className="w-4 h-4 text-[#10a37f]" />
                </div>
                <div className={`text-xs font-medium ${theme.text.secondary} mb-1`}>Skills</div>
                <div className={`text-base sm:text-sm font-semibold ${theme.text.primary}`}>{(user.skills || []).length}</div>
              </div>

              {/* Projects */}
              <div className={`text-center p-3 rounded-2xl ${
                isDark 
                  ? 'bg-gradient-to-br from-[#2a2a2a]/50 to-[#1a1a1a]/50 border border-[#10a37f]/20' 
                  : 'bg-gradient-to-br from-white/50 to-gray-50/50 border border-[#10a37f]/15'
              } backdrop-blur-sm`}>
                <div className="p-2 mx-auto rounded-lg bg-[#10a37f]/20 w-fit mb-2">
                  <Rocket className="w-4 h-4 text-[#10a37f]" />
                </div>
                <div className={`text-xs font-medium ${theme.text.secondary} mb-1`}>Projects</div>
                <div className={`text-base sm:text-sm font-semibold ${theme.text.primary}`}>{(user.projects || []).length}</div>
              </div>
            </div>



            {/* Enhanced Contact Info - Mobile Optimized */}
            {user.contact_info && Object.keys(user.contact_info).length > 0 && (
              <div className="grid grid-cols-3 gap-1.5 mb-6 max-w-full">
                {user.contact_info.email && (
                  <a
                    href={`mailto:${user.contact_info.email}`}
                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all duration-300 ${
                      isDark 
                        ? 'bg-[#1a1a1a]/70 hover:bg-[#10a37f]/20 border border-[#10a37f]/20' 
                        : 'bg-white/70 hover:bg-[#10a37f]/10 border border-[#10a37f]/15'
                    } backdrop-blur-sm shadow-lg`}
                    title="Email"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#10a37f]" />
                    <span className="text-xs font-medium">Email</span>
                  </a>
                )}

                {user.contact_info.phone && (
                  <a
                    href={`tel:${user.contact_info.phone}`}
                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all duration-300 ${
                      isDark 
                        ? 'bg-[#1a1a1a]/70 hover:bg-[#10a37f]/20 border border-[#10a37f]/20' 
                        : 'bg-white/70 hover:bg-[#10a37f]/10 border border-[#10a37f]/15'
                    } backdrop-blur-sm shadow-lg`}
                    title="Phone"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#10a37f]" />
                    <span className="text-xs font-medium">Phone</span>
                  </a>
                )}

                {user.contact_info.linkedin && (
                  <a
                    href={formatLinkedInUrl(user.contact_info.linkedin)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all duration-300 ${
                      isDark 
                        ? 'bg-[#1a1a1a]/70 hover:bg-[#0d8f6f]/20 border border-[#10a37f]/20' 
                        : 'bg-white/70 hover:bg-[#10a37f]/10 border border-[#10a37f]/15'
                    } backdrop-blur-sm shadow-lg`}
                    title="LinkedIn"
                  >
                    <svg className="w-3.5 h-3.5 text-[#0072b1]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <span className="text-xs font-medium">LinkedIn</span>
                  </a>
                )}

                {user.contact_info.github && (
                  <a
                    href={user.contact_info.github.startsWith('http') ? user.contact_info.github : `https://${user.contact_info.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 ${
                      isDark 
                        ? 'bg-[#1a1a1a]/70 hover:bg-[#0d8f6f]/20 border border-[#10a37f]/20' 
                        : 'bg-white/70 hover:bg-[#10a37f]/10 border border-[#10a37f]/15'
                    } backdrop-blur-sm shadow-lg`}
                    title="GitHub"
                  >
                    <svg className="w-4 h-4 text-gray-700 dark:text-gray-200" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <span className="text-xs font-medium">GitHub</span>
                  </a>
                )}

                {user.contact_info.portfolio && (
                  isLocalProfileUrl(user.contact_info.portfolio) && !user.username ? null : (
                    <a
                      href={isLocalProfileUrl(user.contact_info.portfolio) ? `/profile/${user.username}` : (user.contact_info.portfolio.startsWith('http') ? user.contact_info.portfolio : `https://${user.contact_info.portfolio}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 ${
                        isDark 
                          ? 'bg-[#1a1a1a]/70 hover:bg-[#10a37f]/20 border border-[#10a37f]/20' 
                          : 'bg-white/70 hover:bg-[#10a37f]/10 border border-[#10a37f]/15'
                      } backdrop-blur-sm shadow-lg`}
                      title={isLocalProfileUrl(user.contact_info.portfolio) ? "View Profile" : "Portfolio Website"}
                    >
                      {isLocalProfileUrl(user.contact_info.portfolio) ? (
                        <svg className="w-4 h-4 text-[#10a37f]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-[#10a37f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                        </svg>
                      )}
                      <span className="text-xs font-medium">Portfolio</span>
                    </a>
                  )
                )}

                {user.contact_info.twitter && (
                  <a
                    href={user.contact_info.twitter.startsWith('http') ? user.contact_info.twitter : `https://${user.contact_info.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 ${
                      isDark 
                        ? 'bg-[#1a1a1a]/70 hover:bg-[#10a37f]/20 border border-[#10a37f]/20' 
                        : 'bg-white/70 hover:bg-[#10a37f]/10 border border-[#10a37f]/15'
                    } backdrop-blur-sm shadow-lg`}
                    title="Twitter Profile"
                  >
                    <svg className="w-4 h-4 text-[#10a37f]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                    <span className="text-xs font-medium">Twitter</span>
                  </a>
                )}

                {user.contact_info.website && (
                  <a
                    href={user.contact_info.website.startsWith('http') ? user.contact_info.website : `https://${user.contact_info.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 ${
                      isDark 
                        ? 'bg-[#1a1a1a]/70 hover:bg-[#10a37f]/20 border border-[#10a37f]/20' 
                        : 'bg-white/70 hover:bg-[#10a37f]/10 border border-[#10a37f]/15'
                    } backdrop-blur-sm shadow-lg`}
                    title="Personal Website"
                  >
                    <svg className="w-4 h-4 text-[#10a37f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                    </svg>
                    <span className="text-xs font-medium">Website</span>
                  </a>
                )}

                {user.contact_info.dribbble && (
                  <a
                    href={user.contact_info.dribbble.startsWith('http') ? user.contact_info.dribbble : `https://${user.contact_info.dribbble}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 ${
                      isDark 
                        ? 'bg-[#1a1a1a]/70 hover:bg-[#10a37f]/20 border border-[#10a37f]/20' 
                        : 'bg-white/70 hover:bg-[#10a37f]/10 border border-[#10a37f]/15'
                    } backdrop-blur-sm shadow-lg`}
                    title="Dribbble Profile"
                  >
                    <svg className="w-4 h-4 text-[#ea4c89]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm9.885 11.441c-2.575-.422-4.943-.445-7.103-.073-.244-.563-.497-1.125-.767-1.68 2.31-1.368 4.646-1.624 7.012-.264 1.19.659 1.74 1.604 1.858 2.017zm-3.824-1.791c-1.31-.295-2.664-.378-4.06-.346-1.1.032-2.2.126-3.3.28-.3-.6-.6-1.2-.9-1.8 1.8-.6 3.6-1.2 5.4-1.8.6.6 1.2 1.2 1.8 1.8.6-.6 1.2-1.2 1.8-1.8 1.8.6 3.6 1.2 5.4 1.8-.3.6-.6 1.2-.9 1.8-.1-.154-.2-.308-.3-.462zM12 2.94c-.6 0-1.2.06-1.8.18.6.6 1.2 1.2 1.8 1.8.6-.6 1.2-1.2 1.8-1.8-.6-.12-1.2-.18-1.8-.18zM9.885 12.441c-2.575.422-4.943.445-7.103.073-.244.563-.497 1.125-.767 1.68 2.31 1.368 4.646 1.624 7.012.264 1.19-.659 1.74-1.604 1.858-2.017zm3.824 1.791c-1.31.295-2.664.378-4.06.346-1.1-.032-2.2-.126-3.3-.28-.3.6-.6 1.2-.9 1.8 1.8.6 3.6 1.2 5.4 1.8.6-.6 1.2-1.2 1.8-1.8.6.6 1.2 1.2 1.8 1.8.6-.6 1.2-1.2 1.8-1.8 1.8-.6 3.6-1.2 5.4-1.8-.3-.6-.6-1.2-.9-1.8-.1.154-.2.308-.3.462zM12 21.06c.6 0 1.2-.06 1.8-.18-.6-.6-1.2-1.2-1.8-1.8-.6.6-1.2 1.2-1.8 1.8.6.12 1.2.18 1.8.18z"/>
                    </svg>
                    <span className="text-xs font-medium">Dribbble</span>
                  </a>
                )}

                {user.contact_info.behance && (
                  <a
                    href={user.contact_info.behance.startsWith('http') ? user.contact_info.behance : `https://${user.contact_info.behance}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 ${
                      isDark 
                        ? 'bg-[#1a1a1a]/70 hover:bg-[#10a37f]/20 border border-[#10a37f]/20' 
                        : 'bg-white/70 hover:bg-[#10a37f]/10 border border-[#10a37f]/15'
                    } backdrop-blur-sm shadow-lg`}
                    title="Behance Profile"
                  >
                    <svg className="w-4 h-4 text-[#1769ff]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.561-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426H24c-.415-2.35-2.108-4.426-5.375-4.426-3.659 0-7.466 2.12-7.466 7.325 0 5.222 3.807 7.325 7.466 7.325 3.267 0 4.96-2.076 5.375-4.426h-2.649zM13.984 13.536c0-2.448 1.332-3.896 3.2-3.896 1.869 0 3.198 1.448 3.198 3.896 0 2.448-1.329 3.896-3.198 3.896-1.868 0-3.2-1.448-3.2-3.896z"/>
                    </svg>
                    <span className="text-xs font-medium">Behance</span>
                  </a>
                )}

                {user.contact_info.medium && (
                  <a
                    href={user.contact_info.medium.startsWith('http') ? user.contact_info.medium : `https://${user.contact_info.medium}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 ${
                      isDark 
                        ? 'bg-[#1a1a1a]/70 hover:bg-[#10a37f]/20 border border-[#10a37f]/20' 
                        : 'bg-white/70 hover:bg-[#10a37f]/10 border border-[#10a37f]/15'
                    } backdrop-blur-sm shadow-lg`}
                    title="Medium Profile"
                  >
                    <svg className="w-4 h-4 text-[#00ab6c]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
                    </svg>
                    <span className="text-xs font-medium">Medium</span>
                  </a>
                )}

                {user.contact_info.instagram && (
                  <a
                    href={user.contact_info.instagram.startsWith('http') ? user.contact_info.instagram : `https://${user.contact_info.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all duration-300 ${
                      isDark 
                        ? 'bg-[#1a1a1a]/70 hover:bg-[#10a37f]/20 border border-[#10a37f]/20' 
                        : 'bg-white/70 hover:bg-[#10a37f]/10 border border-[#10a37f]/15'
                    } backdrop-blur-sm shadow-lg`}
                    title="Instagram Profile"
                  >
                    <svg className="w-3.5 h-3.5 text-[#e4405f]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.928-.875-1.418-2.026-1.418-3.244s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244z"/>
                    </svg>
                    <span className="text-xs font-medium">Instagram</span>
                  </a>
                )}

                {user.contact_info.facebook && (
                  <a
                    href={user.contact_info.facebook.startsWith('http') ? user.contact_info.facebook : `https://${user.contact_info.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all duration-300 ${
                      isDark 
                        ? 'bg-[#1a1a1a]/70 hover:bg-[#10a37f]/20 border border-[#10a37f]/20' 
                        : 'bg-white/70 hover:bg-[#10a37f]/10 border border-[#10a37f]/15'
                    } backdrop-blur-sm shadow-lg`}
                    title="Facebook Profile"
                  >
                    <svg className="w-3.5 h-3.5 text-[#1877f2]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span className="text-xs font-medium">Facebook</span>
                  </a>
                )}

                {user.contact_info.youtube && (
                  <a
                    href={user.contact_info.youtube.startsWith('http') ? user.contact_info.youtube : `https://${user.contact_info.youtube}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all duration-300 ${
                      isDark 
                        ? 'bg-[#1a1a1a]/70 hover:bg-[#10a37f]/20 border border-[#10a37f]/20' 
                        : 'bg-white/70 hover:bg-[#10a37f]/10 border border-[#10a37f]/15'
                    } backdrop-blur-sm shadow-lg`}
                    title="YouTube Channel"
                  >
                    <svg className="w-3.5 h-3.5 text-[#ff0000]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    <span className="text-xs font-medium">YouTube</span>
                  </a>
                )}
              </div>
            )}

            {/* Premium Action Button */}
            {!isEditMode && onOpenAIAnalysis && (
              <div className="mb-4">
                <button
                  onClick={onOpenAIAnalysis}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#10a37f] text-white shadow-lg hover:shadow-xl backdrop-blur-sm text-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>AI Analysis</span>
                </button>
              </div>
            )}

            {/* Create Cover Letter Button - Only show in view mode */}
            {!isEditMode && isCurrentUser && (
              <div className="mb-4">
                <button
                  onClick={() => window.location.href = '/ai-writer'}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#10a37f] text-white shadow-lg hover:shadow-xl backdrop-blur-sm text-sm"
                  title="Create a professional cover letter using your profile"
                >
                  <FileText className="w-4 h-4" />
                  <span>Create Cover Letter</span>
                </button>
              </div>
            )}
            
            {/* Edit Basic Info Button */}
            {isCurrentUser && isEditMode && otherProps.onEditContact && (
              <div className="mb-4">
                <button
                  onClick={otherProps.onEditContact}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all duration-300 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#10a37f] text-white shadow-lg hover:shadow-xl backdrop-blur-sm"
                >
                  <Edit3 className="w-5 h-5" />
                  <span>Edit Basic Info</span>
                  <Target className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Create Cover Letter Button - Only show for current user in edit mode after Edit Basic Info */}
            {isCurrentUser && isEditMode && (
              <div className="mb-4">
                <button
                  onClick={() => window.location.href = '/ai-writer'}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all duration-300 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#10a37f] text-white shadow-lg hover:shadow-xl backdrop-blur-sm"
                  title="Create a professional cover letter using your profile"
                >
                  <FileText className="w-5 h-5" />
                  <span>Create Cover Letter</span>
                  <Zap className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sections */}
      <div className="relative z-10 px-4 pb-6 space-y-4">
        {/* Profile Completion Section */}
        {isEditMode && (
          <MobileProfileCompletionSection
            user={user}
            isEditMode={isEditMode}
            onEditAbout={otherProps.onEditAbout}
            onEditSkills={otherProps.onEditSkills}
            onEditExperience={otherProps.onEditExperience}
            onEditProject={otherProps.onEditProject}
            onEditEducation={otherProps.onEditEducation}
            onEditContact={otherProps.onEditContact}
            onAddLanguage={otherProps.onAddLanguage}
            onAddAward={otherProps.onAddAward}
            onAddPublication={otherProps.onAddPublication}
            onAddVolunteerExperience={otherProps.onAddVolunteerExperience}
            onAddInterests={otherProps.onAddInterests}
            onEditPreferences={otherProps.onEditPreferences}
          />
        )}

        <VariantAwareProfileSections 
          variant="advanced"
          user={user}
          isEditMode={isEditMode}
          {...otherProps}
        />
      </div>

      {/* Custom Styles for Mobile Animations */}
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  )
})

export default AdvancedMobileProfileVariant
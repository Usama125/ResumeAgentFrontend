"use client"

import React, { memo, useState } from 'react'
import { User as UserType } from "@/types"
import { useTheme } from "@/context/ThemeContext"
import { getThemeClasses } from "@/utils/theme"
import { getImageUrl } from '@/utils/imageUtils'
import { formatLinkedInUrl, isLocalProfileUrl } from '@/utils/contactUtils'
import { calculateTotalExperience } from "@/utils/experienceCalculator"
import VariantAwareProfileSections from "@/components/sections/variants/VariantAwareProfileSections"
import ProfileCompletionSection from "@/components/sections/ProfileCompletionSection"
import PreferencesSection from "@/components/sections/PreferencesSection"
import EmptyProfileSection from '@/components/sections/EmptyProfileSection'
import { GradientAvatar } from '@/components/ui/avatar'
import { isProfileEmpty } from '@/utils/profileUtils'
import {
  MapPin,
  Briefcase,
  Award,
  Code,
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
  FileText,
  Rocket,
  Mail,
  Phone
} from "lucide-react"

interface AdvancedProfileVariantProps {
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
  onEditModeToggle?: (editMode: boolean) => void
  onOpenAIAnalysis?: () => void
}

const AdvancedProfileVariant = memo(function AdvancedProfileVariant({
  user,
  isEditMode,
  isCurrentUser,
  onEditPhoto,
  onOpenAIAnalysis,
  ...otherProps
}: AdvancedProfileVariantProps) {
  const { isDark } = useTheme()
  const theme = getThemeClasses(isDark)
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)

  const totalExperience = calculateTotalExperience(user.experience_details || [])

  return (
    <div className={`${isDark ? 'bg-[#212121]' : 'bg-gray-50'} h-full overflow-y-auto relative scrollbar-hide`}>
      {/* Advanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#10a37f]/8 via-[#10a37f]/3 to-[#10a37f]/6"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#10a37f]/4 to-transparent animate-pulse"></div>
        
        {/* Floating Geometric Elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-[#10a37f]/15 to-[#0d8f6f]/10 rounded-full blur-3xl animate-pulse opacity-50"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-br from-[#0d8f6f]/10 to-[#10a37f]/12 rounded-full blur-2xl animate-pulse delay-1000 opacity-60"></div>
        <div className="absolute bottom-32 left-32 w-32 h-32 bg-gradient-to-br from-[#10a37f]/12 to-[#0d8f6f]/8 rounded-full blur-xl animate-pulse delay-500 opacity-40"></div>
        
        {/* Animated Particles */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 bg-[#10a37f]/25 rounded-full animate-ping`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Content Container with top margin */}
      <div className="h-full overflow-y-auto relative z-10 scrollbar-hide">
        <div className="p-8 max-w-7xl mx-auto space-y-8 mt-16">
          {/* Advanced Hero Section - Hide when profile is empty and in view mode */}
          {!(isCurrentUser && !isEditMode && isProfileEmpty(user)) && (
            <div 
              className={`relative overflow-hidden rounded-3xl border-2 ${
                isDark 
                  ? 'bg-gradient-to-br from-[#2a2a2a]/90 via-[#1a1a1a]/95 to-[#2a2a2a]/90 border-[#10a37f]/30' 
                  : 'bg-gradient-to-br from-white/90 via-gray-50/95 to-white/90 border-[#10a37f]/20'
              } backdrop-blur-xl shadow-2xl transition-all duration-700 hover:shadow-[#10a37f]/20 hover:shadow-3xl group`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
            {/* Premium Border Glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#10a37f]/20 via-[#0d8f6f]/15 to-[#10a37f]/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            {/* Inner Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#10a37f]/8 to-transparent rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#0d8f6f]/8 to-transparent rounded-full blur-xl"></div>
            

            <div className="relative z-10 p-8">
              {/* Main Profile Section */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 mb-8">
                {/* Enhanced Profile Picture */}
                <div className="relative group/photo">
                  {/* Animated Ring */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-[#10a37f] via-[#0d8f6f] to-[#10a37f] rounded-full blur opacity-15 group-hover/photo:opacity-30 animate-spin-slow transition-opacity duration-500"></div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#10a37f]/40 via-[#0d8f6f]/25 to-[#10a37f]/40 rounded-full animate-pulse"></div>
                  
                  <div className="relative">
                    {user.profile_picture && !imageError ? (
                      <img
                        src={getImageUrl(user.profile_picture)}
                        alt={user.name}
                        className="w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover border-4 border-white/20 shadow-2xl group-hover/photo:scale-105 transition-transform duration-500"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <GradientAvatar
                        className="w-32 h-32 lg:w-40 lg:h-40 border-4 border-white/20 shadow-2xl group-hover/photo:scale-105 transition-transform duration-500"
                        isDark={isDark}
                      />
                    )}
                    
                    {/* Premium Badge */}
                    <div className="absolute -bottom-2 -right-2">
                      <div className={`w-12 h-12 bg-gradient-to-br from-[#10a37f] to-[#0d8f6f] rounded-full flex items-center justify-center shadow-xl border-2 ${
                        isDark ? 'border-[#2a2a2a]/50' : 'border-white/50'
                      }`}>
                        <Crown className="w-6 h-6 text-white animate-pulse" />
                      </div>
                    </div>
                    
                    {/* Edit Photo Button */}
                    {isEditMode && onEditPhoto && (
                      <button
                        onClick={onEditPhoto}
                        className="absolute inset-0 w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                      >
                        <Camera className="w-8 h-8 text-white" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Enhanced Profile Info */}
                <div className="flex-1 space-y-6">
                  {/* Name and Title with Animation */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <h1 className={`text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#10a37f] via-[#0d8f6f] to-[#10a37f] bg-clip-text text-transparent animate-gradient-x leading-tight`}>
                        {user.name}
                      </h1>
                    </div>
                    
                    {user.designation && (
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-[#10a37f]" />
                        <h2 className={`text-xl lg:text-2xl font-medium ${theme.text.primary} opacity-90`}>
                          {user.designation}
                        </h2>
                        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#10a37f]/10 border border-[#10a37f]/20">
                          <Target className="w-4 h-4 text-[#10a37f]" />
                          <span className="text-sm font-medium text-[#10a37f]">Professional</span>
                        </div>
                      </div>
                    )}

                    {/* Location - Moved below designation */}
                    {user.location && (
                      <div className={`flex items-center gap-3 mt-4`}>
                        <MapPin className="w-5 h-5 text-[#10a37f]" />
                        <span className={`text-lg ${theme.text.primary} opacity-90`}>{user.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Three Boxes: Experience, Skills, Projects */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Experience */}
                    <div className={`flex items-center gap-3 p-4 rounded-2xl ${
                      isDark 
                        ? 'bg-gradient-to-br from-[#2a2a2a]/50 to-[#1a1a1a]/50 border border-[#0d8f6f]/20' 
                        : 'bg-gradient-to-br from-white/50 to-gray-50/50 border border-[#10a37f]/15'
                    } backdrop-blur-sm hover:scale-105 transition-transform duration-300`}>
                      <div className="p-2 rounded-lg bg-[#10a37f]/20">
                        <Briefcase className="w-5 h-5 text-[#10a37f]" />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${theme.text.secondary}`}>Experience</p>
                        <p className={`font-semibold ${theme.text.primary}`}>{totalExperience || 'N/A'}</p>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className={`flex items-center gap-3 p-4 rounded-2xl ${
                      isDark 
                        ? 'bg-gradient-to-br from-[#2a2a2a]/50 to-[#1a1a1a]/50 border border-[#10a37f]/20' 
                        : 'bg-gradient-to-br from-white/50 to-gray-50/50 border border-[#10a37f]/15'
                    } backdrop-blur-sm hover:scale-105 transition-transform duration-300`}>
                      <div className="p-2 rounded-lg bg-[#10a37f]/20">
                        <Zap className="w-5 h-5 text-[#10a37f]" />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${theme.text.secondary}`}>Skills</p>
                        <p className={`font-semibold ${theme.text.primary}`}>{(user.skills || []).length}</p>
                      </div>
                    </div>

                    {/* Projects */}
                    <div className={`flex items-center gap-3 p-4 rounded-2xl ${
                      isDark 
                        ? 'bg-gradient-to-br from-[#2a2a2a]/50 to-[#1a1a1a]/50 border border-[#10a37f]/20' 
                        : 'bg-gradient-to-br from-white/50 to-gray-50/50 border border-[#10a37f]/15'
                    } backdrop-blur-sm hover:scale-105 transition-transform duration-300`}>
                      <div className="p-2 rounded-lg bg-[#10a37f]/20">
                        <Rocket className="w-5 h-5 text-[#10a37f]" />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${theme.text.secondary}`}>Projects</p>
                        <p className={`font-semibold ${theme.text.primary}`}>{(user.projects || []).length}</p>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Contact Info */}
                  {user.contact_info && Object.keys(user.contact_info).length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {user.contact_info.email && (
                        <a
                          href={`mailto:${user.contact_info.email}`}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                            isDark 
                              ? 'bg-[#1a1a1a]/70 hover:bg-[#10a37f]/20 border border-[#10a37f]/20 hover:border-[#10a37f]/40' 
                              : 'bg-white/70 hover:bg-[#10a37f]/10 border border-[#10a37f]/15 hover:border-[#10a37f]/30'
                          } backdrop-blur-sm hover:scale-105 hover:shadow-lg`}
                          title="Email"
                        >
                          <Mail className="w-5 h-5 text-[#10a37f]" />
                          <span className="text-sm font-medium">Email</span>
                        </a>
                      )}

                      {user.contact_info.phone && (
                        <a
                          href={`tel:${user.contact_info.phone}`}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                            isDark 
                              ? 'bg-[#1a1a1a]/70 hover:bg-[#10a37f]/20 border border-[#10a37f]/20 hover:border-[#10a37f]/40' 
                              : 'bg-white/70 hover:bg-[#10a37f]/10 border border-[#10a37f]/15 hover:border-[#10a37f]/30'
                          } backdrop-blur-sm hover:scale-105 hover:shadow-lg`}
                          title="Phone"
                        >
                          <Phone className="w-5 h-5 text-[#10a37f]" />
                          <span className="text-sm font-medium">Phone</span>
                        </a>
                      )}

                      {user.contact_info.linkedin && (
                        <a
                          href={formatLinkedInUrl(user.contact_info.linkedin)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                            isDark 
                              ? 'bg-[#1a1a1a]/70 hover:bg-[#0d8f6f]/20 border border-[#10a37f]/20 hover:border-[#0d8f6f]/40' 
                              : 'bg-white/70 hover:bg-[#10a37f]/10 border border-[#10a37f]/15 hover:border-[#10a37f]/30'
                          } backdrop-blur-sm hover:scale-105 hover:shadow-lg`}
                          title="LinkedIn Profile"
                        >
                          <svg className="w-5 h-5 text-[#0072b1]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                          <span className="text-sm font-medium">LinkedIn</span>
                        </a>
                      )}

                      {user.contact_info.github && (
                        <a
                          href={user.contact_info.github.startsWith('http') ? user.contact_info.github : `https://${user.contact_info.github}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                            isDark 
                              ? 'bg-[#1a1a1a]/70 hover:bg-[#0d8f6f]/20 border border-[#10a37f]/20 hover:border-[#0d8f6f]/40' 
                              : 'bg-white/70 hover:bg-[#10a37f]/10 border border-[#10a37f]/15 hover:border-[#10a37f]/30'
                          } backdrop-blur-sm hover:scale-105 hover:shadow-lg`}
                          title="GitHub Profile"
                        >
                          <svg className="w-5 h-5 text-gray-700 dark:text-gray-200" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                          <span className="text-sm font-medium">GitHub</span>
                        </a>
                      )}

                      {user.contact_info.portfolio && (
                        isLocalProfileUrl(user.contact_info.portfolio) && !user.username ? null : (
                          <a
                            href={isLocalProfileUrl(user.contact_info.portfolio) ? `/profile/${user.username}` : (user.contact_info.portfolio.startsWith('http') ? user.contact_info.portfolio : `https://${user.contact_info.portfolio}`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                              isDark 
                                ? 'bg-[#1a1a1a]/70 hover:bg-[#0d8f6f]/20 border border-[#10a37f]/20 hover:border-[#0d8f6f]/40' 
                                : 'bg-white/70 hover:bg-[#10a37f]/10 border border-[#10a37f]/15 hover:border-[#10a37f]/30'
                            } backdrop-blur-sm hover:scale-105 hover:shadow-lg`}
                            title={isLocalProfileUrl(user.contact_info.portfolio) ? "View Profile" : "Portfolio Website"}
                          >
                            {isLocalProfileUrl(user.contact_info.portfolio) ? (
                              <Users className="w-5 h-5 text-[#10a37f]" />
                            ) : (
                              <Globe className="w-5 h-5 text-[#10a37f]" />
                            )}
                            <span className="text-sm font-medium">Portfolio</span>
                          </a>
                        )
                      )}

                      {user.contact_info.website && (
                        <a
                          href={user.contact_info.website.startsWith('http') ? user.contact_info.website : `https://${user.contact_info.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                            isDark 
                              ? 'bg-[#1a1a1a]/70 hover:bg-[#0d8f6f]/20 border border-[#10a37f]/20 hover:border-[#0d8f6f]/40' 
                              : 'bg-white/70 hover:bg-[#10a37f]/10 border border-[#10a37f]/15 hover:border-[#10a37f]/30'
                          } backdrop-blur-sm hover:scale-105 hover:shadow-lg`}
                          title="Personal Website"
                        >
                          <Globe className="w-5 h-5 text-[#10a37f]" />
                          <span className="text-sm font-medium">Website</span>
                        </a>
                      )}

                      {user.contact_info.dribbble && (
                        <a
                          href={user.contact_info.dribbble.startsWith('http') ? user.contact_info.dribbble : `https://${user.contact_info.dribbble}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                            isDark 
                              ? 'bg-[#1a1a1a]/70 hover:bg-[#0d8f6f]/20 border border-[#10a37f]/20 hover:border-[#0d8f6f]/40' 
                              : 'bg-white/70 hover:bg-[#10a37f]/10 border border-[#10a37f]/15 hover:border-[#10a37f]/30'
                          } backdrop-blur-sm hover:scale-105 hover:shadow-lg`}
                          title="Dribbble Profile"
                        >
                          <svg className="w-5 h-5 text-[#ea4c89]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm9.885 11.441c-2.575-.422-4.943-.445-7.103-.073-.244-.563-.497-1.125-.767-1.68 2.31-1.368 4.646-1.624 7.012-.264 1.19.659 1.74 1.604 1.858 2.017zm-3.824-1.791c-1.31-.295-2.664-.378-4.06-.346-1.1.032-2.2.126-3.3.28-.3-.6-.6-1.2-.9-1.8 1.8-.6 3.6-1.2 5.4-1.8.6.6 1.2 1.2 1.8 1.8.6-.6 1.2-1.2 1.8-1.8 1.8.6 3.6 1.2 5.4 1.8-.3.6-.6 1.2-.9 1.8-.1-.154-.2-.308-.3-.462zM12 2.94c-.6 0-1.2.06-1.8.18.6.6 1.2 1.2 1.8 1.8.6-.6 1.2-1.2 1.8-1.8-.6-.12-1.2-.18-1.8-.18zM9.885 12.441c-2.575.422-4.943.445-7.103.073-.244.563-.497 1.125-.767 1.68 2.31 1.368 4.646 1.624 7.012.264 1.19-.659 1.74-1.604 1.858-2.017zm3.824 1.791c-1.31.295-2.664.378-4.06.346-1.1-.032-2.2-.126-3.3-.28-.3.6-.6 1.2-.9 1.8 1.8.6 3.6 1.2 5.4 1.8.6-.6 1.2-1.2 1.8-1.8.6.6 1.2 1.2 1.8 1.8.6-.6 1.2-1.2 1.8-1.8 1.8-.6 3.6-1.2 5.4-1.8-.3-.6-.6-1.2-.9-1.8-.1.154-.2.308-.3.462zM12 21.06c.6 0 1.2-.06 1.8-.18-.6-.6-1.2-1.2-1.8-1.8-.6.6-1.2 1.2-1.8 1.8.6.12 1.2.18 1.8.18z"/>
                          </svg>
                          <span className="text-sm font-medium">Dribbble</span>
                        </a>
                      )}

                      {user.contact_info.behance && (
                        <a
                          href={user.contact_info.behance.startsWith('http') ? user.contact_info.behance : `https://${user.contact_info.behance}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                            isDark 
                              ? 'bg-[#1a1a1a]/70 hover:bg-[#0d8f6f]/20 border border-[#10a37f]/20 hover:border-[#0d8f6f]/40' 
                              : 'bg-white/70 hover:bg-[#10a37f]/10 border border-[#10a37f]/15 hover:border-[#10a37f]/30'
                          } backdrop-blur-sm hover:scale-105 hover:shadow-lg`}
                          title="Behance Profile"
                        >
                          <svg className="w-5 h-5 text-[#1769ff]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.561-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426H24c-.415-2.35-2.108-4.426-5.375-4.426-3.659 0-7.466 2.12-7.466 7.325 0 5.222 3.807 7.325 7.466 7.325 3.267 0 4.96-2.076 5.375-4.426h-2.649zM13.984 13.536c0-2.448 1.332-3.896 3.2-3.896 1.869 0 3.198 1.448 3.198 3.896 0 2.448-1.329 3.896-3.198 3.896-1.868 0-3.2-1.448-3.2-3.896z"/>
                          </svg>
                          <span className="text-sm font-medium">Behance</span>
                        </a>
                      )}

                      {user.contact_info.medium && (
                        <a
                          href={user.contact_info.medium.startsWith('http') ? user.contact_info.medium : `https://${user.contact_info.medium}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                            isDark 
                              ? 'bg-[#1a1a1a]/70 hover:bg-[#0d8f6f]/20 border border-[#10a37f]/20 hover:border-[#0d8f6f]/40' 
                              : 'bg-white/70 hover:bg-[#10a37f]/10 border border-[#10a37f]/15 hover:border-[#10a37f]/30'
                          } backdrop-blur-sm hover:scale-105 hover:shadow-lg`}
                          title="Medium Profile"
                        >
                          <svg className="w-5 h-5 text-[#00ab6c]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
                          </svg>
                          <span className="text-sm font-medium">Medium</span>
                        </a>
                      )}

                      {user.contact_info.instagram && (
                        <a
                          href={user.contact_info.instagram.startsWith('http') ? user.contact_info.instagram : `https://${user.contact_info.instagram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                            isDark 
                              ? 'bg-[#1a1a1a]/70 hover:bg-[#0d8f6f]/20 border border-[#10a37f]/20 hover:border-[#0d8f6f]/40' 
                              : 'bg-white/70 hover:bg-[#10a37f]/10 border border-[#10a37f]/15 hover:border-[#10a37f]/30'
                          } backdrop-blur-sm hover:scale-105 hover:shadow-lg`}
                          title="Instagram Profile"
                        >
                          <svg className="w-5 h-5 text-[#e4405f]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.928-.875-1.418-2.026-1.418-3.244s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244z"/>
                          </svg>
                          <span className="text-sm font-medium">Instagram</span>
                        </a>
                      )}

                      {user.contact_info.facebook && (
                        <a
                          href={user.contact_info.facebook.startsWith('http') ? user.contact_info.facebook : `https://${user.contact_info.facebook}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                            isDark 
                              ? 'bg-[#1a1a1a]/70 hover:bg-[#0d8f6f]/20 border border-[#10a37f]/20 hover:border-[#0d8f6f]/40' 
                              : 'bg-white/70 hover:bg-[#10a37f]/10 border border-[#10a37f]/15 hover:border-[#10a37f]/30'
                          } backdrop-blur-sm hover:scale-105 hover:shadow-lg`}
                          title="Facebook Profile"
                        >
                          <svg className="w-5 h-5 text-[#1877f2]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                          <span className="text-sm font-medium">Facebook</span>
                        </a>
                      )}

                      {user.contact_info.youtube && (
                        <a
                          href={user.contact_info.youtube.startsWith('http') ? user.contact_info.youtube : `https://${user.contact_info.youtube}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                            isDark 
                              ? 'bg-[#1a1a1a]/70 hover:bg-[#0d8f6f]/20 border border-[#10a37f]/20 hover:border-[#0d8f6f]/40' 
                              : 'bg-white/70 hover:bg-[#10a37f]/10 border border-[#10a37f]/15 hover:border-[#10a37f]/30'
                          } backdrop-blur-sm hover:scale-105 hover:shadow-lg`}
                          title="YouTube Channel"
                        >
                          <svg className="w-5 h-5 text-[#ff0000]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                          </svg>
                          <span className="text-sm font-medium">YouTube</span>
                        </a>
                      )}
                    </div>
                  )}

                  {/* Action Buttons Row - Only show in view mode */}
                  {!isEditMode && (
                    <div className="flex items-center justify-start gap-4 pt-4">
                      {/* AI Analysis Button */}
                      {onOpenAIAnalysis && (
                        <button
                          onClick={onOpenAIAnalysis}
                          className={`group flex items-center gap-3 px-6 py-3 rounded-2xl font-medium transition-all duration-300 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#10a37f] text-white shadow-lg hover:shadow-xl hover:scale-105 backdrop-blur-sm`}
                        >
                          <Sparkles className="w-5 h-5 group-hover:animate-spin" />
                          AI Analysis
                          <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                      )}

                      {/* Create Cover Letter Button */}
                      {isCurrentUser && (
                        <button
                          onClick={() => window.location.href = '/ai-writer'}
                          className={`group flex items-center gap-3 px-6 py-3 rounded-2xl font-medium transition-all duration-300 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#10a37f] text-white shadow-lg hover:shadow-xl hover:scale-105 backdrop-blur-sm`}
                          title="Create a professional cover letter using your profile"
                        >
                          <FileText className="w-5 h-5 group-hover:animate-pulse" />
                          Create Cover Letter
                          <Zap className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                      )}
                    </div>
                  )}
                  
                  {/* Edit Mode Buttons Row - Only show for current user in edit mode */}
                  {isCurrentUser && isEditMode && (
                    <div className="flex items-center justify-start gap-4 pt-4">
                      {/* Edit Basic Info Button */}
                      {otherProps.onEditContact && (
                        <button
                          onClick={otherProps.onEditContact}
                          className={`group flex items-center gap-3 px-6 py-3 rounded-2xl font-medium transition-all duration-300 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#10a37f] text-white shadow-lg hover:shadow-xl hover:scale-105 backdrop-blur-sm`}
                        >
                          <svg className="w-5 h-5 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit Basic Info
                          <Target className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                      )}

                      {/* Create Cover Letter Button */}
                      <button
                        onClick={() => window.location.href = '/ai-writer'}
                        className={`group flex items-center gap-3 px-6 py-3 rounded-2xl font-medium transition-all duration-300 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#10a37f] text-white shadow-lg hover:shadow-xl hover:scale-105 backdrop-blur-sm`}
                        title="Create a professional cover letter using your profile"
                      >
                        <FileText className="w-5 h-5 group-hover:animate-pulse" />
                        Create Cover Letter
                        <Zap className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          )}

          {/* Profile Sections with Enhanced Styling */}
          <div className="space-y-6">
            {/* Profile Completion Section - Always at top in edit mode */}
            {isEditMode && (
              <ProfileCompletionSection
                user={user}
                isEditMode={isEditMode}
                variant="advanced"
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
            {/* Show Empty Profile Section only when profile is empty and in view mode */}
            {!isEditMode && isCurrentUser && isProfileEmpty(user) && (
              <EmptyProfileSection
                user={user}
                isEditMode={isEditMode}
                onEditModeToggle={otherProps.onEditModeToggle}
              />
            )}
            <VariantAwareProfileSections 
              variant="advanced"
              user={user}
              isEditMode={isEditMode}
              {...otherProps}
            />
            
            {/* Work Preferences Section - Always at bottom in edit mode, not draggable */}
            {isEditMode && (
              <PreferencesSection
                user={user}
                isEditMode={isEditMode}
              />
            )}
          </div>
        </div>
      </div>

      {/* Custom Styles for Animations */}
      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-gradient-x {
          animation: gradient-x 6s ease infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  )
})

export default AdvancedProfileVariant
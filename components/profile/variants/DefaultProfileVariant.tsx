"use client"

import React, { memo } from 'react'
import {
  MapPin,
  Edit,
  Sparkles,
  FileText,
} from "lucide-react"
import { User as UserType } from "@/types"
import { useTheme } from "@/context/ThemeContext"
import { getThemeClasses } from "@/utils/theme"
import { calculateTotalExperience } from "@/utils/experienceCalculator"
import { getImageUrl } from '@/utils/imageUtils'
import { formatLinkedInUrl, isLocalProfileUrl } from '@/utils/contactUtils'
import ProfileSections from '@/components/ProfileSections'
import PreferencesSection from '@/components/sections/PreferencesSection'
import EmptyProfileSection from '@/components/sections/EmptyProfileSection'
import { GradientAvatar } from '@/components/ui/avatar'
import { isProfileEmpty } from '@/utils/profileUtils'

interface DefaultProfileVariantProps {
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
  onEditModeToggle?: (editMode: boolean) => void
}

const DefaultProfileVariant = memo(function DefaultProfileVariant({
  user,
  isEditMode = false,
  isCurrentUser = false,
  onEditPhoto,
  onEditAbout,
  onEditSkills,
  onEditExperience,
  onEditSingleExperience,
  onDeleteSingleExperience,
  onEditProject,
  onEditSingleProject,
  onDeleteSingleProject,
  onDeleteAbout,
  onDeleteSkills,
  onDeleteExperience,
  onDeleteProjects,
  onEditEducation,
  onEditSingleEducation,
  onDeleteSingleEducation,
  onDeleteEducation,
  onEditContact,
  onDeleteContact,
  onEditLanguage,
  onDeleteLanguage,
  onAddLanguage,
  onDeleteLanguages,
  onEditAward,
  onDeleteAward,
  onAddAward,
  onDeleteAwards,
  onEditPublication,
  onDeletePublication,
  onAddPublication,
  onDeletePublications,
  onEditVolunteerExperience,
  onDeleteVolunteerExperience,
  onAddVolunteerExperience,
  onDeleteVolunteerExperiences,
  onEditInterests,
  onDeleteInterests,
  onAddInterests,
  onEditPreferences,
  onSectionOrderChange,
  onAddSection,
  onOpenAIAnalysis,
  onEditModeToggle
}: DefaultProfileVariantProps) {
  const { isDark } = useTheme()
  const theme = getThemeClasses(isDark)
  const [imageError, setImageError] = React.useState(false)

  return (
    <div className={`${isDark ? 'bg-[#212121]' : 'bg-gray-50'} h-full overflow-y-auto relative scrollbar-hide`}>
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#10a37f]/5 via-transparent to-[#10a37f]/10"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#10a37f]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0d8f6f]/5 rounded-full blur-2xl"></div>
      
      {/* Content Container */}
      <div className="h-full overflow-y-auto relative z-10 scrollbar-hide">
        <div className="p-12 max-w-4xl mx-auto space-y-6">
          {/* Hero Section - Hide when profile is empty and in view mode */}
          {!(isCurrentUser && !isEditMode && isProfileEmpty(user)) && (
            <div className="text-center space-y-6">
            {/* Profile Picture */}
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full blur-lg opacity-30"></div>
              {user.profile_picture && !imageError ? (
                <img
                  src={getImageUrl(user.profile_picture)}
                  alt={user.name}
                  className="relative w-32 h-32 rounded-full object-cover border-4 border-[#10a37f]/30 shadow-2xl"
                  onError={() => setImageError(true)}
                />
              ) : (
                <GradientAvatar
                  className="w-32 h-32 border-4 border-[#10a37f]/30 shadow-2xl"
                  isDark={isDark}
                />
              )}
              {isCurrentUser && onEditPhoto && (
                <button
                  onClick={onEditPhoto}
                  className="absolute bottom-0 right-0 bg-[#10a37f] text-white p-2 rounded-full hover:bg-[#0d8f6f] transition-colors shadow-lg border-2 border-white"
                  title="Edit profile picture"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Name & Title */}
            <div className="space-y-2">
              <h1 className={`text-3xl font-bold ${isDark ? 'bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent' : 'text-gray-900'}`}>
                {user.name}
              </h1>
              <p className="text-xl text-[#10a37f] font-medium">{user.designation}</p>
              <div className={`flex items-center justify-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <MapPin className="w-4 h-4 mr-2" />
                <span>{user.location}</span>
              </div>
            </div>



            {/* Contact Information & Social Links */}
            {user.contact_info && Object.values(user.contact_info).some(value => value) && (
              <div className="flex flex-wrap justify-center gap-3 mt-6">
                {user.contact_info.email && (
                  <a
                    href={`mailto:${user.contact_info.email}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group relative p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
                      isDark 
                        ? 'bg-[#2a2a2a]/80 border border-[#10a37f]/20 hover:bg-[#10a37f]/20 hover:border-[#10a37f]/40' 
                        : 'bg-white/80 border border-gray-200 hover:bg-[#10a37f]/10 hover:border-[#10a37f]/40'
                    } shadow-lg hover:shadow-xl`}
                    title={`Email: ${user.contact_info.email}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    <svg className="relative w-5 h-5 text-[#10a37f] group-hover:text-[#0d8f6f] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </a>
                )}
                {user.contact_info.phone && (
                  <a
                    href={`tel:${user.contact_info.phone}`}
                    className={`group relative p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
                      isDark 
                        ? 'bg-[#2a2a2a]/80 border border-[#10a37f]/20 hover:bg-[#10a37f]/20 hover:border-[#10a37f]/40' 
                        : 'bg-white/80 border border-gray-200 hover:bg-[#10a37f]/10 hover:border-[#10a37f]/40'
                    } shadow-lg hover:shadow-xl`}
                    title={`Call: ${user.contact_info.phone}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    <svg className="relative w-5 h-5 text-[#10a37f] group-hover:text-[#0d8f6f] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </a>
                )}
                {user.contact_info.linkedin && (
                  <a
                    href={formatLinkedInUrl(user.contact_info.linkedin)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group relative p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
                      isDark 
                        ? 'bg-[#2a2a2a]/80 border border-[#10a37f]/20 hover:bg-[#10a37f]/20 hover:border-[#10a37f]/40' 
                        : 'bg-white/80 border border-gray-200 hover:bg-[#10a37f]/10 hover:border-[#10a37f]/40'
                    } shadow-lg hover:shadow-xl`}
                    title="LinkedIn Profile"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    <svg className="relative w-5 h-5 text-[#10a37f] group-hover:text-[#0d8f6f] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                )}
                {user.contact_info.github && (
                  <a
                    href={user.contact_info.github.startsWith('http') ? user.contact_info.github : `https://${user.contact_info.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group relative p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
                      isDark 
                        ? 'bg-[#2a2a2a]/80 border border-[#10a37f]/20 hover:bg-[#10a37f]/20 hover:border-[#10a37f]/40' 
                        : 'bg-white/80 border border-gray-200 hover:bg-[#10a37f]/10 hover:border-[#10a37f]/40'
                    } shadow-lg hover:shadow-xl`}
                    title="GitHub Profile"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    <svg className="relative w-5 h-5 text-[#10a37f] group-hover:text-[#0d8f6f] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                )}
                {user.contact_info.portfolio && (
                  isLocalProfileUrl(user.contact_info.portfolio) && !user.username ? null : (
                    <a
                      href={isLocalProfileUrl(user.contact_info.portfolio) ? `/profile/${user.username}` : (user.contact_info.portfolio.startsWith('http') ? user.contact_info.portfolio : `https://${user.contact_info.portfolio}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group relative p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
                        isDark 
                          ? 'bg-[#2a2a2a]/80 border border-[#10a37f]/20 hover:bg-[#10a37f]/20 hover:border-[#10a37f]/40' 
                          : 'bg-white/80 border border-gray-200 hover:bg-[#10a37f]/10 hover:border-[#10a37f]/40'
                      } shadow-lg hover:shadow-xl`}
                      title={isLocalProfileUrl(user.contact_info.portfolio) ? "View Profile" : "Portfolio Website"}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                      {isLocalProfileUrl(user.contact_info.portfolio) ? (
                        <svg className="relative w-5 h-5 text-[#10a37f] group-hover:text-[#0d8f6f] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                        </svg>
                      ) : (
                        <svg className="relative w-5 h-5 text-[#10a37f] group-hover:text-[#0d8f6f] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                        </svg>
                      )}
                    </a>
                  )
                )}
                {user.contact_info.twitter && (
                  <a
                    href={user.contact_info.twitter.startsWith('http') ? user.contact_info.twitter : `https://${user.contact_info.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group relative p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
                      isDark 
                        ? 'bg-[#2a2a2a]/80 border border-[#10a37f]/20 hover:bg-[#10a37f]/20 hover:border-[#10a37f]/40' 
                        : 'bg-white/80 border border-gray-200 hover:bg-[#10a37f]/10 hover:border-[#10a37f]/40'
                    } shadow-lg hover:shadow-xl`}
                    title="Twitter Profile"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    <svg className="relative w-5 h-5 text-[#10a37f] group-hover:text-[#0d8f6f] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                )}
                {user.contact_info.website && (
                  <a
                    href={user.contact_info.website.startsWith('http') ? user.contact_info.website : `https://${user.contact_info.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group relative p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
                      isDark 
                        ? 'bg-[#2a2a2a]/80 border border-[#10a37f]/20 hover:bg-[#10a37f]/20 hover:border-[#10a37f]/40' 
                        : 'bg-white/80 border border-gray-200 hover:bg-[#10a37f]/10 hover:border-[#10a37f]/40'
                    } shadow-lg hover:shadow-xl`}
                    title="Personal Website"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    <svg className="relative w-5 h-5 text-[#10a37f] group-hover:text-[#0d8f6f] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                    </svg>
                  </a>
                )}
                {user.contact_info.dribbble && (
                  <a
                    href={user.contact_info.dribbble.startsWith('http') ? user.contact_info.dribbble : `https://${user.contact_info.dribbble}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group relative p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
                      isDark 
                        ? 'bg-[#2a2a2a]/80 border border-[#10a37f]/20 hover:bg-[#10a37f]/20 hover:border-[#10a37f]/40' 
                        : 'bg-white/80 border border-gray-200 hover:bg-[#10a37f]/10 hover:border-[#10a37f]/40'
                    } shadow-lg hover:shadow-xl`}
                    title="Dribbble Profile"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    <svg className="relative w-5 h-5 text-[#ea4c89] group-hover:text-[#ea4c89] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm9.885 11.441c-2.575-.422-4.943-.445-7.103-.073-.244-.563-.497-1.125-.767-1.68 2.31-1.368 4.646-1.624 7.012-.264 1.19.659 1.74 1.604 1.858 2.017zm-3.824-1.791c-1.31-.295-2.664-.378-4.06-.346-1.1.032-2.2.126-3.3.28-.3-.6-.6-1.2-.9-1.8 1.8-.6 3.6-1.2 5.4-1.8.6.6 1.2 1.2 1.8 1.8.6-.6 1.2-1.2 1.8-1.8 1.8.6 3.6 1.2 5.4 1.8-.3.6-.6 1.2-.9 1.8-.1-.154-.2-.308-.3-.462zM12 2.94c-.6 0-1.2.06-1.8.18.6.6 1.2 1.2 1.8 1.8.6-.6 1.2-1.2 1.8-1.8-.6-.12-1.2-.18-1.8-.18zM9.885 12.441c-2.575.422-4.943.445-7.103.073-.244.563-.497 1.125-.767 1.68 2.31 1.368 4.646 1.624 7.012.264 1.19-.659 1.74-1.604 1.858-2.017zm3.824 1.791c-1.31.295-2.664.378-4.06.346-1.1-.032-2.2-.126-3.3-.28-.3.6-.6 1.2-.9 1.8 1.8.6 3.6 1.2 5.4 1.8.6-.6 1.2-1.2 1.8-1.8.6.6 1.2 1.2 1.8 1.8.6-.6 1.2-1.2 1.8-1.8 1.8-.6 3.6-1.2 5.4-1.8-.3-.6-.6-1.2-.9-1.8-.1.154-.2.308-.3.462zM12 21.06c.6 0 1.2-.06 1.8-.18-.6-.6-1.2-1.2-1.8-1.8-.6.6-1.2 1.2-1.8 1.8.6.12 1.2.18 1.8.18z"/>
                    </svg>
                  </a>
                )}
                {user.contact_info.behance && (
                  <a
                    href={user.contact_info.behance.startsWith('http') ? user.contact_info.behance : `https://${user.contact_info.behance}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group relative p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
                      isDark 
                        ? 'bg-[#2a2a2a]/80 border border-[#10a37f]/20 hover:bg-[#10a37f]/20 hover:border-[#10a37f]/40' 
                        : 'bg-white/80 border border-gray-200 hover:bg-[#10a37f]/10 hover:border-[#10a37f]/40'
                    } shadow-lg hover:shadow-xl`}
                    title="Behance Profile"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    <svg className="relative w-5 h-5 text-[#1769ff] group-hover:text-[#1769ff] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.561-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426H24c-.415-2.35-2.108-4.426-5.375-4.426-3.659 0-7.466 2.12-7.466 7.325 0 5.222 3.807 7.325 7.466 7.325 3.267 0 4.96-2.076 5.375-4.426h-2.649zM13.984 13.536c0-2.448 1.332-3.896 3.2-3.896 1.869 0 3.198 1.448 3.198 3.896 0 2.448-1.329 3.896-3.198 3.896-1.868 0-3.2-1.448-3.2-3.896z"/>
                    </svg>
                  </a>
                )}
                {user.contact_info.medium && (
                  <a
                    href={user.contact_info.medium.startsWith('http') ? user.contact_info.medium : `https://${user.contact_info.medium}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group relative p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
                      isDark 
                        ? 'bg-[#2a2a2a]/80 border border-[#10a37f]/20 hover:bg-[#10a37f]/20 hover:border-[#10a37f]/40' 
                        : 'bg-white/80 border border-gray-200 hover:bg-[#10a37f]/10 hover:border-[#10a37f]/40'
                    } shadow-lg hover:shadow-xl`}
                    title="Medium Profile"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    <svg className="relative w-5 h-5 text-[#00ab6c] group-hover:text-[#00ab6c] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
                    </svg>
                  </a>
                )}
                {user.contact_info.instagram && (
                  <a
                    href={user.contact_info.instagram.startsWith('http') ? user.contact_info.instagram : `https://${user.contact_info.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group relative p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
                      isDark 
                        ? 'bg-[#2a2a2a]/80 border border-[#10a37f]/20 hover:bg-[#10a37f]/20 hover:border-[#10a37f]/40' 
                        : 'bg-white/80 border border-gray-200 hover:bg-[#10a37f]/10 hover:border-[#10a37f]/40'
                    } shadow-lg hover:shadow-xl`}
                    title="Instagram Profile"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    <svg className="relative w-5 h-5 text-[#e4405f] group-hover:text-[#e4405f] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.928-.875-1.418-2.026-1.418-3.244s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244z"/>
                    </svg>
                  </a>
                )}
                {user.contact_info.facebook && (
                  <a
                    href={user.contact_info.facebook.startsWith('http') ? user.contact_info.facebook : `https://${user.contact_info.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group relative p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
                      isDark 
                        ? 'bg-[#2a2a2a]/80 border border-[#10a37f]/20 hover:bg-[#10a37f]/20 hover:border-[#10a37f]/40' 
                        : 'bg-white/80 border border-gray-200 hover:bg-[#10a37f]/10 hover:border-[#10a37f]/40'
                    } shadow-lg hover:shadow-xl`}
                    title="Facebook Profile"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    <svg className="relative w-5 h-5 text-[#1877f2] group-hover:text-[#1877f2] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                )}
                {user.contact_info.youtube && (
                  <a
                    href={user.contact_info.youtube.startsWith('http') ? user.contact_info.youtube : `https://${user.contact_info.youtube}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group relative p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
                      isDark 
                        ? 'bg-[#2a2a2a]/80 border border-[#10a37f]/20 hover:bg-[#10a37f]/20 hover:border-[#10a37f]/40' 
                        : 'bg-white/80 border border-gray-200 hover:bg-[#10a37f]/10 hover:border-[#10a37f]/40'
                    } shadow-lg hover:shadow-xl`}
                    title="YouTube Channel"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    <svg className="relative w-5 h-5 text-[#ff0000] group-hover:text-[#ff0000] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                )}
              </div>
            )}

            {/* Stats Row */}
            <div className="flex justify-center space-x-8">
              <div className="text-center">
                <div className={`text-2xl font-bold ${getThemeClasses(isDark).text.primary}`}>
                  {(() => {
                    if (user.experience && user.experience.trim() !== '') {
                      return user.experience;
                    }
                    const calculatedExp = calculateTotalExperience(user.experience_details || []);
                    return calculatedExp || 'N/A';
                  })()}
                </div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Experience</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getThemeClasses(isDark).text.primary}`}>{(user.skills || []).length}</div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Skills</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getThemeClasses(isDark).text.primary}`}>{(user.projects || []).length}</div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Projects</div>
              </div>
            </div>

            {/* Action Buttons Row - Only show in view mode */}
            {!isEditMode && (
              <div className="flex justify-center items-center gap-4 mt-6">
                {/* AI Analysis Button */}
                {onOpenAIAnalysis && (
                  <div className="relative group">
                    {/* Gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f]/20 via-[#0d8f6f]/15 to-[#10a37f]/20 rounded-xl blur-sm group-hover:blur-md transition-all duration-300"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f]/10 via-transparent to-[#10a37f]/10 rounded-xl"></div>
                    
                    {/* Button content */}
                    <button
                      onClick={onOpenAIAnalysis}
                      className={`relative flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 backdrop-blur-sm border ${
                        isDark 
                          ? 'bg-[#2a2a2a]/60 border-[#10a37f]/30 text-white hover:bg-[#2a2a2a]/80 hover:border-[#10a37f]/50' 
                          : 'bg-white/60 border-[#10a37f]/30 text-gray-900 hover:bg-white/80 hover:border-[#10a37f]/50'
                      } shadow-lg hover:shadow-xl transform hover:scale-105`}
                      title="Get AI analysis of this profile"
                    >
                      {/* Icon with gradient */}
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full blur-sm opacity-60"></div>
                        <Sparkles className="relative w-5 h-5 text-[#10a37f]" />
                      </div>
                      <span className="font-semibold text-base">AI Analysis</span>
                      
                      {/* Hover effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f]/5 via-transparent to-[#10a37f]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                  </div>
                )}

                {/* Create Cover Letter Button */}
                {isCurrentUser && (
                  <div className="relative group">
                    {/* Gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f]/20 via-[#0d8f6f]/15 to-[#10a37f]/20 rounded-xl blur-sm group-hover:blur-md transition-all duration-300"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f]/10 via-transparent to-[#10a37f]/10 rounded-xl"></div>
                    
                    {/* Button content */}
                    <button
                      onClick={() => window.location.href = '/ai-writer'}
                      className={`relative flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 backdrop-blur-sm border ${
                        isDark 
                          ? 'bg-[#2a2a2a]/60 border-[#10a37f]/30 text-white hover:bg-[#2a2a2a]/80 hover:border-[#10a37f]/50' 
                          : 'bg-white/60 border-[#10a37f]/30 text-gray-900 hover:bg-white/80 hover:border-[#10a37f]/50'
                      } shadow-lg hover:shadow-xl transform hover:scale-105`}
                      title="Create a professional cover letter using your profile"
                    >
                      {/* Icon with gradient */}
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full blur-sm opacity-60"></div>
                        <FileText className="relative w-5 h-5 text-[#10a37f]" />
                      </div>
                      <span className="font-semibold text-base">Create Cover Letter</span>
                      
                      {/* Hover effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f]/5 via-transparent to-[#10a37f]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Edit Mode Buttons Row - Only show for current user in edit mode */}
            {isCurrentUser && isEditMode && (
              <div className="flex justify-center items-center gap-4 mt-4">
                {/* Edit Basic Info Button */}
                {onEditContact && (
                  <div className="relative group">
                    {/* Gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f]/20 via-[#0d8f6f]/15 to-[#10a37f]/20 rounded-xl blur-sm group-hover:blur-md transition-all duration-300"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f]/10 via-transparent to-[#10a37f]/10 rounded-xl"></div>
                    
                    {/* Button content */}
                    <button
                      onClick={onEditContact}
                      className={`relative flex items-center gap-3 px-6 py-2.5 rounded-xl transition-all duration-300 backdrop-blur-sm border ${
                        isDark 
                          ? 'bg-[#2a2a2a]/60 border-[#10a37f]/30 text-white hover:bg-[#2a2a2a]/80 hover:border-[#10a37f]/50' 
                          : 'bg-white/60 border-[#10a37f]/30 text-gray-900 hover:bg-white/80 hover:border-[#10a37f]/50'
                      } shadow-lg hover:shadow-xl transform hover:scale-105`}
                      title="Edit Basic Info"
                    >
                      {/* Icon with gradient */}
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full blur-sm opacity-60"></div>
                        <Edit className="relative w-4 h-4 text-[#10a37f]" />
                      </div>
                      <span className="font-semibold text-base">Edit Basic Info</span>
                      
                      {/* Hover effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f]/5 via-transparent to-[#10a37f]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                  </div>
                )}

                {/* Create Cover Letter Button */}
                <div className="relative group">
                  {/* Gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f]/20 via-[#0d8f6f]/15 to-[#10a37f]/20 rounded-xl blur-sm group-hover:blur-md transition-all duration-300"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f]/10 via-transparent to-[#10a37f]/10 rounded-xl"></div>
                  
                  {/* Button content */}
                  <button
                    onClick={() => window.location.href = '/ai-writer'}
                    className={`relative flex items-center gap-3 px-6 py-2.5 rounded-xl transition-all duration-300 backdrop-blur-sm border ${
                      isDark 
                        ? 'bg-[#2a2a2a]/60 border-[#10a37f]/30 text-white hover:bg-[#2a2a2a]/80 hover:border-[#10a37f]/50' 
                        : 'bg-white/60 border-[#10a37f]/30 text-gray-900 hover:bg-white/80 hover:border-[#10a37f]/50'
                    } shadow-lg hover:shadow-xl transform hover:scale-105`}
                    title="Create a professional cover letter using your profile"
                  >
                    {/* Icon with gradient */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full blur-sm opacity-60"></div>
                      <FileText className="relative w-5 h-5 text-[#10a37f]" />
                    </div>
                    <span className="font-semibold text-base">Create Cover Letter</span>
                    
                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f]/5 via-transparent to-[#10a37f]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              </div>
            )}
          </div>
          )}

          {/* Sections Container */}
          <div className="space-y-6">
            {/* Show Empty Profile Section only when profile is empty and in view mode */}
            {(() => {
              const isEmpty = isProfileEmpty(user)
              const shouldShow = !isEditMode && isCurrentUser && isEmpty
              return shouldShow && (
                <EmptyProfileSection
                  user={user}
                  isEditMode={isEditMode}
                  onEditModeToggle={onEditModeToggle}
                />
              )
            })()}
            <ProfileSections
              user={user}
              isEditMode={isEditMode}
              onEditAbout={onEditAbout}
              onEditSkills={onEditSkills}
              onEditExperience={onEditExperience}
              onEditSingleExperience={onEditSingleExperience}
              onDeleteSingleExperience={onDeleteSingleExperience}
              onEditProject={onEditProject}
              onEditSingleProject={onEditSingleProject}
              onDeleteSingleProject={onDeleteSingleProject}
              onDeleteAbout={onDeleteAbout}
              onDeleteSkills={onDeleteSkills}
              onDeleteExperience={onDeleteExperience}
              onDeleteProjects={onDeleteProjects}
              onEditEducation={onEditEducation}
              onEditSingleEducation={onEditSingleEducation}
              onDeleteSingleEducation={onDeleteSingleEducation}
              onDeleteEducation={onDeleteEducation}
              onEditContact={onEditContact}
              onDeleteContact={onDeleteContact}
              onEditLanguage={onEditLanguage}
              onDeleteLanguage={onDeleteLanguage}
              onAddLanguage={onAddLanguage}
              onDeleteLanguages={onDeleteLanguages}
              onEditAward={onEditAward}
              onDeleteAward={onDeleteAward}
              onAddAward={onAddAward}
              onDeleteAwards={onDeleteAwards}
              onEditPublication={onEditPublication}
              onDeletePublication={onDeletePublication}
              onAddPublication={onAddPublication}
              onDeletePublications={onDeletePublications}
              onEditVolunteerExperience={onEditVolunteerExperience}
              onDeleteVolunteerExperience={onDeleteVolunteerExperience}
              onAddVolunteerExperience={onAddVolunteerExperience}
              onDeleteVolunteerExperiences={onDeleteVolunteerExperiences}
              onEditInterests={onEditInterests}
              onDeleteInterests={onDeleteInterests}
              onAddInterests={onAddInterests}
              onEditPreferences={onEditPreferences}
              onSectionOrderChange={onSectionOrderChange}
              onAddSection={onAddSection}
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
    </div>
  )
})

export default DefaultProfileVariant
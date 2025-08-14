"use client"

import React, { memo } from 'react'
import {
  MapPin,
  Edit,
  Sparkles,
  Mail,
  Phone,
} from "lucide-react"
import { User as UserType } from "@/types"
import { useTheme } from "@/context/ThemeContext"
import { getThemeClasses } from "@/utils/theme"
import { calculateTotalExperience } from "@/utils/experienceCalculator"
import { getImageUrl } from '@/utils/imageUtils'
import { formatLinkedInUrl, isLocalProfileUrl } from '@/utils/contactUtils'
import VariantAwareProfileSections from '@/components/sections/variants/VariantAwareProfileSections'
import ProfileCompletionSection from '@/components/sections/ProfileCompletionSection'

interface CompactProfileVariantProps {
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
}

const CompactProfileVariant = memo(function CompactProfileVariant({
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
  onOpenAIAnalysis
}: CompactProfileVariantProps) {
  const { isDark } = useTheme()
  const theme = getThemeClasses(isDark)

  return (
    <div className={`${isDark ? 'bg-[#212121]' : 'bg-gray-50'} h-full overflow-y-auto relative scrollbar-hide`}>
      {/* Minimal Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#10a37f]/3 via-transparent to-[#10a37f]/5"></div>
      
      {/* Content Container - More compact with top margin for non-default variant */}
      <div className="h-full overflow-y-auto relative z-10 scrollbar-hide">
        <div className="p-6 max-w-3xl mx-auto space-y-4 mt-16">
          {/* Compact Hero Section - Horizontal Layout */}
          <div className={`${isDark ? 'bg-[#2a2a2a]/50' : 'bg-white/70'} backdrop-blur-sm rounded-xl p-6 border ${theme.border.primary} shadow-lg`}>
            <div className="flex items-center gap-6">
              {/* Profile Picture - Smaller */}
              <div className="relative flex-shrink-0">
                <img
                  src={getImageUrl(user.profile_picture)}
                  alt={user.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#10a37f]/30 shadow-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder-user.jpg";
                  }}
                />
                {isCurrentUser && onEditPhoto && (
                  <button
                    onClick={onEditPhoto}
                    className="absolute -bottom-1 -right-1 bg-[#10a37f] text-white p-1.5 rounded-full hover:bg-[#0d8f6f] transition-colors shadow-lg border border-white"
                    title="Edit profile picture"
                  >
                    <Edit className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Name & Info */}
              <div className="flex-1 min-w-0">
                <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} truncate`}>
                  {user.name}
                </h1>
                <p className="text-lg text-[#10a37f] font-medium truncate">{user.designation}</p>
                <div className={`flex items-center mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  <MapPin className="w-3 h-3 mr-1" />
                  <span className="text-sm truncate">{user.location}</span>
                </div>
              </div>

              {/* Compact Stats */}
              <div className="flex gap-4 text-center">
                <div>
                  <div className={`text-lg font-bold ${theme.text.primary}`}>
                    {(() => {
                      if (user.experience && user.experience.trim() !== '') {
                        return user.experience;
                      }
                      const calculatedExp = calculateTotalExperience(user.experience_details || []);
                      return calculatedExp || 'N/A';
                    })()}
                  </div>
                  <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Experience</div>
                </div>
                <div>
                  <div className={`text-lg font-bold ${theme.text.primary}`}>{(user.skills || []).length}</div>
                  <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Skills</div>
                </div>
                <div>
                  <div className={`text-lg font-bold ${theme.text.primary}`}>{(user.projects || []).length}</div>
                  <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Projects</div>
                </div>
              </div>
            </div>

            {/* Compact Contact Row */}
            {user.contact_info && Object.values(user.contact_info).some(value => value) && (
              <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                {user.contact_info.email && (
                  <a
                    href={`mailto:${user.contact_info.email}`}
                    className={`p-2 rounded-lg transition-colors ${
                      isDark 
                        ? 'bg-[#1a1a1a] hover:bg-[#10a37f]/20' 
                        : 'bg-gray-100 hover:bg-[#10a37f]/10'
                    }`}
                    title={user.contact_info.email}
                  >
                    <Mail className="w-4 h-4 text-[#10a37f]" />
                  </a>
                )}
                {user.contact_info.phone && (
                  <a
                    href={`tel:${user.contact_info.phone}`}
                    className={`p-2 rounded-lg transition-colors ${
                      isDark 
                        ? 'bg-[#1a1a1a] hover:bg-[#10a37f]/20' 
                        : 'bg-gray-100 hover:bg-[#10a37f]/10'
                    }`}
                    title={user.contact_info.phone}
                  >
                    <Phone className="w-4 h-4 text-[#10a37f]" />
                  </a>
                )}
                {user.contact_info.linkedin && (
                  <a
                    href={formatLinkedInUrl(user.contact_info.linkedin)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-lg transition-colors ${
                      isDark 
                        ? 'bg-[#1a1a1a] hover:bg-[#10a37f]/20' 
                        : 'bg-gray-100 hover:bg-[#10a37f]/10'
                    }`}
                    title="LinkedIn Profile"
                  >
                    <svg className="w-4 h-4 text-[#10a37f]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                )}
                {user.contact_info.github && (
                  <a
                    href={user.contact_info.github.startsWith('http') ? user.contact_info.github : `https://${user.contact_info.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-lg transition-colors ${
                      isDark 
                        ? 'bg-[#1a1a1a] hover:bg-[#10a37f]/20' 
                        : 'bg-gray-100 hover:bg-[#10a37f]/10'
                    }`}
                    title="GitHub Profile"
                  >
                    <svg className="w-4 h-4 text-[#10a37f]" fill="currentColor" viewBox="0 0 24 24">
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
                      className={`p-2 rounded-lg transition-colors ${
                        isDark 
                          ? 'bg-[#1a1a1a] hover:bg-[#10a37f]/20' 
                          : 'bg-gray-100 hover:bg-[#10a37f]/10'
                      }`}
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
                    </a>
                  )
                )}
                {user.contact_info.twitter && (
                  <a
                    href={user.contact_info.twitter.startsWith('http') ? user.contact_info.twitter : `https://${user.contact_info.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-lg transition-colors ${
                      isDark 
                        ? 'bg-[#1a1a1a] hover:bg-[#10a37f]/20' 
                        : 'bg-gray-100 hover:bg-[#10a37f]/10'
                    }`}
                    title="Twitter Profile"
                  >
                    <svg className="w-4 h-4 text-[#10a37f]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                )}
                {user.contact_info.website && (
                  <a
                    href={user.contact_info.website.startsWith('http') ? user.contact_info.website : `https://${user.contact_info.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-lg transition-colors ${
                      isDark 
                        ? 'bg-[#1a1a1a] hover:bg-[#10a37f]/20' 
                        : 'bg-gray-100 hover:bg-[#10a37f]/10'
                    }`}
                    title="Personal Website"
                  >
                    <svg className="w-4 h-4 text-[#10a37f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                    </svg>
                  </a>
                )}
              </div>
            )}

            {/* Action Buttons Row */}
            <div className="flex items-center justify-center gap-4 mt-4">
              {/* AI Analysis Button */}
              {!isEditMode && onOpenAIAnalysis && (
                <button
                  onClick={onOpenAIAnalysis}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isDark 
                      ? 'bg-[#1a1a1a] border border-[#10a37f]/30 text-white hover:bg-[#10a37f]/20' 
                      : 'bg-gray-100 border border-[#10a37f]/30 text-gray-900 hover:bg-[#10a37f]/10'
                  } shadow-sm hover:shadow-md`}
                  title="Get AI analysis"
                >
                  <Sparkles className="w-4 h-4 text-[#10a37f]" />
                  <span className="text-sm font-medium">AI Analysis</span>
                </button>
              )}

              {/* Edit Basic Info Button */}
              {isCurrentUser && isEditMode && onEditContact && (
                <button
                  onClick={onEditContact}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isDark 
                      ? 'bg-[#1a1a1a] border border-[#10a37f]/30 text-white hover:bg-[#10a37f]/20' 
                      : 'bg-gray-100 border border-[#10a37f]/30 text-gray-900 hover:bg-[#10a37f]/10'
                  } shadow-sm hover:shadow-md`}
                  title="Edit Basic Info"
                >
                  <Edit className="w-4 h-4 text-[#10a37f]" />
                  <span className="text-sm font-medium">Edit Info</span>
                </button>
              )}
            </div>
          </div>

          {/* Compact Sections Container */}
          <div className="space-y-4">
            {/* Profile Completion Section - Always at top in edit mode */}
            {isEditMode && (
              <ProfileCompletionSection
                user={user}
                isEditMode={isEditMode}
                onEditAbout={onEditAbout}
                onEditSkills={onEditSkills}
                onEditExperience={onEditExperience}
                onEditProject={onEditProject}
                onEditEducation={onEditEducation}
                onEditContact={onEditContact}
                onAddLanguage={onAddLanguage}
                onAddAward={onAddAward}
                onAddPublication={onAddPublication}
                onAddVolunteerExperience={onAddVolunteerExperience}
                onAddInterests={onAddInterests}
                onEditPreferences={onEditPreferences}
              />
            )}
            <VariantAwareProfileSections
              variant="compact"
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
          </div>
        </div>
      </div>
    </div>
  )
})

export default CompactProfileVariant
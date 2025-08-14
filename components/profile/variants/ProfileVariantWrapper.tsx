"use client"

import React from 'react'
import { ProfileVariant, User as UserType } from '@/types'
import DefaultProfileVariant from './DefaultProfileVariant'
import CompactProfileVariant from './CompactProfileVariant'
import AdvancedProfileVariant from './AdvancedProfileVariant'

interface ProfileVariantWrapperProps {
  variant: ProfileVariant
  user: UserType
  isEditMode?: boolean
  isCurrentUser?: boolean
  // All the edit handlers that the original PortfolioSection had
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

export default function ProfileVariantWrapper({
  variant,
  user,
  isEditMode = false,
  isCurrentUser = false,
  ...props
}: ProfileVariantWrapperProps) {
  // Get the variant from user data, fallback to prop, then fallback to default
  const effectiveVariant = (user.profile_variant as ProfileVariant) || variant || 'default'
  
  const commonProps = {
    user,
    isEditMode,
    isCurrentUser,
    ...props
  }

  switch (effectiveVariant) {
    case 'compact':
      return <CompactProfileVariant {...commonProps} />
    case 'advanced':
      return <AdvancedProfileVariant {...commonProps} />
    case 'default':
    default:
      return <DefaultProfileVariant {...commonProps} />
  }
}
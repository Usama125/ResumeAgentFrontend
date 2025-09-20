"use client"

import React, { useState, useEffect } from 'react'
import { ProfileVariant, User as UserType } from '@/types'
import DefaultProfileVariant from './DefaultProfileVariant'
import CompactProfileVariant from './CompactProfileVariant'
import AdvancedProfileVariant from './AdvancedProfileVariant'
import DefaultMobileProfileVariant from './mobile/DefaultMobileProfileVariant'
import CompactMobileProfileVariant from './mobile/CompactMobileProfileVariant'
import AdvancedMobileProfileVariant from './mobile/AdvancedMobileProfileVariant'

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
  onAddProject?: () => void
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

export default function ProfileVariantWrapper({
  variant,
  user,
  isEditMode = false,
  isCurrentUser = false,
  ...props
}: ProfileVariantWrapperProps) {
  const [isMobile, setIsMobile] = useState(false)

  // Check if device is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
      const isMobileAgent = mobileRegex.test(userAgent)
      const isSmallScreen = window.innerWidth <= 768
      setIsMobile(isMobileAgent || isSmallScreen)
    }

    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  // Get the variant from user data, fallback to prop, then fallback to default
  const effectiveVariant = (user.profile_variant as ProfileVariant) || variant || 'default'
  
  const commonProps = {
    user,
    isEditMode,
    isCurrentUser,
    ...props
  }

  // Route to mobile or desktop variants
  if (isMobile) {
    switch (effectiveVariant) {
      case 'compact':
        return <CompactMobileProfileVariant {...commonProps} />
      case 'advanced':
        return <AdvancedMobileProfileVariant {...commonProps} />
      case 'default':
      default:
        return <DefaultMobileProfileVariant {...commonProps} />
    }
  } else {
    // Desktop variants
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
}
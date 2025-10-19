"use client"

import React from 'react'
import { useSettings } from '@/context/SettingsContext'
import { useAuth } from '@/context/AuthContext'
import ProfileSettingsModal from '@/components/ProfileSettingsModal'
import MobileProfileSettingsModal from '@/components/MobileProfileSettingsModal'
import { ProfileVariant } from '@/types'

export default function GlobalSettingsModal() {
  const { isProfileSettingsModalOpen, closeProfileSettings, handleProfileVariantChange } = useSettings()
  const { user, updateUser } = useAuth()

  const handleVariantChange = async (variant: ProfileVariant) => {
    try {
      await handleProfileVariantChange(variant)
      // Update the user context with the new variant
      if (user) {
        updateUser({ profile_variant: variant })
      }
    } catch (error) {
      console.error('Error updating profile variant:', error)
      throw error
    }
  }

  if (!user) return null

  return (
    <>
      {/* Desktop Profile Settings Modal */}
      <div className="hidden md:block">
        <ProfileSettingsModal
          isOpen={isProfileSettingsModalOpen}
          onClose={closeProfileSettings}
          user={user}
          onVariantChange={handleVariantChange}
        />
      </div>
      
      {/* Mobile Profile Settings Modal */}
      <div className="block md:hidden">
        <MobileProfileSettingsModal
          isOpen={isProfileSettingsModalOpen}
          onClose={closeProfileSettings}
          currentVariant={(user.profile_variant as ProfileVariant) || 'default'}
          onVariantChange={handleVariantChange}
        />
      </div>
    </>
  )
}

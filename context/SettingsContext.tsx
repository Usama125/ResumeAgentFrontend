"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { User, ProfileVariant } from '@/types'

interface SettingsContextType {
  isProfileSettingsModalOpen: boolean
  openProfileSettings: () => void
  closeProfileSettings: () => void
  handleProfileVariantChange: (variant: ProfileVariant) => Promise<void>
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

interface SettingsProviderProps {
  children: ReactNode
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [isProfileSettingsModalOpen, setIsProfileSettingsModalOpen] = useState(false)

  const openProfileSettings = () => {
    setIsProfileSettingsModalOpen(true)
  }

  const closeProfileSettings = () => {
    setIsProfileSettingsModalOpen(false)
  }

  const handleProfileVariantChange = async (variant: ProfileVariant) => {
    try {
      // Import UserService dynamically to avoid circular dependencies
      const { UserService } = await import('@/services/user')
      await UserService.updateProfileVariant(variant)
      
      // Refresh user data in auth context
      const { useAuth } = await import('@/context/AuthContext')
      // Note: We'll need to access the auth context differently since we can't use hooks here
      // This will be handled by the component that uses this context
      
      console.log('Profile variant updated successfully:', variant)
    } catch (error) {
      console.error('Error updating profile variant:', error)
      throw error
    }
  }

  const value: SettingsContextType = {
    isProfileSettingsModalOpen,
    openProfileSettings,
    closeProfileSettings,
    handleProfileVariantChange
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}

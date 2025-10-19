"use client"

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { User, Settings, LogOut, ChevronDown, Edit, Search, Sparkles } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { getThemeClasses } from '@/utils/theme'
import { useToast } from '@/hooks/use-toast'

import { getImageUrl } from '@/utils/imageUtils';
import { GradientAvatar } from '@/components/ui/avatar';

interface UserDropdownProps {
  onEditProfile?: () => void;
  onOpenSettings?: () => void;
}

export default function UserDropdown({ onEditProfile, onOpenSettings }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null)
  const [mounted, setMounted] = useState(false)
  const [imageError, setImageError] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { user, logout } = useAuth()
  const { isDark } = useTheme()
  const router = useRouter()
  const { toast } = useToast()
  
  // Get theme classes
  const themeClasses = getThemeClasses(isDark)

  // Handle mounting for portal
  useEffect(() => {
    setMounted(true)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleProfile = () => {
    setIsOpen(false)
    router.push('/profile')
  }

  const handleEditProfile = () => {
    setIsOpen(false)
    if (onEditProfile) {
      onEditProfile();
    } else {
      router.push('/profile')
      // Could trigger edit modal after navigation
    }
  }

  const handleSearchProfiles = () => {
    setIsOpen(false)
    router.push('/explore')
  }

  const handleAIWriter = () => {
    setIsOpen(false)
    router.push('/ai-writer')
  }

  const handleSettings = () => {
    setIsOpen(false)
    if (onOpenSettings) {
      onOpenSettings()
    } else {
      console.log('Settings clicked - no handler provided')
    }
  }


  const handleLogout = () => {
    setIsOpen(false)
    logout()
  }

  const handleToggleDropdown = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setButtonRect(rect)
    }
    setIsOpen(!isOpen)
  }

  if (!user) return null

  return (
    <>
      {/* User Button */}
      <button
        ref={buttonRef}
        onClick={handleToggleDropdown}
        className={`flex items-center space-x-3 p-2 rounded-xl hover:${themeClasses.bg.tertiary}/50 transition-all duration-300 border border-transparent hover:border-[#10a37f]/30`}
      >
        {/* Profile Picture */}
        <div className="relative">
          <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-[#10a37f]/30">
            {user.profile_picture && !imageError ? (
              <img 
                src={getImageUrl(user.profile_picture)} 
                alt={user.name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <GradientAvatar className="w-8 h-8" isDark={isDark} />
            )}
          </div>
          {/* Online indicator */}
          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 ${themeClasses.bg.primary.replace('bg-', 'border-')}`}></div>
        </div>

        {/* User Info */}
        <div className="hidden sm:block text-left">
          <p className={`text-sm font-medium ${themeClasses.text.primary}`}>{user.name}</p>
          <p className={`text-xs ${themeClasses.text.tertiary} truncate max-w-32`}>{user.username}</p>
        </div>

        {/* Dropdown Arrow */}
        <ChevronDown className={`w-4 h-4 ${themeClasses.text.tertiary} transition-transform duration-200 ${
          isOpen ? 'rotate-180' : ''
        }`} />
      </button>

      {/* Dropdown Menu Portal */}
      {isOpen && mounted && buttonRect && createPortal(
        <div 
          ref={dropdownRef}
          className={`fixed w-48 sm:w-56 ${themeClasses.bg.secondary} border ${themeClasses.border.secondary} rounded-xl shadow-xl z-[9999] overflow-hidden`}
          style={{
            top: buttonRect.bottom + 8,
            right: Math.max(8, window.innerWidth - buttonRect.right), // Ensure minimum margin on mobile
          }}
        >
          {/* User Info Header */}
          <div className={`px-4 py-3 border-b ${themeClasses.border.primary}/30`}>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#10a37f]/30">
                {user.profile_picture && !imageError ? (
                  <img 
                    src={getImageUrl(user.profile_picture)} 
                    alt={user.name}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <GradientAvatar className="w-10 h-10" isDark={isDark} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${themeClasses.text.primary} truncate`}>{user.name}</p>
                <p className={`text-xs ${themeClasses.text.tertiary} truncate`}>{user.email}</p>
                {user.designation && (
                  <p className="text-xs text-[#10a37f] truncate">{user.designation}</p>
                )}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <div
              onClick={handleProfile}
              className={`w-full px-4 py-2 text-left text-sm ${themeClasses.text.secondary} hover:${themeClasses.bg.tertiary}/50 hover:${themeClasses.text.primary} transition-colors flex items-center space-x-3 cursor-pointer`}
            >
              <User className="w-4 h-4" />
              <span>View Profile</span>
            </div>
            
            <div
              onClick={handleSearchProfiles}
              className={`w-full px-4 py-2 text-left text-sm ${themeClasses.text.secondary} hover:${themeClasses.bg.tertiary}/50 hover:${themeClasses.text.primary} transition-colors flex items-center space-x-3 cursor-pointer`}
            >
              <Search className="w-4 h-4" />
              <span>Browse Profiles</span>
            </div>

            <div
              onClick={handleAIWriter}
              className={`w-full px-4 py-2 text-left text-sm ${themeClasses.text.secondary} hover:${themeClasses.bg.tertiary}/50 hover:${themeClasses.text.primary} transition-colors flex items-center space-x-3 group cursor-pointer`}
            >
              <Sparkles className="w-4 h-4 text-[#10a37f] group-hover:text-[#0d8f6f]" />
              <span>AI Writer</span>
            </div>

            
            <div
              onClick={handleSettings}
              className={`w-full px-4 py-2 text-left text-sm ${themeClasses.text.secondary} hover:${themeClasses.bg.tertiary}/50 hover:${themeClasses.text.primary} transition-colors flex items-center space-x-3 cursor-pointer`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </div>
          </div>

          {/* Logout Section */}
          <div className={`border-t ${themeClasses.border.primary}/30 py-2`}>
            <div
              onClick={handleLogout}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-red-500/10 transition-colors flex items-center space-x-3 cursor-pointer ${isDark ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'}`}
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
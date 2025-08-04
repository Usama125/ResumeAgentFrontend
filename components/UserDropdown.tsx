"use client"

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { User, Settings, LogOut, ChevronDown, Edit, Search, MessageCircle, Download } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { getThemeClasses } from '@/utils/theme'
import { useToast } from '@/hooks/use-toast'

import { getImageUrl } from '@/utils/imageUtils';

interface UserDropdownProps {
  onEditProfile?: () => void;
}

export default function UserDropdown({ onEditProfile }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null)
  const [mounted, setMounted] = useState(false)
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
    router.push('/')
  }

  const handleSettings = () => {
    setIsOpen(false)
    // TODO: Add settings page
    console.log('Settings clicked - not implemented yet')
  }

  const handleDownloadProfile = async () => {
    setIsOpen(false)
    
    if (!user || !user.username) {
      toast({
        title: "Error",
        description: "Username not found. Please try again.",
        variant: "destructive"
      })
      return
    }

    // Show progress toast
    const progressToast = toast({
      title: "Generating Profile PDF",
      description: (
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#10a37f] border-t-transparent"></div>
          <span>Creating your professional profile PDF, please wait...</span>
        </div>
      ),
      duration: 0, // Don't auto-dismiss
    })

    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username: user.username 
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate PDF')
      }

      // Create blob from response
      const blob = await response.blob()
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `${user.username}-profile.pdf`
      
      // Trigger download
      document.body.appendChild(a)
      a.click()
      
      // Cleanup
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      // Show success toast
      toast({
        title: "Profile PDF Ready!",
        description: "Your professional profile has been downloaded successfully.",
      })
      
    } catch (error) {
      console.error('❌ Error downloading profile PDF:', error)
      
      // Show error toast
      toast({
        title: "PDF Generation Failed",
        description: "Unable to generate your profile PDF. Please try again.",
        variant: "destructive"
      })
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
            <img 
              src={getImageUrl(user.profile_picture)} 
              alt={user.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder-user.jpg";
              }}
            />
          </div>
          {/* Online indicator */}
          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 ${themeClasses.bg.primary.replace('bg-', 'border-')}`}></div>
        </div>

        {/* User Info */}
        <div className="hidden sm:block text-left">
          <p className={`text-sm font-medium ${themeClasses.text.primary}`}>{user.name}</p>
          <p className={`text-xs ${themeClasses.text.tertiary} truncate max-w-32`}>{user.email}</p>
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
                <img 
                  src={getImageUrl(user.profile_picture)} 
                  alt={user.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder-user.jpg";
                  }}
                />
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
            <button
              onClick={handleProfile}
              className={`w-full px-4 py-2 text-left text-sm ${themeClasses.text.secondary} hover:${themeClasses.bg.tertiary}/50 hover:${themeClasses.text.primary} transition-colors flex items-center space-x-3`}
            >
              <User className="w-4 h-4" />
              <span>View Profile</span>
            </button>
            
            {/* <button
              onClick={handleEditProfile}
              className={`w-full px-4 py-2 text-left text-sm ${themeClasses.text.secondary} hover:${themeClasses.bg.tertiary}/50 hover:${themeClasses.text.primary} transition-colors flex items-center space-x-3`}
            >
              <Edit className="w-4 h-4" />
              <span>Edit Profile</span>
            </button> */}

            <button
              onClick={handleSearchProfiles}
              className={`w-full px-4 py-2 text-left text-sm ${themeClasses.text.secondary} hover:${themeClasses.bg.tertiary}/50 hover:${themeClasses.text.primary} transition-colors flex items-center space-x-3`}
            >
              <Search className="w-4 h-4" />
              <span>Browse Profiles</span>
            </button>

            <button
              onClick={handleDownloadProfile}
              className={`w-full px-4 py-2 text-left text-sm ${themeClasses.text.secondary} hover:${themeClasses.bg.tertiary}/50 hover:${themeClasses.text.primary} transition-colors flex items-center space-x-3`}
            >
              <Download className="w-4 h-4" />
              <span>Download Profile</span>
            </button>
            
            <button
              onClick={handleSettings}
              className={`w-full px-4 py-2 text-left text-sm ${themeClasses.text.secondary} hover:${themeClasses.bg.tertiary}/50 hover:${themeClasses.text.primary} transition-colors flex items-center space-x-3`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>

          {/* Logout Section */}
          <div className={`border-t ${themeClasses.border.primary}/30 py-2`}>
            <button
              onClick={handleLogout}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-red-500/10 transition-colors flex items-center space-x-3 ${isDark ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'}`}
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
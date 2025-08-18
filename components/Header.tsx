"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Menu, X, Home, Search, Sparkles, Key, Rocket, Moon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { useTheme } from "@/context/ThemeContext"
import UserDropdown from "@/components/UserDropdown"
import ThemeToggle from "@/components/ThemeToggle"

interface HeaderProps {
  variant?: 'home' | 'profile' | 'auth' | 'onboarding' | 'default' | 'ai-writer'
  showBackButton?: boolean
  onEditProfile?: () => void
  profileData?: {
    name?: string
    profile_picture?: string
    is_looking_for_job?: boolean
  }
  isCurrentUserProfile?: boolean
}

import { getImageUrl } from '@/utils/imageUtils';

export default function Header({ variant = 'home', showBackButton = false, onEditProfile, profileData, isCurrentUserProfile = false }: HeaderProps) {
  const router = useRouter()
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const { isDark } = useTheme()
  const [isMobile, setIsMobile] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Mobile detection
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  const isProfilePage = variant === 'profile'
  const isHomePage = variant === 'home'
  const isAuthPage = variant === 'auth'
  const isDefaultPage = variant === 'default'
  const isAIWriterPage = variant === 'ai-writer'

  return (
    <header className="sticky top-0 z-40 w-full relative">
      {/* Enhanced gradient background for home page, explore page, and AI writer page */}
      {(isHomePage || isDefaultPage || isAIWriterPage) && (
        <>
          <div className={`absolute inset-0 transition-all duration-500 ${isDark ? 'bg-gradient-to-r from-[#1a1a1a] via-[#2f2f2f] to-[#1a1a1a]' : 'bg-gradient-to-r from-white via-gray-100 to-white'}`}></div>
          <div className={`absolute inset-0 transition-all duration-700 ${isDark ? 'bg-gradient-to-br from-[#10a37f]/10 via-transparent to-[#10a37f]/5' : 'bg-gradient-to-br from-[#10a37f]/5 via-transparent to-[#10a37f]/3'}`}></div>
          
          {/* Decorative elements with hover animations */}
          <div className="absolute top-0 left-20 w-32 h-32 bg-[#10a37f]/5 rounded-full blur-3xl animate-pulse hover:bg-[#10a37f]/10 transition-all duration-1000"></div>
          <div className="absolute top-0 right-20 w-24 h-24 bg-[#0d8f6f]/10 rounded-full blur-2xl hover:bg-[#0d8f6f]/15 transition-all duration-1000"></div>
          
          {/* Border gradient with animation */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#10a37f]/50 to-transparent hover:via-[#10a37f]/80 transition-all duration-300"></div>
          
          {/* Additional floating particles for hover effect */}
          <div className="absolute top-16 left-1/4 w-4 h-4 bg-[#10a37f]/20 rounded-full blur-sm animate-bounce opacity-60 hover:opacity-100 transition-opacity duration-500" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-24 right-1/3 w-3 h-3 bg-[#0d8f6f]/15 rounded-full blur-sm animate-bounce opacity-40 hover:opacity-80 transition-opacity duration-700" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-12 left-1/2 w-2 h-2 bg-[#10a37f]/30 rounded-full blur-sm animate-pulse opacity-50 hover:opacity-100 transition-opacity duration-400"></div>
        </>
      )}

      {/* Background for other pages */}
      {!isHomePage && !isDefaultPage && !isAIWriterPage && (
        <>
          {/* Profile page gets gradient background similar to home */}
          {isProfilePage ? (
            <>
              <div className={`absolute inset-0 transition-all duration-500 ${isDark ? 'bg-gradient-to-r from-[#1a1a1a] via-[#2f2f2f] to-[#1a1a1a]' : 'bg-gradient-to-r from-gray-50 via-white to-gray-50'}`}></div>
              <div className={`absolute inset-0 transition-all duration-700 ${isDark ? 'bg-gradient-to-br from-[#10a37f]/8 via-transparent to-[#10a37f]/4' : 'bg-gradient-to-br from-[#10a37f]/4 via-transparent to-[#10a37f]/2'}`}></div>
              <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#10a37f]/40 to-transparent`}></div>
            </>
          ) : (
            /* Simple background for auth/onboarding pages */
            <div className={`absolute inset-0 ${isDark ? 'bg-[#2f2f2f]' : 'bg-white'} ${isDark ? 'border-b border-[#565869]' : 'border-b border-gray-200'}`}></div>
          )}
        </>
      )}

      <div className="relative backdrop-blur-sm overflow-hidden">
        <div className="w-full px-2 sm:px-4 lg:px-6">
          <div className={`flex justify-between items-center ${(isHomePage || isDefaultPage || isAIWriterPage) ? 'h-16 py-2' : 'h-14'} min-w-0`}>
            
            {/* Left side content */}
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              
              {/* Back button for non-home pages */}
              {showBackButton && !isHomePage && (
                <Button
                  variant="ghost"
                  size="sm"
                  className={`mr-2 ${isDark ? 'text-gray-300 hover:text-white hover:bg-[#40414f]' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                  onClick={() => router.push("/")}
                >
                  <ArrowLeft className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Back to Home</span>
                </Button>
              )}

              {/* Logo and title for home, default, and AI writer pages */}
              {(isHomePage || isDefaultPage || isAIWriterPage) && (
                <>
                  <div className="relative group cursor-pointer" onClick={() => router.push("/")}>
                    <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-[#10a37f]/30 shadow-lg shadow-[#10a37f]/20 group-hover:ring-[#10a37f]/50 group-hover:shadow-[#10a37f]/40 transition-all duration-300 group-hover:scale-105">
                      <img src="/placeholder-user.jpg" alt="CVChatter" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-xl opacity-20 blur group-hover:opacity-40 transition-opacity duration-300"></div>
                  </div>
                  <div className="group cursor-pointer" onClick={() => router.push("/")}>
                    <h1 className={`text-xl sm:text-2xl font-bold transition-all duration-300 group-hover:scale-105 ${isDark ? 'bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent group-hover:from-white group-hover:via-[#10a37f] group-hover:to-gray-300' : 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent group-hover:from-gray-900 group-hover:via-[#10a37f] group-hover:to-gray-700'}`}>
                      CVChatter
                    </h1>
                    <p className={`text-xs mt-0.5 transition-all duration-300 group-hover:text-[#10a37f] ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Smart Profiles</p>
                  </div>
                  
                  {/* Navigation Links for all users (authenticated and guest) */}
                  <nav className="hidden md:flex items-center space-x-8" style={{ marginLeft: '6rem' }}>
                    <button
                      onClick={() => router.push("/")}
                      className={`text-sm font-medium transition-all duration-300 hover:scale-105 ${
                        isHomePage 
                          ? 'bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] bg-clip-text text-transparent' 
                          : isDark 
                            ? 'bg-gradient-to-r from-gray-300 to-gray-100 bg-clip-text text-transparent hover:from-[#10a37f] hover:to-[#0d8f6f]' 
                            : 'bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent hover:from-[#10a37f] hover:to-[#0d8f6f]'
                      }`}
                    >
                      Home
                    </button>
                    <button
                      onClick={() => router.push("/explore")}
                      className={`text-sm font-medium transition-all duration-300 hover:scale-105 ${
                        isDefaultPage 
                          ? 'bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] bg-clip-text text-transparent' 
                          : isDark 
                            ? 'bg-gradient-to-r from-gray-300 to-gray-100 bg-clip-text text-transparent hover:from-[#10a37f] hover:to-[#0d8f6f]' 
                            : 'bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent hover:from-[#10a37f] hover:to-[#0d8f6f]'
                      }`}
                    >
                      Explore Talent
                    </button>
                    <button
                      onClick={() => router.push("/ai-writer")}
                      className={`relative flex items-center gap-2 text-sm font-medium transition-all duration-300 hover:scale-105 ${
                        variant === 'ai-writer' 
                          ? 'bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] bg-clip-text text-transparent' 
                          : isDark 
                            ? 'bg-gradient-to-r from-gray-300 to-gray-100 bg-clip-text text-transparent hover:from-[#10a37f] hover:to-[#0d8f6f]' 
                            : 'bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent hover:from-[#10a37f] hover:to-[#0d8f6f]'
                      }`}
                    >
                      <span>✨</span>
                      AI Writer
                    </button>
                  </nav>
                </>
              )}

              {/* Profile info for profile pages */}
              {isProfilePage && profileData && (
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                  {/* Show profile picture only for public profiles (not current user's profile) */}
                  {!isCurrentUserProfile && (
                    <img
                      src={getImageUrl(profileData.profile_picture || null)}
                      alt={profileData.name || "Profile"}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover flex-shrink-0"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder-user.jpg";
                      }}
                    />
                  )}
                  <h1 className={`text-sm sm:text-lg font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {profileData.name}
                  </h1>
                  
                  {/* AI Writer Quick Link - Hidden on mobile */}
                  {!isMobile && (
                    <button
                      onClick={() => router.push("/ai-writer")}
                      className={`ml-4 text-sm font-medium transition-all duration-300 hover:scale-105 flex items-center gap-1 ${
                        isDark 
                          ? 'text-gray-300 hover:text-[#10a37f]' 
                          : 'text-gray-600 hover:text-[#10a37f]'
                      }`}
                    >
                      <span>✨</span>
                      AI Writer
                    </button>
                  )}
                </div>
              )}

              {/* Simple title for other pages */}
              {!isHomePage && !isProfilePage && !isDefaultPage && !isAIWriterPage && (
                <div>
                  <h1 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {variant === 'auth' ? 'Welcome Back' : variant === 'onboarding' ? 'Profile Setup' : 'AI Resume Builder'}
                  </h1>
                </div>
              )}
            </div>

                        {/* Right side content */}
            <div className="flex items-center space-x-1 sm:space-x-3 flex-shrink-0">
              
              {/* Mobile hamburger menu for guest users */}
              {isMobile && !isAuthenticated && (
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <button
                    onClick={() => setIsDrawerOpen(true)}
                    className={`relative p-3 rounded-xl transition-all duration-300 ${
                      isDark 
                        ? 'bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] text-gray-300 hover:text-white border border-[#10a37f]/30 hover:border-[#10a37f]/50 shadow-lg shadow-[#10a37f]/20 hover:shadow-[#10a37f]/40' 
                        : 'bg-gradient-to-br from-white to-gray-50 text-gray-600 hover:text-gray-900 border border-[#10a37f]/20 hover:border-[#10a37f]/40 shadow-lg shadow-[#10a37f]/10 hover:shadow-[#10a37f]/30'
                    }`}
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Theme toggle - hidden on mobile for guest users, visible for others */}
              {(!isMobile || isAuthenticated) && <ThemeToggle />}
              
              {/* Profile page specific buttons */}
              {/* {isProfilePage && onEditProfile && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`${isDark ? 'text-gray-300 hover:text-white hover:bg-[#40414f]' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                  onClick={onEditProfile}
                >
                  <Edit className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Edit Profile</span>
                </Button>
              )} */}

              {/* Auth state dependent content */}
              {authLoading ? (
                <div className={`w-8 h-8 rounded-full animate-pulse ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
              ) : isAuthenticated ? (
                <UserDropdown onEditProfile={isProfilePage ? onEditProfile : undefined} />
              ) : (
                !isAuthPage && (
                  <>
                    {/* Desktop auth buttons */}
                    <div className="hidden sm:flex items-center space-x-3">
                      <Button
                        variant="ghost"
                        className={`transition-all !px-4 duration-300 backdrop-blur-sm ${isDark ? 'text-gray-300 hover:text-white hover:bg-[#10a37f]/20 border border-transparent hover:border-[#10a37f]/30' : 'text-gray-600 hover:text-gray-900 hover:bg-[#10a37f]/10 border border-transparent hover:border-[#10a37f]/20'}`}
                        onClick={() => router.push("/auth")}
                      >
                        Sign In
                      </Button>
                      <Button 
                        className="bg-gradient-to-r !px-4 from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#0a7a5f] text-white px-6 py-2.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#10a37f]/25 hover:scale-105 border border-[#10a37f]/20" 
                        onClick={() => router.push("/auth")}
                      >
                        <span className="font-medium">Get Started</span>
                      </Button>
                    </div>
                  </>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Side Drawer */}
      {isMobile && !isAuthenticated && (
        <>
          {/* Backdrop */}
          {isDrawerOpen && (
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setIsDrawerOpen(false)}
            />
          )}
          
          {/* Simple Drawer */}
          <div className={`fixed top-0 right-0 h-full w-72 z-50 transform transition-transform duration-300 ease-out ${
            isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
          } ${isDark ? 'bg-[#1a1a1a] border-l border-[#565869]' : 'bg-white border-l border-gray-200'}`}>
            
            {/* Header */}
            <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-[#565869]' : 'border-gray-200'}`}>
              <div className="flex items-center gap-3">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <div className={`relative w-12 h-12 rounded-xl ${isDark ? 'bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a]' : 'bg-gradient-to-br from-white to-gray-50'} border border-[#10a37f]/30 shadow-lg shadow-[#10a37f]/20 flex items-center justify-center group-hover:shadow-[#10a37f]/40 transition-all duration-300`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#10a37f]/10 to-[#0d8f6f]/10 rounded-xl"></div>
                    <img src="/placeholder-user.jpg" alt="CVChatter" className="relative w-7 h-7 rounded-lg object-cover ring-2 ring-[#10a37f]/20" />
                  </div>
                </div>
                <div>
                  <h2 className={`text-lg font-bold ${isDark ? 'bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent' : 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent'}`}>
                    CVChatter
                  </h2>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Smart Profiles
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className={`p-2 rounded-lg transition-colors ${
                  isDark 
                    ? 'text-gray-300 hover:text-white hover:bg-[#10a37f]/20' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-[#10a37f]/10'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simple Navigation */}
            <div className="p-4 space-y-2">
              <div
                onClick={() => {
                  router.push("/")
                  setIsDrawerOpen(false)
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-300 cursor-pointer group ${
                  isHomePage 
                    ? `${isDark ? 'bg-gradient-to-r from-[#10a37f]/20 to-[#0d8f6f]/20 border border-[#10a37f]/30' : 'bg-gradient-to-r from-[#10a37f]/10 to-[#0d8f6f]/10 border border-[#10a37f]/30'}` 
                    : `${isDark ? 'text-gray-300 hover:text-white hover:bg-[#2a2a2a] border border-transparent hover:border-[#10a37f]/20' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 border border-transparent hover:border-[#10a37f]/20'}`
                }`}
                style={{ justifyContent: 'flex-start' }}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  isHomePage 
                    ? 'bg-gradient-to-r from-[#10a37f]/20 to-[#0d8f6f]/20 shadow-lg shadow-[#10a37f]/20' 
                    : isDark ? 'bg-[#2a2a2a] group-hover:bg-[#10a37f]/10' : 'bg-gray-100 group-hover:bg-[#10a37f]/10'
                }`}>
                  <Home className={`w-5 h-5 ${isHomePage ? 'text-[#10a37f]' : isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                </div>
                <span className="font-medium">Home</span>
              </div>

              <div
                onClick={() => {
                  router.push("/explore")
                  setIsDrawerOpen(false)
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-300 cursor-pointer group ${
                  isDefaultPage 
                    ? `${isDark ? 'bg-gradient-to-r from-[#10a37f]/20 to-[#0d8f6f]/20 border border-[#10a37f]/30' : 'bg-gradient-to-r from-[#10a37f]/10 to-[#0d8f6f]/10 border border-[#10a37f]/30'}` 
                    : `${isDark ? 'text-gray-300 hover:text-white hover:bg-[#2a2a2a] border border-transparent hover:border-[#10a37f]/20' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 border border-transparent hover:border-[#10a37f]/20'}`
                }`}
                style={{ justifyContent: 'flex-start' }}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  isDefaultPage 
                    ? 'bg-gradient-to-r from-[#10a37f]/20 to-[#0d8f6f]/20 shadow-lg shadow-[#10a37f]/20' 
                    : isDark ? 'bg-[#2a2a2a] group-hover:bg-[#10a37f]/10' : 'bg-gray-100 group-hover:bg-[#10a37f]/10'
                }`}>
                  <Search className={`w-5 h-5 ${isDefaultPage ? 'text-[#10a37f]' : isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                </div>
                <span className="font-medium">Explore Talent</span>
              </div>

              <div
                onClick={() => {
                  router.push("/ai-writer")
                  setIsDrawerOpen(false)
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-300 cursor-pointer group ${
                  isAIWriterPage 
                    ? `${isDark ? 'bg-gradient-to-r from-[#10a37f]/20 to-[#0d8f6f]/20 border border-[#10a37f]/30' : 'bg-gradient-to-r from-[#10a37f]/10 to-[#0d8f6f]/10 border border-[#10a37f]/30'}` 
                    : `${isDark ? 'text-gray-300 hover:text-white hover:bg-[#2a2a2a] border border-transparent hover:border-[#10a37f]/20' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 border border-transparent hover:border-[#10a37f]/20'}`
                }`}
                style={{ justifyContent: 'flex-start' }}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  isAIWriterPage 
                    ? 'bg-gradient-to-r from-[#10a37f]/20 to-[#0d8f6f]/20 shadow-lg shadow-[#10a37f]/20' 
                    : isDark ? 'bg-[#2a2a2a] group-hover:bg-[#10a37f]/10' : 'bg-gray-100 group-hover:bg-[#10a37f]/10'
                }`}>
                  <Sparkles className={`w-5 h-5 ${isAIWriterPage ? 'text-[#10a37f]' : isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                </div>
                <span className="font-medium">AI Writer</span>
              </div>
            </div>

            {/* Divider */}
            <div className={`mx-4 border-t ${isDark ? 'border-[#565869]' : 'border-gray-200'}`} />

            {/* Auth Buttons */}
            <div className="p-4 space-y-3">
              <div
                onClick={() => {
                  router.push("/auth")
                  setIsDrawerOpen(false)
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-300 cursor-pointer group ${
                  isDark 
                    ? 'text-gray-300 hover:text-white hover:bg-[#2a2a2a] border border-transparent hover:border-[#10a37f]/20' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 border border-transparent hover:border-[#10a37f]/20'
                }`}
                style={{ justifyContent: 'flex-start' }}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  isDark ? 'bg-[#2a2a2a] group-hover:bg-[#10a37f]/10' : 'bg-gray-100 group-hover:bg-[#10a37f]/10'
                }`}>
                  <Key className={`w-5 h-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                </div>
                <span className="font-medium">Sign In</span>
              </div>
              
              <div
                onClick={() => {
                  router.push("/auth")
                  setIsDrawerOpen(false)
                }}
                className="w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-300 cursor-pointer bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#0a7a5f] text-white shadow-lg shadow-[#10a37f]/25 hover:shadow-[#10a37f]/40 hover:scale-[1.02]"
                style={{ justifyContent: 'flex-start' }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/20 backdrop-blur-sm">
                  <Rocket className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium">Get Started</span>
              </div>
            </div>

                          {/* Theme Toggle */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className={`flex items-center justify-between p-3 rounded-lg ${
                  isDark ? 'bg-[#2a2a2a]' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isDark ? 'bg-[#2a2a2a]' : 'bg-gray-100'
                    }`}>
                      <Moon className={`w-4 h-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                    </div>
                    <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Theme
                    </span>
                  </div>
                  <ThemeToggle />
                </div>
              </div>
          </div>
        </>
      )}
    </header>
  )
}
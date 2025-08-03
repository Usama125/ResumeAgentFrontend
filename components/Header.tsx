"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { useTheme } from "@/context/ThemeContext"
import UserDropdown from "@/components/UserDropdown"
import ThemeToggle from "@/components/ThemeToggle"

interface HeaderProps {
  variant?: 'home' | 'profile' | 'auth' | 'onboarding'
  showBackButton?: boolean
  onEditProfile?: () => void
  profileData?: {
    name?: string
    profile_picture?: string
    is_looking_for_job?: boolean
  }
}

import { getImageUrl } from '@/utils/imageUtils';

export default function Header({ variant = 'home', showBackButton = false, onEditProfile, profileData }: HeaderProps) {
  const router = useRouter()
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const { isDark } = useTheme()

  const isProfilePage = variant === 'profile'
  const isHomePage = variant === 'home'
  const isAuthPage = variant === 'auth'

  return (
    <header className="sticky top-0 z-40 w-full relative">
      {/* Enhanced gradient background for home page */}
      {isHomePage && (
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
      {!isHomePage && (
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
          <div className={`flex justify-between items-center ${isHomePage ? 'h-16 py-2' : 'h-14'} min-w-0`}>
            
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

              {/* Logo and title for home page */}
              {isHomePage && (
                <>
                  <div className="relative group cursor-pointer">
                    <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-[#10a37f]/30 shadow-lg shadow-[#10a37f]/20 group-hover:ring-[#10a37f]/50 group-hover:shadow-[#10a37f]/40 transition-all duration-300 group-hover:scale-105">
                      <img src="/placeholder-user.jpg" alt="AI Resume Builder" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-xl opacity-20 blur group-hover:opacity-40 transition-opacity duration-300"></div>
                  </div>
                  <div className="group cursor-pointer">
                    <h1 className={`text-xl sm:text-2xl font-bold transition-all duration-300 group-hover:scale-105 ${isDark ? 'bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent group-hover:from-white group-hover:via-[#10a37f] group-hover:to-gray-300' : 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent group-hover:from-gray-900 group-hover:via-[#10a37f] group-hover:to-gray-700'}`}>
                      ResumeAI
                    </h1>
                    <p className={`text-xs mt-0.5 transition-all duration-300 group-hover:text-[#10a37f] ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Smart Profiles</p>
                  </div>
                </>
              )}

              {/* Profile info for profile pages */}
              {isProfilePage && profileData && (
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                  <img
                    src={getImageUrl(profileData.profile_picture || null)}
                    alt={profileData.name || "Profile"}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover flex-shrink-0"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-user.jpg";
                    }}
                  />
                  <h1 className={`text-sm sm:text-lg font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {profileData.name}
                  </h1>
                  {profileData.is_looking_for_job && (
                    <Badge className="bg-green-500 hover:bg-green-500 text-white text-xs px-1.5 py-0.5 hidden sm:inline-flex">
                      Open to work
                    </Badge>
                  )}
                </div>
              )}

              {/* Simple title for other pages */}
              {!isHomePage && !isProfilePage && (
                <div>
                  <h1 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {variant === 'auth' ? 'Welcome Back' : variant === 'onboarding' ? 'Profile Setup' : 'AI Resume Builder'}
                  </h1>
                </div>
              )}
            </div>

            {/* Right side content */}
            <div className="flex items-center space-x-1 sm:space-x-3 flex-shrink-0">
              
              {/* Theme toggle - always visible */}
              <ThemeToggle />
              
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
                  </>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
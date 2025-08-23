"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Users, MessageCircle, MapPin, Clock, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { PublicUser } from "@/types"
import { getImageUrl } from "@/utils/imageUtils"
import { algoliaSearchService } from "@/services/algolia-search"
import { UserService } from "@/services/user"
import { GradientAvatar } from '@/components/ui/avatar'

// Interactive Talent Cards Component
const InteractiveTalentCards = ({ isDark }: { isDark: boolean }) => {
  const [allProfiles, setAllProfiles] = useState<PublicUser[]>([])
  const [loading, setLoading] = useState(true)
  const [currentProfiles, setCurrentProfiles] = useState<PublicUser[]>([])
  const [currentMobileProfile, setCurrentMobileProfile] = useState<PublicUser | null>(null)
  const [currentCycle, setCurrentCycle] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [countdown, setCountdown] = useState(10)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  // Check if device is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint
    }
    
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  // Fetch 12 profiles from Algolia in one call
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true)
        
        // Single Algolia call for 12 profiles
        const algoliaResponse = await algoliaSearchService.searchUsers({
          q: '', // Empty query to get all users
          limit: 12, // Get 12 profiles in one call
          page: 0
        })
        
        if (algoliaResponse.hits.length > 0) {
          setAllProfiles(algoliaResponse.hits)
          // Set first 4 as current for desktop
          setCurrentProfiles(algoliaResponse.hits.slice(0, 4))
          // Set random profile for mobile
          const randomProfile = algoliaResponse.hits[Math.floor(Math.random() * algoliaResponse.hits.length)]
          setCurrentMobileProfile(randomProfile)
          console.log(`🎯 Total profiles loaded: ${algoliaResponse.hits.length}`)
        } else {
          // Fallback to UserService if Algolia returns no results
          const fallbackProfiles = await UserService.getFeaturedUsers(12, 0, true)
          setAllProfiles(fallbackProfiles)
          setCurrentProfiles(fallbackProfiles.slice(0, 4))
          const randomProfile = fallbackProfiles[Math.floor(Math.random() * fallbackProfiles.length)]
          setCurrentMobileProfile(randomProfile)
          console.log('🔄 Used fallback service instead')
        }
      } catch (error) {
        console.error('❌ Algolia call failed:', error)
        // Fallback to UserService
        try {
          const fallbackProfiles = await UserService.getFeaturedUsers(12, 0, true)
          setAllProfiles(fallbackProfiles)
          setCurrentProfiles(fallbackProfiles.slice(0, 4))
          const randomProfile = fallbackProfiles[Math.floor(Math.random() * fallbackProfiles.length)]
          setCurrentMobileProfile(randomProfile)
          console.log('🔄 Used fallback service after error')
        } catch (fallbackError) {
          console.error('❌ Fallback also failed:', fallbackError)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProfiles()
  }, [])

  // Countdown timer
  useEffect(() => {
    if (allProfiles.length === 0) return

    // Clear existing countdown
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)

    countdownIntervalRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          return 10 // Reset to 10 when it reaches 0
        }
        return prev - 1
      })
    }, 1000) // Update every second

    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)
    }
  }, [allProfiles])

  // Start the 10-second profile change cycle when profiles are loaded
  useEffect(() => {
    if (allProfiles.length === 0) return

    // Clear any existing timers
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current)

    intervalRef.current = setInterval(() => {
      console.log('🔄 Starting fade transition')
      
      // Reset countdown to 10
      setCountdown(10)
      
      // Start fade out
      setIsTransitioning(true)
      
      // After fade out completes, update profiles and fade in
      transitionTimeoutRef.current = setTimeout(() => {
        if (isMobile) {
          // Mobile: Show random single profile
          const randomProfile = allProfiles[Math.floor(Math.random() * allProfiles.length)]
          setCurrentMobileProfile(randomProfile)
          console.log(`📱 Mobile: Switched to random profile: ${randomProfile.name}`)
        } else {
          // Desktop: Show next 4 profiles in cycle
          setCurrentCycle(prev => {
            const nextCycle = (prev + 1) % 3 // Cycle through 0, 1, 2
            const startIndex = nextCycle * 4
            
            // Update current profiles
            setCurrentProfiles(allProfiles.slice(startIndex, startIndex + 4))
            
            console.log(`💻 Desktop: Switched to cycle ${nextCycle} (profiles ${startIndex + 1}-${startIndex + 4})`)
            
            return nextCycle
          })
        }
        
        // Start fade in
        setTimeout(() => {
          setIsTransitioning(false)
        }, 100) // Small delay to ensure profiles are updated before fade in
        
      }, 800) // Wait for fade out to complete
      
    }, 10000) // Change every 10 seconds

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current)
    }
  }, [allProfiles, isMobile])

  const handleProfileClick = (username: string | undefined) => {
    if (username) {
      router.push(`/profile/${username}`)
    }
  }

  const handleChatClick = (username: string | undefined) => {
    if (username) {
      router.push(`/profile/${username}`)
    }
  }

  if (loading) {
    return (
      <div className="flex gap-6 justify-center">
        {[...Array(isMobile ? 1 : 4)].map((_, index) => (
          <div key={index} className={`animate-pulse rounded-2xl p-4 border flex-shrink-0 w-64 h-80 ${isDark ? 'bg-[#2f2f2f]/30 border-[#565869]/50' : 'bg-white/30 border-gray-300/50'}`}>
            <div className="flex flex-col items-center text-center space-y-4 h-full justify-center">
              <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
              <div className="w-full space-y-2">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-3 bg-gray-300 rounded w-2/3 mx-auto"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2 mx-auto"></div>
              </div>
              <div className="w-full h-10 bg-gray-300 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Render mobile or desktop version
  const renderProfileCard = (profile: PublicUser, key: string) => (
    <Card
      key={key}
      className={`backdrop-blur-sm cursor-pointer group hover:shadow-xl hover:shadow-[#10a37f]/20 w-64 h-80 hover:z-10 relative overflow-hidden transition-all duration-300 ${isDark ? 'bg-gradient-to-br from-[#2f2f2f]/90 to-[#1a1a1a]/90 border-[#565869]/60 hover:border-[#10a37f] hover:bg-gradient-to-br hover:from-[#2f2f2f] hover:to-[#1a1a1a]' : 'bg-gradient-to-br from-white/90 to-gray-50/90 border-gray-300/60 hover:border-[#10a37f] hover:bg-gradient-to-br hover:from-white hover:to-gray-50'}`}
      onClick={() => handleProfileClick(profile.username)}
    >
      {/* Decorative background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#10a37f]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <CardContent className="p-4 relative h-full flex flex-col justify-center">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Profile Picture */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-[#10a37f]/20 group-hover:ring-[#10a37f]/40 transition-all duration-300">
              {profile.profile_picture && !imageErrors[profile.id] ? (
                <img
                  src={getImageUrl(profile.profile_picture)}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                  onError={() => setImageErrors(prev => ({ ...prev, [profile.id]: true }))}
                />
              ) : (
                <GradientAvatar className="w-20 h-20" isDark={isDark} />
              )}
            </div>
            {profile.is_looking_for_job && (
              <div className={`absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 ${isDark ? 'border-[#2f2f2f]' : 'border-white'} shadow-lg`}></div>
            )}
            {/* Online indicator */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#10a37f] rounded-full border-2 border-white shadow-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
          
          {/* Profile Info */}
          <div className="space-y-2 w-full">
            <h3 className={`text-lg font-bold group-hover:text-[#10a37f] transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {profile.name}
            </h3>
            <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {profile.designation || profile.profession || 'Professional'}
            </p>
            {profile.location && (
              <div className={`flex items-center justify-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="truncate">{profile.location}</span>
              </div>
            )}
          </div>
          
          {/* Chat Button */}
          <Button
            className="w-full bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#0a7a5f] text-white py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center justify-center group-hover:shadow-[#10a37f]/25"
            onClick={(e) => {
              e.stopPropagation()
              handleChatClick(profile.username)
            }}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Chat with Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div>
      {/* Profile Cards */}
      <div className={`flex gap-6 justify-center transition-opacity duration-700 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        {isMobile ? (
          // Mobile: Show single random profile
          currentMobileProfile && renderProfileCard(currentMobileProfile, `mobile-${currentMobileProfile.id}`)
        ) : (
          // Desktop: Show 4 profiles in cycle
          currentProfiles.map((profile, index) => 
            renderProfileCard(profile, `${profile.id}-${currentCycle}`)
          )
        )}
      </div>
      
      {/* Live Countdown Timer */}
      <div className="text-center mt-6">
        <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${isDark ? 'bg-[#2f2f2f]/50' : 'bg-white/80'} border border-[#10a37f]/20`}>
          <Clock className="w-4 h-4 text-[#10a37f]" />
          <span className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
            Next profiles in {countdown}s
          </span>
        </div>
      </div>
    </div>
  )
}

// Main Discover Interactive Talent Component
const DiscoverInteractiveTalent = ({ isDark }: { isDark: boolean }) => {
  const router = useRouter()

  const handleExploreAll = () => {
    router.push('/explore')
  }

  return (
    <div className={`relative ${isDark ? 'bg-gradient-to-b from-[#10a37f]/5 via-[#10a37f]/3 to-transparent' : 'bg-gradient-to-b from-[#10a37f]/3 via-[#10a37f]/2 to-transparent'}`}>
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
        <div className="text-center mb-12">
          <Users className="w-16 h-16 text-[#10a37f] mx-auto mb-6" />
          <h3 className={`text-3xl font-bold mb-6 ${isDark ? 'bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent' : 'bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent'}`}>
            Discover Interactive Talent
          </h3>
          <p className={`text-xl mb-8 max-w-3xl mx-auto leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Browse professionals whose profiles answer your questions instantly. Find better matches, save time, and connect with confidence.
          </p>
        </div>

        {/* Interactive Talent Cards */}
        <InteractiveTalentCards isDark={isDark} />
        
        {/* Explore All Button */}
        <div className="text-center mt-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              className="bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#0a7a5f] text-white px-8 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center justify-center"
              onClick={() => router.push("/auth")}
            >
              <Rocket className="w-4 h-4 mr-2" />
              Start Building for Free
            </Button>
            <Button
              variant="outline"
              className={`px-8 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 ${isDark ? 'border-[#565869] hover:border-[#10a37f] text-gray-300 hover:text-white hover:bg-[#10a37f]/10' : 'border-gray-300 hover:border-[#10a37f] text-gray-700 hover:text-gray-900 hover:bg-[#10a37f]/10'}`}
              onClick={handleExploreAll}
            >
              <Search className="w-4 h-4 mr-2" />
              Explore All Profiles
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DiscoverInteractiveTalent
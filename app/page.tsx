"use client"

import { useState, useEffect } from "react"
import { Search, Users, Briefcase, X, Star, ChevronLeft, ChevronRight, MessageCircle, ArrowRight, MapPin, Plus, Palette, FileText, Download, Share2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { useTheme } from "@/context/ThemeContext"
import Header from "@/components/Header"
import { useRateLimit } from "@/hooks/useRateLimit"
import { RateLimitModal } from "@/components/RateLimitModal"
import { UserService } from "@/services/user"
import { PublicUser } from "@/types"
import { getImageUrl } from "@/utils/imageUtils"

// User Showcase Component with Auto Slider
const UserShowcaseSection = ({ isDark }: { isDark: boolean }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const userSlides = [
    "/placeholder-user.jpg", // Profile setup
    "/placeholder-user.jpg", // Profile editing
    "/placeholder-user.jpg", // Profile completion
    "/placeholder-user.jpg", // Profile preview
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % userSlides.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [userSlides.length])

  return (
    <div className={`relative ${isDark ? 'bg-gradient-to-b from-[#10a37f]/5 via-[#10a37f]/3 to-transparent' : 'bg-gradient-to-b from-[#10a37f]/3 via-[#10a37f]/2 to-transparent'}`}>
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-8">
            <div>
              <h2 className={`text-4xl font-bold mb-6 ${isDark ? 'bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent' : 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent'}`}>
                Create Your AI-Powered Profile
              </h2>
              <p className={`text-xl leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Build an intelligent profile that recruiters can chat with to discover your skills, experience, and perfect fit for opportunities.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm">
                  1
                </div>
                <div>
                  <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Smart Profile Creation
                  </h3>
                  <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Our AI guides you through creating a comprehensive profile that highlights your expertise and achievements.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm">
                  2
                </div>
                <div>
                  <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Interactive Chat Integration
                  </h3>
                  <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Your profile becomes conversational - recruiters can chat with it to learn about your experience in detail.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm">
                  3
                </div>
                <div>
                  <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Get Discovered
                  </h3>
                  <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Stand out with an AI profile that works 24/7 to showcase your potential to the right opportunities.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Slider */}
          <div className="relative">
            <div className={`relative rounded-2xl p-8 border overflow-hidden ${isDark ? 'bg-[#2f2f2f]/30 border-[#565869]/50' : 'bg-white/30 border-gray-300/50'} backdrop-blur-sm`}>
              {/* Slider Container */}
              <div className="aspect-[4/3] rounded-xl overflow-hidden relative">
                <div 
                  className="flex transition-transform duration-500 ease-in-out h-full"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {userSlides.map((slide, index) => (
                    <div key={index} className="w-full h-full flex-shrink-0">
                      <img 
                        src={slide} 
                        alt={`Profile creation step ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
                
                {/* Slider Navigation */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {userSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentSlide ? 'bg-[#10a37f] w-8' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-[#10a37f] rounded-full"></div>
              <div className="absolute bottom-4 left-4 w-3 h-3 bg-[#10a37f]/50 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Recruiter Showcase Component with Auto Slider
const RecruiterShowcaseSection = ({ isDark }: { isDark: boolean }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const recruiterSlides = [
    "/placeholder-user.jpg", // Search interface
    "/placeholder-user.jpg", // Profile browsing
    "/placeholder-user.jpg", // Chat with candidate
    "/placeholder-user.jpg", // Match analysis
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % recruiterSlides.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [recruiterSlides.length])

  return (
    <div className={`relative ${isDark ? 'bg-gradient-to-b from-[#1a1a1a] via-[#2f2f2f]/50 to-[#1a1a1a]' : 'bg-gradient-to-b from-gray-100 via-gray-50 to-gray-100'}`}>
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Slider */}
          <div className="relative">
            <div className={`relative rounded-2xl p-8 border overflow-hidden ${isDark ? 'bg-[#2f2f2f]/30 border-[#565869]/50' : 'bg-white/30 border-gray-300/50'} backdrop-blur-sm`}>
              {/* Slider Container */}
              <div className="aspect-[4/3] rounded-xl overflow-hidden relative">
                <div 
                  className="flex transition-transform duration-500 ease-in-out h-full"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {recruiterSlides.map((slide, index) => (
                    <div key={index} className="w-full h-full flex-shrink-0">
                      <img 
                        src={slide} 
                        alt={`Recruiter experience step ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
                
                {/* Slider Navigation */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {recruiterSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentSlide ? 'bg-[#10a37f] w-8' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-[#10a37f] rounded-full"></div>
              <div className="absolute bottom-4 left-4 w-3 h-3 bg-[#10a37f]/50 rounded-full"></div>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="space-y-8">
            <div>
              <h2 className={`text-4xl font-bold mb-6 ${isDark ? 'bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent' : 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent'}`}>
                Smart Recruiting with AI Chat
              </h2>
              <p className={`text-xl leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Chat directly with candidate profiles to get detailed insights and find the perfect match for your opportunities.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Chat with Profiles
                  </h3>
                  <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Ask specific questions about skills, experience, and preferences directly to candidate profiles.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm">
                  <Star className="w-4 h-4" />
                </div>
                <div>
                  <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    AI-Powered Analysis
                  </h3>
                  <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Get detailed match analysis and compatibility scores based on your conversation with profiles.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Find Perfect Matches
                  </h3>
                  <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Discover candidates who are the ideal fit for your specific requirements and company culture.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Top Profiles Section Component
const TopProfilesSection = ({ isDark }: { isDark: boolean }) => {
  const [profiles, setProfiles] = useState<PublicUser[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchTopProfiles = async () => {
      try {
        setLoading(true)
        const topProfiles = await UserService.getFeaturedUsers(6, 0, true) // Get 6 top profiles
        setProfiles(topProfiles)
      } catch (error) {
        console.error('Error fetching top profiles:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTopProfiles()
  }, [])

  const handleProfileClick = (username: string | undefined) => {
    if (username) {
      router.push(`/profile/${username}`)
    }
  }

  const handleExploreAll = () => {
    router.push('/explore')
  }

  if (loading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className={`animate-pulse rounded-xl p-3 border flex-shrink-0 w-32 ${isDark ? 'bg-[#2f2f2f]/30 border-[#565869]/50' : 'bg-white/30 border-gray-300/50'}`}>
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div className="w-full">
                <div className="h-3 bg-gray-300 rounded mb-1"></div>
                <div className="h-2 bg-gray-300 rounded w-2/3 mx-auto"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Profiles Row */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {profiles.map((profile) => (
          <Card
            key={profile.id}
            className={`backdrop-blur-sm transition-all duration-300 cursor-pointer group hover:shadow-lg hover:shadow-[#10a37f]/10 flex-shrink-0 w-32 hover:z-10 relative ${isDark ? 'bg-[#2f2f2f]/80 border-[#565869]/60 hover:border-[#10a37f] hover:bg-[#2f2f2f]' : 'bg-white/80 border-gray-300/60 hover:border-[#10a37f] hover:bg-white'}`}
            onClick={() => handleProfileClick(profile.username)}
          >
            <CardContent className="p-3">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="relative">
                  <img
                    src={getImageUrl(profile.profile_picture)}
                    alt={profile.name}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-user.jpg";
                    }}
                  />
                  {profile.is_looking_for_job && (
                    <div className={`absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 ${isDark ? 'border-[#2f2f2f]' : 'border-white'}`}></div>
                  )}
                </div>
                <div className="space-y-1 w-full">
                  <h3 className={`text-xs font-semibold group-hover:text-[#10a37f] transition-colors truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {profile.name}
                  </h3>
                  <p className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {profile.designation || profile.profession || 'Professional'}
                  </p>
                  {profile.location && (
                    <div className={`flex items-center justify-center text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      <MapPin className="w-2 h-2 mr-1 flex-shrink-0" />
                      <span className="truncate">{profile.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Load More Card */}
        <Card
          className={`backdrop-blur-sm transition-all duration-300 cursor-pointer group hover:shadow-lg hover:shadow-[#10a37f]/10 flex-shrink-0 w-32 hover:z-10 relative ${isDark ? 'bg-[#2f2f2f]/80 border-[#565869]/60 hover:border-[#10a37f] hover:bg-[#10a37f]/10' : 'bg-white/80 border-gray-300/60 hover:border-[#10a37f] hover:bg-[#10a37f]/5'}`}
          onClick={handleExploreAll}
        >
          <CardContent className="p-3">
            <div className="flex flex-col items-center text-center space-y-2 h-full justify-center">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#10a37f]/20 to-[#0d8f6f]/20 border-2 border-[#10a37f]/50 flex items-center justify-center group-hover:border-[#10a37f] group-hover:bg-[#10a37f]/30 transition-all duration-300">
                  <Plus className="w-5 h-5 text-[#10a37f] group-hover:text-white transition-colors duration-300" />
                </div>
              </div>
              <div className="space-y-1 w-full">
                <h3 className="text-xs font-semibold text-[#10a37f] group-hover:text-white transition-colors duration-300">
                  Explore All
                </h3>
                <p className={`text-xs transition-colors duration-300 ${isDark ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-600 group-hover:text-gray-500'}`}>
                  View more profiles
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Profile Variants Showcase Component
const ProfileVariantsSection = ({ isDark }: { isDark: boolean }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const router = useRouter()
  
  const variantSlides = [
    "/placeholder-user.jpg", // Classic theme
    "/placeholder-user.jpg", // Modern theme
    "/placeholder-user.jpg", // Creative theme
    "/placeholder-user.jpg", // Minimalist theme
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % variantSlides.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [variantSlides.length])

  return (
    <div className={`relative ${isDark ? 'bg-gradient-to-b from-[#10a37f]/5 via-[#10a37f]/3 to-transparent' : 'bg-gradient-to-b from-[#10a37f]/3 via-[#10a37f]/2 to-transparent'}`}>
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-8">
            <div>
              <h2 className={`text-4xl font-bold mb-6 ${isDark ? 'bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent' : 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent'}`}>
                Multiple Portfolio Variants
              </h2>
              <p className={`text-xl leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Share your professional story in different styles. Create multiple portfolio themes that showcase your skills for different opportunities and audiences.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm">
                  <Palette className="w-4 h-4" />
                </div>
                <div>
                  <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Professional Themes
                  </h3>
                  <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Choose from modern, classic, creative, or minimalist designs that match your industry and personal brand.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Easy Sharing & Export
                  </h3>
                  <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Share different portfolio versions with clients, employers, or colleagues. Export as PDF or share unique links.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Targeted Presentations
                  </h3>
                  <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Customize what you show to different audiences. Highlight relevant projects and skills for each opportunity.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-start">
              <Button
                onClick={() => router.push("/profile")}
                className="bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#0a7a5f] text-white px-8 py-3 text-lg rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#10a37f]/25 hover:scale-105"
              >
                <Palette className="w-5 h-5 mr-2" />
                Explore Themes
              </Button>
            </div>
          </div>

          {/* Right side - Slider */}
          <div className="relative">
            <div className={`relative rounded-2xl p-8 border overflow-hidden ${isDark ? 'bg-[#2f2f2f]/30 border-[#565869]/50' : 'bg-white/30 border-gray-300/50'} backdrop-blur-sm`}>
              {/* Slider Container */}
              <div className="aspect-[4/3] rounded-xl overflow-hidden relative">
                <div 
                  className="flex transition-transform duration-500 ease-in-out h-full"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {variantSlides.map((slide, index) => (
                    <div key={index} className="w-full h-full flex-shrink-0">
                      <img 
                        src={slide} 
                        alt={`Portfolio variant ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
                
                {/* Slider Navigation */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {variantSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentSlide ? 'bg-[#10a37f] w-8' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-[#10a37f] rounded-full"></div>
              <div className="absolute bottom-4 left-4 w-3 h-3 bg-[#10a37f]/50 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// AI Writer Showcase Component
const AIWriterSection = ({ isDark }: { isDark: boolean }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const router = useRouter()
  
  const writerSlides = [
    "/placeholder-user.jpg", // Cover letter interface
    "/placeholder-user.jpg", // AI generation process
    "/placeholder-user.jpg", // Generated content
    "/placeholder-user.jpg", // Export options
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % writerSlides.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [writerSlides.length])

  return (
    <div className={`relative ${isDark ? 'bg-gradient-to-b from-[#1a1a1a] via-[#2f2f2f]/50 to-[#1a1a1a]' : 'bg-gradient-to-b from-gray-100 via-gray-50 to-gray-100'}`}>
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Slider */}
          <div className="relative">
            <div className={`relative rounded-2xl p-8 border overflow-hidden ${isDark ? 'bg-[#2f2f2f]/30 border-[#565869]/50' : 'bg-white/30 border-gray-300/50'} backdrop-blur-sm`}>
              {/* Slider Container */}
              <div className="aspect-[4/3] rounded-xl overflow-hidden relative">
                <div 
                  className="flex transition-transform duration-500 ease-in-out h-full"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {writerSlides.map((slide, index) => (
                    <div key={index} className="w-full h-full flex-shrink-0">
                      <img 
                        src={slide} 
                        alt={`AI Writer step ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
                
                {/* Slider Navigation */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {writerSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentSlide ? 'bg-[#10a37f] w-8' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-[#10a37f] rounded-full"></div>
              <div className="absolute bottom-4 left-4 w-3 h-3 bg-[#10a37f]/50 rounded-full"></div>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="space-y-8">
            <div>
              <h2 className={`text-4xl font-bold mb-6 ${isDark ? 'bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent' : 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent'}`}>
                AI-Powered Content Writer
              </h2>
              <p className={`text-xl leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Transform your profile into winning cover letters and proposals. Our AI analyzes your skills and experience to create personalized content that gets results.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Smart Cover Letters
                  </h3>
                  <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Generate personalized cover letters that highlight your relevant experience and skills for each specific job application.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm">
                  <Star className="w-4 h-4" />
                </div>
                <div>
                  <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Profile-Powered AI
                  </h3>
                  <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Unlike generic tools, our AI uses your complete professional profile to create truly personalized content that showcases your expertise.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Multiple Formats
                  </h3>
                  <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Create cover letters, freelance proposals, and other professional content. Export to any format or copy to clipboard.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-start">
              <Button
                onClick={() => router.push("/ai-writer")}
                className="bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#0a7a5f] text-white px-8 py-3 text-lg rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#10a37f]/25 hover:scale-105"
              >
                <FileText className="w-5 h-5 mr-2" />
                Try AI Writer
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const { isDark } = useTheme()
  const { showRateLimitModal, hideRateLimitModal, rateLimitState } = useRateLimit()

  const handleSearchButtonClick = () => {
    // Clean the search query of any line breaks before searching
    const cleanQuery = searchQuery.replace(/\n/g, ' ').trim()
    if (cleanQuery) {
      // Redirect to explore page with search query
      router.push(`/explore?q=${encodeURIComponent(cleanQuery)}`)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      // Clean the search query of any line breaks before searching
      const cleanQuery = searchQuery.replace(/\n/g, ' ').trim()
      if (cleanQuery) {
        // Redirect to explore page with search query
        router.push(`/explore?q=${encodeURIComponent(cleanQuery)}`)
      }
    }
    // Allow Shift+Enter for line breaks (default behavior)
  }

  const clearSearch = () => {
    setSearchQuery("")
  }

  const handleSuggestionClick = (suggestion: string) => {
    const query = suggestion.replace(/"/g, '') // Remove quotes
    // Redirect to explore page with filter
    router.push(`/explore?filter=${encodeURIComponent(query)}`)
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#212121] text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Header variant="home" />
      <RateLimitModal
        isOpen={rateLimitState.isOpen}
        onClose={hideRateLimitModal}
        message={rateLimitState.message}
        resetInSeconds={rateLimitState.resetInSeconds}
        isAuthenticated={rateLimitState.isAuthenticated}
        rateLimitType={rateLimitState.rateLimitType}
      />

      {/* Main Content */}
      <main className="relative">
        {/* Hero Section with blending background */}
        <div className="relative overflow-hidden">
          {/* Extended gradient background that blends into the next section */}
          <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-b from-[#1a1a1a] via-[#10a37f]/5 to-transparent' : 'bg-gradient-to-b from-white via-[#10a37f]/3 to-transparent'}`}></div>
          <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-[#10a37f]/15 via-[#10a37f]/8 to-[#10a37f]/3' : 'bg-gradient-to-br from-[#10a37f]/8 via-[#10a37f]/4 to-[#10a37f]/2'}`}></div>
          
          {/* Decorative floating elements */}
          <div className="absolute top-20 left-10 w-24 h-24 bg-[#10a37f]/25 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-[#0d8f6f]/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#10a37f]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 left-20 w-20 h-20 bg-[#10a37f]/15 rounded-full blur-xl"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
            <div className="relative text-center py-20">
              <div className="mb-6">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-[#10a37f]/20 text-[#10a37f] border border-[#10a37f]/30">
                  ✨ Your Profile. Their Questions. AI Answers.
                </span>
              </div>
              
                              <h1 className={`text-5xl md:text-6xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <span className="text-[#10a37f]">Discover</span> Top Talent 
                </h1>
                <h2 className="text-3xl md:text-4xl font-semibold mb-6">
                  with <span className="text-[#10a37f]">AI</span> powered <span className="text-[#10a37f]">profiles</span>
                </h2>
              
              <p className={`text-xl mb-12 max-w-4xl mx-auto leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Build an AI-powered profile that answers questions about your experience 24/7. Perfect matches find you faster, conversations start easier.
              </p>

              {/* ChatGPT-style Search Section */}
              <div className="max-w-3xl mx-auto">
                <div className="relative">
                  <div className={`relative backdrop-blur-sm rounded-xl border transition-all duration-300 shadow-lg ${isDark ? 'bg-white/10 border-white/20 hover:border-white/30 focus-within:border-white' : 'bg-black/5 border-gray-300/60 hover:border-gray-400/80 focus-within:border-[#10a37f]'}`}>
                    <div className="flex items-end pl-5 pr-3 py-2">
                      <div className="flex-1 relative">
                        <textarea
                          placeholder="Search for professionals by skills, experience, or job title..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className={`w-full bg-transparent border-0 focus:ring-0 focus:outline-none resize-none text-base leading-6 pr-4 ${isDark ? 'text-white placeholder-gray-300' : 'text-gray-900 placeholder-gray-500'}`}
                          rows={1}
                          style={{
                            minHeight: '24px',
                            maxHeight: '200px',
                            marginTop: '7px',
                            overflow: 'hidden',
                            scrollbarWidth: 'thin',
                            scrollbarColor: isDark ? 'rgba(255,255,255,0.3) transparent' : 'rgba(0,0,0,0.3) transparent'
                          }}
                          onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            const scrollHeight = target.scrollHeight;
                            target.style.height = Math.min(scrollHeight, 200) + 'px';
                            target.style.overflow = scrollHeight > 200 ? 'auto' : 'hidden';
                          }}
                        />
                      </div>
                      <div className="flex items-center space-x-2 ml-2">
                        {searchQuery && (
                          <button
                            onClick={clearSearch}
                            className={`p-1.5 transition-colors rounded-lg ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'}`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={handleSearchButtonClick}
                          disabled={!searchQuery.trim()}
                          className={`p-2 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
                          style={{ marginBottom: '3px' }}
                        >
                          <Search className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Popular searches: 
                  </p>
                  <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 px-4 sm:px-0">
                    {["React developers", "Product managers", "AWS certified", "UX designers", "Node.js", "Python"].map((suggestion) => {
                      const isActive = searchQuery.toLowerCase() === suggestion.toLowerCase();
                      return (
                        <button
                          key={suggestion}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSuggestionClick(suggestion);
                          }}
                          onMouseDown={(e) => e.preventDefault()}
                          className={`px-3 py-1.5 text-xs rounded-full border transition-all duration-200 cursor-pointer select-none outline-none focus:outline-none flex items-center justify-center text-center ${
                            isActive 
                              ? "bg-[#10a37f] text-white border-[#10a37f] shadow-lg shadow-[#10a37f]/25" 
                              : isDark
                                ? "bg-[#40414f] hover:bg-[#10a37f] text-gray-300 hover:text-white border-[#565869] hover:border-[#10a37f] active:bg-[#10a37f]"
                                : "bg-gray-200 hover:bg-[#10a37f] text-gray-700 hover:text-white border-gray-300 hover:border-[#10a37f] active:bg-[#10a37f]"
                          }`}
                          type="button"
                          style={{ cursor: 'pointer' }}
                        >
                          "{suggestion}"
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Gradient transition to blend with next section */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-[#10a37f]/3 to-[#10a37f]/5 pointer-events-none"></div>
        </div>

        {/* Discover Interactive Talent Section */}
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

            {/* Top Profiles Grid */}
            <TopProfilesSection isDark={isDark} />

            {/* CTA Buttons */}
            <div className="text-center mt-12">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                {!isAuthenticated && (
                  <Button
                    variant="outline"
                    className={`px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-105 ${isDark ? 'border-[#565869] hover:border-[#10a37f] text-gray-300 hover:text-white hover:bg-[#10a37f]/10' : 'border-gray-300 hover:border-[#10a37f] text-gray-700 hover:text-gray-900 hover:bg-[#10a37f]/10'}`}
                    onClick={() => router.push("/auth")}
                  >
                    <Briefcase className="w-5 h-5 mr-2" />
                    Create Your AI Profile
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Platform Benefits Section - Alternating Background */}
        <div className={`relative ${isDark ? 'bg-gradient-to-b from-[#1a1a1a] via-[#2f2f2f]/50 to-[#1a1a1a]' : 'bg-gradient-to-b from-gray-100 via-gray-50 to-gray-100'}`}>
          <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
            <div className="text-center mb-16">
              <h2 className={`text-4xl font-bold mb-6 ${isDark ? 'bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent' : 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent'}`}>
                Why CVChatter Works Better
              </h2>
              <p className={`text-xl max-w-3xl mx-auto leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Traditional profiles just sit there. CVChatter profiles actively engage, answer questions, create AI-powered content, and offer multiple presentation styles for every opportunity.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Benefit 1 */}
              <div className={`relative p-8 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:shadow-[#10a37f]/10 ${isDark ? 'bg-[#2f2f2f]/50 border-[#565869]/50 hover:border-[#10a37f]/50' : 'bg-white/50 border-gray-300/50 hover:border-[#10a37f]/50'} backdrop-blur-sm`}>
                <div className="w-12 h-12 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-xl flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Always-On Networking
                </h3>
                <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Your profile works 24/7, answering questions about your skills and experience. No more missed opportunities while you sleep.
                </p>
              </div>

              {/* Benefit 2 */}
              <div className={`relative p-8 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:shadow-[#10a37f]/10 ${isDark ? 'bg-[#2f2f2f]/50 border-[#565869]/50 hover:border-[#10a37f]/50' : 'bg-white/50 border-gray-300/50 hover:border-[#10a37f]/50'} backdrop-blur-sm`}>
                <div className="w-12 h-12 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-xl flex items-center justify-center mb-6">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Smarter Connections
                </h3>
                <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Skip the guesswork. Your profile provides detailed insights to interested parties, ensuring better matches and meaningful conversations.
                </p>
              </div>

              {/* Benefit 3 */}
              <div className={`relative p-8 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:shadow-[#10a37f]/10 ${isDark ? 'bg-[#2f2f2f]/50 border-[#565869]/50 hover:border-[#10a37f]/50' : 'bg-white/50 border-gray-300/50 hover:border-[#10a37f]/50'} backdrop-blur-sm`}>
                <div className="w-12 h-12 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-xl flex items-center justify-center mb-6">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Stand Out Naturally
                </h3>
                <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Show your personality and expertise through natural conversations. Let your experience speak for itself, literally.
                </p>
              </div>

              {/* Benefit 4 - Profile Variants */}
              <div className={`relative p-8 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:shadow-[#10a37f]/10 ${isDark ? 'bg-[#2f2f2f]/50 border-[#565869]/50 hover:border-[#10a37f]/50' : 'bg-white/50 border-gray-300/50 hover:border-[#10a37f]/50'} backdrop-blur-sm`}>
                <div className="w-12 h-12 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-xl flex items-center justify-center mb-6">
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Multiple Portfolios
                </h3>
                <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Create different portfolio themes for different audiences. Share targeted presentations that highlight relevant skills for each opportunity.
                </p>
              </div>

              {/* Benefit 5 - AI Writer */}
              <div className={`relative p-8 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:shadow-[#10a37f]/10 ${isDark ? 'bg-[#2f2f2f]/50 border-[#565869]/50 hover:border-[#10a37f]/50' : 'bg-white/50 border-gray-300/50 hover:border-[#10a37f]/50'} backdrop-blur-sm`}>
                <div className="w-12 h-12 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-xl flex items-center justify-center mb-6">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  AI Content Creation
                </h3>
                <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Generate personalized cover letters and proposals using your complete profile data. No more generic templates or starting from scratch.
                </p>
              </div>

              {/* Benefit 6 - Professional Growth */}
              <div className={`relative p-8 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:shadow-[#10a37f]/10 ${isDark ? 'bg-[#2f2f2f]/50 border-[#565869]/50 hover:border-[#10a37f]/50' : 'bg-white/50 border-gray-300/50 hover:border-[#10a37f]/50'} backdrop-blur-sm`}>
                <div className="w-12 h-12 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-xl flex items-center justify-center mb-6">
                  <ArrowRight className="w-6 h-6 text-white" />
                </div>
                <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Accelerated Growth
                </h3>
                <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Get discovered faster and connect with the right opportunities. Your intelligent profile works continuously to advance your career goals.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* User Showcase Section - Default Background */}
        <UserShowcaseSection isDark={isDark} />
        
        {/* Recruiter Showcase Section - Alternating Background */}
        <RecruiterShowcaseSection isDark={isDark} />

        {/* Profile Variants Section - Default Background */}
        <ProfileVariantsSection isDark={isDark} />

        {/* AI Writer Section - Alternating Background */}
        <AIWriterSection isDark={isDark} />

        {/* Features Section - Alternating Background */}
        <div className={`relative ${isDark ? 'bg-gradient-to-b from-[#1a1a1a] via-[#2f2f2f]/50 to-[#1a1a1a]' : 'bg-gradient-to-b from-gray-100 via-gray-50 to-gray-100'}`}>
          <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
            <div className="text-center mb-16">
              <h2 className={`text-4xl font-bold mb-6 ${isDark ? 'bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent' : 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent'}`}>
                How It Changes Everything
              </h2>
              <p className={`text-xl max-w-3xl mx-auto leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Powerful features that make professional networking more intelligent, efficient, and meaningful for everyone involved
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className={`p-6 rounded-2xl border transition-all duration-300 ${isDark ? 'bg-[#2f2f2f]/30 border-[#565869]/50' : 'bg-white/30 border-gray-300/50'} backdrop-blur-sm`}>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-lg flex items-center justify-center">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Instant Profile Conversations
                  </h3>
                </div>
                <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Browse and chat with profiles instantly. Get answers about experience, skills, and interests without waiting for responses.
                </p>
              </div>

              {/* Feature 2 */}
              <div className={`p-6 rounded-2xl border transition-all duration-300 ${isDark ? 'bg-[#2f2f2f]/30 border-[#565869]/50' : 'bg-white/30 border-gray-300/50'} backdrop-blur-sm`}>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Smart Matching Technology
                  </h3>
                </div>
                <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  AI analyzes conversations to suggest perfect matches. Your profile learns what opportunities excite you most.
                </p>
              </div>

              {/* Feature 3 */}
              <div className={`p-6 rounded-2xl border transition-all duration-300 ${isDark ? 'bg-[#2f2f2f]/30 border-[#565869]/50' : 'bg-white/30 border-gray-300/50'} backdrop-blur-sm`}>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    24/7 Professional Presence
                  </h3>
                </div>
                <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Your profile represents you around the clock. Build relationships and explore opportunities even when you're offline.
                </p>
              </div>

              {/* Feature 4 */}
              <div className={`p-6 rounded-2xl border transition-all duration-300 ${isDark ? 'bg-[#2f2f2f]/30 border-[#565869]/50' : 'bg-white/30 border-gray-300/50'} backdrop-blur-sm`}>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-lg flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Quality Over Quantity
                  </h3>
                </div>
                <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Connect with people who truly understand your value. Skip surface-level interactions and build meaningful professional relationships.
                </p>
              </div>

              {/* Feature 5 - Portfolio Variants */}
              <div className={`p-6 rounded-2xl border transition-all duration-300 ${isDark ? 'bg-[#2f2f2f]/30 border-[#565869]/50' : 'bg-white/30 border-gray-300/50'} backdrop-blur-sm`}>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-lg flex items-center justify-center">
                    <Palette className="w-5 h-5 text-white" />
                  </div>
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Adaptive Portfolio Presentation
                  </h3>
                </div>
                <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Create multiple portfolio variants for different industries and audiences. Show the right skills to the right people at the right time.
                </p>
              </div>

              {/* Feature 6 - AI Content Writer */}
              <div className={`p-6 rounded-2xl border transition-all duration-300 ${isDark ? 'bg-[#2f2f2f]/30 border-[#565869]/50' : 'bg-white/30 border-gray-300/50'} backdrop-blur-sm`}>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Intelligent Content Generation
                  </h3>
                </div>
                <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Transform your profile into personalized cover letters and proposals instantly. AI-powered content that highlights your unique expertise for each opportunity.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section - Default Background - Only show for non-authenticated users */}
        {!isAuthenticated && (
          <div className={`relative ${isDark ? 'bg-gradient-to-b from-[#10a37f]/5 via-[#10a37f]/3 to-transparent' : 'bg-gradient-to-b from-[#10a37f]/3 via-[#10a37f]/2 to-transparent'}`}>
            <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
              <div className="text-center">
                <div className={`relative rounded-3xl p-12 border overflow-hidden ${isDark ? 'bg-gradient-to-br from-[#2f2f2f]/80 to-[#1a1a1a]/80 border-[#565869]/50' : 'bg-gradient-to-br from-white/80 to-gray-50/80 border-gray-300/50'} backdrop-blur-sm`}>
                  {/* Decorative background elements */}
                  <div className="absolute top-0 left-0 w-32 h-32 bg-[#10a37f]/10 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#10a37f]/5 rounded-full blur-3xl"></div>
                  
                  <div className="relative">
                    <Briefcase className="w-16 h-16 text-[#10a37f] mx-auto mb-6" />
                    <h3 className={`text-3xl font-bold mb-6 ${isDark ? 'bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent' : 'bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent'}`}>
                      Ready to Try Something Different?
                    </h3>
                    <p className={`text-xl mb-8 max-w-3xl mx-auto leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Join professionals who are already networking smarter with AI profiles that work as hard as they do.
                    </p>
                    <div className="flex justify-center align-middle">
                      <Button
                        className="bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#0a7a5f] text-white px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#10a37f]/25 hover:scale-105 flex items-center justify-center"
                        onClick={() => router.push("/auth")}
                      >
                        Get Started for Free
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
} 
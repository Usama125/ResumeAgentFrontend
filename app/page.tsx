"use client"

import { useState, useEffect } from "react"
import { Search, Users, Briefcase, X, Star, ChevronLeft, ChevronRight, MessageCircle, ArrowRight, MapPin, Plus, Palette, FileText, Download, Share2, Eye, Bot, Zap, Target, Clock, Sparkles, CheckCircle, PlayCircle } from "lucide-react"
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
    "/images/carousel/profile-creation/signup-flow.gif", // Complete signup flow
    "/images/carousel/profile-creation/profile-setup.gif", // Profile creation
    "/images/carousel/profile-creation/onboarding-steps.gif", // Onboarding process
    "/images/carousel/profile-creation/profile-preview.png", // Final result
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
    "/images/carousel/recruiter-experience/search-interface.png", // Search interface
    "/images/carousel/recruiter-experience/profile-browsing.png", // Profile browsing
    "/images/carousel/recruiter-experience/chat-candidate.png", // Chat with candidate
    "/images/carousel/recruiter-experience/match-analysis.png", // Match analysis
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
    "/images/carousel/portfolio-variants/theme-selection.png", // Theme selection
    "/images/carousel/portfolio-variants/modern-theme.png", // Modern theme
    "/images/carousel/portfolio-variants/classic-theme.png", // Classic theme
    "/images/carousel/portfolio-variants/creative-theme.png", // Creative theme
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
    "/images/carousel/ai-writer/writer-form.png", // Cover letter interface
    "/images/carousel/ai-writer/generation-process.png", // AI generation process
    "/images/carousel/ai-writer/generated-content.png", // Generated content
    "/images/carousel/ai-writer/export-options.png", // Export options
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

// New Interactive Demo Component
const InteractiveDemoChat = ({ isDark }: { isDark: boolean }) => {
  const [demoMessages, setDemoMessages] = useState([
    { type: "user", content: "Tell me about your React experience" },
    { type: "ai", content: "I have 5+ years of React development experience, including building scalable web applications with React 18, Next.js, and TypeScript. I've led teams of 4+ developers and delivered 20+ production applications..." }
  ])
  const [currentMessage, setCurrentMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  
  const demoQuestions = [
    "What's your experience with AI/ML?",
    "Tell me about your recent projects",
    "What makes you unique?",
    "Are you looking for remote work?"
  ]
  
  const handleDemoQuestion = (question: string) => {
    if (isTyping) return
    
    setIsTyping(true)
    setDemoMessages(prev => [...prev, { type: "user", content: question }])
    
    setTimeout(() => {
      const responses = {
        "What's your experience with AI/ML?": "I specialize in machine learning with 3+ years implementing ML models using TensorFlow and PyTorch. I've built recommendation systems, NLP applications, and computer vision solutions that improved user engagement by 40%...",
        "Tell me about your recent projects": "Recently, I led the development of an AI-powered analytics dashboard that processes 1M+ data points daily. Built with React, Node.js, and AWS, it reduced manual reporting time by 80%...",
        "What makes you unique?": "I combine technical expertise with strong leadership skills. I've mentored 15+ junior developers, speak 4 languages, and have a unique background in both engineering and business strategy...",
        "Are you looking for remote work?": "Yes, I'm open to remote opportunities! I have 2+ years of remote work experience and am comfortable with async communication, global teams, and flexible schedules..."
      }
      
      setDemoMessages(prev => [...prev, { 
        type: "ai", 
        content: responses[question as keyof typeof responses] || "I'd be happy to discuss that! My experience spans multiple areas and I'm always eager to take on new challenges..."
      }])
      setIsTyping(false)
    }, 1500)
  }
  
  return (
    <div className={`relative rounded-2xl p-6 border overflow-hidden ${isDark ? 'bg-[#2f2f2f]/50 border-[#565869]/50' : 'bg-white/50 border-gray-300/50'} backdrop-blur-sm`}>
      <div className="mb-4">
        <div className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>💬 Live AI Profile Demo</div>
        <div className="space-y-3 h-64 overflow-y-auto">
          {demoMessages.map((msg, index) => (
            <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-lg ${
                msg.type === 'user' 
                  ? 'bg-[#10a37f] text-white' 
                  : isDark ? 'bg-[#404040] text-gray-100' : 'bg-gray-100 text-gray-900'
              }`}>
                <div className="text-sm">{msg.content}</div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className={`p-3 rounded-lg ${isDark ? 'bg-[#404040]' : 'bg-gray-100'}`}>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-[#10a37f] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#10a37f] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-[#10a37f] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {demoQuestions.map((question, index) => (
          <button
            key={index}
            onClick={() => handleDemoQuestion(question)}
            disabled={isTyping}
            className={`px-3 py-1.5 text-xs rounded-full border transition-all duration-200 ${
              isTyping ? 'opacity-50 cursor-not-allowed' :
              isDark
                ? "bg-[#40414f] hover:bg-[#10a37f] text-gray-300 hover:text-white border-[#565869] hover:border-[#10a37f]"
                : "bg-gray-200 hover:bg-[#10a37f] text-gray-700 hover:text-white border-gray-300 hover:border-[#10a37f]"
            }`}
          >
            {question}
          </button>
        ))}
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-[#10a37f] rounded-full"></div>
      <div className="absolute bottom-4 left-4 w-3 h-3 bg-[#10a37f]/50 rounded-full"></div>
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
        {/* Hero Section */}
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
            <div className="relative py-16">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left side - Hero Content */}
                <div className="space-y-8">
                  <div className="mb-6">
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-[#10a37f]/20 text-[#10a37f] border border-[#10a37f]/30">
                      <Bot className="w-4 h-4 mr-2" />
                      AI That Works While You Sleep
                    </span>
                  </div>
                  
                  <div>
                    <h1 className={`text-4xl lg:text-6xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Your <span className="text-[#10a37f]">AI Profile</span>
                      <br />Answers for You
                    </h1>
                    <p className={`text-xl mb-8 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Create an intelligent professional profile that works 24/7. Recruiters chat with your AI to discover your skills, experience, and perfect fit.
                    </p>
                  </div>

                  {/* Key Benefits */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full flex items-center justify-center">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                      <span className={`text-lg ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Always-on professional presence</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full flex items-center justify-center">
                        <Target className="w-4 h-4 text-white" />
                      </div>
                      <span className={`text-lg ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Better matches, faster connections</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <span className={`text-lg ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>AI-powered content generation</span>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    {!isAuthenticated ? (
                      <>
                        <Button
                          className="bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#0a7a5f] text-white px-8 py-3 text-lg rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#10a37f]/25 hover:scale-105"
                          onClick={() => router.push("/auth")}
                        >
                          Create Your AI Profile
                        </Button>
                        <Button
                          variant="outline"
                          className={`px-8 py-3 text-lg rounded-xl transition-all duration-300 ${isDark ? 'border-[#565869] hover:border-[#10a37f] text-gray-300 hover:text-white hover:bg-[#10a37f]/10' : 'border-gray-300 hover:border-[#10a37f] text-gray-700 hover:text-gray-900 hover:bg-[#10a37f]/10'}`}
                          onClick={() => router.push("/explore")}
                        >
                          <PlayCircle className="w-5 h-5 mr-2" />
                          See It In Action
                        </Button>
                      </>
                    ) : (
                      <Button
                        className="bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#0a7a5f] text-white px-8 py-3 text-lg rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#10a37f]/25 hover:scale-105"
                        onClick={() => router.push("/profile")}
                      >
                        View Your Profile
                      </Button>
                    )}
                  </div>
                </div>

                {/* Right side - Interactive Demo */}
                <div className="relative">
                  <InteractiveDemoChat isDark={isDark} />
                </div>
              </div>
            </div>
          </div>

          
          {/* Gradient transition to blend with next section */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-[#10a37f]/3 to-[#10a37f]/5 pointer-events-none"></div>
        </div>

        {/* Search Section */}
        <div className={`relative ${isDark ? 'bg-gradient-to-b from-[#10a37f]/5 via-[#10a37f]/3 to-transparent' : 'bg-gradient-to-b from-[#10a37f]/3 via-[#10a37f]/2 to-transparent'}`}>
          <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
            <div className="text-center mb-8">
              <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent' : 'bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent'}`}>
                Find AI-Powered Professionals
              </h3>
              <p className={`text-lg mb-8 max-w-3xl mx-auto leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Search and chat with intelligent profiles to discover the perfect candidates for your needs.
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto mb-8">
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

            {/* Top Profiles Grid */}
            <TopProfilesSection isDark={isDark} />
          </div>
        </div>
        
        {/* How It Works - Step by Step */}
        <div className={`relative ${isDark ? 'bg-gradient-to-b from-[#1a1a1a] via-[#2f2f2f]/50 to-[#1a1a1a]' : 'bg-gradient-to-b from-gray-100 via-gray-50 to-gray-100'}`}>
          <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
            <div className="text-center mb-16">
              <h2 className={`text-4xl font-bold mb-6 ${isDark ? 'bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent' : 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent'}`}>
                How CVChatter Works
              </h2>
              <p className={`text-xl max-w-3xl mx-auto leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Simple steps to revolutionize your professional networking
              </p>
            </div>

            {/* Step 1 - Create Your AI Profile */}
            <div className="mb-20">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Content - Left */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full flex items-center justify-center text-white text-xl font-bold">
                      1
                    </div>
                    <h3 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Create Your AI Profile
                    </h3>
                  </div>
                  
                  <p className={`text-xl leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Build a comprehensive professional profile that trains your AI representative to showcase your skills and experience.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-[#10a37f] mt-1 flex-shrink-0" />
                      <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Complete guided profile setup</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-[#10a37f] mt-1 flex-shrink-0" />
                      <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Train AI with your expertise</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-[#10a37f] mt-1 flex-shrink-0" />
                      <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Set preferences and goals</span>
                    </div>
                  </div>
                </div>

                {/* Screenshot - Right */}
                <div className="relative">
                  <div className={`relative rounded-2xl p-8 border overflow-hidden ${isDark ? 'bg-[#2f2f2f]/50 border-[#565869]/50' : 'bg-white/50 border-gray-300/50'} backdrop-blur-sm`}>
                    <div className="aspect-[4/3] rounded-xl overflow-hidden relative bg-gradient-to-br from-[#10a37f]/10 to-[#0d8f6f]/5 flex items-center justify-center">
                      <div className={`text-center space-y-4 p-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        <Users className="w-16 h-16 text-[#10a37f] mx-auto" />
                        <div className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Profile Creation Interface</div>
                        <div className="text-sm">Guided setup with AI training</div>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 w-2 h-2 bg-[#10a37f] rounded-full animate-pulse"></div>
                    <div className="absolute bottom-4 left-4 w-3 h-3 bg-[#10a37f]/50 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 - AI Answers Questions */}
            <div className="mb-20">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Screenshot - Left */}
                <div className="relative lg:order-1">
                  <div className={`relative rounded-2xl p-8 border overflow-hidden ${isDark ? 'bg-[#2f2f2f]/50 border-[#565869]/50' : 'bg-white/50 border-gray-300/50'} backdrop-blur-sm`}>
                    <div className="aspect-[4/3] rounded-xl overflow-hidden relative bg-gradient-to-br from-[#10a37f]/10 to-[#0d8f6f]/5 flex items-center justify-center">
                      <div className={`text-center space-y-4 p-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        <MessageCircle className="w-16 h-16 text-[#10a37f] mx-auto" />
                        <div className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>AI Chat Interface</div>
                        <div className="text-sm">Real-time conversations with profiles</div>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 w-2 h-2 bg-[#10a37f] rounded-full animate-pulse"></div>
                    <div className="absolute bottom-4 left-4 w-3 h-3 bg-[#10a37f]/50 rounded-full"></div>
                  </div>
                </div>

                {/* Content - Right */}
                <div className="space-y-6 lg:order-2">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full flex items-center justify-center text-white text-xl font-bold">
                      2
                    </div>
                    <h3 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      AI Answers Questions 24/7
                    </h3>
                  </div>
                  
                  <p className={`text-xl leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Your AI profile works around the clock, engaging with recruiters and answering detailed questions about your experience.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-[#10a37f] mt-1 flex-shrink-0" />
                      <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Instant responses to recruiters</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-[#10a37f] mt-1 flex-shrink-0" />
                      <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Detailed skill explanations</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-[#10a37f] mt-1 flex-shrink-0" />
                      <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Personalized conversations</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 - Smart Matching & Connections */}
            <div className="mb-0">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Content - Left */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full flex items-center justify-center text-white text-xl font-bold">
                      3
                    </div>
                    <h3 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Get Perfect Matches
                    </h3>
                  </div>
                  
                  <p className={`text-xl leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    AI analyzes conversations to connect you with the best opportunities and candidates based on true compatibility.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-[#10a37f] mt-1 flex-shrink-0" />
                      <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Smart compatibility scoring</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-[#10a37f] mt-1 flex-shrink-0" />
                      <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Quality over quantity matches</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-[#10a37f] mt-1 flex-shrink-0" />
                      <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Automated follow-up & scheduling</span>
                    </div>
                  </div>

                  <div className="pt-6">
                    <Button
                      className="bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#0a7a5f] text-white px-8 py-3 text-lg rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#10a37f]/25 hover:scale-105"
                      onClick={() => !isAuthenticated ? router.push("/auth") : router.push("/profile")}
                    >
                      {!isAuthenticated ? "Get Started Now" : "View Your Profile"}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </div>

                {/* Screenshot - Right */}
                <div className="relative">
                  <div className={`relative rounded-2xl p-8 border overflow-hidden ${isDark ? 'bg-[#2f2f2f]/50 border-[#565869]/50' : 'bg-white/50 border-gray-300/50'} backdrop-blur-sm`}>
                    <div className="aspect-[4/3] rounded-xl overflow-hidden relative bg-gradient-to-br from-[#10a37f]/10 to-[#0d8f6f]/5 flex items-center justify-center">
                      <div className={`text-center space-y-4 p-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        <Target className="w-16 h-16 text-[#10a37f] mx-auto" />
                        <div className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Smart Matching Dashboard</div>
                        <div className="text-sm">AI-powered compatibility analysis</div>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 w-2 h-2 bg-[#10a37f] rounded-full animate-pulse"></div>
                    <div className="absolute bottom-4 left-4 w-3 h-3 bg-[#10a37f]/50 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className={`relative ${isDark ? 'bg-gradient-to-b from-[#10a37f]/5 via-[#10a37f]/3 to-transparent' : 'bg-gradient-to-b from-[#10a37f]/3 via-[#10a37f]/2 to-transparent'}`}>
          <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
            <div className="text-center mb-16">
              <h2 className={`text-4xl font-bold mb-6 ${isDark ? 'bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent' : 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent'}`}>
                Why Choose CVChatter?
              </h2>
              <p className={`text-xl max-w-3xl mx-auto leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                The future of professional networking is here. Join thousands who are already networking smarter with AI.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Benefit 1 */}
              <div className={`relative p-8 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:shadow-[#10a37f]/10 ${isDark ? 'bg-[#2f2f2f]/50 border-[#565869]/50 hover:border-[#10a37f]/50' : 'bg-white/50 border-gray-300/50 hover:border-[#10a37f]/50'} backdrop-blur-sm group`}>
                <div className="w-12 h-12 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  24/7 Professional Presence
                </h3>
                <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Your AI profile works around the clock, answering questions and building relationships while you focus on what matters most.
                </p>
              </div>

              {/* Benefit 2 */}
              <div className={`relative p-8 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:shadow-[#10a37f]/10 ${isDark ? 'bg-[#2f2f2f]/50 border-[#565869]/50 hover:border-[#10a37f]/50' : 'bg-white/50 border-gray-300/50 hover:border-[#10a37f]/50'} backdrop-blur-sm group`}>
                <div className="w-12 h-12 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Better Matches, Faster
                </h3>
                <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Skip the endless applications. Connect with opportunities that truly align with your skills, experience, and career goals.
                </p>
              </div>

              {/* Benefit 3 */}
              <div className={`relative p-8 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:shadow-[#10a37f]/10 ${isDark ? 'bg-[#2f2f2f]/50 border-[#565869]/50 hover:border-[#10a37f]/50' : 'bg-white/50 border-gray-300/50 hover:border-[#10a37f]/50'} backdrop-blur-sm group`}>
                <div className="w-12 h-12 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Quality Connections
                </h3>
                <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Build meaningful professional relationships with people who understand your value through intelligent AI conversations.
                </p>
              </div>

              {/* Benefit 4 */}
              <div className={`relative p-8 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:shadow-[#10a37f]/10 ${isDark ? 'bg-[#2f2f2f]/50 border-[#565869]/50 hover:border-[#10a37f]/50' : 'bg-white/50 border-gray-300/50 hover:border-[#10a37f]/50'} backdrop-blur-sm group`}>
                <div className="w-12 h-12 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  AI-Powered Content
                </h3>
                <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Generate personalized cover letters and proposals that highlight your unique strengths for every opportunity.
                </p>
              </div>

              {/* Benefit 5 */}
              <div className={`relative p-8 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:shadow-[#10a37f]/10 ${isDark ? 'bg-[#2f2f2f]/50 border-[#565869]/50 hover:border-[#10a37f]/50' : 'bg-white/50 border-gray-300/50 hover:border-[#10a37f]/50'} backdrop-blur-sm group`}>
                <div className="w-12 h-12 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Multiple Portfolio Themes
                </h3>
                <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Present your professional story in different styles for different audiences and industries.
                </p>
              </div>

              {/* Benefit 6 */}
              <div className={`relative p-8 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:shadow-[#10a37f]/10 ${isDark ? 'bg-[#2f2f2f]/50 border-[#565869]/50 hover:border-[#10a37f]/50' : 'bg-white/50 border-gray-300/50 hover:border-[#10a37f]/50'} backdrop-blur-sm group`}>
                <div className="w-12 h-12 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Stand Out Naturally
                </h3>
                <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Let your experience and personality shine through natural AI conversations that showcase your unique value.
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
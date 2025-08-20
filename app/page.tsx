"use client"

<<<<<<< Updated upstream
import { useState, useEffect } from "react"
import { Search, Users, Briefcase, X, Star, ChevronLeft, ChevronRight, MessageCircle, ArrowRight, MapPin, Plus, Palette, FileText, Download, Share2, Eye } from "lucide-react"
=======
import { useState, useEffect, useRef } from "react"
import { Search, Users, Briefcase, X, Star, ChevronLeft, ChevronRight, MessageCircle, ArrowRight, MapPin, Plus, Palette, FileText, Download, Share2, Eye, Sparkles, Zap, Target, TrendingUp, Clock, Shield, Rocket, User, CheckCircle, Play, Brain, Bot, Workflow } from "lucide-react"
>>>>>>> Stashed changes
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { useTheme } from "@/context/ThemeContext"
import { useRateLimit } from "@/hooks/useRateLimit"
import { RateLimitModal } from "@/components/RateLimitModal"
import { UserService } from "@/services/user"
import { PublicUser } from "@/types"
import { getImageUrl } from "@/utils/imageUtils"

<<<<<<< Updated upstream
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
=======
// Interactive How It Works Component with Enhanced Design
const HowItWorksSection = ({ isDark }: { isDark: boolean }) => {
  const [activeTab, setActiveTab] = useState("job-seekers")
  
  const tabContent = {
    "job-seekers": {
      title: "For Job Seekers",
      subtitle: "Build Your AI-Powered Professional Presence",
      icon: User,
      color: "from-blue-500 to-indigo-600",
      steps: [
        {
          icon: User,
          title: "Create Smart Profile",
          description: "Upload your resume or build from scratch. Our AI extracts and organizes your professional data intelligently.",
          highlight: "AI-guided setup"
        },
        {
          icon: Bot,
          title: "AI Conversations",
          description: "Your profile becomes a conversational AI that answers questions about your skills and experience 24/7.",
          highlight: "Always available"
        },
        {
          icon: Target,
          title: "Get Discovered",
          description: "Smart matching algorithms connect you with relevant opportunities while you focus on your work.",
          highlight: "Intelligent matching"
        }
      ]
    },
    "recruiters": {
      title: "For Recruiters",
      subtitle: "Discover & Engage Top Talent Intelligently",
      icon: Search,
      color: "from-green-500 to-emerald-600",
      steps: [
        {
          icon: Search,
          title: "Smart Discovery",
          description: "Use natural language to find candidates. Search by skills, experience, or specific requirements.",
          highlight: "Natural language search"
        },
        {
          icon: MessageCircle,
          title: "Chat with Profiles",
          description: "Ask detailed questions directly to candidate profiles and get instant, accurate responses.",
          highlight: "Instant responses"
        },
        {
          icon: Star,
          title: "Perfect Matches",
          description: "Get AI-powered compatibility scores and detailed insights for better hiring decisions.",
          highlight: "Data-driven decisions"
        }
      ]
    },
    "ai-features": {
      title: "AI Features",
      subtitle: "Powerful AI Tools for Professional Growth",
      icon: Brain,
      color: "from-purple-500 to-pink-600",
      steps: [
        {
          icon: Palette,
          title: "Multiple Variants",
          description: "Choose from default, compact, or advanced profile layouts to match different opportunities.",
          highlight: "Customizable layouts"
        },
        {
          icon: FileText,
          title: "Content Generation",
          description: "Generate personalized cover letters, proposals, and professional content using your profile data.",
          highlight: "AI-powered writing"
        },
        {
          icon: TrendingUp,
          title: "Smart Analytics",
          description: "Track profile views, conversation rates, and optimize your presence for better visibility.",
          highlight: "Performance insights"
        }
      ]
    }
  }

  return (
    <div className={`py-32 relative overflow-hidden ${isDark ? 'bg-gradient-to-b from-[#1a1a1a] via-[#212121] to-[#1a1a1a]' : 'bg-gradient-to-b from-gray-50 via-white to-gray-50'}`}>
      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-[#10a37f]/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#0d8f6f]/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative">
        {/* Section Header */}
        <div className="text-center mb-20 animate-fadeIn">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-[#10a37f]/20 to-[#0d8f6f]/20 text-[#10a37f] border border-[#10a37f]/30 mb-6">
            <Workflow className="w-5 h-5 mr-2" />
            <span className="font-medium">How It Works</span>
          </div>
          <h2 className={`text-5xl md:text-6xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Choose Your <span className="bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] bg-clip-text text-transparent">Journey</span>
          </h2>
          <p className={`text-xl max-w-4xl mx-auto leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Whether you're looking for opportunities or seeking talent, CVChatter transforms how professional networking works
          </p>
        </div>

        {/* Enhanced Interactive Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Custom Tab Navigation */}
          <div className="flex justify-center mb-16">
            <div className={`p-2 rounded-2xl ${isDark ? 'bg-[#2f2f2f]/80' : 'bg-white/80'} backdrop-blur-sm border ${isDark ? 'border-[#565869]/50' : 'border-gray-200/50'} shadow-xl`}>
              <div className="flex space-x-2">
                {Object.entries(tabContent).map(([key, content]) => {
                  const IconComponent = content.icon
                  const isActive = activeTab === key
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key)}
                      className={`relative flex items-center space-x-3 px-6 py-4 rounded-xl transition-all duration-300 font-medium ${
                        isActive
                          ? 'bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] text-white shadow-lg transform scale-105'
                          : isDark
                            ? 'text-gray-300 hover:text-white hover:bg-[#40414f]/50'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <IconComponent className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
                      <span className="hidden sm:inline">{content.title}</span>
                      {isActive && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                      )}
                    </button>
                  )
                })}
>>>>>>> Stashed changes
              </div>
            </div>
          </div>

<<<<<<< Updated upstream
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
=======
          {/* Tab Content */}
          {Object.entries(tabContent).map(([key, content]) => (
            <TabsContent key={key} value={key} className="mt-0">
              <div className="animate-fadeIn">
                {/* Tab Header */}
                <div className="text-center mb-16">
                  <div className={`inline-flex items-center space-x-3 px-8 py-4 rounded-2xl bg-gradient-to-r ${content.color} bg-opacity-10 border border-current border-opacity-20 mb-6`}>
                    <content.icon className="w-8 h-8 text-[#10a37f]" />
                    <h3 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {content.title}
                    </h3>
                  </div>
                  <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {content.subtitle}
                  </p>
                </div>
                
                {/* Steps Grid */}
                <div className="grid lg:grid-cols-3 gap-8">
                  {content.steps.map((step, index) => {
                    const IconComponent = step.icon
                    return (
                      <div 
                        key={index} 
                        className={`group relative p-8 rounded-3xl border-2 transition-all duration-500 hover:shadow-2xl hover:shadow-[#10a37f]/20 ${isDark ? 'bg-gradient-to-br from-[#2f2f2f]/80 to-[#1a1a1a]/80 border-[#565869]/30 hover:border-[#10a37f]/50' : 'bg-gradient-to-br from-white/80 to-gray-50/80 border-gray-200/50 hover:border-[#10a37f]/50'} backdrop-blur-sm hover:scale-105 animate-slideInLeft`}
                        style={{ animationDelay: `${index * 0.2}s` }}
                      >
                        {/* Background Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#10a37f]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                        
                        {/* Step Number */}
                        <div className="relative mb-6">
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <div className="w-16 h-16 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                {index + 1}
                              </div>
                              <div className="absolute -inset-2 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-2xl opacity-30 blur group-hover:opacity-50 transition-opacity duration-300"></div>
                            </div>
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? 'bg-[#40414f]' : 'bg-gray-100'} group-hover:bg-[#10a37f]/20 transition-colors duration-300`}>
                              <IconComponent className="w-6 h-6 text-[#10a37f] group-hover:scale-110 transition-transform duration-300" />
                            </div>
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="relative">
                          <h4 className={`text-2xl font-bold mb-3 group-hover:text-[#10a37f] transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {step.title}
                          </h4>
                          <p className={`text-base leading-relaxed mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            {step.description}
                          </p>
                          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#10a37f]/10 border border-[#10a37f]/20">
                            <CheckCircle className="w-4 h-4 text-[#10a37f]" />
                            <span className="text-sm font-medium text-[#10a37f]">{step.highlight}</span>
                          </div>
                        </div>
                        
                        {/* Decorative Elements */}
                        <div className="absolute top-6 right-6 w-3 h-3 bg-[#10a37f] rounded-full opacity-40 group-hover:opacity-100 group-hover:scale-150 transition-all duration-300"></div>
                        <div className="absolute bottom-6 left-6 w-2 h-2 bg-[#0d8f6f] rounded-full opacity-30 group-hover:opacity-80 transition-opacity duration-300"></div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
>>>>>>> Stashed changes
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

// Animated Top Profiles Showcase Component
const TopProfilesSection = ({ isDark }: { isDark: boolean }) => {
  const [profiles, setProfiles] = useState<PublicUser[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const fetchTopProfiles = async () => {
      try {
        setLoading(true)
        const topProfiles = await UserService.getFeaturedUsers(8, 0, true) // Get 8 top profiles
        setProfiles(topProfiles)
      } catch (error) {
        console.error('Error fetching top profiles:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTopProfiles()
  }, [])

  // Auto-rotate profiles
  useEffect(() => {
    if (profiles.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % profiles.length)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [profiles.length])

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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className={`animate-pulse rounded-2xl p-6 border ${isDark ? 'bg-[#2f2f2f]/30 border-[#565869]/50' : 'bg-white/30 border-gray-300/50'}`}>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
              <div className="w-full space-y-2">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-3 bg-gray-300 rounded w-2/3 mx-auto"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Featured Profile Spotlight */}
      {profiles.length > 0 && (
        <div className="text-center mb-8">
          <div className={`inline-block p-8 rounded-3xl ${isDark ? 'bg-gradient-to-br from-[#2f2f2f]/80 to-[#1a1a1a]/80 border border-[#565869]/50' : 'bg-gradient-to-br from-white/80 to-gray-50/80 border border-gray-200/50'} backdrop-blur-sm shadow-2xl hover:shadow-[#10a37f]/20 transition-all duration-500 profile-card-hover`}>
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <img
                  src={getImageUrl(profiles[currentIndex]?.profile_picture)}
                  alt={profiles[currentIndex]?.name}
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-[#10a37f]/20 shadow-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder-user.jpg";
                  }}
                />
                {profiles[currentIndex]?.is_looking_for_job && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white flex items-center justify-center animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse-glow">
                  AI
                </div>
              </div>
              <div className="text-center space-y-2">
                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {profiles[currentIndex]?.name}
                </h3>
                <p className={`text-sm font-medium text-[#10a37f]`}>
                  {profiles[currentIndex]?.designation || profiles[currentIndex]?.profession || 'Professional'}
                </p>
                {profiles[currentIndex]?.location && (
                  <div className={`flex items-center justify-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{profiles[currentIndex].location}</span>
                  </div>
                )}
              </div>
              <Button
                onClick={() => handleProfileClick(profiles[currentIndex]?.username)}
                className="bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#0a7a5f] text-white px-6 py-2 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#10a37f]/25 hover:scale-105"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat with {profiles[currentIndex]?.name?.split(' ')[0]}
              </Button>
            </div>
          </div>
          
          {/* Profile Indicators */}
          <div className="flex justify-center space-x-2 mt-6">
            {profiles.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-[#10a37f] scale-125 shadow-lg shadow-[#10a37f]/50'
                    : isDark
                      ? 'bg-gray-600 hover:bg-gray-500'
                      : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Profiles Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {profiles.slice(0, 7).map((profile, index) => (
          <Card
            key={profile.id}
            className={`profile-card-hover transition-all duration-500 cursor-pointer group ${isDark ? 'bg-[#2f2f2f]/60 border-[#565869]/40 hover:border-[#10a37f]/50 hover:bg-[#2f2f2f]/80' : 'bg-white/60 border-gray-200/40 hover:border-[#10a37f]/50 hover:bg-white/80'} backdrop-blur-sm animate-fadeIn`}
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => handleProfileClick(profile.username)}
          >
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  <img
                    src={getImageUrl(profile.profile_picture)}
                    alt={profile.name}
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-[#10a37f]/20 group-hover:ring-[#10a37f]/40 transition-all duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-user.jpg";
                    }}
                  />
                  {profile.is_looking_for_job && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="space-y-2 w-full">
                  <h3 className={`text-sm font-semibold group-hover:text-[#10a37f] transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {profile.name}
                  </h3>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {profile.designation || profile.profession || 'Professional'}
                  </p>
                  {profile.location && (
                    <div className={`flex items-center justify-center text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                      <MapPin className="w-3 h-3 mr-1" />
                      <span className="truncate">{profile.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Explore All Card */}
        <Card
          className={`profile-card-hover transition-all duration-500 cursor-pointer group ${isDark ? 'bg-gradient-to-br from-[#10a37f]/10 to-[#0d8f6f]/10 border-[#10a37f]/30 hover:border-[#10a37f]/50' : 'bg-gradient-to-br from-[#10a37f]/5 to-[#0d8f6f]/5 border-[#10a37f]/20 hover:border-[#10a37f]/40'} backdrop-blur-sm`}
          onClick={handleExploreAll}
        >
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-4 h-full justify-center">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#10a37f]/20 to-[#0d8f6f]/20 border-2 border-[#10a37f]/40 flex items-center justify-center group-hover:border-[#10a37f] group-hover:bg-[#10a37f]/30 transition-all duration-300 group-hover:scale-110">
                  <Plus className="w-8 h-8 text-[#10a37f] group-hover:text-white transition-colors duration-300" />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full opacity-20 blur group-hover:opacity-40 transition-opacity duration-300"></div>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-[#10a37f] group-hover:text-white transition-colors duration-300">
                  Explore All Profiles
                </h3>
                <p className={`text-xs ${isDark ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-600 group-hover:text-gray-500'} transition-colors duration-300`}>
                  Discover more AI profiles
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

<<<<<<< Updated upstream
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
=======
// Enhanced Benefits Section Component
const BenefitsSection = ({ isDark }: { isDark: boolean }) => {
  const benefits = [
    {
      icon: Clock,
      title: "24/7 Active Networking",
      description: "Your AI profile never sleeps. It engages with recruiters, answers questions, and showcases your expertise around the clock.",
      stats: "10K+ conversations daily",
      color: "from-blue-500 to-indigo-600",
      highlight: "Always Available"
    },
    {
      icon: Zap,
      title: "Instant Smart Matching",
      description: "Advanced AI algorithms analyze compatibility and connect you with the most relevant opportunities automatically.",
      stats: "95% match accuracy",
      color: "from-green-500 to-emerald-600",
      highlight: "AI-Powered"
    },
    {
      icon: Shield,
      title: "Complete Privacy Control",
      description: "You decide what to share and with whom. Your data remains secure while maximizing your professional visibility.",
      stats: "Enterprise-grade security",
      color: "from-purple-500 to-pink-600",
      highlight: "Secure by Design"
    },
    {
      icon: TrendingUp,
      title: "Accelerated Career Growth",
      description: "Get discovered faster, access better opportunities, and advance your career with intelligent profile optimization.",
      stats: "3x faster job discovery",
      color: "from-orange-500 to-red-600",
      highlight: "Proven Results"
    }
  ]

  return (
    <div className={`py-32 relative overflow-hidden ${isDark ? 'bg-gradient-to-b from-[#212121] via-[#1a1a1a] to-[#212121]' : 'bg-gradient-to-b from-white via-gray-50 to-white'}`}>
      {/* Background Elements */}
      <div className="absolute top-20 left-20 w-40 h-40 bg-[#10a37f]/5 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-[#0d8f6f]/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative">
        {/* Section Header */}
        <div className="text-center mb-20 animate-fadeIn">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-[#10a37f]/20 to-[#0d8f6f]/20 text-[#10a37f] border border-[#10a37f]/30 mb-6">
            <Star className="w-5 h-5 mr-2" />
            <span className="font-medium">Why Choose CVChatter</span>
          </div>
          <h2 className={`text-5xl md:text-6xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <span className="bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] bg-clip-text text-transparent">Intelligent</span> Profiles
            <br />That Actually <span className="bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] bg-clip-text text-transparent">Work</span>
          </h2>
          <p className={`text-xl max-w-4xl mx-auto leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Traditional profiles are static documents. CVChatter profiles are dynamic, intelligent assistants that actively work for your career success.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon
            return (
              <div 
                key={index} 
                className={`group relative p-8 rounded-3xl border-2 transition-all duration-500 hover:shadow-2xl hover:shadow-[#10a37f]/20 ${isDark ? 'bg-gradient-to-br from-[#2f2f2f]/80 to-[#1a1a1a]/80 border-[#565869]/30 hover:border-[#10a37f]/50' : 'bg-gradient-to-br from-white/80 to-gray-50/80 border-gray-200/50 hover:border-[#10a37f]/50'} backdrop-blur-sm hover:scale-105 animate-slideInRight`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#10a37f]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                
                {/* Icon and Badge */}
                <div className="relative flex items-start space-x-6 mb-6">
                  <div className="relative">
                    <div className={`w-16 h-16 bg-gradient-to-r ${benefit.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div className={`absolute -inset-2 bg-gradient-to-r ${benefit.color} rounded-2xl opacity-30 blur group-hover:opacity-50 transition-opacity duration-300`}></div>
                  </div>
                  <div className="flex-1">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#10a37f]/10 border border-[#10a37f]/20 mb-3">
                      <span className="text-xs font-medium text-[#10a37f]">{benefit.highlight}</span>
                    </div>
                    <h3 className={`text-2xl font-bold mb-3 group-hover:text-[#10a37f] transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {benefit.title}
                    </h3>
                  </div>
                </div>
                
                {/* Content */}
                <div className="relative">
                  <p className={`text-base leading-relaxed mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {benefit.description}
                  </p>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-[#10a37f] rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-[#10a37f]">{benefit.stats}</span>
                  </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute top-6 right-6 w-3 h-3 bg-[#10a37f] rounded-full opacity-40 group-hover:opacity-100 group-hover:scale-150 transition-all duration-300"></div>
                <div className="absolute bottom-6 left-6 w-2 h-2 bg-[#0d8f6f] rounded-full opacity-30 group-hover:opacity-80 transition-opacity duration-300"></div>
                
                {/* Gradient Border Effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#10a37f]/0 via-[#10a37f]/20 to-[#10a37f]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
>>>>>>> Stashed changes
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-[#10a37f] rounded-full"></div>
              <div className="absolute bottom-4 left-4 w-3 h-3 bg-[#10a37f]/50 rounded-full"></div>
            </div>
          </div>
        </div>
        
        {/* Bottom CTA */}
        <div className="text-center mt-20 animate-fadeIn" style={{ animationDelay: '1s' }}>
          <div className={`inline-block p-8 rounded-3xl ${isDark ? 'bg-gradient-to-br from-[#2f2f2f]/60 to-[#1a1a1a]/60 border border-[#565869]/30' : 'bg-gradient-to-br from-white/60 to-gray-50/60 border border-gray-200/30'} backdrop-blur-sm`}>
            <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Ready to Experience the Difference?
            </h3>
            <p className={`text-lg mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Join thousands of professionals already using AI-powered profiles
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                className="bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#0a7a5f] text-white px-8 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#10a37f]/25 hover:scale-105"
                onClick={() => router.push("/auth")}
              >
                <Rocket className="w-5 h-5 mr-2" />
                Start Building Your AI Profile
              </Button>
              <Button
                variant="outline"
                className={`px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105 border-2 ${isDark ? 'border-[#565869] hover:border-[#10a37f] text-gray-300 hover:text-white hover:bg-[#10a37f]/10' : 'border-gray-300 hover:border-[#10a37f] text-gray-700 hover:text-gray-900 hover:bg-[#10a37f]/10'}`}
                onClick={() => router.push("/explore")}
              >
                <Users className="w-5 h-5 mr-2" />
                Explore Live Examples
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

<<<<<<< Updated upstream
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
=======
// Enhanced Final CTA Section Component
const FinalCTASection = ({ isDark, router }: { isDark: boolean, router: any }) => {
  return (
    <div className={`py-32 relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-[#1a1a1a] via-[#10a37f]/10 to-[#212121]' : 'bg-gradient-to-br from-white via-[#10a37f]/5 to-gray-50'}`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-40 h-40 bg-[#10a37f]/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-[#0d8f6f]/15 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-36 h-36 bg-[#10a37f]/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 right-1/4 w-28 h-28 bg-[#0d8f6f]/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 text-center relative">
        <div className={`relative rounded-3xl p-16 border-2 overflow-hidden ${isDark ? 'bg-gradient-to-br from-[#2f2f2f]/90 to-[#1a1a1a]/90 border-[#565869]/30' : 'bg-gradient-to-br from-white/90 to-gray-50/90 border-gray-200/30'} backdrop-blur-sm shadow-2xl hover:shadow-[#10a37f]/20 transition-all duration-500 animate-fadeIn`}>
          {/* Decorative Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#10a37f]/20 via-transparent to-[#0d8f6f]/20"></div>
            <div className="absolute top-8 left-8 w-24 h-24 border border-[#10a37f]/30 rounded-full"></div>
            <div className="absolute bottom-8 right-8 w-32 h-32 border border-[#0d8f6f]/30 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-[#10a37f]/20 rounded-full"></div>
          </div>
          
          <div className="relative">
            {/* Icon with Glow Effect */}
            <div className="relative mb-12">
              <div className="w-28 h-28 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full mx-auto flex items-center justify-center shadow-2xl animate-glow">
                <Rocket className="w-14 h-14 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full mx-auto opacity-30 blur-xl animate-pulse-glow"></div>
            </div>
            
            {/* Headline */}
            <h3 className={`text-5xl md:text-6xl font-bold mb-8 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Your AI Profile
              <br />
              <span className="bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] bg-clip-text text-transparent animate-gradient">Awaits</span>
            </h3>
            
            {/* Subheadline */}
            <p className={`text-2xl mb-12 max-w-4xl mx-auto leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Join the revolution in professional networking. Create an intelligent profile that works for you 24/7, connects you with perfect opportunities, and accelerates your career growth.
            </p>
            
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              {[
                { number: "10K+", label: "Active Profiles" },
                { number: "50K+", label: "AI Conversations" },
                { number: "95%", label: "Match Accuracy" },
                { number: "24/7", label: "Always Working" }
              ].map((stat, index) => (
                <div key={index} className="text-center animate-slideUp" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className={`text-3xl font-bold text-[#10a37f] mb-2`}>{stat.number}</div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</div>
                </div>
              ))}
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Button
                className="bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#0a7a5f] text-white px-12 py-5 text-xl rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-[#10a37f]/30 hover:scale-105 flex items-center justify-center font-semibold btn-hover-effect group"
                onClick={() => router.push("/auth")}
              >
                <Rocket className="w-7 h-7 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                Create Your AI Profile
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              
              <Button
                variant="outline"
                className={`px-12 py-5 text-xl rounded-2xl transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 font-semibold group ${isDark ? 'border-[#565869] hover:border-[#10a37f] text-gray-300 hover:text-white hover:bg-[#10a37f]/10' : 'border-gray-300 hover:border-[#10a37f] text-gray-700 hover:text-gray-900 hover:bg-[#10a37f]/10'}`}
                onClick={() => router.push("/explore")}
              >
                <Play className="w-7 h-7 mr-3 group-hover:scale-110 transition-transform duration-300" />
                See Live Examples
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 text-base">
              {[
                { icon: CheckCircle, text: "No credit card required", color: "text-green-500" },
                { icon: Clock, text: "Setup in under 5 minutes", color: "text-blue-500" },
                { icon: Shield, text: "Enterprise-grade security", color: "text-purple-500" },
                { icon: Star, text: "Cancel anytime", color: "text-yellow-500" }
              ].map((item, index) => {
                const IconComponent = item.icon
                return (
                  <div key={index} className={`flex items-center space-x-3 ${isDark ? 'text-gray-400' : 'text-gray-600'} hover:scale-105 transition-transform duration-300`}>
                    <IconComponent className={`w-5 h-5 ${item.color}`} />
                    <span className="font-medium">{item.text}</span>
                  </div>
                )
              })}
>>>>>>> Stashed changes
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
  const heroRef = useRef<HTMLDivElement>(null)

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
      <RateLimitModal
        isOpen={rateLimitState.isOpen}
        onClose={hideRateLimitModal}
        message={rateLimitState.message}
        resetInSeconds={rateLimitState.resetInSeconds}
        isAuthenticated={rateLimitState.isAuthenticated}
        rateLimitType={rateLimitState.rateLimitType}
      />

      {/* Integrated Header + Hero Section */}
      <main className="relative" ref={heroRef}>
        {/* Integrated Header + Hero Section */}
        <div className="relative overflow-hidden min-h-screen flex flex-col">
          {/* Enhanced gradient background */}
          <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-[#1a1a1a] via-[#2f2f2f] to-[#1a1a1a]' : 'bg-gradient-to-br from-white via-gray-100 to-white'}`}></div>
          <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-[#10a37f]/15 via-[#10a37f]/8 to-[#10a37f]/5' : 'bg-gradient-to-br from-[#10a37f]/8 via-[#10a37f]/4 to-[#10a37f]/2'}`}></div>
          
          {/* Animated decorative elements */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-[#10a37f]/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-32 right-20 w-24 h-24 bg-[#0d8f6f]/15 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '3s' }}></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#10a37f]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 left-20 w-20 h-20 bg-[#10a37f]/15 rounded-full blur-xl"></div>
          
          {/* Integrated Header */}
          <header className="relative z-40 w-full">
            <div className="w-full px-2 sm:px-4 lg:px-6">
              <div className="flex justify-between items-center h-16 py-2 min-w-0">
                
                {/* Left side - Logo and Navigation */}
                <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
                  <div className="relative group cursor-pointer" onClick={() => router.push("/")}>
                    <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-[#10a37f]/40 shadow-xl shadow-[#10a37f]/30 group-hover:ring-[#10a37f]/60 group-hover:shadow-[#10a37f]/50 transition-all duration-300 group-hover:scale-110">
                      <img src="/placeholder-user.jpg" alt="CVChatter" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <div className="absolute -inset-2 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-xl opacity-30 blur group-hover:opacity-50 transition-opacity duration-300"></div>
                  </div>
                  <div className="group cursor-pointer" onClick={() => router.push("/")}>
                    <h1 className={`text-xl sm:text-2xl font-bold transition-all duration-300 group-hover:scale-105 ${isDark ? 'bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent group-hover:from-white group-hover:via-[#10a37f] group-hover:to-gray-300' : 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent group-hover:from-gray-900 group-hover:via-[#10a37f] group-hover:to-gray-700'}`}>
                      CVChatter
                    </h1>
                    <p className={`text-xs mt-0.5 transition-all duration-300 group-hover:text-[#10a37f] ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>AI Profiles That Work</p>
                  </div>
                  
                  {/* Navigation Links */}
                  <nav className="hidden md:flex items-center space-x-8" style={{ marginLeft: '4rem' }}>
                    <button className="text-sm font-medium bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] bg-clip-text text-transparent">
                      Home
                    </button>
                    <button
                      onClick={() => router.push("/explore")}
                      className={`text-sm font-medium transition-all duration-300 hover:scale-105 ${isDark ? 'bg-gradient-to-r from-gray-300 to-gray-100 bg-clip-text text-transparent hover:from-[#10a37f] hover:to-[#0d8f6f]' : 'bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent hover:from-[#10a37f] hover:to-[#0d8f6f]'}`}
                    >
                      Explore Talent
                    </button>
                    <button
                      onClick={() => router.push("/ai-writer")}
                      className={`flex items-center gap-2 text-sm font-medium transition-all duration-300 hover:scale-105 ${isDark ? 'bg-gradient-to-r from-gray-300 to-gray-100 bg-clip-text text-transparent hover:from-[#10a37f] hover:to-[#0d8f6f]' : 'bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent hover:from-[#10a37f] hover:to-[#0d8f6f]'}`}
                    >
                      <Sparkles className="w-4 h-4" />
                      AI Writer
                    </button>
                  </nav>
                </div>

                {/* Right side - Auth buttons */}
                <div className="flex items-center space-x-3 flex-shrink-0">
                  {authLoading ? (
                    <div className={`w-8 h-8 rounded-full animate-pulse ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                  ) : isAuthenticated ? (
                    <div className="flex items-center space-x-3">
                      <Button
                        onClick={() => router.push("/profile")}
                        className="bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#0a7a5f] text-white px-6 py-2.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#10a37f]/25 hover:scale-105"
                      >
                        Dashboard
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="ghost"
                        className={`transition-all duration-300 backdrop-blur-sm ${isDark ? 'text-gray-300 hover:text-white hover:bg-[#10a37f]/20 border border-transparent hover:border-[#10a37f]/30' : 'text-gray-600 hover:text-gray-900 hover:bg-[#10a37f]/10 border border-transparent hover:border-[#10a37f]/20'}`}
                        onClick={() => router.push("/auth")}
                      >
                        Sign In
                      </Button>
                      <Button 
                        className="bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#0a7a5f] text-white px-6 py-2.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#10a37f]/25 hover:scale-105" 
                        onClick={() => router.push("/auth")}
                      >
                        <Rocket className="w-4 h-4 mr-2" />
                        Get Started
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>
          
          {/* Hero Content */}
          <div className="flex-1 flex items-center justify-center relative z-30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
              
              {/* Badge */}
              <div className="mb-8 animate-fadeIn">
                <span className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium bg-gradient-to-r from-[#10a37f]/20 to-[#0d8f6f]/20 text-[#10a37f] border border-[#10a37f]/40 backdrop-blur-sm shadow-lg shadow-[#10a37f]/20">
                  <Bot className="w-4 h-4 mr-2" />
                  Your Profile. Their Questions. AI Answers.
                </span>
              </div>
              
<<<<<<< Updated upstream
                              <h1 className={`text-5xl md:text-6xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <span className="text-[#10a37f]">Discover</span> Top Talent 
                </h1>
                <h2 className="text-3xl md:text-4xl font-semibold mb-6">
                  with <span className="text-[#10a37f]">AI</span> powered <span className="text-[#10a37f]">profiles</span>
=======
              {/* Main Headlines */}
              <div className="mb-8 animate-slideUp">
                <h1 className={`text-6xl md:text-7xl font-bold mb-4 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <span className="bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] bg-clip-text text-transparent">AI Profiles</span>
                  <br />That Work
                  <span className="text-[#10a37f] animate-pulse">.</span>
                </h1>
                <h2 className={`text-3xl md:text-4xl font-semibold mb-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  While You <span className="bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] bg-clip-text text-transparent animate-pulse">Sleep</span>
>>>>>>> Stashed changes
                </h2>
              </div>
              
<<<<<<< Updated upstream
              <p className={`text-xl mb-12 max-w-4xl mx-auto leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Build an AI-powered profile that answers questions about your experience 24/7. Perfect matches find you faster, conversations start easier.
              </p>
=======
              {/* Description */}
              <p className={`text-xl mb-10 max-w-4xl mx-auto leading-relaxed animate-fadeIn ${isDark ? 'text-gray-300' : 'text-gray-600'}`} style={{ animationDelay: '0.2s' }}>
                The first professional networking platform where your <strong className="text-[#10a37f]">profile talks back</strong>. 
                Recruiters chat with your AI to discover your skills, while you focus on what matters.
              </p>
              
              {/* Feature Pills */}
              <div className="flex flex-wrap justify-center gap-4 mb-12 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
                <div className={`flex items-center space-x-2 px-6 py-3 rounded-full ${isDark ? 'bg-[#2f2f2f]/80' : 'bg-white/90'} border border-[#10a37f]/30 shadow-lg backdrop-blur-sm hover:scale-105 transition-transform duration-300`}>
                  <Brain className="w-5 h-5 text-[#10a37f]" />
                  <span className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>AI-Powered Conversations</span>
                </div>
                <div className={`flex items-center space-x-2 px-6 py-3 rounded-full ${isDark ? 'bg-[#2f2f2f]/80' : 'bg-white/90'} border border-[#10a37f]/30 shadow-lg backdrop-blur-sm hover:scale-105 transition-transform duration-300`}>
                  <Clock className="w-5 h-5 text-[#10a37f]" />
                  <span className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>24/7 Networking</span>
                </div>
                <div className={`flex items-center space-x-2 px-6 py-3 rounded-full ${isDark ? 'bg-[#2f2f2f]/80' : 'bg-white/90'} border border-[#10a37f]/30 shadow-lg backdrop-blur-sm hover:scale-105 transition-transform duration-300`}>
                  <Zap className="w-5 h-5 text-[#10a37f]" />
                  <span className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Instant Matching</span>
                </div>
              </div>
>>>>>>> Stashed changes

              {/* Search Section */}
              <div className="max-w-4xl mx-auto animate-fadeIn" style={{ animationDelay: '0.6s' }}>
                <div className="relative">
                  <div className={`relative backdrop-blur-sm rounded-2xl border-2 transition-all duration-300 shadow-2xl ${isDark ? 'bg-white/10 border-white/20 hover:border-[#10a37f]/50 focus-within:border-[#10a37f]' : 'bg-white/70 border-gray-300/60 hover:border-[#10a37f]/50 focus-within:border-[#10a37f]'}`}>
                    <div className="flex items-center pl-6 pr-4 py-4">
                      <Search className={`w-6 h-6 mr-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                      <textarea
                        placeholder="Search for React developers, Product managers, AI engineers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className={`w-full bg-transparent border-0 focus:ring-0 focus:outline-none resize-none text-lg leading-6 pr-4 ${isDark ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'}`}
                        rows={1}
                        style={{
                          minHeight: '32px',
                          maxHeight: '120px',
                          overflow: 'hidden'
                        }}
                        onInput={(e) => {
                          const target = e.target as HTMLTextAreaElement;
                          target.style.height = 'auto';
                          const scrollHeight = target.scrollHeight;
                          target.style.height = Math.min(scrollHeight, 120) + 'px';
                        }}
                      />
                      <Button
                        onClick={handleSearchButtonClick}
                        disabled={!searchQuery.trim()}
                        className="bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#0a7a5f] text-white px-8 py-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#10a37f]/25 hover:scale-105"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Popular Searches */}
                <div className="mt-8 text-center">
                  <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Try searching: 
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {["React developers", "Product managers", "AWS certified", "UX designers", "Node.js experts", "Python developers"].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={`px-4 py-2 text-sm rounded-xl border transition-all duration-200 hover:scale-105 ${
                          isDark
                            ? "bg-[#2f2f2f]/60 hover:bg-[#10a37f] text-gray-300 hover:text-white border-[#565869] hover:border-[#10a37f]"
                            : "bg-white/60 hover:bg-[#10a37f] text-gray-700 hover:text-white border-gray-300 hover:border-[#10a37f]"
                        }`}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* CTA Buttons */}
              {!isAuthenticated && (
                <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center items-center animate-fadeIn" style={{ animationDelay: '0.8s' }}>
                  <Button
                    className="bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#0a7a5f] text-white px-10 py-4 text-lg rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-[#10a37f]/30 hover:scale-105 font-semibold"
                    onClick={() => router.push("/auth")}
                  >
                    <Rocket className="w-6 h-6 mr-3" />
                    Create Your AI Profile
                  </Button>
                  <Button
                    variant="outline"
                    className={`px-10 py-4 text-lg rounded-2xl transition-all duration-300 hover:shadow-xl hover:scale-105 font-semibold border-2 ${isDark ? 'border-[#565869] hover:border-[#10a37f] text-gray-300 hover:text-white hover:bg-[#10a37f]/10' : 'border-gray-300 hover:border-[#10a37f] text-gray-700 hover:text-gray-900 hover:bg-[#10a37f]/10'}`}
                    onClick={() => router.push("/explore")}
                  >
                    <Play className="w-6 h-6 mr-3" />
                    See Live Examples
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Gradient transition */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-[#10a37f]/3 to-[#10a37f]/8 pointer-events-none"></div>
        </div>

        {/* Discover Interactive Talent Section */}
        <div className={`relative py-32 ${isDark ? 'bg-gradient-to-b from-[#10a37f]/8 via-[#10a37f]/5 to-[#10a37f]/3' : 'bg-gradient-to-b from-[#10a37f]/5 via-[#10a37f]/3 to-[#10a37f]/2'}`}>
          {/* Background decorations */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-[#0d8f6f]/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-[#10a37f]/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
          
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative">
            <div className="text-center mb-16 animate-fadeIn">
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-[#10a37f]/20 to-[#0d8f6f]/20 text-[#10a37f] border border-[#10a37f]/30 mb-6">
                <Users className="w-5 h-5 mr-2" />
                <span className="font-medium">Live AI Profiles</span>
              </div>
              <h3 className={`text-5xl md:text-6xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Meet Our <span className="bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] bg-clip-text text-transparent">AI Professionals</span>
              </h3>
              <p className={`text-xl mb-8 max-w-4xl mx-auto leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Real professionals with AI-powered profiles that answer questions, showcase skills, and connect opportunities. Try chatting with them!
              </p>
            </div>

            {/* Top Profiles Grid */}
            <TopProfilesSection isDark={isDark} />

<<<<<<< Updated upstream
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
=======
            {/* CTA Section */}
            {!isAuthenticated && (
              <div className="text-center mt-16 animate-fadeIn" style={{ animationDelay: '0.5s' }}>
                <div className={`inline-block p-8 rounded-3xl ${isDark ? 'bg-gradient-to-br from-[#2f2f2f]/60 to-[#1a1a1a]/60 border border-[#565869]/30' : 'bg-gradient-to-br from-white/60 to-gray-50/60 border border-gray-200/30'} backdrop-blur-sm shadow-xl`}>
                  <h4 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Ready to Create Your Own AI Profile?
                  </h4>
                  <p className={`text-lg mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Join these professionals and start networking with AI
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      className="bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#0a7a5f] text-white px-10 py-4 text-lg rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#10a37f]/25 hover:scale-105 font-semibold"
                      onClick={() => router.push("/auth")}
                    >
                      <Rocket className="w-6 h-6 mr-2" />
                      Start Building for Free
                    </Button>
                    <Button
                      variant="outline"
                      className={`px-10 py-4 text-lg rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 font-semibold ${isDark ? 'border-[#565869] hover:border-[#10a37f] text-gray-300 hover:text-white hover:bg-[#10a37f]/10' : 'border-gray-300 hover:border-[#10a37f] text-gray-700 hover:text-gray-900 hover:bg-[#10a37f]/10'}`}
                      onClick={() => router.push("/explore")}
                    >
                      <Search className="w-6 h-6 mr-2" />
                      Explore All Profiles
                    </Button>
                  </div>
                </div>
>>>>>>> Stashed changes
              </div>
            )}
          </div>
        </div>
        
        {/* Visual Flow Section */}
        <div className={`py-32 relative overflow-hidden ${isDark ? 'bg-gradient-to-b from-[#212121] via-[#1a1a1a] to-[#212121]' : 'bg-gradient-to-b from-white via-gray-50 to-white'}`}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-20 w-64 h-64 border border-[#10a37f] rounded-full"></div>
            <div className="absolute bottom-20 right-20 w-48 h-48 border border-[#0d8f6f] rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-[#10a37f]/50 rounded-full"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative">
            {/* Section Header */}
            <div className="text-center mb-20 animate-fadeIn">
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-[#10a37f]/20 to-[#0d8f6f]/20 text-[#10a37f] border border-[#10a37f]/30 mb-6">
                <Workflow className="w-5 h-5 mr-2" />
                <span className="font-medium">Simple Process</span>
              </div>
              <h2 className={`text-5xl md:text-6xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                From Profile to <span className="bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] bg-clip-text text-transparent">Opportunities</span>
              </h2>
              <p className={`text-xl max-w-4xl mx-auto leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                See how CVChatter transforms traditional networking into an intelligent, automated process that works while you sleep
              </p>
            </div>

            {/* Visual Flow Steps */}
            <div className="space-y-24">
              {/* Step 1 */}
              <div className="flex flex-col lg:flex-row items-center gap-16 animate-slideInLeft">
                <div className="flex-1">
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#10a37f]/10 border border-[#10a37f]/20 mb-6">
                    <span className="text-sm font-medium text-[#10a37f]">Step 1</span>
                  </div>
                  <h3 className={`text-4xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Upload & <span className="text-[#10a37f]">AI Enhancement</span>
                  </h3>
                  <p className={`text-xl leading-relaxed mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Upload your resume or LinkedIn profile. Our AI extracts and enhances your professional data, creating a comprehensive, searchable profile in minutes.
                  </p>
                  <div className="space-y-4">
                    {[
                      "Automatic data extraction from PDFs",
                      "AI-powered skill detection and categorization",
                      "Professional summary optimization",
                      "Smart project and experience organization"
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-[#10a37f] flex-shrink-0" />
                        <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-1">
                  <div className={`p-8 rounded-3xl ${isDark ? 'bg-gradient-to-br from-[#2f2f2f]/60 to-[#1a1a1a]/60 border border-[#565869]/30' : 'bg-gradient-to-br from-white/60 to-gray-50/60 border border-gray-200/30'} backdrop-blur-sm shadow-2xl`}>
                    <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-[#10a37f]/20 to-[#0d8f6f]/20 flex items-center justify-center border-2 border-dashed border-[#10a37f]/40">
                      <div className="text-center">
                        <FileText className="w-16 h-16 text-[#10a37f] mx-auto mb-4" />
                        <p className={`text-lg font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>AI Profile Creation Process</p>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Screenshot placeholder</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col lg:flex-row-reverse items-center gap-16 animate-slideInRight">
                <div className="flex-1">
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#10a37f]/10 border border-[#10a37f]/20 mb-6">
                    <span className="text-sm font-medium text-[#10a37f]">Step 2</span>
                  </div>
                  <h3 className={`text-4xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    <span className="text-[#10a37f]">AI Conversations</span> Begin
                  </h3>
                  <p className={`text-xl leading-relaxed mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Your profile becomes an intelligent assistant that can answer questions about your experience, skills, and career goals - available 24/7 to engage with recruiters and opportunities.
                  </p>
                  <div className="space-y-4">
                    {[
                      "Natural language conversations about your skills",
                      "Instant responses to recruiter questions",
                      "Contextual information sharing",
                      "Professional tone and accuracy guaranteed"
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Bot className="w-5 h-5 text-[#10a37f] flex-shrink-0" />
                        <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-1">
                  <div className={`p-8 rounded-3xl ${isDark ? 'bg-gradient-to-br from-[#2f2f2f]/60 to-[#1a1a1a]/60 border border-[#565869]/30' : 'bg-gradient-to-br from-white/60 to-gray-50/60 border border-gray-200/30'} backdrop-blur-sm shadow-2xl`}>
                    <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-[#10a37f]/20 to-[#0d8f6f]/20 flex items-center justify-center border-2 border-dashed border-[#10a37f]/40">
                      <div className="text-center">
                        <MessageCircle className="w-16 h-16 text-[#10a37f] mx-auto mb-4" />
                        <p className={`text-lg font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>AI Chat Interface</p>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Screenshot placeholder</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col lg:flex-row items-center gap-16 animate-slideInLeft">
                <div className="flex-1">
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#10a37f]/10 border border-[#10a37f]/20 mb-6">
                    <span className="text-sm font-medium text-[#10a37f]">Step 3</span>
                  </div>
                  <h3 className={`text-4xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    <span className="text-[#10a37f]">Smart Matching</span> & Growth
                  </h3>
                  <p className={`text-xl leading-relaxed mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Advanced algorithms analyze compatibility between your profile and opportunities, while providing insights and analytics to optimize your professional presence.
                  </p>
                  <div className="space-y-4">
                    {[
                      "Intelligent job and recruiter matching",
                      "Performance analytics and insights",
                      "Profile optimization recommendations",
                      "Career growth tracking and guidance"
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <TrendingUp className="w-5 h-5 text-[#10a37f] flex-shrink-0" />
                        <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-1">
                  <div className={`p-8 rounded-3xl ${isDark ? 'bg-gradient-to-br from-[#2f2f2f]/60 to-[#1a1a1a]/60 border border-[#565869]/30' : 'bg-gradient-to-br from-white/60 to-gray-50/60 border border-gray-200/30'} backdrop-blur-sm shadow-2xl`}>
                    <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-[#10a37f]/20 to-[#0d8f6f]/20 flex items-center justify-center border-2 border-dashed border-[#10a37f]/40">
                      <div className="text-center">
                        <Target className="w-16 h-16 text-[#10a37f] mx-auto mb-4" />
                        <p className={`text-lg font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Smart Matching Dashboard</p>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Screenshot placeholder</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="text-center mt-20 animate-fadeIn" style={{ animationDelay: '1s' }}>
              <div className={`inline-block p-8 rounded-3xl ${isDark ? 'bg-gradient-to-br from-[#2f2f2f]/60 to-[#1a1a1a]/60 border border-[#565869]/30' : 'bg-gradient-to-br from-white/60 to-gray-50/60 border border-gray-200/30'} backdrop-blur-sm shadow-xl`}>
                <h3 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Ready to Start Your AI-Powered Career Journey?
                </h3>
                <p className={`text-lg mb-6 max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Join thousands of professionals who are already using AI to accelerate their careers
                </p>
                <Button
                  className="bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#0a7a5f] text-white px-12 py-4 text-lg rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#10a37f]/25 hover:scale-105 font-semibold"
                  onClick={() => router.push("/auth")}
                >
                  <Rocket className="w-6 h-6 mr-3" />
                  Start Building Your AI Profile
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
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

<<<<<<< Updated upstream
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
=======
        {/* Enhanced Stats Section */}
        <div className={`py-20 relative ${isDark ? 'bg-gradient-to-b from-[#10a37f]/8 to-[#10a37f]/3' : 'bg-gradient-to-b from-[#10a37f]/5 to-[#10a37f]/2'}`}>
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: Users, number: "10K+", label: "Active AI Profiles", description: "Professionals using AI networking" },
                { icon: MessageCircle, number: "50K+", label: "Daily Conversations", description: "AI-powered interactions" },
                { icon: Target, number: "95%", label: "Match Accuracy", description: "Successful connections made" },
                { icon: Clock, number: "24/7", label: "Always Working", description: "Your profile never sleeps" }
              ].map((stat, index) => {
                const IconComponent = stat.icon
                return (
                  <div key={index} className="text-center group animate-slideUp" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="relative mb-6">
                      <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <IconComponent className="w-10 h-10 text-white" />
                      </div>
                      <div className="absolute -inset-2 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-2xl opacity-30 blur group-hover:opacity-50 transition-opacity duration-300"></div>
                    </div>
                    <div className={`text-4xl font-bold mb-2 group-hover:text-[#10a37f] transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {stat.number}
                    </div>
                    <div className={`font-semibold mb-2 text-lg ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                      {stat.label}
                    </div>
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {stat.description}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
>>>>>>> Stashed changes
        
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
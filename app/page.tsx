"use client"

import { useState, useEffect } from "react"
import { Search, Users, Briefcase, X, Star, ChevronLeft, ChevronRight, MessageCircle, ArrowRight, MapPin, Plus, Palette, FileText, Download, Share2, Eye, Sparkles, Zap, Target, TrendingUp, Clock, Shield, Rocket, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { useTheme } from "@/context/ThemeContext"
import Header from "@/components/Header"
import { useRateLimit } from "@/hooks/useRateLimit"
import { RateLimitModal } from "@/components/RateLimitModal"
import { UserService } from "@/services/user"
import { PublicUser } from "@/types"
import { getImageUrl } from "@/utils/imageUtils"

// Interactive How It Works Component with Tabbed Interface
const HowItWorksSection = ({ isDark }: { isDark: boolean }) => {
  const [activeTab, setActiveTab] = useState("job-seekers")
  
  const tabContent = {
    "job-seekers": {
      title: "For Job Seekers",
      subtitle: "Build Your AI-Powered Professional Presence",
      steps: [
        {
          icon: User,
          title: "Create Smart Profile",
          description: "Build your comprehensive professional profile with our AI-guided setup",
          image: "/images/steps/job-seeker-1.png"
        },
        {
          icon: MessageCircle,
          title: "AI Conversations",
          description: "Your profile answers questions about your skills and experience 24/7",
          image: "/images/steps/job-seeker-2.png"
        },
        {
          icon: Target,
          title: "Get Discovered",
          description: "Perfect matches find you faster with intelligent profile matching",
          image: "/images/steps/job-seeker-3.png"
        }
      ]
    },
    "recruiters": {
      title: "For Recruiters",
      subtitle: "Discover & Engage Top Talent Intelligently",
      steps: [
        {
          icon: Search,
          title: "Smart Discovery",
          description: "Find candidates using natural language search and AI matching",
          image: "/images/steps/recruiter-1.png"
        },
        {
          icon: MessageCircle,
          title: "Chat with Profiles",
          description: "Ask detailed questions directly to candidate profiles instantly",
          image: "/images/steps/recruiter-2.png"
        },
        {
          icon: Star,
          title: "Perfect Matches",
          description: "Get AI-powered compatibility scores and detailed insights",
          image: "/images/steps/recruiter-3.png"
        }
      ]
    },
    "ai-features": {
      title: "AI Features",
      subtitle: "Powerful AI Tools for Professional Growth",
      steps: [
        {
          icon: Palette,
          title: "Multiple Themes",
          description: "Create different portfolio variants for different opportunities",
          image: "/images/steps/ai-features-1.png"
        },
        {
          icon: FileText,
          title: "Content Generation",
          description: "Generate personalized cover letters and proposals using your profile",
          image: "/images/steps/ai-features-2.png"
        },
        {
          icon: TrendingUp,
          title: "Smart Analytics",
          description: "Track profile performance and optimize for better visibility",
          image: "/images/steps/ai-features-3.png"
        }
      ]
    }
  }

  return (
    <div className={`py-24 ${isDark ? 'bg-gradient-to-b from-[#1a1a1a] to-[#212121]' : 'bg-gradient-to-b from-gray-50 to-white'}`}>
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className={`text-4xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            How It <span className="text-[#10a37f]">Works</span>
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Choose your path and see how CVChatter transforms professional networking
          </p>
        </div>

        {/* Interactive Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid w-full grid-cols-3 mb-12 ${isDark ? 'bg-[#2f2f2f]' : 'bg-gray-100'}`}>
            <TabsTrigger value="job-seekers" className="data-[state=active]:bg-[#10a37f] data-[state=active]:text-white">
              For Job Seekers
            </TabsTrigger>
            <TabsTrigger value="recruiters" className="data-[state=active]:bg-[#10a37f] data-[state=active]:text-white">
              For Recruiters
            </TabsTrigger>
            <TabsTrigger value="ai-features" className="data-[state=active]:bg-[#10a37f] data-[state=active]:text-white">
              AI Features
            </TabsTrigger>
          </TabsList>

          {Object.entries(tabContent).map(([key, content]) => (
            <TabsContent key={key} value={key} className="mt-0">
              <div className="text-center mb-12">
                <h3 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {content.title}
                </h3>
                <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {content.subtitle}
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {content.steps.map((step, index) => {
                  const IconComponent = step.icon
                  return (
                    <div key={index} className={`relative p-8 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:shadow-[#10a37f]/10 ${isDark ? 'bg-[#2f2f2f]/50 border-[#565869]/50 hover:border-[#10a37f]/50' : 'bg-white border-gray-200 hover:border-[#10a37f]/50'} backdrop-blur-sm group`}>
                      {/* Step Image Placeholder */}
                      <div className={`aspect-[4/3] rounded-lg mb-6 overflow-hidden ${isDark ? 'bg-[#1a1a1a]' : 'bg-gray-100'} flex items-center justify-center border-2 border-dashed border-[#10a37f]/30`}>
                        <div className="text-center">
                          <IconComponent className="w-12 h-12 text-[#10a37f] mx-auto mb-2" />
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Screenshot Coming Soon</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full flex items-center justify-center text-white font-semibold text-sm group-hover:scale-110 transition-transform duration-300">
                          {index + 1}
                        </div>
                        <h4 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {step.title}
                        </h4>
                      </div>
                      
                      <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {step.description}
                      </p>
                      
                      {/* Decorative elements */}
                      <div className="absolute top-4 right-4 w-2 h-2 bg-[#10a37f] rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  )
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}

// Hero Statistics Component
const HeroStatsSection = ({ isDark }: { isDark: boolean }) => {
  const stats = [
    {
      icon: Users,
      number: "10K+",
      label: "Active Profiles",
      description: "Professionals using AI profiles"
    },
    {
      icon: MessageCircle,
      number: "50K+",
      label: "Conversations",
      description: "AI-powered interactions daily"
    },
    {
      icon: Target,
      number: "95%",
      label: "Match Rate",
      description: "Better matches with AI insights"
    },
    {
      icon: Clock,
      number: "24/7",
      label: "Always On",
      description: "Your profile never sleeps"
    }
  ]

  return (
    <div className={`py-16 border-y ${isDark ? 'bg-[#2f2f2f]/30 border-[#565869]/50' : 'bg-white/50 border-gray-200'}`}>
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div key={index} className="text-center group">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <div className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {stat.number}
                </div>
                <div className={`font-semibold mb-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
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

// Benefits Section Component
const BenefitsSection = ({ isDark }: { isDark: boolean }) => {
  const benefits = [
    {
      icon: Clock,
      title: "Always-On Networking",
      description: "Your profile works 24/7, answering questions about your skills and experience. Never miss an opportunity.",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      icon: Zap,
      title: "Instant Connections",
      description: "Skip the guesswork. Your profile provides detailed insights for better matches and meaningful conversations.",
      gradient: "from-green-500 to-teal-600"
    },
    {
      icon: Shield,
      title: "Privacy Control",
      description: "You control what information to share and with whom. Complete transparency with full privacy protection.",
      gradient: "from-red-500 to-pink-600"
    },
    {
      icon: TrendingUp,
      title: "Career Growth",
      description: "Get discovered faster and connect with the right opportunities. Your intelligent profile accelerates your career.",
      gradient: "from-yellow-500 to-orange-600"
    }
  ]

  return (
    <div className={`py-24 ${isDark ? 'bg-gradient-to-b from-[#212121] to-[#1a1a1a]' : 'bg-gradient-to-b from-white to-gray-50'}`}>
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16">
          <h2 className={`text-4xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Why Choose <span className="text-[#10a37f]">CVChatter</span>?
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Traditional profiles just sit there. CVChatter profiles actively work for your success.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon
            return (
              <div key={index} className={`relative p-8 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:shadow-[#10a37f]/10 ${isDark ? 'bg-[#2f2f2f]/50 border-[#565869]/50 hover:border-[#10a37f]/50' : 'bg-white border-gray-200 hover:border-[#10a37f]/50'} backdrop-blur-sm group`}>
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {benefit.title}
                    </h3>
                    <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {benefit.description}
                    </p>
                  </div>
                </div>
                
                {/* Decorative gradient line */}
                <div className="absolute bottom-0 left-8 right-8 h-0.5 bg-gradient-to-r from-[#10a37f] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Final CTA Section Component
const FinalCTASection = ({ isDark, router }: { isDark: boolean, router: any }) => {
  return (
    <div className={`py-24 ${isDark ? 'bg-gradient-to-b from-[#10a37f]/10 to-[#212121]' : 'bg-gradient-to-b from-[#10a37f]/5 to-white'}`}>
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        <div className={`relative rounded-3xl p-12 border overflow-hidden ${isDark ? 'bg-gradient-to-br from-[#2f2f2f]/80 to-[#1a1a1a]/80 border-[#565869]/50' : 'bg-gradient-to-br from-white/80 to-gray-50/80 border-gray-300/50'} backdrop-blur-sm`}>
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-[#10a37f]/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#10a37f]/5 rounded-full blur-3xl"></div>
          
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full mx-auto mb-8 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            
            <h3 className={`text-4xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Ready to Try the Future of
              <span className="text-[#10a37f]"> Professional Networking</span>?
            </h3>
            
            <p className={`text-xl mb-8 max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Join thousands of professionals already using AI-powered profiles to accelerate their careers and make meaningful connections.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                className="bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#0a7a5f] text-white px-10 py-4 text-lg rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#10a37f]/25 hover:scale-105 flex items-center justify-center"
                onClick={() => router.push("/auth")}
              >
                <Rocket className="w-6 h-6 mr-2" />
                Get Started for Free
              </Button>
              
              <Button
                variant="outline"
                className={`px-10 py-4 text-lg rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-105 ${isDark ? 'border-[#565869] hover:border-[#10a37f] text-gray-300 hover:text-white hover:bg-[#10a37f]/10' : 'border-gray-300 hover:border-[#10a37f] text-gray-700 hover:text-gray-900 hover:bg-[#10a37f]/10'}`}
                onClick={() => router.push("/explore")}
              >
                <Users className="w-6 h-6 mr-2" />
                View Live Examples
              </Button>
            </div>
            
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
              <div className={`flex items-center space-x-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>No credit card required</span>
              </div>
              <div className={`flex items-center space-x-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Setup in under 5 minutes</span>
              </div>
              <div className={`flex items-center space-x-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Cancel anytime</span>
              </div>
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
                  <span className="text-[#10a37f]">AI Profiles</span> That Work
                </h1>
                <h2 className="text-3xl md:text-4xl font-semibold mb-6">
                  While You <span className="text-[#10a37f]">Sleep</span>
                </h2>
              
              <p className={`text-xl mb-8 max-w-4xl mx-auto leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                The first professional networking platform where your <strong>profile talks back</strong>. 
                Recruiters chat with your AI to discover your skills, while you focus on what matters.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${isDark ? 'bg-[#2f2f2f]/50' : 'bg-white/80'} border border-[#10a37f]/20`}>
                  <Sparkles className="w-4 h-4 text-[#10a37f]" />
                  <span className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>AI-Powered Conversations</span>
                </div>
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${isDark ? 'bg-[#2f2f2f]/50' : 'bg-white/80'} border border-[#10a37f]/20`}>
                  <Clock className="w-4 h-4 text-[#10a37f]" />
                  <span className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>24/7 Networking</span>
                </div>
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${isDark ? 'bg-[#2f2f2f]/50' : 'bg-white/80'} border border-[#10a37f]/20`}>
                  <Zap className="w-4 h-4 text-[#10a37f]" />
                  <span className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Instant Matching</span>
                </div>
              </div>

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
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  {!isAuthenticated && (
                    <>
                      <Button
                        className="bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#0a7a5f] text-white px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center justify-center"
                        onClick={() => router.push("/auth")}
                      >
                        <Rocket className="w-5 h-5 mr-2" />
                        Start Building for Free
                      </Button>
                      <Button
                        variant="outline"
                        className={`px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-105 ${isDark ? 'border-[#565869] hover:border-[#10a37f] text-gray-300 hover:text-white hover:bg-[#10a37f]/10' : 'border-gray-300 hover:border-[#10a37f] text-gray-700 hover:text-gray-900 hover:bg-[#10a37f]/10'}`}
                        onClick={() => router.push("/explore")}
                      >
                        <Search className="w-5 h-5 mr-2" />
                        Explore AI Profiles
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        

        {/* Hero Stats Section */}
        <HeroStatsSection isDark={isDark} />
        
        {/* How It Works Tabbed Section */}
        <HowItWorksSection isDark={isDark} />

        {/* Benefits Section */}
        <BenefitsSection isDark={isDark} />


        {/* Final CTA Section - Only show for non-authenticated users */}
        {!isAuthenticated && <FinalCTASection isDark={isDark} router={router} />}
      </main>
    </div>
  )
} 
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useTheme } from "@/context/ThemeContext"
import { Home, Search, ArrowLeft, Sparkles, Users, MessageCircle, Target, Zap, Clock, Shield, TrendingUp, User, UserX, Eye, Globe } from "lucide-react"

interface ProfileNotFoundProps {
  username?: string
  isDark: boolean
}

export default function ProfileNotFound({ username, isDark }: ProfileNotFoundProps) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const quickActions = [
    {
      icon: Search,
      title: "Explore Talent",
      description: "Discover other professionals",
      action: () => router.push("/explore"),
      gradient: "from-green-500 to-teal-600"
    },
    {
      icon: Home,
      title: "Go Home",
      description: "Return to the main page",
      action: () => router.push("/"),
      gradient: "from-blue-500 to-purple-600"
    },
    {
      icon: Sparkles,
      title: "AI Writer",
      description: "Generate content with AI",
      action: () => router.push("/ai-writer"),
      gradient: "from-yellow-500 to-orange-600"
    }
  ]

  const features = [
    {
      icon: MessageCircle,
      title: "AI Conversations",
      description: "Chat with professional profiles"
    },
    {
      icon: Target,
      title: "Smart Matching",
      description: "Find perfect opportunities"
    },
    {
      icon: Zap,
      title: "Instant Connections",
      description: "Skip the guesswork"
    },
    {
      icon: Shield,
      title: "Privacy Control",
      description: "Control your information"
    }
  ]

  return (
    <div className="relative">
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
            {/* Profile Not Found Display */}
            <div className="mb-8">
              <div className="relative inline-block">
                <div className={`w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center ${isDark ? 'bg-gradient-to-br from-[#2f2f2f] to-[#1a1a1a] border border-gray-700/50' : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200/50'} shadow-2xl`}>
                  <UserX className="w-16 h-16 text-[#10a37f]" />
                </div>
                {/* Decorative elements around profile icon */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#10a37f]/20 rounded-full blur-sm animate-bounce"></div>
                <div className="absolute -top-2 -right-6 w-6 h-6 bg-[#0d8f6f]/15 rounded-full blur-sm animate-bounce" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute -bottom-4 -right-2 w-4 h-4 bg-[#10a37f]/25 rounded-full blur-sm animate-bounce" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>
            
            <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Profile Not Found
            </h1>
            
            {username && (
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-6 ${isDark ? 'bg-[#2f2f2f]/50 border border-[#565869]/50' : 'bg-white/80 border border-gray-200'}`}>
                <User className="w-4 h-4 mr-2 text-[#10a37f]" />
                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                  @{username}
                </span>
              </div>
            )}
            
            <p className={`text-xl mb-8 max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              This profile might be private, deleted, or the username might be incorrect. 
              Don't worry though - there are plenty of amazing professionals to discover!
            </p>
            
            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                className="bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#0a7a5f] text-white px-8 py-4 text-lg rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#10a37f]/25 hover:scale-105 flex items-center justify-center"
                onClick={() => router.push("/explore")}
              >
                <Search className="w-6 h-6 mr-2" />
                Explore Other Profiles
              </Button>
              
              <Button
                variant="outline"
                className={`px-8 py-4 text-lg rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-105 ${isDark ? 'border-[#565869] hover:border-[#10a37f] text-gray-300 hover:text-white hover:bg-[#10a37f]/10' : 'border-gray-300 hover:border-[#10a37f] text-gray-700 hover:text-gray-900 hover:bg-[#10a37f]/10'}`}
                onClick={() => router.push("/")}
              >
                <Home className="w-6 h-6 mr-2" />
                Go Home
              </Button>
            </div>
          </div>
        </div>
        
        {/* Gradient transition to blend with next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-[#10a37f]/3 to-[#10a37f]/5 pointer-events-none"></div>
      </div>

      {/* Quick Actions Section */}
      <div className={`py-16 ${isDark ? 'bg-gradient-to-b from-[#10a37f]/5 to-[#212121]' : 'bg-gradient-to-b from-[#10a37f]/3 to-white'}`}>
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              What Would You Like to Do?
            </h3>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Here are some great alternatives to explore
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon
              return (
                <div
                  key={index}
                  onClick={action.action}
                  className={`relative p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:shadow-[#10a37f]/10 cursor-pointer group ${isDark ? 'bg-[#2f2f2f]/50 border-[#565869]/50 hover:border-[#10a37f]/50' : 'bg-white border-gray-200 hover:border-[#10a37f]/50'} backdrop-blur-sm`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {action.title}
                      </h4>
                      <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {action.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Decorative gradient line */}
                  <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-[#10a37f] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className={`py-16 ${isDark ? 'bg-gradient-to-b from-[#212121] to-[#1a1a1a]' : 'bg-gradient-to-b from-white to-gray-50'}`}>
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Discover What Makes CVChatter Special
            </h3>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              While you're here, explore our amazing features
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div key={index} className={`relative p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:shadow-[#10a37f]/10 ${isDark ? 'bg-[#2f2f2f]/50 border-[#565869]/50 hover:border-[#10a37f]/50' : 'bg-white border-gray-200 hover:border-[#10a37f]/50'} backdrop-blur-sm group`}>
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h4 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {feature.title}
                    </h4>
                    <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {feature.description}
                    </p>
                  </div>
                  
                  {/* Decorative gradient line */}
                  <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-[#10a37f] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className={`py-16 ${isDark ? 'bg-gradient-to-b from-[#10a37f]/10 to-[#212121]' : 'bg-gradient-to-b from-[#10a37f]/5 to-white'}`}>
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <div className={`relative rounded-3xl p-12 border overflow-hidden ${isDark ? 'bg-gradient-to-br from-[#2f2f2f]/80 to-[#1a1a1a]/80 border-[#565869]/50' : 'bg-gradient-to-br from-white/80 to-gray-50/80 border-gray-300/50'} backdrop-blur-sm`}>
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-[#10a37f]/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#10a37f]/5 rounded-full blur-3xl"></div>
            
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full mx-auto mb-8 flex items-center justify-center">
                <Globe className="w-10 h-10 text-white" />
              </div>
              
              <h3 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Ready to Explore Amazing Talent?
              </h3>
              
              <p className={`text-lg mb-8 max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Don't let one missing profile stop you from discovering incredible professionals. 
                Join thousands of users exploring AI-powered profiles.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  className="bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#0a7a5f] text-white px-10 py-4 text-lg rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#10a37f]/25 hover:scale-105 flex items-center justify-center"
                  onClick={() => router.push("/explore")}
                >
                  <Eye className="w-6 h-6 mr-2" />
                  Explore Profiles
                </Button>
                
                <Button
                  variant="outline"
                  className={`px-10 py-4 text-lg rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-105 ${isDark ? 'border-[#565869] hover:border-[#10a37f] text-gray-300 hover:text-white hover:bg-[#10a37f]/10' : 'border-gray-300 hover:border-[#10a37f] text-gray-700 hover:text-gray-900 hover:bg-[#10a37f]/10'}`}
                  onClick={() => router.push("/")}
                >
                  <Users className="w-6 h-6 mr-2" />
                  Go Home
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

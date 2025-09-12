"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useAuth } from "@/context/AuthContext"
import { useTheme } from "@/context/ThemeContext"
import { getThemeClasses } from "@/utils/theme"
import Header from "@/components/Header"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { User as UserType } from "@/types"
import { useRateLimit } from "@/hooks/useRateLimit"
import { RateLimitModal } from "@/components/RateLimitModal"
import { Building2, User, FileText, Briefcase, Sparkles, Settings, Palette, BarChart3, Mail, FileEdit, Users, Zap, MessageCircle, Plus, AlertCircle, CheckCircle, Copy, Send, Clock, Type, BookOpen, RotateCcw, Download, File, Clipboard } from "lucide-react"
import { calculateProfileCompletion } from "@/utils/profileCompletion"
import { canAccessAIWriter } from "@/utils/profileScoreValidation"
import ProfileScoreRestrictionMessage from "@/components/ProfileScoreRestrictionMessage"
import { useChat } from 'ai/react'
import ResizableSplitPane from "@/components/ResizableSplitPane"
import { useIsMobile } from "@/hooks/use-mobile"
import AIWriterMobile from "@/components/AIWriterMobile"

// Content generation types
type ContentType = 'cover_letter' | 'proposal'
type JobType = 'email' | 'linkedin' | 'freelance' | 'other'
type Tone = 'professional' | 'enthusiastic' | 'conversational'
type Length = 'brief' | 'standard' | 'detailed'

interface ContentGenerationOptions {
  jobDescription: string
  companyName: string
  positionTitle: string
  tone: Tone
  length: Length
  additionalInstructions: string
}

// Enhanced Cover Letter Display Component with copy functionality
function CoverLetterDisplay({ content, isStreaming, onCopy }: { content: string, isStreaming: boolean, onCopy: () => void }) {
  const { isDark } = useTheme()
  
  if (!content) return null
  
  return (
    <div className={`p-4 text-base leading-relaxed ${isDark ? 'text-white' : 'text-gray-900'}`}>
      <div style={{ whiteSpace: 'pre-line' }}>
        {content}
        {isStreaming && (
          <span className="inline-block w-0.5 h-5 bg-[#10a37f] ml-1 animate-pulse"></span>
        )}
      </div>
    </div>
  )
}




export default function ContentGeneratorPage() {
  const { user, isAuthenticated, loading: authLoading, refreshUser } = useAuth()
  const { isDark } = useTheme()
  const theme = getThemeClasses(isDark)
  const router = useRouter()
  const { toast } = useToast()
  const { showRateLimitModal, hideRateLimitModal, rateLimitState } = useRateLimit()
  const isMobile = useIsMobile()

  // State for content generation options
  const [options, setOptions] = useState<ContentGenerationOptions>({
    jobDescription: '',
    companyName: '',
    positionTitle: '',
    tone: 'professional',
    length: 'brief',
    additionalInstructions: ''
  })

  // State for generation process
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState('')
  const [streamingContent, setStreamingContent] = useState('')
  
  // Ref for additional instructions field
  const additionalInstructionsRef = useRef<HTMLTextAreaElement>(null)

  const handleGenerate = useCallback(async () => {
    if (!options.jobDescription.trim()) return
    
    // Check if user has sufficient profile score
    if (!user || !canAccessAIWriter(user)) {
      toast({
        title: "Profile Completion Required",
        description: "Complete your profile to at least 50% to access the AI Writer feature.",
        variant: "destructive"
      })
      return
    }

    setIsGenerating(true)
    setGeneratedContent('')
    setStreamingContent('')
    
    try {
      // Priority 1: Check backend rate limiting first
      const rateLimitResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/content-generator/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          content_type: 'cover_letter'
        })
      })

      if (rateLimitResponse.status === 429) {
        const rateLimitError = await rateLimitResponse.json()
        
        const apiError = {
          type: 'RATE_LIMIT' as const,
          message: rateLimitError.detail?.message || "You've reached your daily generation limit.",
          rateLimitData: {
            resetInSeconds: rateLimitError.detail?.resetInSeconds || 3600,
            isAuthenticated: !!user,
            rateLimitType: 'content_generation'
          }
        }
        
        showRateLimitModal(apiError)
        setIsGenerating(false)
        return
      }

      if (!rateLimitResponse.ok) {
        throw new Error('Rate limit validation failed')
      }

      // All checks passed - proceed with content generation
      await generateContentWithAI()

    } catch (error) {
      console.error('Rate limiting error:', error)
      setIsGenerating(false)
      toast({
        title: "Generation Failed",
        description: "Failed to validate rate limits. Please try again.",
        variant: "destructive"
      })
    }
  }, [options, user, showRateLimitModal, toast])

  const generateContentWithAI = useCallback(async () => {
    console.log('Starting content generation with AI...')
    
    // Create a comprehensive prompt for content generation
    const prompt = `Generate a cover letter for ${options.positionTitle} at ${options.companyName}.

Job Description: ${options.jobDescription}

Requirements:
- Tone: ${options.tone}
- Length: ${options.length}
- Use my complete profile data to personalize the content
- Highlight relevant skills and experience
- Make it specific to this role and company
${options.additionalInstructions ? `- Additional Instructions: ${options.additionalInstructions}` : ''}

Please generate the content now.`
    
    console.log('Generated prompt:', prompt)
    console.log('Options:', options)
    console.log('User:', user)
    
    try {
      // Submit to AI with custom data payload
      const response = await fetch('/api/ai-writer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
                          body: JSON.stringify({
                    messages: [
                      {
                        role: 'user',
                        content: prompt
                      }
                    ],
                    contentType: 'cover_letter',
                    jobType: 'email',
                    jobDescription: options.jobDescription,
                    companyName: options.companyName,
                    positionTitle: options.positionTitle,
                    tone: options.tone,
                    length: options.length,
                    additionalInstructions: options.additionalInstructions,
                    profileData: user
                  })
      })

      if (!response.ok) {
        throw new Error('Content generation failed')
      }

      // Handle streaming response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('No response stream available')
      }

      let fullContent = ''
      
      while (true) {
        const { done, value } = await reader.read()
        
        if (done) {
          break
        }

        const chunk = decoder.decode(value, { stream: true })
        
        // Parse AI SDK streaming format
        const lines = chunk.split('\n')
        
        for (const line of lines) {
          const trimmedLine = line.trim()
          
          if (trimmedLine && trimmedLine.startsWith('0:')) {
            // Extract and clean the text content
            let textContent = trimmedLine.substring(2)
            
            // Remove surrounding quotes
            if (textContent.startsWith('"') && textContent.endsWith('"')) {
              textContent = textContent.slice(1, -1)
            }
            
            // Handle escaped characters
            textContent = textContent.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\')
            
            // Always add content, even if it's just whitespace/newlines
            if (textContent.length > 0) {
              fullContent += textContent
              
              // Update streaming content immediately for real-time display
              setStreamingContent(fullContent)
              
              // Add a small delay to make the streaming visible
              await new Promise(resolve => setTimeout(resolve, 10))
            }
          } else if (trimmedLine.startsWith('e:') || trimmedLine.startsWith('d:')) {
            // These are completion/metadata lines - stream is finishing normally
            console.log('Stream completion detected:', trimmedLine)
          }
        }
      }
      
      // Set final content and stop generating
      setGeneratedContent(fullContent)
      setStreamingContent('')
      setIsGenerating(false)
      
      // Check if content was generated, but don't show success toast
      if (!fullContent || fullContent.trim().length === 0) {
        // If no content was generated, treat as error
        throw new Error('No content was generated')
      }
    } catch (error) {
      console.error('Content generation error:', error)
      setIsGenerating(false)
      setStreamingContent('')
      
      // Don't show error if we actually got content
      if (generatedContent && generatedContent.trim().length > 0) {
        console.log('Error occurred but content was generated successfully, ignoring error')
        return
      }
      
      toast({
        title: "Generation Failed",
        description: "Failed to generate content. Please try again.",
        variant: "destructive"
      })
    }
  }, [options, user, toast])

  const handleCopyToClipboard = useCallback(async () => {
    const content = streamingContent || generatedContent
    if (!content) return
    
    try {
      await navigator.clipboard.writeText(content)
      toast({
        title: "Copied to Clipboard",
        description: "Content has been copied to your clipboard.",
      })
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      toast({
        title: "Copy Failed",
        description: "Failed to copy content. Please try again.",
        variant: "destructive"
      })
    }
  }, [streamingContent, generatedContent, toast])

  const handleRegenerate = useCallback(() => {
    // Focus on additional instructions field with prominent effect
    if (additionalInstructionsRef.current) {
      additionalInstructionsRef.current.focus()
      additionalInstructionsRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      })
      
      // Add a subtle highlight effect
      additionalInstructionsRef.current.style.boxShadow = '0 0 0 3px rgba(16, 163, 127, 0.3)'
      setTimeout(() => {
        if (additionalInstructionsRef.current) {
          additionalInstructionsRef.current.style.boxShadow = ''
        }
      }, 2000)
    }
  }, [])

  const handleOptionChange = (key: keyof ContentGenerationOptions, value: any) => {
    setOptions(prev => ({
      ...prev,
      [key]: value
    }))
  }

  // Now we can have conditional returns after all hooks are called
  if (authLoading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-[#212121] text-white' : 'bg-gray-50 text-gray-900'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10a37f] mx-auto mb-4"></div>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Loading...</p>
        </div>
      </div>
    )
  }

  // Show benefits page for unauthenticated users
  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a]' : 'bg-gradient-to-br from-white via-gray-50 to-white'}`}>
        <Header variant="ai-writer" />
        
        {/* Hero Section with same background pattern as home page */}
        <div className={`relative ${isDark ? 'bg-gradient-to-b from-[#10a37f]/5 via-[#10a37f]/3 to-transparent' : 'bg-gradient-to-b from-[#10a37f]/3 via-[#10a37f]/2 to-transparent'}`}>
          <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
            <div className="text-center space-y-8">
              {/* Main Heading */}
              <div>
                <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 ${isDark ? 'bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent' : 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent'}`}>
                  AI-Powered <span className="bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] bg-clip-text text-transparent">
                    Cover Letters
                  </span>
                </h1>
                <p className={`text-xl sm:text-2xl leading-relaxed max-w-4xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Transform your professional profile into winning cover letters and proposals. 
                  Our AI analyzes your skills, experience, and projects to create personalized content that gets results.
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <Button
                  onClick={() => router.push('/auth?tab=signup')}
                  className="bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#0a7a5f] text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  🚀 Create Free Profile
                </Button>
                
                <Button
                  onClick={() => router.push('/auth?tab=signin')}
                  variant="outline"
                  className={`px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 ${
                    isDark 
                      ? 'border-[#565869] text-gray-300 hover:bg-[#10a37f]/10 hover:border-[#10a37f]/50' 
                      : 'border-gray-300 text-gray-700 hover:bg-[#10a37f]/10 hover:border-[#10a37f]/50'
                  }`}
                >
                  Already have an account? Sign In
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section with same styling as home page */}
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                number: "1",
                title: "Smart Cover Letters",
                description: "Generate personalized cover letters that highlight your relevant experience and skills for each specific job application with ATS optimization."
              },
              {
                number: "2", 
                title: "Winning Proposals",
                description: "Create compelling freelance proposals for Upwork, Fiverr, and other platforms using your complete portfolio data and project examples."
              },
              {
                number: "3",
                title: "Profile-Powered AI",
                description: "Unlike generic tools, our AI uses your complete professional profile to create truly personalized content that showcases your unique expertise."
              }
            ].map((feature, index) => (
              <div key={index} className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm">
                    {feature.number}
                  </div>
                  <div>
                    <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {feature.title}
                    </h3>
                    <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action Section with same styling as home page */}
          <div className="text-center space-y-8">
            <div>
              <h2 className={`text-4xl font-bold mb-6 ${isDark ? 'bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent' : 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent'}`}>
                Ready to Transform Your Applications?
              </h2>
              <p className={`text-xl leading-relaxed max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Join thousands of professionals who are landing more interviews and winning more projects with AI-powered content generation.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push('/auth?tab=signup')}
                className="bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#0a7a5f] text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                🚀 Create Free Profile
              </Button>
              
              <Button
                onClick={() => router.push('/auth?tab=signin')}
                variant="outline"
                className={`px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 ${
                  isDark 
                    ? 'border-[#565869] text-gray-300 hover:bg-[#10a37f]/10 hover:border-[#10a37f]/50' 
                    : 'border-gray-300 text-gray-700 hover:bg-[#10a37f]/10 hover:border-[#10a37f]/50'
                }`}
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render mobile component if on mobile device - AFTER all hooks are called
  if (isMobile) {
    return <AIWriterMobile />
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#212121] text-white' : 'bg-gray-50 text-gray-900'} overflow-x-hidden`}>
      <Header variant="ai-writer" />
      
      {/* Main Content - Full Height Split Layout */}
      <div className="h-[calc(100vh-56px)] sm:h-[calc(100vh-64px)] relative w-full">
        <ResizableSplitPane
          isVisible={true}
          defaultLeftWidth={50}
          minLeftWidth={30}
          maxLeftWidth={70}
        >
          {/* Left Side - Form and Options */}
          <div className={`${isDark ? 'bg-[#212121]' : 'bg-gray-50'} h-full overflow-hidden relative flex flex-col`}>
            {/* Header */}
            <div className="flex-shrink-0 p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-lg blur opacity-30"></div>
                    <div className={`relative p-2 rounded-lg ${isDark ? 'bg-[#2a2a2a]' : 'bg-white'} border border-[#10a37f]/30`}>
                      <FileEdit className="w-5 h-5 text-[#10a37f]" />
                    </div>
                  </div>
                  <div>
                    <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Cover Letter Generator
                    </h2>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Configure your cover letter options below
                    </p>
                  </div>
                </div>
                
                {/* Complete Profile Section */}
                {user && (
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Complete Profile
                      </div>
                      <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {calculateProfileCompletion(user).completedSections}/{calculateProfileCompletion(user).totalSections} sections
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">

              {/* Form Fields */}
              <div className="space-y-6">
                {/* Company Name */}
                <div>
                  <label className={`block text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center border border-blue-500/30">
                        <Building2 className="w-3 h-3 text-blue-500" />
                      </div>
                      Company Name
                    </div>
                  </label>
                  <input
                    type="text"
                    value={options.companyName}
                    onChange={(e) => setOptions(prev => ({ ...prev, companyName: e.target.value }))}
                    placeholder="e.g., Google, Microsoft, Apple"
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                      isDark 
                        ? 'bg-[#2a2a2a] border-[#565869] text-white placeholder-gray-400 focus:border-[#10a37f] focus:bg-[#2f2f2f]' 
                        : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-[#10a37f] focus:bg-gray-50'
                    } focus:ring-2 focus:ring-[#10a37f]/20 outline-none`}
                  />
                </div>

                {/* Position Title */}
                <div>
                  <label className={`block text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center border border-purple-500/30">
                        <User className="w-3 h-3 text-purple-500" />
                      </div>
                      Position Title
                    </div>
                  </label>
                  <input
                    type="text"
                    value={options.positionTitle}
                    onChange={(e) => setOptions(prev => ({ ...prev, positionTitle: e.target.value }))}
                    placeholder="e.g., Senior Software Engineer, Full Stack Developer"
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                      isDark 
                        ? 'bg-[#2a2a2a] border-[#565869] text-white placeholder-gray-400 focus:border-[#10a37f] focus:bg-[#2f2f2f]' 
                        : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-[#10a37f] focus:bg-gray-50'
                    } focus:ring-2 focus:ring-[#10a37f]/20 outline-none`}
                  />
                </div>

                {/* Job Description */}
                <div>
                  <label className={`block text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center border border-green-500/30">
                        <FileText className="w-3 h-3 text-green-500" />
                      </div>
                      Job Description
                    </div>
                  </label>
                  <textarea
                    value={options.jobDescription}
                    onChange={(e) => setOptions(prev => ({ ...prev, jobDescription: e.target.value }))}
                    placeholder="Paste the job description here to help generate a targeted cover letter..."
                    rows={6}
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                      isDark 
                        ? 'bg-[#2a2a2a] border-[#565869] text-white placeholder-gray-400 focus:border-[#10a37f] focus:bg-[#2f2f2f]' 
                        : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-[#10a37f] focus:bg-gray-50'
                    } focus:ring-2 focus:ring-[#10a37f]/20 outline-none resize-none`}
                  />
                </div>

                {/* Tone Selection */}
                <div>
                  <label className={`block text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center border border-orange-500/30">
                        <Palette className="w-3 h-3 text-orange-500" />
                      </div>
                      Tone
                    </div>
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'professional', label: 'Professional', icon: Briefcase, gradient: 'from-blue-500/20 to-blue-600/20', borderColor: 'border-blue-500/30', iconColor: 'text-blue-500' },
                      { value: 'enthusiastic', label: 'Enthusiastic', icon: Zap, gradient: 'from-yellow-500/20 to-orange-600/20', borderColor: 'border-yellow-500/30', iconColor: 'text-yellow-500' },
                      { value: 'conversational', label: 'Conversational', icon: MessageCircle, gradient: 'from-purple-500/20 to-purple-600/20', borderColor: 'border-purple-500/30', iconColor: 'text-purple-500' }
                    ].map((tone) => {
                      const IconComponent = tone.icon;
                      return (
                        <button
                          key={tone.value}
                          onClick={() => setOptions(prev => ({ ...prev, tone: tone.value }))}
                          className={`flex flex-col items-center gap-3 p-4 rounded-xl border transition-all duration-200 ${
                            options.tone === tone.value
                              ? 'border-[#10a37f] bg-[#10a37f]/10'
                              : `${isDark ? 'border-[#565869] bg-[#2a2a2a] hover:border-[#10a37f]/50' : 'border-gray-200 bg-white hover:border-[#10a37f]/50'}`
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${tone.gradient} flex items-center justify-center border ${tone.borderColor}`}>
                            <IconComponent className={`w-5 h-5 ${tone.iconColor}`} />
                          </div>
                          <span className={`text-sm font-medium ${
                            options.tone === tone.value 
                              ? 'text-[#10a37f]' 
                              : isDark ? 'text-white' : 'text-gray-900'
                          }`}>{tone.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Length Selection */}
                <div>
                  <label className={`block text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 flex items-center justify-center border border-indigo-500/30">
                        <BarChart3 className="w-3 h-3 text-indigo-500" />
                      </div>
                      Length
                    </div>
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'brief', label: 'Brief', icon: FileText, gradient: 'from-green-500/20 to-green-600/20', borderColor: 'border-green-500/30', iconColor: 'text-green-500' },
                      { value: 'standard', label: 'Standard', icon: File, gradient: 'from-gray-500/20 to-gray-600/20', borderColor: 'border-gray-500/30', iconColor: 'text-gray-500' },
                      { value: 'detailed', label: 'Detailed', icon: Clipboard, gradient: 'from-orange-500/20 to-orange-600/20', borderColor: 'border-orange-500/30', iconColor: 'text-orange-500' }
                    ].map((length) => {
                      const IconComponent = length.icon;
                      return (
                        <button
                          key={length.value}
                          onClick={() => setOptions(prev => ({ ...prev, length: length.value }))}
                          className={`flex flex-col items-center gap-3 p-4 rounded-xl border transition-all duration-200 ${
                            options.length === length.value
                              ? 'border-[#10a37f] bg-[#10a37f]/10'
                              : `${isDark ? 'border-[#565869] bg-[#2a2a2a] hover:border-[#10a37f]/50' : 'border-gray-200 bg-white hover:border-[#10a37f]/50'}`
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${length.gradient} flex items-center justify-center border ${length.borderColor}`}>
                            <IconComponent className={`w-5 h-5 ${length.iconColor}`} />
                          </div>
                          <span className={`text-sm font-medium ${
                            options.length === length.value 
                              ? 'text-[#10a37f]' 
                              : isDark ? 'text-white' : 'text-gray-900'
                          }`}>{length.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Additional Instructions */}
                <div>
                  <label className={`block text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-teal-500/20 to-teal-600/20 flex items-center justify-center border border-teal-500/30">
                        <Settings className="w-3 h-3 text-teal-500" />
                      </div>
                      Additional Instructions (Optional)
                    </div>
                  </label>
                  <textarea
                    ref={additionalInstructionsRef}
                    value={options.additionalInstructions}
                    onChange={(e) => setOptions(prev => ({ ...prev, additionalInstructions: e.target.value }))}
                    placeholder="Customize your cover letter: 'Focus on leadership experience', 'Include specific metrics', 'Make it more technical', 'Emphasize remote work skills', etc."
                    rows={3}
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                      isDark 
                        ? 'bg-[#2a2a2a] border-[#565869] text-white placeholder-gray-400 focus:border-[#10a37f] focus:bg-[#2f2f2f]' 
                        : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-[#10a37f] focus:bg-gray-50'
                    } focus:ring-2 focus:ring-[#10a37f]/20 outline-none resize-none`}
                  />
                </div>

                {/* Profile Score Validation */}
                {user && !canAccessAIWriter(user) && (
                  <ProfileScoreRestrictionMessage
                    user={user}
                    featureName="AI Writer"
                    variant="default"
                    isDark={isDark}
                    className="mb-6"
                  />
                )}

                {/* Generate Button */}
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !options.jobDescription.trim() || (user && !canAccessAIWriter(user))}
                  className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 ${
                    isGenerating || !options.jobDescription.trim() || (user && !canAccessAIWriter(user))
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#0a7a5f] text-white shadow-lg hover:shadow-xl hover:scale-105'
                  }`}
                >
                  {isGenerating ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Generating Cover Letter...
                    </div>
                  ) : (
                    'Generate Cover Letter'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Generated Content */}
          <div className={`${isDark ? 'bg-[#212121]' : 'bg-gray-50'} h-full overflow-hidden relative flex flex-col`}>
            {/* Header */}
            <div className="flex-shrink-0 p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-lg blur opacity-30"></div>
                    <div className={`relative p-2 rounded-lg ${isDark ? 'bg-[#2a2a2a]' : 'bg-white'} border border-[#10a37f]/30`}>
                      <FileEdit className="w-5 h-5 text-[#10a37f]" />
                    </div>
                  </div>
                  <div>
                    <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {generatedContent ? 'Cover Letter Generated' : 'Generated Content'}
                    </h2>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {generatedContent ? `${options.tone} tone • ${options.length} length` : 'Your personalized cover letter will appear here'}
                    </p>
                  </div>
                </div>
                
                {/* Copy Button - Only show when content is generated */}
                {!isGenerating && generatedContent && (
                  <button
                    onClick={handleCopyToClipboard}
                    className="p-2 rounded-lg bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#0a7a5f] text-white transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-6">
                {/* Show loading state with better UI/UX */}
                {isGenerating && !streamingContent && (
                  <div className="flex flex-col items-center justify-center h-64 space-y-6">
                    {/* Elegant loading animation */}
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
                      <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-[#10a37f] rounded-full animate-spin"></div>
                    </div>
                    
                    {/* Loading text with better typography */}
                    <div className="text-center space-y-2">
                      <p className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        AI is crafting your content...
                      </p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        This usually takes 10-30 seconds
                      </p>
                    </div>
                    
                    {/* Progress dots */}
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-[#10a37f] rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-[#10a37f] rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-2 h-2 bg-[#10a37f] rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                    </div>
                  </div>
                )}

                {/* Show streaming message if available */}
                {isGenerating && streamingContent && (
                  <div className={`${isDark ? 'text-white' : 'text-gray-900'}`}>
                    <CoverLetterDisplay content={streamingContent} isStreaming={true} onCopy={handleCopyToClipboard} />
                  </div>
                )}

                {/* Show final generated content */}
                {!isGenerating && generatedContent && (
                  <div className="space-y-6">
                    {/* Formatted Content */}
                    <div className={`${isDark ? 'text-white' : 'text-gray-900'}`}>
                      <CoverLetterDisplay content={generatedContent} isStreaming={false} onCopy={handleCopyToClipboard} />
                    </div>
                  
                    {/* Stats and Actions */}
                    <div className={`pt-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} space-y-4`}>
                      {/* Statistics Row */}
                      <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center border border-blue-500/30">
                            <Type className="w-3 h-3 text-blue-500" />
                          </div>
                          <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {generatedContent.split(' ').length || 0} words
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center border border-green-500/30">
                            <FileText className="w-3 h-3 text-green-500" />
                          </div>
                          <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {generatedContent.length || 0} characters
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center border border-purple-500/30">
                            <Clock className="w-3 h-3 text-purple-500" />
                          </div>
                          <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            ~{Math.ceil((generatedContent.split(' ').length || 0) / 200)} min read
                          </span>
                        </div>
                      </div>

                      {/* Regeneration Tip */}
                      <div className={`p-3 rounded-lg ${isDark ? 'bg-[#10a37f]/5' : 'bg-[#10a37f]/5'} border-l-4 border-[#10a37f]`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[#10a37f] text-sm">💡</span>
                          <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Want to improve this cover letter? Add specific instructions below and regenerate!
                          </p>
                        </div>
                        <button
                          onClick={handleRegenerate}
                          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-[#10a37f] bg-[#10a37f]/10 hover:bg-[#10a37f]/20 rounded-lg transition-all duration-200"
                        >
                          <span>🔄</span>
                          Add Instructions & Regenerate
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Show guide/benefits when no content */}
                {!isGenerating && !generatedContent && (
                  <div className="space-y-6">
                    {/* Welcome Section */}
                    <div className="text-center space-y-4 py-8">
                      <div className="text-6xl mb-4">🚀</div>
                      <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Ready to Create Amazing Cover Letters
                      </h3>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-md mx-auto`}>
                        Our AI uses your complete profile to generate personalized, compelling cover letters that get results.
                      </p>
                    </div>

                    {/* Benefits Grid */}
                    <div className="grid grid-cols-1 gap-4">
                      {[
                        {
                          icon: <Zap className="w-5 h-5" />,
                          title: "Profile-Powered",
                          description: "Uses your skills, experience, and projects for personalized content"
                        },
                        {
                          icon: <BarChart3 className="w-5 h-5" />,
                          title: "ATS Optimized",
                          description: "Formatted for applicant tracking systems and hiring managers"
                        },
                        {
                          icon: <MessageCircle className="w-5 h-5" />,
                          title: "Multiple Tones",
                          description: "Professional, enthusiastic, or conversational - you choose"
                        },
                        {
                          icon: <Users className="w-5 h-5" />,
                          title: "Company-Focused",
                          description: "Tailored to specific job descriptions and company needs"
                        }
                      ].map((benefit, index) => (
                        <div key={index} className={`p-4 rounded-xl border ${isDark ? 'bg-[#2a2a2a]/50 border-[#565869]' : 'bg-gray-50 border-gray-200'} transition-all duration-200 hover:border-[#10a37f]/50`}>
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#10a37f]/20 to-[#0d8f6f]/20 flex items-center justify-center border border-[#10a37f]/30">
                                <div className="text-[#10a37f]">
                                  {benefit.icon}
                                </div>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
                                {benefit.title}
                              </h4>
                              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
                                {benefit.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Quick Tips */}
                    <div className={`p-4 rounded-xl border-l-4 border-[#10a37f] ${isDark ? 'bg-[#10a37f]/5' : 'bg-[#10a37f]/5'}`}>
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-5 h-5 rounded-full bg-[#10a37f]/20 flex items-center justify-center">
                            <span className="text-[#10a37f] text-xs">💡</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                            Pro Tips for Better Results
                          </h4>
                          <ul className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} space-y-1`}>
                            <li>• Paste the complete job description for better matching</li>
                            <li>• Use additional instructions to focus on specific skills</li>
                            <li>• Try different tones to match company culture</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

          </div>
        </ResizableSplitPane>
      </div>
      
      {/* Rate Limit Modal */}
      <RateLimitModal
        isOpen={rateLimitState.isOpen}
        onClose={hideRateLimitModal}
        message={rateLimitState.message}
        resetInSeconds={rateLimitState.resetInSeconds}
        isAuthenticated={rateLimitState.isAuthenticated}
        rateLimitType={rateLimitState.rateLimitType}
      />
    </div>
  )
}

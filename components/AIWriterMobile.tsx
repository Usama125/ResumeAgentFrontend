"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { useTheme } from "@/context/ThemeContext"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { User as UserType } from "@/types"
import { useRateLimit } from "@/hooks/useRateLimit"
import { RateLimitModal } from "@/components/RateLimitModal"
import { Building2, User, FileText, Briefcase, Sparkles, Settings, Palette, BarChart3, Mail, FileEdit, Users, Zap, MessageCircle, Plus, AlertCircle, CheckCircle, Copy, Send, Clock, Type, BookOpen, RotateCcw, Download, File, Clipboard, ArrowLeft, ChevronLeft } from "lucide-react"
import ThemeToggle from "@/components/ThemeToggle"
import UserDropdown from "@/components/UserDropdown"
import { calculateProfileCompletion } from "@/utils/profileCompletion"
import { canAccessAIWriter } from "@/utils/profileScoreValidation"
import ProfileScoreRestrictionMessage from "@/components/ProfileScoreRestrictionMessage"
import { profileUpdateManager } from '@/lib/profile-update-manager'

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

// Profile Completion Component for Mobile
function ProfileCompletionSection({ user, router, isDark }: { user: UserType, router: any, isDark: boolean }) {
  const completionData = calculateProfileCompletion(user)

  // Check if work preferences is completed
  const hasWorkPreferences = user.work_preferences && (
    user.work_preferences.preferred_work_mode?.length > 0 ||
    user.work_preferences.preferred_employment_type?.length > 0 ||
    user.work_preferences.preferred_location ||
    user.work_preferences.notice_period ||
    user.work_preferences.availability ||
    user.current_salary ||
    user.expected_salary
  )

  // Check if about section is completed
  const hasAbout = user.summary && user.summary.trim()

  // Check if about section is already in the empty sections from main calculation
  const aboutAlreadyInEmpty = completionData.emptySections.some(section => section.id === 'about')

  // Add work preferences to empty sections if not completed
  const allEmptySections = [...completionData.emptySections]
  if (!hasWorkPreferences) {
    allEmptySections.push({
      id: 'preferences',
      title: 'Work Preferences',
      field: 'work_preferences'
    })
  }

  // Add about section to empty sections if not completed and not already in the list
  if (!hasAbout && !aboutAlreadyInEmpty) {
    allEmptySections.push({
      id: 'about',
      title: 'About Me',
      field: 'summary'
    })
  }

  // Calculate adjusted percentage including work preferences and about
  const missingWorkPreferences = hasWorkPreferences ? 0 : 1
  const missingAbout = hasAbout ? 0 : (aboutAlreadyInEmpty ? 0 : 1)
  const missingSections = missingWorkPreferences + missingAbout
  const adjustedTotalSections = completionData.totalSections + missingSections
  const adjustedCompletedSections = completionData.completedSections
  const adjustedPercentage = Math.round((adjustedCompletedSections / adjustedTotalSections) * 100)

  // If no empty sections, show a completion message
  if (allEmptySections.length === 0) {
    return (
      <div className={`relative overflow-hidden rounded-2xl border ${
        isDark 
          ? 'bg-[#2a2a2a]/80 border-[#10a37f]/60' 
          : 'bg-white/80 border-[#10a37f]/40'
      } shadow-lg backdrop-blur-sm`}>
        
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#10a37f]/5 via-transparent to-[#10a37f]/10"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#10a37f]/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#0d8f6f]/5 rounded-full blur-lg"></div>
        
        {/* Content */}
        <div className="relative z-10 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-[#10a37f] flex-shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Profile Complete!
            </h3>
          </div>
          
          <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Your profile is complete and ready to create amazing content.
          </p>
          
          <Button
            onClick={() => router.push('/profile')}
            className="w-full bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#0a7a5f] text-white py-2.5 rounded-xl transition-all duration-300"
          >
            View Your Profile
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl border ${
      isDark 
        ? 'bg-[#2a2a2a]/80 border-[#565869]/60' 
        : 'bg-white/80 border-gray-200'
    } shadow-lg backdrop-blur-sm`}>
      
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#10a37f]/5 via-transparent to-[#10a37f]/10"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#10a37f]/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#0d8f6f]/5 rounded-full blur-lg"></div>
      
      {/* Content */}
      <div className="relative z-10 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="text-[#10a37f] flex-shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Complete Your Profile
          </h3>
        </div>
        
        <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Add missing sections to create more personalized content.
        </p>
        
        
        <Button
          onClick={() => router.push('/profile')}
          className="w-full bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#0a7a5f] text-white py-2.5 rounded-xl transition-all duration-300"
        >
          Complete Profile
        </Button>
      </div>
    </div>
  )
}

export default function AIWriterMobile() {
  // EXACTLY IDENTICAL TO DESKTOP VERSION - ALL HOOKS CALLED FIRST
  const { user, isAuthenticated, loading: authLoading, refreshUser } = useAuth()
  const { isDark } = useTheme()
  const router = useRouter()
  const { toast } = useToast()
  const { showRateLimitModal, hideRateLimitModal, rateLimitState } = useRateLimit()

  // Listen for profile updates to ensure AI Writer always has fresh data
  useEffect(() => {
    const unsubscribe = profileUpdateManager.registerUpdateCallback((updatedUser) => {
      if (updatedUser && updatedUser.id === user?.id) {
        // Force refresh user data in AuthContext to ensure AI Writer gets updated profile
        refreshUser();
      }
    });

    return unsubscribe;
  }, [user?.id, refreshUser]);

  // State for content generation options - IDENTICAL TO DESKTOP
  const [options, setOptions] = useState<ContentGenerationOptions>({
    jobDescription: '',
    companyName: '',
    positionTitle: '',
    tone: 'professional',
    length: 'brief',
    additionalInstructions: ''
  })

  // State for generation process - IDENTICAL TO DESKTOP
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState('')
  const [streamingContent, setStreamingContent] = useState('')
  const [showForm, setShowForm] = useState(true) // Mobile-specific state for form/content toggle
  
  // Ref for additional instructions field - IDENTICAL TO DESKTOP
  const additionalInstructionsRef = useRef<HTMLTextAreaElement>(null)

  // Define generateContentWithAI first since it's used in handleGenerate - IDENTICAL TO DESKTOP
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
      setShowForm(true) // Mobile-specific: return to form on error
      
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

  // IDENTICAL TO DESKTOP VERSION
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
    setShowForm(false) // Mobile-specific: hide form when generating
    
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
            remaining: rateLimitError.detail?.remaining || 0,
            isAuthenticated: !!user,
            rateLimitType: 'unknown'
          }
        }
        
        showRateLimitModal(apiError)
        setIsGenerating(false)
        setShowForm(true) // Mobile-specific: return to form on rate limit
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
      setShowForm(true) // Mobile-specific: return to form on error
      toast({
        title: "Generation Failed",
        description: "Failed to validate rate limits. Please try again.",
        variant: "destructive"
      })
    }
  }, [options, user, showRateLimitModal, toast, generateContentWithAI])

  // IDENTICAL TO DESKTOP VERSION
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

  // Mobile-specific function for back to form
  const handleBackToForm = useCallback(() => {
    setShowForm(true)
    // Focus on additional instructions field with prominent effect
    setTimeout(() => {
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
    }, 100)
  }, [])

  // IDENTICAL TO DESKTOP VERSION
  const handleOptionChange = (key: keyof ContentGenerationOptions, value: any) => {
    setOptions(prev => ({
      ...prev,
      [key]: value
    }))
  }

  // MOBILE-SPECIFIC UI RENDERING - NO CONDITIONAL RETURNS FOR AUTH
  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#212121] text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-50 ${isDark ? 'bg-[#212121]/95' : 'bg-gray-50/95'} backdrop-blur-sm border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center p-4">
          {/* Left side - Back button or empty space */}
          <div className="flex-shrink-0">
            {!showForm && (
              <button
                onClick={handleBackToForm}
                className="flex items-center gap-2 text-[#10a37f] hover:text-[#0d8f6f] transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </button>
            )}
          </div>
          
          {/* Center - Title and subtitle (always left-aligned) */}
          <div className="flex items-center gap-3 flex-1 ml-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-lg blur opacity-30"></div>
              <div className={`relative p-2 rounded-lg ${isDark ? 'bg-[#2a2a2a]' : 'bg-white'} border border-[#10a37f]/30`}>
                <Sparkles className="w-5 h-5 text-[#10a37f]" />
              </div>
            </div>
            <div>
              <h1 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                AI Writer
              </h1>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {showForm ? 'Create personalized cover letters' : 'Generated content'}
              </p>
            </div>
          </div>

          {/* Right side - Copy button, Theme toggle, and User dropdown */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {!showForm && generatedContent && (
              <button
                onClick={handleCopyToClipboard}
                className="p-2 rounded-lg bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#0a7a5f] text-white transition-all duration-200"
              >
                <Copy className="w-4 h-4" />
              </button>
            )}
            
            {/* Theme toggle */}
            <ThemeToggle />
            
            {/* User dropdown */}
            <UserDropdown />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        {showForm ? (
          // Form View
          <div className="space-y-6">
            {/* Profile Completion Section */}
            {user && (
              <div className="mb-6">
                <ProfileCompletionSection user={user} router={router} isDark={isDark} />
              </div>
            )}

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
                  placeholder="e.g., Senior Software Engineer"
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
                  placeholder="Paste the job description here..."
                  rows={4}
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
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'professional', label: 'Professional', icon: Briefcase, gradient: 'from-blue-500/20 to-blue-600/20', borderColor: 'border-blue-500/30', iconColor: 'text-blue-500' },
                    { value: 'enthusiastic', label: 'Enthusiastic', icon: Zap, gradient: 'from-yellow-500/20 to-orange-600/20', borderColor: 'border-yellow-500/30', iconColor: 'text-yellow-500' },
                    { value: 'conversational', label: 'Conversational', icon: MessageCircle, gradient: 'from-purple-500/20 to-purple-600/20', borderColor: 'border-purple-500/30', iconColor: 'text-purple-500' }
                  ].map((tone) => {
                    const IconComponent = tone.icon;
                    return (
                      <button
                        key={tone.value}
                        onClick={() => setOptions(prev => ({ ...prev, tone: tone.value as Tone }))}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200 ${
                          options.tone === tone.value
                            ? 'border-[#10a37f] bg-[#10a37f]/10'
                            : `${isDark ? 'border-[#565869] bg-[#2a2a2a] hover:border-[#10a37f]/50' : 'border-gray-200 bg-white hover:border-[#10a37f]/50'}`
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${tone.gradient} flex items-center justify-center border ${tone.borderColor}`}>
                          <IconComponent className={`w-4 h-4 ${tone.iconColor}`} />
                        </div>
                        <span className={`text-xs font-medium ${
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
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'brief', label: 'Brief', icon: FileText, gradient: 'from-green-500/20 to-green-600/20', borderColor: 'border-green-500/30', iconColor: 'text-green-500' },
                    { value: 'standard', label: 'Standard', icon: File, gradient: 'from-gray-500/20 to-gray-600/20', borderColor: 'border-gray-500/30', iconColor: 'text-gray-500' },
                    { value: 'detailed', label: 'Detailed', icon: Clipboard, gradient: 'from-orange-500/20 to-orange-600/20', borderColor: 'border-orange-500/30', iconColor: 'text-orange-500' }
                  ].map((length) => {
                    const IconComponent = length.icon;
                    return (
                      <button
                        key={length.value}
                        onClick={() => setOptions(prev => ({ ...prev, length: length.value as Length }))}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200 ${
                          options.length === length.value
                            ? 'border-[#10a37f] bg-[#10a37f]/10'
                            : `${isDark ? 'border-[#565869] bg-[#2a2a2a] hover:border-[#10a37f]/50' : 'border-gray-200 bg-white hover:border-[#10a37f]/50'}`
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${length.gradient} flex items-center justify-center border ${length.borderColor}`}>
                          <IconComponent className={`w-4 h-4 ${length.iconColor}`} />
                        </div>
                        <span className={`text-xs font-medium ${
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
                  placeholder="Customize your cover letter: 'Focus on leadership experience', 'Include specific metrics', etc."
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
                  variant="compact"
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
                    : 'bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#0a7a5f] text-white shadow-lg hover:shadow-xl'
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
        ) : (
          // Content View
          <div className="space-y-6">
            {/* Show loading state */}
            {isGenerating && !streamingContent && (
              <div className="flex flex-col items-center justify-center h-64 space-y-6">
                {/* Elegant loading animation */}
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-[#10a37f] rounded-full animate-spin"></div>
                </div>
                
                {/* Loading text */}
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
                  <div className="flex flex-wrap items-center gap-4">
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
                  </div>

                  {/* Regeneration Tip */}
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-[#10a37f]/5' : 'bg-[#10a37f]/5'} border-l-4 border-[#10a37f]`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[#10a37f] text-sm">💡</span>
                      <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Want to improve this cover letter?
                      </p>
                    </div>
                    <button
                      onClick={handleBackToForm}
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-[#10a37f] bg-[#10a37f]/10 hover:bg-[#10a37f]/20 rounded-lg transition-all duration-200"
                    >
                      <span>🔄</span>
                      Add Instructions & Regenerate
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
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

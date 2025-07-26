"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Upload,
  FileText,
  User,
  Briefcase,
  Camera,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Clock,
  DollarSign,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import OnboardingService from "@/services/onboarding"
import { useErrorHandler } from "@/utils/errorHandler"
import { useTheme } from "@/context/ThemeContext"
import ThemeToggle from "@/components/ThemeToggle"
import { getThemeClasses } from "@/utils/theme"
import OnboardingDesktop from "@/components/OnboardingDesktop"
import OnboardingMobile from "@/components/OnboardingMobile"
import ClientOnly from "@/components/ClientOnly"
import { 
  OnboardingFormData, 
  PDFUploadResponse, 
  OnboardingProgress,
  StepCompletionResponse,
  WORK_MODES, 
  EMPLOYMENT_TYPES, 
  AVAILABILITY_OPTIONS 
} from "@/types"

const steps = [
  { id: 1, title: "Upload LinkedIn PDF", icon: FileText },
  { id: 2, title: "Profile & Preferences", icon: User },
  { id: 3, title: "Work Preferences", icon: Briefcase },
  { id: 4, title: "Salary & Availability", icon: DollarSign },
]

// Use constants from types file
const workModes = WORK_MODES
const employmentTypes = EMPLOYMENT_TYPES

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<OnboardingFormData>({
    // Step 1: PDF Upload
    linkedinPdf: null,

    // Step 2: Profile Info (using backend field names)
    profile_picture: null,
    additional_info: "",
    is_looking_for_job: true,
    current_employment_mode: [],

    // Step 3: Work Preferences (using backend field names)
    preferred_work_mode: [],
    preferred_employment_type: [],
    preferred_location: "",

    // Step 4: Salary & Availability (using backend field names)
    current_salary: "",
    expected_salary: "",
    notice_period: "",
    availability: "immediate",
  })

  const [loading, setLoading] = useState(false)
  const [stepLoading, setStepLoading] = useState<Record<number, boolean>>({})
  const [error, setError] = useState<any>(null)
  const [pdfData, setPdfData] = useState<PDFUploadResponse | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [onboardingProgress, setOnboardingProgress] = useState<OnboardingProgress | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [authTimeout, setAuthTimeout] = useState(false)
  const [showSkipButton, setShowSkipButton] = useState(false)
  const [isMobile, setIsMobile] = useState<boolean | null>(null) // null initially to prevent hydration mismatch
  const [isClient, setIsClient] = useState(false)

  const router = useRouter()
  const { user, isAuthenticated, updateUser, refreshUser, loading: authLoading } = useAuth()
  const { formatError } = useErrorHandler()
  const { isDark } = useTheme()
  const theme = getThemeClasses(isDark)

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Check if mobile device - only run on client
  useEffect(() => {
    if (!isClient) return
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [isClient])

  // Add timeout for auth loading to prevent indefinite waiting
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (authLoading) {
        console.log('⏰ ONBOARDING PAGE - Auth loading timeout, proceeding with available data');
        setAuthTimeout(true);
      }
    }, 8000); // 8 second timeout

    return () => clearTimeout(timeout);
  }, [authLoading])

  // Handle authentication and onboarding status
  useEffect(() => {
    console.log('🔍 ONBOARDING PAGE - useEffect triggered', {
      authLoading,
      isCompleting,
      isInitializing,
      loading,
      isAuthenticated,
      userExists: !!user,
      onboarding_completed: user?.onboarding_completed,
      progress_completed: user?.onboarding_progress?.completed,
      userId: user?.id
    });
    
    // Don't redirect if we're in the middle of completing onboarding
    if (isCompleting) {
      console.log('🔍 ONBOARDING PAGE - Skipping redirect, completion in progress');
      return;
    }
    
    // Wait for auth loading to complete before making redirect decisions
    // But proceed if we hit the timeout
    if (authLoading && !authTimeout) {
      console.log('🔍 ONBOARDING PAGE - Auth still loading, waiting...');
      return;
    }
    
    // Wait for both auth context loading and onboarding initialization to complete
    if (!isInitializing && !loading) {
      if (!isAuthenticated) {
        console.log('🚨 ONBOARDING PAGE - User not authenticated, redirecting to auth page');
        router.push("/auth")
        return
      }
      
      // Check if user completed onboarding (either top-level field or progress.completed)
      const isOnboardingCompleted = user?.onboarding_completed || user?.onboarding_progress?.completed;
      
      if (isOnboardingCompleted) {
        console.log('🔍 ONBOARDING PAGE - User already completed onboarding, redirecting to profile');
        // Use router.replace instead of window.location to avoid hard navigation
        router.replace("/profile");
        return
      }
      
      console.log('🔍 ONBOARDING PAGE - User needs to complete onboarding, staying on page');
    } else {
      console.log('🔍 ONBOARDING PAGE - Still initializing or loading, waiting...');
    }
  }, [authLoading, authTimeout, isAuthenticated, user?.onboarding_completed, user?.onboarding_progress?.completed, router, isInitializing, loading, isCompleting])

  // Load onboarding progress and set current step
  useEffect(() => {
    const loadOnboardingProgress = async () => {
      // Don't load if we're completing onboarding or already loaded
      if (!isAuthenticated || !user || loading || isCompleting || onboardingProgress) return;

      try {
        const progress = await OnboardingService.getOnboardingStatus();
        setOnboardingProgress(progress);
        
        // Set current step based on backend progress
        setCurrentStep(progress.current_step);
        
        // If user completed onboarding but frontend doesn't know, refresh user
        if (progress.completed && !user.onboarding_completed) {
          await refreshUser();
        }
      } catch (err: any) {
        console.error('Failed to load onboarding progress:', err);
        setError(err);
      } finally {
        setIsInitializing(false);
      }
    };

    // Initialize the loading state when auth context is loading
    if (loading) {
      setIsInitializing(true);
    } else if (isAuthenticated && user && !onboardingProgress) {
      loadOnboardingProgress();
    } else {
      // Not authenticated, stop initializing
      setIsInitializing(false);
    }
  }, [isAuthenticated, user?.id, loading, isCompleting]); // Only depend on user.id, not the whole user object

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: "pdf" | "image") => {
    const file = event.target.files?.[0]
    if (!file) return

    console.log('File upload triggered:', { type, fileName: file.name, fileType: file.type, fileSize: file.size });

    if (type === "pdf" && file.type === "application/pdf") {
      // Validate PDF size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setError({ message: "PDF file must be smaller than 10MB" })
        return
      }

      setFormData((prev) => ({ ...prev, linkedinPdf: file }))
      setError(null) // Clear any previous errors
      setValidationErrors({}) // Clear validation errors
      console.log('PDF file set successfully');
    } else if (type === "image" && file.type.startsWith("image/")) {
      // Validate image size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError({ message: "Image file must be smaller than 5MB" })
        return
      }
      
      setFormData((prev) => ({ ...prev, profile_picture: file }))
      setError(null) // Clear any previous errors
      setValidationErrors({}) // Clear validation errors
      console.log('Profile picture set successfully:', file.name);
    } else {
      console.error('Invalid file type:', { type, fileType: file.type });
      setError({ 
        message: type === "pdf" 
          ? "Please upload a valid PDF file" 
          : "Please upload a valid image file (JPG, PNG, GIF)" 
      })
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type === "application/pdf") {
        // Create a synthetic event to reuse the existing handleFileUpload logic
        const syntheticEvent = {
          target: { files: [file] }
        } as unknown as React.ChangeEvent<HTMLInputElement>
        handleFileUpload(syntheticEvent, "pdf")
      } else {
        setError({ message: "Please upload a valid PDF file" })
      }
    }
  }

  const handleArrayToggle = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => {
      const currentArray = prev[field] as string[]
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value]

      return { ...prev, [field]: newArray }
    })
  }

  const validateCurrentStep = (): boolean => {
    const errors: Record<string, string> = {}

    switch (currentStep) {
      case 1:
        if (!formData.linkedinPdf) {
          errors.pdf = "Please upload your LinkedIn PDF"
        }
        break
      case 2:
        // All fields in step 2 are optional
        break
      case 3:
        // All fields in step 3 are optional
        break
      case 4:
        // All fields in step 4 are optional
        break
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Check if step is accessible based on progress
  const isStepAccessible = (step: number): boolean => {
    if (!onboardingProgress) return step === 1
    return OnboardingService.isStepAccessible(step, onboardingProgress)
  }

  // Check if step is completed
  const isStepCompleted = (step: number): boolean => {
    if (!onboardingProgress) return false
    return OnboardingService.isStepCompleted(step, onboardingProgress)
  }

  const handleNext = async () => {
    if (!validateCurrentStep()) {
      return
    }

    // Handle step-specific completion
    try {
      setStepLoading(prev => ({ ...prev, [currentStep]: true }))
      setError(null)

      let response: StepCompletionResponse | null = null

      switch (currentStep) {
        case 1:
          if (!formData.linkedinPdf) {
            setError({ message: "Please upload your LinkedIn PDF first" })
            return
          }
          console.log("Uploading PDF:", {
            fileName: formData.linkedinPdf.name,
            fileSize: formData.linkedinPdf.size,
            fileType: formData.linkedinPdf.type
          })
          response = await OnboardingService.completeStep1(formData.linkedinPdf)
          break

        case 2:
          response = await OnboardingService.completeStep2({
            profile_picture: formData.profile_picture || undefined,
            additional_info: formData.additional_info,
            is_looking_for_job: formData.is_looking_for_job,
          })
          break

        case 3:
          response = await OnboardingService.completeStep3({
            current_employment_mode: formData.current_employment_mode,
            preferred_work_mode: formData.preferred_work_mode,
            preferred_employment_type: formData.preferred_employment_type,
            preferred_location: formData.preferred_location,
          })
          break

        case 4:
          // This is handled by handleSubmit
          return
      }

      // Update progress and advance to next step
      if (response && response.success) {
        // After PDF upload, enable skip functionality but continue normal flow
        if (currentStep === 1 && response.success) {
          console.log('PDF uploaded successfully, enabling skip functionality');
          setShowSkipButton(true); // Enable skip button for subsequent steps
        }
        
        // If onboarding is completed (final step), redirect to profile
        if (response.onboarding_completed) {
          console.log('Onboarding completed, redirecting to profile');
          await refreshUser();
          router.replace("/profile");
          return;
        }
        
        // Update local progress state manually to avoid API calls
        if (onboardingProgress) {
          const updatedProgress = { ...onboardingProgress };
          updatedProgress.current_step = response.next_step || currentStep + 1;
          
          // Mark current step as completed
          switch (currentStep) {
            case 1:
              updatedProgress.step_1_pdf_upload = 'completed';
              break;
            case 2:
              updatedProgress.step_2_profile_info = 'completed';
              break;
            case 3:
              updatedProgress.step_3_work_preferences = 'completed';
              break;
            case 4:
              updatedProgress.step_4_salary_availability = 'completed';
              updatedProgress.completed = true;
              break;
          }
          
          setOnboardingProgress(updatedProgress);
        }
        
        // Move to next step
        setCurrentStep(response.next_step || currentStep + 1);
      } else {
        setCurrentStep(currentStep + 1)
      }

      setError(null)
      setValidationErrors({})
    } catch (err: any) {
      console.error(`Step ${currentStep} completion error:`, err)
      
      // Handle API validation errors
      if (err.errors && Array.isArray(err.errors)) {
        const apiErrors: Record<string, string> = {}
        err.errors.forEach((error: any) => {
          if (error.loc && error.msg) {
            const field = error.loc[error.loc.length - 1] // Get the last part of the location
            apiErrors[field] = error.msg
          }
        })
        setValidationErrors(apiErrors)
        setError({ message: "Please check the form for errors" })
      } else {
        setError(err)
      }
    } finally {
      setStepLoading(prev => ({ ...prev, [currentStep]: false }))
    }
  }

  const handlePrevious = async () => {
    // Allow going back to any accessible step
    if (currentStep > 1) {
      const previousStep = currentStep - 1
      if (isStepAccessible(previousStep)) {
        try {
          // Update backend progress to allow going back
          await OnboardingService.resumeFromStep(previousStep)
          
          // Update local progress state
          if (onboardingProgress) {
            const updatedProgress = { ...onboardingProgress }
            updatedProgress.current_step = previousStep
            setOnboardingProgress(updatedProgress)
          }
          
          setCurrentStep(previousStep)
          setError(null)
          setValidationErrors({})
        } catch (err: any) {
          console.error('Error going to previous step:', err)
          // Still allow frontend navigation even if backend update fails
          setCurrentStep(previousStep)
          setError(null)
          setValidationErrors({})
        }
      }
    }
  }

  const handleCancel = () => {
    setShowCancelDialog(true)
  }

  const confirmCancel = () => {
    router.push("/")
  }

  const handleSkip = async () => {
    try {
      setLoading(true)
      const response = await OnboardingService.skipToProfile()
      
      if (response.success) {
        console.log('Skipped to profile successfully')
        
        // Get fresh user data to ensure we have the latest information
        await refreshUser()
        const { UserService } = await import('@/services/user');
        const freshUserData = await UserService.getCurrentUser();
        
        // Update user context with fresh data
        updateUser({ 
          ...freshUserData,
          onboarding_completed: true
        });
        
        router.replace("/profile")
      }
    } catch (err: any) {
      console.error('Error skipping to profile:', err)
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const handleContinueToProfile = async () => {
    // If we're on the last step, complete it properly with user data
    if (currentStep === steps.length) {
      await handleSubmit()
    } else {
      // For other steps, use skip functionality
      await handleSkip()
    }
  }

  const handleSubmit = async () => {
    if (!validateCurrentStep()) {
      return
    }

    try {
      setIsCompleting(true); // Prevent useEffect interference
      setStepLoading(prev => ({ ...prev, [4]: true }))
      setError(null)

      console.log('Starting final step completion...');

      // Complete final step
      const response = await OnboardingService.completeStep4({
        current_salary: formData.current_salary,
        expected_salary: formData.expected_salary,
        notice_period: formData.notice_period,
        availability: formData.availability,
      })

      console.log('Step 4 response:', response);
      console.log('Response has onboarding_completed?', 'onboarding_completed' in response);
      console.log('response.onboarding_completed value:', response.onboarding_completed);
      console.log('User before context update:', user);

      if (response.success) {
        console.log('Final step completed successfully, preparing for profile page...');
        
        // Show success message immediately
        setShowSuccess(true);
        
        try {
          // 1. First refresh user data from backend to get the latest completed onboarding info
          console.log('Refreshing user data from backend...');
          await refreshUser();
          
          // 2. Get the fresh user data to ensure we have the latest information
          console.log('Getting fresh user data...');
          const { UserService } = await import('@/services/user');
          const freshUserData = await UserService.getCurrentUser();
          console.log('Fresh user data obtained:', freshUserData);
          
          // 3. Update user context with the fresh data and completion status
          updateUser({ 
            ...freshUserData,
            onboarding_completed: true,
            onboarding_progress: {
              step_1_pdf_upload: 'completed',
              step_2_profile_info: 'completed',
              step_3_work_preferences: 'completed',
              step_4_salary_availability: 'completed',
              current_step: 4,
              completed: true
            }
          });
          console.log('User context updated with fresh data and completion status');
          
          // 4. Small delay to show success message, then navigate
          setTimeout(() => {
            console.log('Navigating to profile page with fresh data...');
            // Clear all loading states before navigation
            setIsCompleting(false);
            setLoading(false);
            
            // Use replace to avoid back button going to onboarding
            router.replace("/profile");
          }, 1500);
          
        } catch (prefetchError) {
          console.error('Error during profile prefetch:', prefetchError);
          // Even if prefetch fails, still navigate after updating context
          setTimeout(() => {
            console.log('Navigating to profile page (prefetch failed but continuing)...');
            setIsCompleting(false);
            setLoading(false);
            router.replace("/profile");
          }, 1500);
        }
        
        return; // Exit early to prevent further execution
      }
    } catch (err: any) {
      console.error("Final step completion error:", err)
      
      // Handle API validation errors
      if (err.errors && Array.isArray(err.errors)) {
        const apiErrors: Record<string, string> = {}
        err.errors.forEach((error: any) => {
          if (error.loc && error.msg) {
            const field = error.loc[error.loc.length - 1] // Get the last part of the location
            apiErrors[field] = error.msg
          }
        })
        setValidationErrors(apiErrors)
        setError({ message: "Please check the form for errors" })
      } else {
        setError(err)
      }
    } finally {
      setStepLoading(prev => ({ ...prev, [4]: false }))
      // Reset completing flag only if there was an error
      if (error) {
        setIsCompleting(false);
      }
    }
  }

  const currentStepData = steps[currentStep - 1]

  // CSS-based theme-aware loading screen that works immediately
  // Only show loading if auth is loading AND we haven't hit the timeout
  if (isInitializing || (authLoading && !authTimeout)) {
    return (
      <div className="loading-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-[#10a37f]/30 border-t-[#10a37f] rounded-full animate-spin"></div>
          <p className="loading-text">
            {(authLoading && !authTimeout) ? "Loading..." : "Loading your onboarding progress..."}
          </p>
        </div>
      </div>
    )
  }

  // Show loading if user completed onboarding (during redirect)
  if (user?.onboarding_completed && !isCompleting) {
    return (
      <div className={`min-h-screen ${theme.bg.primary} ${theme.text.primary} flex items-center justify-center`}>
        <div className="text-center">
          <div className={`w-16 h-16 ${theme.skeleton.primary} rounded-full animate-pulse mx-auto mb-4`}></div>
          <p className={theme.text.secondary}>Onboarding completed! Redirecting to your profile...</p>
        </div>
      </div>
    )
  }

  // Show completion loading state
  if (isCompleting || showSuccess) {
    return (
      <div className={`min-h-screen ${theme.bg.primary} ${theme.text.primary} flex items-center justify-center`}>
        <div className="text-center">
          {showSuccess ? (
            <>
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <p className="text-green-400 text-lg font-semibold mb-2">Onboarding Complete!</p>
              <p className={theme.text.secondary}>Redirecting to your profile...</p>
            </>
          ) : (
            <>
              <div className={`w-16 h-16 ${theme.skeleton.primary} rounded-full animate-pulse mx-auto mb-4`}></div>
              <p className={theme.text.secondary}>Completing your onboarding...</p>
            </>
          )}
        </div>
      </div>
    )
  }

  // Common props for both desktop and mobile components
  const commonProps = {
    currentStep,
    setCurrentStep,
    formData,
    setFormData,
    loading,
    stepLoading,
    error,
    pdfData,
    validationErrors,
    onboardingProgress,
    isDragOver,
    showSuccess,
    showCancelDialog,
    setShowCancelDialog,
    handleFileUpload,
    setIsDragOver,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleArrayToggle,
    handleNext,
    handlePrevious,
    handleSubmit,
    handleCancel,
    confirmCancel,
    isStepAccessible,
    isStepCompleted,
    validateCurrentStep,
    showSkipButton,
    handleSkip,
    handleContinueToProfile
  }

  return (
    <ClientOnly>
      {/* Show loading during hydration to prevent mismatch */}
      {(!isClient || isMobile === null) ? (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-700 rounded-full animate-pulse mx-auto mb-4"></div>
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
      ) : (
        // Render appropriate component based on screen size
        isMobile ? <OnboardingMobile {...commonProps} /> : <OnboardingDesktop {...commonProps} />
      )}
    </ClientOnly>
  )
}
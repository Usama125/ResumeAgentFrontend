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

const workModes = WORK_MODES
const employmentTypes = EMPLOYMENT_TYPES

interface OnboardingMobileProps {
  currentStep: number
  setCurrentStep: (step: number) => void
  formData: OnboardingFormData
  setFormData: (data: OnboardingFormData | ((prev: OnboardingFormData) => OnboardingFormData)) => void
  loading: boolean
  stepLoading: Record<number, boolean>
  error: any
  pdfData: PDFUploadResponse | null
  validationErrors: Record<string, string>
  onboardingProgress: OnboardingProgress | null
  isDragOver: boolean
  showSuccess: boolean
  showCancelDialog: boolean
  setShowCancelDialog: (show: boolean) => void
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>, type: "pdf" | "image") => void
  setIsDragOver: (dragOver: boolean) => void
  handleDragOver: (e: React.DragEvent) => void
  handleDragLeave: (e: React.DragEvent) => void
  handleDrop: (e: React.DragEvent) => void
  handleArrayToggle: (field: keyof OnboardingFormData, value: string) => void
  handleNext: () => void
  handlePrevious: () => void
  handleSubmit: () => void
  handleCancel: () => void
  confirmCancel: () => void
  isStepAccessible: (step: number) => boolean
  isStepCompleted: (step: number) => boolean
  validateCurrentStep: () => boolean
  showSkipButton: boolean
  handleSkip: () => void
  handleContinueToProfile: () => void
}

export default function OnboardingMobile(props: OnboardingMobileProps) {
  const {
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
  } = props

  const { formatError } = useErrorHandler()
  const { isDark } = useTheme()
  const theme = getThemeClasses(isDark)

  const currentStepData = steps[currentStep - 1]

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background gradients - matching EditProfile modal */}
      <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-[#1a1a1a] via-[#212121] to-[#1a1a1a]' : 'bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100'}`}></div>
      <div className="absolute inset-0 bg-gradient-to-br from-[#10a37f]/10 via-transparent to-[#10a37f]/5"></div>
      
      {/* Decorative floating elements */}
      <div className="absolute top-10 left-5 w-20 h-20 bg-[#10a37f]/20 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-10 right-5 w-24 h-24 bg-[#10a37f]/15 rounded-full blur-2xl animate-pulse delay-1000"></div>

      {/* Content wrapper */}
      <div className={`relative z-10 w-full h-full flex flex-col ${theme.text.primary}`}>
        {/* Mobile Header */}
        <div className={`shrink-0 px-3 py-3 border-b ${theme.border.primary}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">R</span>
              </div>
              <h1 className={`${theme.text.primary} text-base font-semibold`}>
                ResumeAI
              </h1>
            </div>
            <div className="flex items-center space-x-1">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className={`p-2 transition-all duration-300 rounded-xl ${theme.text.tertiary} hover:${theme.text.primary} transition-colors hover:bg-gray-100/10`}
                title="Cancel onboarding"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Mobile Step Indicator */}
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <span className={`text-sm ${theme.text.secondary}`}>
                Step {currentStep} of {steps.length}
              </span>
              <span className={`text-xs ${theme.text.tertiary}`}>
                {Math.round((currentStep / steps.length) * 100)}% Complete
              </span>
            </div>
            
            <div className={`w-full ${isDark ? 'bg-[#40414f]/50' : 'bg-gray-300'} rounded-full h-2`}>
              <div 
                className="bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              ></div>
            </div>
            
            <div className="text-center">
              <h2 className={`text-base font-medium ${theme.text.primary} mb-1`}>
                {currentStepData.title}
              </h2>
              <p className={`text-sm ${theme.text.secondary}`}>
                {currentStep === 1 && "Upload your LinkedIn profile to extract your information"}
                {currentStep === 2 && "Tell us more about yourself (all optional)"}
                {currentStep === 3 && "What are your work preferences? (all optional)"}
                {currentStep === 4 && "Salary expectations and availability (all optional)"}
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Error Display */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
                <p className="text-red-300 text-sm">{formatError(error)}</p>
              </div>
            </div>
          )}

          {/* PDF Upload Success */}
          {pdfData?.success && (
            <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 mb-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                <p className="text-green-300 text-sm">
                  PDF processed successfully! {pdfData.extracted_data ? 'Data extracted and ready to use.' : ''}
                </p>
              </div>
            </div>
          )}

          {/* Step Content - Mobile Optimized */}
          <div className="space-y-4">
            {/* Step 1: Upload LinkedIn PDF */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <Card className={`${theme.bg.card} ${theme.border.secondary} rounded-2xl`}>
                  <CardContent className="p-4">
                    <div 
                      className={`border-2 border-dashed rounded-2xl p-6 transition-all duration-300 ${theme.bg.tertiary}/30 backdrop-blur-sm cursor-pointer ${
                        isDragOver 
                          ? "border-[#10a37f] bg-[#10a37f]/10" 
                          : `${theme.border.secondary} hover:border-[#10a37f]`
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => {
                        const input = document.getElementById('pdf-upload') as HTMLInputElement;
                        input?.click();
                      }}
                    >
                      <div className="text-center">
                        <Upload className="w-10 h-10 text-[#10a37f] mx-auto mb-3" />
                        <h3 className={`text-base font-semibold mb-2 ${theme.text.primary}`}>
                          {isDragOver ? "Drop your PDF here" : "Upload your LinkedIn PDF"}
                        </h3>
                        <p className={`${theme.text.secondary} mb-4 text-sm`}>
                          {isDragOver 
                            ? "Release to upload your LinkedIn PDF" 
                            : "Tap to browse or drag and drop your LinkedIn profile PDF"
                          }
                        </p>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => handleFileUpload(e, "pdf")}
                          className="hidden"
                          id="pdf-upload"
                        />
                        <div className="flex justify-center align-middle">
                          <Button 
                            onClick={(e) => {
                              e.stopPropagation();
                              const input = document.getElementById('pdf-upload') as HTMLInputElement;
                              input?.click();
                            }}
                            className="bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#0a7a5f] text-white px-4 py-2 rounded-xl transition-all duration-300"
                          >
                            {isDragOver ? "Or Tap Here" : "Choose PDF File"}
                          </Button>
                        </div>
                        {formData.linkedinPdf && (
                          <p className="text-green-400 mt-2 text-sm">
                            <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                            {formData.linkedinPdf.name} uploaded successfully
                          </p>
                        )}
                        {(validationErrors.pdf || validationErrors.file) && (
                          <p className="text-red-400 text-sm mt-2">
                            {validationErrors.pdf || validationErrors.file}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* LinkedIn PDF Export Instructions - Mobile */}
                <Card className={`${theme.bg.tertiary}/80 ${theme.border.secondary} rounded-2xl`}>
                  <CardContent className="p-4">
                    <h4 className={`font-semibold mb-3 flex items-center ${theme.text.primary} text-sm`}>
                      <FileText className="w-4 h-4 mr-2 text-[#10a37f]" />
                      How to export your LinkedIn profile as PDF:
                    </h4>
                    <div className="space-y-2">
                      {[
                        "Go to your LinkedIn profile page",
                        'Click the "More" button near your profile picture',
                        'Select "Save to PDF" from the dropdown menu',
                        "Download the PDF and upload it here"
                      ].map((step, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className="w-5 h-5 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 text-white">
                            {index + 1}
                          </div>
                          <p className={`text-xs ${theme.text.secondary}`}>{step}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 2: Profile & Preferences */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <Card className={`${theme.bg.card} ${theme.border.secondary} rounded-2xl`}>
                  <CardContent className="p-4">
                    <h3 className={`text-base font-semibold mb-4 ${theme.text.primary}`}>
                      Profile Picture (Optional)
                    </h3>
                    <div className="flex items-center space-x-4">
                      {formData.profile_picture ? (
                        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#10a37f]/30">
                          <img
                            src={URL.createObjectURL(formData.profile_picture)}
                            alt="Profile preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-0 right-0 bg-[#10a37f] rounded-full p-1">
                            <CheckCircle className="w-2.5 h-2.5 text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          <Camera className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, "image")}
                          className="hidden"
                          id="profile-picture-upload"
                        />
                        <Button
                          onClick={() => {
                            const input = document.getElementById('profile-picture-upload') as HTMLInputElement;
                            input?.click();
                          }}
                          variant="outline"
                          className={`w-full ${theme.border.primary} ${theme.text.secondary} hover:${theme.bg.tertiary} text-sm`}
                        >
                          {formData.profile_picture ? 'Change Picture' : 'Add Picture'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className={`${theme.bg.card} ${theme.border.secondary} rounded-2xl`}>
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <Label className={`${theme.text.primary} text-sm`}>Additional Information (Optional)</Label>
                      <Textarea
                        value={formData.additional_info}
                        onChange={(e) => setFormData(prev => ({ ...prev, additional_info: e.target.value }))}
                        placeholder="Tell us more about yourself, your interests, or anything else you'd like to share..."
                        className={`mt-2 ${theme.bg.tertiary} ${theme.border.secondary} ${theme.text.primary} placeholder:${theme.text.tertiary} text-sm`}
                        rows={3}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className={`${theme.text.primary} text-sm`}>Currently looking for job opportunities?</Label>
                      <Switch
                        checked={formData.is_looking_for_job}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_looking_for_job: checked }))}
                      />
                    </div>

                    <div>
                      <Label className={`${theme.text.primary} text-sm`}>Current Work Mode (Optional)</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {workModes.map((mode) => (
                          <Badge
                            key={mode.id}
                            variant={formData.current_employment_mode.includes(mode.id) ? "default" : "outline"}
                            className={`cursor-pointer text-center justify-center py-2 text-xs ${
                              formData.current_employment_mode.includes(mode.id)
                                ? "bg-[#10a37f] text-white hover:bg-[#0d8f6f]"
                                : `${theme.border.primary} ${theme.text.secondary} hover:${theme.bg.tertiary}`
                            }`}
                            onClick={() => handleArrayToggle("current_employment_mode", mode.id)}
                          >
                            {mode.label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 3: Work Preferences */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <Card className={`${theme.bg.card} ${theme.border.secondary} rounded-2xl`}>
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <Label className={`${theme.text.primary} text-sm`}>Preferred Work Mode (Optional)</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {workModes.map((mode) => (
                          <Badge
                            key={mode.id}
                            variant={formData.preferred_work_mode.includes(mode.id) ? "default" : "outline"}
                            className={`cursor-pointer text-center justify-center py-2 text-xs ${
                              formData.preferred_work_mode.includes(mode.id)
                                ? "bg-[#10a37f] text-white hover:bg-[#0d8f6f]"
                                : `${theme.border.primary} ${theme.text.secondary} hover:${theme.bg.tertiary}`
                            }`}
                            onClick={() => handleArrayToggle("preferred_work_mode", mode.id)}
                          >
                            {mode.label}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className={`${theme.text.primary} text-sm`}>Employment Type Preferences (Optional)</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {employmentTypes.map((type) => (
                          <Badge
                            key={type.id}
                            variant={formData.preferred_employment_type.includes(type.id) ? "default" : "outline"}
                            className={`cursor-pointer text-center justify-center py-2 text-xs ${
                              formData.preferred_employment_type.includes(type.id)
                                ? "bg-[#10a37f] text-white hover:bg-[#0d8f6f]"
                                : `${theme.border.primary} ${theme.text.secondary} hover:${theme.bg.tertiary}`
                            }`}
                            onClick={() => handleArrayToggle("preferred_employment_type", type.id)}
                          >
                            {type.label}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className={`${theme.text.primary} text-sm`}>Preferred Location (Optional)</Label>
                      <Input
                        value={formData.preferred_location}
                        onChange={(e) => setFormData(prev => ({ ...prev, preferred_location: e.target.value }))}
                        placeholder="e.g., Remote, New York, London, or Any"
                        className={`mt-2 ${theme.bg.tertiary} ${theme.border.secondary} ${theme.text.primary} placeholder:${theme.text.tertiary} text-sm`}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 4: Salary & Availability */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <Card className={`${theme.bg.card} ${theme.border.secondary} rounded-2xl`}>
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <Label className={`${theme.text.primary} text-sm`}>Current Salary (Optional)</Label>
                      <Input
                        value={formData.current_salary}
                        onChange={(e) => setFormData(prev => ({ ...prev, current_salary: e.target.value }))}
                        placeholder="e.g., $75,000 or ₹50,00,000"
                        className={`mt-2 ${theme.bg.tertiary} ${theme.border.secondary} ${theme.text.primary} placeholder:${theme.text.tertiary} text-sm`}
                      />
                    </div>

                    <div>
                      <Label className={`${theme.text.primary} text-sm`}>Expected Salary (Optional)</Label>
                      <Input
                        value={formData.expected_salary}
                        onChange={(e) => setFormData(prev => ({ ...prev, expected_salary: e.target.value }))}
                        placeholder="e.g., $85,000 or ₹60,00,000"
                        className={`mt-2 ${theme.bg.tertiary} ${theme.border.secondary} ${theme.text.primary} placeholder:${theme.text.tertiary} text-sm`}
                      />
                    </div>

                    <div>
                      <Label className={`${theme.text.primary} text-sm`}>Notice Period (Optional)</Label>
                      <Input
                        value={formData.notice_period}
                        onChange={(e) => setFormData(prev => ({ ...prev, notice_period: e.target.value }))}
                        placeholder="e.g., 2 weeks, 1 month, Immediate"
                        className={`mt-2 ${theme.bg.tertiary} ${theme.border.secondary} ${theme.text.primary} placeholder:${theme.text.tertiary} text-sm`}
                      />
                    </div>

                    <div>
                      <Label className={`${theme.text.primary} text-sm`}>Availability</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {AVAILABILITY_OPTIONS.map((option) => (
                          <Badge
                            key={option}
                            variant={formData.availability === option ? "default" : "outline"}
                            className={`cursor-pointer text-center justify-center py-2 text-xs ${
                              formData.availability === option
                                ? "bg-[#10a37f] text-white hover:bg-[#0d8f6f]"
                                : `${theme.border.primary} ${theme.text.secondary} hover:${theme.bg.tertiary}`
                            }`}
                            onClick={() => setFormData(prev => ({ ...prev, availability: option }))}
                          >
                            {option}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Footer */}
        <div className={`shrink-0 p-4 border-t ${theme.border.primary} ${theme.bg.secondary}`}>
          <div className="flex flex-col space-y-4">
            {/* Action buttons */}
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1 || stepLoading[currentStep] || false}
                className={`bg-transparent ${theme.border.primary} ${theme.text.secondary} hover:${theme.bg.tertiary} hover:${theme.text.primary} disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg transition-colors text-sm`}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>

              <div className="flex space-x-2">
                {currentStep === steps.length ? (
                  // Last step: Only show Continue to Profile button
                  <Button
                    onClick={handleContinueToProfile}
                    disabled={loading || stepLoading[4] || false}
                    className="bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#0a7a5f] text-white px-6 py-2 rounded-lg transition-all duration-300 disabled:opacity-50 text-sm font-medium"
                  >
                    {loading || stepLoading[4] ? (
                      <div className="w-4 h-4 bg-white/60 rounded animate-pulse mr-2" />
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    Continue to Profile
                  </Button>
                ) : (
                  // Other steps: Show Next button
                  <Button
                    onClick={handleNext}
                    disabled={stepLoading[currentStep] || false}
                    className="bg-[#10a37f] hover:bg-[#0d8f6f] text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 text-sm"
                  >
                    {stepLoading[currentStep] ? (
                      <div className="w-4 h-4 bg-white/60 rounded animate-pulse mr-1" />
                    ) : (
                      <ArrowRight className="w-4 h-4 mr-1" />
                    )}
                    Next
                  </Button>
                )}
              </div>
            </div>

            {/* Skip options - only show if PDF is uploaded and not on first step */}
            {showSkipButton && currentStep > 1 && (
              <div className="flex flex-col space-y-2">
                <div className={`border-t ${theme.border.secondary} pt-3`}>
                  <div className="flex justify-center space-x-3">
                    {currentStep < steps.length && (
                      <Button
                        onClick={handleNext}
                        variant="ghost"
                        className={`text-xs ${theme.text.tertiary} hover:${theme.text.secondary} px-3 py-1`}
                      >
                        Skip this step
                      </Button>
                    )}
                    <Button
                      onClick={handleContinueToProfile}
                      variant="ghost"
                      className={`text-xs ${theme.text.tertiary} hover:${theme.text.secondary} px-3 py-1`}
                    >
                      Continue to profile
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`${theme.bg.card} ${theme.border.secondary} border rounded-2xl p-6 max-w-sm w-full shadow-2xl`}>
            <div className="text-center">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-6 h-6 text-red-400" />
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${theme.text.primary}`}>
                Cancel Onboarding?
              </h3>
              <p className={`text-sm ${theme.text.secondary} mb-6`}>
                Are you sure you want to cancel? Your progress will be saved and you can continue later.
              </p>
              <div className="flex flex-col space-y-3">
                <Button
                  variant="outline"
                  onClick={() => setShowCancelDialog(false)}
                  className={`${theme.border.secondary} ${theme.text.secondary} hover:${theme.bg.tertiary}/80`}
                >
                  Continue Setup
                </Button>
                <Button
                  onClick={confirmCancel}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Yes, Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
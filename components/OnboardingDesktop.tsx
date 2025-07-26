"use client"

import type React from "react"
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
  Sparkles,
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

interface OnboardingDesktopProps {
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

export default function OnboardingDesktop(props: OnboardingDesktopProps) {
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
      <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-[#1a1a1a] via-[#212121] to-[#1a1a1a]' : 'bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50'}`}></div>
      <div className="absolute inset-0 bg-gradient-to-br from-[#10a37f]/10 via-transparent to-[#10a37f]/5"></div>
      
      {/* Decorative floating elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-[#10a37f]/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-[#10a37f]/15 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Content wrapper */}
      <div className={`relative z-10 w-full h-full flex flex-col ${theme.text.primary}`}>
        {/* Header */}
        <div className={`shrink-0 px-8 py-6 border-b ${theme.border.primary}/30 backdrop-blur-sm`}>
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className={`${theme.text.primary} text-xl font-bold`}>
                    Complete Profile Setup
                  </h1>
                  <p className={`text-sm ${theme.text.secondary}`}>
                    Step {currentStep} of {steps.length}: {currentStepData.title}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
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
        </div>

        {/* Progress indicator - simplified */}
        <div className="shrink-0 px-8 py-4">
          <div className="max-w-4xl mx-auto">
            <div className={`w-full ${isDark ? 'bg-[#40414f]/30' : 'bg-gray-200'} rounded-full h-1.5`}>
              <div 
                className="bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] h-1.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Main Content - Compact */}
        <div className="flex-1 px-8 py-6 pb-32"> {/* Added bottom padding for sticky buttons */}
          <div className="max-w-3xl mx-auto">
            {/* Error Display */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
                  <p className="text-red-300 text-sm">{formatError(error)}</p>
                </div>
              </div>
            )}

            {/* PDF Upload Success */}
            {pdfData?.success && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 mb-6">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <p className="text-green-300 text-sm">
                    PDF processed successfully! {pdfData.extracted_data ? 'Data extracted and ready to use.' : ''}
                  </p>
                </div>
              </div>
            )}

            {/* Step Content */}
            <div className="space-y-6">
              {/* Step 1: Upload LinkedIn PDF */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <Card className={`${theme.bg.card}/80 ${theme.border.secondary} rounded-3xl backdrop-blur-sm`}>
                    <CardContent className="p-8">
                      <div 
                        className={`border-2 border-dashed rounded-3xl p-12 transition-all duration-300 ${theme.bg.tertiary}/20 backdrop-blur-sm cursor-pointer ${
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
                          <Upload className="w-16 h-16 text-[#10a37f] mx-auto mb-6" />
                          <h3 className={`text-xl font-bold mb-3 ${theme.text.primary}`}>
                            {isDragOver ? "Drop your PDF here" : "Upload your LinkedIn PDF"}
                          </h3>
                          <p className={`${theme.text.secondary} mb-6 text-base`}>
                            {isDragOver 
                              ? "Release to upload your LinkedIn PDF" 
                              : "Drag and drop your LinkedIn profile PDF here, or click to browse"
                            }
                          </p>
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => handleFileUpload(e, "pdf")}
                            className="hidden"
                            id="pdf-upload"
                          />
                          <div className="flex justify-center">
                            <Button 
                              onClick={(e) => {
                                e.stopPropagation();
                                const input = document.getElementById('pdf-upload') as HTMLInputElement;
                                input?.click();
                              }}
                              className="bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#0a7a5f] text-white px-8 py-3 rounded-2xl transition-all duration-300 font-medium"
                              size="lg"
                            >
                              {isDragOver ? "Or Click Here" : "Choose PDF File"}
                            </Button>
                          </div>
                          {formData.linkedinPdf && (
                            <div className="mt-4 p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                              <p className="text-green-400 text-sm flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                {formData.linkedinPdf.name} uploaded successfully
                              </p>
                            </div>
                          )}
                          {(validationErrors.pdf || validationErrors.file) && (
                            <p className="text-red-400 text-sm mt-3">
                              {validationErrors.pdf || validationErrors.file}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* LinkedIn PDF Export Instructions - Compact */}
                  <Card className={`${theme.bg.tertiary}/60 ${theme.border.secondary} rounded-2xl backdrop-blur-sm`}>
                    <CardContent className="p-6">
                      <h4 className={`font-semibold mb-4 flex items-center ${theme.text.primary}`}>
                        <FileText className="w-5 h-5 mr-2 text-[#10a37f]" />
                        How to export your LinkedIn profile as PDF:
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          "Go to your LinkedIn profile page",
                          'Click the "More" button near your profile picture',
                          'Select "Save to PDF" from the dropdown menu',
                          "Download the PDF and upload it here"
                        ].map((step, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 text-white">
                              {index + 1}
                            </div>
                            <p className={`text-sm ${theme.text.secondary}`}>{step}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Step 2: Profile & Preferences - Compact Layout */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <Card className={`${theme.bg.card}/80 ${theme.border.secondary} rounded-3xl backdrop-blur-sm`}>
                    <CardContent className="p-8">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Profile Picture */}
                        <div className="space-y-4">
                          <h3 className={`text-lg font-semibold ${theme.text.primary} mb-4`}>
                            Profile Picture <span className="text-sm font-normal text-gray-400">(Optional)</span>
                          </h3>
                          <div className="flex items-center space-x-6">
                            {formData.profile_picture ? (
                              <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#10a37f]/30">
                                <img
                                  src={URL.createObjectURL(formData.profile_picture)}
                                  alt="Profile preview"
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute top-1 right-1 bg-[#10a37f] rounded-full p-1">
                                  <CheckCircle className="w-3 h-3 text-white" />
                                </div>
                              </div>
                            ) : (
                              <div className={`w-20 h-20 rounded-2xl ${theme.bg.tertiary} flex items-center justify-center`}>
                                <Camera className="w-8 h-8 text-gray-400" />
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
                                className={`w-full ${theme.border.primary} ${theme.text.secondary} hover:${theme.bg.tertiary}`}
                              >
                                {formData.profile_picture ? 'Change Picture' : 'Add Picture'}
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Job Seeking Toggle */}
                        <div className="space-y-4">
                          <h3 className={`text-lg font-semibold ${theme.text.primary} mb-4`}>
                            Job Status
                          </h3>
                          <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-[#10a37f]/10 to-[#0d8f6f]/10 border border-[#10a37f]/20">
                            <Label className={`${theme.text.primary} font-medium`}>Currently looking for job opportunities?</Label>
                            <Switch
                              checked={formData.is_looking_for_job}
                              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_looking_for_job: checked }))}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Additional Information */}
                      <div className="mt-8">
                        <Label className={`${theme.text.primary} text-lg font-semibold`}>
                          Additional Information <span className="text-sm font-normal text-gray-400">(Optional)</span>
                        </Label>
                        <Textarea
                          value={formData.additional_info}
                          onChange={(e) => setFormData(prev => ({ ...prev, additional_info: e.target.value }))}
                          placeholder="Tell us more about yourself, your interests, or anything else you'd like to share..."
                          className={`mt-3 ${theme.bg.tertiary} ${theme.border.secondary} ${theme.text.primary} placeholder:${theme.text.tertiary} rounded-2xl`}
                          rows={4}
                        />
                      </div>

                      {/* Current Work Mode */}
                      <div className="mt-8">
                        <Label className={`${theme.text.primary} text-lg font-semibold`}>
                          Current Work Mode <span className="text-sm font-normal text-gray-400">(Optional)</span>
                        </Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                          {workModes.map((mode) => (
                            <Badge
                              key={mode.id}
                              variant={formData.current_employment_mode.includes(mode.id) ? "default" : "outline"}
                              className={`cursor-pointer text-center justify-center py-3 px-4 text-sm font-medium rounded-xl transition-all duration-200 ${
                                formData.current_employment_mode.includes(mode.id)
                                  ? "bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] text-white hover:from-[#0d8f6f] hover:to-[#0a7a5f] shadow-lg"
                                  : `${theme.border.primary} ${theme.text.secondary} hover:${theme.bg.tertiary} hover:border-[#10a37f]/50`
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

              {/* Step 3: Work Preferences - Compact Layout */}
              {currentStep === 3 && (
                <Card className={`${theme.bg.card}/80 ${theme.border.secondary} rounded-3xl backdrop-blur-sm`}>
                  <CardContent className="p-8 space-y-8">
                    {/* Preferred Work Mode */}
                    <div>
                      <Label className={`${theme.text.primary} text-lg font-semibold`}>
                        Preferred Work Mode <span className="text-sm font-normal text-gray-400">(Optional)</span>
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                        {workModes.map((mode) => (
                          <Badge
                            key={mode.id}
                            variant={formData.preferred_work_mode.includes(mode.id) ? "default" : "outline"}
                            className={`cursor-pointer text-center justify-center py-3 px-4 text-sm font-medium rounded-xl transition-all duration-200 ${
                              formData.preferred_work_mode.includes(mode.id)
                                ? "bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] text-white hover:from-[#0d8f6f] hover:to-[#0a7a5f] shadow-lg"
                                : `${theme.border.primary} ${theme.text.secondary} hover:${theme.bg.tertiary} hover:border-[#10a37f]/50`
                            }`}
                            onClick={() => handleArrayToggle("preferred_work_mode", mode.id)}
                          >
                            {mode.label}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Employment Type Preferences */}
                    <div>
                      <Label className={`${theme.text.primary} text-lg font-semibold`}>
                        Employment Type Preferences <span className="text-sm font-normal text-gray-400">(Optional)</span>
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                        {employmentTypes.map((type) => (
                          <Badge
                            key={type.id}
                            variant={formData.preferred_employment_type.includes(type.id) ? "default" : "outline"}
                            className={`cursor-pointer text-center justify-center py-3 px-4 text-sm font-medium rounded-xl transition-all duration-200 ${
                              formData.preferred_employment_type.includes(type.id)
                                ? "bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] text-white hover:from-[#0d8f6f] hover:to-[#0a7a5f] shadow-lg"
                                : `${theme.border.primary} ${theme.text.secondary} hover:${theme.bg.tertiary} hover:border-[#10a37f]/50`
                            }`}
                            onClick={() => handleArrayToggle("preferred_employment_type", type.id)}
                          >
                            {type.label}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Preferred Location */}
                    <div>
                      <Label className={`${theme.text.primary} text-lg font-semibold`}>
                        Preferred Location <span className="text-sm font-normal text-gray-400">(Optional)</span>
                      </Label>
                      <Input
                        value={formData.preferred_location}
                        onChange={(e) => setFormData(prev => ({ ...prev, preferred_location: e.target.value }))}
                        placeholder="e.g., Remote, New York, London, or Any"
                        className={`mt-3 ${theme.bg.tertiary} ${theme.border.secondary} ${theme.text.primary} placeholder:${theme.text.tertiary} rounded-2xl py-3 px-4 text-base`}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 4: Salary & Availability - Compact Layout */}
              {currentStep === 4 && (
                <Card className={`${theme.bg.card}/80 ${theme.border.secondary} rounded-3xl backdrop-blur-sm`}>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Salary Information */}
                      <div className="space-y-6">
                        <h3 className={`text-lg font-semibold ${theme.text.primary} mb-4`}>
                          Salary Information <span className="text-sm font-normal text-gray-400">(Optional)</span>
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <Label className={`${theme.text.primary} font-medium`}>Current Salary</Label>
                            <Input
                              value={formData.current_salary}
                              onChange={(e) => setFormData(prev => ({ ...prev, current_salary: e.target.value }))}
                              placeholder="e.g., $75,000 or ₹50,00,000"
                              className={`mt-2 ${theme.bg.tertiary} ${theme.border.secondary} ${theme.text.primary} placeholder:${theme.text.tertiary} rounded-xl py-3 px-4`}
                            />
                          </div>
                          <div>
                            <Label className={`${theme.text.primary} font-medium`}>Expected Salary</Label>
                            <Input
                              value={formData.expected_salary}
                              onChange={(e) => setFormData(prev => ({ ...prev, expected_salary: e.target.value }))}
                              placeholder="e.g., $85,000 or ₹60,00,000"
                              className={`mt-2 ${theme.bg.tertiary} ${theme.border.secondary} ${theme.text.primary} placeholder:${theme.text.tertiary} rounded-xl py-3 px-4`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Availability Information */}
                      <div className="space-y-6">
                        <h3 className={`text-lg font-semibold ${theme.text.primary} mb-4`}>
                          Availability <span className="text-sm font-normal text-gray-400">(Optional)</span>
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <Label className={`${theme.text.primary} font-medium`}>Notice Period</Label>
                            <Input
                              value={formData.notice_period}
                              onChange={(e) => setFormData(prev => ({ ...prev, notice_period: e.target.value }))}
                              placeholder="e.g., 2 weeks, 1 month, Immediate"
                              className={`mt-2 ${theme.bg.tertiary} ${theme.border.secondary} ${theme.text.primary} placeholder:${theme.text.tertiary} rounded-xl py-3 px-4`}
                            />
                          </div>
                          <div>
                            <Label className={`${theme.text.primary} font-medium`}>Availability Status</Label>
                            <div className="grid grid-cols-2 gap-3 mt-3">
                              {AVAILABILITY_OPTIONS.map((option) => (
                                <Badge
                                  key={option}
                                  variant={formData.availability === option ? "default" : "outline"}
                                  className={`cursor-pointer text-center justify-center py-3 px-4 text-sm font-medium rounded-xl transition-all duration-200 ${
                                    formData.availability === option
                                      ? "bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] text-white hover:from-[#0d8f6f] hover:to-[#0a7a5f] shadow-lg"
                                      : `${theme.border.primary} ${theme.text.secondary} hover:${theme.bg.tertiary} hover:border-[#10a37f]/50`
                                  }`}
                                  onClick={() => setFormData(prev => ({ ...prev, availability: option }))}
                                >
                                  {option}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Sticky Bottom Navigation */}
        <div className={`fixed bottom-0 left-0 right-0 ${theme.bg.secondary}/95 backdrop-blur-md border-t ${theme.border.primary}/30 px-8 py-6 z-50`}>
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              {/* Left: Back button */}
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1 || stepLoading[currentStep] || false}
                className={`bg-transparent ${theme.border.primary} ${theme.text.secondary} hover:${theme.bg.tertiary} hover:${theme.text.primary} disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-xl transition-all duration-300 font-medium`}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              {/* Center: Skip options (only show if PDF uploaded and not first step) */}
              {showSkipButton && currentStep > 1 && (
                <div className="flex items-center space-x-4">
                  {currentStep < steps.length && (
                    <Button
                      onClick={handleNext}
                      variant="ghost"
                      className={`${theme.text.tertiary} hover:${theme.text.secondary} px-4 py-2 rounded-lg transition-colors text-sm`}
                    >
                      Skip this step
                    </Button>
                  )}
                  <Button
                    onClick={handleContinueToProfile}
                    variant="ghost"
                    className={`${theme.text.tertiary} hover:${theme.text.secondary} px-4 py-2 rounded-lg transition-colors text-sm`}
                  >
                    Continue to profile
                  </Button>
                </div>
              )}

              {/* Right: Primary action button */}
              <div>
                {currentStep === steps.length ? (
                  // Last step: Only show Continue to Profile button
                  <Button
                    onClick={handleContinueToProfile}
                    disabled={loading || stepLoading[4] || false}
                    className="bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#0a7a5f] text-white px-8 py-3 rounded-xl transition-all duration-300 disabled:opacity-50 font-medium shadow-lg"
                  >
                    {loading || stepLoading[4] ? (
                      <div className="w-5 h-5 bg-white/60 rounded animate-pulse mr-2" />
                    ) : (
                      <CheckCircle className="w-5 h-5 mr-2" />
                    )}
                    Continue to Profile
                  </Button>
                ) : (
                  // Other steps: Show Next button
                  <Button
                    onClick={handleNext}
                    disabled={stepLoading[currentStep] || false}
                    className="bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#0a7a5f] text-white px-8 py-3 rounded-xl transition-all duration-300 disabled:opacity-50 font-medium shadow-lg"
                  >
                    {stepLoading[currentStep] ? (
                      <div className="w-5 h-5 bg-white/60 rounded animate-pulse mr-2" />
                    ) : (
                      <ArrowRight className="w-5 h-5 mr-2" />
                    )}
                    Next Step
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className={`${theme.bg.card} ${theme.border.secondary} border rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl`}>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <X className="w-8 h-8 text-red-400" />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${theme.text.primary}`}>
                Cancel Onboarding?
              </h3>
              <p className={`text-base ${theme.text.secondary} mb-8`}>
                Are you sure you want to cancel? Your progress will be saved and you can continue later.
              </p>
              <div className="flex flex-col space-y-3">
                <Button
                  variant="outline"
                  onClick={() => setShowCancelDialog(false)}
                  className={`${theme.border.secondary} ${theme.text.secondary} hover:${theme.bg.tertiary}/80 py-3 rounded-xl`}
                >
                  Continue Setup
                </Button>
                <Button
                  onClick={confirmCancel}
                  className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl"
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
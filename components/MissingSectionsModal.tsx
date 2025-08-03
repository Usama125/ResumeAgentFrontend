"use client"

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, ArrowRight, X } from "lucide-react"
import { useTheme } from "@/context/ThemeContext"
import { getThemeClasses } from "@/utils/theme"

interface MissingSectionsModalProps {
  isOpen: boolean
  onClose: () => void
  onContinue: () => void
  confidenceScore: number
  missingSections: string[]
  onContinueToProfile?: () => void
}

const SECTION_INFO = {
  personal_info: {
    title: "Personal Information",
    description: "Name, designation, location, or summary may be incomplete",
    icon: "👤"
  },
  contact_info: {
    title: "Contact Information",
    description: "Email, phone, LinkedIn, or other contact methods missing",
    icon: "📧"
  },
  work_experience: {
    title: "Work Experience",
    description: "Job history or employment details not fully extracted",
    icon: "💼"
  },
  skills: {
    title: "Technical Skills",
    description: "Programming languages, frameworks, or technologies missed",
    icon: "🛠️"
  },
  education: {
    title: "Education",
    description: "Degrees, institutions, or academic achievements missing",
    icon: "🎓"
  },
  projects: {
    title: "Projects",
    description: "Work projects, personal projects, or portfolio items not found",
    icon: "🚀"
  },
  languages: {
    title: "Languages",
    description: "Spoken languages or proficiency levels not identified",
    icon: "🌐"
  },
  certifications: {
    title: "Certifications & Awards",
    description: "Professional certifications, awards, or achievements missed",
    icon: "🏆"
  }
}

export default function MissingSectionsModal({
  isOpen,
  onClose,
  onContinue,
  confidenceScore,
  missingSections,
  onContinueToProfile
}: MissingSectionsModalProps) {
  const { isDark } = useTheme()
  const themeClasses = getThemeClasses(isDark)
  
  const getConfidenceColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getConfidenceLabel = (score: number) => {
    if (score >= 80) return "Good Quality"
    if (score >= 60) return "Moderate Quality"
    return "Needs Review"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={true}>
      <DialogContent 
        className={`max-w-4xl relative overflow-hidden ${themeClasses.text.primary} h-[85vh] p-0 flex flex-col border-0 [&>button]:hidden`}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 50
        }}
      >
        {/* Background gradients - exactly like EditProfileModal */}
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-[#1a1a1a] via-[#212121] to-[#1a1a1a]' : 'bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100'}`}></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#10a37f]/10 via-transparent to-[#10a37f]/5"></div>
        
        {/* Decorative floating elements - exactly like EditProfileModal */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#10a37f]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#10a37f]/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Content wrapper - exactly like EditProfileModal */}
        <div className="relative z-10 w-full h-full flex flex-col">
          {/* Fixed Header - exactly like EditProfileModal */}
          <div className={`shrink-0 p-6 border-b ${themeClasses.border.primary}`}>
            <DialogHeader className="mb-6">
              <div className="flex items-center justify-between">
                <DialogTitle className={`${themeClasses.text.primary} text-xl font-semibold`}>
                  Resume Extraction Complete
                </DialogTitle>
                <button
                  onClick={onClose}
                  className={`${themeClasses.text.tertiary} hover:${themeClasses.text.primary} transition-colors p-2 rounded-lg hover:bg-gray-100/10`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </DialogHeader>

            {/* Confidence Score Display */}
            <div className="flex items-center justify-center">
              <div className={`inline-flex items-center space-x-3 px-6 py-3 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'} backdrop-blur-sm border ${themeClasses.border.primary}`}>
                <AlertTriangle className="w-6 h-6 text-yellow-500" />
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium ${themeClasses.text.secondary}`}>Extraction Confidence:</span>
                  <span className={`text-xl font-bold ${getConfidenceColor(confidenceScore)}`}>
                    {confidenceScore}%
                  </span>
                  <span className={`text-sm font-medium ${getConfidenceColor(confidenceScore)}`}>
                    ({getConfidenceLabel(confidenceScore)})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Content Area - exactly like EditProfileModal */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              
              {/* Missing Sections Info */}
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className={`text-lg font-semibold ${themeClasses.text.primary} mb-2`}>
                    {missingSections.length > 0 ? "Sections That Need Your Attention" : "Profile Enhancement Available"}
                  </h3>
                  {missingSections.length > 0 ? (
                    <p className={`text-sm ${themeClasses.text.secondary} max-w-2xl mx-auto`}>
                      We couldn't extract any information for the following sections from your resume. 
                      You can add these sections in your profile to make it more complete.
                    </p>
                  ) : (
                    <p className={`text-sm ${themeClasses.text.secondary} max-w-2xl mx-auto`}>
                      Great! We extracted information from your resume. You can enhance your profile further by clicking "Edit Basic Info" below your profile information to add more details.
                    </p>
                  )}
                </div>
                
                {missingSections.length > 0 ? (
                  <div className="grid gap-3 max-w-3xl mx-auto">
                    {missingSections.map((section) => {
                      const info = SECTION_INFO[section as keyof typeof SECTION_INFO]
                      if (!info) return null
                      
                      return (
                        <div key={section} className={`flex items-start space-x-4 p-4 rounded-xl border ${isDark ? 'bg-yellow-900/10 border-yellow-600/20 hover:bg-yellow-900/15' : 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'} transition-all duration-200 backdrop-blur-sm`}>
                          <span className="text-2xl">{info.icon}</span>
                          <div className="flex-1">
                            <h4 className={`font-semibold ${themeClasses.text.primary} mb-1`}>{info.title}</h4>
                            <p className={`text-sm ${themeClasses.text.secondary}`}>{info.description}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className={`flex items-center space-x-4 p-6 rounded-xl border max-w-2xl mx-auto ${isDark ? 'bg-green-900/10 border-green-600/20' : 'bg-green-50 border-green-200'} backdrop-blur-sm`}>
                    <CheckCircle className="w-8 h-8 text-green-500" />
                    <div>
                      <h4 className={`font-semibold ${isDark ? 'text-green-400' : 'text-green-800'} mb-1`}>Profile Complete</h4>
                      <p className={`text-sm ${isDark ? 'text-green-300' : 'text-green-700'}`}>
                        We successfully extracted information from your resume. You can enhance your profile further by clicking "Edit Basic Info" below your profile information.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Next Steps Section */}
              <div className="max-w-3xl mx-auto">
                <div className={`rounded-xl border p-6 ${isDark ? 'bg-blue-900/10 border-blue-600/20' : 'bg-blue-50 border-blue-200'} backdrop-blur-sm`}>
                  <h4 className={`font-semibold ${isDark ? 'text-blue-400' : 'text-blue-800'} mb-3 flex items-center`}>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    What happens next?
                  </h4>
                  <ul className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-700'} space-y-2`}>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-current mt-2 mr-3 flex-shrink-0"></span>
                      Your profile has been created with all extracted information
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-current mt-2 mr-3 flex-shrink-0"></span>
                      You can continue to complete the onboarding process
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-current mt-2 mr-3 flex-shrink-0"></span>
                      Visit the "Edit Basic Info" section anytime to add or update information
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-current mt-2 mr-3 flex-shrink-0"></span>
                      Our AI will help you enhance your profile as needed
                    </li>
                  </ul>
                </div>
              </div>

            </div>
          </div>

          {/* Fixed Footer - exactly like EditProfileModal */}
          <div className={`shrink-0 p-6 border-t ${themeClasses.border.primary}`}>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={onClose}
                className={`px-6 py-2 ${themeClasses.text.secondary} hover:${themeClasses.text.primary} transition-colors`}
              >
                Close
              </Button>
              {onContinueToProfile && (
                <Button
                  variant="outline"
                  onClick={onContinueToProfile}
                  className={`px-6 py-2 ${themeClasses.text.secondary} hover:${themeClasses.text.primary} transition-colors flex items-center`}
                >
                  <span>Continue to Profile</span>
                  <span className="text-xs opacity-60 ml-1">(Skip onboarding)</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
              <Button
                onClick={onContinue}
                className="px-6 py-2 bg-[#10a37f] hover:bg-[#0d8f6b] text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center"
              >
                Continue to Next Step
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
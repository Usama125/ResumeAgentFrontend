"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Loader2, X } from "lucide-react"
import { useTheme } from "@/context/ThemeContext"
import { getThemeClasses } from "@/utils/theme"

interface ProgressStep {
  id: string
  name: string
  description: string
  status: 'pending' | 'in_progress' | 'completed'
}

interface ProgressModalProps {
  isOpen: boolean
  onClose: () => void
  currentStep: string
  progress: number
  message: string
  details: string
}

const EXTRACTION_STEPS: ProgressStep[] = [
  {
    id: 'initialization',
    name: 'Starting Process',
    description: 'Preparing AI extraction agents',
    status: 'pending'
  },
  {
    id: 'agent_1',
    name: 'Personal Information',
    description: 'Extracting name, designation, location, and contact details',
    status: 'pending'
  },
  {
    id: 'agent_2',
    name: 'Work Experience',
    description: 'Analyzing job history and calculating total experience',
    status: 'pending'
  },
  {
    id: 'agent_experience',
    name: 'Experience Specialist',
    description: 'Dedicated AI agent focusing solely on experience extraction',
    status: 'pending'
  },
  {
    id: 'agent_3',
    name: 'Technical Skills',
    description: 'Identifying programming languages, frameworks, and technologies',
    status: 'pending'
  },
  {
    id: 'agent_4',
    name: 'Education',
    description: 'Extracting degrees, institutions, and academic achievements',
    status: 'pending'
  },
  {
    id: 'agent_5',
    name: 'Projects',
    description: 'Finding work projects, personal projects, and portfolio items',
    status: 'pending'
  },
  {
    id: 'agent_6',
    name: 'Languages',
    description: 'Extracting spoken languages and proficiency levels',
    status: 'pending'
  },
  {
    id: 'agent_7',
    name: 'Certifications & Awards',
    description: 'Finding certifications, awards, publications, and interests',
    status: 'pending'
  },
  {
    id: 'agent_8',
    name: 'Quality Assurance',
    description: 'Verifying extraction quality and identifying missing sections',
    status: 'pending'
  },
  {
    id: 'completion',
    name: 'Finalizing',
    description: 'Processing complete and saving to your profile',
    status: 'pending'
  }
]

export default function ProgressModal({ 
  isOpen, 
  onClose, 
  currentStep, 
  progress, 
  message, 
  details 
}: ProgressModalProps) {
  const [steps, setSteps] = useState<ProgressStep[]>(EXTRACTION_STEPS)
  const { isDark } = useTheme()
  const themeClasses = getThemeClasses(isDark)
  const activeStepRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setSteps(prevSteps => 
      prevSteps.map(step => {
        if (step.id === currentStep) {
          return { ...step, status: 'in_progress' }
        } else if (prevSteps.findIndex(s => s.id === currentStep) > prevSteps.findIndex(s => s.id === step.id)) {
          return { ...step, status: 'completed' }
        }
        return step
      })
    )
  }, [currentStep])

  // Auto-scroll to active step
  useEffect(() => {
    if (activeStepRef.current) {
      activeStepRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }
  }, [currentStep])

  const getStepIcon = (step: ProgressStep) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'in_progress':
        return <Loader2 className="w-5 h-5 text-[#10a37f] animate-spin" />
      default:
        return <div className={`w-5 h-5 rounded-full border-2 ${themeClasses.border.secondary}`} />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}} modal={true}>
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
                <DialogTitle className={`${themeClasses.text.primary} text-xl font-semibold flex items-center space-x-2`}>
                  <span className="text-2xl">🤖</span>
                  <span>AI Resume Extraction in Progress</span>
                </DialogTitle>
                <button
                  onClick={onClose}
                  className={`${themeClasses.text.tertiary} hover:${themeClasses.text.primary} transition-colors p-2 rounded-lg hover:bg-gray-100/10`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </DialogHeader>

            {/* Overall Progress Display */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={`text-lg font-medium ${themeClasses.text.primary}`}>{message}</span>
                <span className={`text-2xl font-bold text-[#10a37f]`}>{progress}%</span>
              </div>
              <div className="relative">
                <Progress value={progress} className="w-full h-3" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f]/20 to-[#10a37f]/40 rounded-full blur-sm"></div>
              </div>
              {details && (
                <p className={`text-sm ${themeClasses.text.secondary} text-center`}>{details}</p>
              )}
            </div>
          </div>

          {/* Content Area - Fixed header, scrollable steps */}
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Info Message - Fixed at top */}
            <div className="p-6 pb-4">
              <div className={`rounded-xl border p-4 ${isDark ? 'bg-blue-900/10 border-blue-600/20' : 'bg-blue-50 border-blue-200'} backdrop-blur-sm`}>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <Loader2 className="h-5 w-5 text-[#10a37f] animate-spin" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-sm font-semibold ${isDark ? 'text-blue-400' : 'text-blue-800'} mb-1`}>
                      Processing Your Resume
                    </h3>
                    <p className={`text-xs ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                      Our AI agents are carefully analyzing your resume to extract maximum information.
                      This process typically takes 30-60 seconds depending on the complexity of your document.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step Progress - Scrollable with all 10 steps */}
            <div className="flex-1 px-6 pb-6 overflow-y-auto">
              <div className="space-y-3">
                <div className="space-y-2">
                  {steps.map((step, index) => (
                    <div
                      key={step.id}
                      ref={step.status === 'in_progress' ? activeStepRef : null}
                      className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 backdrop-blur-sm ${
                        step.status === 'in_progress' 
                          ? `${isDark ? 'bg-[#10a37f]/10 border-[#10a37f]/30' : 'bg-[#10a37f]/5 border-[#10a37f]/20'} shadow-md shadow-[#10a37f]/10` 
                          : step.status === 'completed'
                          ? `${isDark ? 'bg-green-900/10 border-green-600/20' : 'bg-green-50 border-green-200'}`
                          : `${isDark ? 'bg-gray-800/30 border-gray-700/30' : 'bg-gray-50 border-gray-200'}`
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {getStepIcon(step)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                            step.status === 'in_progress' ? 'bg-[#10a37f]/20 text-[#10a37f]' :
                            step.status === 'completed' ? 'bg-green-500/20 text-green-600' :
                            `${themeClasses.bg.tertiary} ${themeClasses.text.tertiary}`
                          }`}>
                            {index + 1}
                          </span>
                          <h4 className={`text-sm font-semibold ${
                            step.status === 'in_progress' ? 'text-[#10a37f]' : 
                            step.status === 'completed' ? 'text-green-600' : 
                            themeClasses.text.primary
                          }`}>
                            {step.name}
                          </h4>
                        </div>
                        <p className={`text-xs ${themeClasses.text.secondary} mt-0.5`}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
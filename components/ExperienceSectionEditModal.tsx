"use client"

import { useState, useEffect, memo } from "react"
import { X, Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useTheme } from "@/context/ThemeContext"
import { updateProfileSection } from "@/services/user"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { ExperienceDetail } from "@/types"

interface ExperienceSectionEditModalProps {
  isOpen: boolean
  onClose: () => void
  currentExperiences: ExperienceDetail[]
  onUpdate: (newExperiences: ExperienceDetail[]) => void
  editingExperience?: ExperienceDetail | null
  editingIndex?: number | null
  mode: 'add' | 'edit'
}

const ExperienceSectionEditModal = memo(function ExperienceSectionEditModal({
  isOpen,
  onClose,
  currentExperiences,
  onUpdate,
  editingExperience,
  editingIndex,
  mode = 'add'
}: ExperienceSectionEditModalProps) {
  const [experience, setExperience] = useState<ExperienceDetail>({
    company: "",
    position: "",
    duration: "",
    description: "",
    technologies: []
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { isDark } = useTheme()
  const { user, updateUser } = useAuth()
  const { toast } = useToast()

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && editingExperience) {
        setExperience({ ...editingExperience })
      } else {
        setExperience({
          company: "",
          position: "",
          duration: "",
          description: "",
          technologies: []
        })
      }
    }
  }, [isOpen, mode, editingExperience])

  // Check if form data meets backend expectations (company and position required)
  const isFormValid = () => {
    return experience.company.trim() !== "" && experience.position.trim() !== ""
  }

  // Check if there are changes (for edit mode)
  const hasChanges = () => {
    if (mode === 'add') return true
    if (!editingExperience) return false
    
    return (
      experience.company !== editingExperience.company ||
      experience.position !== editingExperience.position ||
      experience.duration !== editingExperience.duration ||
      experience.description !== editingExperience.description
    )
  }

  const handleSubmit = async () => {
    if (!user || !isFormValid()) {
      toast({
        title: "Error",
        description: "Please fill in company and position fields",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    
    try {
      let updatedExperiences = [...currentExperiences]
      
      if (mode === 'add') {
        // Add new experience at the beginning
        updatedExperiences.unshift(experience)
      } else if (mode === 'edit' && editingIndex !== null && editingIndex !== undefined) {
        // Update existing experience
        updatedExperiences[editingIndex] = experience
      }

      // Call API to update experiences
      await updateProfileSection("experience", { experience_details: updatedExperiences })
      
      // Update frontend state
      onUpdate(updatedExperiences)
      updateUser({ experience_details: updatedExperiences })
      
      toast({
        title: "Success",
        description: mode === 'add' ? "Experience added successfully" : "Experience updated successfully",
      })
      onClose()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to ${mode === 'add' ? 'add' : 'update'} experience`,
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        className={`relative w-full max-w-lg md:max-w-2xl max-h-[80vh] flex flex-col border-0 rounded-2xl shadow-2xl`}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 50
        }}
      >
        {/* Background gradients */}
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-[#1a1a1a] via-[#212121] to-[#1a1a1a]' : 'bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100'}`}></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#10a37f]/10 via-transparent to-[#10a37f]/5"></div>
        
        {/* Decorative floating elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#10a37f]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#10a37f]/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Content wrapper */}
        <div className="relative z-10 w-full h-full flex flex-col">
          {/* Header */}
          <div className={`shrink-0 p-6 border-b ${isDark ? 'border-[#10a37f]/20' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {mode === 'add' ? 'Add New Experience' : 'Edit Experience'}
              </h2>
              <button
                onClick={onClose}
                className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'} transition-colors p-2 rounded-lg hover:bg-gray-100/10`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Company *
                  </label>
                  <Input
                    value={experience.company}
                    onChange={(e) => setExperience({ ...experience, company: e.target.value })}
                    placeholder="e.g., Google, Microsoft, Startup Inc."
                    className={`${isDark ? 'bg-[#1a1a1a] border-[#10a37f]/30 text-white placeholder:text-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-500'}`}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Position *
                  </label>
                  <Input
                    value={experience.position}
                    onChange={(e) => setExperience({ ...experience, position: e.target.value })}
                    placeholder="e.g., Senior Frontend Developer"
                    className={`${isDark ? 'bg-[#1a1a1a] border-[#10a37f]/30 text-white placeholder:text-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-500'}`}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Duration
                </label>
                <Input
                  value={experience.duration}
                  onChange={(e) => setExperience({ ...experience, duration: e.target.value })}
                  placeholder="e.g., Jan 2020 - Present"
                  className={`${isDark ? 'bg-[#1a1a1a] border-[#10a37f]/30 text-white placeholder:text-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-500'}`}
                />
              </div>
              
              <div className="space-y-2">
                <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Description
                </label>
                <Textarea
                  value={experience.description}
                  onChange={(e) => setExperience({ ...experience, description: e.target.value })}
                  placeholder="Describe your role, responsibilities, and achievements..."
                  className={`min-h-[120px] resize-none ${isDark ? 'bg-[#1a1a1a] border-[#10a37f]/30 text-white placeholder:text-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-500'}`}
                  maxLength={500}
                />
                <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                  {experience.description.length}/500 characters
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className={`shrink-0 p-6 border-t ${isDark ? 'border-[#10a37f]/20 bg-[#212121]' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className={`bg-transparent ${isDark ? 'border-[#10a37f]/30 text-gray-300 hover:bg-[#10a37f]/10 hover:text-white hover:border-[#10a37f]/50' : 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-400'} disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2 rounded-lg transition-colors`}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !isFormValid() || (mode === 'edit' && !hasChanges())}
                className="bg-[#10a37f] hover:bg-[#0d8f6f] text-white px-8 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {mode === 'add' ? 'Adding...' : 'Updating...'}
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    {mode === 'add' ? 'Add Experience' : 'Update Experience'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default ExperienceSectionEditModal
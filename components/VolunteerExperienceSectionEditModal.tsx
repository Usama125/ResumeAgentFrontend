"use client"

import { useState, useEffect } from "react"
import { X, Save, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useTheme } from "@/context/ThemeContext"
import { updateProfileSection } from "@/services/user"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { VolunteerExperience } from "@/types"

interface VolunteerExperienceSectionEditModalProps {
  isOpen: boolean
  onClose: () => void
  currentVolunteerExperience: VolunteerExperience[]
  onUpdate: (newVolunteerExperience: VolunteerExperience[]) => void
  editingVolunteerExperience?: VolunteerExperience | null
  editingIndex?: number | null
  mode: 'add' | 'edit'
}

export default function VolunteerExperienceSectionEditModal({
  isOpen,
  onClose,
  currentVolunteerExperience,
  onUpdate,
  editingVolunteerExperience,
  editingIndex,
  mode = 'add'
}: VolunteerExperienceSectionEditModalProps) {
  const [volunteerExperience, setVolunteerExperience] = useState<VolunteerExperience>({
    organization: "",
    role: "",
    start_date: "",
    end_date: "",
    description: ""
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

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && editingVolunteerExperience) {
        setVolunteerExperience({ ...editingVolunteerExperience })
      } else {
        setVolunteerExperience({ organization: "", role: "", start_date: "", end_date: "", description: "" })
      }
    }
  }, [isOpen, mode, editingVolunteerExperience])

  const isFormValid = () => {
    return volunteerExperience.organization.trim() !== "" && volunteerExperience.role.trim() !== ""
  }

  const hasChanges = () => {
    if (mode === 'add') return true
    if (!editingVolunteerExperience) return false
    
    return (
      volunteerExperience.organization !== editingVolunteerExperience.organization ||
      volunteerExperience.role !== editingVolunteerExperience.role ||
      volunteerExperience.start_date !== editingVolunteerExperience.start_date ||
      volunteerExperience.end_date !== editingVolunteerExperience.end_date ||
      volunteerExperience.description !== editingVolunteerExperience.description
    )
  }

  const handleSubmit = async () => {
    if (!user || !isFormValid()) {
      toast({
        title: "Error",
        description: "Please fill in organization and role fields",
        variant: "destructive"
      })
      return
    }

    if (mode === 'edit' && !hasChanges()) {
      toast({
        title: "No Changes",
        description: "No changes detected",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    
    try {
      let updatedVolunteerExperience = [...currentVolunteerExperience]
      
      if (mode === 'add') {
        updatedVolunteerExperience.unshift(volunteerExperience)
      } else if (mode === 'edit' && editingIndex !== null && editingIndex !== undefined) {
        updatedVolunteerExperience[editingIndex] = volunteerExperience
      }

      await updateProfileSection("volunteer", { volunteer_experience: updatedVolunteerExperience })
      
      // Profile update manager will handle the update automatically
      // No need to call onUpdate or updateUser manually
      
      toast({
        title: "Success",
        description: mode === 'add' ? "Volunteer experience added successfully" : "Volunteer experience updated successfully",
      })
      onClose()
    } catch (error: any) {
      console.error(`Error ${mode === 'add' ? 'adding' : 'updating'} volunteer experience:`, error)
      toast({
        title: "Error",
        description: error.message || `Failed to ${mode === 'add' ? 'add' : 'update'} volunteer experience`,
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof VolunteerExperience, value: string) => {
    setVolunteerExperience(prev => ({ ...prev, [field]: value }))
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
        <div className="relative z-10 w-full h-full flex flex-col max-h-[80vh]">
          {/* Header */}
          <div className={`shrink-0 p-6 border-b ${isDark ? 'border-[#10a37f]/20' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {mode === 'add' ? 'Add New Volunteer Experience' : 'Edit Volunteer Experience'}
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
          <div className="flex-1 overflow-y-auto px-6 pt-6 pb-6 min-h-0">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Organization <span className="text-red-500">*</span>
                </label>
                <Input
                  value={volunteerExperience.organization}
                  onChange={(e) => handleInputChange('organization', e.target.value)}
                  placeholder="Organization name"
                  className={`${isDark ? 'bg-[#1a1a1a] border-[#10a37f]/30 text-white placeholder:text-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-500'}`}
                />
              </div>

              <div className="space-y-2">
                <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Role <span className="text-red-500">*</span>
                </label>
                <Input
                  value={volunteerExperience.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  placeholder="Your role/position"
                  className={`${isDark ? 'bg-[#1a1a1a] border-[#10a37f]/30 text-white placeholder:text-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-500'}`}
                />
              </div>

              <div className="space-y-2">
                <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Start Date
                </label>
                <Input
                  value={volunteerExperience.start_date || ''}
                  onChange={(e) => handleInputChange('start_date', e.target.value)}
                  placeholder="Start date (e.g., January 2024)"
                  className={`${isDark ? 'bg-[#1a1a1a] border-[#10a37f]/30 text-white placeholder:text-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-500'}`}
                />
              </div>

              <div className="space-y-2">
                <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  End Date
                </label>
                <Input
                  value={volunteerExperience.end_date || ''}
                  onChange={(e) => handleInputChange('end_date', e.target.value)}
                  placeholder="End date (e.g., December 2024) or 'Present'"
                  className={`${isDark ? 'bg-[#1a1a1a] border-[#10a37f]/30 text-white placeholder:text-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-500'}`}
                />
              </div>

              <div className="space-y-2">
                <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Description
                </label>
                <Textarea
                  value={volunteerExperience.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your responsibilities and achievements"
                  rows={4}
                  className={`${isDark ? 'bg-[#1a1a1a] border-[#10a37f]/30 text-white placeholder:text-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-500'}`}
                />
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
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting || !isFormValid() || (mode === 'edit' && !hasChanges())}
                className="bg-[#10a37f] hover:bg-[#0d8f6f] text-white px-8 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
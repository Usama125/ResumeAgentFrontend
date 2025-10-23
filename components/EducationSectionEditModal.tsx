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
import { Education } from "@/types"

interface EducationSectionEditModalProps {
  isOpen: boolean
  onClose: () => void
  currentEducation: Education[]
  onUpdate: (newEducation: Education[]) => void
  editingEducation?: Education | null
  editingIndex?: number | null
  mode: 'add' | 'edit'
}

const EducationSectionEditModal = memo(function EducationSectionEditModal({
  isOpen,
  onClose,
  currentEducation,
  onUpdate,
  editingEducation,
  editingIndex,
  mode = 'add'
}: EducationSectionEditModalProps) {
  const [education, setEducation] = useState<Education>({
    institution: '',
    degree: '',
    field_of_study: '',
    start_date: '',
    end_date: '',
    grade: '',
    activities: '',
    description: ''
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
      if (mode === 'edit' && editingEducation) {
        setEducation({ ...editingEducation })
      } else {
        setEducation({
          institution: "",
          degree: "",
          field_of_study: "",
          start_date: "",
          end_date: "",
          grade: "",
          activities: "",
          description: ""
        })
      }
    }
  }, [isOpen, mode, editingEducation])

  // Check if form data meets backend expectations (institution and degree required)
  const isFormValid = () => {
    return education.institution.trim() !== "" && education.degree.trim() !== ""
  }

  // Check if there are changes (for edit mode)
  const hasChanges = () => {
    if (mode === 'add') return true
    if (!editingEducation) return false
    
    return (
      education.institution !== editingEducation.institution ||
      education.degree !== editingEducation.degree ||
      education.field_of_study !== editingEducation.field_of_study ||
      education.start_date !== editingEducation.start_date ||
      education.end_date !== editingEducation.end_date ||
      education.grade !== editingEducation.grade ||
      education.activities !== editingEducation.activities ||
      education.description !== editingEducation.description
    )
  }

  const handleSubmit = async () => {
    if (!user || !isFormValid()) {
      toast({
        title: "Error",
        description: "Please fill in institution and degree fields",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    
    try {
      let updatedEducation = [...currentEducation]
      
      if (mode === 'add') {
        // Add new education at the beginning
        updatedEducation.unshift(education)
      } else if (mode === 'edit' && editingIndex !== null && editingIndex !== undefined) {
        // Update existing education
        updatedEducation[editingIndex] = education
      }

      // Call API to update education
      await updateProfileSection("education", { education: updatedEducation })
      
      // Profile update manager will handle the update automatically
      // No need to call onUpdate or updateUser manually
      
      toast({
        title: "Success",
        description: mode === 'add' ? "Education added successfully" : "Education updated successfully",
      })
      onClose()
    } catch (error: any) {
      console.error(`Error ${mode === 'add' ? 'adding' : 'updating'} education:`, error)
      toast({
        title: "Error",
        description: error.message || `Failed to ${mode === 'add' ? 'add' : 'update'} education`,
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
          zIndex: 50,
          maxHeight: '80vh'
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
                {mode === 'add' ? 'Add New Education' : 'Edit Education'}
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
                  Institution *
                </label>
                <Input
                  value={education.institution}
                  onChange={(e) => setEducation({ ...education, institution: e.target.value })}
                  placeholder="e.g., University of Technology, Stanford University"
                  className={`${isDark ? 'bg-[#1a1a1a] border-[#10a37f]/30 text-white placeholder:text-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-500'}`}
                />
              </div>
              
              <div className="space-y-2">
                <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Degree *
                </label>
                <Input
                  value={education.degree}
                  onChange={(e) => setEducation({ ...education, degree: e.target.value })}
                  placeholder="e.g., Bachelor of Science, Master of Arts"
                  className={`${isDark ? 'bg-[#1a1a1a] border-[#10a37f]/30 text-white placeholder:text-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-500'}`}
                />
              </div>

              <div className="space-y-2">
                <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Field of Study
                </label>
                <Input
                  value={education.field_of_study || ""}
                  onChange={(e) => setEducation({ ...education, field_of_study: e.target.value })}
                  placeholder="e.g., Computer Science, Business Administration"
                  className={`${isDark ? 'bg-[#1a1a1a] border-[#10a37f]/30 text-white placeholder:text-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-500'}`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Start Date
                  </label>
                  <Input
                    value={education.start_date || ""}
                    onChange={(e) => setEducation({ ...education, start_date: e.target.value })}
                    placeholder="e.g., 2018, Sep 2018"
                    className={`${isDark ? 'bg-[#1a1a1a] border-[#10a37f]/30 text-white placeholder:text-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-500'}`}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    End Date
                  </label>
                  <Input
                    value={education.end_date || ""}
                    onChange={(e) => setEducation({ ...education, end_date: e.target.value })}
                    placeholder="e.g., 2022, Present"
                    className={`${isDark ? 'bg-[#1a1a1a] border-[#10a37f]/30 text-white placeholder:text-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-500'}`}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Grade/GPA
                </label>
                <Input
                  value={education.grade || ""}
                  onChange={(e) => setEducation({ ...education, grade: e.target.value })}
                  placeholder="e.g., 3.8 GPA, First Class Honours"
                  className={`${isDark ? 'bg-[#1a1a1a] border-[#10a37f]/30 text-white placeholder:text-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-500'}`}
                />
              </div>

              <div className="space-y-2">
                <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Activities & Achievements
                </label>
                <Textarea
                  value={education.activities || ""}
                  onChange={(e) => setEducation({ ...education, activities: e.target.value })}
                  placeholder="Describe your extracurricular activities, clubs, leadership roles..."
                  className={`min-h-[100px] resize-none ${isDark ? 'bg-[#1a1a1a] border-[#10a37f]/30 text-white placeholder:text-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-500'}`}
                  maxLength={300}
                />
                <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                  {education.activities?.length || 0}/300 characters
                </div>
              </div>

              <div className="space-y-2">
                <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Description
                </label>
                <Textarea
                  value={education.description || ""}
                  onChange={(e) => setEducation({ ...education, description: e.target.value })}
                  placeholder="Describe your educational experience, key learnings, projects..."
                  className={`min-h-[120px] resize-none ${isDark ? 'bg-[#1a1a1a] border-[#10a37f]/30 text-white placeholder:text-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-500'}`}
                  maxLength={500}
                />
                <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                  {education.description?.length || 0}/500 characters
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
                    {mode === 'add' ? 'Add Education' : 'Update Education'}
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

export default EducationSectionEditModal
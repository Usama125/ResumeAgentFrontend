"use client"

import { useState, useEffect } from "react"
import { X, Plus, Loader2, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useTheme } from "@/context/ThemeContext"
import { updateProfileSection } from "@/services/user"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { Award as AwardType } from "@/types"

interface AwardsSectionEditModalProps {
  isOpen: boolean
  onClose: () => void
  currentAwards: AwardType[]
  onUpdate: (newAwards: AwardType[]) => void
  editingAward?: AwardType | null
  editingIndex?: number | null
  mode?: 'add' | 'edit'
}

export default function AwardsSectionEditModal({
  isOpen,
  onClose,
  currentAwards,
  onUpdate,
  editingAward,
  editingIndex,
  mode = 'add'
}: AwardsSectionEditModalProps) {
  const [award, setAward] = useState<AwardType>({
    title: '',
    issuer: '',
    date: '',
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
      if (mode === 'edit' && editingAward) {
        setAward({ ...editingAward })
      } else {
        setAward({ title: '', issuer: '', date: '', description: '' })
      }
    }
  }, [isOpen, editingAward, mode])

  // Check if form is valid
  const isFormValid = () => {
    return award.title.trim() !== ''
  }

  // Check if there are changes
  const hasChanges = () => {
    if (mode === 'add') {
      return award.title.trim() !== '' || (award.issuer || '').trim() !== '' || (award.date || '').trim() !== '' || (award.description || '').trim() !== ''
    }
    
    if (!editingAward) return false
    
    return (
      award.title !== editingAward.title ||
      award.issuer !== (editingAward.issuer || '') ||
      award.date !== (editingAward.date || '') ||
      award.description !== (editingAward.description || '')
    )
  }

  const handleSubmit = async () => {
    if (!isFormValid()) return
    
    setIsSubmitting(true)
    
    try {
      let updatedAwards: AwardType[]
      
      if (mode === 'add') {
        // Add new award
        updatedAwards = [...currentAwards, award]
      } else {
        // Edit existing award
        updatedAwards = [...currentAwards]
        if (editingIndex !== null && editingIndex !== undefined) {
          updatedAwards[editingIndex] = award
        }
      }
      
      // Call API to update awards
      await updateProfileSection("awards", { awards: updatedAwards })
      
      // Profile update manager will handle the update automatically
      // No need to call onUpdate or updateUser manually
      
      toast({
        title: "Success",
        description: mode === 'add' ? "Award added successfully" : "Award updated successfully",
      })
      onClose()
    } catch (error: any) {
      console.error("Error updating awards:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update awards",
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
                {mode === 'add' ? 'Add Award & Recognition' : 'Edit Award & Recognition'}
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
            <div className="space-y-6">
              {/* Award Title */}
              <div className="space-y-2">
                <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Award Title *
                </label>
                <Input
                  value={award.title}
                  onChange={(e) => setAward({ ...award, title: e.target.value })}
                  placeholder="e.g., Employee of the Year, Best Innovation Award"
                  className={`${isDark ? 'bg-[#1a1a1a] border-[#10a37f]/30 text-white placeholder:text-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-500'}`}
                />
              </div>

              {/* Issuer */}
              <div className="space-y-2">
                <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Issuing Organization
                </label>
                <Input
                  value={award.issuer || ''}
                  onChange={(e) => setAward({ ...award, issuer: e.target.value })}
                  placeholder="e.g., Company Name, University, Professional Association"
                  className={`${isDark ? 'bg-[#1a1a1a] border-[#10a37f]/30 text-white placeholder:text-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-500'}`}
                />
              </div>

              {/* Date */}
              <div className="space-y-2">
                <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Date Received
                </label>
                <Input
                  value={award.date || ''}
                  onChange={(e) => setAward({ ...award, date: e.target.value })}
                  placeholder="e.g., 2023, March 2023, Q1 2023"
                  className={`${isDark ? 'bg-[#1a1a1a] border-[#10a37f]/30 text-white placeholder:text-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-500'}`}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Description
                </label>
                <Textarea
                  value={award.description || ''}
                  onChange={(e) => setAward({ ...award, description: e.target.value })}
                  placeholder="Describe the award, criteria, and significance..."
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
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !isFormValid() || !hasChanges()}
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
                    {mode === 'add' ? 'Add Award' : 'Update Award'}
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
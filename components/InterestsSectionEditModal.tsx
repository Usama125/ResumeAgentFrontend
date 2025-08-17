"use client"

import { useState, useEffect } from "react"
import { X, Save, Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "@/context/ThemeContext"
import { updateProfileSection } from "@/services/user"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"

interface InterestsSectionEditModalProps {
  isOpen: boolean
  onClose: () => void
  currentInterests: string[]
  onUpdate: (newInterests: string[]) => void
  mode: 'add' | 'edit'
}

export default function InterestsSectionEditModal({
  isOpen,
  onClose,
  currentInterests,
  onUpdate,
  mode = 'add'
}: InterestsSectionEditModalProps) {
  const [interests, setInterests] = useState<string[]>([])
  const [newInterest, setNewInterest] = useState('')
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
      setInterests([...currentInterests])
      setNewInterest('')
    }
  }, [isOpen, currentInterests])

  const isFormValid = () => {
    return interests.length > 0
  }

  const hasChanges = () => {
    if (mode === 'add') return interests.length > 0
    return JSON.stringify(interests) !== JSON.stringify(currentInterests)
  }

  const handleAddInterest = () => {
    const trimmedInterest = newInterest.trim()
    if (trimmedInterest && !interests.includes(trimmedInterest)) {
      setInterests([...interests, trimmedInterest])
      setNewInterest('')
    }
  }

  const handleRemoveInterest = (index: number) => {
    setInterests(interests.filter((_, i) => i !== index))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddInterest()
    }
  }

  const handleSubmit = async () => {
    if (!user || !isFormValid()) {
      toast({
        title: "Error",
        description: "Please add at least one interest",
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
      await updateProfileSection("interests", { interests })
      
      onUpdate(interests)
      updateUser({ interests })
      
      toast({
        title: "Success",
        description: mode === 'add' ? "Interests added successfully" : "Interests updated successfully",
      })
      onClose()
    } catch (error: any) {
      console.error(`Error ${mode === 'add' ? 'adding' : 'updating'} interests:`, error)
      toast({
        title: "Error",
        description: error.message || `Failed to ${mode === 'add' ? 'add' : 'update'} interests`,
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
                {mode === 'add' ? 'Add Interests & Hobbies' : 'Edit Interests & Hobbies'}
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
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Add Interest
                </label>
                <div className="flex gap-2">
                  <Input
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter an interest or hobby"
                    className={`flex-1 ${isDark ? 'bg-[#1a1a1a] border-[#10a37f]/30 text-white placeholder:text-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-500'}`}
                  />
                  <Button
                    onClick={handleAddInterest}
                    disabled={!newInterest.trim()}
                    size="sm"
                    className="bg-[#10a37f] hover:bg-[#0d8f6f] text-white"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Current Interests <span className="text-red-500">*</span>
                </label>
                {interests.length === 0 ? (
                  <p className={`text-sm italic ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    No interests added yet. Add your first interest above.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className={`${isDark ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} pr-1`}
                      >
                        {interest}
                        <Button
                          onClick={() => handleRemoveInterest(index)}
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <p>Add your interests, hobbies, and activities that showcase your personality and skills.</p>
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
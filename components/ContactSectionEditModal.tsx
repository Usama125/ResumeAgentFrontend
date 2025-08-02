"use client"

import { useState, useEffect } from "react"
import { X, Plus, Loader2, Mail, Phone, Linkedin, Github, Globe, Twitter, Instagram, Facebook, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTheme } from "@/context/ThemeContext"
import { updateProfileSection } from "@/services/user"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { ContactInfo } from "@/types"

interface ContactSectionEditModalProps {
  isOpen: boolean
  onClose: () => void
  currentContactInfo: ContactInfo | undefined
  onUpdate: (newContactInfo: ContactInfo) => void
}

export default function ContactSectionEditModal({
  isOpen,
  onClose,
  currentContactInfo,
  onUpdate
}: ContactSectionEditModalProps) {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    portfolio: '',
    website: '',
    twitter: '',
    dribbble: '',
    behance: '',
    medium: '',
    instagram: '',
    facebook: '',
    youtube: ''
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
      setContactInfo({
        email: currentContactInfo?.email || '',
        phone: currentContactInfo?.phone || '',
        linkedin: currentContactInfo?.linkedin || '',
        github: currentContactInfo?.github || '',
        portfolio: currentContactInfo?.portfolio || '',
        website: currentContactInfo?.website || '',
        twitter: currentContactInfo?.twitter || '',
        dribbble: currentContactInfo?.dribbble || '',
        behance: currentContactInfo?.behance || '',
        medium: currentContactInfo?.medium || '',
        instagram: currentContactInfo?.instagram || '',
        facebook: currentContactInfo?.facebook || '',
        youtube: currentContactInfo?.youtube || ''
      })
    }
  }, [isOpen, currentContactInfo])

  // Check if there are changes
  const hasChanges = () => {
    if (!currentContactInfo) return Object.values(contactInfo).some(value => value.trim() !== '')
    
    return (
      contactInfo.email !== (currentContactInfo.email || '') ||
      contactInfo.phone !== (currentContactInfo.phone || '') ||
      contactInfo.linkedin !== (currentContactInfo.linkedin || '') ||
      contactInfo.github !== (currentContactInfo.github || '') ||
      contactInfo.portfolio !== (currentContactInfo.portfolio || '') ||
      contactInfo.website !== (currentContactInfo.website || '') ||
      contactInfo.twitter !== (currentContactInfo.twitter || '') ||
      contactInfo.dribbble !== (currentContactInfo.dribbble || '') ||
      contactInfo.behance !== (currentContactInfo.behance || '') ||
      contactInfo.medium !== (currentContactInfo.medium || '') ||
      contactInfo.instagram !== (currentContactInfo.instagram || '') ||
      contactInfo.facebook !== (currentContactInfo.facebook || '') ||
      contactInfo.youtube !== (currentContactInfo.youtube || '')
    )
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      // Call API to update contact info
      await updateProfileSection("contact", { contact_info: contactInfo })
      
      // Update frontend state
      onUpdate(contactInfo)
      updateUser({ contact_info: contactInfo })
      
      toast({
        title: "Success",
        description: "Contact information updated successfully",
      })
      onClose()
    } catch (error: any) {
      console.error("Error updating contact information:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update contact information",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setIsSubmitting(true)
    
    try {
      // Call API to delete contact info
      await updateProfileSection("contact", { contact_info: {} })
      
      // Update frontend state
      onUpdate({})
      updateUser({ contact_info: {} })
      
      toast({
        title: "Success",
        description: "Contact information deleted successfully",
      })
      onClose()
    } catch (error: any) {
      console.error("Error deleting contact information:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete contact information",
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
                Contact Information
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
              {/* Primary Contact Information */}
              <div className="space-y-4">
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Primary Contact
                </h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} flex items-center gap-2`}>
                      <Mail className="w-4 h-4" />
                      Email Address
                    </label>
                    <Input
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                      placeholder="your.email@example.com"
                      type="email"
                      className={`${isDark ? 'bg-[#1a1a1a] border-[#10a37f]/30 text-white placeholder:text-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-500'}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} flex items-center gap-2`}>
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </label>
                    <Input
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                      type="tel"
                      className={`${isDark ? 'bg-[#1a1a1a] border-[#10a37f]/30 text-white placeholder:text-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-500'}`}
                    />
                  </div>
                </div>
              </div>

              {/* Professional Links */}
              <div className="space-y-4">
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Professional Links
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} flex items-center gap-2`}>
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </label>
                    <Input
                      value={contactInfo.linkedin}
                      onChange={(e) => setContactInfo({ ...contactInfo, linkedin: e.target.value })}
                      placeholder="https://linkedin.com/in/username"
                      className={`${isDark ? 'bg-[#1a1a1a] border-[#10a37f]/30 text-white placeholder:text-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-500'}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} flex items-center gap-2`}>
                      <Github className="w-4 h-4" />
                      GitHub
                    </label>
                    <Input
                      value={contactInfo.github}
                      onChange={(e) => setContactInfo({ ...contactInfo, github: e.target.value })}
                      placeholder="https://github.com/username"
                      className={`${isDark ? 'bg-[#1a1a1a] border-[#10a37f]/30 text-white placeholder:text-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-500'}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} flex items-center gap-2`}>
                      <Globe className="w-4 h-4" />
                      Portfolio
                    </label>
                    <Input
                      value={contactInfo.portfolio}
                      onChange={(e) => setContactInfo({ ...contactInfo, portfolio: e.target.value })}
                      placeholder="https://your-portfolio.com"
                      className={`${isDark ? 'bg-[#1a1a1a] border-[#10a37f]/30 text-white placeholder:text-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-500'}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} flex items-center gap-2`}>
                      <Globe className="w-4 h-4" />
                      Website
                    </label>
                    <Input
                      value={contactInfo.website}
                      onChange={(e) => setContactInfo({ ...contactInfo, website: e.target.value })}
                      placeholder="https://your-website.com"
                      className={`${isDark ? 'bg-[#1a1a1a] border-[#10a37f]/30 text-white placeholder:text-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-500'}`}
                    />
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="space-y-4">
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Social Media
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} flex items-center gap-2`}>
                      <Twitter className="w-4 h-4" />
                      Twitter
                    </label>
                    <Input
                      value={contactInfo.twitter}
                      onChange={(e) => setContactInfo({ ...contactInfo, twitter: e.target.value })}
                      placeholder="https://twitter.com/username"
                      className={`${isDark ? 'bg-[#1a1a1a] border-[#10a37f]/30 text-white placeholder:text-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-500'}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} flex items-center gap-2`}>
                      <Instagram className="w-4 h-4" />
                      Instagram
                    </label>
                    <Input
                      value={contactInfo.instagram}
                      onChange={(e) => setContactInfo({ ...contactInfo, instagram: e.target.value })}
                      placeholder="https://instagram.com/username"
                      className={`${isDark ? 'bg-[#1a1a1a] border-[#10a37f]/30 text-white placeholder:text-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-500'}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} flex items-center gap-2`}>
                      <Facebook className="w-4 h-4" />
                      Facebook
                    </label>
                    <Input
                      value={contactInfo.facebook}
                      onChange={(e) => setContactInfo({ ...contactInfo, facebook: e.target.value })}
                      placeholder="https://facebook.com/username"
                      className={`${isDark ? 'bg-[#1a1a1a] border-[#10a37f]/30 text-white placeholder:text-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-500'}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} flex items-center gap-2`}>
                      <Youtube className="w-4 h-4" />
                      YouTube
                    </label>
                    <Input
                      value={contactInfo.youtube}
                      onChange={(e) => setContactInfo({ ...contactInfo, youtube: e.target.value })}
                      placeholder="https://youtube.com/@username"
                      className={`${isDark ? 'bg-[#1a1a1a] border-[#10a37f]/30 text-white placeholder:text-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-500'}`}
                    />
                  </div>
                </div>
              </div>

              {/* Design Platforms */}
              <div className="space-y-4">
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Design Platforms
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Dribbble
                    </label>
                    <Input
                      value={contactInfo.dribbble}
                      onChange={(e) => setContactInfo({ ...contactInfo, dribbble: e.target.value })}
                      placeholder="https://dribbble.com/username"
                      className={`${isDark ? 'bg-[#1a1a1a] border-[#10a37f]/30 text-white placeholder:text-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-500'}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Behance
                    </label>
                    <Input
                      value={contactInfo.behance}
                      onChange={(e) => setContactInfo({ ...contactInfo, behance: e.target.value })}
                      placeholder="https://behance.net/username"
                      className={`${isDark ? 'bg-[#1a1a1a] border-[#10a37f]/30 text-white placeholder:text-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-500'}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Medium
                    </label>
                    <Input
                      value={contactInfo.medium}
                      onChange={(e) => setContactInfo({ ...contactInfo, medium: e.target.value })}
                      placeholder="https://medium.com/@username"
                      className={`${isDark ? 'bg-[#1a1a1a] border-[#10a37f]/30 text-white placeholder:text-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-500'}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className={`shrink-0 p-6 border-t ${isDark ? 'border-[#10a37f]/20 bg-[#212121]' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handleDelete}
                disabled={isSubmitting || !Object.values(contactInfo).some(value => value.trim() !== '')}
                className={`bg-transparent ${isDark ? 'border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/50' : 'border-red-300 text-red-600 hover:bg-red-100 hover:text-red-700 hover:border-red-400'} disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2 rounded-lg transition-colors`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete All'
                )}
              </Button>
              
              <div className="flex space-x-3">
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
                  disabled={isSubmitting || !hasChanges()}
                  className="bg-[#10a37f] hover:bg-[#0d8f6f] text-white px-8 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Update Contact Info
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
"use client"

import React, { useState, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { getThemeClasses } from '@/utils/theme'
import UserService from '@/services/user'
import { useErrorHandler } from '@/utils/errorHandler'
import ProfileOptimizer from '@/lib/profile-optimization'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Upload,
  Camera,
  X,
  Save,
  Trash2,
  ImageIcon
} from "lucide-react"

interface EditPhotoModalProps {
  isOpen: boolean
  onClose: () => void
  currentPhotoUrl?: string | null
  onPhotoUpdate: (newPhotoUrl: string | null) => void
}

export default function EditPhotoModal({
  isOpen,
  onClose,
  currentPhotoUrl,
  onPhotoUpdate
}: EditPhotoModalProps) {
  const { user, refreshUser } = useAuth()
  const { theme, isDark } = useTheme()
  const { handleError } = useErrorHandler()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhotoUrl || null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)

  const themeClasses = getThemeClasses(isDark)

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      handleError('Please select an image file (JPG, PNG, or JPEG)')
      return
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      handleError('File size must be less than 10MB')
      return
    }

    setSelectedFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !user) return

    setUploading(true)
    try {
      const result = await UserService.uploadProfilePicture(selectedFile)
      
      if (result.success) {
        // Add timestamp to force cache refresh for new profile picture
        const updatedUrl = `${result.profile_picture_url}?t=${Date.now()}`
        
        // Update the preview immediately
        setPreviewUrl(updatedUrl)
        onPhotoUpdate(updatedUrl)
        await refreshUser()
        onClose()
        resetModal()
      }
    } catch (error) {
      handleError('Failed to upload profile picture')
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = async () => {
    if (!user) return

    setUploading(true)
    try {
      await UserService.deleteProfilePicture()
      onPhotoUpdate(null)
      await refreshUser()
      onClose()
      resetModal()
    } catch (error) {
      handleError('Failed to remove profile picture')
    } finally {
      setUploading(false)
    }
  }

  const resetModal = () => {
    setPreviewUrl(currentPhotoUrl || null)
    setSelectedFile(null)
    setIsDragOver(false)
  }

  // Reset preview when modal opens with new currentPhotoUrl
  React.useEffect(() => {
    setPreviewUrl(currentPhotoUrl || null)
  }, [currentPhotoUrl])

  const handleCancel = () => {
    resetModal()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent 
        className={`max-w-lg relative overflow-hidden ${themeClasses.text.primary} p-0 flex flex-col border-0 [&>button]:hidden`}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 50
        }}
      >
        {/* Background gradients - matching EditProfile modal exactly */}
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-[#1a1a1a] via-[#212121] to-[#1a1a1a]' : 'bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100'}`}></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#10a37f]/10 via-transparent to-[#10a37f]/5"></div>
        
        {/* Decorative floating elements */}
        <div className="absolute top-10 left-8 w-20 h-20 bg-[#10a37f]/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-10 right-8 w-24 h-24 bg-[#10a37f]/15 rounded-full blur-2xl animate-pulse delay-1000"></div>
        
        {/* Content wrapper */}
        <div className="relative z-10 w-full h-full flex flex-col">
          <div className="p-6">
            <DialogHeader className="mb-6">
              <div className="flex items-center justify-between">
                <DialogTitle className={`${themeClasses.text.primary} text-xl font-semibold`}>
                  Change Profile Picture
                </DialogTitle>
                <button
                  onClick={handleCancel}
                  className={`${themeClasses.text.tertiary} hover:${themeClasses.text.primary} transition-colors p-2 rounded-lg hover:bg-gray-100/10`}
                  disabled={uploading}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </DialogHeader>

            <div className="space-y-6">
              {/* Preview Section */}
              <div className="flex justify-center">
                <div className="relative">
                  {previewUrl ? (
                    <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-[#10a37f]/30 shadow-lg">
                      <img
                        src={previewUrl}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className={`w-40 h-40 rounded-full flex items-center justify-center ${isDark ? 'bg-[#565869]/50' : 'bg-gray-100'} border-2 border-dashed ${isDark ? 'border-[#565869]' : 'border-gray-300'}`}>
                      <ImageIcon className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>

              {/* Helpful Text */}
              <div className="text-center space-y-2">
                {!selectedFile ? (
                  <div>
                    <p className={`text-sm font-medium ${themeClasses.text.primary}`}>
                      Select a high-quality photo that represents you professionally
                    </p>
                    <p className={`text-xs ${themeClasses.text.secondary} mt-1`}>
                      This image will be visible to potential employers and networking contacts
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className={`text-sm font-medium ${themeClasses.text.primary}`}>
                      Ready to upload your new profile picture
                    </p>
                    <p className={`text-xs ${themeClasses.text.secondary} mt-1`}>
                      Click "Upload Photo" to save this as your default profile image
                    </p>
                  </div>
                )}
              </div>

              {/* Upload Section */}
              {!previewUrl && (
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                    isDragOver 
                      ? 'border-[#10a37f] bg-[#10a37f]/5' 
                      : `${isDark ? 'border-[#565869] hover:border-[#10a37f]/50' : 'border-gray-300 hover:border-[#10a37f]/50'}`
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="space-y-3">
                    <div className="flex justify-center">
                      <div className={`p-3 rounded-full ${isDark ? 'bg-[#565869]/50' : 'bg-gray-100'}`}>
                        <Upload className="w-6 h-6 text-[#10a37f]" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Drop your photo here, or click to browse</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Supports JPG, PNG, JPEG (max 10MB)
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />

              {/* Action Button */}
              <div className="flex justify-center">
                {selectedFile ? (
                  <Button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="w-full bg-[#10a37f] hover:bg-[#0d8f6f] text-white"
                  >
                    {uploading ? 'Uploading...' : 'Upload Photo'}
                  </Button>
                ) : (
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-[#10a37f] hover:bg-[#0d8f6f] text-white"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Choose Photo
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
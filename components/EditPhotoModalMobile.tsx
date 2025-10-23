"use client"

import React, { useState, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { getThemeClasses } from '@/utils/theme'
import UserService from '@/services/user'
import { useErrorHandler } from '@/utils/errorHandler'
import ProfileOptimizer from '@/lib/profile-optimization'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
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

interface EditPhotoModalMobileProps {
  isOpen: boolean
  onClose: () => void
  currentPhotoUrl?: string | null
  onPhotoUpdate: (newPhotoUrl: string | null) => void
}

export default function EditPhotoModalMobile({
  isOpen,
  onClose,
  currentPhotoUrl,
  onPhotoUpdate
}: EditPhotoModalMobileProps) {
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
    <Sheet open={isOpen} onOpenChange={handleCancel}>
      <SheetContent 
        side="bottom" 
        className="h-auto max-h-[90vh] p-0 [&>button]:hidden [&>button[data-radix-collection-item]]:hidden [&>button]:!hidden"
        style={{
          background: isDark 
            ? 'linear-gradient(135deg, #2f2f2f 0%, #1e1e1e 50%, #2f2f2f 100%)' 
            : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          border: isDark ? '1px solid #565869' : '1px solid #e2e8f0',
        }}
      >
        {/* Inline style to hide default close button */}
        <style dangerouslySetInnerHTML={{
          __html: `
            [data-radix-sheet-content] > button[aria-label="Close"],
            [data-radix-sheet-content] > button:first-child,
            .sheet-close-button {
              display: none !important;
            }
          `
        }} />
        <div className="p-6">
          <SheetHeader className="pb-4">
            <div className="flex items-center justify-between">
              <SheetTitle className={`${themeClasses.text.primary} text-xl font-semibold`}>
                Change Profile Picture
              </SheetTitle>
              <button
                onClick={handleCancel}
                className={`${themeClasses.text.tertiary} hover:${themeClasses.text.primary} transition-colors p-2 rounded-lg hover:bg-gray-100/10`}
                disabled={uploading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </SheetHeader>

          <div className="space-y-6 pb-safe">
            {/* Preview Section */}
            <div className="flex justify-center">
              <div className="relative">
                {previewUrl ? (
                  <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-[#10a37f]/30 shadow-lg">
                    <img
                      src={previewUrl}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full flex items-center justify-center ${isDark ? 'bg-[#565869]/50' : 'bg-gray-100'} border-2 border-dashed ${isDark ? 'border-[#565869]' : 'border-gray-300'}`}>
                    <ImageIcon className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground" />
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
                    Tap "Upload Photo" to save this as your default profile image
                  </p>
                </div>
              )}
            </div>

            {/* Upload Section */}
            {!previewUrl && (
              <div
                className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer ${
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
                    <div className={`p-2 rounded-full ${isDark ? 'bg-[#565869]/50' : 'bg-gray-100'}`}>
                      <Upload className="w-5 h-5 text-[#10a37f]" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Tap to choose photo</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, PNG, JPEG (max 10MB)
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
                  className="w-full h-12 text-base bg-[#10a37f] hover:bg-[#0d8f6f] text-white"
                >
                  {uploading ? 'Uploading...' : 'Upload Photo'}
                </Button>
              ) : (
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-12 text-base bg-[#10a37f] hover:bg-[#0d8f6f] text-white"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Choose Photo
                </Button>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
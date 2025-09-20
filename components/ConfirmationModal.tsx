"use client"

import { useState, useEffect } from "react"
import { X, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useTheme } from "@/context/ThemeContext"

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: "danger" | "warning" | "info"
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger"
}: ConfirmationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { isDark } = useTheme()

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setIsSubmitting(false)
    }
  }, [isOpen])

  const handleConfirm = async () => {
    setIsSubmitting(true)
    try {
      await onConfirm()
      onClose()
    } catch (error) {
      console.error("Error in confirmation:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getTypeStyles = () => {
    switch (type) {
      case "danger":
        return {
          iconColor: "text-red-500",
          buttonColor: "bg-red-500 hover:bg-red-600",
          borderColor: "border-red-500/20"
        }
      case "warning":
        return {
          iconColor: "text-yellow-500",
          buttonColor: "bg-yellow-500 hover:bg-yellow-600",
          borderColor: "border-yellow-500/20"
        }
      default:
        return {
          iconColor: "text-blue-500",
          buttonColor: "bg-blue-500 hover:bg-blue-600",
          borderColor: "border-blue-500/20"
        }
    }
  }

  const styles = getTypeStyles()

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={true}>
      <DialogContent 
        className={`max-w-md relative overflow-hidden ${isDark ? 'text-white' : 'text-gray-900'} p-0 flex flex-col border-0`}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 50
        }}
      >
        {/* Background gradients */}
        <div className={`absolute inset-0 z-0 pointer-events-none ${isDark ? 'bg-gradient-to-br from-[#1a1a1a] via-[#212121] to-[#1a1a1a]' : 'bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100'}`}></div>
        <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-br from-[#10a37f]/10 via-transparent to-[#10a37f]/5"></div>
        
        {/* Decorative floating elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#10a37f]/20 rounded-full blur-3xl animate-pulse z-0 pointer-events-none"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#10a37f]/15 rounded-full blur-3xl animate-pulse delay-1000 z-0 pointer-events-none"></div>
        
        {/* Content wrapper */}
        <div className="relative z-10 w-full flex flex-col">
          {/* Header */}
          <div className={`shrink-0 p-6 border-b ${isDark ? 'border-[#10a37f]/20' : 'border-gray-200'}`}>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className={`${styles.iconColor} w-6 h-6`} />
                  <DialogTitle className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {title}
                  </DialogTitle>
                </div>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={onClose}
                  className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'} transition-colors p-2 rounded-lg hover:bg-gray-100/10`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </DialogHeader>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
              {message}
            </p>
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
                {cancelText}
              </Button>
              <Button
                type="button"
                onClick={handleConfirm}
                disabled={isSubmitting}
                className={`${styles.buttonColor} text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50`}
              >
                {isSubmitting ? "Processing..." : confirmText}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 
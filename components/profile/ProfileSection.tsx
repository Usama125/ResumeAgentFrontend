"use client"

import { useState } from "react"
import { Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/context/ThemeContext"
import ConfirmationModal from "@/components/ConfirmationModal"

interface ProfileSectionProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  isEditMode?: boolean
  onEdit?: () => void
  onDelete?: () => void
  className?: string
}

export default function ProfileSection({
  title,
  icon,
  children,
  isEditMode = false,
  onEdit,
  onDelete,
  className = ""
}: ProfileSectionProps) {
  const { isDark } = useTheme()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleDeleteClick = () => {
    if (onDelete) {
      setShowDeleteConfirm(true)
    }
  }

  const handleConfirmDelete = async () => {
    if (onDelete) {
      await onDelete()
      setShowDeleteConfirm(false)
    }
  }

  return (
    <>
      <div className={`${isDark ? 'bg-gradient-to-br from-[#1a1a1a]/80 to-[#2a2a2a]/60' : 'bg-white/80'} backdrop-blur-sm rounded-2xl p-6 border ${isDark ? 'border-[#10a37f]/20' : 'border-gray-200'} ${isEditMode ? 'ring-2 ring-[#10a37f]/30' : ''} transition-all duration-300 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} flex items-center`}>
            {icon}
            <span className="ml-2">{title}</span>
          </h2>
          
          {isEditMode && (onEdit || onDelete) && (
            <div className="flex items-center gap-2">
              {onDelete && (
                <Button
                  onClick={handleDeleteClick}
                  size="sm"
                  variant="ghost"
                  className="text-red-500 hover:text-red-600 hover:bg-red-500/10 p-2"
                  title="Delete this section"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
              {onEdit && (
                <Button
                  onClick={onEdit}
                  size="sm"
                  variant="ghost"
                  className="text-[#10a37f] hover:text-[#0d8f6f] hover:bg-[#10a37f]/10 p-2"
                  title="Edit this section"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
        </div>
        
        <div className={`${isEditMode ? 'bg-[#10a37f]/5 border-[#10a37f]/20 border rounded-lg p-4' : ''}`}>
          {children}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Section"
        message={`Are you sure you want to delete the "${title}" section? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </>
  )
} 
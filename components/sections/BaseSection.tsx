"use client"

import { useState, ReactNode, memo } from "react"
import { ChevronDown, ChevronUp, Edit, Trash2, GripVertical, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/context/ThemeContext"
import ConfirmationModal from "@/components/ConfirmationModal"

interface BaseSectionProps {
  id: string
  title: string
  icon: ReactNode
  children: ReactNode
  isEditMode?: boolean
  isCollapsible?: boolean
  isExpanded?: boolean
  onEdit?: () => void
  onDelete?: () => void
  onToggleExpand?: () => void
  onAdd?: () => void
  className?: string
  showDragHandle?: boolean
  dragHandleProps?: any
  hideEditIconsOnMobile?: boolean
}

const BaseSection = memo(function BaseSection({
  id,
  title,
  icon,
  children,
  isEditMode = false,
  isCollapsible = false,
  isExpanded = true,
  onEdit,
  onDelete,
  onToggleExpand,
  onAdd,
  className = "",
  showDragHandle = false,
  dragHandleProps = {},
  hideEditIconsOnMobile = false
}: BaseSectionProps) {
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

  const headerContent = (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {showDragHandle && isEditMode && (
          <div
            {...dragHandleProps}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100/10 rounded flex-shrink-0"
          >
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>
        )}
        
        <div className="text-[#10a37f] flex-shrink-0">
          {icon}
        </div>
        
        <h2 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} flex-1 min-w-0 truncate`}>
          {title}
        </h2>
      </div>
      
      <div className="flex items-center gap-2 flex-shrink-0">
        {isEditMode && (onEdit || onDelete || onAdd) && (
          <>
            {onDelete && (
              <Button
                onClick={handleDeleteClick}
                size="sm"
                variant="ghost"
                className={`text-red-500 hover:text-red-600 hover:bg-red-500/10 p-2 ${hideEditIconsOnMobile ? 'hidden sm:flex' : ''}`}
                title="Delete this section"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
            {onAdd && (
              <Button
                onClick={onAdd}
                size="sm"
                variant="ghost"
                className={`text-[#10a37f] hover:text-[#0d8f6f] hover:bg-[#10a37f]/10 p-2 ${hideEditIconsOnMobile ? 'hidden sm:flex' : ''}`}
                title="Add new item"
              >
                <Plus className="w-4 h-4" />
              </Button>
            )}
            {onEdit && (
              <Button
                onClick={onEdit}
                size="sm"
                variant="ghost"
                className={`text-[#10a37f] hover:text-[#0d8f6f] hover:bg-[#10a37f]/10 p-2 ${hideEditIconsOnMobile ? 'hidden sm:flex' : ''}`}
                title="Edit this section"
              >
                <Edit className="w-4 h-4" />
              </Button>
            )}
          </>
        )}
        
        {isCollapsible && (
          <Button
            onClick={onToggleExpand}
            size="sm"
            variant="ghost"
            className={`p-2 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            title={isExpanded ? "Collapse section" : "Expand section"}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        )}
      </div>
    </div>
  )

  return (
    <>
      <div className={`${isDark ? 'bg-gradient-to-br from-[#1a1a1a]/80 to-[#2a2a2a]/60' : 'bg-white/80'} backdrop-blur-sm rounded-2xl border ${isDark ? 'border-[#10a37f]/20' : 'border-gray-200'} transition-all duration-300 ${className}`}>
        {isCollapsible ? (
          <div>
            <div 
              className={`p-6 cursor-pointer hover:bg-black/5 transition-colors rounded-t-2xl ${!isExpanded ? 'rounded-b-2xl' : ''}`}
              onClick={onToggleExpand}
            >
              {headerContent}
            </div>
            
            {isExpanded && (
              <div className="px-6 pb-6">
                <div className={`${isEditMode ? 'bg-[#10a37f]/5 border-[#10a37f]/20 border rounded-lg p-4' : ''}`}>
                  {children}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6">
            <div className="mb-4">
              {headerContent}
            </div>
            
            <div className={`${isEditMode ? 'bg-[#10a37f]/5 border-[#10a37f]/20 border rounded-lg p-4' : ''}`}>
              {children}
            </div>
          </div>
        )}
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
})

export default BaseSection
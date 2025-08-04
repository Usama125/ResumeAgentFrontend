"use client"

import { useState } from "react"
import { Edit, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/context/ThemeContext"

interface EditModeToggleProps {
  isEditMode: boolean
  onToggle: (mode: boolean) => void
  className?: string
}

export default function EditModeToggle({ 
  isEditMode, 
  onToggle, 
  className = "" 
}: EditModeToggleProps) {
  const { isDark } = useTheme()

  return (
    <div className={`relative group ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
      <Button
        onClick={() => onToggle(!isEditMode)}
        size="sm"
        className={`relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 backdrop-blur-sm border h-auto ${
          isDark 
            ? 'bg-[#2f2f2f]/90 border-[#565869]/60 text-white hover:bg-[#40414f]/90 hover:border-[#10a37f]/40' 
            : 'bg-white/90 border-gray-300 text-gray-900 hover:bg-gray-50 hover:border-[#10a37f]/40'
        } shadow-lg hover:shadow-xl hover:scale-105`}
        title={isEditMode ? "Switch to View Mode" : "Switch to Edit Mode"}
      >
        {isEditMode ? (
          <>
            <Eye className="w-4 h-4 text-[#10a37f]" />
            <span className="text-sm font-medium">View Mode</span>
          </>
        ) : (
          <>
            <Edit className="w-4 h-4 text-[#10a37f]" />
            <span className="text-sm font-medium">Edit Mode</span>
          </>
        )}
      </Button>
    </div>
  )
} 
"use client"

import { ReactNode } from "react"
import { GripVertical } from "lucide-react"
import { useTheme } from "@/context/ThemeContext"
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface DraggableSectionProps {
  id: string
  children: ReactNode
  isEditMode: boolean
  className?: string
}

export default function DraggableSection({ 
  id, 
  children, 
  isEditMode, 
  className = "" 
}: DraggableSectionProps) {
  const { isDark } = useTheme()

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  if (!isEditMode) {
    return <div className={className}>{children}</div>
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${className} ${isDragging ? 'opacity-50' : ''}`}
    >
      <div className="flex items-start gap-3">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-2 hover:bg-gray-100/10 rounded mt-1"
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  )
} 
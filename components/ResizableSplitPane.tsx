"use client"

import { useState, useRef, useCallback, useEffect } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { Grip } from 'lucide-react'

interface ResizableSplitPaneProps {
  children: [React.ReactNode, React.ReactNode]
  defaultLeftWidth?: number
  minLeftWidth?: number
  maxLeftWidth?: number
  isVisible?: boolean
  className?: string
  onResize?: (leftWidth: number, rightWidth: number) => void
}

export default function ResizableSplitPane({
  children,
  defaultLeftWidth = 50,
  minLeftWidth = 30,
  maxLeftWidth = 70,
  isVisible = true,
  className = "",
  onResize
}: ResizableSplitPaneProps) {
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { isDark } = useTheme()

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return

    const container = containerRef.current
    const containerRect = container.getBoundingClientRect()
    const containerWidth = containerRect.width
    
    // Calculate mouse position relative to container
    const mouseX = e.clientX - containerRect.left
    const newLeftPercentage = (mouseX / containerWidth) * 100
    
    // Apply constraints
    const constrainedPercentage = Math.min(Math.max(newLeftPercentage, minLeftWidth), maxLeftWidth)
    
    setLeftWidth(constrainedPercentage)
    
    // Call onResize callback if provided
    if (onResize) {
      onResize(constrainedPercentage, 100 - constrainedPercentage)
    }
  }, [isDragging, minLeftWidth, maxLeftWidth, onResize])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Add/remove global mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    } else {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  // If not visible, show only the left pane (full width)
  if (!isVisible) {
    return (
      <div className={`flex h-full ${className}`} ref={containerRef}>
        <div className="w-full h-full">
          {children[0]}
        </div>
      </div>
    )
  }

  return (
    <div className={`flex h-full relative ${className}`} ref={containerRef}>
      {/* Left Pane */}
      <div 
        className={`h-full overflow-hidden ${isDragging ? '' : 'transition-all duration-300 ease-in-out'}`}
        style={{ width: `${leftWidth}%` }}
      >
        {children[0]}
      </div>

      {/* Resizer */}
      <div 
        className={`relative w-1 flex-shrink-0 cursor-col-resize group ${
          isDark ? 'bg-[#565869]/30' : 'bg-gray-300'
        } hover:bg-[#10a37f]/50 transition-all duration-200 ${
          isDragging ? 'bg-[#10a37f]' : ''
        }`}
        onMouseDown={handleMouseDown}
      >
        {/* Clear Drag Handle Button */}
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10
          w-8 h-10 flex items-center justify-center rounded-lg
          ${isDark 
            ? 'bg-gradient-to-br from-[#40414f] to-[#2a2a2a] border border-[#565869] text-gray-300 hover:from-[#565869] hover:to-[#40414f] hover:text-white' 
            : 'bg-gradient-to-br from-white to-gray-50 border border-gray-300 text-gray-600 hover:from-gray-50 hover:to-gray-100 hover:text-gray-800'
          }
          shadow-lg hover:shadow-xl transition-all duration-200
          ${isDragging ? 'bg-gradient-to-br from-[#10a37f] to-[#0d8f6f] text-white border-[#10a37f] scale-105' : ''}
        `}>
          <Grip className="w-4 h-4" />
        </div>

        {/* Active Resize Indicator */}
        {isDragging && (
          <div className="absolute inset-0 bg-[#10a37f]/20 animate-pulse" />
        )}
      </div>

      {/* Right Pane */}
      <div 
        className={`h-full overflow-hidden ${isDragging ? '' : 'transition-all duration-300 ease-in-out'}`}
        style={{ width: `${100 - leftWidth}%` }}
      >
        {children[1]}
      </div>
    </div>
  )
}
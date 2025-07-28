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
        className={`relative flex-shrink-0 cursor-col-resize group transition-all duration-200 ${
          isDragging ? 'w-1' : 'w-px'
        } ${
          isDark 
            ? isDragging 
              ? 'bg-[#10a37f]/80' 
              : 'bg-gray-700/30 hover:bg-[#10a37f]/40'
            : isDragging 
              ? 'bg-[#10a37f]/80' 
              : 'bg-gray-300/50 hover:bg-[#10a37f]/40'
        }`}
        onMouseDown={handleMouseDown}
      >
        {/* Wider hover area for easier grabbing */}
        <div className="absolute inset-y-0 -left-2 -right-2 cursor-col-resize" />
        
        {/* Drag Handle - always visible but subtle */}
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20
          w-5 h-12 flex items-center justify-center rounded-full transition-all duration-200
          ${isDark 
            ? isDragging
              ? 'bg-[#10a37f] text-white shadow-lg scale-110'
              : 'bg-gray-800/60 text-gray-400 hover:bg-gray-700/80 hover:text-gray-300 group-hover:bg-gray-700/90'
            : isDragging
              ? 'bg-[#10a37f] text-white shadow-lg scale-110'
              : 'bg-white/60 text-gray-500 hover:bg-gray-50/80 hover:text-gray-600 group-hover:bg-white/90'
          }
          backdrop-blur-sm border ${
            isDark 
              ? isDragging 
                ? 'border-[#10a37f]/50' 
                : 'border-gray-600/30 group-hover:border-gray-500/50'
              : isDragging 
                ? 'border-[#10a37f]/50' 
                : 'border-gray-200/50 group-hover:border-gray-300/70'
          }
        `}>
          <Grip className="w-2.5 h-2.5" />
        </div>
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
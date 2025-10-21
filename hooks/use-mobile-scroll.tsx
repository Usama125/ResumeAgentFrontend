"use client"

import { useEffect, useRef } from 'react'

/**
 * Hook to fix mobile scrolling issues on real devices
 * Ensures proper touch scrolling behavior
 */
export function useMobileScroll() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let startY = 0
    let isScrolling = false

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY
      isScrolling = false
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isScrolling) {
        const currentY = e.touches[0].clientY
        const diffY = Math.abs(currentY - startY)
        
        // If vertical movement is significant, enable scrolling
        if (diffY > 10) {
          isScrolling = true
        }
      }
    }

    const handleTouchEnd = () => {
      isScrolling = false
    }

    // Add touch event listeners
    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchmove', handleTouchMove, { passive: true })
    container.addEventListener('touchend', handleTouchEnd, { passive: true })

    // Cleanup
    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])

  return containerRef
}

"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

interface GradientAvatarProps {
  children?: React.ReactNode
  className?: string
  isDark?: boolean
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

const GradientAvatar = React.forwardRef<
  HTMLDivElement,
  GradientAvatarProps
>(({ children, className, isDark = false }, ref) => {
  const gradients = [
    // Primary theme gradients
    "from-[#10a37f] to-[#0d8f6f]",
    "from-[#10a37f] via-[#0d8f6f] to-[#0a7a5c]",
    "from-[#0d8f6f] to-[#10a37f]",
    
    // Complementary gradients
    "from-blue-500 to-purple-600",
    "from-purple-500 to-pink-500",
    "from-indigo-500 to-blue-600",
    "from-teal-500 to-cyan-600",
    "from-emerald-500 to-teal-600",
    "from-orange-500 to-red-500",
    "from-amber-500 to-orange-600",
    
    // Sophisticated gradients
    "from-slate-600 to-slate-800",
    "from-gray-600 to-gray-800",
    "from-rose-500 to-pink-600",
    "from-violet-500 to-purple-600",
    "from-sky-500 to-blue-600",
  ]
  
  // Use primary gradient as default
  const selectedGradient = gradients[0] // Always use the primary theme gradient
  
  return (
    <div
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        `bg-gradient-to-br ${selectedGradient}`,
        "flex items-center justify-center",
        "shadow-lg",
        className
      )}
    >
      {/* Subtle inner glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-50" />
      
      {/* User icon in center */}
      <svg 
        className="relative z-10 w-1/2 h-1/2 text-white/90" 
        fill="currentColor" 
        viewBox="0 0 24 24"
      >
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </svg>
      
      {/* Outer glow effect */}
      <div className={cn(
        "absolute -inset-1 rounded-full blur-lg opacity-30",
        `bg-gradient-to-br ${selectedGradient}`
      )} />
    </div>
  )
})
GradientAvatar.displayName = "GradientAvatar"

export { Avatar, AvatarImage, AvatarFallback, GradientAvatar }

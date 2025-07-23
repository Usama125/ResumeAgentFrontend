"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "@/context/ThemeContext"

// This page redirects to the new profile page for backward compatibility
export default function CurrentUserProfileRedirect() {
  const router = useRouter()
  const { isDark } = useTheme()

  useEffect(() => {
    // Redirect to the new profile route
    router.replace("/profile")
  }, [router])

  return (
    <div className="loading-screen">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-8 h-8 border-2 border-[#10a37f]/30 border-t-[#10a37f] rounded-full animate-spin"></div>
        <p className="loading-text">Redirecting to your profile...</p>
      </div>
    </div>
  )
}
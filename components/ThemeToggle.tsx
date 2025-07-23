"use client"

import { Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme, isDark } = useTheme()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className={`p-2 transition-all duration-300 ${
        isDark 
          ? 'text-gray-300 hover:text-white hover:bg-[#10a37f]/20 border border-transparent hover:border-[#10a37f]/30' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-[#10a37f]/10 border border-transparent hover:border-[#10a37f]/20'
      }`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </Button>
  )
}
"use client"

import { useTheme } from "@/context/ThemeContext"
import { useRouter } from "next/navigation"

export default function Footer() {
  const { isDark } = useTheme()
  const router = useRouter()

  return (
    <footer className={`py-6 border-t ${isDark ? 'border-[#565869]/30' : 'border-gray-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            © 2024 CVChatter. All rights reserved.
          </div>
          
          {/* Legal Links */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => router.push("/contact")}
              className={`text-sm transition-colors duration-200 hover:text-[#10a37f] ${
                isDark ? 'text-gray-400 hover:text-[#10a37f]' : 'text-gray-500 hover:text-[#10a37f]'
              }`}
            >
              Contact Us
            </button>
            <button
              onClick={() => router.push("/terms")}
              className={`text-sm transition-colors duration-200 hover:text-[#10a37f] ${
                isDark ? 'text-gray-400 hover:text-[#10a37f]' : 'text-gray-500 hover:text-[#10a37f]'
              }`}
            >
              Terms & Conditions
            </button>
            <button
              onClick={() => router.push("/privacy")}
              className={`text-sm transition-colors duration-200 hover:text-[#10a37f] ${
                isDark ? 'text-gray-400 hover:text-[#10a37f]' : 'text-gray-500 hover:text-[#10a37f]'
              }`}
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

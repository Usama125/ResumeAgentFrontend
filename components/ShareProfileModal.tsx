"use client"

import { useState } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { getThemeClasses } from '@/utils/theme'
import { User } from '@/types'
import { Button } from "@/components/ui/button"
import {
  X,
  Copy,
  Check,
  Share2,
  Mail,
  Phone,
  MessageCircle,
} from "lucide-react"

interface ShareProfileModalProps {
  isOpen: boolean
  onClose: () => void
  user: User
}

export default function ShareProfileModal({
  isOpen,
  onClose,
  user
}: ShareProfileModalProps) {
  const { isDark } = useTheme()
  const theme = getThemeClasses(isDark)
  const [copied, setCopied] = useState(false)

  const profileUrl = `https://www.cvchatter.com/profile/${user.username}`

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy URL:', error)
    }
  }

  const handleSocialShare = (platform: string) => {
    const text = `Check out ${user.name}'s professional profile: ${profileUrl}`
    const encodedText = encodeURIComponent(text)
    const encodedUrl = encodeURIComponent(profileUrl)

    let shareUrl = ''
    
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedText}`
        break
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(`Check out ${user.name}'s professional profile`)}`
        break
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        break
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(`${user.name}'s Professional Profile`)}&body=${encodedText}`
        break
      case 'sms':
        shareUrl = `sms:?body=${encodedText}`
        break
      default:
        return
    }

    window.open(shareUrl, '_blank', 'width=600,height=400')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div 
        className={`relative w-full max-w-md flex flex-col border-0 rounded-3xl shadow-2xl overflow-hidden`}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 50
        }}
      >
        {/* Enhanced Background */}
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a]' : 'bg-gradient-to-br from-white via-gray-50 to-white'} rounded-3xl`}></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#10a37f]/20 via-transparent to-[#10a37f]/10 rounded-3xl"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-[#10a37f]/30 to-[#0d8f6f]/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-[#10a37f]/20 to-[#0d8f6f]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Content wrapper */}
        <div className="relative z-10 w-full h-full flex flex-col rounded-3xl overflow-hidden">
          {/* Enhanced Header */}
          <div className={`shrink-0 p-6 border-b ${isDark ? 'border-[#10a37f]/20 bg-[#1a1a1a]/80' : 'border-gray-200 bg-white/80'} backdrop-blur-sm`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-xl blur opacity-30"></div>
                  <div className={`relative p-2 rounded-xl ${isDark ? 'bg-[#2a2a2a]' : 'bg-white'} border border-[#10a37f]/30`}>
                    <Share2 className="w-6 h-6 text-[#10a37f]" />
                  </div>
                </div>
                <div>
                  <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Share Profile
                  </h2>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Share {user.name}'s professional profile
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-xl transition-all duration-300 ${
                  isDark 
                    ? 'text-gray-400 hover:text-white hover:bg-[#2a2a2a]' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            {/* Profile URL Section */}
            <div className="mb-6">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>
                Profile URL
              </h3>
              <div className="relative">
                <input
                  type="text"
                  value={profileUrl}
                  readOnly
                  className={`w-full px-4 py-3 pr-12 rounded-xl border transition-all duration-300 ${
                    isDark 
                      ? 'bg-[#2a2a2a]/80 border-[#565869]/60 text-gray-300 placeholder-gray-500' 
                      : 'bg-gray-100/80 border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:border-[#10a37f]/50 focus:outline-none focus:ring-2 focus:ring-[#10a37f]/20`}
                  placeholder="Profile URL"
                />
                <button
                  onClick={handleCopyUrl}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-all duration-300 ${
                    copied
                      ? 'bg-green-500/20 text-green-500'
                      : isDark
                      ? 'bg-[#1a1a1a] hover:bg-[#10a37f]/20 text-gray-400 hover:text-[#10a37f]'
                      : 'bg-white hover:bg-[#10a37f]/10 text-gray-500 hover:text-[#10a37f]'
                  }`}
                  title={copied ? "Copied!" : "Copy URL"}
                >
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              {copied && (
                <p className="text-green-500 text-sm mt-2 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  URL copied to clipboard!
                </p>
              )}
            </div>

            {/* Social Media Sharing */}
            <div>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
                Share via Social Media
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {/* WhatsApp */}
                <button
                  onClick={() => handleSocialShare('whatsapp')}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    isDark 
                      ? 'bg-[#2a2a2a]/80 border border-[#565869]/60 text-white hover:bg-green-500/20 hover:border-green-500/40' 
                      : 'bg-gray-100/80 border border-gray-300 text-gray-900 hover:bg-green-500/10 hover:border-green-500/30'
                  } hover:scale-105`}
                  title="Share on WhatsApp"
                >
                  <svg className="w-6 h-6 mx-auto text-green-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                </button>

                {/* Telegram */}
                <button
                  onClick={() => handleSocialShare('telegram')}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    isDark 
                      ? 'bg-[#2a2a2a]/80 border border-[#565869]/60 text-white hover:bg-blue-500/20 hover:border-blue-500/40' 
                      : 'bg-gray-100/80 border border-gray-300 text-gray-900 hover:bg-blue-500/10 hover:border-blue-500/30'
                  } hover:scale-105`}
                  title="Share on Telegram"
                >
                  <svg className="w-6 h-6 mx-auto text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </button>

                {/* Twitter */}
                <button
                  onClick={() => handleSocialShare('twitter')}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    isDark 
                      ? 'bg-[#2a2a2a]/80 border border-[#565869]/60 text-white hover:bg-blue-400/20 hover:border-blue-400/40' 
                      : 'bg-gray-100/80 border border-gray-300 text-gray-900 hover:bg-blue-400/10 hover:border-blue-400/30'
                  } hover:scale-105`}
                  title="Share on Twitter"
                >
                  <svg className="w-6 h-6 mx-auto text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </button>

                {/* LinkedIn */}
                <button
                  onClick={() => handleSocialShare('linkedin')}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    isDark 
                      ? 'bg-[#2a2a2a]/80 border border-[#565869]/60 text-white hover:bg-blue-600/20 hover:border-blue-600/40' 
                      : 'bg-gray-100/80 border border-gray-300 text-gray-900 hover:bg-blue-600/10 hover:border-blue-600/30'
                  } hover:scale-105`}
                  title="Share on LinkedIn"
                >
                  <svg className="w-6 h-6 mx-auto text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </button>

                {/* Facebook */}
                <button
                  onClick={() => handleSocialShare('facebook')}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    isDark 
                      ? 'bg-[#2a2a2a]/80 border border-[#565869]/60 text-white hover:bg-blue-700/20 hover:border-blue-700/40' 
                      : 'bg-gray-100/80 border border-gray-300 text-gray-900 hover:bg-blue-700/10 hover:border-blue-700/30'
                  } hover:scale-105`}
                  title="Share on Facebook"
                >
                  <svg className="w-6 h-6 mx-auto text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>

                {/* Email */}
                <button
                  onClick={() => handleSocialShare('email')}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    isDark 
                      ? 'bg-[#2a2a2a]/80 border border-[#565869]/60 text-white hover:bg-gray-500/20 hover:border-gray-500/40' 
                      : 'bg-gray-100/80 border border-gray-300 text-gray-900 hover:bg-gray-500/10 hover:border-gray-500/30'
                  } hover:scale-105`}
                  title="Share via Email"
                >
                  <Mail className="w-6 h-6 mx-auto text-gray-500" />
                </button>

                {/* SMS */}
                <button
                  onClick={() => handleSocialShare('sms')}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    isDark 
                      ? 'bg-[#2a2a2a]/80 border border-[#565869]/60 text-white hover:bg-green-600/20 hover:border-green-600/40' 
                      : 'bg-gray-100/80 border border-gray-300 text-gray-900 hover:bg-green-600/10 hover:border-green-600/30'
                  } hover:scale-105`}
                  title="Share via SMS"
                >
                  <MessageCircle className="w-6 h-6 mx-auto text-green-600" />
                </button>

                {/* Copy Link */}
                <button
                  onClick={handleCopyUrl}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    copied
                      ? 'bg-green-500/20 border-green-500/40 text-green-500'
                      : isDark 
                      ? 'bg-[#2a2a2a]/80 border border-[#565869]/60 text-white hover:bg-[#10a37f]/20 hover:border-[#10a37f]/40' 
                      : 'bg-gray-100/80 border border-gray-300 text-gray-900 hover:bg-[#10a37f]/10 hover:border-[#10a37f]/30'
                  } hover:scale-105`}
                  title={copied ? "Copied!" : "Copy Link"}
                >
                  {copied ? (
                    <Check className="w-6 h-6 mx-auto" />
                  ) : (
                    <Copy className="w-6 h-6 mx-auto text-[#10a37f]" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className={`shrink-0 p-6 border-t ${isDark ? 'border-[#10a37f]/20 bg-[#1a1a1a]/80' : 'border-gray-200 bg-white/80'} backdrop-blur-sm`}>
            <div className="flex justify-end">
              <Button
                onClick={onClose}
                className="bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#0a7a5f] text-white px-6 py-2 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

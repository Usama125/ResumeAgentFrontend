"use client"

import { useState, useEffect } from "react"
import { useTheme } from "@/context/ThemeContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Cookie, Settings, CheckCircle, AlertCircle } from "lucide-react"

interface CookiesAlertProps {
  onAccept?: () => void
  onDecline?: () => void
  onCustomize?: () => void
}

export default function CookiesAlert({ onAccept, onDecline, onCustomize }: CookiesAlertProps) {
  const { isDark } = useTheme()
  const [isVisible, setIsVisible] = useState(false)
  const [isCustomizing, setIsCustomizing] = useState(false)
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
    functional: false
  })

  useEffect(() => {
    // Check if user has already made a choice
    const cookieChoice = localStorage.getItem('cvchatter-cookie-consent')
    if (!cookieChoice) {
      setIsVisible(true)
    }
  }, [])

  const handleAcceptAll = () => {
    const preferences = {
      essential: true,
      analytics: true,
      marketing: true,
      functional: true,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem('cvchatter-cookie-consent', JSON.stringify(preferences))
    setIsVisible(false)
    onAccept?.()
  }

  const handleDeclineAll = () => {
    const preferences = {
      essential: true,
      analytics: false,
      marketing: false,
      functional: false,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem('cvchatter-cookie-consent', JSON.stringify(preferences))
    setIsVisible(false)
    onDecline?.()
  }

  const handleSavePreferences = () => {
    const preferences = {
      ...cookiePreferences,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem('cvchatter-cookie-consent', JSON.stringify(preferences))
    setIsVisible(false)
    setIsCustomizing(false)
    onCustomize?.()
  }

  const handleCustomize = () => {
    setIsCustomizing(true)
  }

  const handleBack = () => {
    setIsCustomizing(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className={`max-w-4xl mx-auto shadow-2xl border-2 ${
        isDark 
          ? 'bg-[#2f2f2f] border-[#565869]' 
          : 'bg-white border-gray-200'
      }`}>
        <CardContent className="p-6">
          {!isCustomizing ? (
            // Main cookies alert
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
              <div className="flex items-start space-x-3 flex-1">
                <div className="w-10 h-10 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Cookie className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    We use cookies to enhance your experience
                  </h3>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    We use essential cookies to make our site work. We'd also like to set analytics cookies to help us improve it. 
                    <a 
                      href="/privacy" 
                      className={`underline hover:no-underline ${isDark ? 'text-[#10a37f] hover:text-[#0d8f6f]' : 'text-[#10a37f] hover:text-[#0a7a5f]'}`}
                    >
                      Learn more in our Privacy Policy
                    </a>
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <Button
                  variant="outline"
                  onClick={handleCustomize}
                  className={`flex items-center space-x-2 ${
                    isDark 
                      ? 'border-[#565869] text-gray-300 hover:text-white hover:bg-[#10a37f]/10 hover:border-[#10a37f]' 
                      : 'border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-[#10a37f]/10 hover:border-[#10a37f]'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>Customize</span>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleDeclineAll}
                  className={`flex items-center space-x-2 ${
                    isDark 
                      ? 'border-[#565869] text-gray-300 hover:text-white hover:bg-gray-600' 
                      : 'border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <X className="w-4 h-4" />
                  <span>Decline All</span>
                </Button>
                
                <Button
                  onClick={handleAcceptAll}
                  className="bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#0a7a5f] text-white flex items-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Accept All</span>
                </Button>
              </div>
            </div>
          ) : (
            // Cookie customization panel
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Cookie Preferences
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {/* Essential Cookies */}
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#1a1a1a] border-[#565869]' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Essential Cookies
                    </h4>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-600 font-medium">Always Active</span>
                    </div>
                  </div>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    These cookies are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you.
                  </p>
                </div>

                {/* Analytics Cookies */}
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#1a1a1a] border-[#565869]' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Analytics Cookies
                    </h4>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cookiePreferences.analytics}
                        onChange={(e) => setCookiePreferences(prev => ({ ...prev, analytics: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#10a37f]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10a37f]"></div>
                    </label>
                  </div>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                  </p>
                </div>

                {/* Marketing Cookies */}
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#1a1a1a] border-[#565869]' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Marketing Cookies
                    </h4>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cookiePreferences.marketing}
                        onChange={(e) => setCookiePreferences(prev => ({ ...prev, marketing: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#10a37f]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10a37f]"></div>
                    </label>
                  </div>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    These cookies are used to track visitors across websites to display relevant and engaging advertisements.
                  </p>
                </div>

                {/* Functional Cookies */}
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#1a1a1a] border-[#565869]' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Functional Cookies
                    </h4>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cookiePreferences.functional}
                        onChange={(e) => setCookiePreferences(prev => ({ ...prev, functional: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#10a37f]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10a37f]"></div>
                    </label>
                  </div>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    These cookies enable enhanced functionality and personalization, such as remembering your preferences.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={handleDeclineAll}
                  className={`flex items-center space-x-2 ${
                    isDark 
                      ? 'border-[#565869] text-gray-300 hover:text-white hover:bg-gray-600' 
                      : 'border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <X className="w-4 h-4" />
                  <span>Decline All</span>
                </Button>
                
                <Button
                  onClick={handleSavePreferences}
                  className="bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#0a7a5f] text-white flex items-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Save Preferences</span>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


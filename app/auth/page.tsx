"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Mail, Lock, User, AlertCircle, AtSign } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { useErrorHandler } from "@/utils/errorHandler"
import { useTheme } from "@/context/ThemeContext"
import { ArrowLeft } from "lucide-react"
import ThemeToggle from "@/components/ThemeToggle"
import { getThemeClasses } from "@/utils/theme"
import { LoginRequest, RegisterRequest } from "@/types"
import GoogleSignInButton from "@/components/GoogleSignInButton"

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    username: "",
  })
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [usernameCheck, setUsernameCheck] = useState<{
    checking: boolean;
    available: boolean | null;
    message: string;
  }>({ checking: false, available: null, message: "" })
  
  const router = useRouter()
  const { login, register, loading, error, isAuthenticated, user, clearError } = useAuth()
  const { formatError } = useErrorHandler()
  const { isDark } = useTheme()
  const theme = getThemeClasses(isDark)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      if (!user.onboarding_completed) {
        router.push("/onboarding")
      } else {
        router.push("/profile")
      }
    }
  }, [isAuthenticated, user, router])

  // Clear error when switching between forms
  useEffect(() => {
    clearError()
    setValidationErrors({})
    setUsernameCheck({ checking: false, available: null, message: "" })
  }, [isSignUp]) // Remove clearError dependency to prevent over-clearing

  // Debounced username validation
  useEffect(() => {
    if (!isSignUp || !formData.username || formData.username.length < 3) {
      setUsernameCheck({ checking: false, available: null, message: "" })
      return
    }

    const timeoutId = setTimeout(async () => {
      setUsernameCheck({ checking: true, available: null, message: "Checking..." })
      
      try {
        const response = await fetch('/api/auth/validate-username', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: formData.username })
        })
        
        const data = await response.json()
        
        setUsernameCheck({
          checking: false,
          available: data.available && data.valid,
          message: data.message
        })
      } catch (error) {
        setUsernameCheck({
          checking: false,
          available: false,
          message: "Error checking username availability"
        })
      }
    }, 500) // 500ms debounce

    return () => clearTimeout(timeoutId)
  }, [formData.username, isSignUp])

  // Form validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.email) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address"
    }

    if (!formData.password) {
      errors.password = "Password is required"
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters long"
    }

    if (isSignUp && !formData.name) {
      errors.name = "Full name is required"
    }

    if (isSignUp && !formData.username) {
      errors.username = "Username is required"
    } else if (isSignUp && formData.username.length < 3) {
      errors.username = "Username must be at least 3 characters"
    } else if (isSignUp && !usernameCheck.available && formData.username.length >= 3) {
      errors.username = usernameCheck.message || "Username is not available"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      if (isSignUp) {
        const registerData: RegisterRequest = {
          email: formData.email,
          password: formData.password,
          name: formData.name,
          username: formData.username,
        }
        await register(registerData)
        // Always redirect new users to onboarding
        router.push("/onboarding")
      } else {
        const loginData: LoginRequest = {
          email: formData.email,
          password: formData.password,
        }
        await login(loginData)
        // AuthContext will handle redirect based on onboarding status
        // This will be handled in AuthContext after login
      }
    } catch (err) {
      // Error is handled by AuthContext and displayed below
      console.error("Authentication error:", err)
    }
  }

  // Google authentication is now handled by GoogleSignInButton component

  return (
    <div className={`min-h-screen ${theme.bg.primary} ${theme.text.primary} relative overflow-hidden transition-colors duration-300`}>
      {/* Background gradients */}
      <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-[#1a1a1a] via-[#212121] to-[#1a1a1a]' : 'bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100'}`}></div>
      <div className="absolute inset-0 bg-gradient-to-br from-[#10a37f]/10 via-transparent to-[#10a37f]/5"></div>
      
      {/* Decorative floating elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-[#10a37f]/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-[#0d8f6f]/15 rounded-full blur-2xl"></div>
      <div className="absolute bottom-20 left-20 w-40 h-40 bg-[#10a37f]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-40 right-10 w-28 h-28 bg-[#10a37f]/15 rounded-full blur-xl"></div>
      
      
      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">

          <div className="relative">
            {/* Card glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-3xl blur opacity-20"></div>
            
            <Card className={`relative ${theme.bg.card} backdrop-blur-sm ${theme.border.secondary} rounded-3xl overflow-hidden transition-colors duration-300`}>
              {/* Card header gradient */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#10a37f]/50 to-transparent"></div>
              <CardHeader className="text-center relative pt-8 pb-6">
                {/* Top-right controls */}
                <div className="absolute top-4 right-4 flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`p-2 rounded-xl transition-all duration-300 ${isDark ? 'text-gray-300 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-transparent hover:border-gray-200'}`}
                    onClick={() => router.push("/")}
                    title="Back to Home"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <div className={`rounded-xl ${isDark ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'}`}>
                    <ThemeToggle />
                  </div>
                </div>
                <div className="mb-4">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-[#10a37f]/20 text-[#10a37f] border border-[#10a37f]/30">
                    ✨ {isSignUp ? "Join Our Community" : "Welcome Back"}
                  </span>
                </div>
                <CardTitle className={`text-3xl font-bold mb-3 ${isDark ? 'bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent' : 'text-gray-900'}`}>
                  {isSignUp ? "Create Account" : "Sign In"}
                </CardTitle>
                <p className={`${theme.text.secondary} text-lg`}>
                  {isSignUp
                    ? "Join thousands of professionals showcasing their expertise with AI"
                    : "Access your AI-powered profile and connect with opportunities"}
                </p>
              </CardHeader>
              <CardContent className="space-y-6 px-8 pb-8">
                {/* Error Display */}
                {error && (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-4">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
                      <p className="text-red-300 text-sm">{formatError(error)}</p>
                    </div>
                  </div>
                )}
                {/* Debug log */}
                {error && console.log('🔴 AUTH ERROR DETECTED:', error)}

                <GoogleSignInButton isSignUp={isSignUp} disabled={loading} />

                <div className="relative">
                  <Separator className={`${theme.border.primary}/50`} />
                  <span className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${theme.bg.card} px-4 text-sm ${theme.text.tertiary} backdrop-blur-sm rounded-full border ${theme.border.secondary}`}>
                    or
                  </span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {isSignUp && (
                    <div>
                      <Label htmlFor="name" className={`${theme.text.primary} font-medium mb-2 block`}>
                        Full Name
                      </Label>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                          <div className="relative">
                            <User className="w-5 h-5 text-[#10a37f] drop-shadow-lg relative z-10" />
                            <div className="absolute inset-0 bg-[#10a37f] rounded-full blur-sm opacity-30 scale-150"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full blur-md opacity-20 scale-200"></div>
                          </div>
                        </div>
                        <Input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                          className={`pl-12 pr-4 py-3 ${theme.bg.input} backdrop-blur-sm ${theme.text.primary} ${theme.placeholder} focus:ring-[#10a37f] rounded-xl transition-all duration-300 ${theme.border.hover} focus:${theme.bg.input} ${
                            validationErrors.name
                              ? "border-red-500/60 focus:border-red-500"
                              : `${theme.border.secondary} focus:border-[#10a37f]`
                          }`}
                          placeholder="Enter your full name"
                        />
                      </div>
                      {validationErrors.name && (
                        <p className="text-red-400 text-sm mt-1">{validationErrors.name}</p>
                      )}
                    </div>
                  )}

                  {isSignUp && (
                    <div>
                      <Label htmlFor="username" className={`${theme.text.primary} font-medium mb-2 block`}>
                        Username
                      </Label>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                          <div className="relative">
                            <AtSign className="w-5 h-5 text-[#10a37f] drop-shadow-lg relative z-10" />
                            <div className="absolute inset-0 bg-[#10a37f] rounded-full blur-sm opacity-30 scale-150"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full blur-md opacity-20 scale-200"></div>
                          </div>
                        </div>
                        <Input
                          id="username"
                          type="text"
                          value={formData.username}
                          onChange={(e) => {
                            const value = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '')
                            setFormData((prev) => ({ ...prev, username: value }))
                          }}
                          className={`pl-12 pr-4 py-3 ${theme.bg.input} backdrop-blur-sm ${theme.text.primary} ${theme.placeholder} focus:ring-[#10a37f] rounded-xl transition-all duration-300 ${theme.border.hover} focus:${theme.bg.input} ${
                            validationErrors.username
                              ? "border-red-500/60 focus:border-red-500"
                              : usernameCheck.available === true
                              ? "border-green-500/60 focus:border-green-500"
                              : `${theme.border.secondary} focus:border-[#10a37f]`
                          }`}
                          placeholder="Choose a unique username"
                          maxLength={30}
                        />
                        {/* Username status indicator */}
                        {formData.username.length >= 3 && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            {usernameCheck.checking ? (
                              <div className="w-4 h-4 border-2 border-[#10a37f] border-t-transparent rounded-full animate-spin"></div>
                            ) : usernameCheck.available === true ? (
                              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            ) : usernameCheck.available === false ? (
                              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </div>
                            ) : null}
                          </div>
                        )}
                      </div>
                      {/* Username feedback */}
                      {formData.username.length >= 3 && (
                        <div className="mt-1">
                          {usernameCheck.checking ? (
                            <p className="text-gray-400 text-sm">Checking availability...</p>
                          ) : usernameCheck.available === true ? (
                            <p className="text-green-400 text-sm">✓ {usernameCheck.message}</p>
                          ) : usernameCheck.available === false ? (
                            <p className="text-red-400 text-sm">✗ {usernameCheck.message}</p>
                          ) : null}
                        </div>
                      )}
                      {validationErrors.username && (
                        <p className="text-red-400 text-sm mt-1">{validationErrors.username}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        3-30 characters, lowercase letters, numbers, hyphens, and underscores only
                      </p>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="email" className={`${theme.text.primary} font-medium mb-2 block`}>
                      Email
                    </Label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                        <div className="relative">
                          <Mail className="w-5 h-5 text-[#10a37f] drop-shadow-lg relative z-10" />
                          <div className="absolute inset-0 bg-[#10a37f] rounded-full blur-sm opacity-30 scale-150"></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full blur-md opacity-20 scale-200"></div>
                        </div>
                      </div>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                        className={`pl-12 pr-4 py-3 ${theme.bg.input} backdrop-blur-sm ${theme.text.primary} ${theme.placeholder} focus:ring-[#10a37f] rounded-xl transition-all duration-300 ${theme.border.hover} focus:${theme.bg.input} ${
                          validationErrors.email
                            ? "border-red-500/60 focus:border-red-500"
                            : `${theme.border.secondary} focus:border-[#10a37f]`
                        }`}
                        placeholder="Enter your email"
                      />
                    </div>
                    {validationErrors.email && (
                      <p className="text-red-400 text-sm mt-1">{validationErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="password" className={`${theme.text.primary} font-medium mb-2 block`}>
                      Password
                    </Label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                        <div className="relative">
                          <Lock className="w-5 h-5 text-[#10a37f] drop-shadow-lg relative z-10" />
                          <div className="absolute inset-0 bg-[#10a37f] rounded-full blur-sm opacity-30 scale-150"></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full blur-md opacity-20 scale-200"></div>
                        </div>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                        className={`pl-12 pr-4 py-3 ${theme.bg.input} backdrop-blur-sm ${theme.text.primary} ${theme.placeholder} focus:ring-[#10a37f] rounded-xl transition-all duration-300 ${theme.border.hover} focus:${theme.bg.input} ${
                          validationErrors.password
                            ? "border-red-500/60 focus:border-red-500"
                            : `${theme.border.secondary} focus:border-[#10a37f]`
                        }`}
                        placeholder="Enter your password"
                      />
                    </div>
                    {validationErrors.password && (
                      <p className="text-red-400 text-sm mt-1">{validationErrors.password}</p>
                    )}
                    {!isSignUp && (
                      <div className="text-right">
                        <button
                          type="button"
                          onClick={() => router.push("/auth/forgot-password")}
                          className="text-[#10a37f] hover:text-[#0d8f6f] transition-colors text-sm font-medium hover:underline"
                        >
                          Forgot password?
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="relative group pt-2">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="relative w-full bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#0a7a5f] text-white py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#10a37f]/25 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {loading 
                        ? (isSignUp ? "Creating Account..." : "Signing In...")
                        : (isSignUp ? "Create Account & Continue" : "Sign In")
                      }
                    </Button>
                  </div>
                </form>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-[#10a37f] hover:text-[#0d8f6f] transition-colors text-sm font-medium hover:underline text-center w-full"
                  >
                    {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
                  </button>
                </div>

                {isSignUp && (
                  <div className={`${isDark ? 'bg-gradient-to-r from-[#40414f]/50 to-[#40414f]/30' : 'bg-gradient-to-r from-gray-100/50 to-gray-200/30'} backdrop-blur-sm rounded-xl p-4 border ${theme.border.secondary}`}>
                    <p className={`text-sm ${theme.text.secondary} text-center`}>
                      After creating your account, you'll be guided through a simple setup process to create your AI-powered
                      profile.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

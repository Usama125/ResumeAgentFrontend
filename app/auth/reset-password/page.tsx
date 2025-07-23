"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Lock, AlertCircle, CheckCircle, ArrowLeft, Eye, EyeOff } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useErrorHandler } from "@/utils/errorHandler"
import { useTheme } from "@/context/ThemeContext"
import ThemeToggle from "@/components/ThemeToggle"
import { getThemeClasses } from "@/utils/theme"

export default function ResetPasswordPage() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  })
  const [isSuccess, setIsSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const { formatError } = useErrorHandler()
  const { isDark } = useTheme()
  const theme = getThemeClasses(isDark)

  useEffect(() => {
    const tokenParam = searchParams.get('token')
    if (!tokenParam) {
      router.push('/auth/forgot-password')
      return
    }
    setToken(tokenParam)
  }, [searchParams, router])

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.password) {
      errors.password = "Password is required"
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters long"
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm() || !token) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { publicAPI } = await import('@/lib/secure-api-client')
      await publicAPI.post('/auth/reset-password', { 
        token: token,
        new_password: formData.password 
      })
      setIsSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className={`min-h-screen ${theme.bg.primary} ${theme.text.primary} flex items-center justify-center`}>
        <div className="text-center">
          <p className={`${theme.text.secondary} mb-4`}>Invalid reset link</p>
          <Button onClick={() => router.push('/auth/forgot-password')}>
            Request New Reset Link
          </Button>
        </div>
      </div>
    )
  }

  if (isSuccess) {
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
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#10a37f]/50 to-transparent"></div>
                <CardHeader className="text-center relative pt-8 pb-6">
                  {/* Top-right controls */}
                  <div className="absolute top-4 right-4 flex items-center space-x-2">
                    <div className={`rounded-xl ${isDark ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'}`}>
                      <ThemeToggle />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <CheckCircle className="w-16 h-16 text-[#10a37f] mx-auto mb-4" />
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-[#10a37f]/20 text-[#10a37f] border border-[#10a37f]/30">
                      ✅ Password Reset Complete
                    </span>
                  </div>
                  <CardTitle className={`text-3xl font-bold mb-3 ${isDark ? 'bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent' : 'text-gray-900'}`}>
                    Success!
                  </CardTitle>
                  <p className={`${theme.text.secondary} text-lg`}>
                    Your password has been successfully reset
                  </p>
                </CardHeader>
                <CardContent className="space-y-6 px-8 pb-8">
                  <div className={`${isDark ? 'bg-gradient-to-r from-[#40414f]/50 to-[#40414f]/30' : 'bg-gradient-to-r from-gray-100/50 to-gray-200/30'} backdrop-blur-sm rounded-xl p-6 border ${theme.border.secondary}`}>
                    <div className="text-center space-y-4">
                      <p className={`${theme.text.primary} font-medium`}>
                        Your password has been updated successfully!
                      </p>
                      <div className={`${theme.text.secondary} text-sm space-y-2`}>
                        <p>• You can now sign in with your new password</p>
                        <p>• All existing sessions have been logged out for security</p>
                        <p>• You'll receive a confirmation email shortly</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <Button
                      onClick={() => router.push("/auth")}
                      className="relative w-full bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#0a7a5f] text-white py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#10a37f]/25 hover:scale-[1.02]"
                    >
                      Continue to Sign In
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

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
                    onClick={() => router.push("/auth")}
                    title="Back to Sign In"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <div className={`rounded-xl ${isDark ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'}`}>
                    <ThemeToggle />
                  </div>
                </div>
                <div className="mb-4">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-[#10a37f]/20 text-[#10a37f] border border-[#10a37f]/30">
                    🔐 Create New Password
                  </span>
                </div>
                <CardTitle className={`text-3xl font-bold mb-3 ${isDark ? 'bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent' : 'text-gray-900'}`}>
                  Reset Password
                </CardTitle>
                <p className={`${theme.text.secondary} text-lg`}>
                  Enter your new password below
                </p>
              </CardHeader>
              <CardContent className="space-y-6 px-8 pb-8">
                {/* Error Display */}
                {error && (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-4">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
                      <p className="text-red-300 text-sm">{error}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <Label htmlFor="password" className={`${theme.text.primary} font-medium mb-2 block`}>
                      New Password
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
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                        className={`pl-12 pr-12 py-3 ${theme.bg.input} backdrop-blur-sm ${theme.text.primary} ${theme.placeholder} focus:ring-[#10a37f] rounded-xl transition-all duration-300 ${theme.border.hover} focus:${theme.bg.input} ${
                          validationErrors.password
                            ? "border-red-500/60 focus:border-red-500"
                            : `${theme.border.secondary} focus:border-[#10a37f]`
                        }`}
                        placeholder="Enter your new password"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {validationErrors.password && (
                      <p className="text-red-400 text-sm mt-1">{validationErrors.password}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword" className={`${theme.text.primary} font-medium mb-2 block`}>
                      Confirm New Password
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
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                        className={`pl-12 pr-12 py-3 ${theme.bg.input} backdrop-blur-sm ${theme.text.primary} ${theme.placeholder} focus:ring-[#10a37f] rounded-xl transition-all duration-300 ${theme.border.hover} focus:${theme.bg.input} ${
                          validationErrors.confirmPassword
                            ? "border-red-500/60 focus:border-red-500"
                            : `${theme.border.secondary} focus:border-[#10a37f]`
                        }`}
                        placeholder="Confirm your new password"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {validationErrors.confirmPassword && (
                      <p className="text-red-400 text-sm mt-1">{validationErrors.confirmPassword}</p>
                    )}
                  </div>

                  <div className="relative group pt-2">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="relative w-full bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#0a7a5f] text-white py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#10a37f]/25 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {loading ? "Resetting Password..." : "Reset Password"}
                    </Button>
                  </div>
                </form>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => router.push("/auth")}
                    className="text-[#10a37f] hover:text-[#0d8f6f] transition-colors text-sm font-medium hover:underline"
                  >
                    Back to Sign In
                  </button>
                </div>

                <div className={`${isDark ? 'bg-gradient-to-r from-[#40414f]/50 to-[#40414f]/30' : 'bg-gradient-to-r from-gray-100/50 to-gray-200/30'} backdrop-blur-sm rounded-xl p-4 border ${theme.border.secondary}`}>
                  <p className={`text-sm ${theme.text.secondary} text-center`}>
                    Password must be at least 8 characters long and contain a mix of letters, numbers, and symbols for security.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
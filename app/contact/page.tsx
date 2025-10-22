"use client"

import { useState } from "react"
import { useTheme } from "@/context/ThemeContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, User, ArrowRight } from "lucide-react"
import Header from "@/components/Header"

export default function ContactPage() {
  const { isDark } = useTheme()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setSubmitStatus('success')
        setFormData({ name: "", email: "", subject: "", message: "" })
      } else {
        setSubmitStatus('error')
        console.error('Contact form error:', result.message || 'Unknown error')
      }
    } catch (error) {
      console.error('Error submitting contact form:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#212121] text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Header variant="default" showBackButton />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Get in <span className="text-[#10a37f]">Touch</span>
          </h1>
          <p className={`text-xl max-w-3xl mx-auto leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Have questions about CVChatter? Need help with your profile? I'm here to help you succeed.
          </p>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-12 mb-16">
          {/* Left Section - Profile Information (2/3 width) */}
          <div className="lg:col-span-2">
            <Card className={`${isDark ? 'bg-[#2f2f2f]/50 border-[#565869]/50' : 'bg-white border-gray-200'} shadow-lg h-full`}>
              <CardContent className="p-8 h-full flex flex-col">
                {/* Profile Header */}
                <div className="flex items-center gap-6 mb-8">
                  {/* Profile Picture */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-[#10a37f]/30 shadow-lg">
                      <img 
                        src="/Usama.png" 
                        alt="Usama Farooq" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  
                  {/* Name & Title */}
                  <div className="flex-1">
                    <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Usama Farooq
                    </h2>
                    <p className={`text-lg ${isDark ? 'text-[#10a37f]' : 'text-[#10a37f]'}`}>
                      Software Engineer & CVChatter Creator
                    </p>
                  </div>
                </div>
                
                {/* Description */}
                <div className="mb-6">
                  <p className={`text-base leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    I'm a passionate full-stack software engineer working on cutting-edge technologies. 
                    I built CVChatter to revolutionize how professionals showcase their skills and connect with opportunities. 
                    I work with modern technologies including React, Node.js, Python, and AI/ML to create innovative solutions.
                  </p>
                </div>
                
                {/* Tech Stack */}
                <div className="mb-6">
                  <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                    Technologies I Work With:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {['React', 'Next.js', 'Node.js', 'Python', 'FastAPI', 'MongoDB', 'TypeScript', 'AI/ML', 'AWS', 'Docker'].map((tech) => (
                      <span 
                        key={tech}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          isDark 
                            ? 'bg-[#10a37f]/20 text-[#10a37f] border border-[#10a37f]/30' 
                            : 'bg-[#10a37f]/10 text-[#10a37f] border border-[#10a37f]/20'
                        }`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Experience & Skills */}
                <div className="mb-6">
                  <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                    What I Do:
                  </h3>
                  <div className="space-y-2">
                    <div className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      <div className="w-2 h-2 bg-[#10a37f] rounded-full"></div>
                      <span className="text-sm">Full-stack web application development</span>
                    </div>
                    <div className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      <div className="w-2 h-2 bg-[#10a37f] rounded-full"></div>
                      <span className="text-sm">AI/ML integration and automation</span>
                    </div>
                    <div className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      <div className="w-2 h-2 bg-[#10a37f] rounded-full"></div>
                      <span className="text-sm">Cloud infrastructure and deployment</span>
                    </div>
                    <div className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      <div className="w-2 h-2 bg-[#10a37f] rounded-full"></div>
                      <span className="text-sm">Professional networking platform development</span>
                    </div>
                  </div>
                </div>
                
                {/* View Profile Button */}
                <div className="mt-auto">
                  <a
                    href="https://cvchatter.com/profile/usama125"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#0a7a5f] text-white px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#10a37f]/25 hover:scale-105"
                  >
                    <span>View My Full Profile</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Section - Contact Form (1/3 width) */}
          <div className="lg:col-span-1">
            <Card className={`${isDark ? 'bg-[#2f2f2f]/50 border-[#565869]/50' : 'bg-white border-gray-200'} shadow-lg h-full`}>
              <CardHeader>
                <CardTitle className={`text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Send me a Message
                </CardTitle>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Fill out the form below and I'll get back to you as soon as possible.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name" className={`${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`mt-1 ${isDark ? 'bg-[#1a1a1a] border-[#565869] text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className={`${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`mt-1 ${isDark ? 'bg-[#1a1a1a] border-[#565869] text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject" className={`${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                      Subject *
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      className={`mt-1 ${isDark ? 'bg-[#1a1a1a] border-[#565869] text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                      placeholder="What's this about?"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className={`${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={7}
                      value={formData.message}
                      onChange={handleInputChange}
                      className={`mt-1 ${isDark ? 'bg-[#1a1a1a] border-[#565869] text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                      placeholder="Tell me how I can help you..."
                    />
                  </div>

                  {/* Submit Status */}
                  {submitStatus === 'success' && (
                    <div className="flex items-center space-x-2 p-3 bg-green-100 border border-green-200 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-green-800 text-sm">
                        Message sent successfully! I'll get back to you soon.
                      </span>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="flex items-center space-x-2 p-3 bg-red-100 border border-red-200 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <span className="text-red-800 text-sm">
                        Something went wrong. Please try again or email me directly.
                      </span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#0a7a5f] text-white py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#10a37f]/25 hover:scale-105 flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Information Cards */}
        <div className="mb-16">
          <h2 className={`text-2xl font-bold mb-8 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Contact Information
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className={`flex items-start space-x-4 p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg ${isDark ? 'bg-[#2f2f2f]/50 border-[#565869]/50 hover:border-[#10a37f]/50' : 'bg-white border-gray-200 hover:border-[#10a37f]/50'}`}>
              <div className="w-12 h-12 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Direct Contact
                </h3>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  usamafarooq2007@gmail.com
                </p>
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  I typically respond within 24 hours
                </p>
              </div>
            </div>

            <div className={`flex items-start space-x-4 p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg ${isDark ? 'bg-[#2f2f2f]/50 border-[#565869]/50 hover:border-[#10a37f]/50' : 'bg-white border-gray-200 hover:border-[#10a37f]/50'}`}>
              <div className="w-12 h-12 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-xl flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  My Profile
                </h3>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  cvchatter.com/profile/usama125
                </p>
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  View my full professional profile and experience
                </p>
              </div>
            </div>

            <div className={`flex items-start space-x-4 p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg ${isDark ? 'bg-[#2f2f2f]/50 border-[#565869]/50 hover:border-[#10a37f]/50' : 'bg-white border-gray-200 hover:border-[#10a37f]/50'}`}>
              <div className="w-12 h-12 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Location
                </h3>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Remote-First Developer
                </p>
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Available worldwide for collaboration
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section - Centered */}
        <div className="max-w-4xl mx-auto">
          <h2 className={`text-2xl font-bold mb-8 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#2f2f2f]/30 border-[#565869]/30' : 'bg-white/50 border-gray-200'}`}>
              <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                How do I create my AI profile?
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Simply sign up, upload your resume or LinkedIn PDF, and the AI will help you build a comprehensive profile.
              </p>
            </div>
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#2f2f2f]/30 border-[#565869]/30' : 'bg-white/50 border-gray-200'}`}>
              <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Is my data secure?
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Yes, I use enterprise-grade security and never share your personal information without consent.
              </p>
            </div>
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#2f2f2f]/30 border-[#565869]/30' : 'bg-white/50 border-gray-200'}`}>
              <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Can I customize my profile?
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Absolutely! You can edit any section, add custom content, and choose from multiple themes.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

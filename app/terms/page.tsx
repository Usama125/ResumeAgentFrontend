"use client"

import { useTheme } from "@/context/ThemeContext"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Calendar, Users, Shield, AlertTriangle } from "lucide-react"
import Header from "@/components/Header"

export default function TermsPage() {
  const { isDark } = useTheme()

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#212121] text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Header variant="default" showBackButton />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Terms and <span className="text-[#10a37f]">Conditions</span>
          </h1>
          <p className={`text-xl max-w-3xl mx-auto leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Please read these terms carefully before using CVChatter. By using our service, you agree to be bound by these terms.
          </p>
          <div className={`flex items-center justify-center space-x-4 mt-6 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Last updated: December 2024</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Version 1.0</span>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Introduction */}
          <Card className={`${isDark ? 'bg-[#2f2f2f]/50 border-[#565869]/50' : 'bg-white border-gray-200'} shadow-lg`}>
            <CardContent className="p-8">
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                1. Introduction
              </h2>
              <div className={`space-y-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <p>
                  Welcome to CVChatter ("we," "our," or "us"). These Terms and Conditions ("Terms") govern your use of our AI-powered professional networking platform and services (collectively, the "Service").
                </p>
                <p>
                  By accessing or using CVChatter, you agree to be bound by these Terms. If you disagree with any part of these terms, you may not access the Service.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Acceptance of Terms */}
          <Card className={`${isDark ? 'bg-[#2f2f2f]/50 border-[#565869]/50' : 'bg-white border-gray-200'} shadow-lg`}>
            <CardContent className="p-8">
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                2. Acceptance of Terms
              </h2>
              <div className={`space-y-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <p>
                  By creating an account, uploading content, or using any part of our Service, you confirm that:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>You are at least 18 years old or have parental consent</li>
                  <li>You have the legal capacity to enter into this agreement</li>
                  <li>You will provide accurate and complete information</li>
                  <li>You will not use the Service for any unlawful purpose</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Service Description */}
          <Card className={`${isDark ? 'bg-[#2f2f2f]/50 border-[#565869]/50' : 'bg-white border-gray-200'} shadow-lg`}>
            <CardContent className="p-8">
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                3. Service Description
              </h2>
              <div className={`space-y-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <p>
                  CVChatter provides an AI-powered platform that allows users to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Create and manage professional profiles</li>
                  <li>Generate AI-powered responses to profile inquiries</li>
                  <li>Connect with potential employers and collaborators</li>
                  <li>Access career development tools and resources</li>
                  <li>Use AI writing assistance for professional documents</li>
                </ul>
                <p>
                  We reserve the right to modify, suspend, or discontinue any part of the Service at any time with or without notice.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* User Accounts */}
          <Card className={`${isDark ? 'bg-[#2f2f2f]/50 border-[#565869]/50' : 'bg-white border-gray-200'} shadow-lg`}>
            <CardContent className="p-8">
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                4. User Accounts
              </h2>
              <div className={`space-y-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <p>
                  To access certain features of the Service, you must create an account. You are responsible for:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us immediately of any unauthorized use</li>
                  <li>Providing accurate and up-to-date information</li>
                </ul>
                <p>
                  We reserve the right to suspend or terminate accounts that violate these Terms or engage in fraudulent activity.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Content and Intellectual Property */}
          <Card className={`${isDark ? 'bg-[#2f2f2f]/50 border-[#565869]/50' : 'bg-white border-gray-200'} shadow-lg`}>
            <CardContent className="p-8">
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                5. Content and Intellectual Property
              </h2>
              <div className={`space-y-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <p>
                  <strong>Your Content:</strong> You retain ownership of all content you upload to CVChatter. By using our Service, you grant us a non-exclusive, royalty-free license to use, display, and distribute your content as necessary to provide the Service.
                </p>
                <p>
                  <strong>Our Content:</strong> The CVChatter platform, including its design, functionality, and AI technology, is owned by us and protected by intellectual property laws.
                </p>
                <p>
                  <strong>Prohibited Content:</strong> You may not upload content that is illegal, harmful, threatening, defamatory, or violates any third-party rights.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Privacy and Data Protection */}
          <Card className={`${isDark ? 'bg-[#2f2f2f]/50 border-[#565869]/50' : 'bg-white border-gray-200'} shadow-lg`}>
            <CardContent className="p-8">
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                6. Privacy and Data Protection
              </h2>
              <div className={`space-y-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <p>
                  Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
                </p>
                <p>
                  We implement appropriate security measures to protect your data, but no method of transmission over the internet is 100% secure. You use the Service at your own risk.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Prohibited Uses */}
          <Card className={`${isDark ? 'bg-[#2f2f2f]/50 border-[#565869]/50' : 'bg-white border-gray-200'} shadow-lg`}>
            <CardContent className="p-8">
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                7. Prohibited Uses
              </h2>
              <div className={`space-y-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <p>You may not use CVChatter for any of the following purposes:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Violating any applicable laws or regulations</li>
                  <li>Transmitting harmful or malicious code</li>
                  <li>Attempting to gain unauthorized access to our systems</li>
                  <li>Impersonating another person or entity</li>
                  <li>Spamming or sending unsolicited communications</li>
                  <li>Harassing, threatening, or abusing other users</li>
                  <li>Uploading false or misleading information</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card className={`${isDark ? 'bg-[#2f2f2f]/50 border-[#565869]/50' : 'bg-white border-gray-200'} shadow-lg`}>
            <CardContent className="p-8">
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                8. Limitation of Liability
              </h2>
              <div className={`space-y-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <p>
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, CVChatter SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
                </p>
                <p>
                  Our total liability to you for any claims arising from or relating to these Terms or the Service shall not exceed the amount you paid us in the 12 months preceding the claim.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card className={`${isDark ? 'bg-[#2f2f2f]/50 border-[#565869]/50' : 'bg-white border-gray-200'} shadow-lg`}>
            <CardContent className="p-8">
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                9. Termination
              </h2>
              <div className={`space-y-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <p>
                  You may terminate your account at any time by contacting us or using the account deletion feature in your settings.
                </p>
                <p>
                  We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
                </p>
                <p>
                  Upon termination, your right to use the Service will cease immediately, but provisions that by their nature should survive termination shall remain in effect.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card className={`${isDark ? 'bg-[#2f2f2f]/50 border-[#565869]/50' : 'bg-white border-gray-200'} shadow-lg`}>
            <CardContent className="p-8">
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                10. Changes to Terms
              </h2>
              <div className={`space-y-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <p>
                  We reserve the right to modify these Terms at any time. We will notify users of any material changes by email or through the Service.
                </p>
                <p>
                  Your continued use of the Service after such modifications constitutes acceptance of the updated Terms. If you do not agree to the modified Terms, you must stop using the Service.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className={`${isDark ? 'bg-[#2f2f2f]/50 border-[#565869]/50' : 'bg-white border-gray-200'} shadow-lg`}>
            <CardContent className="p-8">
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                11. Contact Information
              </h2>
              <div className={`space-y-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <p>
                  If you have any questions about these Terms, please contact us at:
                </p>
                <div className={`p-4 rounded-xl ${isDark ? 'bg-[#1a1a1a]' : 'bg-gray-50'}`}>
                  <p><strong>Email:</strong> legal@cvchatter.com</p>
                  <p><strong>Support:</strong> support@cvchatter.com</p>
                  <p><strong>Business:</strong> business@cvchatter.com</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Legal Notice */}
          <div className={`p-6 rounded-xl border ${isDark ? 'bg-[#2f2f2f]/30 border-[#565869]/30' : 'bg-yellow-50 border-yellow-200'}`}>
            <div className="flex items-start space-x-3">
              <AlertTriangle className={`w-6 h-6 mt-0.5 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />
              <div>
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-yellow-300' : 'text-yellow-800'}`}>
                  Legal Notice
                </h3>
                <p className={`text-sm ${isDark ? 'text-yellow-200' : 'text-yellow-700'}`}>
                  These Terms constitute a legally binding agreement. If any provision is found to be unenforceable, the remaining provisions will remain in full force and effect. These Terms are governed by the laws of the jurisdiction in which CVChatter operates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


"use client"

import { useTheme } from "@/context/ThemeContext"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Calendar, Users, Database, Lock, Eye, Trash2, Download, AlertCircle } from "lucide-react"
import Header from "@/components/Header"

export default function PrivacyPage() {
  const { isDark } = useTheme()

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#212121] text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Header variant="default" showBackButton />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Privacy <span className="text-[#10a37f]">Policy</span>
          </h1>
          <p className={`text-xl max-w-3xl mx-auto leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Your privacy is our priority. Learn how we collect, use, and protect your personal information.
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
                  At CVChatter, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered professional networking platform.
                </p>
                <p>
                  By using our Service, you consent to the data practices described in this policy. If you do not agree with our policies and practices, please do not use our Service.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card className={`${isDark ? 'bg-[#2f2f2f]/50 border-[#565869]/50' : 'bg-white border-gray-200'} shadow-lg`}>
            <CardContent className="p-8">
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                2. Information We Collect
              </h2>
              <div className={`space-y-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <div>
                  <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Personal Information You Provide
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Name, email address, and contact information</li>
                    <li>Professional information (job title, company, experience)</li>
                    <li>Resume, CV, or LinkedIn profile data</li>
                    <li>Profile photos and portfolio materials</li>
                    <li>Skills, certifications, and educational background</li>
                    <li>Work preferences and career goals</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Information We Collect Automatically
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Usage data and interaction patterns</li>
                    <li>Device information and browser type</li>
                    <li>IP address and location data</li>
                    <li>Cookies and similar tracking technologies</li>
                    <li>Log files and analytics data</li>
                  </ul>
                </div>

                <div>
                  <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Information from Third Parties
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Social media profile information (when you connect accounts)</li>
                    <li>Professional network data from LinkedIn</li>
                    <li>Publicly available professional information</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Your Information */}
          <Card className={`${isDark ? 'bg-[#2f2f2f]/50 border-[#565869]/50' : 'bg-white border-gray-200'} shadow-lg`}>
            <CardContent className="p-8">
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                3. How We Use Your Information
              </h2>
              <div className={`space-y-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <p>We use your information for the following purposes:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide and maintain our AI-powered networking services</li>
                  <li>Generate personalized AI responses for your profile</li>
                  <li>Match you with relevant job opportunities and connections</li>
                  <li>Improve our algorithms and service quality</li>
                  <li>Send you important updates and notifications</li>
                  <li>Provide customer support and respond to inquiries</li>
                  <li>Ensure platform security and prevent fraud</li>
                  <li>Comply with legal obligations and enforce our terms</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Information Sharing */}
          <Card className={`${isDark ? 'bg-[#2f2f2f]/50 border-[#565869]/50' : 'bg-white border-gray-200'} shadow-lg`}>
            <CardContent className="p-8">
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                4. Information Sharing and Disclosure
              </h2>
              <div className={`space-y-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <div>
                  <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    We Do NOT Sell Your Personal Information
                  </h3>
                  <p>
                    We do not sell, trade, or rent your personal information to third parties for marketing purposes.
                  </p>
                </div>

                <div>
                  <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    When We May Share Information
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>With your explicit consent</li>
                    <li>To facilitate professional connections and job matching</li>
                    <li>With service providers who assist in our operations</li>
                    <li>To comply with legal requirements or court orders</li>
                    <li>To protect our rights, property, or safety</li>
                    <li>In connection with a business transfer or merger</li>
                  </ul>
                </div>

                <div>
                  <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Public Profile Information
                  </h3>
                  <p>
                    Information you choose to make public on your profile (such as your name, professional summary, and skills) will be visible to other users and potential employers who use our platform.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card className={`${isDark ? 'bg-[#2f2f2f]/50 border-[#565869]/50' : 'bg-white border-gray-200'} shadow-lg`}>
            <CardContent className="p-8">
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                5. Data Security
              </h2>
              <div className={`space-y-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <p>
                  We implement industry-standard security measures to protect your personal information:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Secure authentication and access controls</li>
                  <li>Regular security audits and monitoring</li>
                  <li>Employee training on data protection</li>
                  <li>Incident response procedures</li>
                </ul>
                <p>
                  However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights and Choices */}
          <Card className={`${isDark ? 'bg-[#2f2f2f]/50 border-[#565869]/50' : 'bg-white border-gray-200'} shadow-lg`}>
            <CardContent className="p-8">
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                6. Your Rights and Choices
              </h2>
              <div className={`space-y-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <div>
                  <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Access and Control
                  </h3>
                  <p>You have the right to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Access and review your personal information</li>
                    <li>Update or correct inaccurate information</li>
                    <li>Delete your account and associated data</li>
                    <li>Export your data in a portable format</li>
                    <li>Opt out of certain communications</li>
                    <li>Control the visibility of your profile information</li>
                  </ul>
                </div>

                <div>
                  <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    How to Exercise Your Rights
                  </h3>
                  <p>
                    You can manage most of your information directly through your account settings. For other requests, contact us at privacy@cvchatter.com.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cookies and Tracking */}
          <Card className={`${isDark ? 'bg-[#2f2f2f]/50 border-[#565869]/50' : 'bg-white border-gray-200'} shadow-lg`}>
            <CardContent className="p-8">
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                7. Cookies and Tracking Technologies
              </h2>
              <div className={`space-y-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <p>
                  We use cookies and similar technologies to enhance your experience:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Essential Cookies:</strong> Required for basic platform functionality</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand how you use our service</li>
                  <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                  <li><strong>Marketing Cookies:</strong> Used for targeted advertising (with consent)</li>
                </ul>
                <p>
                  You can control cookie settings through your browser, but disabling certain cookies may affect platform functionality.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Data Retention */}
          <Card className={`${isDark ? 'bg-[#2f2f2f]/50 border-[#565869]/50' : 'bg-white border-gray-200'} shadow-lg`}>
            <CardContent className="p-8">
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                8. Data Retention
              </h2>
              <div className={`space-y-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <p>
                  We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. Specifically:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Account information is retained while your account is active</li>
                  <li>Usage data is typically retained for up to 2 years</li>
                  <li>Legal and compliance data may be retained longer as required</li>
                  <li>You can request deletion of your data at any time</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* International Transfers */}
          <Card className={`${isDark ? 'bg-[#2f2f2f]/50 border-[#565869]/50' : 'bg-white border-gray-200'} shadow-lg`}>
            <CardContent className="p-8">
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                9. International Data Transfers
              </h2>
              <div className={`space-y-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <p>
                  Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers, including:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Standard contractual clauses approved by relevant authorities</li>
                  <li>Adequacy decisions by data protection authorities</li>
                  <li>Other appropriate safeguards as required by law</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Children's Privacy */}
          <Card className={`${isDark ? 'bg-[#2f2f2f]/50 border-[#565869]/50' : 'bg-white border-gray-200'} shadow-lg`}>
            <CardContent className="p-8">
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                10. Children's Privacy
              </h2>
              <div className={`space-y-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <p>
                  Our Service is not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Changes to Privacy Policy */}
          <Card className={`${isDark ? 'bg-[#2f2f2f]/50 border-[#565869]/50' : 'bg-white border-gray-200'} shadow-lg`}>
            <CardContent className="p-8">
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                11. Changes to This Privacy Policy
              </h2>
              <div className={`space-y-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Posting the updated policy on our website</li>
                  <li>Sending you an email notification</li>
                  <li>Displaying a notice in our application</li>
                </ul>
                <p>
                  Your continued use of our Service after any changes indicates your acceptance of the updated policy.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className={`${isDark ? 'bg-[#2f2f2f]/50 border-[#565869]/50' : 'bg-white border-gray-200'} shadow-lg`}>
            <CardContent className="p-8">
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                12. Contact Us
              </h2>
              <div className={`space-y-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <p>
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className={`p-4 rounded-xl ${isDark ? 'bg-[#1a1a1a]' : 'bg-gray-50'}`}>
                  <p><strong>Privacy Officer:</strong> privacy@cvchatter.com</p>
                  <p><strong>General Support:</strong> support@cvchatter.com</p>
                  <p><strong>Data Protection:</strong> dpo@cvchatter.com</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Protection Notice */}
          <div className={`p-6 rounded-xl border ${isDark ? 'bg-[#2f2f2f]/30 border-[#565869]/30' : 'bg-blue-50 border-blue-200'}`}>
            <div className="flex items-start space-x-3">
              <Lock className={`w-6 h-6 mt-0.5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <div>
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>
                  Your Privacy Matters
                </h3>
                <p className={`text-sm ${isDark ? 'text-blue-200' : 'text-blue-700'}`}>
                  We are committed to protecting your privacy and being transparent about our data practices. If you have any concerns or questions about how we handle your information, please don't hesitate to reach out to us.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


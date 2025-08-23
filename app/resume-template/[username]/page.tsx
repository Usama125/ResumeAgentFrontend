"use client"

import React, { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { PublicUser } from "@/types"
import { 
  MapPin, 
  Mail, 
  Phone, 
  Briefcase, 
  Calendar, 
  Award, 
  Globe, 
  Github, 
  Linkedin, 
  Twitter, 
  ExternalLink,
  User,
  Code,
  GraduationCap,
  Languages,
  Star,
  Download,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MapPin as MapPinIcon
} from "lucide-react"
import { GradientAvatar } from '@/components/ui/avatar'
import { useTheme } from '@/context/ThemeContext'

interface ProcessedResumeData {
  professional_summary: string;
  key_skills: Array<{
    name: string;
    level: string;
    experience_years: number;
  }>;
  experience: Array<{
    position: string;
    company: string;
    duration: string;
    description: string;
    key_achievements: string[];
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    url?: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    duration: string;
    description: string;
  }>;
  languages: Array<{
    name: string;
    proficiency: string;
  }>;
  awards: Array<{
    title: string;
    issuer: string;
    date: string;
    description: string;
  }>;
}

export default function ResumeTemplatePage() {
  const [user, setUser] = useState<PublicUser | null>(null)
  const [processedData, setProcessedData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false)
  const { isDark } = useTheme()
  const params = useParams()
  const username = params.username as string

  useEffect(() => {
    const fetchUserAndProcessData = async () => {
      if (!username) return;
      
      try {
        // Fetch user data
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
        const response = await fetch(`${API_BASE_URL}/users/username/${username}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch user')
        }
        
        const userData = await response.json()
        setUser(userData)

        // Process data with AI
        const processResponse = await fetch('/api/resume-processor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ profileData: userData }),
        })

        if (processResponse.ok) {
          const processedData = await processResponse.json()
          setProcessedData(processedData)
        } else {
          console.error('Failed to process resume data')
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserAndProcessData()
  }, [username])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse mx-auto mb-4"></div>
          <p className="text-gray-600">Processing resume data...</p>
        </div>
      </div>
    )
  }

  if (!user || !processedData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Resume data not found</p>
      </div>
    )
  }

  const getImageUrl = (imageUrl: string | null) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    return imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  };

  const formatLinkedInUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.startsWith('linkedin.com/') || url.startsWith('www.linkedin.com/')) {
      return `https://${url}`;
    }
    if (url.startsWith('/in/') || url.startsWith('in/')) {
      return `https://linkedin.com/${url.startsWith('/') ? url.slice(1) : url}`;
    }
    return `https://linkedin.com/in/${url}`;
  };

  const formatGitHubUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.startsWith('github.com/') || url.startsWith('www.github.com/')) {
      return `https://${url}`;
    }
    return `https://github.com/${url.replace('@', '')}`;
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 text-gray-900 print:bg-white print:min-h-0" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Print Styles */}
      <style jsx>{`
        @media print {
          @page {
            size: A4;
            margin: 8mm;
          }
          body {
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
            background: white !important;
          }
          html, body {
            background: white !important;
            height: auto !important;
            min-height: auto !important;
          }
          .main-container {
            background: white !important;
            min-height: auto !important;
            box-shadow: none !important;
          }
          .no-print {
            display: none !important;
          }
          .page-break {
            page-break-before: always;
          }
          .avoid-break {
            page-break-inside: avoid;
          }
          .resume-header {
            background: linear-gradient(135deg, #10a37f 0%, #0d8f6f 100%) !important;
            border-radius: 0 0 20px 20px !important;
          }
          .sidebar {
            background: #f0fdf4 !important;
          }
          .first-page-content {
            display: flex !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .subsequent-page-content {
            display: block !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .subsequent-page-content .sidebar {
            display: none !important;
          }
          .subsequent-page-content .main-content {
            width: 100% !important;
            padding: 12px !important;
          }
          .content-section {
            margin-bottom: 8px !important;
          }
          .content-section:last-child {
            margin-bottom: 0 !important;
          }
          .subsequent-page-content .content-section {
            margin-bottom: 6px !important;
          }
          .subsequent-page-content .content-section:last-child {
            margin-bottom: 0 !important;
          }
        }
        
        .resume-header {
          background: linear-gradient(135deg, #10a37f 0%, #0d8f6f 100%);
          border-radius: 0 0 20px 20px;
        }
        
        .sidebar {
          background: #f0fdf4;
        }
        
        .page-background {
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%);
        }
        
        .content-section {
          margin-bottom: 8px;
        }
        
        .content-section:last-child {
          margin-bottom: 0;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .tech-chips-container {
          display: flex;
          flex-wrap: nowrap;
          gap: 1px;
          max-height: 18px;
          overflow: hidden;
          white-space: nowrap;
        }
        
        .tech-chip {
          padding: 1px 4px;
          font-size: 10px;
          line-height: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 60px;
        }
      `}</style>

      <div className="max-w-6xl mx-auto bg-white shadow-xl main-container rounded-lg overflow-hidden">
        {/* Header Section */}
        <div className="resume-header text-white p-6 mt-4 mb-8 avoid-break">
          <div className="flex items-center space-x-4">
            {/* Profile Picture */}
            <div className="relative">
              {user.profile_picture && !imageError ? (
                <img
                  src={getImageUrl(user.profile_picture)}
                  alt={user.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                  crossOrigin="anonymous"
                  onError={() => setImageError(true)}
                />
              ) : (
                <GradientAvatar
                  className="w-20 h-20 border-4 border-white shadow-lg"
                  isDark={false}
                />
              )}
            </div>

            {/* Name & Title */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-1">{user.name}</h1>
              <p className="text-lg opacity-90 mb-3">{user.designation}</p>
              
              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                {user.contact_info?.email && (
                  <div className="flex items-center space-x-2">
                    <MailIcon className="w-3 h-3" />
                    <span>{user.contact_info.email}</span>
                  </div>
                )}
                {user.contact_info?.phone && (
                  <div className="flex items-center space-x-2">
                    <PhoneIcon className="w-3 h-3" />
                    <span>{user.contact_info.phone}</span>
                  </div>
                )}
                {user.location && (
                  <div className="flex items-center space-x-2">
                    <MapPinIcon className="w-3 h-3" />
                    <span>{user.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-2">
              {user.contact_info?.linkedin && (
                <a
                  href={formatLinkedInUrl(user.contact_info.linkedin)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {user.contact_info?.github && (
                <a
                  href={formatGitHubUrl(user.contact_info.github)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {user.contact_info?.website && (
                <a
                  href={user.contact_info.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* First Page Content */}
        <div className="first-page-content">
          {/* Left Sidebar - Only on first page */}
          <div className="w-1/3 sidebar p-2">
            {/* Professional Summary */}
            {processedData.professional_summary && (
              <div className="content-section avoid-break">
                <div className="flex items-center mb-2">
                  <User className="w-4 h-4 text-[#10a37f] mr-2" />
                  <h2 className="text-base font-bold text-gray-800">Professional Summary</h2>
                </div>
                <p className="text-gray-700 text-xs leading-relaxed">
                  {processedData.professional_summary}
                </p>
              </div>
            )}

            {/* Key Skills */}
            {processedData.key_skills && processedData.key_skills.length > 0 && (
              <div className="content-section avoid-break">
                <div className="flex items-center mb-2">
                  <Code className="w-4 h-4 text-[#10a37f] mr-2" />
                  <h2 className="text-base font-bold text-gray-800">Key Skills</h2>
                </div>
                <div className="flex flex-wrap gap-1">
                  {processedData.key_skills.map((skill, index) => (
                    <div key={index} className="flex items-center bg-[#10a37f]/10 border border-[#10a37f]/20 rounded-full px-2 py-1">
                      <Star className="w-3 h-3 text-[#10a37f] mr-1" />
                      <span className="text-xs font-medium text-gray-800">{skill.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {processedData.languages && processedData.languages.length > 0 && (
              <div className="content-section avoid-break">
                <div className="flex items-center mb-2">
                  <Languages className="w-4 h-4 text-[#10a37f] mr-2" />
                  <h2 className="text-base font-bold text-gray-800">Languages</h2>
                </div>
                <div className="flex flex-wrap gap-1">
                  {processedData.languages.map((lang, index) => (
                    <div key={index} className="flex items-center bg-[#10a37f]/10 border border-[#10a37f]/20 rounded-full px-2 py-1">
                      <span className="text-xs font-medium text-gray-800">{lang.name}</span>
                      <span className="text-xs text-[#10a37f] ml-1">({lang.proficiency})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {processedData.education && processedData.education.length > 0 && (
              <div className="content-section avoid-break">
                <div className="flex items-center mb-2">
                  <GraduationCap className="w-4 h-4 text-[#10a37f] mr-2" />
                  <h2 className="text-base font-bold text-gray-800">Education</h2>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="text-xs font-semibold text-gray-800">{processedData.education[0].degree}</h3>
                      <p className="text-xs text-[#10a37f]">{processedData.education[0].institution}</p>
                    </div>
                  </div>
                  {processedData.education[0].description && (
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-[#10a37f] font-semibold line-clamp-1">
                        {processedData.education[0].duration}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Main Content - First Page */}
          <div className="w-2/3 main-content p-2">
            {/* Experience - First Page */}
            {processedData.experience && processedData.experience.length > 0 && (
              <div className="content-section avoid-break">
                <div className="flex items-center mb-2">
                  <Briefcase className="w-5 h-5 text-[#10a37f] mr-2" />
                  <h2 className="text-lg font-bold text-gray-800">Professional Experience</h2>
                </div>
                <div className="space-y-3">
                  {processedData.experience.slice(0, 3).map((exp, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-base font-semibold text-gray-800">{exp.position}</h3>
                          <p className="text-[#10a37f] font-medium text-sm">{exp.company}</p>
                        </div>
                        <span className="text-xs text-gray-600 bg-[#10a37f]/10 border border-[#10a37f]/20 px-2 py-1 rounded-full">
                          {exp.duration}
                        </span>
                      </div>
                      <p className="text-gray-700 text-xs mb-2 line-clamp-2">{exp.description}</p>
                      {exp.key_achievements && exp.key_achievements.length > 0 && (
                        <ul className="space-y-1">
                          {exp.key_achievements.slice(0, 2).map((achievement, idx) => (
                            <li key={idx} className="text-xs text-gray-700 flex items-start">
                              <span className="text-[#10a37f] mr-2 text-xs">•</span>
                              <span className="line-clamp-1">{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects - First Page */}
            {processedData.projects && processedData.projects.length > 0 && (
              <div className="content-section avoid-break">
                <div className="flex items-center mb-2">
                  <Code className="w-5 h-5 text-[#10a37f] mr-2" />
                  <h2 className="text-lg font-bold text-gray-800">Featured Projects</h2>
                </div>
                <div className="space-y-3">
                  {processedData.projects.slice(0, 3).map((project, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-base font-semibold text-gray-800">{project.name}</h3>
                        {project.url && (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#10a37f] hover:text-[#0d8f6f]"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                      <p className="text-gray-700 text-xs mb-2 line-clamp-2">{project.description}</p>
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="tech-chips-container">
                          {project.technologies.slice(0, 2).map((tech, idx) => (
                            <span key={idx} className="tech-chip bg-[#10a37f]/10 border border-[#10a37f]/20 text-[#10a37f] rounded-full font-medium">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}


          </div>
        </div>

        {/* Continuous Content Flow - No Separate Pages */}
        <div className="subsequent-page-content p-2">
          {/* Additional Experience - Continue from first page */}
          {processedData.experience && processedData.experience.length > 3 && (
            <div className="content-section page-break">
              <div className="flex items-center mb-2">
                <Briefcase className="w-5 h-5 text-[#10a37f] mr-2" />
                <h2 className="text-lg font-bold text-gray-800">Other Experience</h2>
              </div>
              <div className="space-y-2">
                {processedData.experience.slice(3).map((exp, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-base font-semibold text-gray-800">{exp.position}</h3>
                        <p className="text-[#10a37f] font-medium text-sm">{exp.company}</p>
                      </div>
                      <span className="text-xs text-gray-600 bg-[#10a37f]/10 border border-[#10a37f]/20 px-2 py-1 rounded-full">
                        {exp.duration}
                      </span>
                    </div>
                    <p className="text-gray-700 text-xs mb-2 line-clamp-2">{exp.description}</p>
                    {exp.key_achievements && exp.key_achievements.length > 0 && (
                      <ul className="space-y-1">
                        {exp.key_achievements.slice(0, 2).map((achievement, idx) => (
                          <li key={idx} className="text-xs text-gray-700 flex items-start">
                            <span className="text-[#10a37f] mr-2 text-xs">•</span>
                            <span className="line-clamp-1">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Projects - Continue from previous section */}
          {processedData.projects && processedData.projects.length > 3 && (
            <div className="content-section">
              <div className="flex items-center mb-2">
                <Code className="w-5 h-5 text-[#10a37f] mr-2" />
                <h2 className="text-lg font-bold text-gray-800">Other Projects</h2>
              </div>
              <div className="space-y-2">
                {processedData.projects.slice(3, 8).map((project, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-base font-semibold text-gray-800">{project.name}</h3>
                                                {project.url && (
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#10a37f] hover:text-[#0d8f6f]"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                    </div>
                    <p className="text-gray-700 text-xs mb-2 line-clamp-2">{project.description}</p>
                    {project.technologies && project.technologies.length > 0 && (
                                                                      <div className="tech-chips-container">
                          {project.technologies.slice(0, 2).map((tech, idx) => (
                            <span key={idx} className="tech-chip bg-[#10a37f]/10 border border-[#10a37f]/20 text-[#10a37f] rounded-full font-medium">
                              {tech}
                            </span>
                          ))}
                        </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 text-center">
          <p className="text-xs text-gray-500">
            Generated by CVChatter • {user.username} • {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  )
}

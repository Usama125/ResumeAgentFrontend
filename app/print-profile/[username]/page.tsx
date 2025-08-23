"use client"

import React, { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { PublicUser } from "@/types"
import { MapPin, Mail, Phone, Briefcase, Calendar, Award, Globe, Github, Linkedin, Twitter, ExternalLink } from "lucide-react"
import { calculateTotalExperience } from "@/utils/experienceCalculator"
import { GradientAvatar } from '@/components/ui/avatar'
import { useTheme } from '@/context/ThemeContext'

export default function PrintProfilePage() {
  const [user, setUser] = useState<PublicUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const { isDark } = useTheme()
  const params = useParams()
  const username = params.username as string

  useEffect(() => {
    const fetchUser = async () => {
      if (!username) return;
      
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
        const response = await fetch(`${API_BASE_URL}/users/username/${username}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch user')
        }
        
        const userData = await response.json()
        setUser(userData)
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [username])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Profile not found</p>
      </div>
    )
  }

  // Calculate total experience
  const totalExperience = user.experience && user.experience.trim() !== '' 
    ? user.experience 
    : calculateTotalExperience(user.experience_details || []) || 'N/A';

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

  const formatUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `https://${url}`;
  };

  const isLocalProfileUrl = (url: string) => {
    if (!url) return false;
    return url.includes('cvchatter.com/profile/') || url.includes('localhost') || url.startsWith('/profile/');
  };

  const showSeeMore = (username: string) => `cvchatter.com/profile/${username}`;

  return (
    <div className="min-h-screen bg-white text-gray-900 print:bg-white print:min-h-0" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Print Styles */}
      <style jsx>{`
        @media print {
          @page {
            size: A4;
            margin: 15mm;
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
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #10a37f, #0d8f6f);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .border-gradient {
          border: 2px solid;
          border-image: linear-gradient(135deg, #10a37f, #0d8f6f) 1;
        }
      `}</style>

      <div className="max-w-4xl mx-auto p-4 space-y-6 main-container">
        {/* Header Section */}
        <div className="text-center space-y-4 avoid-break">
          {/* Profile Picture */}
          <div className="flex justify-center">
            <div className="relative">
              {user.profile_picture && !imageError ? (
                <img
                  src={getImageUrl(user.profile_picture)}
                  alt={user.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-[#10a37f] shadow-lg"
                  crossOrigin="anonymous"
                  onError={() => setImageError(true)}
                />
              ) : (
                <GradientAvatar
                  className="w-32 h-32 border-4 border-[#10a37f] shadow-lg"
                  isDark={isDark}
                />
              )}
            </div>
          </div>

          {/* Name & Title */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-2xl gradient-text font-semibold">{user.designation}</p>
            <div className="flex items-center justify-center text-gray-600">
              <MapPin className="w-5 h-5 mr-2 text-[#10a37f]" />
              <span className="text-lg">{user.location}</span>
            </div>
          </div>

          {/* Contact Information & Social Links */}
          {user.contact_info && Object.values(user.contact_info).some(value => value) && (
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {user.contact_info.email && (
                <a
                  href={`mailto:${user.contact_info.email}`}
                  className="group relative p-3 rounded-full transition-all duration-300 transform hover:scale-110 bg-white/80 border border-gray-200 hover:bg-[#10a37f]/10 hover:border-[#10a37f]/40 shadow-lg hover:shadow-xl"
                  title={`Email: ${user.contact_info.email}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <svg className="relative w-5 h-5 text-[#10a37f] group-hover:text-[#0d8f6f] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </a>
              )}
              {user.contact_info.linkedin && (
                <a
                  href={formatLinkedInUrl(user.contact_info.linkedin)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-3 rounded-full transition-all duration-300 transform hover:scale-110 bg-white/80 border border-gray-200 hover:bg-[#10a37f]/10 hover:border-[#10a37f]/40 shadow-lg hover:shadow-xl"
                  title="LinkedIn Profile"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <svg className="relative w-5 h-5 text-[#10a37f] group-hover:text-[#0d8f6f] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              )}
              {user.contact_info.github && (
                <a
                  href={formatGitHubUrl(user.contact_info.github)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-3 rounded-full transition-all duration-300 transform hover:scale-110 bg-white/80 border border-gray-200 hover:bg-[#10a37f]/10 hover:border-[#10a37f]/40 shadow-lg hover:shadow-xl"
                  title="GitHub Profile"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <svg className="relative w-5 h-5 text-[#10a37f] group-hover:text-[#0d8f6f] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              )}
              {user.contact_info.portfolio && (
                isLocalProfileUrl(user.contact_info.portfolio) && !user.username ? null : (
                  <a
                    href={isLocalProfileUrl(user.contact_info.portfolio) ? `/profile/${user.username}` : formatUrl(user.contact_info.portfolio)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative p-3 rounded-full transition-all duration-300 transform hover:scale-110 bg-white/80 border border-gray-200 hover:bg-[#10a37f]/10 hover:border-[#10a37f]/40 shadow-lg hover:shadow-xl"
                    title={isLocalProfileUrl(user.contact_info.portfolio) ? "View Profile" : "Portfolio Website"}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    {isLocalProfileUrl(user.contact_info.portfolio) ? (
                      <svg className="relative w-5 h-5 text-[#10a37f] group-hover:text-[#0d8f6f] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                      </svg>
                    ) : (
                      <svg className="relative w-5 h-5 text-[#10a37f] group-hover:text-[#0d8f6f] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                      </svg>
                    )}
                  </a>
                )
              )}
              {user.contact_info.twitter && (
                <a
                  href={formatUrl(user.contact_info.twitter)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-3 rounded-full transition-all duration-300 transform hover:scale-110 bg-white/80 border border-gray-200 hover:bg-[#10a37f]/10 hover:border-[#10a37f]/40 shadow-lg hover:shadow-xl"
                  title="Twitter Profile"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <svg className="relative w-5 h-5 text-[#10a37f] group-hover:text-[#0d8f6f] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              )}
              {user.contact_info.website && (
                <a
                  href={formatUrl(user.contact_info.website)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-3 rounded-full transition-all duration-300 transform hover:scale-110 bg-white/80 border border-gray-200 hover:bg-[#10a37f]/10 hover:border-[#10a37f]/40 shadow-lg hover:shadow-xl"
                  title="Personal Website"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <svg className="relative w-5 h-5 text-[#10a37f] group-hover:text-[#0d8f6f] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                  </svg>
                </a>
              )}
            </div>
          )}

          {/* Phone Number Display */}
          {user.contact_info?.phone && (
            <div className="flex items-center justify-center text-sm text-gray-600 mt-4">
              <svg className="w-4 h-4 mr-2 text-[#10a37f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>{user.contact_info.phone}</span>
            </div>
          )}

        </div>

        {/* About Section */}
        {user.summary && (
          <div className="avoid-break">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-[#10a37f]/10 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-[#10a37f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">About Me</h2>
              </div>
              <div className="text-gray-700 leading-relaxed">
                {(() => {
                  // Always show only first 3 lines (approximately 150 characters)
                  const maxLength = 150;
                  if (user.summary.length > maxLength) {
                    return (
                      <>
                        <p>{user.summary.substring(0, maxLength)}...</p>
                        <a
                          href={`https://cvchatter.com/profile/${user.username || user.name.toLowerCase().replace(/\s+/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-3 text-[#10a37f] hover:text-[#0d8f6f] font-medium transition-colors"
                          onClick={(e) => {
                            // Force new tab opening for PDF viewers
                            e.preventDefault();
                            window.open(`https://cvchatter.com/profile/${user.username || user.name.toLowerCase().replace(/\s+/g, '')}`, '_blank', 'noopener,noreferrer');
                          }}
                        >
                          See More
                        </a>
                      </>
                    );
                  }
                  return <p>{user.summary}</p>;
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Skills Section */}
        {user.skills && user.skills.length > 0 && (
          <div className="avoid-break mt-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-[#10a37f]/10 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-[#10a37f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Skills & Expertise</h2>
                </div>
                <span className="text-sm text-gray-500">{user.skills.length} skills</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {user.skills.slice(0, 4).map((skill, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-medium text-sm text-gray-900">{skill.name}</span>
                      <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                        skill.level === 'Expert' ? 'bg-[#10a37f] text-white' :
                        skill.level === 'Advanced' ? 'bg-blue-500 text-white' :
                        skill.level === 'Intermediate' ? 'bg-gray-500 text-white' :
                        'bg-gray-400 text-white'
                      }`}>
                        {skill.level}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${
                          skill.level === 'Expert' ? 'bg-[#10a37f]' :
                          skill.level === 'Advanced' ? 'bg-blue-500' :
                          skill.level === 'Intermediate' ? 'bg-gray-500' :
                          'bg-gray-400'
                        }`}
                        style={{
                          width: skill.level === 'Expert' ? '100%' :
                                 skill.level === 'Advanced' ? '80%' :
                                 skill.level === 'Intermediate' ? '60%' : '40%'
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#10a37f] rounded-full"></div>
                  <span className="text-xs text-gray-600">Expert</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Advanced</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Intermediate</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <span className="text-xs text-gray-600">Beginner</span>
                </div>
              </div>

              {user.skills.length > 10 && (
                <div className="text-center mt-4 pt-4 border-t border-gray-100">
                  <a
                    href={`https://cvchatter.com/profile/${user.username || user.name.toLowerCase().replace(/\s+/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#10a37f] hover:text-[#0d8f6f] font-medium transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(`https://cvchatter.com/profile/${user.username || user.name.toLowerCase().replace(/\s+/g, '')}`, '_blank', 'noopener,noreferrer');
                    }}
                  >
                    +{user.skills.length - 10} more skills - See More
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Experience Section */}
        {user.experience_details && user.experience_details.length > 0 && (
          <div className="avoid-break">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-[#10a37f]/10 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-[#10a37f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 00-2 2H10a2 2 0 00-2-2V6m8 0h2a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h2" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Professional Experience</h2>
              </div>
              
              <div className="space-y-6">
                {user.experience_details.slice(0, 4).map((exp, index) => (
                  <div key={index} className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                        <p className="text-[#10a37f] font-medium">{exp.company}</p>
                        <p className="text-sm text-gray-600">{exp.duration}</p>
                      </div>
                    </div>
                    <div className="text-gray-700 leading-relaxed">
                      {(() => {
                        // Split description into sentences and show first 2 lines (approximately 120 characters)
                        const maxLength = 120;
                        if (exp.description && exp.description.length > maxLength) {
                          return (
                            <>
                              <p>{exp.description.substring(0, maxLength)}...</p>
                              <a
                                href={`https://cvchatter.com/profile/${user.username || user.name.toLowerCase().replace(/\s+/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block mt-2 text-[#10a37f] hover:text-[#0d8f6f] font-medium transition-colors text-sm"
                                onClick={(e) => {
                                  e.preventDefault();
                                  window.open(`https://cvchatter.com/profile/${user.username || user.name.toLowerCase().replace(/\s+/g, '')}`, '_blank', 'noopener,noreferrer');
                                }}
                              >
                                See More
                              </a>
                            </>
                          );
                        }
                        return <p>{exp.description}</p>;
                      })()}
                    </div>
                  </div>
                ))}
                
                {user.experience_details.length > 4 && (
                  <div className="text-center pt-4 border-t border-gray-100">
                    <a
                      href={`https://cvchatter.com/profile/${user.username || user.name.toLowerCase().replace(/\s+/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#10a37f] hover:text-[#0d8f6f] font-medium transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(`https://cvchatter.com/profile/${user.username || user.name.toLowerCase().replace(/\s+/g, '')}`, '_blank', 'noopener,noreferrer');
                      }}
                    >
                      +{user.experience_details.length - 4} more experience - Visit CVChatter's Profile
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Projects Section */}
        {user.projects && user.projects.length > 0 && (
          <div className="avoid-break">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-[#10a37f]/10 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-[#10a37f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Featured Projects</h2>
              </div>
              
              <div className="space-y-6">
                {user.projects.slice(0, 4).map((project, index) => (
                  <div key={index} className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0">
                    <div className="mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
                      <div className="text-gray-700 leading-relaxed">
                        {(() => {
                          // Show first 2 lines (approximately 120 characters)
                          const maxLength = 120;
                          if (project.description && project.description.length > maxLength) {
                            return (
                              <>
                                <p className="mb-2">{project.description.substring(0, maxLength)}...</p>
                                <a
                                  href={`https://cvchatter.com/profile/${user.username || user.name.toLowerCase().replace(/\s+/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block text-[#10a37f] hover:text-[#0d8f6f] font-medium transition-colors text-sm"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    window.open(`https://cvchatter.com/profile/${user.username || user.name.toLowerCase().replace(/\s+/g, '')}`, '_blank', 'noopener,noreferrer');
                                  }}
                                >
                                  See More
                                </a>
                              </>
                            );
                          }
                          return <p className="mb-2">{project.description}</p>;
                        })()}
                      </div>
                    </div>
                    
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.slice(0, 3).map((tech, techIndex) => (
                          <span key={techIndex} className="px-3 py-1 bg-[#10a37f]/10 text-[#10a37f] rounded-full text-sm font-medium">
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                            +{project.technologies.length - 3} More
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                
                {user.projects.length > 4 && (
                  <div className="text-center pt-4 border-t border-gray-100">
                    <a
                      href={`https://cvchatter.com/profile/${user.username || user.name.toLowerCase().replace(/\s+/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#10a37f] hover:text-[#0d8f6f] font-medium transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(`https://cvchatter.com/profile/${user.username || user.name.toLowerCase().replace(/\s+/g, '')}`, '_blank', 'noopener,noreferrer');
                      }}
                    >
                      +{user.projects.length - 4} more projects - Visit CVChatter's Profile
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Education Section */}
        {user.education && user.education.length > 0 && (
          <div className="avoid-break">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-[#10a37f]/10 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-[#10a37f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Education</h2>
              </div>
              
              <div className="space-y-6">
                {user.education.slice(0, 2).map((edu, index) => (
                  <div key={index} className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0">
                    <div className="mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                      <p className="text-[#10a37f] font-medium">{edu.institution}</p>
                      {edu.field_of_study && (
                        <p className="text-gray-600">{edu.field_of_study}</p>
                      )}
                      <div className="text-sm text-gray-600 mt-1">
                        {edu.start_date} - {edu.end_date || 'Present'}
                        {edu.grade && <span> • {edu.grade}</span>}
                      </div>
                    </div>
                    
                    {edu.description && (
                      <div className="text-gray-700 leading-relaxed">
                        {(() => {
                          // Show first 2 lines (approximately 120 characters)
                          const maxLength = 120;
                          if (edu.description.length > maxLength) {
                            return (
                              <>
                                <p>{edu.description.substring(0, maxLength)}...</p>
                                <a
                                  href={`https://cvchatter.com/profile/${user.username || user.name.toLowerCase().replace(/\s+/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block mt-2 text-[#10a37f] hover:text-[#0d8f6f] font-medium transition-colors text-sm"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    window.open(`https://cvchatter.com/profile/${user.username || user.name.toLowerCase().replace(/\s+/g, '')}`, '_blank', 'noopener,noreferrer');
                                  }}
                                >
                                  See More
                                </a>
                              </>
                            );
                          }
                          return <p>{edu.description}</p>;
                        })()}
                      </div>
                    )}
                  </div>
                ))}
                
                {user.education.length > 2 && (
                  <div className="text-center pt-4 border-t border-gray-100">
                    <a
                      href={`https://cvchatter.com/profile/${user.username || user.name.toLowerCase().replace(/\s+/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#10a37f] hover:text-[#0d8f6f] font-medium transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(`https://cvchatter.com/profile/${user.username || user.name.toLowerCase().replace(/\s+/g, '')}`, '_blank', 'noopener,noreferrer');
                      }}
                    >
                      +{user.education.length - 2} more education - Visit CVChatter's Profile
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Awards Section */}
        {user.awards && user.awards.length > 0 && (
          <div className="avoid-break">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-[#10a37f]/10 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-[#10a37f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Awards & Recognition</h2>
              </div>
              
              <div className="space-y-6">
                {user.awards.slice(0, 2).map((award, index) => (
                  <div key={index} className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0">
                    <div className="mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{award.title}</h3>
                      {award.issuer && <p className="text-[#10a37f] font-medium">{award.issuer}</p>}
                      {award.date && <p className="text-sm text-gray-600">{award.date}</p>}
                    </div>
                    
                    {award.description && (
                      <div className="text-gray-700 leading-relaxed">
                        {(() => {
                          // Show first 2 lines (approximately 120 characters)
                          const maxLength = 120;
                          if (award.description.length > maxLength) {
                            return (
                              <>
                                <p>{award.description.substring(0, maxLength)}...</p>
                                <a
                                  href={`https://cvchatter.com/profile/${user.username || user.name.toLowerCase().replace(/\s+/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block mt-2 text-[#10a37f] hover:text-[#0d8f6f] font-medium transition-colors text-sm"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    window.open(`https://cvchatter.com/profile/${user.username || user.name.toLowerCase().replace(/\s+/g, '')}`, '_blank', 'noopener,noreferrer');
                                  }}
                                >
                                  See More
                                </a>
                              </>
                            );
                          }
                          return <p>{award.description}</p>;
                        })()}
                      </div>
                    )}
                  </div>
                ))}
                
                {user.awards.length > 2 && (
                  <div className="text-center pt-4 border-t border-gray-100">
                    <a
                      href={`https://cvchatter.com/profile/${user.username || user.name.toLowerCase().replace(/\s+/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#10a37f] hover:text-[#0d8f6f] font-medium transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(`https://cvchatter.com/profile/${user.username || user.name.toLowerCase().replace(/\s+/g, '')}`, '_blank', 'noopener,noreferrer');
                      }}
                    >
                      +{user.awards.length - 2} more awards - Visit CVChatter's Profile
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Publications Section */}
        {user.publications && user.publications.length > 0 && (
          <div className="avoid-break">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-[#10a37f]/10 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-[#10a37f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Publications</h2>
              </div>
              
              <div className="space-y-6">
                {user.publications.slice(0, 2).map((pub, index) => (
                  <div key={index} className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{pub.title}</h3>
                      {pub.publisher && <p className="text-[#10a37f] font-medium">{pub.publisher}</p>}
                      {pub.date && <p className="text-sm text-gray-600">{pub.date}</p>}
                      {pub.url && <p className="text-sm text-gray-500 break-all">{pub.url}</p>}
                    </div>
                  </div>
                ))}
                
                {user.publications.length > 2 && (
                  <div className="text-center pt-4 border-t border-gray-100">
                    <a
                      href={`https://cvchatter.com/profile/${user.username || user.name.toLowerCase().replace(/\s+/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#10a37f] hover:text-[#0d8f6f] font-medium transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(`https://cvchatter.com/profile/${user.username || user.name.toLowerCase().replace(/\s+/g, '')}`, '_blank', 'noopener,noreferrer');
                      }}
                    >
                      +{user.publications.length - 2} more publications - Visit CVChatter's Profile
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Volunteer Experience Section */}
        {user.volunteer_experience && user.volunteer_experience.length > 0 && (
          <div className="avoid-break">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-[#10a37f]/10 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-[#10a37f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Volunteer Experience</h2>
              </div>
              
              <div className="space-y-6">
                {user.volunteer_experience.slice(0, 2).map((vol, index) => (
                  <div key={index} className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0">
                    <div className="mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{vol.role}</h3>
                      <p className="text-[#10a37f] font-medium">{vol.organization}</p>
                      <div className="text-sm text-gray-600 mt-1">
                        {vol.start_date} - {vol.end_date || 'Present'}
                      </div>
                    </div>
                    
                    {vol.description && (
                      <div className="text-gray-700 leading-relaxed">
                        {(() => {
                          // Show first 2 lines (approximately 120 characters)
                          const maxLength = 120;
                          if (vol.description.length > maxLength) {
                            return (
                              <>
                                <p>{vol.description.substring(0, maxLength)}...</p>
                                <a
                                  href={`https://cvchatter.com/profile/${user.username || user.name.toLowerCase().replace(/\s+/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block mt-2 text-[#10a37f] hover:text-[#0d8f6f] font-medium transition-colors text-sm"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    window.open(`https://cvchatter.com/profile/${user.username || user.name.toLowerCase().replace(/\s+/g, '')}`, '_blank', 'noopener,noreferrer');
                                  }}
                                >
                                  See More
                                </a>
                              </>
                            );
                          }
                          return <p>{vol.description}</p>;
                        })()}
                      </div>
                    )}
                  </div>
                ))}
                
                {user.volunteer_experience.length > 2 && (
                  <div className="text-center pt-4 border-t border-gray-100">
                    <a
                      href={`https://cvchatter.com/profile/${user.username || user.name.toLowerCase().replace(/\s+/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#10a37f] hover:text-[#0d8f6f] font-medium transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(`https://cvchatter.com/profile/${user.username || user.name.toLowerCase().replace(/\s+/g, '')}`, '_blank', 'noopener,noreferrer');
                      }}
                    >
                      +{user.volunteer_experience.length - 2} more volunteer experience - Visit CVChatter's Profile
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Languages Section */}
        {user.languages && user.languages.length > 0 && (
          <div className="avoid-break">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-[#10a37f]/10 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-[#10a37f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Languages</h2>
              </div>
              
              <div className="space-y-4">
                {user.languages.map((lang, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">{lang.name}</h3>
                      <span className="px-3 py-1 bg-[#10a37f] text-white rounded-full text-sm font-medium">
                        {lang.proficiency}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Interests & Hobbies Section */}
        {user.interests && user.interests.length > 0 && (
          <div className="avoid-break">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-[#10a37f]/10 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-[#10a37f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Interests & Hobbies</h2>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {user.interests.map((interest, index) => (
                  <span key={index} className="px-4 py-2 bg-[#10a37f]/10 text-[#10a37f] rounded-full text-sm font-medium border border-[#10a37f]/20">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer with CVChatter Branding */}
        <div className="text-center py-8 border-t-2 border-[#10a37f] mt-12 bg-white">
          <div className="flex justify-center items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CV</span>
            </div>
            <h3 className="text-xl font-bold gradient-text">CVChatter</h3>
          </div>
          <div className="bg-gradient-to-r from-[#10a37f]/5 to-[#0d8f6f]/5 rounded-lg p-4 border border-[#10a37f]/20 mb-3">
            <p className="text-sm text-gray-700 font-medium mb-1">✨ Create your own professional portfolio</p>
            <p className="text-xs text-gray-600">Build your stunning profile and stand out from the crowd at <span className="text-[#10a37f] font-semibold">cvchatter.com</span></p>
          </div>
          <p className="text-xs text-gray-500">
            Generated from cvchatter.com/profile/{user.username || user.name.toLowerCase().replace(/\s+/g, '')}
          </p>
        </div>
      </div>
    </div>
  )
}
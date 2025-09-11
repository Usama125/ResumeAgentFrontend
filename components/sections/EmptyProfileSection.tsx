"use client"

import React from 'react'
import { User as UserType } from '@/types'
import { useTheme } from '@/context/ThemeContext'
import { 
  UserPlus, 
  Edit3,
  FileText,
  Briefcase,
  GraduationCap,
  Mail,
  Phone,
  MapPin
} from 'lucide-react'

interface EmptyProfileSectionProps {
  user: UserType
  isEditMode?: boolean
  onEditModeToggle?: (editMode: boolean) => void
}

export default function EmptyProfileSection({ 
  user, 
  isEditMode = false, 
  onEditModeToggle 
}: EmptyProfileSectionProps) {
  const { isDark } = useTheme()

  const emptySections = [
    {
      icon: <FileText className="w-5 h-5" />,
      title: "About Section",
      description: "Add a professional summary"
    },
    {
      icon: <Briefcase className="w-5 h-5" />,
      title: "Work Experience",
      description: "List your professional experience"
    },
    {
      icon: <GraduationCap className="w-5 h-5" />,
      title: "Education",
      description: "Add your educational background"
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: "Contact Information",
      description: "Add your contact details"
    }
  ]

  return (
    <div className={`relative rounded-xl border transition-all duration-300 ${
      isDark 
        ? 'bg-[#1a1a1a] border-[#333]' 
        : 'bg-white border-gray-200'
    } shadow-lg`}>
      
      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
            isDark ? 'bg-[#2a2a2a] border border-[#333]' : 'bg-gray-50 border border-gray-200'
          }`}>
            <UserPlus className="w-8 h-8 text-gray-400" />
          </div>
          
          <h2 className={`text-xl font-semibold mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Your Profile is Empty
          </h2>
          
          <p className={`text-sm mb-4 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Please update your profile to get benefits
          </p>
        </div>

        {/* Empty Sections Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {emptySections.map((section, index) => (
            <div 
              key={index}
              className={`flex items-center space-x-3 p-3 rounded-lg border ${
                isDark 
                  ? 'bg-[#2a2a2a] border-[#333]' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="text-gray-400">
                {section.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-medium text-sm ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {section.title}
                </h3>
                <p className={`text-xs ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {section.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <button
      onClick={() => onEditModeToggle?.(!isEditMode)}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 ${
              isDark 
                ? 'bg-[#10a37f] text-white hover:bg-[#0d8f6f]' 
                : 'bg-[#10a37f] text-white hover:bg-[#0d8f6f]'
            } shadow-md hover:shadow-lg mx-auto`}
          >
            <Edit3 className="w-4 h-4" />
            <span className="font-medium">Start Building Your Profile</span>
          </button>
          
          <p className={`text-xs mt-3 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            It only takes a few minutes to get started
          </p>
        </div>
      </div>
    </div>
  )
}

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
  Mail
} from 'lucide-react'

interface MobileEmptyProfileSectionProps {
  user: UserType
  isEditMode?: boolean
  onEditModeToggle?: (editMode: boolean) => void
}

export default function MobileEmptyProfileSection({ 
  user, 
  isEditMode = false, 
  onEditModeToggle 
}: MobileEmptyProfileSectionProps) {
  const { isDark } = useTheme()

  const emptySections = [
    {
      icon: <FileText className="w-4 h-4" />,
      title: "About",
      description: "Add summary"
    },
    {
      icon: <Briefcase className="w-4 h-4" />,
      title: "Experience",
      description: "Add work history"
    },
    {
      icon: <GraduationCap className="w-4 h-4" />,
      title: "Education",
      description: "Add background"
    },
    {
      icon: <Mail className="w-4 h-4" />,
      title: "Contact",
      description: "Add details"
    }
  ]

  return (
    <div className={`relative rounded-lg border transition-all duration-300 ${
      isDark 
        ? 'bg-[#1a1a1a] border-[#333]' 
        : 'bg-white border-gray-200'
    } shadow-md`}>
      
      {/* Content */}
      <div className="p-4">
        {/* Header */}
        <div className="text-center mb-4">
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${
            isDark ? 'bg-[#2a2a2a] border border-[#333]' : 'bg-gray-50 border border-gray-200'
          }`}>
            <UserPlus className="w-6 h-6 text-gray-400" />
          </div>
          
          <h2 className={`text-lg font-semibold mb-1 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Your Profile is Empty
          </h2>
          
          <p className={`text-xs mb-3 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Please update your profile to get benefits
          </p>
        </div>

        {/* Empty Sections Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {emptySections.map((section, index) => (
            <div 
              key={index}
              className={`flex items-center space-x-2 p-2 rounded-md border ${
                isDark 
                  ? 'bg-[#2a2a2a] border-[#333]' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="text-gray-400">
                {section.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-medium text-xs ${
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
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
              isDark 
                ? 'bg-[#10a37f] text-white hover:bg-[#0d8f6f]' 
                : 'bg-[#10a37f] text-white hover:bg-[#0d8f6f]'
            } shadow-sm hover:shadow-md w-full`}
          >
            <Edit3 className="w-4 h-4" />
            <span className="font-medium text-sm">Start Building Profile</span>
          </button>
          
          <p className={`text-xs mt-2 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Takes just a few minutes
          </p>
        </div>
      </div>
    </div>
  )
}

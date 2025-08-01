"use client"

import { Code, Briefcase, Award, BookOpen, Globe, Heart, Star, Users, FileText } from "lucide-react"
import { useTheme } from "@/context/ThemeContext"
import { User } from "@/types"

// Available sections that can be added - mapped to database fields
const AVAILABLE_SECTIONS = [
  { id: 'experience', name: 'Experience', icon: <Briefcase className="w-4 h-4" />, description: 'Professional work history', field: 'experience_details' },
  { id: 'education', name: 'Education', icon: <BookOpen className="w-4 h-4" />, description: 'Academic background', field: 'education' },
  { id: 'projects', name: 'Projects', icon: <Code className="w-4 h-4" />, description: 'Portfolio and achievements', field: 'projects' },
  { id: 'awards', name: 'Awards', icon: <Award className="w-4 h-4" />, description: 'Recognition and honors', field: 'awards' },
  { id: 'languages', name: 'Languages', icon: <Globe className="w-4 h-4" />, description: 'Language proficiency', field: 'languages' },
  { id: 'volunteer', name: 'Volunteer', icon: <Heart className="w-4 h-4" />, description: 'Community service', field: 'volunteer_experience' },
  { id: 'publications', name: 'Publications', icon: <FileText className="w-4 h-4" />, description: 'Research and articles', field: 'publications' },
  { id: 'interests', name: 'Interests', icon: <Star className="w-4 h-4" />, description: 'Personal interests', field: 'interests' },
  { id: 'contact', name: 'Contact', icon: <Users className="w-4 h-4" />, description: 'Contact information', field: 'contact_info' }
]

interface AddMissingSectionsProps {
  isEditMode: boolean
  user: User
  onAddSection?: (sectionId: string) => void
}

// Function to check if a section is empty or missing
const isSectionEmpty = (user: User, sectionField: string): boolean => {
  switch (sectionField) {
    case 'experience_details':
      return !user.experience_details || user.experience_details.length === 0
    case 'education':
      return !user.education || user.education.length === 0
    case 'projects':
      return !user.projects || user.projects.length === 0
    case 'awards':
      return !user.awards || user.awards.length === 0
    case 'languages':
      return !user.languages || user.languages.length === 0
    case 'volunteer_experience':
      return !user.volunteer_experience || user.volunteer_experience.length === 0
    case 'publications':
      return !user.publications || user.publications.length === 0
    case 'interests':
      return !user.interests || user.interests.length === 0
    case 'contact_info':
      // Check if contact_info exists and has any non-empty values
      if (!user.contact_info) return true
      const contactValues = Object.values(user.contact_info)
      return contactValues.every(value => !value || value === '')
    default:
      return true
  }
}

export default function AddMissingSections({ isEditMode, user, onAddSection }: AddMissingSectionsProps) {
  const { isDark } = useTheme()

  if (!isEditMode) return null

  // Filter sections that are empty or missing
  const missingSections = AVAILABLE_SECTIONS.filter(section => 
    isSectionEmpty(user, section.field)
  )

  // Don't show the component if no sections are missing
  if (missingSections.length === 0) return null

  return (
    <div className="space-y-4">
      <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Add Missing Sections
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {missingSections.map((section) => (
          <div
            key={section.id}
            className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
              isDark 
                ? 'bg-[#1a1a1a] border-[#10a37f]/20 hover:border-[#10a37f]/40 hover:bg-[#10a37f]/5' 
                : 'bg-gray-50 border-gray-200 hover:border-[#10a37f]/40 hover:bg-[#10a37f]/5'
            }`}
            title={`Add ${section.name} section`}
            onClick={() => {
              console.log('Adding section:', section.id)
              onAddSection?.(section.id)
              // The section will be removed from the list when the user data updates
            }}
          >
            <div className="flex items-center gap-2">
              <div className="text-[#10a37f]">
                {section.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {section.name}
                </div>
                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} truncate`}>
                  {section.description}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 
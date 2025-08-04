import { User as UserType } from "@/types"
import { SECTION_REGISTRY } from "@/components/sections"

export interface ProfileCompletionData {
  percentage: number
  totalSections: number
  completedSections: number
  emptySections: Array<{
    id: string
    title: string
    field: string
  }>
}

export const calculateProfileCompletion = (user: UserType): ProfileCompletionData => {
  const sections = Object.values(SECTION_REGISTRY).filter(section => !section.isPrivate)
  let completedSections = 0
  const emptySections: Array<{ id: string; title: string; field: string }> = []

  sections.forEach(section => {
    const hasData = hasSectionData(user, section.field)
    if (hasData) {
      completedSections++
    } else {
      emptySections.push({
        id: section.id,
        title: section.title,
        field: section.field
      })
    }
  })

  const totalSections = sections.length
  const percentage = Math.round((completedSections / totalSections) * 100)

  return {
    percentage,
    totalSections,
    completedSections,
    emptySections
  }
}

// Helper function to check if a section has data (copied from sections/index.tsx)
const hasSectionData = (user: UserType, field: string): boolean => {
  switch (field) {
    case 'summary':
      return !!(user.summary && user.summary.trim())
    case 'skills':
      return !!(user.skills && user.skills.length > 0)
    case 'experience_details':
      return !!(user.experience_details && user.experience_details.length > 0)
    case 'projects':
      return !!(user.projects && user.projects.length > 0)
    case 'education':
      return !!(user.education && user.education.length > 0)
    case 'contact_info':
      return !!(user.contact_info && Object.values(user.contact_info).some(value => value))
    case 'awards':
      return !!(user.awards && user.awards.length > 0)
    case 'languages':
      return !!(user.languages && user.languages.length > 0)
    case 'publications':
      return !!(user.publications && user.publications.length > 0)
    case 'volunteer_experience':
      return !!(user.volunteer_experience && user.volunteer_experience.length > 0)
    case 'interests':
      return !!(user.interests && user.interests.length > 0)
    case 'work_preferences':
      return !!(user.work_preferences && (
        user.work_preferences.preferred_work_mode?.length > 0 ||
        user.work_preferences.preferred_employment_type?.length > 0 ||
        user.work_preferences.preferred_location ||
        user.work_preferences.notice_period ||
        user.work_preferences.availability ||
        user.current_salary ||
        user.expected_salary
      ))
    default:
      return false
  }
} 
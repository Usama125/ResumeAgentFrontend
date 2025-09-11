// Section components exports
export { default as BaseSection } from './BaseSection'
export { default as AboutSection } from './AboutSection'
export { default as SkillsSection } from './SkillsSection'
export { default as ExperienceSection } from './ExperienceSection'
export { default as ProjectsSection } from './ProjectsSection'
export { default as EducationSection } from './EducationSection'
export { default as ContactSection } from './ContactSection'
export { default as LanguagesSection } from './LanguagesSection'
export { default as AwardsSection } from './AwardsSection'
export { default as PublicationsSection } from './PublicationsSection'
export { default as VolunteerSection } from './VolunteerSection'
export { default as InterestsSection } from './InterestsSection'
export { default as ProfileCompletionSection } from './ProfileCompletionSection'
export { default as PreferencesSection } from './PreferencesSection'
export { default as EmptyProfileSection } from './EmptyProfileSection'
export { default as MobileEmptyProfileSection } from './MobileEmptyProfileSection'

// Section registry for dynamic rendering
import { User as UserType } from "@/types"
import { ReactNode } from "react"
import { 
  User, 
  Code, 
  Briefcase, 
  Award, 
  BookOpen, 
  Globe, 
  FileText, 
  Heart,
  Settings
} from "lucide-react"

export interface SectionDefinition {
  id: string
  title: string
  icon: ReactNode
  field: keyof UserType | string
  component: any
  hasEditModal?: boolean
  defaultOrder: number
  isPrivate?: boolean
  hasData?: (user: UserType) => boolean
}

export const SECTION_REGISTRY: Record<string, SectionDefinition> = {
  about: {
    id: 'about',
    title: 'About Me',
    icon: <User className="w-5 h-5 text-[#10a37f]" />,
    field: 'summary',
    component: 'AboutSection',
    hasEditModal: true,
    defaultOrder: 1,
    hasData: (user: UserType) => !!(user.summary && user.summary.trim())
  },
  experience: {
    id: 'experience',
    title: 'Professional Experience',
    icon: <Briefcase className="w-5 h-5 text-[#10a37f]" />,
    field: 'experience_details',
    component: 'ExperienceSection',
    hasEditModal: false,
    defaultOrder: 2,
    hasData: (user: UserType) => !!(user.experience_details && user.experience_details.length > 0)
  },
  skills: {
    id: 'skills',
    title: 'Skills & Expertise',
    icon: <Code className="w-5 h-5 text-[#10a37f]" />,
    field: 'skills',
    component: 'SkillsSection',
    hasEditModal: true,
    defaultOrder: 3,
    hasData: (user: UserType) => !!(user.skills && user.skills.length > 0)
  },
  projects: {
    id: 'projects',
    title: 'Featured Projects',
    icon: <Award className="w-5 h-5 text-[#10a37f]" />,
    field: 'projects',
    component: 'ProjectsSection',
    hasEditModal: false,
    defaultOrder: 4,
    hasData: (user: UserType) => !!(user.projects && user.projects.length > 0)
  },
  education: {
    id: 'education',
    title: 'Education',
    icon: <BookOpen className="w-5 h-5 text-[#10a37f]" />,
    field: 'education',
    component: 'EducationSection',
    hasEditModal: false,
    defaultOrder: 5,
    hasData: (user: UserType) => !!(user.education && user.education.length > 0)
  },
  contact: {
    id: 'contact',
    title: 'Contact Information',
    icon: <User className="w-5 h-5 text-[#10a37f]" />,
    field: 'contact_info',
    component: 'ContactSection',
    hasEditModal: false,
    defaultOrder: 6,
    hasData: (user: UserType) => !!(user.contact_info && Object.values(user.contact_info).some(value => value))
  },
  languages: {
    id: 'languages',
    title: 'Languages',
    icon: <Globe className="w-5 h-5 text-[#10a37f]" />,
    field: 'languages',
    component: 'LanguagesSection',
    hasEditModal: false,
    defaultOrder: 7,
    hasData: (user: UserType) => !!(user.languages && user.languages.length > 0)
  },
  awards: {
    id: 'awards',
    title: 'Awards & Recognition',
    icon: <Award className="w-5 h-5 text-[#10a37f]" />,
    field: 'awards',
    component: 'AwardsSection',
    hasEditModal: false,
    defaultOrder: 8,
    hasData: (user: UserType) => !!(user.awards && user.awards.length > 0)
  },
  publications: {
    id: 'publications',
    title: 'Publications',
    icon: <FileText className="w-5 h-5 text-[#10a37f]" />,
    field: 'publications',
    component: 'PublicationsSection',
    hasEditModal: false,
    defaultOrder: 9,
    hasData: (user: UserType) => !!(user.publications && user.publications.length > 0)
  },
  volunteer: {
    id: 'volunteer',
    title: 'Volunteer Experience',
    icon: <Heart className="w-5 h-5 text-[#10a37f]" />,
    field: 'volunteer_experience',
    component: 'VolunteerSection',
    hasEditModal: false,
    defaultOrder: 10,
    hasData: (user: UserType) => !!(user.volunteer_experience && user.volunteer_experience.length > 0)
  },
  interests: {
    id: 'interests',
    title: 'Interests & Hobbies',
    icon: <Heart className="w-5 h-5 text-[#10a37f]" />,
    field: 'interests',
    component: 'InterestsSection',
    hasEditModal: false,
    defaultOrder: 11,
    hasData: (user: UserType) => !!(user.interests && user.interests.length > 0)
  },
  preferences: {
    id: 'preferences',
    title: 'Work Preferences',
    icon: <Settings className="w-5 h-5 text-[#10a37f]" />,
    field: 'work_preferences',
    component: 'PreferencesSection',
    hasEditModal: false,
    defaultOrder: 12,
    isPrivate: true,
    hasData: (user: UserType) => !!(user.work_preferences && (
      user.work_preferences.preferred_work_mode?.length > 0 ||
      user.work_preferences.preferred_employment_type?.length > 0 ||
      user.work_preferences.preferred_location ||
      user.work_preferences.notice_period ||
      user.work_preferences.availability ||
      user.current_salary ||
      user.expected_salary
    ))
  }
}

export const DEFAULT_SECTION_ORDER = Object.values(SECTION_REGISTRY)
  .filter(section => section.id !== 'preferences') // Exclude preferences as it's not draggable
  .sort((a, b) => a.defaultOrder - b.defaultOrder)
  .map(section => section.id)

// Helper function to check if a section has data
export const hasSectionData = (user: UserType, field: string): boolean => {
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
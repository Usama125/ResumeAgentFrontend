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
  Heart 
} from "lucide-react"

export interface SectionDefinition {
  id: string
  title: string
  icon: ReactNode
  field: keyof UserType | string
  component: any
  hasEditModal?: boolean
  defaultOrder: number
}

export const SECTION_REGISTRY: Record<string, SectionDefinition> = {
  about: {
    id: 'about',
    title: 'About Me',
    icon: <User className="w-5 h-5 text-[#10a37f]" />,
    field: 'summary',
    component: 'AboutSection',
    hasEditModal: true,
    defaultOrder: 1
  },
  experience: {
    id: 'experience',
    title: 'Professional Experience',
    icon: <Briefcase className="w-5 h-5 text-[#10a37f]" />,
    field: 'experience_details',
    component: 'ExperienceSection',
    hasEditModal: false,
    defaultOrder: 2
  },
  skills: {
    id: 'skills',
    title: 'Skills & Expertise',
    icon: <Code className="w-5 h-5 text-[#10a37f]" />,
    field: 'skills',
    component: 'SkillsSection',
    hasEditModal: true,
    defaultOrder: 3
  },
  projects: {
    id: 'projects',
    title: 'Featured Projects',
    icon: <Award className="w-5 h-5 text-[#10a37f]" />,
    field: 'projects',
    component: 'ProjectsSection',
    hasEditModal: false,
    defaultOrder: 4
  },
  education: {
    id: 'education',
    title: 'Education',
    icon: <BookOpen className="w-5 h-5 text-[#10a37f]" />,
    field: 'education',
    component: 'EducationSection',
    hasEditModal: false,
    defaultOrder: 5
  },
  contact: {
    id: 'contact',
    title: 'Contact Information',
    icon: <User className="w-5 h-5 text-[#10a37f]" />,
    field: 'contact_info',
    component: 'ContactSection',
    hasEditModal: false,
    defaultOrder: 6
  },
  languages: {
    id: 'languages',
    title: 'Languages',
    icon: <Globe className="w-5 h-5 text-[#10a37f]" />,
    field: 'languages',
    component: 'LanguagesSection',
    hasEditModal: false,
    defaultOrder: 7
  },
  awards: {
    id: 'awards',
    title: 'Awards & Recognition',
    icon: <Award className="w-5 h-5 text-[#10a37f]" />,
    field: 'awards',
    component: 'AwardsSection',
    hasEditModal: false,
    defaultOrder: 8
  },
  publications: {
    id: 'publications',
    title: 'Publications',
    icon: <FileText className="w-5 h-5 text-[#10a37f]" />,
    field: 'publications',
    component: 'PublicationsSection',
    hasEditModal: false,
    defaultOrder: 9
  },
  volunteer: {
    id: 'volunteer',
    title: 'Volunteer Experience',
    icon: <Heart className="w-5 h-5 text-[#10a37f]" />,
    field: 'volunteer_experience',
    component: 'VolunteerSection',
    hasEditModal: false,
    defaultOrder: 10
  },
  interests: {
    id: 'interests',
    title: 'Interests & Hobbies',
    icon: <Heart className="w-5 h-5 text-[#10a37f]" />,
    field: 'interests',
    component: 'InterestsSection',
    hasEditModal: false,
    defaultOrder: 11
  }
}

export const DEFAULT_SECTION_ORDER = Object.values(SECTION_REGISTRY)
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
    default:
      return false
  }
}
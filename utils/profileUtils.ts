import { User as UserType } from '@/types'

/**
 * Check if a user profile is completely empty (0% completion)
 * This checks all the main profile sections to determine if the profile has any meaningful data
 */
export const isProfileEmpty = (user: UserType): boolean => {
  // Check if any of the main profile sections have data
  const hasAbout = !!(user.summary && user.summary.trim())
  const hasSkills = !!(user.skills && user.skills.length > 0)
  const hasExperience = !!(user.experience_details && user.experience_details.length > 0)
  const hasProjects = !!(user.projects && user.projects.length > 0)
  const hasEducation = !!(user.education && user.education.length > 0)
  const hasContactInfo = !!(user.contact_info && Object.values(user.contact_info).some(value => value && value.toString().trim() !== ''))
  const hasLanguages = !!(user.languages && user.languages.length > 0)
  const hasAwards = !!(user.awards && user.awards.length > 0)
  const hasPublications = !!(user.publications && user.publications.length > 0)
  const hasVolunteerExperience = !!(user.volunteer_experience && user.volunteer_experience.length > 0)
  const hasInterests = !!(user.interests && user.interests.length > 0)

  // Debug logging
  console.log('isProfileEmpty Debug:', {
    user: {
      id: user.id,
      name: user.name,
      summary: user.summary,
      skills: user.skills?.length || 0,
      experience_details: user.experience_details?.length || 0,
      projects: user.projects?.length || 0,
      education: user.education?.length || 0,
      contact_info: user.contact_info,
      languages: user.languages?.length || 0,
      awards: user.awards?.length || 0,
      publications: user.publications?.length || 0,
      volunteer_experience: user.volunteer_experience?.length || 0,
      interests: user.interests?.length || 0
    },
    checks: {
      hasAbout,
      hasSkills,
      hasExperience,
      hasProjects,
      hasEducation,
      hasContactInfo,
      hasLanguages,
      hasAwards,
      hasPublications,
      hasVolunteerExperience,
      hasInterests
    }
  })

  // Profile is empty if none of the sections have data
  const isEmpty = !hasAbout && 
         !hasSkills && 
         !hasExperience && 
         !hasProjects && 
         !hasEducation && 
         !hasContactInfo && 
         !hasLanguages && 
         !hasAwards && 
         !hasPublications && 
         !hasVolunteerExperience && 
         !hasInterests

  console.log('isProfileEmpty result:', isEmpty)
  return isEmpty
}

import { User as UserType } from "@/types"
import { calculateProfileCompletion } from "./profileCompletion"

/**
 * Profile Score Validation Utility
 * Provides consistent validation logic for features that require a minimum profile score
 */

export interface ProfileScoreValidation {
  isValid: boolean
  score: number
  message: string
  completionData: {
    percentage: number
    totalSections: number
    completedSections: number
    emptySections: Array<{
      id: string
      title: string
      field: string
    }>
  }
}

const MINIMUM_PROFILE_SCORE = 50

/**
 * Validates if user's profile meets minimum score requirement (≥50)
 * Uses the same logic as calculateProfileCompletion for consistency
 */
export const validateProfileScore = (user: UserType): ProfileScoreValidation => {
  const completionData = calculateProfileCompletion(user)
  const score = completionData.percentage
  const isValid = score >= MINIMUM_PROFILE_SCORE

  let message = ""
  if (!isValid) {
    const missingCount = completionData.emptySections.length
    const totalSections = completionData.totalSections
    
    if (missingCount === 0) {
      message = `Your profile is ${score}% complete. Complete more sections to reach ${MINIMUM_PROFILE_SCORE}% and unlock this feature.`
    } else if (missingCount === 1) {
      message = `Your profile is ${score}% complete. Complete the "${completionData.emptySections[0].title}" section to reach ${MINIMUM_PROFILE_SCORE}% and unlock this feature.`
    } else if (missingCount <= 3) {
      const sectionNames = completionData.emptySections.slice(0, 3).map(s => s.title).join(", ")
      message = `Your profile is ${score}% complete. Complete ${missingCount} more sections (${sectionNames}) to reach ${MINIMUM_PROFILE_SCORE}% and unlock this feature.`
    } else {
      message = `Your profile is ${score}% complete. Complete ${missingCount} more sections to reach ${MINIMUM_PROFILE_SCORE}% and unlock this feature.`
    }
  }

  return {
    isValid,
    score,
    message,
    completionData
  }
}

/**
 * Gets a short validation message for UI components
 */
export const getProfileScoreMessage = (user: UserType): string => {
  return validateProfileScore(user).message
}

/**
 * Checks if user can access chat feature
 */
export const canAccessChat = (user: UserType): boolean => {
  return validateProfileScore(user).isValid
}

/**
 * Checks if user can access AI writer feature
 */
export const canAccessAIWriter = (user: UserType): boolean => {
  return validateProfileScore(user).isValid
}

/**
 * Gets the minimum required score
 */
export const getMinimumProfileScore = (): number => {
  return MINIMUM_PROFILE_SCORE
}

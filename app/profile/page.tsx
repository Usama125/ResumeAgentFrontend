"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { UserService, deleteProfileSection, updateProfileSection } from "@/services/user"
import { User as UserType } from "@/types"
import { useAuth } from "@/context/AuthContext"
import AuthService from "@/services/auth"
import EditProfileModal from "@/components/EditProfileModal"
import EditProfileModalMobile from "@/components/EditProfileModalMobile"
import EditPhotoModal from "@/components/EditPhotoModal"
import EditPhotoModalMobile from "@/components/EditPhotoModalMobile"
import Header from "@/components/Header"
import { useTheme } from "@/context/ThemeContext"
import { getThemeClasses } from "@/utils/theme"
import DesktopProfileView from "@/components/profile/DesktopProfileView"
import MobileProfileView from "@/components/profile/MobileProfileView"
import EditModeToggle from "@/components/EditModeToggle"
import AboutSectionEditModal from "@/components/AboutSectionEditModal"
import SkillsSectionEditModal from "@/components/SkillsSectionEditModal"
import ExperienceSectionEditModal from "@/components/ExperienceSectionEditModal"
import ProjectsSectionEditModal from "@/components/ProjectsSectionEditModal"
import EducationSectionEditModal from "@/components/EducationSectionEditModal"
import ContactSectionEditModal from "@/components/ContactSectionEditModal"
import LanguagesSectionEditModal from "@/components/LanguagesSectionEditModal"
import AwardsSectionEditModal from "@/components/AwardsSectionEditModal"
import PublicationsSectionEditModal from "@/components/PublicationsSectionEditModal"
import VolunteerExperienceSectionEditModal from "@/components/VolunteerExperienceSectionEditModal"
import InterestsSectionEditModal from "@/components/InterestsSectionEditModal"
import ConfirmationModal from "@/components/ConfirmationModal"
import useRateLimit from '@/hooks/useRateLimit'
import RateLimitModal from "@/components/RateLimitModal"
import { useToast } from "@/hooks/use-toast"
import PreferencesEditModal from "@/components/PreferencesEditModal"
import ShareProfileModal from "@/components/ShareProfileModal"
import { useAIChat } from "@/hooks/useAIChat"
import { useSettings } from "@/context/SettingsContext"


// Generate suggested questions based on user data
const generateSuggestedQuestions = (user: UserType): string[] => {
  const firstName = user.name.split(' ')[0];
  const topSkill = (user.skills && user.skills.length > 0) ? user.skills[0].name : 'technology';
  
  return [
    `What are my strongest technical skills?`,
    `Tell me about my experience with ${topSkill}`,
    `How can I improve my profile?`,
    `What kind of opportunities would suit me?`,
    `What makes me stand out as a candidate?`,
  ];
};

export default function CurrentUserProfilePage() {
  const [profileLoading, setProfileLoading] = useState(true)
  const [user, setUser] = useState<UserType | null>(null)
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([])
  
  // Initialize Rate Limit Hook (must be before useAIChat)
  const { showRateLimitModal, hideRateLimitModal, rateLimitState } = useRateLimit()
  
  // Initialize AI Chat Hook
  const {
    chatHistory,
    setChatHistory,
    input: message,
    setInput: setMessage,
    isLoading,
    handleSendMessage,
    clearChat,
    messageCount,
    messageLimit,
    currentStreamingMessage,
    isStreaming,
    showMessageLimitModal,
    handleMessageLimitModalConfirm,
    handleMessageLimitModalCancel
  } = useAIChat({
    profileData: user,
    context: 'self-profile',
    userId: user?.id,
    token: AuthService.getToken() || undefined,
    showRateLimitModal
  })
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isEditPhotoModalOpen, setIsEditPhotoModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isAboutEditModalOpen, setIsAboutEditModalOpen] = useState(false)
  const [isPreferencesEditModalOpen, setIsPreferencesEditModalOpen] = useState(false)
  const [isSkillsEditModalOpen, setIsSkillsEditModalOpen] = useState(false)
  const [isExperienceEditModalOpen, setIsExperienceEditModalOpen] = useState(false)
  const [experienceEditMode, setExperienceEditMode] = useState<'add' | 'edit'>('add')
  const [editingExperience, setEditingExperience] = useState<any | null>(null)
  const [editingExperienceIndex, setEditingExperienceIndex] = useState<number | null>(null)
  const [deleteExperienceConfirm, setDeleteExperienceConfirm] = useState<{
    isOpen: boolean
    experienceIndex: number | null
    experienceTitle: string
  }>({
    isOpen: false,
    experienceIndex: null,
    experienceTitle: ""
  })
  const [isProjectsEditModalOpen, setIsProjectsEditModalOpen] = useState(false)
  const [projectsEditMode, setProjectsEditMode] = useState<'add' | 'edit'>('add')
  const [editingProject, setEditingProject] = useState<any | null>(null)
  const [editingProjectIndex, setEditingProjectIndex] = useState<number | null>(null)
  const [deleteProjectConfirm, setDeleteProjectConfirm] = useState<{
    isOpen: boolean
    projectIndex: number | null
    projectTitle: string
  }>({
    isOpen: false,
    projectIndex: null,
    projectTitle: ""
  })
  const [isEducationEditModalOpen, setIsEducationEditModalOpen] = useState(false)
  const [educationEditMode, setEducationEditMode] = useState<'add' | 'edit'>('add')
  const [editingEducation, setEditingEducation] = useState<any | null>(null)
  const [editingEducationIndex, setEditingEducationIndex] = useState<number | null>(null)
  const [deleteEducationConfirm, setDeleteEducationConfirm] = useState<{
    isOpen: boolean
    educationIndex: number | null
    educationTitle: string
  }>({
    isOpen: false,
    educationIndex: null,
    educationTitle: ""
  })
  const [isContactEditModalOpen, setIsContactEditModalOpen] = useState(false)

  // Languages modal state
  const [isLanguagesEditModalOpen, setIsLanguagesEditModalOpen] = useState(false)
  const [languagesEditMode, setLanguagesEditMode] = useState<'add' | 'edit'>('add')
  const [editingLanguage, setEditingLanguage] = useState<any>(null)
  const [editingLanguageIndex, setEditingLanguageIndex] = useState<number | null>(null)
  const [deleteLanguageConfirm, setDeleteLanguageConfirm] = useState(false)

  // Awards modal state
  const [isAwardsEditModalOpen, setIsAwardsEditModalOpen] = useState(false)
  const [awardsEditMode, setAwardsEditMode] = useState<'add' | 'edit'>('add')
  const [editingAward, setEditingAward] = useState<any>(null)
  const [editingAwardIndex, setEditingAwardIndex] = useState<number | null>(null)
  const [deleteAwardConfirm, setDeleteAwardConfirm] = useState(false)

  // Publications modal state
  const [isPublicationsEditModalOpen, setIsPublicationsEditModalOpen] = useState(false)
  const [publicationsEditMode, setPublicationsEditMode] = useState<'add' | 'edit'>('add')
  const [editingPublication, setEditingPublication] = useState<any>(null)
  const [editingPublicationIndex, setEditingPublicationIndex] = useState<number | null>(null)
  const [deletePublicationConfirm, setDeletePublicationConfirm] = useState<{
    isOpen: boolean
    publicationIndex: number | null
    publicationTitle: string
  }>({
    isOpen: false,
    publicationIndex: null,
    publicationTitle: ""
  })

  // Volunteer Experience modal state
  const [isVolunteerExperienceEditModalOpen, setIsVolunteerExperienceEditModalOpen] = useState(false)
  const [volunteerExperienceEditMode, setVolunteerExperienceEditMode] = useState<'add' | 'edit'>('add')
  const [editingVolunteerExperience, setEditingVolunteerExperience] = useState<any>(null)
  const [editingVolunteerExperienceIndex, setEditingVolunteerExperienceIndex] = useState<number | null>(null)
  const [deleteVolunteerExperienceConfirm, setDeleteVolunteerExperienceConfirm] = useState<{
    isOpen: boolean
    volunteerExperienceIndex: number | null
    volunteerExperienceTitle: string
  }>({
    isOpen: false,
    volunteerExperienceIndex: null,
    volunteerExperienceTitle: ""
  })

  // Interests modal state
  const [isInterestsEditModalOpen, setIsInterestsEditModalOpen] = useState(false)
  const [interestsEditMode, setInterestsEditMode] = useState<'add' | 'edit'>('add')
  const [isShareProfileModalOpen, setIsShareProfileModalOpen] = useState(false)

  const [sectionOrder, setSectionOrder] = useState<string[]>([])
  const [isMounted, setIsMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [authTimeout, setAuthTimeout] = useState(false)

  // Modal update handlers
  const handleAboutUpdate = async (newSummary: string) => {
    if (user) {
      updateUser({ ...user, summary: newSummary });
      await refreshUser();
    }
  };

  const handleSkillsUpdate = async (newSkills: any[]) => {
    if (user) {
      updateUser({ ...user, skills: newSkills });
      await refreshUser();
    }
  };

  const handleExperienceUpdate = async (newExperiences: any[]) => {
    if (user) {
      updateUser({ ...user, experience_details: newExperiences });
      await refreshUser();
    }
  };

  const handlePhotoUpdate = async (newPhotoUrl: string | null) => {
    if (user) {
      updateUser({ ...user, profile_picture: newPhotoUrl });
      await refreshUser();
    }
  };

  // Wrapper for setMessage to match React.Dispatch<React.SetStateAction<string>> signature
  const handleSetMessage = useCallback((value: React.SetStateAction<string>) => {
    const newValue = typeof value === 'function' ? value(message) : value;
    setMessage(newValue);
  }, [message, setMessage]);
  
  // Section order change handler state
  const [pendingSectionOrder, setPendingSectionOrder] = useState<string[] | null>(null)
  const [isUpdatingSectionOrder, setIsUpdatingSectionOrder] = useState(false)
  const router = useRouter()
  const { user: authUser, isAuthenticated, loading: authLoading, refreshUser, updateUser } = useAuth()
  const { isDark } = useTheme()
  const { toast } = useToast()
  const { openProfileSettings } = useSettings()

  // Get search params to detect onboarding flow
  const searchParams = useSearchParams()
  const isFromOnboarding = searchParams.get('edit') === 'true'

  // Projects handlers - moved to top level to follow Rules of Hooks
  const handleAddProject = useCallback(() => {
    console.log('handleAddProject called')
    setProjectsEditMode('add')
    setEditingProject(null)
    setEditingProjectIndex(null)
    setIsProjectsEditModalOpen(true)
  }, [])

  const handleEditProject = useCallback((index: number) => {
    if (user && user.projects && user.projects[index]) {
      setProjectsEditMode('edit')
      setEditingProject(user.projects[index])
      setEditingProjectIndex(index)
      setIsProjectsEditModalOpen(true)
    }
  }, [user])

  const handleDeleteSingleProject = useCallback((index: number) => {
    if (!user || !user.projects || !user.projects[index]) return
    
    const project = user.projects[index]
    setDeleteProjectConfirm({
      isOpen: true,
      projectIndex: index,
      projectTitle: project.name
    })
  }, [user])

  const handleProjectsDelete = useCallback(async () => {
    if (!user) return
    
    try {
      // Call API to delete projects section
      await deleteProfileSection("projects")
      
      // Update local state
      setUser({
        ...user,
        projects: []
      })
      
      // Update global auth context
      updateUser({ projects: [] })
      
      // Show success toast
      toast({
        title: "Success",
        description: "Projects section deleted successfully",
      })
      
      console.log('✅ Projects section deleted successfully')
    } catch (error: any) {
      console.error('❌ Error deleting projects section:', error)
      
      // Show error toast
      toast({
        title: "Error",
        description: error.message || "Failed to delete projects section",
        variant: "destructive"
      })
    }
  }, [user, updateUser, toast])

  // Education handlers - moved to top level to follow Rules of Hooks
  const handleAddEducation = useCallback(() => {
    setEducationEditMode('add')
    setEditingEducation(null)
    setEditingEducationIndex(null)
    setIsEducationEditModalOpen(true)
  }, [])

  const handleEditEducation = useCallback((index: number) => {
    if (!user?.education) return
    
    setEducationEditMode('edit')
    setEditingEducation(user.education[index])
    setEditingEducationIndex(index)
    setIsEducationEditModalOpen(true)
  }, [user])

  const handleDeleteSingleEducation = useCallback((index: number) => {
    if (!user?.education) return
    
    const education = user.education[index]
    setDeleteEducationConfirm({
      isOpen: true,
      educationIndex: index,
      educationTitle: education.degree || education.institution
    })
  }, [user])

  const confirmDeleteEducation = useCallback(async () => {
    if (!user || deleteEducationConfirm.educationIndex === null) return

    try {
      const updatedEducation = user.education.filter((_, index) => index !== deleteEducationConfirm.educationIndex)
      
      await updateProfileSection("education", { education: updatedEducation })
      
      // Update frontend state
      setUser({ ...user, education: updatedEducation })
      updateUser({ education: updatedEducation })
      
      toast({
        title: "Success",
        description: "Education deleted successfully",
      })
    } catch (error: any) {
      console.error("Error deleting education:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete education",
        variant: "destructive"
      })
    } finally {
      setDeleteEducationConfirm({
        isOpen: false,
        educationIndex: null,
        educationTitle: ""
      })
    }
  }, [user, deleteEducationConfirm, updateUser, toast])

  const handleEducationUpdate = useCallback((newEducation: any[]) => {
    if (!user) return
    
    setUser({ ...user, education: newEducation })
    updateUser({ education: newEducation })
  }, [user, updateUser])

  const handleEducationDelete = useCallback(async () => {
    if (!user) return

    try {
      await deleteProfileSection("education")
      
      // Update frontend state
      setUser({ ...user, education: [] })
      updateUser({ education: [] })
      
      toast({
        title: "Success",
        description: "Education section deleted successfully",
      })
    } catch (error: any) {
      console.error("Error deleting education section:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete education section",
        variant: "destructive"
      })
    }
  }, [user, updateUser, toast])

  // Contact handlers
  const handleEditContact = useCallback(() => {
    setIsContactEditModalOpen(true)
  }, [])

  const handleContactUpdate = useCallback((newContactInfo: any) => {
    if (!user) return
    
    // The modal now handles both contact info and basic info updates
    // The basic info is updated directly in the modal, so we only need to handle contact info here
    setUser({ ...user, contact_info: newContactInfo })
    updateUser({ contact_info: newContactInfo })
  }, [user, updateUser])

  const handleContactDelete = useCallback(async () => {
    if (!user) return

    try {
      await deleteProfileSection("contact")
      
      // Update frontend state
      setUser({ ...user, contact_info: {} })
      updateUser({ contact_info: {} })
      
      toast({
        title: "Success",
        description: "Contact information deleted successfully",
      })
    } catch (error: any) {
      console.error("Error deleting contact information:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete contact information",
        variant: "destructive"
      })
    }
  }, [user, updateUser, toast])

  // Languages handlers
  const handleAddLanguage = useCallback(() => {
    setLanguagesEditMode('add')
    setEditingLanguage(null)
    setEditingLanguageIndex(null)
    setIsLanguagesEditModalOpen(true)
  }, [])

  const handleEditLanguage = useCallback((index: number) => {
    if (!user?.languages) return
    
    setLanguagesEditMode('edit')
    setEditingLanguage(user.languages[index])
    setEditingLanguageIndex(index)
    setIsLanguagesEditModalOpen(true)
  }, [user])

  const handleDeleteSingleLanguage = useCallback((index: number) => {
    if (!user || !user.languages || !user.languages[index]) return
    
    const language = user.languages[index]
    setDeleteLanguageConfirm(true)
    setEditingLanguageIndex(index)
  }, [user])

  const confirmDeleteLanguage = useCallback(async () => {
    if (!user || editingLanguageIndex === null) return
    
    try {
      const updatedLanguages = user.languages.filter((_, index) => index !== editingLanguageIndex)
      await updateProfileSection("languages", { languages: updatedLanguages })
      
      setUser({ ...user, languages: updatedLanguages })
      updateUser({ languages: updatedLanguages })
      
      toast({
        title: "Success",
        description: "Language deleted successfully",
      })
      
      setDeleteLanguageConfirm(false)
      setEditingLanguageIndex(null)
    } catch (error: any) {
      console.error("Error deleting language:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete language",
        variant: "destructive"
      })
    }
  }, [user, editingLanguageIndex, updateUser, toast])

  const handleLanguagesUpdate = useCallback((newLanguages: any[]) => {
    if (!user) return
    setUser({ ...user, languages: newLanguages })
    updateUser({ languages: newLanguages })
  }, [user, updateUser])

  const handleLanguagesDelete = useCallback(async () => {
    if (!user) return
    
    try {
      await deleteProfileSection("languages")
      setUser({ ...user, languages: [] })
      updateUser({ languages: [] })
      toast({
        title: "Success",
        description: "Languages section deleted successfully",
      })
    } catch (error: any) {
      console.error("Error deleting languages section:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete languages section",
        variant: "destructive"
      })
    }
  }, [user, updateUser, toast])

  // Awards handlers
  const handleAddAward = useCallback(() => {
    setAwardsEditMode('add')
    setEditingAward(null)
    setEditingAwardIndex(null)
    setIsAwardsEditModalOpen(true)
  }, [])

  const handleEditAward = useCallback((index: number) => {
    if (!user?.awards) return
    
    setAwardsEditMode('edit')
    setEditingAward(user.awards[index])
    setEditingAwardIndex(index)
    setIsAwardsEditModalOpen(true)
  }, [user])

  const handleDeleteSingleAward = useCallback((index: number) => {
    if (!user || !user.awards || !user.awards[index]) return
    
    const award = user.awards[index]
    setDeleteAwardConfirm(true)
    setEditingAwardIndex(index)
  }, [user])

  const confirmDeleteAward = useCallback(async () => {
    if (!user || editingAwardIndex === null) return
    
    try {
      const updatedAwards = user.awards.filter((_, index) => index !== editingAwardIndex)
      await updateProfileSection("awards", { awards: updatedAwards })
      
      setUser({ ...user, awards: updatedAwards })
      updateUser({ awards: updatedAwards })
      
      toast({
        title: "Success",
        description: "Award deleted successfully",
      })
      
      setDeleteAwardConfirm(false)
      setEditingAwardIndex(null)
    } catch (error: any) {
      console.error("Error deleting award:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete award",
        variant: "destructive"
      })
    }
  }, [user, editingAwardIndex, updateUser, toast])

  const handleAwardsUpdate = useCallback((newAwards: any[]) => {
    if (!user) return
    setUser({ ...user, awards: newAwards })
    updateUser({ awards: newAwards })
  }, [user, updateUser])

  const handleAwardsDelete = useCallback(async () => {
    if (!user) return
    
    try {
      await deleteProfileSection("awards")
      setUser({ ...user, awards: [] })
      updateUser({ awards: [] })
      toast({
        title: "Success",
        description: "Awards section deleted successfully",
      })
    } catch (error: any) {
      console.error("Error deleting awards section:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete awards section",
        variant: "destructive"
      })
    }
  }, [user, updateUser, toast])

  // Publications handlers
  const handleAddPublication = useCallback(() => {
    setPublicationsEditMode('add')
    setEditingPublication(null)
    setEditingPublicationIndex(null)
    setIsPublicationsEditModalOpen(true)
  }, [])

  const handleEditPublication = useCallback((index: number) => {
    if (!user?.publications) return
    
    setPublicationsEditMode('edit')
    setEditingPublication(user.publications[index])
    setEditingPublicationIndex(index)
    setIsPublicationsEditModalOpen(true)
  }, [user])

  const handleDeleteSinglePublication = useCallback((index: number) => {
    if (!user || !user.publications || !user.publications[index]) return
    
    const publication = user.publications[index]
    setDeletePublicationConfirm({
      isOpen: true,
      publicationIndex: index,
      publicationTitle: publication.title
    })
  }, [user])

  const confirmDeletePublication = useCallback(async () => {
    if (!user || deletePublicationConfirm.publicationIndex === null) return

    try {
      const updatedPublications = user.publications.filter((_, index) => index !== deletePublicationConfirm.publicationIndex)
      
      await updateProfileSection("publications", { publications: updatedPublications })
      
      // Update frontend state
      setUser({ ...user, publications: updatedPublications })
      updateUser({ publications: updatedPublications })
      
      toast({
        title: "Success",
        description: "Publication deleted successfully",
      })
    } catch (error: any) {
      console.error("Error deleting publication:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete publication",
        variant: "destructive"
      })
    } finally {
      setDeletePublicationConfirm({
        isOpen: false,
        publicationIndex: null,
        publicationTitle: ""
      })
    }
  }, [user, deletePublicationConfirm, updateUser, toast])

  const handlePublicationsUpdate = useCallback((newPublications: any[]) => {
    if (!user) return
    
    setUser({ ...user, publications: newPublications })
    updateUser({ publications: newPublications })
  }, [user, updateUser])

  const handlePublicationsDelete = useCallback(async () => {
    if (!user) return

    try {
      await deleteProfileSection("publications")
      
      // Update frontend state
      setUser({ ...user, publications: [] })
      updateUser({ publications: [] })
      
      toast({
        title: "Success",
        description: "Publications section deleted successfully",
      })
    } catch (error: any) {
      console.error("Error deleting publications section:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete publications section",
        variant: "destructive"
      })
    }
  }, [user, updateUser, toast])

  // Volunteer Experience handlers
  const handleAddVolunteerExperience = useCallback(() => {
    setVolunteerExperienceEditMode('add')
    setEditingVolunteerExperience(null)
    setEditingVolunteerExperienceIndex(null)
    setIsVolunteerExperienceEditModalOpen(true)
  }, [])

  const handleEditVolunteerExperience = useCallback((index: number) => {
    if (!user?.volunteer_experience) return
    
    setVolunteerExperienceEditMode('edit')
    setEditingVolunteerExperience(user.volunteer_experience[index])
    setEditingVolunteerExperienceIndex(index)
    setIsVolunteerExperienceEditModalOpen(true)
  }, [user])

  const handleDeleteSingleVolunteerExperience = useCallback((index: number) => {
    if (!user || !user.volunteer_experience || !user.volunteer_experience[index]) return
    
    const volunteerExperience = user.volunteer_experience[index]
    setDeleteVolunteerExperienceConfirm({
      isOpen: true,
      volunteerExperienceIndex: index,
      volunteerExperienceTitle: volunteerExperience.role
    })
  }, [user])

  const confirmDeleteVolunteerExperience = useCallback(async () => {
    if (!user || deleteVolunteerExperienceConfirm.volunteerExperienceIndex === null) return

    try {
      const updatedVolunteerExperience = user.volunteer_experience.filter((_, index) => index !== deleteVolunteerExperienceConfirm.volunteerExperienceIndex)
      
      await updateProfileSection("volunteer", { volunteer_experience: updatedVolunteerExperience })
      
      // Update frontend state
      setUser({ ...user, volunteer_experience: updatedVolunteerExperience })
      updateUser({ volunteer_experience: updatedVolunteerExperience })
      
      toast({
        title: "Success",
        description: "Volunteer experience deleted successfully",
      })
    } catch (error: any) {
      console.error("Error deleting volunteer experience:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete volunteer experience",
        variant: "destructive"
      })
    } finally {
      setDeleteVolunteerExperienceConfirm({
        isOpen: false,
        volunteerExperienceIndex: null,
        volunteerExperienceTitle: ""
      })
    }
  }, [user, deleteVolunteerExperienceConfirm, updateUser, toast])

  const handleVolunteerExperienceUpdate = useCallback((newVolunteerExperience: any[]) => {
    if (!user) return
    
    setUser({ ...user, volunteer_experience: newVolunteerExperience })
    updateUser({ volunteer_experience: newVolunteerExperience })
  }, [user, updateUser])

  const handleVolunteerExperiencesDelete = useCallback(async () => {
    if (!user) return

    try {
      await deleteProfileSection("volunteer")
      
      // Update frontend state
      setUser({ ...user, volunteer_experience: [] })
      updateUser({ volunteer_experience: [] })
      
      toast({
        title: "Success",
        description: "Volunteer experience section deleted successfully",
      })
    } catch (error: any) {
      console.error("Error deleting volunteer experience section:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete volunteer experience section",
        variant: "destructive"
      })
    }
  }, [user, updateUser, toast])

  // Interests handlers
  const handleAddInterests = useCallback(() => {
    setInterestsEditMode('add')
    setIsInterestsEditModalOpen(true)
  }, [])

  const handleEditInterests = useCallback(() => {
    setInterestsEditMode('edit')
    setIsInterestsEditModalOpen(true)
  }, [])

  const handleInterestsUpdate = useCallback((newInterests: string[]) => {
    if (!user) return
    
    setUser({ ...user, interests: newInterests })
    updateUser({ interests: newInterests })
  }, [user, updateUser])

  const handleInterestsDelete = useCallback(async () => {
    if (!user) return

    try {
      await deleteProfileSection("interests")
      
      // Update frontend state
      setUser({ ...user, interests: [] })
      updateUser({ interests: [] })
      
      toast({
        title: "Success",
        description: "Interests section deleted successfully",
      })
    } catch (error: any) {
      console.error("Error deleting interests section:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete interests section",
        variant: "destructive"
      })
    }
  }, [user, updateUser, toast])


  // Use ref to track updating state to prevent dependency issues
  const isUpdatingRef = useRef(false)

  // Handle section order change
  const handleSectionOrderChange = useCallback(async (newSectionOrder: string[]) => {
    console.log('🎯 handleSectionOrderChange called with:', newSectionOrder)
    console.log('🎯 Current isUpdatingRef.current:', isUpdatingRef.current)
    console.log('🎯 Current isMobile:', isMobile)
    
    if (!user) return
    
    // Set pending order immediately for UI responsiveness
    setPendingSectionOrder(newSectionOrder)
    
    // If already updating, don't start another update
    if (isUpdatingRef.current) {
      console.log('🔄 Already updating section order, skipping duplicate call')
      return
    }
    
    isUpdatingRef.current = true
    setIsUpdatingSectionOrder(true)
    
    console.log('🔧 Attempting to update section order:', newSectionOrder)
    
    try {
      // Save to backend first, then update local state
      await UserService.reorderSections(newSectionOrder)
      
      // Update both local state and auth context
      setSectionOrder(newSectionOrder)
      updateUser({ section_order: newSectionOrder })
      setPendingSectionOrder(null)
      
      console.log('✅ Section order updated successfully:', newSectionOrder)
      
      // Show success toast
      toast({
        title: "Success",
        description: "Section order updated successfully",
      })
    } catch (error: any) {
      console.error('❌ Error updating section order:', error)
      console.error('❌ Full error details:', error)
      
      // Log the exact request and response for debugging
      if (error.detail) {
        console.error('❌ Backend error detail:', error.detail)
      }
      if (error.responseData) {
        console.error('❌ Backend response:', error.responseData)
      }
      
      // Let's try to inspect the exact array we're sending
      console.error('❌ Exact array sent:', JSON.stringify(newSectionOrder))
      console.error('❌ Array length:', newSectionOrder.length)
      newSectionOrder.forEach((section, index) => {
        console.error(`❌ Section ${index}: "${section}" (length: ${section.length})`)
      })
      
      // Show error toast
      toast({
        title: "Error",
        description: error.detail || "Failed to update section order",
        variant: "destructive"
      })
    } finally {
      isUpdatingRef.current = false
      setIsUpdatingSectionOrder(false)
    }
  }, [user, setSectionOrder, updateUser, toast])

  // Handle client-side mounting to prevent hydration issues
  useEffect(() => {
    setIsMounted(true)
    
    // Simple mobile detection
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Add timeout for auth loading to prevent indefinite waiting
  useEffect(() => {
    if (authLoading) {
      const timeout = setTimeout(() => {
        console.log('🕐 PROFILE PAGE - Auth loading timeout after 8 seconds');
        setAuthTimeout(true);
      }, 8000); // 8 second timeout

      return () => clearTimeout(timeout);
    } else {
      setAuthTimeout(false);
    }
  }, [authLoading])

  // Protect route - redirect to auth if not authenticated
  useEffect(() => {
    console.log('🔍 PROFILE PAGE - Auth check useEffect triggered', {
      authLoading,
      isAuthenticated,
      userExists: !!authUser,
      userId: authUser?.id
    });
    
    // Don't redirect while auth is still loading (unless timeout occurred)
    if (authLoading && !authTimeout) {
      console.log('🔍 PROFILE PAGE - Auth still loading, waiting...');
      return;
    }

    if (authTimeout) {
      console.log('🕐 PROFILE PAGE - Auth loading timeout, proceeding with available data');
    }
    
    if (!isAuthenticated) {
      console.log('🚨 PROFILE PAGE - User not authenticated, redirecting to auth page');
      router.push("/auth")
      return
    }
    
    console.log('🔍 PROFILE PAGE - User is authenticated');
  }, [authLoading, authTimeout, isAuthenticated, router])

  // Protect route - redirect to onboarding if not completed
  useEffect(() => {
    console.log('🔍 PROFILE PAGE - Onboarding check useEffect triggered', {
      authLoading,
      isAuthenticated,
      userExists: !!authUser,
      onboarding_completed: authUser?.onboarding_completed,
      progress_completed: authUser?.onboarding_progress?.completed,
      userId: authUser?.id
    });
    
    // Don't check onboarding while auth is still loading (unless timeout occurred)
    if (authLoading && !authTimeout) {
      console.log('🔍 PROFILE PAGE - Auth still loading, skipping onboarding check...');
      return;
    }
    
    if (isAuthenticated && authUser) {
      // Clean onboarding status check - only check the dedicated fields
      const needsOnboarding = !authUser.onboarding_completed && !authUser.onboarding_skipped;
      
      console.log('🔍 PROFILE PAGE - Onboarding completion check:', { 
        needsOnboarding,
        onboarding_completed: authUser.onboarding_completed,
        onboarding_skipped: authUser.onboarding_skipped
      });
      
      if (needsOnboarding) {
        console.log('🚨 PROFILE PAGE - User needs onboarding, redirecting to onboarding');
        router.push("/onboarding")
        return
      }
      
      console.log('🔍 PROFILE PAGE - User onboarding completed or skipped, staying on profile page');
    } else if (!authLoading) {
      console.log('🔍 PROFILE PAGE - Not authenticated or no user data (auth loading complete)');
    }
  }, [authLoading, authTimeout, isAuthenticated, authUser, router])

  // Optimized user data fetching - use auth context data directly to avoid duplicate API calls
  useEffect(() => {
    const initializeUserData = () => {
      if (!isAuthenticated || !authUser) {
        return;
      }
      
      // Use auth context data directly since it's already fresh from AuthContext
      setUser(authUser)
      setSuggestedQuestions(generateSuggestedQuestions(authUser))
      setProfileLoading(false)
      
      // Set edit mode if coming from onboarding
      if (isFromOnboarding) {
        setIsEditMode(true)
      }
    }

    // Initialize user data when auth is ready (including timeout scenario)
    if (isAuthenticated && authUser && (!authLoading || authTimeout)) {
      initializeUserData()
    }
  }, [isAuthenticated, authUser, authLoading, authTimeout, isFromOnboarding])

  // Preload AI analysis in background (non-blocking)
  useEffect(() => {
    if (user && isAuthenticated) {
      // Preload AI analysis in background without blocking UI
      const preloadAIAnalysis = async () => {
        try {
          const token = AuthService.getToken()
          if (token) {
            // This runs in background, doesn't block UI
            UserService.getAIAnalysis('/users/me/ai-analysis', token).catch(() => {
              // Silently fail - this is just preloading
            })
          }
        } catch (error) {
          // Silently fail - this is just preloading
        }
      }
      
      // Delay preloading to not interfere with initial load
      setTimeout(preloadAIAnalysis, 2000)
    }
  }, [user, isAuthenticated])

  // Optimized loading check - minimize loading states and flicker
  // Since resume upload is now optional, we also consider onboarding completed if user has basic profile info
  const isOnboardingCompleted = authUser?.onboarding_completed || 
                               authUser?.onboarding_progress?.completed ||
                               (authUser?.name && authUser?.email);
  
  // Only show loading if:
  // 1. Component hasn't mounted yet
  // 2. Auth is loading AND we haven't timed out
  // 3. We have a valid user but profile data is still loading
  const shouldShowLoading = !isMounted || 
    (authLoading && !authTimeout) || 
    (!isAuthenticated && !authTimeout) ||
    (isAuthenticated && authUser && isOnboardingCompleted && profileLoading && !user);

  
  if (shouldShowLoading) {
    // CSS-based theme-aware loading screen that works immediately
    return (
      <div className="loading-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-[#10a37f]/30 border-t-[#10a37f] rounded-full animate-spin"></div>
          <p className="loading-text">
            {!isMounted ? "Initializing..." 
             : authLoading ? "Loading..." 
             : !isAuthenticated ? "Checking authentication..." 
             : (authUser && !isOnboardingCompleted) ? "Redirecting..." 
             : "Loading your profile..."}
          </p>
        </div>
      </div>
    )
  }
  
  // Don't render content if user data is not available yet
  if (!user) {
    return null;
  }


  // Chat function is now handled by useAIChat hook




  const handleAboutDelete = async () => {
    if (!user) return
    
    try {
      const updatedUser = await deleteProfileSection('about')
      
      // Update local state
      setUser({
        ...user,
        summary: ''
      })
      
      // Update global auth context
      updateUser({ summary: '' })
      
      console.log('✅ About section deleted successfully')
    } catch (error) {
      console.error('❌ Error deleting about section:', error)
    }
  }

  const handleSkillsDelete = async () => {
    if (!user) return
    
    try {
      const updatedUser = await deleteProfileSection('skills')
      
      // Update local state
      setUser({
        ...user,
        skills: []
      })
      
      // Update global auth context
      updateUser({ skills: [] })
      
      console.log('✅ Skills section deleted successfully')
    } catch (error) {
      console.error('❌ Error deleting skills section:', error)
    }
  }

  const handleExperienceDelete = async () => {
    if (!user) return
    
    try {
      const updatedUser = await deleteProfileSection('experience')
      
      // Update local state
      setUser({
        ...user,
        experience_details: []
      })
      
      // Update global auth context
      updateUser({ experience_details: [] })
      
      // Show success toast
      toast({
        title: "Success",
        description: "Experience section deleted successfully",
      })
      
      console.log('✅ Experience section deleted successfully')
    } catch (error: any) {
      console.error('❌ Error deleting experience section:', error)
      
      // Show error toast
      toast({
        title: "Error",
        description: error.message || "Failed to delete experience section",
        variant: "destructive"
      })
    }
  }

  const handleAddExperience = () => {
    setExperienceEditMode('add')
    setEditingExperience(null)
    setEditingExperienceIndex(null)
    setIsExperienceEditModalOpen(true)
  }

  const handleEditExperience = (index: number) => {
    if (user && user.experience_details && user.experience_details[index]) {
      setExperienceEditMode('edit')
      setEditingExperience(user.experience_details[index])
      setEditingExperienceIndex(index)
      setIsExperienceEditModalOpen(true)
    }
  }

  const handleDeleteSingleExperience = (index: number) => {
    if (!user || !user.experience_details || !user.experience_details[index]) return
    
    const experience = user.experience_details[index]
    setDeleteExperienceConfirm({
      isOpen: true,
      experienceIndex: index,
      experienceTitle: `${experience.position} at ${experience.company}`
    })
  }

  const confirmDeleteExperience = async () => {
    if (!user || !user.experience_details || deleteExperienceConfirm.experienceIndex === null) return
    
    try {
      const updatedExperiences = user.experience_details.filter((_, i) => i !== deleteExperienceConfirm.experienceIndex)
      
      // Call API to update experiences
      await updateProfileSection("experience", { experience_details: updatedExperiences })
      
      // Update local state
      setUser({
        ...user,
        experience_details: updatedExperiences
      })
      
      // Update global auth context
      updateUser({ experience_details: updatedExperiences })
      
      // Show success toast
      toast({
        title: "Success",
        description: "Experience deleted successfully",
      })
      
      console.log('✅ Experience deleted successfully')
    } catch (error: any) {
      console.error('❌ Error deleting experience:', error)
      
      // Show error toast
      toast({
        title: "Error",
        description: error.message || "Failed to delete experience",
        variant: "destructive"
      })
    } finally {
      setDeleteExperienceConfirm({
        isOpen: false,
        experienceIndex: null,
        experienceTitle: ""
      })
    }
  }



  const confirmDeleteProject = async () => {
    if (!user || !user.projects || deleteProjectConfirm.projectIndex === null) return
    
    try {
      const updatedProjects = user.projects.filter((_, i) => i !== deleteProjectConfirm.projectIndex)
      
      // Call API to update projects
      await updateProfileSection("projects", { projects: updatedProjects })
      
      // Update local state
      setUser({
        ...user,
        projects: updatedProjects
      })
      
      // Update global auth context
      updateUser({ projects: updatedProjects })
      
      // Show success toast
      toast({
        title: "Success",
        description: "Project deleted successfully",
      })
      
      console.log('✅ Project deleted successfully')
    } catch (error: any) {
      console.error('❌ Error deleting project:', error)
      
      // Show error toast
      toast({
        title: "Error",
        description: error.message || "Failed to delete project",
        variant: "destructive"
      })
    } finally {
      setDeleteProjectConfirm({
        isOpen: false,
        projectIndex: null,
        projectTitle: ""
      })
    }
  }

  const handleProjectsUpdate = (newProjects: any[]) => {
    if (user) {
      setUser({
        ...user,
        projects: newProjects
      })
    }
  }

  const handleEditModeToggle = (newEditMode: boolean, shouldShowChat?: boolean) => {
    setIsEditMode(newEditMode)
    // Pass chat visibility control to child components
  }

  const handleAddSection = (sectionId: string) => {
    console.log('Add section:', sectionId)
    
    // Add the section to the user's section order if it doesn't exist
    if (user) {
      const currentOrder = user.section_order || ['about', 'skills', 'experience', 'projects', 'education', 'awards', 'languages', 'publications', 'volunteer', 'interests']
      if (!currentOrder.includes(sectionId)) {
        const newOrder = [...currentOrder, sectionId]
        setSectionOrder(newOrder)
        
        // Save to backend
        UserService.reorderSections(newOrder).then(() => {
          updateUser({ section_order: newOrder })
          console.log(`Section ${sectionId} added to profile`)
        }).catch(error => {
          console.error('Error updating section order:', error)
        })
      }
    }
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#212121] text-white' : 'bg-gray-50 text-gray-900'} overflow-x-hidden`}>
      <Header 
        variant="profile"
        showBackButton={true}
        onEditProfile={() => setIsEditModalOpen(true)}
        profileData={{
          name: user?.name || '',
          profile_picture: user?.profile_picture || '',
          is_looking_for_job: user?.is_looking_for_job
        }}
        isCurrentUserProfile={true}
      />

      {/* Main Content */}
      {isMobile ? (
                    <MobileProfileView
              user={user}
              chatHistory={chatHistory}
              setChatHistory={setChatHistory}
              suggestedQuestions={suggestedQuestions}
              message={message}
              setMessage={handleSetMessage}
              isLoading={isLoading}
              handleSendMessage={handleSendMessage}
              isCurrentUser={true}
              currentStreamingMessage={currentStreamingMessage}
              isStreaming={isStreaming}
              messageCount={messageCount}
              messageLimit={messageLimit}
              showMessageLimitModal={showMessageLimitModal}
              handleMessageLimitModalConfirm={handleMessageLimitModalConfirm}
              handleMessageLimitModalCancel={handleMessageLimitModalCancel}
              clearChat={clearChat}
              onEditPhoto={() => setIsEditPhotoModalOpen(true)}
              isEditMode={isEditMode}
              onEditAbout={() => setIsAboutEditModalOpen(true)}
              onEditSkills={() => setIsSkillsEditModalOpen(true)}
              onEditPreferences={() => setIsPreferencesEditModalOpen(true)}
              onEditExperience={handleAddExperience}
              onEditSingleExperience={handleEditExperience}
              onDeleteSingleExperience={handleDeleteSingleExperience}
              onEditProject={handleAddProject}
              onAddProject={handleAddProject}
              onEditSingleProject={handleEditProject}
              onDeleteSingleProject={handleDeleteSingleProject}
              onDeleteAbout={handleAboutDelete}
              onDeleteSkills={handleSkillsDelete}
              onDeleteExperience={handleExperienceDelete}
              onDeleteProjects={handleProjectsDelete}
              onEditEducation={handleAddEducation}
              onEditSingleEducation={handleEditEducation}
              onDeleteSingleEducation={handleDeleteSingleEducation}
              onDeleteEducation={handleEducationDelete}
              onEditContact={handleEditContact}
              onDeleteContact={handleContactDelete}
              onEditLanguage={handleEditLanguage}
              onDeleteLanguage={handleDeleteSingleLanguage}
              onAddLanguage={handleAddLanguage}
              onDeleteLanguages={handleLanguagesDelete}
              onEditAward={handleEditAward}
              onDeleteAward={handleDeleteSingleAward}
              onAddAward={handleAddAward}
              onDeleteAwards={handleAwardsDelete}
              onEditPublication={handleEditPublication}
              onDeletePublication={handleDeleteSinglePublication}
              onAddPublication={handleAddPublication}
              onDeletePublications={handlePublicationsDelete}
              onEditVolunteerExperience={handleEditVolunteerExperience}
              onDeleteVolunteerExperience={handleDeleteSingleVolunteerExperience}
              onAddVolunteerExperience={handleAddVolunteerExperience}
              onDeleteVolunteerExperiences={handleVolunteerExperiencesDelete}
              onEditInterests={handleEditInterests}
              onDeleteInterests={handleInterestsDelete}
              onAddInterests={handleAddInterests}
              onEditModeToggle={handleEditModeToggle}
              onOpenSettings={openProfileSettings}
              onOpenShare={() => setIsShareProfileModalOpen(true)}
              onSectionOrderChange={handleSectionOrderChange}
              onAddSection={handleAddSection}
            />
      ) : (
        <>

          <DesktopProfileView
          user={user}
          chatHistory={chatHistory}
          setChatHistory={setChatHistory}
          suggestedQuestions={suggestedQuestions}
          message={message}
          setMessage={handleSetMessage}
          isLoading={isLoading}
          handleSendMessage={handleSendMessage}
          isCurrentUser={true}
          currentStreamingMessage={currentStreamingMessage}
          isStreaming={isStreaming}
          messageCount={messageCount}
          messageLimit={messageLimit}
          showMessageLimitModal={showMessageLimitModal}
          handleMessageLimitModalConfirm={handleMessageLimitModalConfirm}
          handleMessageLimitModalCancel={handleMessageLimitModalCancel}
          clearChat={clearChat}
          onEditPhoto={() => setIsEditPhotoModalOpen(true)}
          isEditMode={isEditMode}
          onEditAbout={() => setIsAboutEditModalOpen(true)}
          onEditSkills={() => setIsSkillsEditModalOpen(true)}
          onEditPreferences={() => setIsPreferencesEditModalOpen(true)}
          onEditExperience={handleAddExperience}
          onEditSingleExperience={handleEditExperience}
          onDeleteSingleExperience={handleDeleteSingleExperience}
          onEditProject={handleAddProject}
          onAddProject={handleAddProject}
          onEditSingleProject={handleEditProject}
          onDeleteSingleProject={handleDeleteSingleProject}
          onDeleteAbout={handleAboutDelete}
          onDeleteSkills={handleSkillsDelete}
          onDeleteExperience={handleExperienceDelete}
          onDeleteProjects={handleProjectsDelete}
          onEditEducation={handleAddEducation}
          onEditSingleEducation={handleEditEducation}
          onDeleteSingleEducation={handleDeleteSingleEducation}
          onDeleteEducation={handleEducationDelete}
          onEditContact={handleEditContact}
          onDeleteContact={handleContactDelete}
          onEditLanguage={handleEditLanguage}
          onDeleteLanguage={handleDeleteSingleLanguage}
          onAddLanguage={handleAddLanguage}
          onDeleteLanguages={handleLanguagesDelete}
          onEditAward={handleEditAward}
          onDeleteAward={handleDeleteSingleAward}
          onAddAward={handleAddAward}
          onDeleteAwards={handleAwardsDelete}
          onEditPublication={handleEditPublication}
          onDeletePublication={handleDeleteSinglePublication}
          onAddPublication={handleAddPublication}
          onDeletePublications={handlePublicationsDelete}
          onEditVolunteerExperience={handleEditVolunteerExperience}
          onDeleteVolunteerExperience={handleDeleteSingleVolunteerExperience}
          onAddVolunteerExperience={handleAddVolunteerExperience}
          onDeleteVolunteerExperiences={handleVolunteerExperiencesDelete}
          onEditInterests={handleEditInterests}
          onDeleteInterests={handleInterestsDelete}
          onAddInterests={handleAddInterests}
          onEditModeToggle={handleEditModeToggle}
          onOpenSettings={openProfileSettings}
          onSectionOrderChange={handleSectionOrderChange}
          onAddSection={handleAddSection}
              onOpenShare={() => setIsShareProfileModalOpen(true)}
        />
        </>
      )}

      {/* Edit Profile Modal - Responsive */}
      {isMobile ? (
        <EditProfileModalMobile 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
        />
      ) : (
        <EditProfileModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
        />
      )}

      {/* Edit Photo Modal - Responsive */}
      {isMobile ? (
        <EditPhotoModalMobile
          isOpen={isEditPhotoModalOpen}
          onClose={() => setIsEditPhotoModalOpen(false)}
          currentPhotoUrl={user?.profile_picture}
          onPhotoUpdate={handlePhotoUpdate}
        />
      ) : (
        <EditPhotoModal
          isOpen={isEditPhotoModalOpen}
          onClose={() => setIsEditPhotoModalOpen(false)}
          currentPhotoUrl={user?.profile_picture}
          onPhotoUpdate={handlePhotoUpdate}
        />
      )}

      {/* About Section Edit Modal */}
      <AboutSectionEditModal
        isOpen={isAboutEditModalOpen}
        onClose={() => setIsAboutEditModalOpen(false)}
        currentSummary={user?.summary || ''}
        onUpdate={handleAboutUpdate}
      />

      {/* Preferences Edit Modal */}
      <PreferencesEditModal
        isOpen={isPreferencesEditModalOpen}
        onClose={() => setIsPreferencesEditModalOpen(false)}
        user={user}
      />

      {/* Skills Section Edit Modal */}
      <SkillsSectionEditModal
        isOpen={isSkillsEditModalOpen}
        onClose={() => setIsSkillsEditModalOpen(false)}
        currentSkills={user?.skills || []}
        onUpdate={handleSkillsUpdate}
      />

      {/* Experience Section Edit Modal */}
      <ExperienceSectionEditModal
        isOpen={isExperienceEditModalOpen}
        onClose={() => setIsExperienceEditModalOpen(false)}
        currentExperiences={user?.experience_details || []}
        onUpdate={handleExperienceUpdate}
        editingExperience={editingExperience}
        editingIndex={editingExperienceIndex}
        mode={experienceEditMode}
      />

      {/* Projects Section Edit Modal */}
      <ProjectsSectionEditModal
        isOpen={isProjectsEditModalOpen}
        onClose={() => setIsProjectsEditModalOpen(false)}
        currentProjects={user?.projects || []}
        onUpdate={handleProjectsUpdate}
        editingProject={editingProject}
        editingIndex={editingProjectIndex}
        mode={projectsEditMode}
      />

      {/* Education Edit Modal */}
      <EducationSectionEditModal
        isOpen={isEducationEditModalOpen}
        onClose={() => setIsEducationEditModalOpen(false)}
        currentEducation={user?.education || []}
        onUpdate={handleEducationUpdate}
        editingEducation={editingEducation}
        editingIndex={editingEducationIndex}
        mode={educationEditMode}
      />

      {/* Contact Section Edit Modal */}
      <ContactSectionEditModal
        isOpen={isContactEditModalOpen}
        onClose={() => setIsContactEditModalOpen(false)}
        currentContactInfo={user?.contact_info}
        onUpdate={handleContactUpdate}
        currentUser={user}
      />

      {/* Languages Section Edit Modal */}
      <LanguagesSectionEditModal
        isOpen={isLanguagesEditModalOpen}
        onClose={() => setIsLanguagesEditModalOpen(false)}
        currentLanguages={user?.languages || []}
        onUpdate={handleLanguagesUpdate}
        editingLanguage={editingLanguage}
        editingIndex={editingLanguageIndex}
        mode={languagesEditMode}
      />

      {/* Awards Section Edit Modal */}
      <AwardsSectionEditModal
        isOpen={isAwardsEditModalOpen}
        onClose={() => setIsAwardsEditModalOpen(false)}
        currentAwards={user?.awards || []}
        onUpdate={handleAwardsUpdate}
        editingAward={editingAward}
        editingIndex={editingAwardIndex}
        mode={awardsEditMode}
      />

      {/* Publications Section Edit Modal */}
      <PublicationsSectionEditModal
        isOpen={isPublicationsEditModalOpen}
        onClose={() => setIsPublicationsEditModalOpen(false)}
        currentPublications={user?.publications || []}
        onUpdate={handlePublicationsUpdate}
        editingPublication={editingPublication}
        editingIndex={editingPublicationIndex}
        mode={publicationsEditMode}
      />

      {/* Volunteer Experience Section Edit Modal */}
      <VolunteerExperienceSectionEditModal
        isOpen={isVolunteerExperienceEditModalOpen}
        onClose={() => setIsVolunteerExperienceEditModalOpen(false)}
        currentVolunteerExperience={user?.volunteer_experience || []}
        onUpdate={handleVolunteerExperienceUpdate}
        editingVolunteerExperience={editingVolunteerExperience}
        editingIndex={editingVolunteerExperienceIndex}
        mode={volunteerExperienceEditMode}
      />

      {/* Interests Section Edit Modal */}
      <InterestsSectionEditModal
        isOpen={isInterestsEditModalOpen}
        onClose={() => setIsInterestsEditModalOpen(false)}
        currentInterests={user?.interests || []}
        onUpdate={handleInterestsUpdate}
        mode={interestsEditMode}
      />


      {/* Education Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteEducationConfirm.isOpen}
        onClose={() => setDeleteEducationConfirm({
          isOpen: false,
          educationIndex: null,
          educationTitle: ""
        })}
        onConfirm={confirmDeleteEducation}
        title="Delete Education"
        message={`Are you sure you want to delete "${deleteEducationConfirm.educationTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      <RateLimitModal
        isOpen={rateLimitState.isOpen}
        onClose={hideRateLimitModal}
        message={rateLimitState.message}
        resetInSeconds={rateLimitState.resetInSeconds}
        isAuthenticated={rateLimitState.isAuthenticated}
        rateLimitType={rateLimitState.rateLimitType}
      />

      {/* Delete Experience Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteExperienceConfirm.isOpen}
        onClose={() => setDeleteExperienceConfirm({ isOpen: false, experienceIndex: null, experienceTitle: "" })}
        onConfirm={confirmDeleteExperience}
        title="Delete Experience"
        message={`Are you sure you want to delete "${deleteExperienceConfirm.experienceTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Delete Project Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteProjectConfirm.isOpen}
        onClose={() => setDeleteProjectConfirm({ isOpen: false, projectIndex: null, projectTitle: "" })}
        onConfirm={confirmDeleteProject}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteProjectConfirm.projectTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Language Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteLanguageConfirm}
        onClose={() => setDeleteLanguageConfirm(false)}
        onConfirm={confirmDeleteLanguage}
        title="Delete Language"
        message="Are you sure you want to delete this language?"
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Award Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteAwardConfirm}
        onClose={() => setDeleteAwardConfirm(false)}
        onConfirm={confirmDeleteAward}
        title="Delete Award"
        message="Are you sure you want to delete this award?"
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Publication Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deletePublicationConfirm.isOpen}
        onClose={() => setDeletePublicationConfirm({
          isOpen: false,
          publicationIndex: null,
          publicationTitle: ""
        })}
        onConfirm={confirmDeletePublication}
        title="Delete Publication"
        message={`Are you sure you want to delete "${deletePublicationConfirm.publicationTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />


      {/* Share Profile Modal */}
      {user && (
        <ShareProfileModal
          isOpen={isShareProfileModalOpen}
          onClose={() => setIsShareProfileModalOpen(false)}
          user={user}
        />
      )}

      {/* Volunteer Experience Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteVolunteerExperienceConfirm.isOpen}
        onClose={() => setDeleteVolunteerExperienceConfirm({
          isOpen: false,
          volunteerExperienceIndex: null,
          volunteerExperienceTitle: ""
        })}
        onConfirm={confirmDeleteVolunteerExperience}
        title="Delete Volunteer Experience"
        message={`Are you sure you want to delete "${deleteVolunteerExperienceConfirm.volunteerExperienceTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  )
}

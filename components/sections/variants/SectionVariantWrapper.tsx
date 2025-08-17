"use client"

import { User as UserType, ProfileVariant } from "@/types"
import AboutSection from "../AboutSection"
import CompactAboutSection from "./CompactAboutSection"
import AdvancedAboutSection from "./AdvancedAboutSection"
import ExperienceSection from "../ExperienceSection"
import CompactExperienceSection from "./CompactExperienceSection"
import AdvancedExperienceSection from "./AdvancedExperienceSection"
import SkillsSection from "../SkillsSection"
import CompactSkillsSection from "./CompactSkillsSection"
import AdvancedSkillsSection from "./AdvancedSkillsSection"
import ProjectsSection from "../ProjectsSection"
import CompactProjectsSection from "./CompactProjectsSection"
import AdvancedProjectsSection from "./AdvancedProjectsSection"
import EducationSection from "../EducationSection"
import CompactEducationSection from "./CompactEducationSection"
import AdvancedEducationSection from "./AdvancedEducationSection"
import LanguagesSection from "../LanguagesSection"
import CompactLanguagesSection from "./CompactLanguagesSection"
import AdvancedLanguagesSection from "./AdvancedLanguagesSection"
import AwardsSection from "../AwardsSection"
import CompactAwardsSection from "./CompactAwardsSection"
import AdvancedAwardsSection from "./AdvancedAwardsSection"
import PublicationsSection from "../PublicationsSection"
import CompactPublicationsSection from "./CompactPublicationsSection"
import AdvancedPublicationsSection from "./AdvancedPublicationsSection"
import VolunteerSection from "../VolunteerSection"
import InterestsSection from "../InterestsSection"
import AdvancedVolunteerSection from "./AdvancedVolunteerSection"
import AdvancedInterestsSection from "./AdvancedInterestsSection"

interface SectionVariantWrapperProps {
  sectionId: string
  variant: ProfileVariant
  user: UserType
  isEditMode?: boolean
  [key: string]: any // For additional section-specific props
}

export default function SectionVariantWrapper({
  sectionId,
  variant,
  user,
  isEditMode,
  ...otherProps
}: SectionVariantWrapperProps) {
  
  // Route to appropriate section variant based on sectionId and variant
  switch (sectionId) {
    case 'about':
      switch (variant) {
        case 'compact':
          return (
            <CompactAboutSection 
              user={user} 
              isEditMode={isEditMode}
              onEdit={otherProps.onEditAbout}
              onDelete={otherProps.onDeleteAbout}
            />
          )
        case 'advanced':
          return (
            <AdvancedAboutSection 
              user={user} 
              isEditMode={isEditMode}
              onEdit={otherProps.onEditAbout}
              onDelete={otherProps.onDeleteAbout}
            />
          )
        default:
          return (
            <AboutSection 
              user={user} 
              isEditMode={isEditMode}
              isCollapsible={otherProps.isCollapsible}
              isExpanded={otherProps.isExpanded}
              onEdit={otherProps.onEditAbout}
              onDelete={otherProps.onDeleteAbout}
              onToggleExpand={otherProps.onToggleExpand}
              showDragHandle={otherProps.showDragHandle}
              dragHandleProps={otherProps.dragHandleProps}
            />
          )
      }

    case 'experience':
      switch (variant) {
        case 'compact':
          return (
            <CompactExperienceSection 
              user={user} 
              isEditMode={isEditMode}
              onEdit={otherProps.onEditExperience}
              onDelete={otherProps.onDeleteExperience}
              onEditExperience={otherProps.onEditSingleExperience}
              onDeleteExperience={otherProps.onDeleteSingleExperience}
              onAddExperience={otherProps.onEditExperience}
            />
          )
        case 'advanced':
          return (
            <AdvancedExperienceSection 
              user={user} 
              isEditMode={isEditMode}
              onEdit={otherProps.onEditExperience}
              onDelete={otherProps.onDeleteExperience}
              onEditExperience={otherProps.onEditSingleExperience}
              onDeleteExperience={otherProps.onDeleteSingleExperience}
              onAddExperience={otherProps.onEditExperience}
            />
          )
        default:
          return (
            <ExperienceSection 
              user={user} 
              isEditMode={isEditMode}
              isCollapsible={otherProps.isCollapsible}
              isExpanded={otherProps.isExpanded}
              onEdit={otherProps.onEditExperience}
              onDelete={otherProps.onDeleteExperience}
              onEditExperience={otherProps.onEditSingleExperience}
              onDeleteExperience={otherProps.onDeleteSingleExperience}
              onAddExperience={otherProps.onEditExperience}
              onToggleExpand={otherProps.onToggleExpand}
              showDragHandle={otherProps.showDragHandle}
              dragHandleProps={otherProps.dragHandleProps}
            />
          )
      }

    case 'skills':
      switch (variant) {
        case 'compact':
          return (
            <CompactSkillsSection 
              user={user} 
              isEditMode={isEditMode}
              onEdit={otherProps.onEditSkills}
              onDelete={otherProps.onDeleteSkills}
            />
          )
        case 'advanced':
          return (
            <AdvancedSkillsSection 
              user={user} 
              isEditMode={isEditMode}
              onEdit={otherProps.onEditSkills}
              onDelete={otherProps.onDeleteSkills}
            />
          )
        default:
          return (
            <SkillsSection 
              user={user} 
              isEditMode={isEditMode}
              isCollapsible={otherProps.isCollapsible}
              isExpanded={otherProps.isExpanded}
              onEdit={otherProps.onEditSkills}
              onDelete={otherProps.onDeleteSkills}
              onToggleExpand={otherProps.onToggleExpand}
              showDragHandle={otherProps.showDragHandle}
              dragHandleProps={otherProps.dragHandleProps}
            />
          )
      }

    case 'projects':
      switch (variant) {
        case 'compact':
          return (
            <CompactProjectsSection 
              user={user} 
              isEditMode={isEditMode}
              onEdit={otherProps.onEditProject}
              onDelete={otherProps.onDeleteProjects}
              onEditProject={otherProps.onEditSingleProject}
              onDeleteProject={otherProps.onDeleteSingleProject}
              onAddProject={otherProps.onEditProject}
            />
          )
        case 'advanced':
          return (
            <AdvancedProjectsSection 
              user={user} 
              isEditMode={isEditMode}
              onEdit={otherProps.onEditProject}
              onDelete={otherProps.onDeleteProjects}
              onEditProject={otherProps.onEditSingleProject}
              onDeleteProject={otherProps.onDeleteSingleProject}
              onAddProject={otherProps.onEditProject}
            />
          )
        default:
          return (
            <ProjectsSection 
              user={user} 
              isEditMode={isEditMode}
              isCollapsible={otherProps.isCollapsible}
              isExpanded={otherProps.isExpanded}
              onEdit={otherProps.onEditProject}
              onDelete={otherProps.onDeleteProjects}
              onEditProject={otherProps.onEditSingleProject}
              onDeleteProject={otherProps.onDeleteSingleProject}
              onAddProject={otherProps.onEditProject}
              onToggleExpand={otherProps.onToggleExpand}
              showDragHandle={otherProps.showDragHandle}
              dragHandleProps={otherProps.dragHandleProps}
            />
          )
      }

    case 'education':
      switch (variant) {
        case 'compact':
          return (
            <CompactEducationSection 
              user={user} 
              isEditMode={isEditMode}
              onEdit={otherProps.onEditEducation}
              onDelete={otherProps.onDeleteEducation}
              onEditEducation={otherProps.onEditSingleEducation}
              onDeleteEducation={otherProps.onDeleteSingleEducation}
              onAddEducation={otherProps.onEditEducation}
            />
          )
        case 'advanced':
          return (
            <AdvancedEducationSection 
              user={user} 
              isEditMode={isEditMode}
              onEdit={otherProps.onEditEducation}
              onDelete={otherProps.onDeleteEducation}
              onEditEducation={otherProps.onEditSingleEducation}
              onDeleteEducation={otherProps.onDeleteSingleEducation}
              onAddEducation={otherProps.onEditEducation}
            />
          )
        default:
          return (
            <EducationSection 
              user={user} 
              isEditMode={isEditMode}
              isCollapsible={otherProps.isCollapsible}
              isExpanded={otherProps.isExpanded}
              onEdit={otherProps.onEditEducation}
              onDelete={otherProps.onDeleteEducation}
              onEditEducation={otherProps.onEditSingleEducation}
              onDeleteEducation={otherProps.onDeleteSingleEducation}
              onAddEducation={otherProps.onEditEducation}
              onToggleExpand={otherProps.onToggleExpand}
              showDragHandle={otherProps.showDragHandle}
              dragHandleProps={otherProps.dragHandleProps}
            />
          )
      }

    case 'languages':
      switch (variant) {
        case 'compact':
          return (
            <CompactLanguagesSection 
              user={user} 
              isEditMode={isEditMode}
              onEdit={otherProps.onEditLanguage}
              onDelete={otherProps.onDeleteLanguages}
              onEditLanguage={otherProps.onEditLanguage}
              onDeleteLanguage={otherProps.onDeleteLanguage}
              onAddLanguage={otherProps.onAddLanguage}
            />
          )
        case 'advanced':
          return (
            <AdvancedLanguagesSection 
              user={user} 
              isEditMode={isEditMode}
              onEdit={otherProps.onEditLanguage}
              onDelete={otherProps.onDeleteLanguages}
              onEditLanguage={otherProps.onEditLanguage}
              onDeleteLanguage={otherProps.onDeleteLanguage}
              onAddLanguage={otherProps.onAddLanguage}
            />
          )
        default:
          return (
            <LanguagesSection 
              user={user} 
              isEditMode={isEditMode}
              isCollapsible={otherProps.isCollapsible}
              isExpanded={otherProps.isExpanded}
              onEdit={otherProps.onEditLanguage}
              onDelete={otherProps.onDeleteLanguages}
              onEditLanguage={otherProps.onEditLanguage}
              onDeleteLanguage={otherProps.onDeleteLanguage}
              onAddLanguage={otherProps.onAddLanguage}
              onToggleExpand={otherProps.onToggleExpand}
              showDragHandle={otherProps.showDragHandle}
              dragHandleProps={otherProps.dragHandleProps}
            />
          )
      }

    case 'awards':
      switch (variant) {
        case 'compact':
          return (
            <CompactAwardsSection 
              user={user} 
              isEditMode={isEditMode}
              onEdit={otherProps.onEditAward}
              onDelete={otherProps.onDeleteAwards}
              onEditAward={otherProps.onEditAward}
              onDeleteAward={otherProps.onDeleteAward}
              onAddAward={otherProps.onAddAward}
            />
          )
        case 'advanced':
          return (
            <AdvancedAwardsSection 
              user={user} 
              isEditMode={isEditMode}
              onEdit={otherProps.onEditAward}
              onDelete={otherProps.onDeleteAwards}
              onEditAward={otherProps.onEditAward}
              onDeleteAward={otherProps.onDeleteAward}
              onAddAward={otherProps.onAddAward}
            />
          )
        default:
          return (
            <AwardsSection 
              user={user} 
              isEditMode={isEditMode}
              isCollapsible={otherProps.isCollapsible}
              isExpanded={otherProps.isExpanded}
              onEdit={otherProps.onEditAward}
              onDelete={otherProps.onDeleteAwards}
              onEditAward={otherProps.onEditAward}
              onDeleteAward={otherProps.onDeleteAward}
              onAddAward={otherProps.onAddAward}
              onToggleExpand={otherProps.onToggleExpand}
              showDragHandle={otherProps.showDragHandle}
              dragHandleProps={otherProps.dragHandleProps}
            />
          )
      }

    case 'publications':
      switch (variant) {
        case 'compact':
          return (
            <CompactPublicationsSection 
              user={user} 
              isEditMode={isEditMode}
              onEdit={otherProps.onEditPublication}
              onDelete={otherProps.onDeletePublications}
              onEditPublication={otherProps.onEditPublication}
              onDeletePublication={otherProps.onDeletePublication}
              onAddPublication={otherProps.onAddPublication}
            />
          )
        case 'advanced':
          return (
            <AdvancedPublicationsSection 
              user={user} 
              isEditMode={isEditMode}
              onEdit={otherProps.onEditPublication}
              onDelete={otherProps.onDeletePublications}
              onEditPublication={otherProps.onEditPublication}
              onDeletePublication={otherProps.onDeletePublication}
              onAddPublication={otherProps.onAddPublication}
            />
          )
        default:
          return (
            <PublicationsSection 
              user={user} 
              isEditMode={isEditMode}
              isCollapsible={otherProps.isCollapsible}
              isExpanded={otherProps.isExpanded}
              onEdit={otherProps.onEditPublication}
              onDelete={otherProps.onDeletePublications}
              onEditPublication={otherProps.onEditPublication}
              onDeletePublication={otherProps.onDeletePublication}
              onAddPublication={otherProps.onAddPublication}
              onToggleExpand={otherProps.onToggleExpand}
              showDragHandle={otherProps.showDragHandle}
              dragHandleProps={otherProps.dragHandleProps}
            />
          )
      }
    
    case 'volunteer':
      switch (variant) {
        case 'advanced':
          return (
            <AdvancedVolunteerSection 
              user={user} 
              isEditMode={isEditMode}
              onEditVolunteerExperience={otherProps.onEditVolunteerExperience}
              onDeleteVolunteerExperience={otherProps.onDeleteVolunteerExperience}
              onAddVolunteerExperience={otherProps.onAddVolunteerExperience}
              onDelete={otherProps.onDeleteVolunteerExperiences}
            />
          )
        default:
          return (
            <VolunteerSection 
              user={user} 
              isEditMode={isEditMode}
              isCollapsible={otherProps.isCollapsible}
              isExpanded={otherProps.isExpanded}
              onEdit={otherProps.onEditVolunteerExperience}
              onDelete={otherProps.onDeleteVolunteerExperiences}
              onEditVolunteerExperience={otherProps.onEditVolunteerExperience}
              onDeleteVolunteerExperience={otherProps.onDeleteVolunteerExperience}
              onAddVolunteerExperience={otherProps.onAddVolunteerExperience}
              onToggleExpand={otherProps.onToggleExpand}
              showDragHandle={otherProps.showDragHandle}
              dragHandleProps={otherProps.dragHandleProps}
            />
          )
      }

    case 'interests':
      switch (variant) {
        case 'advanced':
          return (
            <AdvancedInterestsSection 
              user={user} 
              isEditMode={isEditMode}
              onEditInterests={otherProps.onEditInterests}
              onDeleteInterests={otherProps.onDeleteInterests}
              onAddInterests={otherProps.onAddInterests}
              onDelete={otherProps.onDeleteInterests}
            />
          )
        default:
          return (
            <InterestsSection 
              user={user} 
              isEditMode={isEditMode}
              isCollapsible={otherProps.isCollapsible}
              isExpanded={otherProps.isExpanded}
              onEdit={otherProps.onEditInterests}
              onDelete={otherProps.onDeleteInterests}
              onAddInterests={otherProps.onAddInterests}
              onToggleExpand={otherProps.onToggleExpand}
              showDragHandle={otherProps.showDragHandle}
              dragHandleProps={otherProps.dragHandleProps}
            />
          )
      }

    // For other sections, return default behavior for now
    default:
      return null
  }
}
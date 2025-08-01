"use client"

import React, { useState, useEffect, useMemo, memo, useCallback } from "react"
import { User as UserType } from "@/types"
import { useTheme } from "@/context/ThemeContext"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import {
  AboutSection,
  SkillsSection,
  ExperienceSection,
  ProjectsSection,
  EducationSection,
  ContactSection,
  LanguagesSection,
  AwardsSection,
  PublicationsSection,
  VolunteerSection,
  InterestsSection,
  SECTION_REGISTRY,
  DEFAULT_SECTION_ORDER,
  hasSectionData
} from "@/components/sections"

interface ProfileSectionsProps {
  user: UserType
  isEditMode?: boolean
  onEditAbout?: () => void
  onEditSkills?: () => void
  onEditExperience?: () => void
  onEditSingleExperience?: (index: number) => void
  onDeleteSingleExperience?: (index: number) => void
  onEditProject?: () => void
  onEditSingleProject?: (index: number) => void
  onDeleteSingleProject?: (index: number) => void
  onDeleteAbout?: () => void
  onDeleteSkills?: () => void
  onDeleteExperience?: () => void
  onDeleteProjects?: () => void
  onEditEducation?: () => void
  onEditSingleEducation?: (index: number) => void
  onDeleteSingleEducation?: (index: number) => void
  onDeleteEducation?: () => void
  onEditContact?: () => void
  onDeleteContact?: () => void
  onEditLanguage?: (index: number) => void
  onDeleteLanguage?: (index: number) => void
  onAddLanguage?: () => void
  onDeleteLanguages?: () => void
  onEditAward?: (index: number) => void
  onDeleteAward?: (index: number) => void
  onAddAward?: () => void
  onDeleteAwards?: () => void
  onEditPublication?: (index: number) => void
  onDeletePublication?: (index: number) => void
  onAddPublication?: () => void
  onDeletePublications?: () => void
  onEditVolunteerExperience?: (index: number) => void
  onDeleteVolunteerExperience?: (index: number) => void
  onAddVolunteerExperience?: () => void
  onDeleteVolunteerExperiences?: () => void
  onEditInterests?: () => void
  onDeleteInterests?: () => void
  onAddInterests?: () => void
  onSectionOrderChange?: (newOrder: string[]) => void
  onAddSection?: (sectionId: string) => void
}

// Sortable wrapper component for drag and drop
interface SortableSectionWrapperProps {
  id: string
  children: React.ReactNode
  isEditMode: boolean
}

function SortableSectionWrapper({ id, children, isEditMode }: SortableSectionWrapperProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  if (!isEditMode) {
    return <div>{children}</div>
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? 'opacity-50' : ''}
    >
      {React.isValidElement(children) ? React.cloneElement(children as React.ReactElement<any>, {
        showDragHandle: true,
        dragHandleProps: { ...attributes, ...listeners }
      }) : children}
    </div>
  )
}

const ProfileSections = function ProfileSections({
  user,
  isEditMode = false,
  onEditAbout,
  onEditSkills,
  onEditExperience,
  onEditSingleExperience,
  onDeleteSingleExperience,
  onEditProject,
  onEditSingleProject,
  onDeleteSingleProject,
  onDeleteAbout,
  onDeleteSkills,
  onDeleteExperience,
  onDeleteProjects,
  onEditEducation,
  onEditSingleEducation,
  onDeleteSingleEducation,
  onDeleteEducation,
  onEditContact,
  onDeleteContact,
  onEditLanguage,
  onDeleteLanguage,
  onAddLanguage,
  onDeleteLanguages,
  onEditAward,
  onDeleteAward,
  onAddAward,
  onDeleteAwards,
  onEditPublication,
  onDeletePublication,
  onAddPublication,
  onDeletePublications,
  onEditVolunteerExperience,
  onDeleteVolunteerExperience,
  onAddVolunteerExperience,
  onDeleteVolunteerExperiences,
  onEditInterests,
  onDeleteInterests,
  onAddInterests,
  onSectionOrderChange,
  onAddSection
}: ProfileSectionsProps) {
  

  
  const { isDark } = useTheme()
  const [sectionOrder, setSectionOrder] = useState<string[]>([])
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})


  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Initialize section order and expanded states
  useEffect(() => {
    const fallbackOrder = ['about', 'experience', 'skills', 'projects', 'education', 'languages', 'awards', 'publications', 'volunteer', 'interests']
    // Handle empty array case - user.section_order could be [] which is truthy but empty
    const userOrder = (user.section_order && user.section_order.length > 0) 
      ? user.section_order.filter(section => section !== 'contact') // Filter out contact section
      : (DEFAULT_SECTION_ORDER && DEFAULT_SECTION_ORDER.length > 0) 
        ? DEFAULT_SECTION_ORDER.filter(section => section !== 'contact') // Filter out contact section
        : fallbackOrder
    setSectionOrder(userOrder)
    
    // Initialize expanded states - all sections expanded in normal mode, collapsed in edit mode
    const initialExpanded: Record<string, boolean> = {}
    userOrder.forEach(sectionId => {
      initialExpanded[sectionId] = !isEditMode
    })
    setExpandedSections(initialExpanded)
  }, [user.section_order, isEditMode])

  // Update expanded states when edit mode changes
  useEffect(() => {
    if (isEditMode) {
      // In edit mode, collapse all sections
      const newExpanded: Record<string, boolean> = {}
      sectionOrder.forEach(sectionId => {
        newExpanded[sectionId] = false
      })
      setExpandedSections(newExpanded)
    } else {
      // In normal mode, expand all sections
      const newExpanded: Record<string, boolean> = {}
      sectionOrder.forEach(sectionId => {
        newExpanded[sectionId] = true
      })
      setExpandedSections(newExpanded)
    }
  }, [isEditMode, sectionOrder])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      setSectionOrder((items) => {
        const oldIndex = items.indexOf(active.id as string)
        const newIndex = items.indexOf(over?.id as string)

        const newOrder = arrayMove(items, oldIndex, newIndex)
        
        // Ensure we send ALL sections that backend expects, not just visible ones
        const allExpectedSections = ['about', 'experience', 'skills', 'projects', 'education', 'contact', 'languages', 'awards', 'publications', 'volunteer', 'interests']
        const reorderedVisibleSections = newOrder
        const hiddenSections = allExpectedSections.filter(section => !reorderedVisibleSections.includes(section))
        const completeOrder = [...reorderedVisibleSections, ...hiddenSections]
        
        console.log('🔧 Drag end - visible sections:', reorderedVisibleSections)
        console.log('🔧 Drag end - hidden sections:', hiddenSections)
        console.log('🔧 Drag end - complete order:', completeOrder)
        
        onSectionOrderChange?.(completeOrder)
        
        return newOrder
      })
    }
  }, [onSectionOrderChange])

  const handleToggleExpand = useCallback((sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }, [])

  // Get sections to render based on data availability
  const sectionsToRender = useMemo(() => {
    const filtered = sectionOrder.filter(sectionId => {
      const sectionDef = SECTION_REGISTRY[sectionId]
      if (!sectionDef) return false
      
      const hasData = hasSectionData(user, sectionDef.field)
      
      // Always show sections with data, or show empty sections in edit mode
      return hasData || isEditMode
    })
    
    console.log('ProfileSections: sectionsToRender:', {
      sectionOrder,
      isEditMode,
      filtered,
      userLanguages: user.languages,
      userAwards: user.awards,
      languagesHasData: hasSectionData(user, 'languages'),
      awardsHasData: hasSectionData(user, 'awards')
    })
    
    return filtered
  }, [sectionOrder, user, isEditMode])

  const renderSection = useCallback((sectionId: string) => {
    const sectionDef = SECTION_REGISTRY[sectionId]
    if (!sectionDef) return null

    const commonProps = {
      user,
      isEditMode,
      isCollapsible: isEditMode,
      isExpanded: expandedSections[sectionId],
      onToggleExpand: () => handleToggleExpand(sectionId),
    }

    switch (sectionId) {
      case 'about':
        return (
          <AboutSection
            {...commonProps}
            onEdit={onEditAbout}
            onDelete={onDeleteAbout}
          />
        )
      case 'skills':
        return (
          <SkillsSection
            {...commonProps}
            onEdit={onEditSkills}
            onDelete={onDeleteSkills}
          />
        )
      case 'experience':
        return (
          <ExperienceSection
            {...commonProps}
            onDelete={onDeleteExperience}
            onAddExperience={onEditExperience}
            onEditExperience={onEditSingleExperience}
            onDeleteExperience={onDeleteSingleExperience}
          />
        )
      case 'projects':
        return (
          <ProjectsSection
            {...commonProps}
            onDelete={onDeleteProjects}
            onAddProject={onEditProject}
            onEditProject={onEditSingleProject}
            onDeleteProject={onDeleteSingleProject}
          />
        )
      case 'education':
        return (
          <EducationSection
            {...commonProps}
            onDelete={onDeleteEducation}
            onAddEducation={onEditEducation}
            onEditEducation={onEditSingleEducation}
            onDeleteEducation={onDeleteSingleEducation}
          />
        )

      case 'languages':
        return (
          <LanguagesSection
            {...commonProps}
            onDelete={onDeleteLanguages}
            onAddLanguage={onAddLanguage}
            onEditLanguage={onEditLanguage}
            onDeleteLanguage={onDeleteLanguage}
          />
        )
      case 'awards':
        return (
          <AwardsSection
            {...commonProps}
            onDelete={onDeleteAwards}
            onAddAward={onAddAward}
            onEditAward={onEditAward}
            onDeleteAward={onDeleteAward}
          />
        )
      case 'publications':
        return (
          <PublicationsSection
            {...commonProps}
            onDelete={onDeletePublications}
            onAddPublication={onAddPublication}
            onEditPublication={onEditPublication}
            onDeletePublication={onDeletePublication}
          />
        )
      case 'volunteer':
        return (
          <VolunteerSection
            {...commonProps}
            onDelete={onDeleteVolunteerExperiences}
            onAddVolunteerExperience={onAddVolunteerExperience}
            onEditVolunteerExperience={onEditVolunteerExperience}
            onDeleteVolunteerExperience={onDeleteVolunteerExperience}
          />
        )
      case 'interests':
        return (
          <InterestsSection
            {...commonProps}
            onDelete={onDeleteInterests}
            onAddInterests={onAddInterests}
            onEditInterests={onEditInterests}
          />
        )
      default:
        return null
    }
  }, [user, isEditMode, expandedSections, handleToggleExpand, onEditAbout, onEditSkills, onEditExperience, onEditSingleExperience, onDeleteSingleExperience, onEditProject, onEditSingleProject, onDeleteSingleProject, onDeleteAbout, onDeleteSkills, onDeleteExperience, onDeleteProjects, onEditEducation, onEditSingleEducation, onDeleteSingleEducation, onDeleteEducation, onEditContact, onDeleteContact, onEditLanguage, onDeleteLanguage, onAddLanguage, onDeleteLanguages, onEditAward, onDeleteAward, onAddAward, onDeleteAwards, onEditPublication, onDeletePublication, onAddPublication, onDeletePublications, onEditVolunteerExperience, onDeleteVolunteerExperience, onAddVolunteerExperience, onDeleteVolunteerExperiences, onEditInterests, onDeleteInterests, onAddInterests])

  if (isEditMode) {
    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sectionsToRender}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-6">
            {sectionsToRender.map((sectionId) => (
              <SortableSectionWrapper
                key={sectionId}
                id={sectionId}
                isEditMode={isEditMode}
              >
                {renderSection(sectionId)}
              </SortableSectionWrapper>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    )
  }

  return (
    <div className="space-y-6">
      {sectionsToRender.map((sectionId) => (
        <div key={sectionId}>
          {renderSection(sectionId)}
        </div>
      ))}
    </div>
  )
}

export default ProfileSections
"use client"

import React, { useState, useEffect, useMemo, memo, useCallback } from "react"
import { User as UserType, ProfileVariant } from "@/types"
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

  LanguagesSection,
  AwardsSection,
  PublicationsSection,
  VolunteerSection,
  InterestsSection,
  SECTION_REGISTRY,
  DEFAULT_SECTION_ORDER,
  hasSectionData
} from "@/components/sections"
import ProfileCompletionSection from "@/components/sections/ProfileCompletionSection"
import PreferencesSection from "@/components/sections/PreferencesSection"
import SectionVariantWrapper from "./SectionVariantWrapper"

interface VariantAwareProfileSectionsProps {
  variant: ProfileVariant
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
  onEditPreferences?: () => void
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
    isDragging
  } = useSortable({ id, disabled: !isEditMode })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style}>
      {React.cloneElement(children as React.ReactElement, {
        showDragHandle: isEditMode,
        dragHandleProps: isEditMode ? { ...attributes, ...listeners } : {}
      })}
    </div>
  )
}

export default function VariantAwareProfileSections({
  variant,
  user,
  isEditMode = false,
  onSectionOrderChange,
  ...sectionHandlers
}: VariantAwareProfileSectionsProps) {
  const { isDark } = useTheme()
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [localSectionOrder, setLocalSectionOrder] = useState<string[]>([])

  // Use user's section order or fallback to default
  const userSectionOrder = user.section_order && user.section_order.length > 0 
    ? user.section_order 
    : DEFAULT_SECTION_ORDER

  // Initialize local section order
  useEffect(() => {
    setLocalSectionOrder(userSectionOrder)
  }, [userSectionOrder])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleToggleExpand = useCallback((sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId)
      } else {
        newSet.add(sectionId)
      }
      return newSet
    })
  }, [])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    
    if (over && active.id !== over.id) {
      const oldIndex = localSectionOrder.indexOf(active.id as string)
      const newIndex = localSectionOrder.indexOf(over.id as string)
      
      const newOrder = arrayMove(localSectionOrder, oldIndex, newIndex)
      setLocalSectionOrder(newOrder)
      
      // Call the parent handler with the new order
      if (onSectionOrderChange) {
        onSectionOrderChange(newOrder)
      }
    }
  }, [localSectionOrder, onSectionOrderChange])

  // Create section components with variant support
  const renderSection = useCallback((sectionId: string, index: number) => {
    const isExpanded = expandedSections.has(sectionId)
    
    // Check if this section has variant support
    if (sectionId === 'about' || sectionId === 'experience' || sectionId === 'skills' || sectionId === 'projects' || sectionId === 'education' || sectionId === 'languages' || sectionId === 'awards' || sectionId === 'publications') {
      return (
        <SortableSectionWrapper key={sectionId} id={sectionId} isEditMode={isEditMode}>
          <SectionVariantWrapper
            sectionId={sectionId}
            variant={variant}
            user={user}
            isEditMode={isEditMode}
            isCollapsible={isEditMode}
            isExpanded={isExpanded}
            onToggleExpand={() => handleToggleExpand(sectionId)}
            {...sectionHandlers}
          />
        </SortableSectionWrapper>
      )
    }

    // For other sections, use original logic
    const sectionConfig = SECTION_REGISTRY[sectionId as keyof typeof SECTION_REGISTRY]
    if (!sectionConfig) return null

    const { component: Component, hasData } = sectionConfig
    
    // Skip rendering if no data and not in edit mode
    if (!isEditMode && hasData && !hasData(user)) {
      return null
    }

    const commonSectionProps = {
      user,
      isEditMode,
      isCollapsible: isEditMode,
      isExpanded,
      onToggleExpand: () => handleToggleExpand(sectionId),
    }

    let sectionElement

    switch (sectionId) {
      case 'experience':
        sectionElement = (
          <ExperienceSection
            {...commonSectionProps}
            onEdit={sectionHandlers.onEditExperience}
            onEditSingle={sectionHandlers.onEditSingleExperience}
            onDeleteSingle={sectionHandlers.onDeleteSingleExperience}
            onDelete={sectionHandlers.onDeleteExperience}
          />
        )
        break
      case 'projects':
        sectionElement = (
          <ProjectsSection
            {...commonSectionProps}
            onEdit={sectionHandlers.onEditProject}
            onEditSingle={sectionHandlers.onEditSingleProject}
            onDeleteSingle={sectionHandlers.onDeleteSingleProject}
            onDelete={sectionHandlers.onDeleteProjects}
          />
        )
        break



      case 'volunteer':
        sectionElement = (
          <VolunteerSection
            {...commonSectionProps}
            onEdit={sectionHandlers.onEditVolunteerExperience}
            onDelete={sectionHandlers.onDeleteVolunteerExperience}
            onAdd={sectionHandlers.onAddVolunteerExperience}
            onDeleteAll={sectionHandlers.onDeleteVolunteerExperiences}
          />
        )
        break
      case 'interests':
        sectionElement = (
          <InterestsSection
            {...commonSectionProps}
            onEdit={sectionHandlers.onEditInterests}
            onDelete={sectionHandlers.onDeleteInterests}
            onAdd={sectionHandlers.onAddInterests}
          />
        )
        break
      default:
        return null
    }

    return (
      <SortableSectionWrapper key={sectionId} id={sectionId} isEditMode={isEditMode}>
        {sectionElement}
      </SortableSectionWrapper>
    )
  }, [variant, user, isEditMode, expandedSections, handleToggleExpand, sectionHandlers])

  const visibleSections = useMemo(() => {
    return localSectionOrder.filter(sectionId => {
      // Always show sections with variant support if they have data or in edit mode
      if (sectionId === 'about' || sectionId === 'experience') {
        const sectionConfig = SECTION_REGISTRY[sectionId as keyof typeof SECTION_REGISTRY]
        if (!sectionConfig) return false
        
        // In edit mode, show the section
        if (isEditMode) return true
        
        // In view mode, only show if has data
        return sectionConfig.hasData ? sectionConfig.hasData(user) : false
      }
      
      const sectionConfig = SECTION_REGISTRY[sectionId as keyof typeof SECTION_REGISTRY]
      if (!sectionConfig) return false
      
      // In edit mode, show all sections
      if (isEditMode) return true
      
      // In view mode, only show sections with data
      return sectionConfig.hasData ? sectionConfig.hasData(user) : false
    })
  }, [localSectionOrder, isEditMode, user])

  return (
    <div className="space-y-6">
      {/* Profile Completion Section */}
      {isEditMode && (
        <ProfileCompletionSection 
          user={user} 
          onEditAbout={sectionHandlers.onEditAbout}
          onEditSkills={sectionHandlers.onEditSkills}
          onEditExperience={sectionHandlers.onEditExperience}
          onEditProject={sectionHandlers.onEditProject}
          onEditEducation={sectionHandlers.onEditEducation}
          onEditContact={sectionHandlers.onEditContact}
          onAddLanguage={sectionHandlers.onAddLanguage}
          onAddAward={sectionHandlers.onAddAward}
          onAddPublication={sectionHandlers.onAddPublication}
          onAddVolunteerExperience={sectionHandlers.onAddVolunteerExperience}
          onAddInterests={sectionHandlers.onAddInterests}
          onEditPreferences={sectionHandlers.onEditPreferences}
        />
      )}
      
      {/* Dynamic Sections with Drag and Drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={visibleSections} strategy={verticalListSortingStrategy}>
          <div className="space-y-6">
            {visibleSections.map((sectionId, index) => renderSection(sectionId, index))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Preferences Section (only in edit mode and for current user) */}
      {isEditMode && (
        <PreferencesSection 
          user={user} 
          onEdit={sectionHandlers.onEditPreferences}
        />
      )}
    </div>
  )
}
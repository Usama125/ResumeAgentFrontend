"use client"

import { useState, useEffect } from "react"
import { GripVertical, Plus, User, Briefcase, Code, BookOpen, Award, Globe, FileText, Heart, Star } from "lucide-react"
import { useTheme } from "@/context/ThemeContext"
import { User as UserType } from "@/types"
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

// Define section types and their default order
export interface ProfileSection {
  id: string
  title: string
  icon: React.ReactNode
  field: string
  hasData: boolean
  isVisible: boolean
}

interface SectionOrderManagerProps {
  user: UserType
  isEditMode: boolean
  onSectionOrderChange: (sections: ProfileSection[]) => void
  onAddSection: (sectionId: string) => void
}

// Default section order for a professional portfolio
const DEFAULT_SECTION_ORDER = [
  'about',
  'contact',
  'experience',
  'skills',
  'education',
  'projects',
  'awards',
  'languages',
  'publications',
  'volunteer',
  'interests'
]

// Section definitions
const SECTION_DEFINITIONS = {
  about: {
    title: 'About Me',
    icon: <User className="w-5 h-5 text-[#10a37f]" />,
    field: 'summary'
  },
  contact: {
    title: 'Contact Information',
    icon: <Plus className="w-5 h-5 text-[#10a37f]" />,
    field: 'contact_info'
  },
  experience: {
    title: 'Professional Experience',
    icon: <Briefcase className="w-5 h-5 text-[#10a37f]" />,
    field: 'experience_details'
  },
  skills: {
    title: 'Skills & Expertise',
    icon: <Code className="w-5 h-5 text-[#10a37f]" />,
    field: 'skills'
  },
  education: {
    title: 'Education',
    icon: <BookOpen className="w-5 h-5 text-[#10a37f]" />,
    field: 'education'
  },
  projects: {
    title: 'Projects',
    icon: <Award className="w-5 h-5 text-[#10a37f]" />,
    field: 'projects'
  },
  awards: {
    title: 'Awards & Recognition',
    icon: <Award className="w-5 h-5 text-[#10a37f]" />,
    field: 'awards'
  },
  languages: {
    title: 'Languages',
    icon: <Globe className="w-5 h-5 text-[#10a37f]" />,
    field: 'languages'
  },
  publications: {
    title: 'Publications',
    icon: <FileText className="w-5 h-5 text-[#10a37f]" />,
    field: 'publications'
  },
  volunteer: {
    title: 'Volunteer Experience',
    icon: <Heart className="w-5 h-5 text-[#10a37f]" />,
    field: 'volunteer_experience'
  },
  interests: {
    title: 'Interests & Hobbies',
    icon: <Star className="w-5 h-5 text-[#10a37f]" />,
    field: 'interests'
  }
}

// Helper function to check if a section has data
const hasSectionData = (user: UserType, field: string): boolean => {
  switch (field) {
    case 'summary':
      return !!(user.summary && user.summary.trim())
    case 'contact_info':
      return !!(user.contact_info && Object.values(user.contact_info).some(value => value))
    case 'experience_details':
      return !!(user.experience_details && user.experience_details.length > 0)
    case 'skills':
      return !!(user.skills && user.skills.length > 0)
    case 'education':
      return !!(user.education && user.education.length > 0)
    case 'projects':
      return !!(user.projects && user.projects.length > 0)
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

// Sortable section item component
function SortableSectionItem({ 
  section, 
  isEditMode,
  onAddSection 
}: { 
  section: ProfileSection
  isEditMode: boolean
  onAddSection: (sectionId: string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id })

  const { isDark } = useTheme()

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  if (!section.isVisible) return null

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${isDark ? 'bg-[#1a1a1a] border-[#10a37f]/20' : 'bg-gray-50 border-gray-200'} border rounded-lg p-4 ${isDragging ? 'opacity-50' : ''} ${isEditMode ? 'cursor-grab active:cursor-grabbing' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isEditMode && (
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100/10 rounded"
            >
              <GripVertical className="w-4 h-4 text-gray-400" />
            </div>
          )}
          <div className="text-[#10a37f]">
            {section.icon}
          </div>
          <div className="flex-1">
            <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {section.title}
            </div>
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {section.hasData ? 'Has data' : 'Empty'}
            </div>
          </div>
        </div>
        {isEditMode && !section.hasData && (
          <button
            onClick={() => onAddSection(section.id)}
            className="text-[#10a37f] hover:text-[#0d8f6f] p-2 rounded hover:bg-[#10a37f]/10 transition-colors"
            title={`Add ${section.title} section`}
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export default function SectionOrderManager({ 
  user, 
  isEditMode, 
  onSectionOrderChange,
  onAddSection 
}: SectionOrderManagerProps) {
  const [sections, setSections] = useState<ProfileSection[]>([])
  const { isDark } = useTheme()

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Initialize sections based on user data and default order
  useEffect(() => {
    const sectionList: ProfileSection[] = DEFAULT_SECTION_ORDER.map(sectionId => {
      const definition = SECTION_DEFINITIONS[sectionId as keyof typeof SECTION_DEFINITIONS]
      const hasData = hasSectionData(user, definition.field)
      
      return {
        id: sectionId,
        title: definition.title,
        icon: definition.icon,
        field: definition.field,
        hasData,
        isVisible: true // All sections are visible by default
      }
    })

    setSections(sectionList)
  }, [user])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      setSections((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id)
        const newIndex = items.findIndex(item => item.id === over?.id)

        const newItems = arrayMove(items, oldIndex, newIndex)
        onSectionOrderChange(newItems)
        
        return newItems
      })
    }
  }

  if (!isEditMode) return null

  return (
    <div className="space-y-4">
      <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Section Order
      </h3>
      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        Drag to reorder sections. New sections will be added at the bottom.
      </p>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sections.map(section => section.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {sections.map((section) => (
              <SortableSectionItem
                key={section.id}
                section={section}
                isEditMode={isEditMode}
                onAddSection={onAddSection}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
} 
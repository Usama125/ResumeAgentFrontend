"use client"

import { useState } from "react"
import { Award, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { User as UserType } from "@/types"
import { useTheme } from "@/context/ThemeContext"
import { getThemeClasses } from "@/utils/theme"
import BaseSection from "./BaseSection"

interface ProjectsSectionProps {
  user: UserType
  isEditMode?: boolean
  isCollapsible?: boolean
  isExpanded?: boolean
  onEdit?: () => void
  onDelete?: () => void
  onToggleExpand?: () => void
  showDragHandle?: boolean
  dragHandleProps?: any
  onEditProject?: (index: number) => void
  onDeleteProject?: (index: number) => void
  onAddProject?: () => void
}

export default function ProjectsSection({
  user,
  isEditMode = false,
  isCollapsible = false,
  isExpanded = true,
  onEdit,
  onDelete,
  onToggleExpand,
  showDragHandle = false,
  dragHandleProps = {},
  onEditProject,
  onDeleteProject,
  onAddProject
}: ProjectsSectionProps) {
  const { isDark } = useTheme()
  const [expandedProjects, setExpandedProjects] = useState<Set<number>>(new Set())

  const toggleProjectExpansion = (index: number) => {
    setExpandedProjects(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }
  


  // Check if section has data
  const hasData = !!(user.projects && user.projects.length > 0)

  // Don't render if no data and not in edit mode
  if (!hasData && !isEditMode) {
    return null
  }



  return (
    <BaseSection
      id="projects"
      title="Featured Projects"
      icon={<Award className="w-5 h-5 text-[#10a37f]" />}
      isEditMode={isEditMode}
      isCollapsible={isCollapsible}
      isExpanded={isExpanded}
      onDelete={hasData ? onDelete : undefined}
      onAdd={isEditMode ? onAddProject : undefined}
      onToggleExpand={onToggleExpand}
      showDragHandle={showDragHandle}
      dragHandleProps={dragHandleProps}
    >
      <div className="grid gap-6">
        {hasData ? (
          user.projects.map((project, index) => (
            <div key={index} className={`${isDark ? 'bg-[#2a2a2a]/50' : 'bg-gray-50/80'} rounded-xl p-4 sm:p-5 border ${isDark ? 'border-[#10a37f]/10 hover:border-[#10a37f]/30' : 'border-gray-200 hover:border-[#10a37f]/50'} transition-all duration-300`}>
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className={`text-lg font-semibold ${getThemeClasses(isDark).text.primary} transition-colors`}>
                    {project.name}
                  </h3>
                  <div className="flex gap-2">
                    {isEditMode && (onEditProject || onDeleteProject) && (
                      <>
                        {onDeleteProject && (
                          <Button
                            onClick={() => onDeleteProject(index)}
                            size="sm"
                            variant="ghost"
                            className="text-red-500 hover:text-red-600 hover:bg-red-500/10 p-2"
                            title="Delete project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                        {onEditProject && (
                          <Button
                            onClick={() => onEditProject(index)}
                            size="sm"
                            variant="ghost"
                            className="text-[#10a37f] hover:text-[#0d8f6f] hover:bg-[#10a37f]/10 p-2"
                            title="Edit project"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                      </>
                    )}
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2 sm:px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-xs sm:text-sm rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                        title="View GitHub Repository"
                      >
                        <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        <span className="hidden sm:inline">GitHub</span>
                      </a>
                    )}
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2 sm:px-3 py-1.5 bg-[#10a37f] hover:bg-[#0d8f6f] text-white text-xs sm:text-sm rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                        title="Visit Live Demo"
                      >
                        <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span className="hidden sm:inline">Visit</span>
                      </a>
                    )}
                  </div>
                </div>
                <div className="relative">
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed break-all overflow-hidden ${project.description && project.description.length > 100 ? 'line-clamp-2' : ''}`}>
                    {project.description}
                  </p>
                  {project.description && project.description.length > 100 && (
                    <div className="relative inline-block mt-2">
                      <span className="text-[#10a37f] hover:text-[#0d8f6f] text-sm font-medium transition-colors cursor-pointer group">
                        See More
                        <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-[99999] transform-gpu top-full left-0 mt-2">
                          <div className={`${isDark ? 'bg-[#2a2a2a] border-[#10a37f]/30' : 'bg-white border-gray-200'} border rounded-lg p-4 shadow-2xl max-w-[90vw] sm:max-w-md w-auto sm:w-96`}>
                            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed text-sm`}>
                              {project.description}
                            </p>
                          </div>
                        </div>
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {(() => {
                    const isExpanded = expandedProjects.has(index)
                    const technologiesToShow = isExpanded ? project.technologies : project.technologies.slice(0, 5)
                    const hasMoreTechnologies = project.technologies.length > 5
                    
                    return (
                      <>
                        {technologiesToShow.map((tech, techIndex) => (
                          <span 
                            key={techIndex} 
                            className="inline-flex items-center px-2 sm:px-3 py-1 bg-[#10a37f]/20 text-[#10a37f] text-xs sm:text-sm rounded-full border border-[#10a37f]/30 max-w-[120px] sm:max-w-[150px] truncate whitespace-nowrap"
                            title={tech}
                          >
                            {tech}
                          </span>
                        ))}
                        {hasMoreTechnologies && !isExpanded && (
                          <>
                            <span className="inline-flex items-center px-2 sm:px-3 py-1 bg-gray-500/20 text-gray-500 text-xs sm:text-sm rounded-full border border-gray-500/30">
                              +{project.technologies.length - 5}
                            </span>
                            <button
                              onClick={() => toggleProjectExpansion(index)}
                              className="inline-flex items-center px-2 sm:px-3 py-1 bg-blue-500/20 text-blue-500 text-xs sm:text-sm rounded-full border border-blue-500/30 hover:bg-blue-500/30 transition-colors cursor-pointer"
                            >
                              See All
                            </button>
                          </>
                        )}
                        {hasMoreTechnologies && isExpanded && (
                          <button
                            onClick={() => toggleProjectExpansion(index)}
                            className="inline-flex items-center px-2 sm:px-3 py-1 bg-orange-500/20 text-orange-500 text-xs sm:text-sm rounded-full border border-orange-500/30 hover:bg-orange-500/30 transition-colors cursor-pointer"
                          >
                            See Less
                          </button>
                        )}
                      </>
                    )
                  })()}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} italic text-center py-4`}>
            No projects available. Add your projects to showcase your work.
          </p>
        )}
      </div>
    </BaseSection>
  )
}
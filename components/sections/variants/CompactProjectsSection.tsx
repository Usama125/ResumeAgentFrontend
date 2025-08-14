"use client"

import { useState } from "react"
import { 
  Award, 
  Edit, 
  Trash2, 
  Sparkles, 
  ExternalLink,
  Github,
  Code,
  Calendar,
  Eye
} from "lucide-react"
import { User as UserType } from "@/types"
import { useTheme } from "@/context/ThemeContext"
import { getThemeClasses } from "@/utils/theme"

interface CompactProjectsSectionProps {
  user: UserType
  isEditMode?: boolean
  onEdit?: () => void
  onDelete?: () => void
  onEditProject?: (index: number) => void
  onDeleteProject?: (index: number) => void
  onAddProject?: () => void
}

export default function CompactProjectsSection({
  user,
  isEditMode = false,
  onEdit,
  onDelete,
  onEditProject,
  onDeleteProject,
  onAddProject
}: CompactProjectsSectionProps) {
  const { isDark } = useTheme()
  const theme = getThemeClasses(isDark)
  const [expandedProjects, setExpandedProjects] = useState<Set<number>>(new Set())
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<number>>(new Set())

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

  const toggleDescriptionExpansion = (index: number) => {
    setExpandedDescriptions(prev => {
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
    <div className={`relative rounded-xl overflow-hidden ${
      isDark 
        ? 'bg-[#2a2a2a]/40 border border-[#10a37f]/20' 
        : 'bg-white/60 border border-[#10a37f]/15'
    } backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300`}>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#10a37f]/10 to-transparent rounded-full blur-xl"></div>
      </div>

      <div className="relative z-10 p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#10a37f]/20">
              <Award className="w-4 h-4 text-[#10a37f]" />
            </div>
            <h3 className={`text-sm font-semibold ${theme.text.primary}`}>Featured Projects</h3>
          </div>
          
          {isEditMode && (
            <div className="flex items-center gap-1">
              {onAddProject && (
                <button
                  onClick={onAddProject}
                  className={`p-1.5 rounded-lg transition-all duration-200 ${
                    isDark 
                      ? 'hover:bg-[#10a37f]/20 text-[#10a37f]' 
                      : 'hover:bg-[#10a37f]/10 text-[#10a37f]'
                  }`}
                  title="Add Project"
                >
                  <Code className="w-3 h-3" />
                </button>
              )}
              {hasData && onDelete && (
                <button
                  onClick={onDelete}
                  className={`p-1.5 rounded-lg transition-all duration-200 ${
                    isDark 
                      ? 'hover:bg-red-500/20 text-red-400' 
                      : 'hover:bg-red-500/10 text-red-500'
                  }`}
                  title="Delete All Projects"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        {hasData ? (
          <div className="space-y-3">
            {user.projects.map((project, index) => (
              <div 
                key={index} 
                className={`relative p-3 rounded-lg border transition-all duration-200 group ${
                  isDark 
                    ? 'bg-[#1a1a1a]/30 border-[#10a37f]/20 hover:border-[#10a37f]/40' 
                    : 'bg-white/40 border-[#10a37f]/15 hover:border-[#10a37f]/30'
                } backdrop-blur-sm`}
              >
                {/* Project Background Effects */}
                <div className="absolute inset-0 overflow-hidden rounded-lg">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#10a37f]/5 to-transparent rounded-full blur-lg"></div>
                </div>
                
                <div className="relative z-10 space-y-2">
                  {/* Project Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className={`${theme.text.primary} font-semibold text-sm group-hover:text-[#10a37f] transition-colors truncate`}>
                        {project.name}
                      </h4>
                      {project.duration && (
                        <div className="flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3 text-[#10a37f]" />
                          <span className={`text-xs ${theme.text.secondary}`}>
                            {project.duration}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {isEditMode && onEditProject && (
                        <button
                          onClick={() => onEditProject(index)}
                          className={`p-1 rounded transition-all duration-200 ${
                            isDark 
                              ? 'hover:bg-[#10a37f]/20 text-[#10a37f]' 
                              : 'hover:bg-[#10a37f]/10 text-[#10a37f]'
                          }`}
                          title="Edit Project"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                      )}
                      {isEditMode && onDeleteProject && (
                        <button
                          onClick={() => onDeleteProject(index)}
                          className={`p-1 rounded transition-all duration-200 ${
                            isDark 
                              ? 'hover:bg-red-500/20 text-red-400' 
                              : 'hover:bg-red-500/10 text-red-500'
                          }`}
                          title="Delete Project"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Project Description */}
                  {project.description && (
                    <div className="space-y-2">
                      <p className={`${theme.text.secondary} text-xs leading-relaxed ${
                        expandedDescriptions.has(index) ? '' : 'line-clamp-2'
                      }`}>
                        {project.description}
                      </p>
                      {project.description.length > 120 && (
                        <button
                          onClick={() => toggleDescriptionExpansion(index)}
                          className={`text-xs font-medium transition-colors ${
                            isDark 
                              ? 'text-[#10a37f] hover:text-[#0d8f6f]' 
                              : 'text-[#10a37f] hover:text-[#0d8f6f]'
                          }`}
                        >
                          {expandedDescriptions.has(index) ? 'See Less' : 'See More'}
                        </button>
                      )}
                    </div>
                  )}
                  
                  {/* Project Links */}
                  <div className="flex items-center gap-2">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-all duration-200 ${
                          isDark 
                            ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        } hover:scale-105`}
                        title="View GitHub Repository"
                      >
                        <Github className="w-3 h-3" />
                        <span>GitHub</span>
                      </a>
                    )}
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-all duration-200 ${
                          isDark 
                            ? 'bg-[#10a37f] hover:bg-[#0d8f6f] text-white' 
                            : 'bg-[#10a37f] hover:bg-[#0d8f6f] text-white'
                        } hover:scale-105`}
                        title="Visit Live Demo"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Demo</span>
                      </a>
                    )}
                  </div>
                  
                  {/* Technologies */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {(() => {
                        const isExpanded = expandedProjects.has(index)
                        const technologiesToShow = isExpanded ? project.technologies : project.technologies.slice(0, 5)
                        const hasMoreTechnologies = project.technologies.length > 5
                        
                        return (
                          <>
                            {technologiesToShow.map((tech, techIndex) => (
                              <span 
                                key={techIndex} 
                                className="inline-flex items-center px-2 py-0.5 bg-[#10a37f]/20 text-[#10a37f] text-xs rounded-full border border-[#10a37f]/30 max-w-[80px] truncate"
                                title={tech}
                              >
                                {tech.length > 8 ? `${tech.substring(0, 8)}...` : tech}
                              </span>
                            ))}
                            {hasMoreTechnologies && !isExpanded && (
                              <>
                                <span className="inline-flex items-center px-2 py-0.5 bg-gray-500/20 text-gray-500 text-xs rounded-full border border-gray-500/30">
                                  +{project.technologies.length - 5}
                                </span>
                                <button
                                  onClick={() => toggleProjectExpansion(index)}
                                  className="inline-flex items-center px-2 py-0.5 bg-blue-500/20 text-blue-500 text-xs rounded-full border border-blue-500/30 hover:bg-blue-500/30 transition-colors cursor-pointer"
                                >
                                  See All
                                </button>
                              </>
                            )}
                            {hasMoreTechnologies && isExpanded && (
                              <button
                                onClick={() => toggleProjectExpansion(index)}
                                className="inline-flex items-center px-2 py-0.5 bg-orange-500/20 text-orange-500 text-xs rounded-full border border-orange-500/30 hover:bg-orange-500/30 transition-colors cursor-pointer"
                              >
                                See Less
                              </button>
                            )}
                          </>
                        )
                      })()}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Projects Summary */}
            <div className={`flex items-center justify-between pt-3 border-t ${
              isDark ? 'border-[#10a37f]/20' : 'border-[#10a37f]/15'
            }`}>
              <div className="flex items-center gap-2">
                <Award className="w-3 h-3 text-[#10a37f]" />
                <span className={`text-xs ${theme.text.secondary}`}>
                  {user.projects.length} project{user.projects.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              {/* Technologies count */}
              <div className="flex items-center gap-2 text-xs">
                <Code className="w-3 h-3 text-[#10a37f]" />
                <span className={theme.text.tertiary}>
                  {user.projects.reduce((total, project) => total + (project.technologies?.length || 0), 0)} tech
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="relative mb-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-[#10a37f]/20 to-[#0d8f6f]/20 flex items-center justify-center backdrop-blur-sm">
                <Award className="w-6 h-6 text-[#10a37f]" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#10a37f] rounded-full flex items-center justify-center">
                <Sparkles className="w-2.5 h-2.5 text-white animate-pulse" />
              </div>
            </div>
            
            <h4 className={`text-sm font-semibold ${theme.text.primary} mb-2`}>
              Showcase Your Work
            </h4>
            <p className={`${theme.text.secondary} text-xs mb-4 max-w-xs mx-auto`}>
              Add your projects to demonstrate your skills and experience.
            </p>
            
            {isEditMode && onAddProject && (
              <button
                onClick={onAddProject}
                className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#10a37f] text-white text-xs font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm"
              >
                <Code className="w-3 h-3 group-hover:animate-pulse" />
                Add Project
                <ExternalLink className="w-3 h-3 group-hover:animate-bounce" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

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
  Eye,
  Star,
  Trophy,
  Rocket,
  Zap,
  Target,
  ChevronDown,
  ChevronUp,
  Globe,
  Users
} from "lucide-react"
import { User as UserType } from "@/types"
import { useTheme } from "@/context/ThemeContext"
import { getThemeClasses } from "@/utils/theme"

interface AdvancedProjectsSectionProps {
  user: UserType
  isEditMode?: boolean
  onEdit?: () => void
  onDelete?: () => void
  onEditProject?: (index: number) => void
  onDeleteProject?: (index: number) => void
  onAddProject?: () => void
}

export default function AdvancedProjectsSection({
  user,
  isEditMode = false,
  onEdit,
  onDelete,
  onEditProject,
  onDeleteProject,
  onAddProject
}: AdvancedProjectsSectionProps) {
  const { isDark } = useTheme()
  const theme = getThemeClasses(isDark)
  const [expandedProjects, setExpandedProjects] = useState<Set<number>>(new Set())

  // Check if section has data
  const hasData = !!(user.projects && user.projects.length > 0)

  // Don't render if no data and not in edit mode
  if (!hasData && !isEditMode) {
    return null
  }

  const toggleExpand = (index: number) => {
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

  const [expandedTechnologies, setExpandedTechnologies] = useState<Set<number>>(new Set())

  const toggleTechnologiesExpansion = (index: number) => {
    setExpandedTechnologies(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  return (
    <div className={`group relative rounded-2xl overflow-hidden ${
      isDark 
        ? 'bg-gradient-to-br from-[#2a2a2a]/60 via-[#1a1a1a]/80 to-[#2a2a2a]/60 border-2 border-[#10a37f]/30' 
        : 'bg-gradient-to-br from-white/80 via-gray-50/90 to-white/80 border-2 border-[#10a37f]/20'
    } backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:border-[#10a37f]/50`}>
      
      {/* Advanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#10a37f]/8 to-transparent rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#0d8f6f]/6 to-transparent rounded-full blur-xl"></div>
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-[#10a37f]/20 rounded-full animate-pulse"></div>
        <div className="absolute top-1/4 right-1/3 w-1 h-1 bg-[#10a37f]/30 rounded-full animate-ping"></div>
      </div>

      {/* Premium Border Glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#10a37f]/10 via-[#0d8f6f]/5 to-[#10a37f]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>

      <div className="relative z-10 p-8">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-xl opacity-20 animate-pulse"></div>
              <div className="relative p-3 rounded-xl bg-gradient-to-br from-[#10a37f]/20 to-[#0d8f6f]/20 backdrop-blur-sm">
                <Award className="w-6 h-6 text-[#10a37f]" />
              </div>
            </div>
            <div>
              <h3 className={`text-2xl font-bold bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] bg-clip-text text-transparent`}>
                Featured Projects
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Trophy className="w-3 h-3 text-[#10a37f]/60" />
                <span className={`text-xs ${theme.text.tertiary}`}>Portfolio Showcase</span>
                {hasData && (
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#10a37f]/10 border border-[#10a37f]/20">
                    <Star className="w-2.5 h-2.5 text-[#10a37f]" />
                    <span className="text-[#10a37f] text-xs font-medium">{user.projects.length} Project{user.projects.length !== 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {isEditMode && (
            <div className="flex items-center gap-2">
              {onAddProject && (
                <button
                  onClick={onAddProject}
                  className={`group/btn p-3 rounded-xl transition-all duration-300 ${
                    isDark 
                      ? 'bg-[#1a1a1a]/60 hover:bg-[#10a37f]/20 border border-[#10a37f]/20 hover:border-[#10a37f]/40' 
                      : 'bg-white/60 hover:bg-[#10a37f]/10 border border-[#10a37f]/15 hover:border-[#10a37f]/30'
                  } backdrop-blur-sm hover:scale-105 hover:shadow-lg`}
                  title="Add Project"
                >
                  <Rocket className="w-4 h-4 text-[#10a37f] group-hover/btn:animate-pulse" />
                </button>
              )}
              {hasData && onDelete && (
                <button
                  onClick={onDelete}
                  className={`group/btn p-3 rounded-xl transition-all duration-300 ${
                    isDark 
                      ? 'bg-[#1a1a1a]/60 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40' 
                      : 'bg-white/60 hover:bg-red-500/10 border border-red-300/20 hover:border-red-400/30'
                  } backdrop-blur-sm hover:scale-105 hover:shadow-lg`}
                  title="Delete All Projects"
                >
                  <Trash2 className="w-4 h-4 text-red-400 group-hover/btn:animate-pulse" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Enhanced Content */}
        {hasData ? (
          <div className="space-y-6">
            {user.projects.map((project, index) => {
              const isExpanded = expandedProjects.has(index)
              const shouldTruncate = project.description && project.description.length > 150
              
              return (
                <div 
                  key={index} 
                  className={`group/project relative overflow-hidden rounded-2xl border-2 ${
                    isDark 
                      ? 'bg-gradient-to-br from-[#1a1a1a]/80 via-[#2a2a2a]/60 to-[#1a1a1a]/80 border-[#10a37f]/20 hover:border-[#10a37f]/40' 
                      : 'bg-gradient-to-br from-white/80 via-gray-50/60 to-white/80 border-[#10a37f]/15 hover:border-[#10a37f]/30'
                  } backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-[#10a37f]/10`}
                >
                  {/* Project Background Effects */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#10a37f]/5 to-transparent rounded-full blur-xl"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-[#0d8f6f]/5 to-transparent rounded-full blur-lg"></div>
                  </div>
                  
                  <div className="relative z-10 p-6">
                    {/* Project Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-[#10a37f]/20 to-[#0d8f6f]/20 backdrop-blur-sm">
                            <Code className="w-4 h-4 text-[#10a37f]" />
                          </div>
                          <div>
                            <h4 className={`text-xl font-bold ${theme.text.primary} group-hover/project:text-[#10a37f] transition-colors`}>
                              {project.name}
                            </h4>
                            {project.duration && (
                              <div className="flex items-center gap-2 mt-1">
                                <Calendar className="w-3 h-3 text-[#10a37f]" />
                                <span className={`text-sm ${theme.text.secondary}`}>
                                  {project.duration}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Enhanced Action Buttons */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {isEditMode && onEditProject && (
                          <button
                            onClick={() => onEditProject(index)}
                            className={`group/btn p-3 rounded-xl transition-all duration-300 ${
                              isDark 
                                ? 'bg-[#1a1a1a]/60 hover:bg-[#10a37f]/20 border border-[#10a37f]/20 hover:border-[#10a37f]/40' 
                                : 'bg-white/60 hover:bg-[#10a37f]/10 border border-[#10a37f]/15 hover:border-[#10a37f]/30'
                            } backdrop-blur-sm hover:scale-105 hover:shadow-lg`}
                            title="Edit Project"
                          >
                            <Edit className="w-4 h-4 text-[#10a37f] group-hover/btn:animate-pulse" />
                          </button>
                        )}
                        {isEditMode && onDeleteProject && (
                          <button
                            onClick={() => onDeleteProject(index)}
                            className={`group/btn p-3 rounded-xl transition-all duration-300 ${
                              isDark 
                                ? 'bg-[#1a1a1a]/60 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40' 
                                : 'bg-white/60 hover:bg-red-500/10 border border-red-300/20 hover:border-red-400/30'
                            } backdrop-blur-sm hover:scale-105 hover:shadow-lg`}
                            title="Delete Project"
                          >
                            <Trash2 className="w-4 h-4 text-red-400 group-hover/btn:animate-pulse" />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Project Description */}
                    {project.description && (
                      <div className="mb-4">
                        <div className={`relative p-4 rounded-xl ${
                          isDark 
                            ? 'bg-[#1a1a1a]/40 border-l-4 border-[#10a37f]/50' 
                            : 'bg-white/50 border-l-4 border-[#10a37f]/60'
                        } backdrop-blur-sm ${shouldTruncate ? '' : 'mb-0'}`}>
                          <p className={`${theme.text.primary} text-base leading-relaxed font-medium ${
                            shouldTruncate && !isExpanded ? 'line-clamp-3' : ''
                          }`}>
                            {project.description}
                          </p>
                        </div>
                        
                        {shouldTruncate && (
                          <div className="flex justify-center mt-3">
                            <button
                              onClick={() => toggleExpand(index)}
                              className={`group flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                                isDark 
                                  ? 'bg-[#1a1a1a]/50 hover:bg-[#10a37f]/20 border border-[#10a37f]/20 hover:border-[#10a37f]/40' 
                                  : 'bg-white/50 hover:bg-[#10a37f]/10 border border-[#10a37f]/15 hover:border-[#10a37f]/30'
                              } backdrop-blur-sm hover:scale-105 hover:shadow-md`}
                            >
                              <span className="text-[#10a37f] font-medium text-sm">
                                {isExpanded ? 'Show Less' : 'Read More'}
                              </span>
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-[#10a37f] group-hover:animate-bounce" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-[#10a37f] group-hover:animate-bounce" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Project Links */}
                    <div className="flex items-center gap-3 mb-4">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`group flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                            isDark 
                              ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 hover:border-gray-600' 
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 hover:border-gray-300'
                          } hover:scale-105 hover:shadow-lg backdrop-blur-sm`}
                          title="View GitHub Repository"
                        >
                          <Github className="w-4 h-4 group-hover:animate-pulse" />
                          <span className="font-medium">GitHub</span>
                          <ExternalLink className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </a>
                      )}
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`group flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                            isDark 
                              ? 'bg-[#10a37f] hover:bg-[#0d8f6f] text-white border border-[#10a37f] hover:border-[#0d8f6f]' 
                              : 'bg-[#10a37f] hover:bg-[#0d8f6f] text-white border border-[#10a37f] hover:border-[#0d8f6f]'
                          } hover:scale-105 hover:shadow-lg backdrop-blur-sm`}
                          title="Visit Live Demo"
                        >
                          <Eye className="w-4 h-4 group-hover:animate-pulse" />
                          <span className="font-medium">Live Demo</span>
                          <ExternalLink className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </a>
                      )}
                    </div>
                    
                                         {/* Technologies */}
                     {project.technologies && project.technologies.length > 0 && (
                       <div className="space-y-3">
                         <div className="flex items-center gap-2">
                           <Zap className="w-4 h-4 text-[#10a37f]" />
                           <span className={`font-semibold ${theme.text.primary}`}>Technologies Used</span>
                         </div>
                         <div className="flex flex-wrap gap-2">
                           {(() => {
                             const isExpanded = expandedTechnologies.has(index)
                             const technologiesToShow = isExpanded ? project.technologies : project.technologies.slice(0, 5)
                             const hasMoreTechnologies = project.technologies.length > 5
                             
                             return (
                               <>
                                 {technologiesToShow.map((tech, techIndex) => (
                                   <span 
                                     key={techIndex} 
                                     className="inline-flex items-center px-3 py-1.5 bg-[#10a37f]/20 text-[#10a37f] text-sm rounded-full border border-[#10a37f]/30 whitespace-nowrap hover:bg-[#10a37f]/30 transition-colors"
                                     title={tech}
                                   >
                                     {tech}
                                   </span>
                                 ))}
                                 {hasMoreTechnologies && !isExpanded && (
                                   <>
                                     <span className="inline-flex items-center px-3 py-1.5 bg-gray-500/20 text-gray-500 text-sm rounded-full border border-gray-500/30">
                                       +{project.technologies.length - 5}
                                     </span>
                                     <button
                                       onClick={() => toggleTechnologiesExpansion(index)}
                                       className="inline-flex items-center px-3 py-1.5 bg-blue-500/20 text-blue-500 text-sm rounded-full border border-blue-500/30 hover:bg-blue-500/30 transition-colors cursor-pointer"
                                     >
                                       See All
                                     </button>
                                   </>
                                 )}
                                 {hasMoreTechnologies && isExpanded && (
                                   <button
                                     onClick={() => toggleTechnologiesExpansion(index)}
                                     className="inline-flex items-center px-3 py-1.5 bg-orange-500/20 text-orange-500 text-sm rounded-full border border-orange-500/30 hover:bg-orange-500/30 transition-colors cursor-pointer"
                                   >
                                     See Less
                                   </button>
                                 )}
                               </>
                             )
                           })()}
                         </div>
                       </div>
                     )}
                  </div>
                </div>
              )
            })}
            
            {/* Projects Summary */}
            <div className={`flex items-center justify-between p-4 rounded-xl ${
              isDark 
                ? 'bg-gradient-to-br from-[#1a1a1a]/40 to-[#2a2a2a]/40 border border-[#10a37f]/20' 
                : 'bg-gradient-to-br from-white/50 to-gray-50/50 border border-[#10a37f]/15'
            } backdrop-blur-sm`}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-[#10a37f]/20 to-[#0d8f6f]/20 backdrop-blur-sm">
                  <Award className="w-4 h-4 text-[#10a37f]" />
                </div>
                <div>
                  <p className={`font-semibold ${theme.text.primary}`}>
                    Total Projects: {user.projects.length}
                  </p>
                  <p className={`text-sm ${theme.text.secondary}`}>
                    Professional portfolio showcase
                  </p>
                </div>
              </div>
              
              {/* Technologies count */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-[#10a37f]" />
                  <span className={`text-sm font-medium ${theme.text.primary}`}>
                    {user.projects.reduce((total, project) => total + (project.technologies?.length || 0), 0)} Technologies
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#10a37f]" />
                  <span className={`text-sm font-medium ${theme.text.primary}`}>
                    {user.projects.filter(p => p.url).length} Live Demos
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="relative mb-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#10a37f]/20 to-[#0d8f6f]/20 flex items-center justify-center backdrop-blur-sm">
                <Award className="w-10 h-10 text-[#10a37f]" />
              </div>
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-[#10a37f] rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white animate-pulse" />
              </div>
            </div>
            
            <h4 className={`text-xl font-semibold ${theme.text.primary} mb-3`}>
              Build Your Portfolio
            </h4>
            <p className={`${theme.text.secondary} text-sm mb-6 max-w-md mx-auto`}>
              Add your projects to showcase your technical skills, creativity, and professional achievements.
            </p>
            
            {isEditMode && onAddProject && (
              <button
                onClick={onAddProject}
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#10a37f] text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl backdrop-blur-sm"
              >
                <Rocket className="w-4 h-4 group-hover:animate-spin" />
                Add Project
                <Target className="w-4 h-4 group-hover:animate-pulse" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect, memo } from "react"
import { X, Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "@/context/ThemeContext"
import { updateProfileSection } from "@/services/user"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { Project } from "@/types"

interface ProjectsSectionEditModalProps {
  isOpen: boolean
  onClose: () => void
  currentProjects: Project[]
  onUpdate: (newProjects: Project[]) => void
  editingProject?: Project | null
  editingIndex?: number | null
  mode: 'add' | 'edit'
}

const ProjectsSectionEditModal = memo(function ProjectsSectionEditModal({
  isOpen,
  onClose,
  currentProjects,
  onUpdate,
  editingProject,
  editingIndex,
  mode = 'add'
}: ProjectsSectionEditModalProps) {
  const [project, setProject] = useState<Project>({
    name: "",
    description: "",
    technologies: [],
    url: "",
    github_url: "",
    duration: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [newTechnology, setNewTechnology] = useState('')
  const { isDark } = useTheme()
  const { user, updateUser } = useAuth()
  const { toast } = useToast()

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && editingProject) {
        setProject({ ...editingProject })
      } else {
        setProject({
          name: "",
          description: "",
          technologies: [],
          url: "",
          github_url: "",
          duration: ""
        })
      }
    }
  }, [isOpen, mode, editingProject])

  // Check if form data meets backend expectations (name and description required)
  const isFormValid = () => {
    return project.name.trim() !== "" && project.description.trim() !== ""
  }

  // Check if there are changes (for edit mode)
  const hasChanges = () => {
    if (mode === 'add') return true
    if (!editingProject) return false
    
    return (
      project.name !== editingProject.name ||
      project.description !== editingProject.description ||
      project.url !== editingProject.url ||
      project.github_url !== editingProject.github_url ||
      project.duration !== editingProject.duration ||
      JSON.stringify(project.technologies) !== JSON.stringify(editingProject.technologies)
    )
  }

  const handleSubmit = async () => {
    if (!user || !isFormValid()) {
      toast({
        title: "Error",
        description: "Please fill in project name and description fields",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    
    try {
      let updatedProjects = [...currentProjects]
      
      if (mode === 'add') {
        // Add new project at the beginning
        updatedProjects.unshift(project)
      } else if (mode === 'edit' && editingIndex !== null && editingIndex !== undefined) {
        // Update existing project
        updatedProjects[editingIndex] = project
      }

      // Call API to update projects
      await updateProfileSection("projects", { projects: updatedProjects })
      
      // Profile update manager will handle the update automatically
      // No need to call onUpdate or updateUser manually
      
      toast({
        title: "Success",
        description: mode === 'add' ? "Project added successfully" : "Project updated successfully",
      })
      onClose()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to ${mode === 'add' ? 'add' : 'update'} project`,
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        className={`relative w-full max-w-lg md:max-w-2xl max-h-[80vh] flex flex-col border-0 rounded-2xl shadow-2xl`}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 50,
          maxHeight: '80vh'
        }}
      >
        {/* Background gradients */}
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-[#1a1a1a] via-[#212121] to-[#1a1a1a]' : 'bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100'}`}></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#10a37f]/10 via-transparent to-[#10a37f]/5"></div>
        
        {/* Decorative floating elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#10a37f]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#10a37f]/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Content wrapper */}
        <div className="relative z-10 w-full h-full flex flex-col max-h-[80vh]">
          {/* Header */}
          <div className={`shrink-0 p-6 border-b ${isDark ? 'border-[#10a37f]/20' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {mode === 'add' ? 'Add New Project' : 'Edit Project'}
              </h2>
              <button
                onClick={onClose}
                className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'} transition-colors p-2 rounded-lg hover:bg-gray-100/10`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 pt-6 pb-6 min-h-0">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Project Name *
                </label>
                <Input
                  value={project.name}
                  onChange={(e) => setProject({ ...project, name: e.target.value })}
                  placeholder="e.g., E-commerce Platform, Task Management App"
                  className={`${isDark ? 'bg-[#1a1a1a] border-[#10a37f]/30 text-white placeholder:text-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-500'}`}
                />
              </div>
              
              <div className="space-y-2">
                <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Description *
                </label>
                <Textarea
                  value={project.description}
                  onChange={(e) => setProject({ ...project, description: e.target.value })}
                  placeholder="Describe your project, its features, and your role..."
                  className={`min-h-[120px] resize-none ${isDark ? 'bg-[#1a1a1a] border-[#10a37f]/30 text-white placeholder:text-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-500'}`}
                  maxLength={500}
                />
                <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                  {project.description.length}/500 characters
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Live Demo URL
                  </label>
                  <Input
                    value={project.url || ""}
                    onChange={(e) => setProject({ ...project, url: e.target.value })}
                    placeholder="https://your-project.com"
                    className={`${isDark ? 'bg-[#1a1a1a] border-[#10a37f]/30 text-white placeholder:text-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-500'}`}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    GitHub Repository
                  </label>
                  <Input
                    value={project.github_url || ""}
                    onChange={(e) => setProject({ ...project, github_url: e.target.value })}
                    placeholder="https://github.com/username/repo"
                    className={`${isDark ? 'bg-[#1a1a1a] border-[#10a37f]/30 text-white placeholder:text-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-500'}`}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Duration
                </label>
                <Input
                  value={project.duration || ""}
                  onChange={(e) => setProject({ ...project, duration: e.target.value })}
                  placeholder="e.g., Jan 2023 - Mar 2023"
                  className={`${isDark ? 'bg-[#1a1a1a] border-[#10a37f]/30 text-white placeholder:text-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-500'}`}
                />
              </div>

              <div className="space-y-2">
                <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Technologies
                </label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={newTechnology}
                      onChange={(e) => setNewTechnology(e.target.value)}
                      placeholder="e.g., React, Node.js, MongoDB"
                      className={`flex-1 ${isDark ? 'bg-[#1a1a1a] border-[#10a37f]/30 text-white placeholder:text-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-500'}`}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && newTechnology.trim()) {
                          e.preventDefault()
                          if (!project.technologies.includes(newTechnology.trim())) {
                            setProject({
                              ...project,
                              technologies: [...project.technologies, newTechnology.trim()]
                            })
                            setNewTechnology('')
                          }
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        if (newTechnology.trim() && !project.technologies.includes(newTechnology.trim())) {
                          setProject({
                            ...project,
                            technologies: [...project.technologies, newTechnology.trim()]
                          })
                          setNewTechnology('')
                        }
                      }}
                      disabled={!newTechnology.trim() || project.technologies.includes(newTechnology.trim())}
                      className="px-4 py-2 bg-[#10a37f] hover:bg-[#0d8f6f] text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      Add
                    </Button>
                  </div>
                  
                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className={`${isDark ? 'bg-[#10a37f]/20 text-[#10a37f] border-[#10a37f]/30' : 'bg-gray-100 text-gray-700 border-gray-200'} cursor-pointer hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900/20 dark:hover:text-red-400`}
                          onClick={() => {
                            setProject({
                              ...project,
                              technologies: project.technologies.filter((_, i) => i !== index)
                            })
                          }}
                        >
                          {tech} ×
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className={`shrink-0 p-6 border-t ${isDark ? 'border-[#10a37f]/20 bg-[#212121]' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className={`bg-transparent ${isDark ? 'border-[#10a37f]/30 text-gray-300 hover:bg-[#10a37f]/10 hover:text-white hover:border-[#10a37f]/50' : 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-400'} disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2 rounded-lg transition-colors`}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !isFormValid() || (mode === 'edit' && !hasChanges())}
                className="bg-[#10a37f] hover:bg-[#0d8f6f] text-white px-8 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {mode === 'add' ? 'Adding...' : 'Updating...'}
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    {mode === 'add' ? 'Add Project' : 'Update Project'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default ProjectsSectionEditModal
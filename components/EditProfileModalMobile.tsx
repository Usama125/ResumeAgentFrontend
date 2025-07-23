"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { getThemeClasses } from '@/utils/theme'
import { calculateTotalExperience } from '@/utils/experienceCalculator'
import UserService from '@/services/user'
import { useErrorHandler } from '@/utils/errorHandler'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  User,
  Briefcase,
  DollarSign,
  CheckCircle,
  X,
  Save,
  Plus,
  Trash2,
  Code,
  Award,
  Settings,
  ChevronLeft,
  ChevronRight,
  Home,
} from "lucide-react"
import { 
  EditProfileFormData, 
  ProfileUpdateData,
  WORK_MODES, 
  EMPLOYMENT_TYPES, 
  AVAILABILITY_OPTIONS 
} from "@/types"

const steps = [
  { id: 1, title: "Basic Info", icon: User, description: "Personal details" },
  { id: 2, title: "Skills", icon: Code, description: "Technical skills" },
  { id: 3, title: "Experience", icon: Briefcase, description: "Work history" },
  { id: 4, title: "Projects", icon: Award, description: "Portfolio projects" },
  { id: 5, title: "Certifications", icon: Award, description: "Certifications" },
  { id: 6, title: "Preferences", icon: Settings, description: "Work & salary" },
]

const workModes = WORK_MODES
const employmentTypes = EMPLOYMENT_TYPES
const availabilityOptions = AVAILABILITY_OPTIONS

interface EditProfileModalMobileProps {
  isOpen: boolean
  onClose: () => void
}

export default function EditProfileModalMobile({ isOpen, onClose }: EditProfileModalMobileProps) {
  const { user, refreshUser } = useAuth()
  const { handleError } = useErrorHandler()
  const { isDark } = useTheme()
  const themeClasses = getThemeClasses(isDark)

  // Modal state
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<EditProfileFormData>({
    name: "",
    email: "",
    designation: "",
    location: "",
    summary: "",
    experience: "",
    skills: [],
    experience_details: [],
    projects: [],
    certifications: [],
    expected_salary: "",
    current_salary: "",
    preferred_work_mode: "",
    employment_type: "",
    notice_period: "",
    availability: "",
    is_looking_for_job: false,
  })
  
  // Track original data for change detection
  const [originalData, setOriginalData] = useState<EditProfileFormData | null>(null)

  // Load user data into form when modal opens
  useEffect(() => {
    if (isOpen && user) {
      const userData = {
        name: user.name || "",
        email: user.email || "",
        designation: user.designation || "",
        location: user.location || "",
        summary: user.summary || "",
        experience: user.experience || calculateTotalExperience(user.experience_details || []),
        skills: user.skills || [],
        experience_details: user.experience_details || [],
        projects: user.projects || [],
        certifications: user.certifications || [],
        expected_salary: user.expected_salary || "",
        current_salary: user.current_salary || "",
        preferred_work_mode: user.work_preferences?.preferred_work_mode?.[0] || "",
        employment_type: user.work_preferences?.preferred_employment_type?.[0] || "",
        notice_period: user.work_preferences?.notice_period || "",
        availability: user.work_preferences?.availability || "",
        is_looking_for_job: user.is_looking_for_job || false,
      }
      setFormData(userData)
      setOriginalData(userData)
    }
  }, [isOpen, user])

  // Reset to first step when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1)
    }
  }, [isOpen])

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Helper function to detect changes
  const getChangedFields = (): ProfileUpdateData => {
    if (!originalData) return {}
    
    const changes: ProfileUpdateData = {}
    
    // Check simple fields
    if (formData.name !== originalData.name) changes.name = formData.name
    if (formData.designation !== originalData.designation) changes.designation = formData.designation
    if (formData.location !== originalData.location) changes.location = formData.location
    if (formData.summary !== originalData.summary) changes.summary = formData.summary
    if (formData.experience !== originalData.experience) changes.experience = formData.experience
    if (formData.expected_salary !== originalData.expected_salary) changes.expected_salary = formData.expected_salary
    if (formData.is_looking_for_job !== originalData.is_looking_for_job) changes.is_looking_for_job = formData.is_looking_for_job
    
    // Check complex fields (arrays/objects)
    if (JSON.stringify(formData.skills) !== JSON.stringify(originalData.skills)) {
      changes.skills = formData.skills
    }
    if (JSON.stringify(formData.experience_details) !== JSON.stringify(originalData.experience_details)) {
      changes.experience_details = formData.experience_details
    }
    if (JSON.stringify(formData.projects) !== JSON.stringify(originalData.projects)) {
      changes.projects = formData.projects
    }
    if (JSON.stringify(formData.certifications) !== JSON.stringify(originalData.certifications)) {
      changes.certifications = formData.certifications
    }
    
    // Check work preferences
    const workPrefsChanged = (
      formData.preferred_work_mode !== originalData.preferred_work_mode ||
      formData.employment_type !== originalData.employment_type ||
      formData.notice_period !== originalData.notice_period ||
      formData.availability !== originalData.availability
    )
    
    if (workPrefsChanged) {
      changes.work_preferences = {
        preferred_work_mode: formData.preferred_work_mode ? [formData.preferred_work_mode] : [],
        preferred_employment_type: formData.employment_type ? [formData.employment_type] : [],
        current_employment_mode: [],
        preferred_location: formData.location || "",
        notice_period: formData.notice_period,
        availability: formData.availability
      }
    }
    
    return changes
  }

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true)

      // Get only changed fields
      const updateData = getChangedFields()
      
      // Only proceed if there are actual changes
      if (Object.keys(updateData).length === 0) {
        onClose()
        return
      }

      await UserService.updateProfile(updateData)
      await refreshUser()
      onClose()
    } catch (err: any) {
      handleError(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Skills management
  const addSkill = (skillName: string) => {
    if (skillName && !formData.skills.some(skill => skill.name === skillName)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, { name: skillName, level: "Intermediate", years: 1 }]
      }))
    }
  }

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }))
  }

  // Experience management - NEW ONES AT TOP
  const addExperience = () => {
    const newExperience = {
      company: "",
      position: "",
      duration: "",
      description: ""
    }
    setFormData(prev => ({
      ...prev,
      experience_details: [newExperience, ...prev.experience_details]
    }))
  }

  const updateExperience = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      experience_details: prev.experience_details.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }))
  }

  const removeExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      experience_details: prev.experience_details.filter((_, i) => i !== index)
    }))
  }

  // Projects management - NEW ONES AT TOP
  const addProject = () => {
    const newProject = {
      name: "",
      description: "",
      technologies: []
    }
    setFormData(prev => ({
      ...prev,
      projects: [newProject, ...prev.projects]
    }))
  }

  const updateProject = (index: number, field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map((proj, i) => 
        i === index ? { ...proj, [field]: value } : proj
      )
    }))
  }

  const removeProject = (index: number) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }))
  }

  const addProjectTechnology = (projectIndex: number, tech: string) => {
    if (tech && !formData.projects[projectIndex].technologies.includes(tech)) {
      updateProject(projectIndex, 'technologies', [...formData.projects[projectIndex].technologies, tech])
    }
  }

  const removeProjectTechnology = (projectIndex: number, techIndex: number) => {
    const updatedTechs = formData.projects[projectIndex].technologies.filter((_, i) => i !== techIndex)
    updateProject(projectIndex, 'technologies', updatedTechs)
  }

  // Certifications management - NEW ONES AT TOP
  const addCertification = (certName: string) => {
    if (certName && !formData.certifications.includes(certName)) {
      setFormData(prev => ({
        ...prev,
        certifications: [certName, ...prev.certifications]
      }))
    }
  }

  const removeCertification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }))
  }

  const renderStepContent = () => {
    const currentStepData = steps[currentStep - 1]
    const StepIcon = currentStepData.icon

    switch (currentStep) {
      case 1: // Basic Info
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              <Label className={`${themeClasses.text.primary} text-sm font-medium`}>Full Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`pl-4 pr-4 py-3 ${themeClasses.bg.input} backdrop-blur-sm ${themeClasses.text.primary} ${themeClasses.placeholder} focus:ring-[#10a37f] rounded-xl transition-all duration-300 ${themeClasses.border.hover} focus:${themeClasses.bg.input} h-12 text-base`}
                placeholder="Your full name"
              />
            </div>

            <div className="space-y-3">
              <Label className={`${themeClasses.text.primary} text-sm font-medium`}>Email</Label>
              <Input
                type="email"
                disabled
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className={`pl-4 pr-4 py-3 ${themeClasses.bg.input} backdrop-blur-sm ${themeClasses.text.primary} ${themeClasses.placeholder} focus:ring-[#10a37f] rounded-xl transition-all duration-300 ${themeClasses.border.hover} focus:${themeClasses.bg.input} h-12 text-base`}
                placeholder="your.email@example.com"
              />
            </div>

            <div className="space-y-3">
              <Label className={`${themeClasses.text.primary} text-sm font-medium`}>Job Title</Label>
              <Input
                value={formData.designation}
                onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
                className={`pl-4 pr-4 py-3 ${themeClasses.bg.input} backdrop-blur-sm ${themeClasses.text.primary} ${themeClasses.placeholder} focus:ring-[#10a37f] rounded-xl transition-all duration-300 ${themeClasses.border.hover} focus:${themeClasses.bg.input} h-12 text-base`}
                placeholder="e.g. Senior Software Engineer"
              />
            </div>

            <div className="space-y-3">
              <Label className={`${themeClasses.text.primary} text-sm font-medium`}>Location</Label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className={`pl-4 pr-4 py-3 ${themeClasses.bg.input} backdrop-blur-sm ${themeClasses.text.primary} ${themeClasses.placeholder} focus:ring-[#10a37f] rounded-xl transition-all duration-300 ${themeClasses.border.hover} focus:${themeClasses.bg.input} h-12 text-base`}
                placeholder="e.g. San Francisco, CA"
              />
            </div>

            <div className="space-y-3">
              <Label className={`${themeClasses.text.primary} text-sm font-medium`}>Professional Summary</Label>
              <Textarea
                value={formData.summary}
                onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                className={`pl-4 pr-4 py-3 ${themeClasses.bg.input} backdrop-blur-sm ${themeClasses.text.primary} min-h-[100px] resize-none focus:ring-[#10a37f] rounded-xl transition-all duration-300 ${themeClasses.border.hover} focus:${themeClasses.bg.input} ${themeClasses.placeholder} text-base`}
                placeholder="Brief summary of your professional background and expertise..."
              />
            </div>

            <div className="space-y-3">
              <Label className={`${themeClasses.text.primary} text-sm font-medium`}>
                Total Experience
                <span className={`text-xs ${themeClasses.text.tertiary} block mt-1`}>
                  (e.g., "5 years", "2.5 years" - or leave blank to auto-calculate)
                </span>
              </Label>
              <Input
                value={formData.experience}
                disabled
                onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                className={`pl-4 pr-4 py-3 ${themeClasses.bg.input} backdrop-blur-sm ${themeClasses.text.primary} ${themeClasses.placeholder} focus:ring-[#10a37f] rounded-xl transition-all duration-300 ${themeClasses.border.hover} focus:${themeClasses.bg.input} h-12 text-base`}
                placeholder={calculateTotalExperience(formData.experience_details) || "e.g., 5 years"}
              />
              {!formData.experience && formData.experience_details.length > 0 && (
                <p className={`text-xs ${themeClasses.text.tertiary}`}>
                  Auto-calculated: {calculateTotalExperience(formData.experience_details)}
                </p>
              )}
            </div>
          </div>
        )

      case 2: // Skills
        return (
          <div className="space-y-4">
            <div className="space-y-4">
              <Label className={`${themeClasses.text.primary} text-sm font-medium`}>Skills</Label>
              <div className={`flex flex-wrap gap-2 p-4 ${themeClasses.bg.tertiary}/20 rounded-lg border ${themeClasses.border.secondary} min-h-[80px]`}>
                {formData.skills.map((skill, index) => (
                  <Badge
                    key={index}
                    className="bg-[#10a37f] hover:bg-[#0d8f6f] text-white flex items-center gap-2 text-sm px-3 py-2 cursor-pointer group h-auto"
                  >
                    <span>{skill.name}</span>
                    <X
                      className="w-4 h-4 opacity-70 hover:opacity-100 group-hover:bg-red-500/20 rounded-full transition-all flex-shrink-0"
                      onClick={() => removeSkill(index)}
                    />
                  </Badge>
                ))}
                {formData.skills.length === 0 && (
                  <span className={`${themeClasses.text.tertiary} text-sm`}>No skills added yet</span>
                )}
              </div>
              <Input
                placeholder="Type a skill and press Enter"
                className={`pl-4 pr-4 py-3 ${themeClasses.bg.input} backdrop-blur-sm ${themeClasses.text.primary} ${themeClasses.placeholder} focus:ring-[#10a37f] rounded-xl transition-all duration-300 ${themeClasses.border.hover} focus:${themeClasses.bg.input} h-12 text-base`}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    const value = (e.target as HTMLInputElement).value.trim()
                    if (value) {
                      addSkill(value)
                      ;(e.target as HTMLInputElement).value = ''
                    }
                  }
                }}
              />
            </div>
          </div>
        )

      case 3: // Experience
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className={`text-lg font-semibold ${themeClasses.text.primary}`}>Work Experience</h4>
              <Button
                type="button"
                onClick={addExperience}
                className="bg-[#10a37f] hover:bg-[#0d8f6f] text-white px-3 py-2 rounded-lg transition-colors text-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
            
            <div className="space-y-3">
              {formData.experience_details.map((exp, index) => (
                <Card key={index} className={`${themeClasses.bg.tertiary}/30 ${themeClasses.border.secondary}`}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <h5 className={`${themeClasses.text.primary} font-medium`}>Experience {index + 1}</h5>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExperience(index)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-1 h-auto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <Label className={`${themeClasses.text.primary} text-sm`}>Company</Label>
                        <Input
                          placeholder="Company name"
                          value={exp.company}
                          onChange={(e) => updateExperience(index, 'company', e.target.value)}
                          className={`${themeClasses.bg.secondary} ${themeClasses.border.primary} ${themeClasses.text.primary} focus:border-[#10a37f] transition-colors ${themeClasses.placeholder} h-11 text-sm mt-1`}
                        />
                      </div>
                      <div>
                        <Label className={`${themeClasses.text.primary} text-sm`}>Position</Label>
                        <Input
                          placeholder="Job title"
                          value={exp.position}
                          onChange={(e) => updateExperience(index, 'position', e.target.value)}
                          className={`${themeClasses.bg.secondary} ${themeClasses.border.primary} ${themeClasses.text.primary} focus:border-[#10a37f] transition-colors ${themeClasses.placeholder} h-11 text-sm mt-1`}
                        />
                      </div>
                      <div>
                        <Label className={`${themeClasses.text.primary} text-sm`}>Duration</Label>
                        <Input
                          placeholder="e.g. Jan 2020 - Dec 2023"
                          value={exp.duration}
                          onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                          className={`${themeClasses.bg.secondary} ${themeClasses.border.primary} ${themeClasses.text.primary} focus:border-[#10a37f] transition-colors ${themeClasses.placeholder} h-11 text-sm mt-1`}
                        />
                      </div>
                      <div>
                        <Label className={`${themeClasses.text.primary} text-sm`}>Description</Label>
                        <Textarea
                          placeholder="Describe your role, responsibilities, and achievements..."
                          value={exp.description}
                          onChange={(e) => updateExperience(index, 'description', e.target.value)}
                          className={`${themeClasses.bg.secondary} ${themeClasses.border.primary} ${themeClasses.text.primary} min-h-[80px] resize-none focus:border-[#10a37f] transition-colors ${themeClasses.placeholder} text-sm mt-1`}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {formData.experience_details.length === 0 && (
                <div className={`text-center py-8 border-2 border-dashed ${themeClasses.border.primary} rounded-lg`}>
                  <Briefcase className={`w-8 h-8 ${themeClasses.text.tertiary} mx-auto mb-3`} />
                  <p className={`${themeClasses.text.tertiary} mb-3 text-sm`}>No work experience added yet</p>
                  <Button
                    type="button"
                    onClick={addExperience}
                    className="bg-[#10a37f] hover:bg-[#0d8f6f] text-white text-sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Experience
                  </Button>
                </div>
              )}
            </div>
          </div>
        )

      case 4: // Projects
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className={`text-lg font-semibold ${themeClasses.text.primary}`}>Projects</h4>
              <Button
                type="button"
                onClick={addProject}
                className="bg-[#10a37f] hover:bg-[#0d8f6f] text-white px-3 py-2 rounded-lg transition-colors text-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
            
            <div className="space-y-3">
              {formData.projects.map((project, index) => (
                <Card key={index} className={`${themeClasses.bg.tertiary}/30 ${themeClasses.border.secondary}`}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <h5 className={`${themeClasses.text.primary} font-medium`}>Project {index + 1}</h5>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeProject(index)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-1 h-auto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <Label className={`${themeClasses.text.primary} text-sm`}>Project Name</Label>
                        <Input
                          placeholder="Project name"
                          value={project.name}
                          onChange={(e) => updateProject(index, 'name', e.target.value)}
                          className={`${themeClasses.bg.secondary} ${themeClasses.border.primary} ${themeClasses.text.primary} focus:border-[#10a37f] transition-colors ${themeClasses.placeholder} h-11 text-sm mt-1`}
                        />
                      </div>
                      
                      <div>
                        <Label className={`${themeClasses.text.primary} text-sm`}>Description</Label>
                        <Textarea
                          placeholder="Describe your project, what it does, and your role..."
                          value={project.description}
                          onChange={(e) => updateProject(index, 'description', e.target.value)}
                          className={`${themeClasses.bg.secondary} ${themeClasses.border.primary} ${themeClasses.text.primary} min-h-[60px] resize-none focus:border-[#10a37f] transition-colors ${themeClasses.placeholder} text-sm mt-1`}
                        />
                      </div>

                      <div>
                        <Label className={`${themeClasses.text.primary} text-sm`}>Technologies</Label>
                        <div className={`flex flex-wrap gap-1 p-3 ${themeClasses.bg.secondary} rounded border ${themeClasses.border.primary} mt-1 min-h-[60px]`}>
                          {project.technologies.map((tech, techIndex) => (
                            <Badge
                              key={techIndex}
                              className={`${isDark ? 'bg-[#565869]' : 'bg-gray-300'} ${isDark ? 'text-white' : 'text-gray-700'} flex items-center gap-1 text-xs px-2 py-1 h-auto`}
                            >
                              <span>{tech}</span>
                              <X
                                className="w-3 h-3 cursor-pointer"
                                onClick={() => removeProjectTechnology(index, techIndex)}
                              />
                            </Badge>
                          ))}
                          {project.technologies.length === 0 && (
                            <span className={`${themeClasses.text.tertiary} text-xs`}>No technologies added</span>
                          )}
                        </div>
                        <Input
                          placeholder="Add technology and press Enter"
                          className={`${themeClasses.bg.secondary} ${themeClasses.border.primary} ${themeClasses.text.primary} text-sm focus:border-[#10a37f] transition-colors ${themeClasses.placeholder} h-10 mt-2`}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              const value = (e.target as HTMLInputElement).value.trim()
                              if (value) {
                                addProjectTechnology(index, value)
                                ;(e.target as HTMLInputElement).value = ''
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {formData.projects.length === 0 && (
                <div className={`text-center py-8 border-2 border-dashed ${themeClasses.border.primary} rounded-lg`}>
                  <Award className={`w-8 h-8 ${themeClasses.text.tertiary} mx-auto mb-3`} />
                  <p className={`${themeClasses.text.tertiary} mb-3 text-sm`}>No projects added yet</p>
                  <div className="flex justify-center">
                    <Button
                      type="button"
                      onClick={addProject}
                      className="bg-[#10a37f] hover:bg-[#0d8f6f] text-white text-sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Project
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      case 5: // Certifications
        return (
          <div className="space-y-4">
            <div className="space-y-4">
              <Label className={`${themeClasses.text.primary} text-sm font-medium`}>Certifications</Label>
              <div className={`flex flex-wrap gap-2 p-4 ${themeClasses.bg.tertiary}/20 rounded-lg border ${themeClasses.border.secondary} min-h-[80px]`}>
                {formData.certifications.map((cert, index) => (
                  <Badge
                    key={index}
                    className={`${isDark ? 'bg-[#565869] hover:bg-[#565869]/80' : 'bg-gray-300 hover:bg-gray-400'} ${isDark ? 'text-white' : 'text-gray-700'} flex items-center gap-2 text-sm px-3 py-2 cursor-pointer group h-auto`}
                  >
                    <span>{cert}</span>
                    <X
                      className="w-4 h-4 opacity-70 hover:opacity-100 group-hover:bg-red-500/20 rounded-full transition-all flex-shrink-0"
                      onClick={() => removeCertification(index)}
                    />
                  </Badge>
                ))}
                {formData.certifications.length === 0 && (
                  <span className={`${themeClasses.text.tertiary} text-sm`}>No certifications added yet</span>
                )}
              </div>
              <Input
                placeholder="Type a certification and press Enter"
                className={`pl-4 pr-4 py-3 ${themeClasses.bg.input} backdrop-blur-sm ${themeClasses.text.primary} ${themeClasses.placeholder} focus:ring-[#10a37f] rounded-xl transition-all duration-300 ${themeClasses.border.hover} focus:${themeClasses.bg.input} h-12 text-base`}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    const value = (e.target as HTMLInputElement).value.trim()
                    if (value) {
                      addCertification(value)
                      ;(e.target as HTMLInputElement).value = ''
                    }
                  }
                }}
              />
            </div>
          </div>
        )

      case 6: // Preferences
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className={`${themeClasses.text.primary} text-sm font-medium`}>Preferred Work Mode</Label>
              <div className="space-y-3">
                {workModes.map((mode) => (
                  <div
                    key={mode.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      formData.preferred_work_mode === mode.id
                        ? "border-[#10a37f] bg-[#10a37f]/10"
                        : `${themeClasses.border.primary} ${themeClasses.bg.tertiary}/30 hover:${themeClasses.bg.tertiary}/50`
                    }`}
                    onClick={() => {
                      const newValue = formData.preferred_work_mode === mode.id ? "" : mode.id
                      setFormData(prev => ({ 
                        ...prev, 
                        preferred_work_mode: newValue 
                      }))
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-white font-medium text-base">{mode.label}</p>
                        <p className="text-gray-300 text-sm mt-1">{mode.description}</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ml-3 shrink-0 ${
                        formData.preferred_work_mode === mode.id
                          ? "border-[#10a37f] bg-white"
                          : "border-gray-400 bg-transparent"
                      }`}>
                        {formData.preferred_work_mode === mode.id && (
                          <div className="w-3 h-3 rounded-full bg-[#10a37f] mx-auto"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label className={`${themeClasses.text.primary} text-sm font-medium`}>Employment Type</Label>
              <div className="space-y-3">
                {employmentTypes.map((type) => (
                  <div
                    key={type.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      formData.employment_type === type.id
                        ? "border-[#10a37f] bg-[#10a37f]/10"
                        : `${themeClasses.border.primary} ${themeClasses.bg.tertiary}/30 hover:${themeClasses.bg.tertiary}/50`
                    }`}
                    onClick={() => {
                      const newValue = formData.employment_type === type.id ? "" : type.id
                      setFormData(prev => ({ 
                        ...prev, 
                        employment_type: newValue 
                      }))
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-white font-medium text-base">{type.label}</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ml-3 shrink-0 ${
                        formData.employment_type === type.id
                          ? "border-[#10a37f] bg-white"
                          : "border-gray-400 bg-transparent"
                      }`}>
                        {formData.employment_type === type.id && (
                          <div className="w-3 h-3 rounded-full bg-[#10a37f] mx-auto"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <Label className={`${themeClasses.text.primary} text-sm font-medium`}>Expected Salary</Label>
                <Input
                  value={formData.expected_salary}
                  onChange={(e) => setFormData(prev => ({ ...prev, expected_salary: e.target.value }))}
                  className={`pl-4 pr-4 py-3 ${themeClasses.bg.input} backdrop-blur-sm ${themeClasses.text.primary} ${themeClasses.placeholder} focus:ring-[#10a37f] rounded-xl transition-all duration-300 ${themeClasses.border.hover} focus:${themeClasses.bg.input} h-12 text-base`}
                  placeholder="e.g. $80k - $120k"
                />
              </div>

              <div className="space-y-3">
                <Label className={`${themeClasses.text.primary} text-sm font-medium`}>Notice Period</Label>
                <Input
                  value={formData.notice_period}
                  onChange={(e) => setFormData(prev => ({ ...prev, notice_period: e.target.value }))}
                  className={`pl-4 pr-4 py-3 ${themeClasses.bg.input} backdrop-blur-sm ${themeClasses.text.primary} ${themeClasses.placeholder} focus:ring-[#10a37f] rounded-xl transition-all duration-300 ${themeClasses.border.hover} focus:${themeClasses.bg.input} h-12 text-base`}
                  placeholder="e.g. 2 weeks, 1 month"
                />
              </div>

              {/* Job Search Toggle */}
              <div className={`flex items-center justify-between p-4 ${themeClasses.bg.tertiary}/30 rounded-lg border ${themeClasses.border.secondary}`}>
                <div>
                  <p className={`${themeClasses.text.primary} font-medium text-sm`}>Open to work</p>
                  <p className={`${themeClasses.text.tertiary} text-xs mt-1`}>Show that you're actively looking for opportunities</p>
                </div>
                <Switch
                  checked={formData.is_looking_for_job}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_looking_for_job: checked }))}
                />
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={true}>
      <DialogContent 
        className={`w-[95vw] max-w-md h-[90vh] relative overflow-hidden ${themeClasses.text.primary} p-0 flex flex-col border-0 [&>button[data-radix-collection-item]]:hidden [&>button]:!hidden`}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 50
        }}
      >
        {/* Inline style to hide default close button */}
        <style dangerouslySetInnerHTML={{
          __html: `
            [data-radix-dialog-content] > button[aria-label="Close"],
            [data-radix-dialog-content] > button:first-child,
            .dialog-close-button {
              display: none !important;
            }
          `
        }} />
        
        {/* Background gradients */}
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-[#1a1a1a] via-[#212121] to-[#1a1a1a]' : 'bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100'}`}></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#10a37f]/10 via-transparent to-[#10a37f]/5"></div>
        
        {/* Decorative floating elements */}
        <div className="absolute top-10 left-5 w-16 h-16 bg-[#10a37f]/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-5 w-20 h-20 bg-[#10a37f]/15 rounded-full blur-2xl animate-pulse delay-1000"></div>
        
        {/* Content wrapper */}
        <div className="relative z-10 w-full h-full flex flex-col">
        {/* Mobile Header with Step Indicator */}
        <div className={`shrink-0 p-4 border-b ${themeClasses.border.primary}`}>
          <DialogHeader className="mb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className={`${themeClasses.text.primary} text-lg font-semibold`}>
                Edit Profile
              </DialogTitle>
              <div className="flex items-center gap-4">
                <div className={`text-sm ${themeClasses.text.tertiary}`}>
                  {currentStep} of {steps.length}
                </div>
                <button
                  onClick={onClose}
                  className={`${themeClasses.text.tertiary} hover:${themeClasses.text.primary} transition-colors p-2 rounded-lg hover:bg-gray-100/10`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </DialogHeader>

          {/* Current Step Info */}
          <div className="flex items-center space-x-3 mb-4">
            <div className={`w-10 h-10 rounded-full bg-[#10a37f] flex items-center justify-center text-white`}>
              {(() => {
                const StepIcon = steps[currentStep - 1].icon;
                return <StepIcon className="w-5 h-5" />;
              })()}
            </div>
            <div>
              <h3 className={`${themeClasses.text.primary} font-medium`}>{steps[currentStep - 1].title}</h3>
              <p className={`${themeClasses.text.tertiary} text-sm`}>{steps[currentStep - 1].description}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className={`w-full h-2 ${themeClasses.bg.tertiary} rounded-full overflow-hidden`}>
            <div 
              className="h-full bg-[#10a37f] transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {renderStepContent()}
        </div>

        {/* Mobile Footer with Navigation */}
        <div className={`shrink-0 p-4 border-t ${themeClasses.border.primary} ${themeClasses.bg.secondary}`}>
          <div className="flex justify-between items-center gap-3">
            <Button
              variant="outline"
              onClick={handlePreviousStep}
              disabled={currentStep === 1}
              className={`flex-1 bg-transparent ${themeClasses.border.primary} ${themeClasses.text.secondary} hover:${themeClasses.bg.tertiary} hover:${themeClasses.text.primary} disabled:opacity-50 disabled:cursor-not-allowed h-12 transition-colors`}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>

            {currentStep === steps.length ? (
              <Button
                onClick={handleSaveProfile}
                disabled={isLoading}
                className="flex-1 bg-[#10a37f] hover:bg-[#0d8f6f] text-white h-12 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-4 h-4 bg-white/60 rounded animate-pulse mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Changes
              </Button>
            ) : (
              <Button
                onClick={handleNextStep}
                className="flex-1 bg-[#10a37f] hover:bg-[#0d8f6f] text-white h-12 transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
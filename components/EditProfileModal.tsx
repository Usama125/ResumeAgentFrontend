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

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
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
    additional_info: "",
    experience: "",
    skills: [],
    experience_details: [],
    projects: [],
    certifications: [],
    expected_salary: "",
    current_salary: "",
    preferred_work_mode: [],
    preferred_employment_type: [],
    preferred_location: "",
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
        additional_info: user.additional_info || "",
        experience: user.experience || calculateTotalExperience(user.experience_details || []),
        skills: user.skills || [],
        experience_details: user.experience_details || [],
        projects: user.projects || [],
        certifications: user.certifications || [],
        expected_salary: user.expected_salary || "",
        current_salary: user.current_salary || "",
        preferred_work_mode: user.work_preferences?.preferred_work_mode || [],
        preferred_employment_type: user.work_preferences?.preferred_employment_type || [],
        preferred_location: user.work_preferences?.preferred_location || "",
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
    if (formData.additional_info !== originalData.additional_info) changes.additional_info = formData.additional_info
    if (formData.experience !== originalData.experience) changes.experience = formData.experience
    if (formData.expected_salary !== originalData.expected_salary) changes.expected_salary = formData.expected_salary
    if (formData.current_salary !== originalData.current_salary) changes.current_salary = formData.current_salary
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
      JSON.stringify(formData.preferred_work_mode) !== JSON.stringify(originalData.preferred_work_mode) ||
      JSON.stringify(formData.preferred_employment_type) !== JSON.stringify(originalData.preferred_employment_type) ||
      formData.preferred_location !== originalData.preferred_location ||
      formData.notice_period !== originalData.notice_period ||
      formData.availability !== originalData.availability
    )
    
    if (workPrefsChanged) {
      changes.work_preferences = {
        preferred_work_mode: formData.preferred_work_mode,
        preferred_employment_type: formData.preferred_employment_type,
        current_employment_mode: [],
        preferred_location: formData.preferred_location,
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

  const updateSkill = (index: number, field: 'name' | 'level' | 'years', value: string | number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => 
        i === index ? { ...skill, [field]: value } : skill
      )
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
      technologies: [],
      url: "",
      github_url: ""
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
    switch (currentStep) {
      case 1: // Basic Info
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className={`${themeClasses.text.primary} text-sm font-medium`}>Full Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={`pl-4 pr-4 py-3 ${themeClasses.bg.input} backdrop-blur-sm ${themeClasses.text.primary} ${themeClasses.placeholder} focus:ring-[#10a37f] rounded-xl transition-all duration-300 ${themeClasses.border.hover} focus:${themeClasses.bg.input}`}
                  placeholder="Your full name"
                />
              </div>

              <div className="space-y-2">
                <Label className={`${themeClasses.text.primary} text-sm font-medium`}>Email</Label>
                <Input
                  type="email"
                  disabled
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className={`pl-4 pr-4 py-3 ${themeClasses.bg.input} backdrop-blur-sm ${themeClasses.text.primary} ${themeClasses.placeholder} focus:ring-[#10a37f] rounded-xl transition-all duration-300 ${themeClasses.border.hover} focus:${themeClasses.bg.input}`}
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label className={`${themeClasses.text.primary} text-sm font-medium`}>Job Title</Label>
                <Input
                  value={formData.designation}
                  onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
                  className={`pl-4 pr-4 py-3 ${themeClasses.bg.input} backdrop-blur-sm ${themeClasses.text.primary} ${themeClasses.placeholder} focus:ring-[#10a37f] rounded-xl transition-all duration-300 ${themeClasses.border.hover} focus:${themeClasses.bg.input}`}
                  placeholder="e.g. Senior Software Engineer"
                />
              </div>

              <div className="space-y-2">
                <Label className={`${themeClasses.text.primary} text-sm font-medium`}>Location</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className={`pl-4 pr-4 py-3 ${themeClasses.bg.input} backdrop-blur-sm ${themeClasses.text.primary} ${themeClasses.placeholder} focus:ring-[#10a37f] rounded-xl transition-all duration-300 ${themeClasses.border.hover} focus:${themeClasses.bg.input}`}
                  placeholder="e.g. San Francisco, CA"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className={`${themeClasses.text.primary} text-sm font-medium`}>Professional Summary</Label>
              <Textarea
                value={formData.summary}
                onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                className={`pl-4 pr-4 py-3 ${themeClasses.bg.input} backdrop-blur-sm ${themeClasses.text.primary} min-h-[120px] resize-none focus:ring-[#10a37f] rounded-xl transition-all duration-300 ${themeClasses.border.hover} focus:${themeClasses.bg.input} ${themeClasses.placeholder}`}
                placeholder="Brief summary of your professional background and expertise..."
              />
            </div>

            <div className="space-y-2">
              <Label className={`${themeClasses.text.primary} text-sm font-medium`}>Additional Information</Label>
              <Textarea
                value={formData.additional_info}
                onChange={(e) => setFormData(prev => ({ ...prev, additional_info: e.target.value }))}
                className={`pl-4 pr-4 py-3 ${themeClasses.bg.input} backdrop-blur-sm ${themeClasses.text.primary} min-h-[120px] resize-none focus:ring-[#10a37f] rounded-xl transition-all duration-300 ${themeClasses.border.hover} focus:${themeClasses.bg.input} ${themeClasses.placeholder}`}
                placeholder="Any additional information about yourself, achievements, or special circumstances..."
              />
            </div>

            <div className="space-y-2">
              <Label className={`${themeClasses.text.primary} text-sm font-medium`}>
                Total Experience
                <span className={`text-xs ${themeClasses.text.tertiary} ml-2`}>
                  (Calculated automatically based on your work experience)
                </span>
              </Label>
              <Input
                value={formData.experience}
                disabled
                onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                className={`pl-4 pr-4 py-3 ${themeClasses.bg.input} backdrop-blur-sm ${themeClasses.text.primary} ${themeClasses.placeholder} focus:ring-[#10a37f] rounded-xl transition-all duration-300 ${themeClasses.border.hover} focus:${themeClasses.bg.input}`}
                placeholder={calculateTotalExperience(formData.experience_details) || "e.g., 5 years"}
              />
              {!formData.experience && formData.experience_details.length > 0 && (
                <p className={`text-xs ${themeClasses.text.tertiary}`}>
                  Auto-calculated: {calculateTotalExperience(formData.experience_details)}
                </p>
              )}
            </div>

            {/* Job Status Toggle */}
            <div className="space-y-2">
              <Label className={`${themeClasses.text.primary} text-sm font-medium`}>Job Status</Label>
              <div className={`flex items-center justify-between p-4 rounded-lg ${themeClasses.bg.tertiary}/30 border ${themeClasses.border.secondary}`}>
                <div>
                  <p className={`${themeClasses.text.primary} font-medium text-sm`}>Currently looking for job opportunities?</p>
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

      case 2: // Skills
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-lg font-semibold ${themeClasses.text.primary}`}>Technical Skills</h3>
                <p className={`${themeClasses.text.tertiary} text-sm`}>Add your technical skills with expertise level and years of experience</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Add New Skill */}
              <div className={`p-4 ${themeClasses.bg.tertiary}/20 rounded-lg border ${themeClasses.border.secondary}`}>
                <Label className={`${themeClasses.text.primary} text-sm font-medium mb-3 block`}>Add New Skill</Label>
                <Input
                  placeholder="Type a skill and press Enter"
                  className={`pl-4 pr-4 py-3 ${themeClasses.bg.input} backdrop-blur-sm ${themeClasses.text.primary} ${themeClasses.placeholder} focus:ring-[#10a37f] rounded-xl transition-all duration-300 ${themeClasses.border.hover} focus:${themeClasses.bg.input}`}
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

              {/* Skills List */}
              <div className="space-y-3">
                <Label className={`${themeClasses.text.primary} text-sm font-medium`}>Your Skills</Label>
                {formData.skills.length === 0 ? (
                  <div className={`text-center py-8 border-2 border-dashed ${themeClasses.border.primary} rounded-lg`}>
                    <Code className={`w-12 h-12 ${themeClasses.text.tertiary} mx-auto mb-4`} />
                    <p className={`${themeClasses.text.tertiary} mb-4`}>No skills added yet</p>
                    <p className={`${themeClasses.text.tertiary} text-sm`}>Start typing above to add your first skill</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.skills.map((skill, index) => (
                      <Card key={index} className={`${themeClasses.bg.tertiary}/30 ${themeClasses.border.secondary} ${themeClasses.border.hover} transition-colors`}>
                        <CardContent className="p-4 space-y-4">
                          <div className="flex justify-between items-start">
                            <h4 className={`${themeClasses.text.primary} text-base font-medium`}>Skill {index + 1}</h4>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSkill(index)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Skill Name */}
                            <div className="space-y-2">
                              <Label className={`${themeClasses.text.primary} text-sm`}>Skill Name</Label>
                              <Input
                                placeholder="e.g. JavaScript, Python, React"
                                value={skill.name}
                                onChange={(e) => updateSkill(index, 'name', e.target.value)}
                                className={`${themeClasses.bg.secondary} ${themeClasses.border.primary} ${themeClasses.text.primary} focus:border-[#10a37f] transition-colors ${themeClasses.placeholder}`}
                              />
                            </div>

                            {/* Skill Level */}
                            <div className="space-y-2">
                              <Label className={`${themeClasses.text.primary} text-sm`}>Expertise Level</Label>
                              <select
                                value={skill.level}
                                onChange={(e) => updateSkill(index, 'level', e.target.value)}
                                className={`w-full px-3 py-2 rounded-lg border ${themeClasses.bg.secondary} ${themeClasses.border.primary} ${themeClasses.text.primary} focus:border-[#10a37f] transition-colors focus:outline-none focus:ring-1 focus:ring-[#10a37f]`}
                              >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                                <option value="Expert">Expert</option>
                              </select>
                            </div>

                            {/* Years of Experience */}
                            <div className="space-y-2">
                              <Label className={`${themeClasses.text.primary} text-sm`}>Years of Experience</Label>
                              <Input
                                type="number"
                                min="0"
                                max="50"
                                placeholder="e.g. 3"
                                value={skill.years}
                                onChange={(e) => updateSkill(index, 'years', parseInt(e.target.value) || 0)}
                                className={`${themeClasses.bg.secondary} ${themeClasses.border.primary} ${themeClasses.text.primary} focus:border-[#10a37f] transition-colors ${themeClasses.placeholder}`}
                              />
                            </div>
                          </div>

                          {/* Skill Level Indicator */}
                          <div className="flex items-center gap-3">
                            <span className={`text-xs ${themeClasses.text.tertiary}`}>Level:</span>
                            <Badge 
                              className={`${
                                skill.level === 'Expert' ? 'bg-green-500 hover:bg-green-600' :
                                skill.level === 'Advanced' ? 'bg-blue-500 hover:bg-blue-600' :
                                skill.level === 'Intermediate' ? 'bg-gray-500 hover:bg-gray-600' :
                                'bg-gray-400 hover:bg-gray-500'
                              } text-white text-xs px-2 py-1`}
                            >
                              {skill.level}
                            </Badge>
                            <span className={`text-xs ${themeClasses.text.tertiary}`}>
                              {skill.years} {skill.years === 1 ? 'year' : 'years'} of experience
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case 3: // Experience
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-lg font-semibold ${themeClasses.text.primary}`}>Work Experience</h3>
                <p className={`${themeClasses.text.tertiary} text-sm`}>Add your professional work history</p>
              </div>
              <Button
                type="button"
                onClick={addExperience}
                className="bg-[#10a37f] hover:bg-[#0d8f6f] text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Experience
              </Button>
            </div>
            
            <div className="space-y-4">
              {formData.experience_details.map((exp, index) => (
                <Card key={index} className={`${themeClasses.bg.tertiary}/30 ${themeClasses.border.secondary} ${themeClasses.border.hover} transition-colors`}>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className={`${themeClasses.text.primary} text-lg font-medium`}>Experience {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExperience(index)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className={`${themeClasses.text.primary} text-sm`}>Company</Label>
                        <Input
                          placeholder="Company name"
                          value={exp.company}
                          onChange={(e) => updateExperience(index, 'company', e.target.value)}
                          className={`${themeClasses.bg.secondary} ${themeClasses.border.primary} ${themeClasses.text.primary} focus:border-[#10a37f] transition-colors ${themeClasses.placeholder}`}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className={`${themeClasses.text.primary} text-sm`}>Position</Label>
                        <Input
                          placeholder="Job title"
                          value={exp.position}
                          onChange={(e) => updateExperience(index, 'position', e.target.value)}
                          className={`${themeClasses.bg.secondary} ${themeClasses.border.primary} ${themeClasses.text.primary} focus:border-[#10a37f] transition-colors ${themeClasses.placeholder}`}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className={`${themeClasses.text.primary} text-sm`}>Duration</Label>
                      <Input
                        placeholder="e.g. Jan 2020 - Dec 2023"
                        value={exp.duration}
                        onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                        className={`${themeClasses.bg.secondary} ${themeClasses.border.primary} ${themeClasses.text.primary} focus:border-[#10a37f] transition-colors ${themeClasses.placeholder}`}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className={`${themeClasses.text.primary} text-sm`}>Description</Label>
                      <Textarea
                        placeholder="Describe your role, responsibilities, and achievements..."
                        value={exp.description}
                        onChange={(e) => updateExperience(index, 'description', e.target.value)}
                        className={`${themeClasses.bg.secondary} ${themeClasses.border.primary} ${themeClasses.text.primary} min-h-[100px] resize-none focus:border-[#10a37f] transition-colors ${themeClasses.placeholder}`}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {formData.experience_details.length === 0 && (
                <div className={`text-center py-12 border-2 border-dashed ${themeClasses.border.primary} rounded-lg`}>
                  <Briefcase className={`w-12 h-12 ${themeClasses.text.tertiary} mx-auto mb-4`} />
                  <p className={`${themeClasses.text.tertiary} mb-4`}>No work experience added yet</p>
                  <Button
                    type="button"
                    onClick={addExperience}
                    className="bg-[#10a37f] hover:bg-[#0d8f6f] text-white"
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
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-lg font-semibold ${themeClasses.text.primary}`}>Projects</h3>
                <p className={`${themeClasses.text.tertiary} text-sm`}>Showcase your portfolio projects</p>
              </div>
              <Button
                type="button"
                onClick={addProject}
                className="bg-[#10a37f] hover:bg-[#0d8f6f] text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </div>
            
            <div className="space-y-4">
              {formData.projects.map((project, index) => (
                <Card key={index} className={`${themeClasses.bg.tertiary}/30 ${themeClasses.border.secondary} ${themeClasses.border.hover} transition-colors`}>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className={`${themeClasses.text.primary} text-lg font-medium`}>Project {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeProject(index)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className={`${themeClasses.text.primary} text-sm`}>Project Name</Label>
                      <Input
                        placeholder="Project name"
                        value={project.name}
                        onChange={(e) => updateProject(index, 'name', e.target.value)}
                        className={`${themeClasses.bg.secondary} ${themeClasses.border.primary} ${themeClasses.text.primary} focus:border-[#10a37f] transition-colors ${themeClasses.placeholder}`}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className={`${themeClasses.text.primary} text-sm`}>Description</Label>
                      <Textarea
                        placeholder="Describe your project, what it does, and your role..."
                        value={project.description}
                        onChange={(e) => updateProject(index, 'description', e.target.value)}
                        className={`${themeClasses.bg.secondary} ${themeClasses.border.primary} ${themeClasses.text.primary} min-h-[80px] resize-none focus:border-[#10a37f] transition-colors ${themeClasses.placeholder}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className={`${themeClasses.text.primary} text-sm`}>Project URL (Optional)</Label>
                      <Input
                        type="url"
                        placeholder="https://project-demo.com or https://project.vercel.app"
                        value={project.url || ""}
                        onChange={(e) => updateProject(index, 'url', e.target.value)}
                        className={`${themeClasses.bg.secondary} ${themeClasses.border.primary} ${themeClasses.text.primary} focus:border-[#10a37f] transition-colors ${themeClasses.placeholder}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className={`${themeClasses.text.primary} text-sm`}>GitHub Repository (Optional)</Label>
                      <Input
                        type="url"
                        placeholder="https://github.com/username/project"
                        value={project.github_url || ""}
                        onChange={(e) => updateProject(index, 'github_url', e.target.value)}
                        className={`${themeClasses.bg.secondary} ${themeClasses.border.primary} ${themeClasses.text.primary} focus:border-[#10a37f] transition-colors ${themeClasses.placeholder}`}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className={`${themeClasses.text.primary} text-sm`}>Technologies</Label>
                      <div className={`grid grid-cols-2 md:grid-cols-3 gap-2 p-3 ${themeClasses.bg.secondary} rounded border ${themeClasses.border.primary}`}>
                        {project.technologies.map((tech, techIndex) => (
                          <Badge
                            key={techIndex}
                            className={`${isDark ? 'bg-[#565869]' : 'bg-gray-300'} ${isDark ? 'text-white' : 'text-gray-700'} flex items-center justify-between gap-1 text-xs px-2 py-1`}
                          >
                            <span className="truncate">{tech}</span>
                            <X
                              className="w-3 h-3 cursor-pointer flex-shrink-0"
                              onClick={() => removeProjectTechnology(index, techIndex)}
                            />
                          </Badge>
                        ))}
                      </div>
                      <Input
                        placeholder="Add technology and press Enter"
                        className={`${themeClasses.bg.secondary} ${themeClasses.border.primary} ${themeClasses.text.primary} text-sm focus:border-[#10a37f] transition-colors ${themeClasses.placeholder}`}
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
                  </CardContent>
                </Card>
              ))}
              
              {formData.projects.length === 0 && (
                <div className={`text-center py-12 border-2 border-dashed ${themeClasses.border.primary} rounded-lg`}>
                  <Award className={`w-12 h-12 ${themeClasses.text.tertiary} mx-auto mb-4`} />
                  <p className={`${themeClasses.text.tertiary} mb-4`}>No projects added yet</p>
                  <div className="flex justify-center">
                    <Button
                      type="button"
                      onClick={addProject}
                      className="bg-[#10a37f] hover:bg-[#0d8f6f] text-white"
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
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className={`text-lg font-semibold ${themeClasses.text.primary} mb-2`}>Certifications</h3>
              <p className={`${themeClasses.text.tertiary} text-sm`}>Add your professional certifications and credentials</p>
            </div>

            <div className="space-y-4">
              <Label className={`${themeClasses.text.primary} text-sm font-medium`}>Certifications</Label>
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 p-4 ${themeClasses.bg.tertiary}/20 rounded-lg border ${themeClasses.border.secondary}`}>
                {formData.certifications.map((cert, index) => (
                  <Badge
                    key={index}
                    className={`${isDark ? 'bg-[#565869] hover:bg-[#565869]/80' : 'bg-gray-300 hover:bg-gray-400'} ${isDark ? 'text-white' : 'text-gray-700'} flex items-center justify-between gap-2 text-sm px-3 py-2 cursor-pointer group h-10`}
                  >
                    <span className="truncate">{cert}</span>
                    <X
                      className="w-4 h-4 opacity-70 hover:opacity-100 group-hover:bg-red-500/20 rounded-full transition-all flex-shrink-0"
                      onClick={() => removeCertification(index)}
                    />
                  </Badge>
                ))}
              </div>
              <Input
                placeholder="Type a certification and press Enter"
                className={`pl-4 pr-4 py-3 ${themeClasses.bg.input} backdrop-blur-sm ${themeClasses.text.primary} ${themeClasses.placeholder} focus:ring-[#10a37f] rounded-xl transition-all duration-300 ${themeClasses.border.hover} focus:${themeClasses.bg.input}`}
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
            <div className="text-center mb-6">
              <h3 className={`text-lg font-semibold ${themeClasses.text.primary} mb-2`}>Work Preferences</h3>
              <p className={`${themeClasses.text.tertiary} text-sm`}>Set your work preferences and salary expectations</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Work Preferences Column */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className={`${themeClasses.text.primary} text-sm font-medium`}>Preferred Work Modes</Label>
                  <div className="grid grid-cols-1 gap-3">
                    {workModes.map((mode) => (
                      <div
                        key={mode.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          formData.preferred_work_mode.includes(mode.id)
                            ? "border-[#10a37f] bg-[#10a37f]/10"
                            : `${themeClasses.border.primary} ${themeClasses.bg.tertiary}/30 ${themeClasses.border.hover} hover:${themeClasses.bg.tertiary}/50`
                        }`}
                        onClick={() => {
                          const newModes = formData.preferred_work_mode.includes(mode.id)
                            ? formData.preferred_work_mode.filter(m => m !== mode.id)
                            : [...formData.preferred_work_mode, mode.id]
                          setFormData(prev => ({ 
                            ...prev, 
                            preferred_work_mode: newModes 
                          }))
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className={`${themeClasses.text.primary} font-medium text-sm`}>{mode.label}</p>
                            <p className={`${themeClasses.text.tertiary} text-xs mt-1`}>{mode.description}</p>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ml-3 shrink-0 ${
                            formData.preferred_work_mode.includes(mode.id)
                              ? "border-[#10a37f] bg-white"
                              : `${isDark ? 'border-gray-400' : 'border-gray-300'} bg-transparent`
                          }`}>
                            {formData.preferred_work_mode.includes(mode.id) && (
                              <div className="w-3 h-3 rounded-full bg-[#10a37f] mx-auto"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className={`${themeClasses.text.primary} text-sm font-medium`}>Employment Type Preferences</Label>
                  <div className="grid grid-cols-1 gap-3">
                    {employmentTypes.map((type) => (
                      <div
                        key={type.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          formData.preferred_employment_type.includes(type.id)
                            ? "border-[#10a37f] bg-[#10a37f]/10"
                            : `${themeClasses.border.primary} ${themeClasses.bg.tertiary}/30 ${themeClasses.border.hover} hover:${themeClasses.bg.tertiary}/50`
                        }`}
                        onClick={() => {
                          const newTypes = formData.preferred_employment_type.includes(type.id)
                            ? formData.preferred_employment_type.filter(t => t !== type.id)
                            : [...formData.preferred_employment_type, type.id]
                          setFormData(prev => ({ 
                            ...prev, 
                            preferred_employment_type: newTypes 
                          }))
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className={`${themeClasses.text.primary} font-medium text-sm`}>{type.label}</p>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ml-3 shrink-0 ${
                            formData.preferred_employment_type.includes(type.id)
                              ? "border-[#10a37f] bg-white"
                              : `${isDark ? 'border-gray-400' : 'border-gray-300'} bg-transparent`
                          }`}>
                            {formData.preferred_employment_type.includes(type.id) && (
                              <div className="w-3 h-3 rounded-full bg-[#10a37f] mx-auto"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className={`${themeClasses.text.primary} text-sm font-medium`}>Preferred Location</Label>
                  <Input
                    value={formData.preferred_location}
                    onChange={(e) => setFormData(prev => ({ ...prev, preferred_location: e.target.value }))}
                    className={`pl-4 pr-4 py-3 ${themeClasses.bg.input} backdrop-blur-sm ${themeClasses.text.primary} ${themeClasses.placeholder} focus:ring-[#10a37f] rounded-xl transition-all duration-300 ${themeClasses.border.hover} focus:${themeClasses.bg.input}`}
                    placeholder="e.g. San Francisco, CA"
                  />
                </div>
              </div>

              {/* Salary & Availability Column */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className={`${themeClasses.text.primary} text-sm font-medium`}>Current Salary</Label>
                  <Input
                    value={formData.current_salary}
                    onChange={(e) => setFormData(prev => ({ ...prev, current_salary: e.target.value }))}
                    className={`pl-4 pr-4 py-3 ${themeClasses.bg.input} backdrop-blur-sm ${themeClasses.text.primary} ${themeClasses.placeholder} focus:ring-[#10a37f] rounded-xl transition-all duration-300 ${themeClasses.border.hover} focus:${themeClasses.bg.input}`}
                    placeholder="e.g. $75,000"
                  />
                </div>

                <div className="space-y-3">
                  <Label className={`${themeClasses.text.primary} text-sm font-medium`}>Expected Salary</Label>
                  <Input
                    value={formData.expected_salary}
                    onChange={(e) => setFormData(prev => ({ ...prev, expected_salary: e.target.value }))}
                    className={`pl-4 pr-4 py-3 ${themeClasses.bg.input} backdrop-blur-sm ${themeClasses.text.primary} ${themeClasses.placeholder} focus:ring-[#10a37f] rounded-xl transition-all duration-300 ${themeClasses.border.hover} focus:${themeClasses.bg.input}`}
                    placeholder="e.g. $80k - $120k"
                  />
                </div>

                <div className="space-y-3">
                  <Label className={`${themeClasses.text.primary} text-sm font-medium`}>Notice Period</Label>
                  <Input
                    value={formData.notice_period}
                    onChange={(e) => setFormData(prev => ({ ...prev, notice_period: e.target.value }))}
                    className={`pl-4 pr-4 py-3 ${themeClasses.bg.input} backdrop-blur-sm ${themeClasses.text.primary} ${themeClasses.placeholder} focus:ring-[#10a37f] rounded-xl transition-all duration-300 ${themeClasses.border.hover} focus:${themeClasses.bg.input}`}
                    placeholder="e.g. 2 weeks, 1 month"
                  />
                </div>

                <div className="space-y-3">
                  <Label className={`${themeClasses.text.primary} text-sm font-medium`}>Availability</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {availabilityOptions.map((option) => (
                      <div
                        key={option}
                        className={`p-3 rounded-lg border cursor-pointer transition-all text-center ${
                          formData.availability === option
                            ? "border-[#10a37f] bg-[#10a37f]/10"
                            : `${themeClasses.border.primary} ${themeClasses.bg.tertiary}/30 ${themeClasses.border.hover} hover:${themeClasses.bg.tertiary}/50`
                        }`}
                        onClick={() => {
                          const newValue = formData.availability === option ? "" : option
                          setFormData(prev => ({ 
                            ...prev, 
                            availability: newValue 
                          }))
                        }}
                      >
                        <p className={`${themeClasses.text.primary} font-medium text-sm`}>{option}</p>
                      </div>
                    ))}
                  </div>
                </div>
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
        className={`max-w-6xl relative overflow-hidden ${themeClasses.text.primary} h-[90vh] p-0 flex flex-col border-0 [&>button]:hidden`}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 50
        }}
      >
        {/* Background gradients */}
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-[#1a1a1a] via-[#212121] to-[#1a1a1a]' : 'bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100'}`}></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#10a37f]/10 via-transparent to-[#10a37f]/5"></div>
        
        {/* Decorative floating elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#10a37f]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#10a37f]/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Content wrapper */}
        <div className="relative z-10 w-full h-full flex flex-col">
          {/* Fixed Header with Stepper */}
        <div className={`shrink-0 p-6 border-b ${themeClasses.border.primary}`}>
          <DialogHeader className="mb-6">
            <div className="flex items-center justify-between">
              <DialogTitle className={`${themeClasses.text.primary} text-xl font-semibold`}>
                Edit Profile
              </DialogTitle>
              <button
                onClick={onClose}
                className={`${themeClasses.text.tertiary} hover:${themeClasses.text.primary} transition-colors p-2 rounded-lg hover:bg-gray-100/10`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </DialogHeader>

          {/* Compact Stepper for 6 steps */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center space-y-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all text-xs ${
                      currentStep === step.id
                        ? "bg-[#10a37f] text-white shadow-lg shadow-[#10a37f]/25"
                        : currentStep > step.id
                          ? "bg-[#10a37f]/20 text-[#10a37f] border-2 border-[#10a37f]"
                          : `${themeClasses.bg.tertiary} ${themeClasses.text.tertiary} border-2 ${themeClasses.border.primary}`
                    }`}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="text-center">
                    <p className={`font-medium text-xs ${
                      currentStep >= step.id ? themeClasses.text.primary : themeClasses.text.tertiary
                    }`}>
                      {step.title}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 transition-all ${
                      currentStep > step.id ? "bg-[#10a37f]" : themeClasses.border.primary.replace('border-', 'bg-')
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderStepContent()}
        </div>

        {/* Fixed Footer with Navigation */}
        <div className={`shrink-0 p-6 border-t ${themeClasses.border.primary} ${themeClasses.bg.secondary}`}>
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePreviousStep}
              disabled={currentStep === 1}
              className={`bg-transparent ${themeClasses.border.primary} ${themeClasses.text.secondary} hover:${themeClasses.bg.tertiary} hover:${themeClasses.text.primary} hover:border-[#10a37f]/50 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2 rounded-lg transition-colors`}
            >
              Previous
            </Button>

            <div className="flex space-x-3">
              {currentStep === steps.length ? (
                <Button
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className="bg-[#10a37f] hover:bg-[#0d8f6f] text-white px-8 py-2 rounded-lg transition-colors disabled:opacity-50"
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
                  className="bg-[#10a37f] hover:bg-[#0d8f6f] text-white px-8 py-2 rounded-lg transition-colors"
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
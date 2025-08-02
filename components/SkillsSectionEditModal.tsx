"use client"

import { useState, useEffect } from "react"
import { X, Plus, Edit, Trash2, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "@/context/ThemeContext"
import { updateProfileSection, reorderSkills } from "@/services/user"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { Skill } from "@/types"
import ConfirmationModal from "@/components/ConfirmationModal"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SkillsSectionEditModalProps {
  isOpen: boolean
  onClose: () => void
  currentSkills: Skill[]
  onUpdate: (newSkills: Skill[]) => void
}

// Sortable skill item component
function SortableSkillItem({ 
  skill, 
  index, 
  isDark, 
  isEditing, 
  onEdit, 
  onDelete, 
  onSave, 
  onCancel, 
  onUpdateSkill, 
  isSubmitting 
}: {
  skill: Skill & { id?: string }
  index: number
  isDark: boolean
  isEditing: boolean
  onEdit: () => void
  onDelete: () => void
  onSave: () => void
  onCancel: () => void
  onUpdateSkill: (index: number, field: keyof Skill, value: string | number) => void
  isSubmitting: boolean
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: skill.id || `skill-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getLevelColor = (level: string) => {
    switch(level) {
      case "Expert": return "bg-green-500"
      case "Advanced": return "bg-blue-500"
      case "Intermediate": return "bg-gray-500"
      default: return "bg-gray-400"
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-4 rounded-lg border ${isDark ? 'bg-[#1a1a1a] border-[#10a37f]/20' : 'bg-gray-50 border-gray-200'} ${isDragging ? 'opacity-50' : ''}`}
    >
      {isEditing ? (
        // Edit mode
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              value={skill.name}
              onChange={(e) => onUpdateSkill(index, 'name', e.target.value)}
              className={`${isDark ? 'bg-[#1a1a1a] border-[#10a37f]/30 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
            />
            <Select
              value={skill.level}
              onValueChange={(value: "Beginner" | "Intermediate" | "Advanced" | "Expert") => 
                onUpdateSkill(index, 'level', value)
              }
            >
              <SelectTrigger className={`${isDark ? 'bg-[#1a1a1a] border-[#10a37f]/30 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={isDark ? 'bg-[#1a1a1a] border-[#10a37f]/30' : 'bg-white border-gray-200'}>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
                <SelectItem value="Expert">Expert</SelectItem>
              </SelectContent>
            </Select>
            <div className="space-y-1">
              <Input
                type="number"
                min="0"
                max="50"
                value={skill.years}
                onChange={(e) => onUpdateSkill(index, 'years', parseInt(e.target.value) || 0)}
                className={`${isDark ? 'bg-[#1a1a1a] border-[#10a37f]/30 text-white' : 'bg-white border-gray-200 text-gray-900'} ${skill.years > 50 ? 'border-red-500' : ''}`}
              />
              <div className="h-4">
                {skill.years > 50 && (
                  <p className="text-red-500 text-xs">Maximum 50 years allowed</p>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={onSave}
              disabled={isSubmitting || !skill.name.trim() || skill.years > 50}
              className="bg-[#10a37f] hover:bg-[#0d8f6f] text-white px-3 py-1 rounded text-sm disabled:opacity-50"
            >
              Save
            </Button>
            <Button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              variant="outline"
              className={`${isDark ? 'border-[#10a37f]/30 text-gray-300 hover:bg-[#10a37f]/10' : 'border-gray-300 text-gray-700 hover:bg-gray-100'} px-3 py-1 rounded text-sm disabled:opacity-50`}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        // View mode
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100/10 rounded"
            >
              <GripVertical className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {skill.name}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs text-white ${getLevelColor(skill.level)}`}>
                  {skill.level}
                </span>
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {skill.years} years experience
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={onDelete}
              size="sm"
              variant="ghost"
              className="text-red-500 hover:text-red-600 hover:bg-red-500/10 p-2"
              title="Delete skill"
              disabled={isSubmitting}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              onClick={onEdit}
              size="sm"
              variant="ghost"
              className="text-[#10a37f] hover:text-[#0d8f6f] hover:bg-[#10a37f]/10 p-2"
              disabled={isSubmitting}
            >
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function SkillsSectionEditModal({
  isOpen,
  onClose,
  currentSkills,
  onUpdate
}: SkillsSectionEditModalProps) {
  const [skills, setSkills] = useState<Skill[]>(currentSkills)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{
    isOpen: boolean
    skillIndex: number | null
    skillName: string
  }>({
    isOpen: false,
    skillIndex: null,
    skillName: ""
  })
  
  // New skill form
  const [newSkill, setNewSkill] = useState({
    name: "",
    level: "Intermediate" as "Beginner" | "Intermediate" | "Advanced" | "Expert",
    years: 0
  })
  
  const { isDark } = useTheme()
  const { user, updateUser } = useAuth()
  const { toast } = useToast()

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
      // Sort skills by proficiency level and experience by default
      const sortedSkills = [...currentSkills].sort((a, b) => {
        const getPriority = (level: string) => {
          switch(level) {
            case 'Expert': return 4;
            case 'Advanced': return 3;
            case 'Intermediate': return 2;
            default: return 1;
          }
        };
        
        const levelDiff = getPriority(b.level) - getPriority(a.level);
        if (levelDiff !== 0) return levelDiff;
        
        return (b.years || 0) - (a.years || 0);
      });

      // Add IDs to skills if they don't have them
      const skillsWithIds = sortedSkills.map((skill, index) => ({
        ...skill,
        id: skill.id || `skill-${index}`
      }));

      setSkills(skillsWithIds)
      setNewSkill({ name: "", level: "Intermediate", years: 0 })
      setEditingIndex(null)
      setDeleteConfirmModal({ isOpen: false, skillIndex: null, skillName: "" })
    }
  }, [isOpen, currentSkills])

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setSkills((items) => {
        const oldIndex = items.findIndex(item => (item.id || `skill-${items.indexOf(item)}`) === active.id);
        const newIndex = items.findIndex(item => (item.id || `skill-${items.indexOf(item)}`) === over?.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Auto-save the new order
        handleReorderSave(newItems);
        
        return newItems;
      });
    }
  };

  const handleReorderSave = async (reorderedSkills: Skill[]) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to update your profile",
        variant: "destructive"
      })
      return
    }

    try {
      // Extract skill IDs in the new order
      const skillIds = reorderedSkills.map(skill => skill.id || `skill-${reorderedSkills.indexOf(skill)}`);
      
      await reorderSkills(skillIds)
      onUpdate(reorderedSkills)
      updateUser({ skills: reorderedSkills })
      toast({
        title: "Success",
        description: "Skills reordered successfully",
      })
    } catch (error: any) {
      console.error("Error reordering skills:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to reorder skills",
        variant: "destructive"
      })
      // Revert on error
      setSkills(currentSkills)
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a skill name",
        variant: "destructive"
      })
      return
    }

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to update your profile",
        variant: "destructive"
      })
      return
    }

    const skill: Skill & { id?: string } = {
      name: newSkill.name.trim(),
      level: newSkill.level,
      years: newSkill.years,
      id: `skill-${Date.now()}` // Generate unique ID
    }

    const updatedSkills = [...skills, skill]
    setSkills(updatedSkills)
    setNewSkill({ name: "", level: "Intermediate", years: 0 })

    setIsSubmitting(true)
    try {
      await updateProfileSection("skills", { skills: updatedSkills })
      onUpdate(updatedSkills)
      updateUser({ skills: updatedSkills })
      toast({
        title: "Success",
        description: "Skill added successfully",
      })
      onClose() // Auto close modal after successful addition
    } catch (error: any) {
      console.error("Error adding skill:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to add skill",
        variant: "destructive"
      })
      // Revert on error
      setSkills(skills)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateSkill = async (index: number, field: keyof Skill, value: string | number) => {
    const updatedSkills = [...skills]
    updatedSkills[index] = { ...updatedSkills[index], [field]: value }
    setSkills(updatedSkills)
  }

  const handleSaveSkill = async (index: number) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to update your profile",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    try {
      await updateProfileSection("skills", { skills })
      onUpdate(skills)
      updateUser({ skills })
      setEditingIndex(null)
      toast({
        title: "Success",
        description: "Skill updated successfully",
      })
      onClose() // Auto close modal after successful update
    } catch (error: any) {
      console.error("Error updating skill:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update skill",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteSkill = (index: number) => {
    const skill = skills[index]
    setDeleteConfirmModal({
      isOpen: true,
      skillIndex: index,
      skillName: skill.name
    })
  }

  const confirmDeleteSkill = async () => {
    if (deleteConfirmModal.skillIndex === null) return

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to update your profile",
        variant: "destructive"
      })
      return
    }

    const updatedSkills = skills.filter((_, i) => i !== deleteConfirmModal.skillIndex)
    setSkills(updatedSkills)
    if (editingIndex === deleteConfirmModal.skillIndex) {
      setEditingIndex(null)
    }

    setIsSubmitting(true)
    try {
      await updateProfileSection("skills", { skills: updatedSkills })
      onUpdate(updatedSkills)
      updateUser({ skills: updatedSkills })
      toast({
        title: "Success",
        description: "Skill deleted successfully",
      })
      onClose() // Auto close modal after successful deletion
    } catch (error: any) {
      console.error("Error deleting skill:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete skill",
        variant: "destructive"
      })
      // Revert on error
      setSkills(skills)
    } finally {
      setIsSubmitting(false)
    }
  }

  const startEditing = (index: number) => {
    setEditingIndex(index)
  }

  const stopEditing = () => {
    setEditingIndex(null)
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div 
          className={`relative w-full max-w-lg md:max-w-2xl h-[90vh] flex flex-col border-0 rounded-2xl shadow-2xl`}
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
            {/* Header */}
            <div className={`shrink-0 p-6 border-b ${isDark ? 'border-[#10a37f]/20' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Edit Skills Section
                  </h2>
                  <span className={`text-sm px-2 py-1 rounded-full ${isDark ? 'bg-[#10a37f]/20 text-[#10a37f]' : 'bg-[#10a37f]/10 text-[#10a37f]'}`}>
                    {skills.length} skills
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'} transition-colors p-2 rounded-lg hover:bg-gray-100/10`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Sticky Add New Skill Section */}
              <div className={`shrink-0 p-6 border-b ${isDark ? 'border-[#10a37f]/20' : 'border-gray-200'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Add New Skill
                </h3>
                
                <div className="flex gap-3 items-start">
                  <div className="flex-1 space-y-2">
                    <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Skill Name
                    </label>
                    <Input
                      value={newSkill.name}
                      onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                      placeholder="e.g., React.js, Python, AWS"
                      className={`${isDark ? 'bg-[#1a1a1a] border-[#10a37f]/30 text-white placeholder:text-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-500'}`}
                    />
                    <div className="h-4"></div>
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Proficiency Level
                    </label>
                    <Select
                      value={newSkill.level}
                      onValueChange={(value: "Beginner" | "Intermediate" | "Advanced" | "Expert") => 
                        setNewSkill({ ...newSkill, level: value })
                      }
                    >
                      <SelectTrigger className={`${isDark ? 'bg-[#1a1a1a] border-[#10a37f]/30 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className={isDark ? 'bg-[#1a1a1a] border-[#10a37f]/30' : 'bg-white border-gray-200'}>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                        <SelectItem value="Expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="h-4"></div>
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Years of Experience
                    </label>
                    <div className="space-y-1">
                      <Input
                        type="number"
                        min="0"
                        max="50"
                        value={newSkill.years}
                        onChange={(e) => setNewSkill({ ...newSkill, years: parseInt(e.target.value) || 0 })}
                        className={`${isDark ? 'bg-[#1a1a1a] border-[#10a37f]/30 text-white' : 'bg-white border-gray-200 text-gray-900'} ${newSkill.years > 50 ? 'border-red-500' : ''}`}
                      />
                      <div className="h-4">
                        {newSkill.years > 50 && (
                          <p className="text-red-500 text-xs">Maximum 50 years allowed</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <div className="h-6"></div>
                    <Button
                      type="button"
                      onClick={handleAddSkill}
                      disabled={isSubmitting || !newSkill.name.trim() || newSkill.years > 50}
                      className="bg-[#10a37f] hover:bg-[#0d8f6f] text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-10"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Skill
                    </Button>
                    <div className="h-4"></div>
                  </div>
                </div>
              </div>

              {/* Scrollable Current Skills Section */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Current Skills (Drag to reorder)
                  </h3>
                  
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={skills.map(skill => skill.id || `skill-${skills.indexOf(skill)}`)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-3">
                        {skills.map((skill, index) => (
                          <SortableSkillItem
                            key={skill.id || `skill-${index}`}
                            skill={skill}
                            index={index}
                            isDark={isDark}
                            isEditing={editingIndex === index}
                            onEdit={() => startEditing(index)}
                            onDelete={() => handleDeleteSkill(index)}
                            onSave={() => handleSaveSkill(index)}
                            onCancel={stopEditing}
                            onUpdateSkill={handleUpdateSkill}
                            isSubmitting={isSubmitting}
                          />
                        ))}
                        
                        {skills.length === 0 && (
                          <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            No skills added yet. Add your first skill above.
                          </div>
                        )}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirmModal.isOpen}
        onClose={() => setDeleteConfirmModal({ isOpen: false, skillIndex: null, skillName: "" })}
        onConfirm={confirmDeleteSkill}
        title="Delete Skill"
        message={`Are you sure you want to delete "${deleteConfirmModal.skillName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </>
  )
} 
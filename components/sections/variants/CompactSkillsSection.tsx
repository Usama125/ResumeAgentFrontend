"use client"

import { useState } from "react"
import { 
  Code, 
  Edit, 
  Trash2, 
  Sparkles, 
  Target,
  Zap,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { User as UserType } from "@/types"
import { useTheme } from "@/context/ThemeContext"
import { getThemeClasses } from "@/utils/theme"

interface CompactSkillsSectionProps {
  user: UserType
  isEditMode?: boolean
  onEdit?: () => void
  onDelete?: () => void
}

export default function CompactSkillsSection({
  user,
  isEditMode = false,
  onEdit,
  onDelete
}: CompactSkillsSectionProps) {
  const { isDark } = useTheme()
  const theme = getThemeClasses(isDark)
  const [showAllSkills, setShowAllSkills] = useState(false)

  // Check if section has data
  const hasData = !!(user.skills && user.skills.length > 0)

  // Don't render if no data and not in edit mode
  if (!hasData && !isEditMode) {
    return null
  }

  // Sort skills by level priority
  const sortedSkills = hasData ? user.skills.slice().sort((a, b) => {
    const getPriority = (level: string) => {
      switch(level) {
        case 'Expert': return 1;
        case 'Advanced': return 2;
        case 'Intermediate': return 3;
        default: return 4;
      }
    };
    return getPriority(a.level) - getPriority(b.level);
  }) : []

  // Determine which skills to show
  const skillsToShow = showAllSkills ? sortedSkills : sortedSkills.slice(0, 10)
  const hasMoreSkills = sortedSkills.length > 10

  // Get skill chip styling based on level - matching project technology chips
  const getSkillChipStyle = (level: string) => {
    switch(level) {
      case 'Expert':
        return 'bg-[#10a37f]/20 text-[#10a37f] border-[#10a37f]/30 hover:bg-[#10a37f]/30'
      case 'Advanced':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/30 hover:bg-blue-500/30'
      case 'Intermediate':
        return 'bg-gray-500/20 text-gray-500 border-gray-500/30 hover:bg-gray-500/30'
      default: // Beginner
        return 'bg-gray-400/20 text-gray-400 border-gray-400/30 hover:bg-gray-400/30'
    }
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
              <Code className="w-4 h-4 text-[#10a37f]" />
            </div>
            <h3 className={`text-sm font-semibold ${theme.text.primary}`}>Skills & Expertise</h3>
          </div>
          
          {isEditMode && (
            <div className="flex items-center gap-1">
              {onEdit && (
                <button
                  onClick={onEdit}
                  className={`p-1.5 rounded-lg transition-all duration-200 ${
                    isDark 
                      ? 'hover:bg-[#10a37f]/20 text-[#10a37f]' 
                      : 'hover:bg-[#10a37f]/10 text-[#10a37f]'
                  }`}
                  title="Edit Skills"
                >
                  <Edit className="w-3 h-3" />
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
                  title="Delete All Skills"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        {hasData ? (
          <div className="space-y-4">
            {/* Skills Chips */}
            <div className="flex flex-wrap gap-2">
              {skillsToShow.map((skill, index) => (
                <span 
                  key={index} 
                  className={`inline-flex items-center px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full border transition-all duration-200 cursor-default whitespace-nowrap ${getSkillChipStyle(skill.level)}`}
                  title={`${skill.name} - ${skill.level}`}
                >
                  {skill.name}
                </span>
              ))}
            </div>
            
            {/* See More/Less Button */}
            {hasMoreSkills && (
              <div className="flex justify-center pt-2">
                <button
                  onClick={() => setShowAllSkills(!showAllSkills)}
                  className={`group flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isDark 
                      ? 'bg-[#1a1a1a]/50 hover:bg-[#10a37f]/20 border border-[#10a37f]/20 hover:border-[#10a37f]/40' 
                      : 'bg-white/50 hover:bg-[#10a37f]/10 border border-[#10a37f]/15 hover:border-[#10a37f]/30'
                  } backdrop-blur-sm hover:scale-105 hover:shadow-md`}
                >
                  <span className="text-[#10a37f] font-medium text-sm">
                    {showAllSkills ? 'Show Less' : `Show ${sortedSkills.length - 10} More`}
                  </span>
                  {showAllSkills ? (
                    <ChevronUp className="w-4 h-4 text-[#10a37f] group-hover:animate-bounce" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#10a37f] group-hover:animate-bounce" />
                  )}
                </button>
              </div>
            )}
            
            {/* Skills Summary */}
            <div className={`flex items-center justify-between pt-3 border-t ${
              isDark ? 'border-[#10a37f]/20' : 'border-[#10a37f]/15'
            }`}>
              <div className="flex items-center gap-2">
                <Zap className="w-3 h-3 text-[#10a37f]" />
                <span className={`text-xs ${theme.text.secondary}`}>
                  {sortedSkills.length} skill{sortedSkills.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              {/* Level distribution */}
              <div className="flex items-center gap-3 text-xs">
                {['Expert', 'Advanced', 'Intermediate', 'Beginner'].map(level => {
                  const count = sortedSkills.filter(s => s.level === level).length
                  if (count === 0) return null
                  
                  return (
                    <div key={level} className="flex items-center gap-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        level === "Expert" 
                          ? "bg-[#10a37f]" 
                          : level === "Advanced"
                          ? "bg-blue-500"
                          : level === "Intermediate"
                          ? "bg-gray-500"
                          : "bg-gray-400"
                      }`}></div>
                      <span className={theme.text.tertiary}>{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="relative mb-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-[#10a37f]/20 to-[#0d8f6f]/20 flex items-center justify-center backdrop-blur-sm">
                <Code className="w-6 h-6 text-[#10a37f]" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#10a37f] rounded-full flex items-center justify-center">
                <Sparkles className="w-2.5 h-2.5 text-white animate-pulse" />
              </div>
            </div>
            
            <h4 className={`text-sm font-semibold ${theme.text.primary} mb-2`}>
              Showcase Your Skills
            </h4>
            <p className={`${theme.text.secondary} text-xs mb-4 max-w-xs mx-auto`}>
              Add your technical skills to highlight your expertise and proficiency levels.
            </p>
            
            {isEditMode && onEdit && (
              <button
                onClick={onEdit}
                className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#10a37f] text-white text-xs font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm"
              >
                <Target className="w-3 h-3 group-hover:animate-pulse" />
                Add Skills
                <Sparkles className="w-3 h-3 group-hover:animate-bounce" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

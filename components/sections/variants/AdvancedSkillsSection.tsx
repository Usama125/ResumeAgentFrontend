"use client"

import { useState } from "react"
import { 
  Code, 
  Edit, 
  Trash2, 
  Sparkles, 
  Target,
  Zap,
  Star,
  Award,
  Trophy,
  Crown,
  Shield,
  Rocket,
  TrendingUp,
  CheckCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { User as UserType } from "@/types"
import { useTheme } from "@/context/ThemeContext"
import { getThemeClasses } from "@/utils/theme"

interface AdvancedSkillsSectionProps {
  user: UserType
  isEditMode?: boolean
  onEdit?: () => void
  onDelete?: () => void
}

export default function AdvancedSkillsSection({
  user,
  isEditMode = false,
  onEdit,
  onDelete
}: AdvancedSkillsSectionProps) {
  const { isDark } = useTheme()
  const theme = getThemeClasses(isDark)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

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

  // Group skills by level
  const skillsByLevel = sortedSkills.reduce((acc, skill) => {
    if (!acc[skill.level]) {
      acc[skill.level] = []
    }
    acc[skill.level].push(skill)
    return acc
  }, {} as Record<string, typeof sortedSkills>)

  const toggleCategory = (level: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(level)) {
        newSet.delete(level)
      } else {
        newSet.add(level)
      }
      return newSet
    })
  }

  // Get level styling and icon
  const getLevelConfig = (level: string) => {
    switch(level) {
      case 'Expert':
        return {
          icon: Crown,
          color: '#10a37f',
          bgGradient: 'from-[#10a37f]/20 to-[#0d8f6f]/20',
          borderColor: 'border-[#10a37f]/30',
          textColor: 'text-[#10a37f]',
          progressColor: 'bg-[#10a37f]',
          progressWidth: 'w-11/12'
        }
      case 'Advanced':
        return {
          icon: Trophy,
          color: '#3b82f6',
          bgGradient: 'from-blue-500/20 to-blue-600/20',
          borderColor: 'border-blue-500/30',
          textColor: 'text-blue-500',
          progressColor: 'bg-blue-500',
          progressWidth: 'w-4/5'
        }
      case 'Intermediate':
        return {
          icon: Shield,
          color: '#6b7280',
          bgGradient: 'from-gray-500/20 to-gray-600/20',
          borderColor: 'border-gray-500/30',
          textColor: 'text-gray-500',
          progressColor: 'bg-gray-500',
          progressWidth: 'w-3/5'
        }
      default: // Beginner
        return {
          icon: Target,
          color: '#9ca3af',
          bgGradient: 'from-gray-400/20 to-gray-500/20',
          borderColor: 'border-gray-400/30',
          textColor: 'text-gray-400',
          progressColor: 'bg-gray-400',
          progressWidth: 'w-1/4'
        }
    }
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

      <div className="relative z-10 p-4 sm:p-8">
        {/* Edit/Delete buttons - Floating on mobile, inline on desktop */}
        {isEditMode && (
          <div className="absolute top-2 right-2 sm:hidden flex items-center gap-1">
            {onEdit && (
              <button
                onClick={onEdit}
                className={`group/btn p-1.5 rounded-lg transition-all duration-300 ${
                  isDark 
                    ? 'bg-[#1a1a1a]/80 hover:bg-[#10a37f]/20 border border-[#10a37f]/20 hover:border-[#10a37f]/40' 
                    : 'bg-white/80 hover:bg-[#10a37f]/10 border border-[#10a37f]/15 hover:border-[#10a37f]/30'
                } backdrop-blur-sm hover:scale-105 hover:shadow-lg`}
                title="Edit Skills"
              >
                <Edit className="w-3 h-3 text-[#10a37f] group-hover/btn:animate-pulse" />
              </button>
            )}
            {hasData && onDelete && (
              <button
                onClick={onDelete}
                className={`group/btn p-1.5 rounded-lg transition-all duration-300 ${
                  isDark 
                    ? 'bg-[#1a1a1a]/80 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40' 
                    : 'bg-white/80 hover:bg-red-500/10 border border-red-300/20 hover:border-red-400/30'
                } backdrop-blur-sm hover:scale-105 hover:shadow-lg`}
                title="Delete All Skills"
              >
                <Trash2 className="w-3 h-3 text-red-400 group-hover/btn:animate-pulse" />
              </button>
            )}
          </div>
        )}
        
        {/* Desktop Edit/Delete buttons - Inline with header */}
        {isEditMode && (
          <div className="hidden sm:flex items-center gap-2 flex-shrink-0 mb-4">
            {onEdit && (
              <button
                onClick={onEdit}
                className={`group/btn p-2 rounded-xl transition-all duration-300 ${
                  isDark 
                    ? 'bg-[#1a1a1a]/80 hover:bg-[#10a37f]/20 border border-[#10a37f]/20 hover:border-[#10a37f]/40' 
                    : 'bg-white/80 hover:bg-[#10a37f]/10 border border-[#10a37f]/15 hover:border-[#10a37f]/30'
                } backdrop-blur-sm hover:scale-105 hover:shadow-lg`}
                title="Edit Skills"
              >
                <Edit className="w-4 h-4 text-[#10a37f] group-hover/btn:animate-pulse" />
              </button>
            )}
            {hasData && onDelete && (
              <button
                onClick={onDelete}
                className={`group/btn p-2 rounded-xl transition-all duration-300 ${
                  isDark 
                    ? 'bg-[#1a1a1a]/80 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40' 
                    : 'bg-white/80 hover:bg-red-500/10 border border-red-300/20 hover:border-red-400/30'
                } backdrop-blur-sm hover:scale-105 hover:shadow-lg`}
                title="Delete All Skills"
              >
                <Trash2 className="w-4 h-4 text-red-400 group-hover/btn:animate-pulse" />
              </button>
            )}
          </div>
        )}

        {/* Enhanced Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-xl opacity-20 animate-pulse"></div>
              <div className="relative p-2 sm:p-3 rounded-xl bg-gradient-to-br from-[#10a37f]/20 to-[#0d8f6f]/20 backdrop-blur-sm">
                <Code className="w-4 h-4 sm:w-6 sm:h-6 text-[#10a37f]" />
              </div>
            </div>
            <div>
              <h3 className={`text-lg sm:text-2xl font-bold bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] bg-clip-text text-transparent`}>
                Skills & Expertise
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Trophy className="w-3 h-3 text-[#10a37f]/60" />
                <span className={`text-xs ${theme.text.tertiary}`}>Technical Proficiency</span>
                {hasData && (
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#10a37f]/10 border border-[#10a37f]/20">
                    <Star className="w-2.5 h-2.5 text-[#10a37f]" />
                    <span className="text-[#10a37f] text-xs font-medium">{sortedSkills.length} Skill{sortedSkills.length !== 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Content */}
        {hasData ? (
          <div className="space-y-4 sm:space-y-6">
            {/* Skills by Level Categories */}
            {Object.entries(skillsByLevel).map(([level, skills]) => {
              const config = getLevelConfig(level)
              const IconComponent = config.icon
              const isExpanded = expandedCategories.has(level)
              
              return (
                <div 
                  key={level} 
                  className={`group/category relative overflow-hidden rounded-2xl border-2 ${
                    isDark 
                      ? 'bg-gradient-to-br from-[#1a1a1a]/80 via-[#2a2a2a]/60 to-[#1a1a1a]/80 border-[#10a37f]/20 hover:border-[#10a37f]/40' 
                      : 'bg-gradient-to-br from-white/80 via-gray-50/60 to-white/80 border-[#10a37f]/15 hover:border-[#10a37f]/30'
                  } backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-[#10a37f]/10`}
                >
                  {/* Category Background Effects */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#10a37f]/5 to-transparent rounded-full blur-xl"></div>
                  </div>
                  
                  <div className="relative z-10 p-4 sm:p-6">
                    {/* Category Header */}
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className={`p-1.5 sm:p-2 rounded-lg bg-gradient-to-br ${config.bgGradient} backdrop-blur-sm`}>
                          <IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 ${config.textColor}`} />
                        </div>
                        <div>
                          <h4 className={`text-base sm:text-lg font-bold ${theme.text.primary}`}>
                            {level} Level
                          </h4>
                          <p className={`text-xs sm:text-sm ${theme.text.secondary}`}>
                            {skills.length} skill{skills.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => toggleCategory(level)}
                        className={`group/toggle flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl transition-all duration-300 ${
                          isDark 
                            ? 'bg-[#1a1a1a]/50 hover:bg-[#10a37f]/20 border border-[#10a37f]/20 hover:border-[#10a37f]/40' 
                            : 'bg-white/50 hover:bg-[#10a37f]/10 border border-[#10a37f]/15 hover:border-[#10a37f]/30'
                        } backdrop-blur-sm hover:scale-105 hover:shadow-md`}
                      >
                        <span className={`font-medium text-xs sm:text-sm ${config.textColor}`}>
                          {isExpanded ? 'Collapse' : 'Expand'}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className={`w-3 h-3 sm:w-4 sm:h-4 ${config.textColor} group-hover/toggle:animate-bounce`} />
                        ) : (
                          <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 ${config.textColor} group-hover/toggle:animate-bounce`} />
                        )}
                      </button>
                    </div>
                    
                    {/* Skills Grid */}
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 transition-all duration-500 ${
                      isExpanded ? 'max-h-none opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                    }`}>
                      {skills.map((skill, index) => (
                        <div 
                          key={index} 
                          className={`group/skill relative p-3 sm:p-4 rounded-xl border transition-all duration-300 ${
                            isDark 
                              ? 'bg-[#1a1a1a]/40 border-[#10a37f]/20 hover:border-[#10a37f]/40' 
                              : 'bg-white/50 border-[#10a37f]/15 hover:border-[#10a37f]/30'
                          } backdrop-blur-sm hover:shadow-md hover:scale-105`}
                        >
                          {/* Skill Background Effects */}
                          <div className="absolute inset-0 overflow-hidden rounded-xl">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#10a37f]/5 to-transparent rounded-full blur-lg"></div>
                          </div>
                          
                          <div className="relative z-10 space-y-2 sm:space-y-3">
                            {/* Skill Header */}
                            <div className="flex items-center justify-between">
                              <span className={`${theme.text.primary} font-semibold text-xs sm:text-sm group-hover/skill:text-[#10a37f] transition-colors truncate`}>
                                {skill.name}
                              </span>
                              <div className={`flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full ${config.bgGradient} border ${config.borderColor} backdrop-blur-sm`}>
                                <CheckCircle className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${config.textColor}`} />
                                <span className={`text-xs font-medium ${config.textColor}`}>
                                  {skill.level}
                                </span>
                              </div>
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="space-y-1.5 sm:space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className={theme.text.tertiary}>Proficiency</span>
                                <span className={config.textColor}>Expertise Level</span>
                              </div>
                              <div className={`w-full ${isDark ? 'bg-[#1a1a1a]' : 'bg-gray-200'} rounded-full h-1.5 sm:h-2`}>
                                <div 
                                  className={`h-1.5 sm:h-2 rounded-full transition-all duration-700 ${config.progressColor} ${config.progressWidth} shadow-lg`}
                                ></div>
                              </div>
                            </div>
                            
                            {/* Years of Experience */}
                            {skill.years && skill.years > 0 && (
                              <div className="flex items-center gap-1.5 sm:gap-2 text-xs">
                                <TrendingUp className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${config.textColor}`} />
                                <span className={theme.text.secondary}>
                                  {skill.years} year{skill.years !== 1 ? 's' : ''} of experience
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
            
            {/* Skills Summary */}
            <div className={`flex items-center justify-between p-3 sm:p-4 rounded-xl ${
              isDark 
                ? 'bg-gradient-to-br from-[#1a1a1a]/40 to-[#2a2a2a]/40 border border-[#10a37f]/20' 
                : 'bg-gradient-to-br from-white/50 to-gray-50/50 border border-[#10a37f]/15'
            } backdrop-blur-sm`}>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-[#10a37f]/20 to-[#0d8f6f]/20 backdrop-blur-sm">
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-[#10a37f]" />
                </div>
                <div>
                  <p className={`font-semibold text-sm sm:text-base ${theme.text.primary}`}>
                    Total Skills: {sortedSkills.length}
                  </p>
                  <p className={`text-xs sm:text-sm ${theme.text.secondary}`}>
                    Comprehensive technical expertise
                  </p>
                </div>
              </div>
              
              {/* Level Distribution */}
              <div className="flex items-center gap-2 sm:gap-4">
                {Object.entries(skillsByLevel).map(([level, skills]) => {
                  const config = getLevelConfig(level)
                  return (
                    <div key={level} className="flex items-center gap-1 sm:gap-2">
                      <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${config.progressColor}`}></div>
                      <span className={`text-xs font-medium ${config.textColor}`}>
                        {skills.length}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <div className="relative mb-4 sm:mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gradient-to-br from-[#10a37f]/20 to-[#0d8f6f]/20 flex items-center justify-center backdrop-blur-sm">
                <Code className="w-8 h-8 sm:w-10 sm:h-10 text-[#10a37f]" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 bg-[#10a37f] rounded-full flex items-center justify-center">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white animate-pulse" />
              </div>
            </div>
            
            <h4 className={`text-lg sm:text-xl font-semibold ${theme.text.primary} mb-2 sm:mb-3`}>
              Master Your Technical Skills
            </h4>
            <p className={`${theme.text.secondary} text-xs sm:text-sm mb-4 sm:mb-6 max-w-md mx-auto`}>
              Add your technical skills to showcase your expertise levels and demonstrate your professional capabilities.
            </p>
            
            {isEditMode && onEdit && (
              <button
                onClick={onEdit}
                className="group inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#10a37f] text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl backdrop-blur-sm text-sm sm:text-base"
              >
                <Rocket className="w-3 h-3 sm:w-4 sm:h-4 group-hover:animate-spin" />
                Add Skills
                <Award className="w-3 h-3 sm:w-4 sm:h-4 group-hover:animate-pulse" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

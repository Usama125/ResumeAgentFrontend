"use client"

import { Code } from "lucide-react"
import { User as UserType } from "@/types"
import { useTheme } from "@/context/ThemeContext"
import { getThemeClasses } from "@/utils/theme"
import BaseSection from "./BaseSection"

interface SkillsSectionProps {
  user: UserType
  isEditMode?: boolean
  isCollapsible?: boolean
  isExpanded?: boolean
  onEdit?: () => void
  onDelete?: () => void
  onToggleExpand?: () => void
  showDragHandle?: boolean
  dragHandleProps?: any
}

export default function SkillsSection({
  user,
  isEditMode = false,
  isCollapsible = false,
  isExpanded = true,
  onEdit,
  onDelete,
  onToggleExpand,
  showDragHandle = false,
  dragHandleProps = {}
}: SkillsSectionProps) {
  const { isDark } = useTheme()

  // Check if section has data
  const hasData = !!(user.skills && user.skills.length > 0)

  // Don't render if no data and not in edit mode
  if (!hasData && !isEditMode) {
    return null
  }

  return (
    <BaseSection
      id="skills"
      title="Skills & Expertise"
      icon={<Code className="w-5 h-5 text-[#10a37f]" />}
      isEditMode={isEditMode}
      isCollapsible={isCollapsible}
      isExpanded={isExpanded}
      onEdit={onEdit}
      onDelete={onDelete}
      onToggleExpand={onToggleExpand}
      showDragHandle={showDragHandle}
      dragHandleProps={dragHandleProps}
    >
      {hasData ? (
        <>
          <div className="flex items-center justify-between mb-6">
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {user.skills.length} skills
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#10a37f]/30 pr-2">
            {user.skills
              .slice()
              .sort((a, b) => {
                const getPriority = (level: string) => {
                  switch(level) {
                    case 'Expert': return 1;
                    case 'Advanced': return 2;
                    case 'Intermediate': return 3;
                    default: return 4;
                  }
                };
                return getPriority(a.level) - getPriority(b.level);
              })
              .map((skill, index) => (
              <div key={index} className={`${isDark ? 'bg-[#2a2a2a]/50' : 'bg-gray-50/80'} rounded-lg p-3 border ${isDark ? 'border-[#10a37f]/10 hover:border-[#10a37f]/30' : 'border-gray-200 hover:border-[#10a37f]/50'} transition-all duration-300 group`}>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`${getThemeClasses(isDark).text.primary} font-medium text-sm group-hover:text-[#10a37f] transition-colors truncate`}>
                      {skill.name}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2 ${
                      skill.level === "Expert" 
                        ? "bg-green-500 text-white" 
                        : skill.level === "Advanced"
                        ? "bg-blue-500 text-white"
                        : skill.level === "Intermediate"
                        ? "bg-gray-500 text-white"
                        : "bg-gray-400 text-white"
                    }`}>
                      {skill.level}
                    </span>
                  </div>
                  <div className={`w-full ${isDark ? 'bg-[#1a1a1a]' : 'bg-gray-200'} rounded-full h-1.5`}>
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        skill.level === "Expert" 
                          ? "bg-green-500 w-11/12" 
                          : skill.level === "Advanced"
                          ? "bg-blue-500 w-4/5"
                          : skill.level === "Intermediate"
                          ? "bg-gray-500 w-3/5"
                          : "bg-gray-400 w-1/4"
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Skills Legend */}
          <div className={`mt-4 pt-4 border-t ${isDark ? 'border-[#10a37f]/20' : 'border-gray-200'}`}>
            <div className="flex items-center justify-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Expert</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Advanced</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Intermediate</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Beginner</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} italic text-center py-4`}>
          No skills added yet. Add your technical skills to showcase your expertise.
        </p>
      )}
    </BaseSection>
  )
}
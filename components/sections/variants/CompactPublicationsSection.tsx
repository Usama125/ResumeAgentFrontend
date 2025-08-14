"use client"

import { useState } from "react"
import { FileText, Edit, Trash2, Calendar, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { User as UserType } from "@/types"
import { useTheme } from "@/context/ThemeContext"
import { getThemeClasses } from "@/utils/theme"
import BaseSection from "../BaseSection"

interface CompactPublicationsSectionProps {
  user: UserType
  isEditMode?: boolean
  onEdit?: () => void
  onDelete?: () => void
  onEditPublication?: (index: number) => void
  onDeletePublication?: (index: number) => void
  onAddPublication?: () => void
}

export default function CompactPublicationsSection({
  user,
  isEditMode = false,
  onEdit,
  onDelete,
  onEditPublication,
  onDeletePublication,
  onAddPublication
}: CompactPublicationsSectionProps) {
  const { isDark } = useTheme()
  const theme = getThemeClasses(isDark)

  // Check if section has data
  const hasData = !!(user.publications && user.publications.length > 0)

  // Don't render if no data and not in edit mode
  if (!hasData && !isEditMode) {
    return null
  }

  return (
    <BaseSection
      id="publications"
      title="Publications"
      icon={<FileText className="w-5 h-5 text-[#10a37f]" />}
      isEditMode={isEditMode}
      onDelete={hasData ? onDelete : undefined}
      onAdd={isEditMode ? onAddPublication : undefined}
    >
      <div className="space-y-3">
        {hasData ? (
          user.publications.map((pub, index) => (
            <div 
              key={index} 
              className={`relative overflow-hidden rounded-xl border transition-all duration-300 ${
                isDark 
                  ? 'bg-[#2a2a2a]/60 border-[#10a37f]/20 hover:border-[#10a37f]/40' 
                  : 'bg-white/80 border-gray-200 hover:border-[#10a37f]/40'
              } shadow-sm hover:shadow-md`}
            >
              {/* Background Effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#10a37f]/5 via-transparent to-[#10a37f]/10"></div>
              
              {/* Content */}
              <div className="relative z-10 p-4">
                <div className="flex items-start justify-between gap-3">
                  {/* Left side - Publication details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center justify-center w-6 h-6 bg-[#10a37f]/20 rounded-lg flex-shrink-0">
                        <FileText className="w-3 h-3 text-[#10a37f]" />
                      </div>
                      <h3 className={`font-semibold ${theme.text.primary} truncate`}>
                        {pub.title}
                      </h3>
                    </div>
                    
                    {pub.publisher && (
                      <p className="text-[#10a37f] font-medium text-sm mb-1 truncate">
                        {pub.publisher}
                      </p>
                    )}
                    
                    {pub.description && (
                      <p className={`${theme.text.secondary} text-xs leading-relaxed line-clamp-2`}>
                        {pub.description}
                      </p>
                    )}
                    
                    {/* Publication URL and Date */}
                    <div className="flex items-center justify-between mt-2">
                      {pub.url && (
                        <a 
                          href={pub.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-[#10a37f] hover:text-[#0d8f6f] transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Read</span>
                        </a>
                      )}
                      {pub.date && (
                        <div className="flex items-center gap-1 text-xs">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {pub.date}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Right side - Edit/Delete buttons */}
                  {isEditMode && (onEditPublication || onDeletePublication) && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {onEditPublication && (
                        <Button
                          onClick={() => onEditPublication(index)}
                          size="sm"
                          variant="ghost"
                          className="text-[#10a37f] hover:text-[#0d8f6f] hover:bg-[#10a37f]/10 p-1.5 h-8 w-8"
                          title="Edit publication"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                      )}
                      {onDeletePublication && (
                        <Button
                          onClick={() => onDeletePublication(index)}
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:text-red-600 hover:bg-red-500/10 p-1.5 h-8 w-8"
                          title="Delete publication"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-sm">No publications added.</p>
            <p className="text-xs mt-1">Add your research papers and articles to showcase your academic work.</p>
          </div>
        )}
      </div>
    </BaseSection>
  )
}

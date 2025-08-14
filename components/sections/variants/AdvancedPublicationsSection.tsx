"use client"

import { useState } from "react"
import { FileText, Edit, Trash2, Calendar, ExternalLink, BookOpen, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { User as UserType } from "@/types"
import { useTheme } from "@/context/ThemeContext"
import { getThemeClasses } from "@/utils/theme"
import BaseSection from "../BaseSection"

interface AdvancedPublicationsSectionProps {
  user: UserType
  isEditMode?: boolean
  onEdit?: () => void
  onDelete?: () => void
  onEditPublication?: (index: number) => void
  onDeletePublication?: (index: number) => void
  onAddPublication?: () => void
}

export default function AdvancedPublicationsSection({
  user,
  isEditMode = false,
  onEdit,
  onDelete,
  onEditPublication,
  onDeletePublication,
  onAddPublication
}: AdvancedPublicationsSectionProps) {
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
      title="Publications & Research"
      icon={<FileText className="w-5 h-5 text-[#10a37f]" />}
      isEditMode={isEditMode}
      onDelete={hasData ? onDelete : undefined}
      onAdd={isEditMode ? onAddPublication : undefined}
    >
      <div className="space-y-6">
        {hasData ? (
          user.publications.map((pub, index) => (
            <div 
              key={index} 
              className={`group/publication relative overflow-hidden rounded-2xl border-2 transition-all duration-500 ${
                isDark 
                  ? 'bg-gradient-to-br from-[#1a1a1a]/80 via-[#2a2a2a]/60 to-[#1a1a1a]/80 border-[#10a37f]/20 hover:border-[#10a37f]/40' 
                  : 'bg-gradient-to-br from-white/80 via-gray-50/60 to-white/80 border-[#10a37f]/15 hover:border-[#10a37f]/30'
              } backdrop-blur-sm hover:shadow-lg hover:shadow-[#10a37f]/10`}
            >
              {/* Publication Background Effects */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#10a37f]/5 to-transparent rounded-full blur-xl"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-[#0d8f6f]/5 to-transparent rounded-full blur-lg"></div>
              </div>
              
              <div className="relative z-10 p-6">
                <div className="flex items-start justify-between gap-6">
                  {/* Left side - Publication details */}
                  <div className="flex-1 min-w-0">
                    {/* Header with Publication Title and Publisher */}
                    <div className="mb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#10a37f]/20 to-[#0d8f6f]/20 rounded-xl shadow-lg backdrop-blur-sm">
                          <BookOpen className="w-6 h-6 text-[#10a37f]" />
                        </div>
                        <div>
                          <h3 className={`text-xl font-bold ${theme.text.primary} group-hover/publication:text-[#10a37f] transition-colors mb-1`}>
                            {pub.title}
                          </h3>
                          {pub.publisher && (
                            <p className="text-[#10a37f] font-semibold text-lg">
                              {pub.publisher}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Publication Description */}
                    {pub.description && (
                      <div className="mb-4">
                        <h4 className={`font-semibold ${theme.text.primary} mb-2 flex items-center gap-2`}>
                          <div className="w-1 h-4 bg-gradient-to-b from-[#10a37f] to-[#0d8f6f] rounded-full"></div>
                          Abstract
                        </h4>
                        <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                          {pub.description}
                        </p>
                      </div>
                    )}
                    
                    {/* Publication Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {pub.date && (
                        <div className={`flex items-center gap-3 p-3 rounded-xl ${
                          isDark ? 'bg-[#1a1a1a]/60 border border-[#10a37f]/20' : 'bg-white/60 border border-[#10a37f]/20'
                        }`}>
                          <div className="flex items-center justify-center w-8 h-8 bg-[#10a37f]/20 rounded-lg">
                            <Calendar className="w-4 h-4 text-[#10a37f]" />
                          </div>
                          <div>
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Publication Date</p>
                            <p className={`font-medium ${theme.text.primary}`}>{pub.date}</p>
                          </div>
                        </div>
                      )}
                      
                      {pub.url && (
                        <div className={`flex items-center gap-3 p-3 rounded-xl ${
                          isDark ? 'bg-[#1a1a1a]/60 border border-[#10a37f]/20' : 'bg-white/60 border border-[#10a37f]/20'
                        }`}>
                          <div className="flex items-center justify-center w-8 h-8 bg-[#10a37f]/20 rounded-lg">
                            <Globe className="w-4 h-4 text-[#10a37f]" />
                          </div>
                          <div>
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Access</p>
                            <a 
                              href={pub.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-[#10a37f] hover:text-[#0d8f6f] transition-colors font-medium"
                            >
                              <span>Read Publication</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Right side - Edit/Delete buttons */}
                  {isEditMode && (onEditPublication || onDeletePublication) && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {onEditPublication && (
                        <button
                          onClick={() => onEditPublication(index)}
                          className={`group/btn p-3 rounded-xl transition-all duration-300 ${
                            isDark 
                              ? 'bg-[#1a1a1a]/60 hover:bg-[#10a37f]/20 border border-[#10a37f]/20 hover:border-[#10a37f]/40' 
                              : 'bg-white/60 hover:bg-[#10a37f]/10 border border-[#10a37f]/15 hover:border-[#10a37f]/30'
                          } backdrop-blur-sm hover:scale-105 hover:shadow-lg`}
                          title="Edit publication"
                        >
                          <Edit className="w-4 h-4 text-[#10a37f] group-hover/btn:animate-pulse" />
                        </button>
                      )}
                      {onDeletePublication && (
                        <button
                          onClick={() => onDeletePublication(index)}
                          className={`group/btn p-3 rounded-xl transition-all duration-300 ${
                            isDark 
                              ? 'bg-[#1a1a1a]/60 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40' 
                              : 'bg-white/60 hover:bg-red-500/10 border border-red-300/20 hover:border-red-400/30'
                          } backdrop-blur-sm hover:scale-105 hover:shadow-lg`}
                          title="Delete publication"
                        >
                          <Trash2 className="w-4 h-4 text-red-400 group-hover/btn:animate-pulse" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <div className="relative">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#10a37f]/20 to-[#0d8f6f]/20 rounded-2xl flex items-center justify-center">
                <FileText className="w-10 h-10 text-[#10a37f]" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#10a37f]/30 rounded-full blur-sm"></div>
            </div>
            <h3 className={`text-lg font-semibold ${theme.text.primary} mb-2`}>
              No Publications Added
            </h3>
            <p className="text-sm mb-1">Add your research papers and articles to showcase your academic work.</p>
            <p className="text-xs">Include publications, research papers, and academic articles.</p>
          </div>
        )}
      </div>
    </BaseSection>
  )
}

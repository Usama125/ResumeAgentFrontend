"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, X, Check } from "lucide-react"
import { useTheme } from "@/context/ThemeContext"

export interface FilterState {
  is_looking_for_job?: boolean;
  locations: string[];
  professions: string[];
  skills: string[];
  minProfileScore?: number;
}

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface ExploreFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  availableOptions: {
    locations: FilterOption[];
    professions: FilterOption[];
    skills: FilterOption[];
  };
  className?: string;
}

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

function FilterSection({ title, children, defaultOpen = true, className = "" }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const { isDark } = useTheme()

  return (
    <div className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between py-4 px-1 text-left transition-colors ${
          isDark ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-gray-900'
        }`}
      >
        <span className="font-semibold text-sm text-left lg:text-center">{title}</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>
      {isOpen && (
        <div className="pb-4 px-1">
          {children}
        </div>
      )}
    </div>
  )
}

interface MultiSelectFilterProps {
  options: FilterOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  showMore?: boolean;
  maxVisible?: number;
  searchPlaceholder?: string;
}

function MultiSelectFilter({ options, selected, onChange, showMore = true, maxVisible = 5, searchPlaceholder = "Search..." }: MultiSelectFilterProps) {
  const [showAll, setShowAll] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const { isDark } = useTheme()
  
  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  const visibleOptions = showAll || !showMore ? filteredOptions : filteredOptions.slice(0, maxVisible)
  const hasMore = filteredOptions.length > maxVisible

  const handleToggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value))
    } else {
      onChange([...selected, value])
    }
  }

  return (
    <div className="space-y-2">
      {/* Search input for filtering options */}
      {options.length > 5 && (
        <div className="mb-3">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors ${
              isDark 
                ? 'bg-[#2f2f2f] border-gray-600 text-white placeholder-gray-400 focus:border-[#10a37f]' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#10a37f]'
            } focus:outline-none focus:ring-1 focus:ring-[#10a37f]/20`}
          />
        </div>
      )}
      
      {visibleOptions.map((option) => (
        <label key={option.value} className="flex items-center space-x-3 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              checked={selected.includes(option.value)}
              onChange={() => handleToggle(option.value)}
              className="sr-only"
            />
            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
              selected.includes(option.value)
                ? 'bg-[#10a37f] border-[#10a37f]'
                : isDark 
                  ? 'border-gray-500 group-hover:border-gray-400' 
                  : 'border-gray-300 group-hover:border-gray-400'
            }`}>
              {selected.includes(option.value) && (
                <Check className="w-3 h-3 text-white" />
              )}
            </div>
          </div>
          <div className="flex items-center justify-between flex-1">
            <span className={`text-sm transition-colors ${
              isDark ? 'text-gray-300 group-hover:text-white' : 'text-gray-600 group-hover:text-gray-900'
            }`}>
              {option.label}
            </span>
            {option.count !== undefined && (
              <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                {option.count}
              </span>
            )}
          </div>
        </label>
      ))}
      
      {showMore && hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className={`text-xs font-medium transition-colors ${
            isDark ? 'text-[#10a37f] hover:text-[#0d8f6f]' : 'text-[#10a37f] hover:text-[#0d8f6f]'
          }`}
        >
          {showAll ? `Show less` : `Show more values (${filteredOptions.length - maxVisible})`}
        </button>
      )}
      
      {/* Show message when search has no results */}
      {searchTerm && filteredOptions.length === 0 && (
        <div className={`text-xs text-center py-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          No options found for "{searchTerm}"
        </div>
      )}
    </div>
  )
}

export default function ExploreFilters({ 
  filters, 
  onFiltersChange, 
  availableOptions,
  className = ""
}: ExploreFiltersProps) {
  const { isDark } = useTheme()
  const [localFilters, setLocalFilters] = useState<FilterState>(filters)

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  // Apply filters with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onFiltersChange(localFilters)
    }, 300) // 300ms debounce

    return () => clearTimeout(timeoutId)
  }, [localFilters, onFiltersChange])

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearAllFilters = () => {
    const clearedFilters: FilterState = {
      locations: [],
      professions: [],
      skills: [],
    }
    setLocalFilters(clearedFilters)
  }

  const hasActiveFilters = Object.values(localFilters).some(value => {
    if (Array.isArray(value)) return value.length > 0
    return value !== undefined
  })

  return (
    <div className={`${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Filters
        </h2>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className={`text-sm font-medium transition-colors ${
              isDark ? 'text-[#10a37f] hover:text-[#0d8f6f]' : 'text-[#10a37f] hover:text-[#0d8f6f]'
            }`}
          >
            Clear all
          </button>
        )}
      </div>

      {/* Job Availability Filter */}
      <FilterSection title="Open For Work">
        <div className="space-y-2">
          <label className="flex items-center space-x-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={localFilters.is_looking_for_job === true}
                onChange={(e) => updateFilter('is_looking_for_job', e.target.checked ? true : undefined)}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                localFilters.is_looking_for_job === true
                  ? 'bg-[#10a37f] border-[#10a37f]'
                  : isDark 
                    ? 'border-gray-500 group-hover:border-gray-400' 
                    : 'border-gray-300 group-hover:border-gray-400'
              }`}>
                {localFilters.is_looking_for_job === true && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>
            </div>
            <span className={`text-sm transition-colors ${
              isDark ? 'text-gray-300 group-hover:text-white' : 'text-gray-600 group-hover:text-gray-900'
            }`}>
              Available for new opportunities
            </span>
          </label>
        </div>
      </FilterSection>

      {/* Location Filter */}
      <FilterSection title="Location">
        <MultiSelectFilter
          options={availableOptions.locations}
          selected={localFilters.locations}
          onChange={(selected) => updateFilter('locations', selected)}
          searchPlaceholder="Search locations..."
        />
      </FilterSection>

      {/* Profession Filter */}
      <FilterSection title="Profession">
        <MultiSelectFilter
          options={availableOptions.professions}
          selected={localFilters.professions}
          onChange={(selected) => updateFilter('professions', selected)}
          searchPlaceholder="Search professions..."
        />
      </FilterSection>

      {/* Skills Filter */}
      <FilterSection title="Skills">
        <MultiSelectFilter
          options={availableOptions.skills}
          selected={localFilters.skills}
          onChange={(selected) => updateFilter('skills', selected)}
          maxVisible={8}
          searchPlaceholder="Search skills..."
        />
      </FilterSection>

      {/* Profile Score Filter */}
      <FilterSection title="Profile Score">
        <div className="space-y-3">
          <div className="space-y-2">
            {[
              { min: 80, label: "80+ (Excellent)", color: "text-green-600" },
              { min: 60, label: "60+ (Good)", color: "text-yellow-600" },
              { min: 40, label: "40+ (Fair)", color: "text-orange-600" },
              { min: 0, label: "All scores", color: isDark ? "text-gray-300" : "text-gray-600" }
            ].map(({ min, label, color }) => (
              <label key={min} className="flex items-center space-x-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="radio"
                    name="profileScore"
                    checked={localFilters.minProfileScore === min || (min === 0 && localFilters.minProfileScore === undefined)}
                    onChange={() => updateFilter('minProfileScore', min === 0 ? undefined : min)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                    (localFilters.minProfileScore === min || (min === 0 && localFilters.minProfileScore === undefined))
                      ? 'bg-[#10a37f] border-[#10a37f]'
                      : isDark 
                        ? 'border-gray-500 group-hover:border-gray-400' 
                        : 'border-gray-300 group-hover:border-gray-400'
                  }`}>
                    {(localFilters.minProfileScore === min || (min === 0 && localFilters.minProfileScore === undefined)) && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                </div>
                <span className={`text-sm transition-colors ${color} ${
                  isDark ? 'group-hover:brightness-125' : 'group-hover:brightness-90'
                }`}>
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </FilterSection>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-6 pt-4">
          <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
            Active Filters
          </h3>
          <div className="flex flex-wrap gap-2">
            {localFilters.is_looking_for_job && (
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                isDark ? 'bg-[#10a37f]/20 text-[#10a37f]' : 'bg-[#10a37f]/10 text-[#10a37f]'
              }`}>
                Open For Work
                <button onClick={() => updateFilter('is_looking_for_job', undefined)}>
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            
            {localFilters.locations.map(location => (
              <div key={location} className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                isDark ? 'bg-[#10a37f]/20 text-[#10a37f]' : 'bg-[#10a37f]/10 text-[#10a37f]'
              }`}>
                {location}
                <button onClick={() => updateFilter('locations', localFilters.locations.filter(l => l !== location))}>
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            
            {localFilters.professions.map(profession => (
              <div key={profession} className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                isDark ? 'bg-[#10a37f]/20 text-[#10a37f]' : 'bg-[#10a37f]/10 text-[#10a37f]'
              }`}>
                {profession}
                <button onClick={() => updateFilter('professions', localFilters.professions.filter(p => p !== profession))}>
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            
            {localFilters.skills.map(skill => (
              <div key={skill} className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                isDark ? 'bg-[#10a37f]/20 text-[#10a37f]' : 'bg-[#10a37f]/10 text-[#10a37f]'
              }`}>
                {skill}
                <button onClick={() => updateFilter('skills', localFilters.skills.filter(s => s !== skill))}>
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            
            {localFilters.minProfileScore !== undefined && (
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                isDark ? 'bg-[#10a37f]/20 text-[#10a37f]' : 'bg-[#10a37f]/10 text-[#10a37f]'
              }`}>
                Score: {localFilters.minProfileScore}+
                <button onClick={() => updateFilter('minProfileScore', undefined)}>
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}